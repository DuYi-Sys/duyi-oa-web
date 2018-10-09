import axios from 'axios';
import router from '@/router'
import store from '@/store'
import jwtUtils from '@/services/commons/jwtUtils'
axios.interceptors.request.use(
	config => {
		if(jwtUtils.getToken()) {

			config.headers.Authorization = `Bearer ${jwtUtils.getToken()}`;
		}
		return config;
	},
	err => {
		return Promise.reject(err);
	});
axios.interceptors.response.use(
	response => {
		if(response.headers.token) {
			jwtUtils.saveToken(response.headers.token);
		}
		return response;
	},
	error => {

		if(error.response) {
			switch(error.response.status) {
				case 401:
					if(router.currentRoute.fullPath != '/login') {
						router.push({
							path: '/login'
						})
					}

					break;
				case 403:
					if(router.currentRoute.fullPath != '/login') {
						router.push({
							path: '/login'
						})
					}

					break;
			}
		}
		return Promise.reject(error.response)
	});

let base = ""
export const getDatas = (url, params) => {
	return axios.get(base + url, {
		params: params
	})
}
export const addData = (url, data, params) => {
	return axios.post(base + url, data, {
		params: params
	})
}
export const getData = (url, params) => {
	return axios.get(base + url, {
		params: params
	})
}
export const updateData = (url, data, params) => {
	return axios.put(base + url, data, {
		params: params
	})
}
export const deleteData = (url, params) => {
	return axios.delete(base + url, {
		params: params
	})
}
export const requestLogin = params => { 
	 return axios.post(`${base}/api/adminlogin`,null,{
		params: params
	})
};