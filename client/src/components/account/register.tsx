import React, { FC, useState, FormEvent } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Add, Remove } from "@material-ui/icons";
import accountService from "../../services/accountService";
import configuration from "../../common/configuration";
import { useHistory } from "react-router";

const Register: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [users, setUsers] = useState<string[]>([""]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const isDisabled = !email || !password || !!users.includes("");
  const history = useHistory();
  const register = async () => {
    if (isDisabled) return;
    try {
      // Call create account
      const data = await accountService.register(email, password);
      if (!data.token) return;
      localStorage.setItem(
        configuration.localStorageKeys.accountToken,
        data.token
      );
    } catch (err) {
      setErrorMessage(err.response.data.error);
      return;
    }

    try {
      // Add users
      await accountService.addUsers(users);
      const refreshData = await accountService.refresh();
      if (!refreshData.token) return;
      localStorage.setItem(
        configuration.localStorageKeys.accountToken,
        refreshData.token
      );
      history.push("/play");
    } catch (err) {
      setErrorMessage(
        "An unknown error occured, but your account was created. Contact Dan at dtlydon@gmail.com"
      );
    }
  };
  const addUser = () => setUsers([...users, ""]);
  const removeUser = (i: number) => {
    const usersUpdate = users.map(x => x);
    usersUpdate.splice(i, 1);
    setUsers(usersUpdate);
  };
  const updateUser = (user: string, i: number) => {
    const usersUpdate = users.map(x => x);
    usersUpdate[i] = user;
    setUsers(usersUpdate);
  };
  const renderUserInput = (user: string, i: number) => (
    <Form.Group id={`user-input-${i}`} key={i}>
      <Form.Label>Username</Form.Label>
      <div className="d-flex">
        <Form.Control
          type="text"
          className="flex-grow-1"
          value={user}
          onChange={(event: FormEvent<HTMLInputElement>) =>
            updateUser(event.currentTarget.value, i)
          }
        />
        {i > 0 && (
          <Button onClick={() => removeUser(i)}>
            <Remove />
          </Button>
        )}
      </div>
    </Form.Group>
  );
  return (
    <Row>
      <Col xs={{ span: 6, offset: 3 }}>
        {!!errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form>
          <Form.Group id="register-email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(event: FormEvent<HTMLInputElement>) =>
                setEmail(event.currentTarget.value)
              }
            />
          </Form.Group>
          <Form.Group id="register-password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(event: FormEvent<HTMLInputElement>) =>
                setPassword(event.currentTarget.value)
              }
            />
          </Form.Group>
          {users.map(renderUserInput)}
          <div className="justify-content-end align-items-center d-flex">
            <span className="pr-2">More users? -></span>
            <Button onClick={addUser}>
              <Add />
            </Button>
          </div>
          <div>
            <Button onClick={register} disabled={isDisabled}>
              Register
            </Button>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default Register;
