import axios, { AxiosResponse } from 'axios';
import urlHelper from '../common/urlHelper';

interface User {
	Username: string,
	Role: string
}
const userApi = `${urlHelper.serviceUrl}/api/user`;

function setUser(response: AxiosResponse<User>): void {
	if(response && response.headers && response.data){
		const token: string | null = response.headers.token;
		if(token != null){
			const user: User = response.data;
			localStorage.setItem('token', token);
			localStorage.setItem('username', user.Username);
			localStorage.setItem('role', user.Role);
		}
	}
}
async function login(username: string, password: string): Promise<boolean> {
	try {
		const response: AxiosResponse<User> = await axios.post(`${userApi}/login`, {username, password});
		setUser(response);
		return true;
	} catch (err) {
		console.error(err);
	}
	return false;
}

async function register(username: string, password: string, firstName: string, lastName: string, email:string): Promise<boolean> {
	try {
		const response: AxiosResponse<User> = await axios.post(`${userApi}/register`, {username, password, firstName, lastName, email});
		setUser(response);
		return true;
	} catch (err) {
		console.error(err);
	}
	return false;
}

export default {
	login,
	register
}