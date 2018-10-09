<template>
	<div>

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
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="weiXinName" label="微信名">
					</el-table-column>
					<el-table-column prop="weiXin" label="微信号">
					</el-table-column>
					<el-table-column prop="group" label="公益群号">
					</el-table-column>
		
					<el-table-column fixed="right" label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="confirm(scope.row)">确认</el-button>
							
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
	
			close() {
    				this.getDatas()
			},
			

	
			
			editFinished(msg,failed){
				let type='success'
				if(failed){
					type="error"
				}else{
					this.close();
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
			getDatas(){
					this.listLoading=true;
					let params = {
						status:1
					};
					this.pagedDataTable.getDatas(url+"/search",params).then(res => {
							this.datas = res
							this.listLoading=false
					})
	
				},
				confirm(row){
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						addData(url+"/claimIntention",null,{id:row.id}).then(res=>{
							this.editFinished('认领成功')
						}).catch(err=>{
							console.error(err)
							this.editFinished('认领失败',true)
						})
					})
					console.log('confirm',row)
				},
				async getSaleOptions(){
					return new Promise(function (resolve, reject){
						let params = {
						};
						getDatas("/api/s/adminusers/roles/43", params).then(res => {
							console.log('res',res)
							let options=[];
							for(let opt of res.data){
									options.push({value:opt.id,label:opt.name})
							}
							resolve(options)
						}).catch(err=>{
							console.log(err)
						})
						})
				}
		},
		
		data() {
			return {
				datas: [],
				visible:false,
				loading:false,
				listLoading:false,
				
				saleOptions:[],
			}
		},
		mounted:function(){
			this.getDatas();
			
		},
		created: function() {
			this.user=jwtUtils.getUser()

			this.pagedDataTable=new PagedDataTable()
			this.getSaleOptions().then(data=>{
				this.saleOptions=data;
			})
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