<template>
	<div>
		<el-dialog :title="title" :visible="addVisible" :before-close="addClose" width="30rem">
			<el-form :model="obj" label-width="8rem" :rules="rules" ref="addForm" > 
				<el-form-item label="角色"  prop="name">
					<el-input v-model="obj.name" auto-complete="off" ></el-input>
				</el-form-item>
			    <el-form-item label="角色名称"  prop="cnName">
					<el-input v-model="obj.cnName" auto-complete="off" ></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addClose">取消</el-button>
				<el-button type="primary" @click.native="edit" :loading="loading">提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="添加用户" :visible="addUserVisible" :before-close="addUserClose" width="40rem" >
			
			<el-transfer v-model="selectedUsers" :data="users" :titles="['未添加','已添加']"></el-transfer>
				
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addUserClose">取消</el-button>
				<el-button type="primary" @click.native="addUsers" >提交</el-button>
			</div>
		</el-dialog>
		<el-dialog title="添加操作" :visible="addOperationVisible" :before-close="addOperationClose" width="40rem">
			
			<el-transfer v-model="selectedOperations" :data="operations" :titles="['未添加','已添加']"></el-transfer>
			
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addOperationClose">取消</el-button>
				<el-button type="primary" @click.native="addOperations">提交</el-button>
			</div>
		</el-dialog>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item  label="角色名称" label-width="5rem">
					<el-input placeholder="" v-model="filters.name"></el-input>
				</el-form-item>    
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="openForm">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col> 
		<el-table :data="datas" border style="width: 100%" v-loading="listLoading">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="name" label="角色名" >
			</el-table-column>
			<el-table-column prop="cnName" label="中文名">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="300">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="editForm(scope.row)">编辑</el-button>
					<!--<el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>-->
					<el-button type="text" size="small" @click="addUserForm(scope.row)" v-loading.fullscreen.lock="userLoading">添加用户</el-button>
					<el-button type="text" size="small" @click="addOperationForm(scope.row)" v-loading.fullscreen.lock="opertaionLoading">添加操作权限</el-button>

				</template>
			</el-table-column>
		</el-table>
		<el-pagination layout="prev,pager,next" @current-change="handleCurrentChange" :page-size="pagable.pageSize?pagable.pageSize:10" :total="pagable.total" :current-page="pagable.page"  ></el-pagination>
	</div>
