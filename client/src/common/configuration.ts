import Account from '../components/account/account';
import HomePage from '../components/homePage/homePage';
import History from '../components/homePage/history';
import Play from '../components/play/play';
import Score from '../components/score/score';
import Admin from '../components/admin/admin';
import Teams from '../components/admin/teams';
import Region from '../components/admin/regions';
import Entry from '../components/admin/entry';
import MatchUps from '../components/admin/matchups';
import Users from '../components/admin/users';
import Settings from '../components/admin/settings';
import Mimic from '../components/admin/mimic';
import AudioHelper from '../components/admin/audioHelper';
import Login from '../components/account/login';
import Register from '../components/account/register';

interface RouteContents {
	path: string,
	component: React.FC | any, // TODO: Figure out how to force this to be React.FC<T>
	isExact?: boolean,
	label?: string,
	loginReq?: boolean,
	adminReq?: boolean,
	hideFromMenu?: boolean
}

const routeContents: RouteContents[] = [
	{label: 'Home', path: "/", component: HomePage, isExact: true},
	{label: 'History', path: "/history", component: History},
	{label: 'Play', path: "/play", component: Play, loginReq: true,},
	{label: 'Score', path: "/score", component: Score},
	{label: 'Admin', path: "/admin", component: Admin, adminReq: true},
	{label: 'Login', path: "/account/login", component: Login, isExact: true, hideFromMenu: true},
	{label: 'Register', path: "/account/register", component: Register, isExact: true, hideFromMenu: true}
];

const accountRoutes: RouteContents[] = [
]

const adminRoutes: RouteContents[] = [
	{label: 'Teams', path: '/admin/teams', component: Teams, isExact: true},
	{label: 'Regions', path: '/admin/regions', component: Region, isExact: true},
	{label: 'Entries', path: '/admin/entry', component: Entry, isExact: true},
	{label: 'MatchUps', path: '/admin/matchups', component: MatchUps, isExact: true},
	{label: 'Users', path: '/admin/users', component: Users, isExact: true},
	{label: 'Settings', path: '/admin/settings', component: Settings, isExact: true},
	{label: 'Audio', path: '/admin/audio', component: AudioHelper, isExact: true}
];

export default {
	routeContents,
	adminRoutes,
	accountRoutes
};
