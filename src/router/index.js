import Vue from 'vue'
import Router from 'vue-router'
const Home=()=> import('@/pages/home')
import Roles from '@/pages/admin/roles'
import Operations from '@/pages/admin/operations'
import Users from '@/pages/admin/users'
import QuestionBank from '@/pages/oa/questionBank'
import StudentInfos from '@/pages/oa/studentInfos'
import StudentInput from '@/pages/oa/studentInput'

import StudentQuestion from '@/pages/community/studentQuestion'
import StudentAnswer from '@/pages/community/studentAnswer'

import StudentQuestionType from '@/pages/community/studentQuestionType'

import DownloadFileType from '@/pages/community/downloadFileType'
import DownloadFile from '@/pages/community/downloadFile'
import StudentUser from '@/pages/community/studentUser'


import JwtUtils from '@/services/commons/jwtUtils'
import {getMenus} from '@/services/commons/menuService'
import Login from '@/pages/login'
Vue.use(Router)

let router=new Router({
	mode: 'history',
	routes: [
	  	{
	        path: '/login',
	        component: Login,
	        name: '',
	        hidden: true
	    },
		{
			path: '/',
			name: '系统配置',
			component: Home,
			icon: 'el-icon-setting',
			children: [
				{
					path: '/roles',
					name: '角色管理',
					component: Roles,
				},
				{
					path: '/operations',
					name: '操作管理',
					component: Operations
					
				},
				{
					path: '/users',
					name: '用户管理',
					component: Users
					
				}
			]
		},
		{
			path: '/',
			name: '教学部',
			component: Home,
			icon: 'el-icon-star-on',
			children: [
			{
					path: '/questionBank',
					name: '答疑库',
					component: QuestionBank,
					
			},
			{
					path: '/studentInput',
					name: '学员信息录入',
					component: StudentInput
					
			},
			{
					path: '/studentInfos',
					name: '学员信息确认',
					component: StudentInfos
					
			}
			]
		},{
			path: '/',
			name: '社区管理',
			component: Home,
			icon: 'el-icon-star-on',
			children: [
			{
					path: '/studentQuestion',
					name: '社区问题管理',
					component: StudentQuestion
					
			},
			{
					path: '/studentAnswer',
					name: 'studentAnswer',
					component: StudentAnswer,
					hidden: true
					
			},
			{
					path: '/studentQuestionType',
					name: '社区问题类型管理',
					component: StudentQuestionType
					
			},
			{
					path: '/downloadFileType',
					name: '下载文件类型管理',
					component: DownloadFileType
					
			},
			{
					path: '/downloadFile',
					name: '下载文件管理',
					component: DownloadFile
					
			},
			{
					path: '/studentUser',
					name: '用户关联',
					component: StudentUser
					
			},
			]
		}
	
		
	]
})


let menus=getMenus();
router.beforeEach((to, from, next) => {
	if(to.path==='/login' ){
		next();
		return ;
	}
	let user=JwtUtils.getUser();
	if(user){
		if(to.path==='/' || to.path==='/changePasswordPage'){
			next()
			return ;
		}
		

		let allow=false;
		if(user.roles.length>0){
			for(let i=0;i<user.roles.length;i++){
				if(menus.get(user.roles[i]).find(function(element){
					return element==to.path
				})){
					allow=true;
					break;
				}
			}
			if(allow){
				next()
			}else{
				next("/login");
			}
		}else{
			next();
		}

	}else{
		next("/login");
	}
})
export default router