<template>
	<div>
		<el-dialog title="选择用户" :visible="studentUserVisible" :before-close="studentUserClose" width="20rem" >
			<el-select
			    v-model="selectedStudentUser"
			    filterable
			    remote
			    reserve-keyword
			    placeholder="请输入关键词"
			    :remote-method="remoteMethod">
			    <el-option
			      v-for="item in studentUsers"
			      :key="item.id"
			      :label="item.nickName"
			      :value="item.id">
			    </el-option>
			  </el-select>			
			<div slot="footer" >
				<el-button @click.native="studentUserClose">取消</el-button>
				<el-button type="primary" @click.native="relationUser" >提交</el-button>
			</div>
		</el-dialog>
		<el-table :data="datas" border style="width: 100%" v-loading="listLoading">
			<el-table-column type="expand">
			      <template slot-scope="props">
			        <el-form label-position="left" inline class="table-expand">
			          <el-form-item label="微信名">
			            <span>{{ props.row.weiXinName }}</span>
			          </el-form-item>
			          <el-form-item label="微信号">
			            <span>{{ props.row.weiXin }}</span>
			          </el-form-item>
			          <el-form-item label="公益群号">
			            <span>{{ props.row.group }}</span>
			          </el-form-item>
			          <el-form-item label="引流平台">
			            <span>{{ props.row.platform }}</span>
			          </el-form-item>
			          <el-form-item label="身份">
			            <span>{{ props.row.identity }}</span>
			          </el-form-item>
			          <el-form-item label="年龄">
			            <span>{{ props.row.age }}</span>
			          </el-form-item>
			          <el-form-item label="学习进度">
			            <span>{{ props.row.progress }}</span>
			          </el-form-item>
			          <el-form-item label="培训经历">
			            <span>{{ props.row.haveTrain }}</span>
			          </el-form-item>
			          <el-form-item label="是否听过公开课">
			            <span>{{ props.row.haveOpen }}</span>
			          </el-form-item>
			          <el-form-item label="学习需求">
			            <span>{{ props.row.requirements }}</span>
			          </el-form-item>
			          <el-form-item label="沟通次数">
			            <span>{{ props.row.communicateNum }}</span>
			          </el-form-item>
			          <el-form-item label="学生特征">
			            <span>{{ props.row.characteristics }}</span>
			          </el-form-item>
			          <el-form-item label="回访记录">
			            <span>{{ props.row.visitRecord }}</span>
			          </el-form-item>
			          <el-form-item label="是否付款">
			            <span>{{ props.row.havePay }}</span>
			          </el-form-item>
			          <el-form-item label="上传人">
			            <span>{{ props.row.uploadId }}</span>
			          </el-form-item>
			          <el-form-item label="审核人">
			            <span>{{ props.row.claimId }}</span>
			          </el-form-item>
			          <el-form-item label="认领状态">
			            <span>{{ props.row.status }}</span>
			          </el-form-item>
			          <el-form-item label="综合意向评分">
			            <span>{{ props.row.acceptance }}</span>
			          </el-form-item>
			          <el-form-item label="初始登记时间">
			            <span>{{ props.row.iniRegistrationTime }}</span>
			          </el-form-item>
			          <el-form-item label="最后沟通日期">
			            <span>{{ props.row.lastLinkupTime }}</span>
			          </el-form-item>
			        </el-form>
			      </template>
			</el-table-column>
			<el-table-column prop="weiXinName" label="微信名">
			</el-table-column>
			<el-table-column prop="weiXin" label="微信号">
			</el-table-column>
			<el-table-column prop="group" label="公益群号">
			</el-table-column>

			<el-table-column fixed="right" label="操作" width="100">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="openRelationForm(scope.row)">关联</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination layout="prev,pager,next" @current-change="handleCurrentChange" :page-size="pagedDataTable.pageSize?pagedDataTable.pageSize:10" :total="pagedDataTable.total" :current-page="pagedDataTable.page"></el-pagination>
	</div>
</template>
<script>
	import { getDatas ,addData,updateData,getData,deleteData} from '@/services/commons/httpservice'
	import PagedDataTable from "@/services/commons/pagedDataTable"
	import jwtUtils from '@/services/commons/jwtUtils'

	var url="/api/s/addIntention";
	export default {
		methods: {
	
			studentUserClose(){
				
				this.studentUserVisible=false;
				this.studentUsers=[]
				this.selectedStudentUser='';
				this.selectUserBody='';
				this.obj={
					id:'',
					nickName: '',
				}
			},
			edit() {
				this.$refs.theForm.validate((valid) => {
					this.loading=true;
					if(valid){
						addData(url,this.obj).then(res=>{
							this.editFinished('添加成功')
						}).catch(err=>{
							console.error(err)
							this.editFinished('添加失败',true)
						})
					}else{
						this.loading=false;
						console.log('========false')
					}

				});
				console.log('obj',this.obj)
			},
			
			editFinished(msg,failed){
				let type='success'
				if(failed){
					type="error"
				}else{
					this.studentUserClose();
				}
				this.loading=false;
				
				this.$message({
						message:msg,
						type: type
					})
			},
			handleCurrentChange(page) {
					this.pagedDataTable.change(page)
					this.getDatas();
			},
			openRelationForm(row){
				this.studentUserVisible=true;
				this.selectedStudentUser='';
				this.selectUserBody=row;
//				console.log(row)
			},
			relationUser(){
					console.log(this.selectedStudentUser)
					updateData('/api/student/relation',null,{studentBodyId:this.selectUserBody.id,studentId:this.selectedStudentUser}).then(res=>{
							this.editFinished('关联成功')
							this.studentUserClose()
						}).catch(err=>{
							console.error(err)
							this.editFinished('关联失败',true)
							this.studentUserClose()
						})
			},
			getDatas(){
					this.listLoading=true;
					let params = {
						
					};
					this.pagedDataTable.getDatas(url,params).then(res => {
							this.datas = res
							this.listLoading=false
					})
	
			},
			remoteMethod(query){
				getDatas("/api/student/nickname",{nickName:query}).then(res => {
					this.studentUsers=res.data;
				}).catch(function(error) {
					console.error(error);
				});
				console.log(query)
			}
		},
		
		data() {
			return {
				datas: [],
				studentUserVisible:false,
				loading:false,
				listLoading:false,
				studentUsers:[],
				selectedStudentUser:'',
				selectUserBody:'',
				obj:{
					id:-1
				},
				rules: {
				},
			}
		},
		mounted:function(){
			this.getDatas();
		},
		created: function() {
			this.user=jwtUtils.getUser()

			this.pagedDataTable=new PagedDataTable()
		}
	}
</script>

<style>
  .table-expand {
    font-size: 0;
  }
  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 48%;
  }
</style>