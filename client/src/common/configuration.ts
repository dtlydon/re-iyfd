import HomePage from "../components/homePage/homePage";
import History from "../components/homePage/history";
import Play from "../components/play/play";
import Score from "../components/score/score";
import Admin from "../components/admin/admin";
import Entry from "../components/admin/entry";
import MatchUps from "../components/admin/matchups";
import Users from "../components/admin/users";
import AudioHelper from "../components/admin/audioHelper";
import Login from "../components/account/login";
import Register from "../components/account/register";
import UserPlay from "../components/play/userPlay";
import SetPassword from "../components/account/setPassword";

interface RouteContents {
  path: string;
  component: React.FC<any>; // TODO: Figure out how to force this to be React.FC<T>
  isExact?: boolean;
  label?: string;
  loginReq?: boolean;
  adminReq?: boolean;
  hideFromMenu?: boolean;
  isBobRoute?: boolean;
}

const routeContents: RouteContents[] = [
  { label: "Home", path: "/", component: HomePage, isExact: true },
  { label: "History", path: "/history", component: History },
  {
    label: "Play",
    path: "/play",
    component: Play,
    loginReq: true,
    isExact: true
  },
  {
    label: "User Play",
    path: "/play/:userId",
    component: UserPlay,
    loginReq: true,
    isExact: true
  },
  { label: "Score", path: "/score", component: Score },
  { label: "Admin", path: "/admin", component: Admin, adminReq: true },
  {
    label: "Login",
    path: "/account/login",
    component: Login,
    isExact: true,
    hideFromMenu: true
  },
  {
    label: "Register",
    path: "/account/register",
    component: Register,
    isExact: true,
    hideFromMenu: true
  },
  {
    label: "Set Password",
    path: "/account/set-password",
    component: SetPassword,
    isExact: true,
    hideFromMenu: true
  }
];

const accountRoutes: RouteContents[] = [];

const adminRoutes: RouteContents[] = [
  { label: "Entries", path: "/admin/entry", component: Entry, isExact: true },
  {
    label: "MatchUps",
    path: "/admin/matchups",
    component: MatchUps,
    isExact: true
  },
  { label: "Users", path: "/admin/users", component: Users, isExact: true },
  {
    label: "Audio",
    path: "/admin/audio",
    component: AudioHelper,
    isExact: true,
    isBobRoute: true
  }
];

const localStorageKeys = {
  accountToken: "IYFD_JWT"
};

export default {
  routeContents,
  adminRoutes,
  accountRoutes,
  localStorageKeys
};
