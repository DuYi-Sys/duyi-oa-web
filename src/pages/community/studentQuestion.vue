<template>
	<div>

		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item  label="内容" label-width="5rem">
					<el-input placeholder="" v-model="filters.name"></el-input>
				</el-form-item>    
				<el-form-item>
					<el-button type="primary" @click="search">查询</el-button>
				</el-form-item>

			</el-form>
		</el-col> 
		<el-table :data="datas" border style="width: 100%" v-loading="listLoading">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="title" label="标题" >
			</el-table-column>
			<el-table-column prop="content" label="内容">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="150">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="toAnswer(scope.row)">查看回复</el-button>
					<el-button type="text" size="small" @click="deleteData(scope.row)">删除</el-button>

				</template>
			</el-table-column>
		</el-table>
		<el-pagination layout="prev,pager,next" @current-change="handleCurrentChange" :page-size="pagable.pageSize?pagable.pageSize:10" :total="pagable.total" :current-page="pagable.page"  ></el-pagination>
	</div>
</template>
<script>
	import { getDatas ,addData,updateData,getData,deleteData} from '@/services/commons/httpservice'
	var url="/api/question";
	export default {
		methods: {
			search(){
				this.initPage();
				this.getDatas();
			},
			close() {
                this.$refs['theForm'].resetFields()
                this.obj={
					id:''
				}
                console.log('close ',this.obj)
                this.visible=false;
			},
			edit() {
				this.$refs.theForm.validate((valid) => {
					console.log("add obj",this.obj);
					this.loading=true;
					if(this.obj.id){
						updateData(url,this.obj).then(res=>{
							this.editFinished('修改成功')
						}).catch(err=>{
							console.error(err)
							this.editFinished('修改失败',true)
						})
					}else{
						addData(url,this.obj).then(res=>{
							this.editFinished('添加成功')
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
				this.loading=false
				this.close();
				this.getDatas();
				this.$message({
						message:msg,
						type: type
					})
			},
			deleteFinished(msg,failed){
				let type='success'
				if(failed){
					type="error"
				}
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
					pageSize:5,
					page:1
				};
			},
			openForm(){
				this.title='新增'
				this.visible=true;
			},
			editForm(row){
				console.log(row.id)
				Object.assign(this.obj,row)
				getData(url+"/"+row.id).then(res=>{
					Object.assign(this.obj,res.data)
					this.title='修改'
					this.visible=true;
					console.log('obj',this.obj)
				})
			},
			deleteData(row){
				this.$confirm('确认删除吗？', '提示', {}).then(() => {
					console.log('delete',row)
					deleteData(url+"/"+row.id).then(res=>{
							this.deleteFinished('删除成功')
					}).catch(err=>{
							console.error(err)
							this.deleteFinished('删除失败',true)
					})
				})
				
			},
			toAnswer(row){
				this.$router.push({ name: 'studentAnswer', params: { questionId: row.id }})
				
			}
			
		},

		data() {
			return {
				title:'新增',
				datas: [],
				visible:false,
				loading:false,
				listLoading:false,
				obj:{
					id:''
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

				},
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