import React, { useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import Configuration from "../../common/configuration";
import { Nav } from "react-bootstrap";
import configuration from "../../common/configuration";
import accountService from "../../services/accountService";

const Admin: React.FC = () => {
  const [role, setRole] = useState<number>(1);
  const history = useHistory();
  const onNavigate = (eventKey: any) => {
    history.push(eventKey);
  };
  const accountToken = localStorage.getItem(
    configuration.localStorageKeys.accountToken
  );

  useEffect(() => {
    if (!accountToken) return;
    const loadAccount = async () => {
      const data = await accountService.getAccount();
      if (!data) return;
      const account = data.account;
      setRole(account.role);
    };
    loadAccount();
  }, [accountToken]);
  return (
    <div className="d-flex flex-column flex-medium-row">
      <Nav variant="pills" className="flex-column mr-2">
        {Configuration.adminRoutes
          .filter(x => x.isBobRoute || role > 1)
          .map(({ path, label }) => (
            <Nav.Item>
              <Nav.Link eventKey={path} key={path} onSelect={onNavigate}>
                {label}
              </Nav.Link>
            </Nav.Item>
          ))}
      </Nav>
      {Configuration.adminRoutes
        .filter(x => x.isBobRoute || role > 1)
        .map(({ path, component, isExact }) => (
          <Route exact={isExact} key={path} path={path} component={component} />
        ))}
    </div>
  );
};

export default Admin;
