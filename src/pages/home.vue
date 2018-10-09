<template>

	<div>
		<head-bar @collapse='collapse' :collapsed='isCollapse' @changePwd="changePwd"/>
	    <div class="container">
	      	<div :class="isCollapse?'navsiderCollapse':'navsider'">
				<nav-sider  :collapsed='isCollapse'/>
			 </div>
	        <div class="content">
	          <div class="child">
	              <transition name="fade" mode="out-in">
	                  <router-view></router-view>
	              </transition>
	          </div>
	          
	        </div>
	    </div>
		
		
	</div> 
	
</template>

<style scoped lang="scss">
@import "../assets/style/global.scss"

</style>

<script>
	import HeadBar from '@/components/commons/header'
	import NavSider from '@/components/commons/navsider'
	export default {
		data() {
			return {
				isCollapse:false,
				pwdShow:true,
        	}
      	},
		components:{
			HeadBar,
			NavSider,
		},
		methods: {
			collapse(collapsed){
				this.isCollapse=collapsed

			},
			changePwd(){
				
			}

			
		}
	}
</script>
