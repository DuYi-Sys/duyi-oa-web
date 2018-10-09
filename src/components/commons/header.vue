<template>
	<div class="header">
		
		<a href="#" class="LogoItemcollapse" v-if="collapsed"><img src="../../assets/mlogo.png" /></a>
		<a href="#" class="LogoItem"  v-else="collapsed"><img src="../../assets/logo.png" /></a>
		<span class="tools"  @click.prevent="collapse" >
					<a class="fa fa-align-justify" />
		</span>

		<!-- <a href="/login" class="LastItem">Loing in</a> -->
		
		<!--<router-link :to="user?'/':'/login'" class="LastItem">
		{{user?user.name:'Loing In'}}
		</router-link>-->

		<el-dropdown class="LastItem">
		  <span class="el-dropdown-link">
		    {{user?user.name:''}}
		  </span>
		  <el-dropdown-menu slot="dropdown">
		  	<el-dropdown-item  @click.native="changePwd">修改密码</el-dropdown-item>
		    <el-dropdown-item  @click.native="logout">退出登录</el-dropdown-item>
		  </el-dropdown-menu>
		</el-dropdown>
	</div>
</template>

<script>
import jwtUtils from '@/services/commons/jwtUtils'

	export default{
		data(){
			return {
				user:{},
				logo:'../../assets/logo.png'
			}
		},
		methods:{
			collapse(){
				this.$emit('collapse',!this.$props.collapsed);
			},
			logout(){
				jwtUtils.clearToken();
				this.$router.push({ path: '/login' });
			},
			changePwd(){
				this.$router.push({ path: '/changePasswordPage' });
			}
		},
		props: {
            collapsed:false
        },
		beforeMount(){
			this.user=jwtUtils.getUser()
		}
	}
</script>

<style scoped lang="scss">
@import "../../assets/style/global.scss"

</style>