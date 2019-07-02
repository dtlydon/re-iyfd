import axios from "axios";

async function get(url: string): Promise<any> {
	return axios({
		method: 'GET',
		headers: localStorage.getItem('token'),
		url
	});
}

async function post(url: string, data: any): Promise<any> {
	try {
		return axios.post(url, data, {
			headers: localStorage.getItem('token')
		});
	} catch(e) {
		console.error(e);
	}
}

async function put(url: string, data: any): Promise<any> {
	return axios({
		method: 'PUT',
		headers: localStorage.getItem('token'),
		url,
		data
	});
}

export default {
	get,
	post,
	put
}