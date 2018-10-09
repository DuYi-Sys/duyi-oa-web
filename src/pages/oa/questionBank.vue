<template>
	<div>
		<el-tabs v-model="activeName"  type="card" @tab-click="tabChange">
		    <el-tab-pane label="录入" name="input"  v-if="dispalyInput()" >
		    		<el-form :model="obj" label-width="8rem" :rules="rules" ref="theForm" > 
		    			<el-form-item label="标题"  prop="title">
						<el-input v-model="obj.title" auto-complete="off" ></el-input>
					</el-form-item>
					<el-form-item label="知识点"  prop="topicId">
						<el-cascader
						    :options="topicOptions"
						    v-model="selectedOptions"
						    @active-item-change="handleItemChange" :show-all-levels="false" @change="handleChange">
						  </el-cascader>
					</el-form-item>
					<el-form-item label="问题描述"  prop="questionBody" style="height:300px" >
						<quill-editor v-model="obj.questionBody"  :options="editorOption" style="height:200px" ></quill-editor>
					</el-form-item>
				    
					<el-form-item label="问题解答"  prop="questionAnalysis" style="height:300px" >
						<quill-editor v-model="obj.questionAnalysis"  :options="editorOption" style="height:200px" ></quill-editor>
					</el-form-item>
					
					<el-form-item>
					   <el-button type="primary" @click.native="edit" :loading="loading">提交</el-button>
				   </el-form-item>
				</el-form>
<!--				<div v-html="obj.questionBody"></div>
-->		    </el-tab-pane>
			<el-tab-pane label="查询" name="search" >
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true">
						<el-form-item  label="创建人" label-width="5rem">
							<el-select
							    v-model="filters.uploadId"
							    filterable
							    remote 
							    clearable
							    placeholder="请输入姓名"
							    :remote-method="findUserByName" 
							    :loading="userOptionsLoading"
							    >
							    <el-option
							      v-for="item in userOptions"
							      :key="item.id"
							      :label="item.name"
							      :value="item.id">
							    </el-option>
							  </el-select>
						</el-form-item>    
						<el-form-item  label="知识点" label-width="5rem" >
							<el-cascader
						    :options="topicOptions"
						    v-model="selectedFilterOptions"
						    @active-item-change="handleItemChange" :show-all-levels="false" @change="handleFilterChange">
						 </el-cascader>
						</el-form-item> 
						<br>
						<el-form-item  label="关键字" label-width="5rem" >
							<el-input placeholder="" v-model="filters.keyWord"></el-input>
						</el-form-item> 
						<el-form-item  label="日期" label-width="5rem" >
							<el-date-picker
							      v-model="filters.date"
							      type="date"
							      placeholder="选择日期">
							    </el-date-picker>
						</el-form-item> 
						<el-form-item>
							<el-button type="primary" @click="search">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<el-table :data="datas" border style="width: 100%" v-loading="listLoading">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="title" label="标题">
					</el-table-column>
					<el-table-column prop="topicBody.name" label="知识点">
					</el-table-column>
					<el-table-column prop="userInfo.name" label="创建人">
					</el-table-column>
					<el-table-column prop="date" label="创建时间" :formatter="formatDate">
					</el-table-column>
					<el-table-column prop="status" label="审核情况" :formatter="formatReviewStatus">
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="preview(scope.row)">查看详情</el-button>
							
						</template>
					</el-table-column>
				</el-table>
				<el-pagination layout="prev,pager,next" @current-change="handleCurrentChange" :page-size="pagedDataTable.pageSize?pagedDataTable.pageSize:10" :total="pagedDataTable.total" :current-page="pagedDataTable.page"></el-pagination>
			</el-tab-pane>
		    <el-tab-pane label="审核" name="review"  v-if="dispalyReview()">
		    		<el-table :data="datas" border style="width: 100%" v-loading="listLoading">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="title" label="标题">
					</el-table-column>
							<el-table-column prop="topicBody.name" label="知识点">
					</el-table-column>
					<el-table-column prop="userInfo.name" label="创建人">
					</el-table-column>
					<el-table-column prop="date" label="创建时间" :formatter="formatDate">
					</el-table-column>


					<el-table-column fixed="right" label="操作" width="200">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="preview(scope.row)">查看详情</el-button>
							<el-button type="text" size="small" @click="audit(scope.row,2)">通过</el-button>
							<el-button type="text" size="small" @click="audit(scope.row,3)">不通过</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination layout="prev,pager,next" @current-change="handlePendingReviewDatasCurrentChange" :page-size="pagedDataTable.pageSize?pagedDataTable.pageSize:10" :total="pagedDataTable.total" :current-page="pagedDataTable.page"></el-pagination>
		    </el-tab-pane>
	   </el-tabs>
		<el-dialog  :visible="visible" :before-close="closeForm" width="80%"   >
			<div><h2>{{obj.title}}</h2></div>
			<div style="background-color: #DDDDDD; width: 100%;font-size: 18px;" >问题描述:</div>
			<div class="quill-editor">
			<div class="ql-snow">
					<div class="ql-editor">
		  				<div v-html="obj.questionBody"></div>
		  			</div>
		  		</div>
		  	</div>
			
			<div style="background-color: #CCCCCC; width: 100%;font-size: 18px;">问题解答:</div>
			<div class="quill-editor">
				<div class="ql-snow">
					<div class="ql-editor">
		  				<div v-html="obj.questionAnalysis"></div>
		  			</div>
		  		</div>
		  	</div>
		</el-dialog>

		</div>
