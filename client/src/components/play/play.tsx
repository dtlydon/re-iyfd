import React, { useEffect, useState, FormEvent } from "react";
import configuration from "../../common/configuration";
import accountService from "../../services/accountService";
import { Nav, Button, Modal, Form, Spinner } from "react-bootstrap";
import { useHistory } from "react-router";

interface User {
  id: string;
  user: string;
}

const Play: React.FC = () => {
  const accountToken = localStorage.getItem(
    configuration.localStorageKeys.accountToken
  );
  const [users, setUsers] = useState<User[]>([]);
  const [showUserAddModal, setShowUserAddModal] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>("");
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);

  const history = useHistory();
  const loadUsers = async () => {
    const data = await accountService.getAccount();
    if (!data) return;
    setUsers(data.account.users);
  };
  useEffect(() => {
    if (!accountToken) {
      history.push('/account/register')
      return;
    }
    loadUsers();
  }, [accountToken, users, history]);

  const onNavigate = (eventKey: any) => {
    history.push(`/play/${eventKey}`);
  };
  const addNewUser = async () => {
    setIsAddingUser(true);
    await accountService.addUsers([newUserName]);
    setNewUserName("");
    await loadUsers();
    setIsAddingUser(false);
    setShowUserAddModal(false);
  };
  const onNewUserNameChange = (event: FormEvent<HTMLInputElement>) =>
    setNewUserName(event.currentTarget.value);
  return (
    <div className="play">
      <h2>Users</h2>
      <Nav className="flex-column">
        {users.map(u => (
          <Nav.Link key={u.id} eventKey={u.id} onSelect={onNavigate}>
            {u.user}
          </Nav.Link>
        ))}
      </Nav>
      <Button variant="primary" onClick={() => setShowUserAddModal(true)}>
        Add User
      </Button>
      <Modal show={showUserAddModal} onHide={() => setShowUserAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>User</Form.Label>
              <Form.Control
                type="string"
                placeholder="Username"
                value={newUserName}
                onChange={onNewUserNameChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={addNewUser}>
            {isAddingUser ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              "Save"
            )}
          </Button>
          <Button variant="danger" onClick={() => setShowUserAddModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Play;