</template>
<script>
	import { getDatas ,addData,updateData,getData,deleteData} from '@/services/commons/httpservice'
	var url="/api/adminroles";
	export default {
		methods: {
			search(){
				this.initPage();
				this.getDatas();
			},
			addClose() {
                this.$refs['addForm'].resetFields()
                this.obj={
					id:'',
					name: '',
					cnName:''
				}
                console.log('close ',this.obj)
                this.addVisible=false;
			},
			edit() {
				this.$refs.addForm.validate((valid) => {
					console.log("add obj",this.obj);
					this.loading=true;
					if(this.obj.id){
						updateData(url,this.obj).then(res=>{
							this.editFinished('修改成功')
							this.addClose()
						}).catch(err=>{
							console.error(err)
							this.editFinished('修改失败',true)
						})
					}else{
						addData(url,this.obj).then(res=>{
							this.editFinished('添加成功')
							this.addClose();
						}).catch(err=>{
							console.error(err)
							this.editFinished('添加失败',true)
						})
					}

				});
			},
			editFinished(msg,failed){
				let type='success'
				if(failed){
					type="error"
				}
				this.loading=false;
				this.getDatas();
				this.$message({
						message:msg,
						type: type
					})
			},

			handleCurrentChange(page) {
				this.pagable.page=page
				this.getDatas();
			},
			getDatas(){
				this.listLoading=true;
				let params = {
					name: this.filters.name,
					page :this.pagable.page-1,
					size : this.pagable.pageSize
				};
				getDatas(url,params).then(res => {
					console.log('page',res)
					this.pagable.total=res.data.totalElements;
					this.pagable.page=res.data.number+1;
					this.datas = res.data.content
					this.listLoading=false
				}).catch(function(error) {
					console.error(error);
				});
			},
			initPage(){
				this.pagable={
					total:0,
					pageSize:10,
					page:1
				};
			},
			openForm(){
				this.title="新增";
				this.addVisible=true;
			},
			editForm(row){
				console.log(row.id)
				Object.assign(this.obj,row)
				getData(url+"/"+row.id).then(res=>{
					Object.assign(this.obj,res.data)
					this.title="修改";
					this.addVisible=true;
					console.log('obj',this.obj)
				})
			},
			deleteData(row){
				this.$confirm('确认删除吗？', '提示', {}).then(() => {
					console.log('delete',row)
					deleteData(url+"/"+row.id).then(res=>{
							this.editFinished('删除成功')
					}).catch(err=>{
							console.error(err)
							this.editFinished('删除失败',true)
					})
				})
				
			},

			addUserClose(){
				
				this.addUserVisible=false;
				this.users=[]
				this.selectedUsers=[];

				this.obj={
					id:'',
					name: '',
					cnName:''
				}
			},
			addOperationClose(){
				this.addOperationVisible=false;
				this.operations=[]
				this.selectedOperations=[]
				this.obj={
					id:'',
					name: '',
					cnName:''
				}
			},
			
			addUserForm(row){
				
				let params = {
					name: this.filters.name,
				};
				this.userLoading=true;
				Object.assign(this.obj,row)
				getDatas("/api/s/adminusers/list",params).then(res => {
					getData(url+"/"+row.id).then(res=>{
						for(let i=0;i<res.data.users.length;i++){
							this.selectedUsers.push(res.data.users[i].id);
						}
						this.addUserVisible=true;

						this.userLoading=false;

					})
					for(let i=0;i<res.data.length;i++){
						let user=res.data[i];
						this.users.push({key:user.id,label:user.name});
					}
				}).catch(function(error) {
					console.error(error);
				});
			},
			addOperationForm(row){
				let params = {
					name: this.filters.name,
				};
				this.opertaionLoading=true;
				Object.assign(this.obj,row)
				getDatas("/api/adminoperations/list",params).then(res => {
					getData(url+"/"+row.id).then(res=>{
						for(let i=0;i<res.data.operations.length;i++){
							this.selectedOperations.push(res.data.operations[i].id);
						}
						this.addOperationVisible=true;

						this.opertaionLoading=false;

					})
					for(let i=0;i<res.data.length;i++){
						let operation=res.data[i];
						this.operations.push({key:operation.id,label:operation.name});
					}
				}).catch(function(error) {
					console.error(error);
				});
			},
			addUsers(){
				addData("/api/adminroles/"+this.obj.id+"/users",this.selectedUsers).then(res=>{
							this.editFinished('添加用户成功')
							this.addUserClose();
						}).catch(err=>{
							console.error(err)
							this.editFinished('添加用户失败',true)
						})
			},
			addOperations(){
				
				addData("/api/adminroles/"+this.obj.id+"/operations",this.selectedOperations).then(res=>{
							this.editFinished('添加操作成功')
							this.addOperationClose();
						}).catch(err=>{
							console.error(err)
							this.editFinished('添加操作失败',true)
						})
			}
		},

		data() {
			return {
				datas: [],
				title:'',
				addVisible:false,
				loading:false,
				listLoading:false,
				userLoading:false,
				opertaionLoading:false,
				addUserVisible:false,
				addOperationVisible:false,
				users:[],
				operations:[],
				selectedUsers:[],
				selectedOperations:[],

				obj:{
					id:'',
					name: '',
					cnName:''
				},
				filters: {
						name: '',
				},
				pagable:{
					total:0,
					pageSize:10,
					page:1
				},
				rules: {
					name: [{
							required: true,
							message: '请输入角色',
					}],
					cnName: [{
							required: true,
							message: '请输入角色名称',
					}],
				},
				userOptions:[],
			}
		},
		mounted: function() {
			this.initPage();
			this.getDatas();
		}
	}
</script>

<style>

</style>