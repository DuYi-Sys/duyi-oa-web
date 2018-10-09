<template>
	<div>
		<el-tabs v-model="activeName"  type="card" @tab-click="tabChange" >
  		  <el-tab-pane label="录入" name="input"   v-if="dispalyInput()" >
			<el-form :model="obj" label-width="8rem" :rules="rules" ref="theForm"  > 
		    			<el-form-item label="微信号"  prop="weiXin">
						<el-input v-model="obj.weiXin" auto-complete="off" ></el-input>
					</el-form-item>
					<el-form-item label="微信名"  prop="weiXinName">
							<el-input v-model="obj.weiXinName" auto-complete="off" ></el-input>
					</el-form-item>
					<el-form-item label="公益群号"  prop="group">
							<el-input v-model="obj.group" auto-complete="off" ></el-input>
					</el-form-item>
					<el-form-item label="引流平台"  prop="platform">
							<el-input v-model="obj.platform" auto-complete="off" ></el-input>
					</el-form-item>
					<el-form-item label="身份"  prop="identity">
						<el-select v-model="obj.identity" placeholder="请选择">
					    	  <el-option v-for="item in identityOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
					  	</el-select>
					</el-form-item>
					<el-form-item label="年龄"  prop="age">
							<el-input type="number" v-model.number="obj.age"  ></el-input>
					</el-form-item>
					<el-form-item label="学习进度"  prop="progress">
						<el-select v-model="obj.progress" placeholder="请选择">
							<el-option v-for="item in progressOpts" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="培训经历"  prop="haveTrain">
							<el-radio v-model="obj.haveTrain" :label="0">无</el-radio>
  							<el-radio v-model="obj.haveTrain" :label="1">有</el-radio>
					</el-form-item>
					<el-form-item label="是否听过公开课"  prop="haveOpen">
							<el-radio v-model="obj.haveOpen" :label="0">无</el-radio>
  							<el-radio v-model="obj.haveOpen" :label="1">有</el-radio>
					</el-form-item>
					<el-form-item label="学习需求"  prop="requirements">
							<el-input v-model="obj.requirements" auto-complete="off" ></el-input>
					</el-form-item>
					<el-form-item label="沟通次数"  prop="communicateNum">
							<el-input  type="number" v-model="obj.communicateNum" auto-complete="off" ></el-input>
					</el-form-item>
					<el-form-item label="学生特征"  prop="characteristics">
							<el-input v-model="obj.characteristics" auto-complete="off" ></el-input>
					</el-form-item>
					<el-form-item label="回访记录"  prop="visitRecord">
							<el-input v-model="obj.visitRecord" auto-complete="off" ></el-input>
					</el-form-item>
					<el-form-item label="销售"  prop="claimId">
							<el-select v-model="obj.claimId" placeholder="请选择">
							    <el-option
							      v-for="item in saleOptions"
							      :key="item.value"
							      :label="item.label"
							      :value="item.value">
							    </el-option>
							 </el-select>
					</el-form-item>
					<el-form-item label="综合意向评分"  prop="acceptance">
							<el-input type="number" v-model="obj.acceptance" auto-complete="off" ></el-input>
					</el-form-item>
					<el-form-item label="是否付款"  prop="havePay">
							<el-radio v-model="obj.havePay" :label="0">否</el-radio>
  							<el-radio v-model="obj.havePay" :label="1">是</el-radio>
					</el-form-item>
					<el-form-item label="初始登记时间"  prop="iniRegistrationTime">
							<el-date-picker
							      v-model="obj.iniRegistrationTime"
							      type="date"
							      placeholder="选择日期">
							    </el-date-picker>
					</el-form-item>
					<el-form-item label="最后沟通日期"  prop="lastLinkupTime">
							<el-date-picker
							      v-model="obj.lastLinkupTime"
							      type="date"
							      placeholder="选择日期">
							    </el-date-picker>
					</el-form-item>
					<el-form-item>
					   <el-button type="primary" @click.native="edit" :loading="loading">提交</el-button>
				   </el-form-item>
			</el-form>
		</el-tab-pane>
		<el-tab-pane label="查询" name="search" >
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
		
					<!--<el-table-column fixed="right" label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="confirm(scope.row)">编辑</el-button>
							
						</template>
					</el-table-column>-->
				</el-table>
				<el-pagination layout="prev,pager,next" @current-change="handleCurrentChange" :page-size="pagedDataTable.pageSize?pagedDataTable.pageSize:10" :total="pagedDataTable.total" :current-page="pagedDataTable.page"></el-pagination>
			</el-tab-pane>
	</el-tabs>
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
                this.$refs['theForm'].resetFields()
                this.initObj();
			},
			initObj(){
				this.obj={
					id:-1,
					weiXin: '',
					weiXinName: '',
					group:null,
					platform:'',
					identity:1,
					age:null,
					progress:1,
					haveTrain:0,
					haveOpen:0,
					requirements:'',
					communicateNum:0,
					characteristics:'',
					visitRecord:'',
					havePay:0,
					acceptance:'',
					claimId:null,
					iniRegistrationTime:null,
					lastLinkupTime:null
				}	
			},
			dispalyInput(){
				
				let display=this.user.roles.find(function(ele){
					return ele=='teacher';
				})
				if(display){
					this.activeName="input"
				}else{
					this.activeName="search"
				}
				return display;
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
					this.close();
				}
				this.loading=false;
				
				this.$message({
						message:msg,
						type: type
					})
			},
			tabChange(tab, event){
				console.log('tab-change',this.activeName)
				if(tab.name=='search'){
					this.pagedDataTable.init();
					this.getDatas();
					return ;
				}
			},
			handleCurrentChange(page) {
					this.pagedDataTable.change(page)
					this.getDatas();
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
				confirm(row){
					this.activeName="input"
					
					Object.assign(this.obj,row)
					
					console.log('confirm',this.activeName)
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
				identityOpts:[{label:"在校",value:1},{label:"在职",value:2},{label:"离职",value:3}],
				progressOpts:[{label:"基础",value:1},{label:"就业",value:2},{label:"进阶",value:3}],
				activeName:'input',
				obj:{
					id:-1,
					weiXin: '',
					weiXinName: '',
					group:null,
					platform:'',
					identity:1,
					age:null,
					progress:1,
					haveTrain:0,
					haveOpen:0,
					requirements:'',
					communicateNum:0,
					characteristics:'',
					visitRecord:'',
					havePay:0,
					acceptance:'',
					claimId:null,
					iniRegistrationTime:null,
					lastLinkupTime:null
				},
				saleOptions:[],
				rules: {
					weiXin: [{
							required: true,
							message: '请输入微信名',
					}],
					group: [{
							required: true,
							message: '请输入公益群号',
					}],
					progress: [{
							required: true,
							message: '请选择学习进度',
					}],
					claimId: [{
							required: true,
							message: '请选择销售',
					}],
					age:[{ type: 'number', message: '年龄必须为数字值'}]
				},
			}
		},
		mounted:function(){
			if(this.activeName=="search"){
				console.log('get datas')
				this.getDatas();
			}
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