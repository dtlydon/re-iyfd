const ObjectId = require('mongodb').ObjectID;
const iyfdDb = require('../../common/iyfd-db');

let accountCollection;

const init = async () => {
  accountCollection = await iyfdDb.getCollection('accounts');
};

const initialize = init();

const createAccount = async (email, password) => {
  await initialize;
  const results = await accountCollection.insertOne({
    email,
    password,
    role: 0,
    users: [],
  });
  const id = results.ops[0]._id;
  return {
    email,
    id
  };
};

const getAccountByEmail = async (email) => {
  await initialize;
  return accountCollection.findOne({
    email
  });
};

const getAccountById = async (id) => {
  await initialize;
  return accountCollection.findOne({
    _id: ObjectId(id)
  });
};

const updateUsersById = async (users, id) => {
  await initialize;
  const updateQuery = {
    _id: ObjectId(id)
  };
  const values = {
    $set: {
      users
    }
  };
  const result = await accountCollection.updateOne(updateQuery, values);
  return result;
};

const getAllAccounts = async () => {
  await initialize;
  return accountCollection.find({}).toArray();
};

const updateResetToken = async (id, tokens) => {
  await initialize;
  return accountCollection.updateOne({
    _id: id
  }, {
    $set: tokens
  });
}

const resetPassword = async (id, password) => {
  await initialize;
  return accountCollection.updateOne({
    _id: ObjectId(id)
  }, {
    $set: {
      password,
      resetToken: null
    }
  });
};

module.exports = {
  createAccount,
  getAccountByEmail,
  getAccountById,
  updateUsersById,
  getAllAccounts,
  updateResetToken,
  resetPassword
};
