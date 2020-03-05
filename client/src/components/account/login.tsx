import React, { useState, FormEvent, Fragment } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { useHistory } from "react-router";
import configuration from "../../common/configuration";
import accountService from "../../services/accountService";

interface LoginProps {
  show: boolean;
  onHide: () => void;
}

const Login: React.FC<LoginProps> = (props: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);
  const history = useHistory();

  const login = async () => {
    try {
      const account = await accountService.login(email, password);
      localStorage.setItem(
        configuration.localStorageKeys.accountToken,
        account.token
      );
      setEmail("");
      setPassword("");
      setForgotPassword(false);
      history.push("/play");
      props.onHide();
    } catch (err) {
      setMessage("Invalid email and password combination");
    }
  };

  const goToRegister = () => {
    setForgotPassword(false);
    history.push("/account/register");
    props.onHide();
  };

  const onHideWrapper = () => {
    setForgotPassword(false);
    props.onHide();
  };

  const onEmailChange = (event: FormEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordChange = (event: FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };
  const resetPassword = async () => {
    await accountService.resetPassword(email);
    setEmail("");
    setForgotPassword(false);
    setResetEmailSent(true);
    setTimeout(() => setResetEmailSent(false), 3000);
  };
  const cta = !forgotPassword ? "Login" : "Reset password";
  return (
    <Modal show={props.show} onHide={onHideWrapper}>
      <Modal.Header closeButton>
        <Modal.Title>{cta}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {resetEmailSent && (
          <Alert variant="success">
            Check your email for instructions on resetting your password.
          </Alert>
        )}
        {!!message && <Alert variant="danger">{message}</Alert>}
        <Form>
          <Form.Group controlId="email-login">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={onEmailChange}
            />
          </Form.Group>
          {!forgotPassword && (
            <Fragment>
              <Form.Group className="mb-0" controlId="password-login">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={onPasswordChange}
                />
              </Form.Group>
              <Button
                style={{ fontSize: "0.875rem" }}
                className="pl-0"
                variant="link"
                onClick={() => setForgotPassword(true)}
              >
                Forgot Password?
              </Button>
            </Fragment>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => (!forgotPassword ? login() : resetPassword())}
        >
          {cta}
        </Button>
        <Button variant="outline-primary" onClick={onHideWrapper}>
          Close
        </Button>
        {!forgotPassword && (
          <Button variant="link" onClick={goToRegister}>
            Register
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default Login;
