import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import Configuration from "./common/configuration";
import { Navbar, Nav, Container } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/account/login";
import configuration from "./common/configuration";
import accountService from "./services/accountService";
import "./App.scss";

interface IYFDNavbarProps {
  showLogin: () => void;
  accountEmail: string;
  isAdmin: boolean;
  onLogout: () => void;
}

const IYFDNavbar: React.FC<IYFDNavbarProps> = (props: IYFDNavbarProps) => {
  const { showLogin, accountEmail, isAdmin, onLogout } = props;
  const history = useHistory();
  const onNavSelected = (eventKey: any) => history.push(eventKey);
  const onLoginSelect = () => showLogin();
  const logout = () => {
    localStorage.removeItem(configuration.localStorageKeys.accountToken);
    history.push("/");
    onLogout();
  };
  return (
    <Navbar variant="dark" bg="primary" expand="lg">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Brand href="/">IYFD 39</Navbar.Brand>
      <Navbar.Collapse id="iyfd-nav">
        <Nav className="mr-auto">
          {!!accountEmail && (
            <Nav.Link onSelect={onNavSelected} eventKey="/play">
              Play
            </Nav.Link>
          )}
          <Nav.Link onSelect={onNavSelected} eventKey="/score">
            Scoreboard
          </Nav.Link>
          <Nav.Link onSelect={onNavSelected} eventKey="/history">
            History
          </Nav.Link>
          {isAdmin && (
            <Nav.Link onSelect={onNavSelected} eventKey="/admin">
              Admin
            </Nav.Link>
          )}
        </Nav>
        <Nav>
          {!!accountEmail && (
            <Nav.Link eventKey="play" onSelect={onNavSelected}>
              {accountEmail}
            </Nav.Link>
          )}
          {!!accountEmail && (
            <Nav.Link eventKey="logout" onSelect={logout}>
              Logout
            </Nav.Link>
          )}
          {!accountEmail && (
            <Nav.Link eventKey="login" onSelect={onLoginSelect}>
              Login
            </Nav.Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const App: React.FC = () => {
  const [shouldShowLogin, setShouldShowLogin] = useState<boolean>(false);
  const [accountEmail, setAccountEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const accountToken = localStorage.getItem(
    configuration.localStorageKeys.accountToken
  );

  const onLogout = () => {
    setAccountEmail("");
    setIsAdmin(false);
  };
  useEffect(() => {
    if (!accountToken) return;
    const loadAccount = async () => {
      const data = await accountService.getAccount();
      if (!data) return;
      const account = data.account;
      setAccountEmail(account.email);
      setIsAdmin(account.role >= 1);
    };
    loadAccount();
  }, [accountToken]);
  return (
    <div className="re-iyfd">
      <Router>
        <IYFDNavbar
          showLogin={() => setShouldShowLogin(true)}
          accountEmail={accountEmail}
          isAdmin={isAdmin}
          onLogout={onLogout}
        />
        <Login
          show={shouldShowLogin}
          onHide={() => setShouldShowLogin(false)}
        />
        <audio
          className="float-right"
          style={{ height: "30px" }}
          src={`${
            process.env.REACT_APP_SERVER_URL
          }/announcement?c=${Date.now()}}`}
          controls
          autoPlay
        >
          Not supported
        </audio>
        <Container className="mt-5">
          {Configuration.routeContents.map(({ path, component, isExact }) => (
            <Route
              exact={isExact}
              key={path}
              path={path}
              component={component}
            />
          ))}
        </Container>
      </Router>
    </div>
  );
};

export default App;
