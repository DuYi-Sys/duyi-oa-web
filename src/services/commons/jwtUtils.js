import store from '@/store'


export default{
	getUser :function(){
		return token2User(getToken());
	},
	getToken :function(){
		return getToken()
	},
	saveToken:function(token){
		if(token) {
			sessionStorage.token=token;
			store.dispatch('saveToken', token);
		}
	},
	clearToken:function(){
		store.dispatch('saveToken', '');
		sessionStorage.token=''
	}
	
}
function token2User(token){
	if(token) {
		let strs = token.split('.')
		let obj = JSON.parse(new Buffer(strs[1], 'base64').toString());
		let user={id:'',username:'',roles:[],menus:[],name:''}
		user.id = obj.sub;
		user.username = obj.username;
		user.roles = obj.roles;
//		for(let i = 0; i < obj.menus.length; i++) {
//			user.menus.push(obj.menus[i].path)
//		}
		user.name = obj.name;
		
		return user;
	}
	return null;
}
function getToken(){
	if (store.state.token){
		return store.state.token
	}else if(sessionStorage.token){
		store.state.token=sessionStorage.token;
		return sessionStorage.token;
	}else{
		return null;
	}
}