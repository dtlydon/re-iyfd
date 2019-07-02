import React, {useState, useEffect} from 'react';
import { Link, Redirect } from "react-router-dom";
import pubsub from 'pubsub-js';
import Messages from '../..//common/messages';
import Configuration from '../../common/configuration';

const NavbarContents: React.FC = () => {
	const [username, setUsername] = useState<string>(localStorage.getItem('username') || '');
	const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
	useEffect(() => {
		const loginSubscription = pubsub.subscribe(Messages.login, () => {
			const storedUsername: string | null = localStorage.getItem('username');
			if (storedUsername == null) {
				console.error('Log in didn\'t set username');
				return;
			}
			setUsername(String(storedUsername));
		})
		return function(): void {
			pubsub.unsubscribe(loginSubscription);
		}
	}, [])
	function renderUsernameOrLogin(): any {
		if (username === '') {
			return <Link to="/account/login">Login</Link>;
		}
		return <span>{username}</span>
	}
	function logout(): void {
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		localStorage.removeItem('role');
		setUsername('');
		setIsLoggingOut(true);
	}
	const token = localStorage.getItem('token');
	const role = localStorage.getItem('role')
	// TODO: Figure out how to expose interfaces globally
	function filterRoutes(route: any) {
		return !route.hideFromMenu && (
			!route.loginReq || token != null
		) && (
			!route.adminReq || (role != null && parseInt(role) > 0)
		)
	}
	if (isLoggingOut) {
		return <Redirect to={"/home"} />
	}
	return (
		<div id="navbar" className="navbar-collapse">
			<ul className="nav navbar-nav">
			{
				Configuration.routeContents.filter(filterRoutes).map(({path, label}) => <li><Link key={path} to={path}>{label}</Link></li>)
			}
			</ul>
			<ul className="nav navbar-nav navbar-right">
				<li>{renderUsernameOrLogin()}</li>
				{username !== '' && <li><a href='' onClick={logout}>Logout</a></li>}
            </ul>
		</div>
	);
}

export default NavbarContents;
