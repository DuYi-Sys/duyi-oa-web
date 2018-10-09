<template>
	<div>
		<el-dialog :title="title" :visible="visible" :before-close="close" width="30rem">
			<el-form :model="obj" label-width="8rem" :rules="rules" ref="theForm" > 
				<el-form-item label="名称"  prop="name">
					<el-input v-model="obj.name" auto-complete="off" ></el-input>
				</el-form-item>
			    <el-form-item label="路径"  prop="path">
					<el-input v-model="obj.path" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="操作权限"  prop="operation">
					<el-select v-model="obj.operation" placeholder="请选择">
					    <el-option
					      v-for="item in options"
					      :key="item.value"
					      :label="item.label"
					      :value="item.value">
					    </el-option>
					  </el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="close">取消</el-button>
				<el-button type="primary" @click.native="edit" :loading="loading">提交</el-button>
			</div>
		</el-dialog>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item  label="名称" label-width="5rem">
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
			<el-table-column prop="name" label="名称" >
			</el-table-column>
			<el-table-column prop="path" label="路径">
			</el-table-column>
			<el-table-column prop="operation" label="操作权限" :formatter="formatOperation">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="editForm(scope.row)">编辑</el-button>
					<el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination layout="prev,pager,next" @current-change="handleCurrentChange" :page-size="pagedDataTable.pageSize?pagedDataTable.pageSize:10" :total="pagedDataTable.total" :current-page="pagedDataTable.page"  ></el-pagination>
	</div>
</template>
<script>
	import { getDatas ,addData,updateData,getData,deleteData} from '@/services/commons/httpservice'
	import PagedDataTable from "@/services/commons/pagedDataTable"
	var url="/api/adminoperations";
	export default {
		methods: {
			search(){
				this.pagedDataTable.init();
				this.getDatas();
			},
			close() {
                this.$refs['theForm'].resetFields()
                this.obj={
					id:'',
					name: '',
					path: '',
					operation:''
				}
                this.visible=false;
			},
			edit() {
				this.$refs.theForm.validate((valid) => {
					this.loading=true;
					if(this.obj.id){
						updateData(url,this.obj).then(res=>{
							this.editFinished('修改成功')
							this.close();
						}).catch(err=>{
							console.error(err)
							this.editFinished('修改失败',true)
						})
					}else{
						addData(url,this.obj).then(res=>{
							this.editFinished('添加成功')
							this.close();
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
				this.pagedDataTable.change(page)
				this.getDatas();
			},
			getDatas(){
				this.listLoading=true;
				let params = {
					name: this.filters.name,
				};
				this.pagedDataTable.getDatas(url,params).then(res => {
						this.datas = res
						console.table(this.datas)
						this.listLoading=false
				})

			},
			openForm(){
				this.title="新增";
				this.visible=true;
			},
			editForm(row){
				Object.assign(this.obj,row)
				getData(url+"/"+row.id).then(res=>{
					Object.assign(this.obj,res.data)
					this.title="修改";
					this.visible=true;
					
				})
			},
			deleteData(row){
				this.$confirm('确认删除吗？', '提示', {}).then(() => {
					deleteData(url+"/"+row.id).then(res=>{
							this.editFinished('删除成功')
					}).catch(err=>{
							console.error(err)
							this.editFinished('删除失败',true)
					})
				})
				
			},
			formatOperation(row){
				for(let opt of this.options){
					if(row.operation==opt.value){
						return opt.label;
					}
				}
			}
			
		},

		data() {
			return {
				datas: [],
				title:'',
				visible:false,
				loading:false,
				listLoading:false,
				user:{},
				options:[{label:"读写",value:"*"},{label:"只写",value:"WRITE"},{label:"只读",value:"READ"}],
				obj:{
					id:'',
					name: '',
					path: '',
					operation:''
				},
				filters: {
						name: '',
				},
				pagedDataTable:{
				},
				rules: {
					name: [{
							required: true,
							message: '请输入名称',
					}],
					path: [{
							required: true,
							message: '请输入路径',
					}],
					operation: [{
							required: true,
							message: '请输入操作',
					}],
				},
			}
		},
		created: function() {
			this.pagedDataTable=new PagedDataTable()

			this.getDatas();
		}
	}
</script>

<style>

</style>