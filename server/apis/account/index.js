const jws = require("jws");
const bcryptjs = require("bcryptjs");
const fs = require("fs");
const _ = require("lodash");
const {
  uuid
} = require("uuidv4");
const moment = require("moment");
const mailgun = require("mailgun-js");
const ObjectId = require("mongodb").ObjectID;
const {
  checkRequiredField,
  sendError
} = require("../../common/responseHelper");
const {
  createAccount,
  getAccountByEmail,
  getAccountById,
  updateUsersById,
  getAllAccounts,
  updateResetToken,
  resetPassword
} = require("./repo");

const baseRoute = "/account";

const secret = fs.readFileSync("./cert.pem", "utf8");
// const secret = process.env.JWT_SECRET;
console.log('secret', secret);

const EMAIL_API_KEY = process.env.EMAIL_API_KEY;
const EMAIL_URL = "inyourfacedisgrace.com";

const _createToken = (email, id, role, users) => {
  const token = jws.sign({
    header: {
      alg: "RS256"
    },
    payload: JSON.stringify({
      id,
      email,
      role,
      users
    }),
    secret
  });
  return token;
};

const _accountToWire = account =>
  _.omit(account, ["_id", "password", "resetToken"]);

const login = async (req, res) => {
  const {
    body
  } = req;
  const validated =
    checkRequiredField(body.email, "Email", res) &&
    checkRequiredField(body.password, "Password", res);
  if (!validated) return;
  const account = await getAccountByEmail(body.email);
  if (!account || !(await bcryptjs.compare(body.password, account.password))) {
    console.log("err");
    sendError(res, "Invalid email or password");
    return;
  }
  const token = _createToken(
    account.email,
    account._id,
    account.role,
    account.users
  );
  res.send({
    token
  });
  res.end();
};

const refreshToken = async (req, res, t) => {
  const account = await getAccountById(t.id);
  const token = _createToken(
    account.email,
    account._id,
    account.role,
    account.users
  );
  res.send({
    token
  });
  res.end();
};

const register = async (req, res) => {
  const {
    body
  } = req;
  const validated =
    checkRequiredField(body.password, "Password", res) &&
    checkRequiredField(body.email, "Email", res);
  if (!validated) return;

  const existingAccount = await getAccountByEmail(body.email);
  if (!!existingAccount) {
    sendError(res, "User already exists");
    return;
  }
  const encryptedPass = await bcryptjs.hash(body.password, 10);
  const account = await createAccount(body.email, encryptedPass);
  const token = _createToken(account.email, account.id, 0);
  res.send({
    token
  });
  res.end();
};

const addUser = async (req, res, token) => {
  const {
    body
  } = req;
  const validated = checkRequiredField(body.user, "User", res);
  if (!validated) return;
  const account = await getAccountById(token.id);
  const users = account.users || [];
  users.push({
    id: new ObjectId(),
    user: body.user
  });
  await updateUsersById(users, token.id);
  const newToken = _createToken(
    account.email,
    account._id,
    account.role,
    users
  );
  res.send({
    token: newToken
  });
  res.end();
};

const addUsers = async (req, res, token) => {
  const {
    body
  } = req;
  const validated = checkRequiredField(body.users, "Users", res);
  if (!validated) return;
  const account = await getAccountById(token.id);
  let users = account.users || [];
  users = [
    ...users,
    ...body.users.map(user => ({
      id: new ObjectId(),
      user
    }))
  ];
  await updateUsersById(users, token.id);
  const newToken = _createToken(
    account.email,
    account._id,
    account.role,
    users
  );
  res.send({
    token: newToken
  });
  res.end();
};

const getAccount = async (req, res, token) => {
  const account = await getAccountById(token.id);
  res.send({
    account: _accountToWire(account)
  });
  res.end();
};

const getAll = async (req, res) => {
  const accounts = await getAllAccounts();
  res.send({
    accounts: accounts.map(_accountToWire)
  });
  res.end();
};

const _sendEmail = async data => {
  var sender = mailgun({
    apiKey: EMAIL_API_KEY,
    domain: EMAIL_URL
  });
  return new Promise((resolve, reject) => {
    console.log("emailing...");
    sender.messages().send(data, (error, body) => {
      if (!!error) {
        console.log("emailing error", error);
        reject(error);
      } else {
        console.log("email success", body);
        resolve();
      }
    });
  });
};

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  const existingAccount = await getAccountByEmail(email);
  if (!!existingAccount) {
    const resetToken = uuid();
    const resetTokenExpiration = moment()
      .add(1, "day")
      .toDate();
    await updateResetToken(existingAccount._id, {
      resetToken,
      resetTokenExpiration
    });
    console.log("reset", {
      resetTokenExpiration,
      resetToken
    });

    const data = {
      from: "The Commish <commish@inyourfacedisgrace.com>",
      to: email,
      subject: "Password reset",
      text: `Follow this link to reset your password: ${process.env.WEB_APP_URL}/account/set-password?email=${encodeURIComponent(email)}&resetToken=${resetToken}`
    };
    console.log("data", data);
    await _sendEmail(data);
  }
  res.sendStatus(201);
};

const setPassword = async (req, res) => {
  const {
    email,
    token,
    newPassword
  } = req.body;
  const existingAccount = await getAccountByEmail(email);
  console.log("exist", existingAccount._id);
  if (
    !!existingAccount &&
    existingAccount.resetToken === token &&
    existingAccount.resetTokenExpiration > Date.now()
  ) {
    const encryptedPass = await bcryptjs.hash(newPassword, 10);
    await resetPassword(existingAccount._id, encryptedPass);
    res.sendStatus(201);
    return;
  }
  res.sendStatus(404);
};

const routes = [{
    method: "post",
    path: "/login",
    handler: login
  },
  {
    method: "post",
    path: "/register",
    handler: register
  },
  {
    method: "get",
    path: "/refresh",
    handler: refreshToken,
    role: 0
  },
  {
    method: "post",
    path: "/add-users",
    handler: addUsers,
    role: 0
  },
  {
    method: "post",
    path: "/add-user",
    handler: addUser,
    role: 0
  },
  {
    method: "get",
    path: "/",
    handler: getAccount,
    role: 0
  },
  {
    method: "get",
    path: "/all",
    handler: getAll,
    role: 2
  },
  {
    method: "post",
    path: "/forgot-password",
    handler: forgotPassword
  },
  {
    method: "post",
    path: "/set-password",
    handler: setPassword
  }
];

module.exports = {
  baseRoute,
  routes
};
