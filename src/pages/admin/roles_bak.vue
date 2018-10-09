<template>
	<div>
		<el-dialog title="新增" :visible="addVisible" :before-close="addClose" width="30rem">
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
		<el-dialog title="添加用户" :visible="addUserVisible" :before-close="addUserClose" width="30rem">
			<el-form :model="userForm" label-width="8rem"  ref="addUserForm" > 
				<el-form-item label="角色"  prop="userIds">
					<el-select
					    v-model="userForm.userIds"
					    multiple
					    filterable
					    remote
					    reserve-keyword
					    placeholder="请输入用户名"
					    :remote-method="findUsers"
					    :loading="userLoading">
					    <el-option
					      v-for="item in userOptions"
					      :key="item.id"
					      :label="item.name"
					      :value="item.id">
					    </el-option>
					  </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addUserClose">取消</el-button>
				<el-button type="primary" @click.native="addUsers" :loading="loading">提交</el-button>
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
					<el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>
					<el-button type="text" size="small" @click="addUserForm(scope.row)">添加用户</el-button>
					<el-button type="text" size="small" @click="editForm(scope.row)">添加操作</el-button>

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
					pageSize:3,
					page:1
				};
			},
			openForm(){
				this.addVisible=true;
			},
			editForm(row){
				console.log(row.id)
				Object.assign(this.obj,row)
				getData(url+"/"+row.id).then(res=>{
					Object.assign(this.obj,res.data)
					this.openForm();
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
			findUsers(name){
				this.userLoading=true;
				let params = {
					name: name,
				};
				getDatas("/api/s/adminusers/name",params).then(res => {
					
					this.userOptions = res.data
					console.log('userOptions',res.data)
					this.userLoading=false
				}).catch(function(error) {
					console.error(error);
				});
//				this.userOptions=[{id:1,name:'admin'}]
//				this.userLoading=false;

				
			},
			addUserClose(){
				this.addUserVisible=false;
			},
			addUserForm(row){
				console.log('row',row)
				this.addUserVisible=true;
			}
			
		},

		data() {
			return {
				datas: [],
				addVisible:false,
				loading:false,
				listLoading:false,
				userLoading:false,
				opertaionLoading:false,
				addUserVisible:false,
				userForm:{
					userIds:[]
				},
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
					pageSize:20,
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