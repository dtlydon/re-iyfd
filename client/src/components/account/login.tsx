import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import PubSub from 'pubsub-js';
import userService from '../../services/userService';
import Messages from '../../common/messages';

const Login: React.FC = () => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

	function onUsernameChange(event: React.ChangeEvent<HTMLInputElement>): void {
		setUsername(event.target.value);
	}
	function onPasswordChange(event: React.ChangeEvent<HTMLInputElement>): void {
		setPassword(event.target.value);

	}
	async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();
		event.stopPropagation();
		const isLoggedIn = await userService.login(username, password);
		if (!isLoggedIn) {
			console.error('Fix up validation for login');
			return;
		}
		setIsLoggedIn(isLoggedIn);
	}
	if (isLoggedIn) {
		PubSub.publish(Messages.login, "success");
		return <Redirect to={"/home"} />
	}
	return (
		<div>
			<div className="row">
				<div className="col-sm-6 col-sm-offset-3">
					<h2>Login</h2>
				</div>
			</div>
			<form onSubmit={onSubmit}>
				<div className="row form-group">
					<div className="col-sm-6 col-sm-offset-3">
						<label>Username</label>
						<input id="username" name="username" onChange={onUsernameChange} value={username} />
					</div>
				</div>
				<div className="row form-group">
					<div className="col-sm-6 col-sm-offset-3">
						<label>Password</label>
						<input id="password" name="password" className="form-control" type="password" onChange={onPasswordChange} value={password} />
					</div>
				</div>
				<div className="row form-group" style={{marginTop: '30px'}}>
					<div className="col-sm-6 col-sm-offset-3 text-right">
						<button type="submit" className="btn btn-primary">Login</button>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-6 col-sm-offset-3">
						<ul className="list-unstyled">
							<li><Link to="/account/register">Register</Link></li>
						</ul>
					</div>
				</div>
			</form>
	</div>
	)
}

export default Login;
