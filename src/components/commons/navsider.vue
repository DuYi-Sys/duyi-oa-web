<template>
    <div>
         <el-menu :default-active="$route.path" class="el-menu-vertical"   router :collapse="collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!hidden(item)">
						<el-submenu :index="index+''" v-if="!item.leaf">
							<template slot="title">
								<i :class="item.icon"></i><span slot="title">{{item.name}}</span></template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!hidden(child)">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">
							<i :class="item.icon"></i><span slot="title">{{item.children[0].name}}</span></el-menu-item>
					</template>
			</el-menu>

      </div>
</template>

<script>
	import jwtUtils from '@/services/commons/jwtUtils'
	import {getMenus} from '@/services/commons/menuService'

    export default{
        data(){
            return {
            	user:{},
               menus:[],
            }
        },
        props: {
            collapsed:false
        },
        methods:{
        	hidden(item){
        		if(item.hidden){
        			return true;
        		}

        		if(item.path==='/'){
        			for(let i=0;i<item.children.length;i++){
        				if(this.canAccess(item.children[i].path)){
        					return false;
        				}
        			}
        			return true;
        		}
				return !this.canAccess(item.path);
        	},
        	canAccess(path){
        		let menus=getMenus();
        		if(!this.user){
        			return true;
        		}
        		for(let i=0;i<this.user.roles.length;i++){
				if(menus.get(this.user.roles[i]).find(function(element){
					return element==path
				})){
					return true;
				}
			}
        		return false;
//			return true;
        	}
        },
      
        beforeMount(){
			this.user=jwtUtils.getUser()
		}

    }
</script>

<style scoped lang="scss">
@import "../../assets/style/global.scss"
</style>