import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import accountService from "../../services/accountService";
import { useHistory } from "react-router";

interface IYFDUser {
  id: string;
  user: string;
}

interface IYFDAccount {
  email: string;
  users: IYFDUser[];
}

const Users: React.FC = () => {
  const [accounts, setAccounts] = useState<IYFDAccount[]>([]);
  const history = useHistory();
  useEffect(() => {
    const loadAccounts = async () => {
      const { accounts } = await accountService.getAllAccounts();
      setAccounts(accounts);
    };
    loadAccounts();
  }, []);
  const goToPlay = (userId: string) => {
    history.push(`/play/${userId}`);
  };
  return (
    <div>
      <h2>Accounts</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr>
              <th>{account.email}</th>
              <th>
                {account.users.map(user => (
                  // <div>
                  <Button
                    className="d-block"
                    variant="link"
                    onClick={() => goToPlay(user.id)}
                  >
                    {user.user}
                  </Button>
                  // </div>
                ))}
              </th>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
