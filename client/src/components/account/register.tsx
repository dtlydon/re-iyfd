import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import PubSub from 'pubsub-js';
import userService from '../../services/userService';
import Messages from '../../common/messages';

const Register: React.FC = () => {
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [isRegistered, setIsRegistered] = useState<boolean>(false);

	function onUsernameChange(event: React.ChangeEvent<HTMLInputElement>): void {
		setUsername(event.target.value);
	}
	function onPasswordChange(event: React.ChangeEvent<HTMLInputElement>): void {
		setPassword(event.target.value);
	}

	function onFirstNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
		setFirstName(event.target.value);
	}
	function onLastNameChange(event: React.ChangeEvent<HTMLInputElement>): void {
		setLastName(event.target.value);
	}

	function onEmailChange(event: React.ChangeEvent<HTMLInputElement>): void {
		setEmail(event.target.value);
	}
	async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<any> {
		event.preventDefault();
		event.stopPropagation();
		const isRegistered: boolean = await userService.register(username, password, firstName, lastName, email);

		if (!isRegistered) {
			console.error('Registration failed.  Handle validation');
			return;
		}
		setIsRegistered(isRegistered);
	}
	if (isRegistered) {
		PubSub.publish(Messages.login, "success");
		return <Redirect to={"/home"} />;
	}
	return (
		<div>
			<div className="row">
				<div className="col-sm-6 col-sm-offset-3">
					<h2>Register</h2>
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
				<div className="row form-group">
					<div className="col-sm-6 col-sm-offset-3">
						<label>First Name</label>
						<input id="first-name" name="firstName" className="form-control" type="text" onChange={onFirstNameChange} value={firstName} />
					</div>
				</div>
				<div className="row form-group">
					<div className="col-sm-6 col-sm-offset-3">
						<label>Last Name</label>
						<input id="last-name" name="lastName" className="form-control" type="text" onChange={onLastNameChange} value={lastName} />
					</div>
				</div>
				<div className="row form-group">
					<div className="col-sm-6 col-sm-offset-3">
						<label>Email</label>
						<input id="email" name="email" className="form-control" type="text" onChange={onEmailChange} value={email} />
					</div>
				</div>
				<div className="row form-group" style={{marginTop: '30px'}}>
					<div className="col-sm-6 col-sm-offset-3 text-right">
						<button type="submit" className="btn btn-primary">Register</button>
					</div>
				</div>
			</form>
	</div>
	)
}

export default Register;