</template>
<script>
	import 'quill/dist/quill.core.css'
	import 'quill/dist/quill.snow.css'
	import 'quill/dist/quill.bubble.css'

	import { quillEditor } from 'vue-quill-editor'
	import { getDatas ,addData,updateData,getData,deleteData} from '@/services/commons/httpservice'
	import PagedDataTable from "@/services/commons/pagedDataTable"
	import jwtUtils from '@/services/commons/jwtUtils'
	import util from '@/services/commons/util'
	var url="/api/s/addQuestion";
	export default {
		methods: {
			search(){
				this.pagedDataTable.init();
				this.getDatas();
			},
			closeForm() {
                this.visible=false;
			},
			edit() {
				this.$refs.theForm.validate((valid) => {

					addData(url,this.obj).then(res=>{
						this.editFinished('添加成功')
					}).catch(err=>{
						console.error(err)
						this.editFinished('添加失败',true)
					})
				})
			},
			audit(row,v) {
				let params={
					id:row.id,
					status:v,
				}
				let ok=true;
				if(v==3){
					 this.$prompt('请输入原因', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				        }).then(({ value })=>{
				        		params['reason']=value;
					        	addData(url+"/auditQuestion",{},params).then(res=>{
								this.pendingReviewFinished('成功')
							}).catch(err=>{
								console.error(err)
								this.pendingReviewFinished('失败',true)
							})
				        })
				}else{
						addData(url+"/auditQuestion",{},params).then(res=>{
							this.pendingReviewFinished('成功')
						}).catch(err=>{
							console.error(err)
							this.pendingReviewFinished('失败',true)
						})
				}

				console.log('param',params)
				
			},
			editFinished(msg,failed){
				let type='success'
				if(failed){
					type="error"
				}
				this.loading=false;
				if(!failed){
					this.$refs.theForm.resetFields()
					this.obj={
						id:'',
						questionBody: '',
						topicId: 0,
						questionAnalysis:''
					},
					this.getDatas();
				}
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
				let d=""
				if(this.filters.date!='' && this.filters.date!=null){
					d=util.formatDate.format(this.filters.date,'yyyy-MM-dd')
				}
				let params = {
					topicId: this.filters.topicId,
					uploadId: this.filters.uploadId==''?0:this.filters.uploadId,
					status: this.filters.status,
					date: d,
					keyWord:this.filters.keyWord
				};
				console.log('params',params)
				this.pagedDataTable.getDatas(url,params).then(res => {
						this.datas = res
						this.listLoading=false
				})

			},
			pendingReviewFinished(msg,failed){
				let type='success'
				if(failed){
					type="error"
				}
				this.loading=false;

				this.getPendingReviewDatas();
				this.$message({
						message:msg,
						type: type
					})
			},
			handlePendingReviewDatasCurrentChange(page) {
				this.pagedDataTable.change(page)
				this.getPendingReviewDatas();
			},
			getPendingReviewDatas(){
				this.listLoading=true;
				let params = {
					topicId: 0,
					uploadId: 0,
					status: 1,
					date: '',
					keyWord:''
				};
				this.pagedDataTable.getDatas(url,params).then(res => {
						this.datas = res
						this.listLoading=false
				})

			},
			
			preview(row){
				Object.assign(this.obj,row)
				this.visible=true;
			},

			dispalyReview(){
				let display=this.user.roles.find(function(ele){
					return ele=='admin';
				})
				return display;
			},
			dispalyInput(){
				
				let display=this.user.roles.find(function(ele){
					return ele=='teacher';
				})
				if(display){
					this.activeName="input"
				}
				return display;
			},
			handleChange(v){
				this.obj.topicId=v[v.length-1];
			},
			handleFilterChange(v){
				this.filters.topicId=v[v.length-1];
			},
			handleItemChange(vals){
				this.itemChange(vals)
			},
			itemChange(vals) {

				if(vals.length===0){
					return;
				}
				let id = vals[vals.length - 1];

				if(vals.length==1){
					for(let opt of this.topicOptions){
						console.log('opt',opt)
						if(opt.value==id){
							this.getTopicOptions(id).then(data=>{
									opt.children=data;
							}).catch(err=>{
								console.log('err',err)
							})
							return ;
						}
					}
				}
				
					
				if(vals.length==2){
					let parentId=vals[0];
					for(let opt of this.topicOptions){
						if(opt.value==parentId){
							let children=opt.children;
							for(let child of children){
								if(child.value==id){
									console.log('child',child)
									this.getTopicOptions(id,true).then(data=>{
										console.log('child2',child)
										child.children=data;
									}).catch(err=>{
										console.log('err',err)
									})
									return ;
								}
							}
							return ;
						}
					}
				}

				
			},
			tabChange(tab, event){
				if(tab.name=='search'){
					this.pagedDataTable.init();
					this.getDatas();
					return ;
				}
				if(tab.name=='review'){
					this.getPendingReviewDatas();
					return ;
				}
				if(tab.name=='input'){
					this.obj={
						id:'',
						questionBody: '',
						topicId: 0,
						questionAnalysis:''
					}
					return ;
				}
			},
			async getTopicOptions(parentId,leaf){
				return new Promise(function (resolve, reject){
				let params = {
					parentId: parentId,
				};
				getDatas("/api/topic/getChildTopic", params).then(res => {
					console.log('res',res)
					let options=[];
					for(let opt of res.data){
						if(leaf){
							options.push({value:opt.id,label:opt.name})

						}else{
							options.push({value:opt.id,label:opt.name,children:[]})

						}
					}
					resolve(options)
				}).catch(err=>{
					console.log(err)
				})
				})
			},
			formatDate(row ,col){
				let date = new Date();
				date.setTime(row.date)
				return util.formatDate.format(date,'yyyy-MM-dd')
//				return row.date
			},
			formatReviewStatus(row ,col){
				let status='';
				switch (row.status){
					case 1:
						status="已提交";
						break;
					case 2:
						status="已通过";
						break;
					case 3:
						status="已退回"+((row.reason!=null &&row.reason!='')?(","+row.reason):"");
						break;
				}
				return status;
//				return row.date
			},
			findUserByName(name){
				this.userOptionsLoading=true;
				let params={
					name:name
				}
				getDatas("/api/s/adminusers/list", params).then(res => {
					this.userOptions=res.data
					this.userOptionsLoading=false;
				}).catch(err=>{
					this.userOptionsLoading=false;

				})
			}
		},

		data() {
			return {
				editorOption: {
			         placeholder: '',
			     },
			    user:{},
				datas: [],
				visible:false,
				loading:false,
				listLoading:false,
				activeName:'search',
				userOptionsLoading:false,
				obj:{
					id:'',
					questionBody: '',
					topicId: 0,
					questionAnalysis:''
				},
				topics:[],
				filters: {
						topicId: 0,
						uploadId:'',
						status:0,
						keyWord:'',
						date:''
				},
				pagedDataTable:{
				},
				rules: {
					title: [{
							required: true,
							message: '请输入标题',
					}],
					questionBody: [{
							required: true,
							message: '请输入问题描述',
					}],
					questionAnalysis: [{
							required: true,
							message: '请输入问题解答',
					}],
					topicId: [{
							required: true,
							message: '请选择知识点',
					}],
				},
				topicOptions: [],
				selectedOptions: [],
				selectedFilterOptions: [],
				userOptions:[],
			}
		},
		components: {
		    quillEditor
		 },
		mounted:function(){
			if(this.activeName=="search"){
				console.log('get datas')
				this.getDatas();
			}
		},
		created: function() {
			this.pagedDataTable=new PagedDataTable()

			this.user=jwtUtils.getUser()
			this.getTopicOptions(0).then(data=>{
				console.log('data',data)
				this.topicOptions=data
			}).catch(err=>{
				console.log('err',err)
			})
		}
	}
</script>

<style>
#editor-container {
    height: 350px;
}
</style>