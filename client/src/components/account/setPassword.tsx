import React, { useState, FormEvent } from "react";
import { Row, Col, Form, Alert, Button } from "react-bootstrap";
import { useHistory, useLocation, Redirect } from "react-router";
import accountService from "../../services/accountService";

const SetPassword = () => {
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");
  const resetToken = query.get("resetToken");
  const history = useHistory();
  const [newPassword, setNewPassword] = useState<string>();
  const [message, setMessage] = useState<string>();
  if (!email || !resetToken) {
    return <Redirect to="/" />;
  }
  const setPassword = async () => {
    if (!email || !resetToken || !newPassword) return;
    await accountService.setPassword(email, resetToken, newPassword);
    setMessage("Password reset... You will now redirect to the home page");
    setTimeout(() => history.push("/"), 1000);
  };
  return (
    <Row>
      <Col xs={{ span: 6, offset: 3 }}>
        {!!message && <Alert variant="success">{message}</Alert>}
        <Form>
          <Form.Group id="register-email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} disabled={true} />
          </Form.Group>
          <Form.Group id="register-password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(event: FormEvent<HTMLInputElement>) =>
                setNewPassword(event.currentTarget.value)
              }
            />
          </Form.Group>
          <Button variant="primary" onClick={setPassword}>
            Set Password
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default SetPassword;
