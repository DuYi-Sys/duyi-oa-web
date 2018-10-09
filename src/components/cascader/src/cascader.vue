<template>
	<el-cascader :options="cascaderOptions" v-model="selected" clearable :size="'medium'" @active-item-change="handleItemChange" @change="handleItemChange"  ></el-cascader>
</template>

<script>
	import halService from '@/services/commons/httpservice';
	import sleepUtils from '@/services/commons/sleepUtils';
	export default {
		name:'Cascader',
		data() {
			return {
				cascaderOptions: [],
				selected: [],
				tempSelected:[],
				created:false,
				cache:[]
			}
		},
		methods: {
			handleItemChange(vals){
				this.itemChange(vals)
			},
			async itemChange(vals) {
				if(vals.length===0){
					return;
				}
//				console.log('vals',vals)
				let id = vals[vals.length - 1];
				
				if(vals.length==this.inputOptions.length) {
					if(this.multiple){
						this.$emit('change',vals);
					}else{
						let index=vals.length-2>0?vals.length-2:0;
						if(this.inputOptions[vals.length-1].type=='Object'){
//							console.log('this.cache[vals.length-1]',this.cache[vals.length-1])
							this.$emit('change',this.cache[index].get(id));
						}else{
							this.$emit('change',id);
						}
						
					}
					
					return;
				}
				let parentInputOption = this.getInputOption(vals.length);
				let parentCascaderOption = this.getCascaderOption(vals);
			
				if(parentCascaderOption.children.length > 0) {
					return
				}

				let inputOption = this.getInputOption(vals.length + 1);
				
				let childCascaderOptions = [];
				
				
				let datas= await halService.getRelateds({name:parentInputOption.target},id, parentInputOption.childTarget)
				this.cache[vals.length - 1]=new Map();
				
				for(let op of datas) {
					let value=op[inputOption.value]
					this.cache[vals.length - 1].set(value,op)
					let cascaderOption = {
						value: value,
						label: op[inputOption.label]
					}
					if(vals.length<this.inputOptions.length-1) {
						cascaderOption.children = [];
					}
					childCascaderOptions.push(cascaderOption);
				}
				parentCascaderOption.children = childCascaderOptions;
			},
			getCascaderOption(vals) {
				let cascaderOptions = this.cascaderOptions;
				let length = vals.length
				for(let i = 0; i < length; i++) {
					for(let cascaderOption of cascaderOptions) {
						if(cascaderOption.value == vals[i]) {
							if(i === (length - 1)) {
								return cascaderOption;
							} else {
								if(cascaderOption.children) {
									cascaderOptions = cascaderOption.children;
									break;
								}
								return null;
							}
						}
					}
				}
			},
			getInputOption(length) {
				return this.inputOptions[length - 1]
			},
			async fillSelected(level,inputOption,id){
				while(level>0){
					let data=	await halService.getOneById({name:inputOption.target},id)
					level--;
					this.tempSelected[level]=data.id;
					id=data[inputOption.relId];
					inputOption=this.getInputOption(level)
				}
				this.selected=this.tempSelected
			},
			async syncHandleItemChange(vals){
				while(!this.created){
					await sleepUtils.sleep(10)
				}
				for(let i=0;i<this.selected.length;i++){
						let s=new Array(i+1);
						for(let j=0;j<i+1;j++){
							s[j]=this.selected[j];
						}
						await this.itemChange(s);
				}
				
			}
		},
		props: {
			value:[Number,String,Array,Object],
			placeholder:String,
			inputOptions:Array,
			multiple:Boolean,
		},
		watch: {
			value: function(val) {
				if(val==null){
					this.selected=[];
					return;
				}
				
				if(this.selected.length===0){
					let level=this.inputOptions.length;
					
					this.tempSelected=new Array(level)
					let inputOption=this.getInputOption(level)
					let value=val;
					if(inputOption.type=='Object'){
						value=val[inputOption.value]
					}
					this.fillSelected(level,inputOption,value).then(()=>{
						this.syncHandleItemChange()
						
					})
				}
			}
		},
		created() {
			let inputLength = this.inputOptions.length;
			let inputOption = this.inputOptions[0];
			this.cache[0]=new Map()
			let params = {
					parentId: 0,
				};
			getDatas("/api/topic/getChildTopic", params).then(res => {
				this.topicOptions=[];
				this.topics=res.data;
				for(let opt of this.topics){
					this.topicOptions.push({value:opt.id,label:opt.name,children:[]})
				}
			}).catch(err=>{
				
			})
			httpservice.getDatas({
				name: inputOption.target
			}).then(({content})=>{
				for(let data of content) {
					let value=data[inputOption.value];
					this.cache[0].set(value,data)
					this.cascaderOptions.push({
						value:value,
						label: data[inputOption.label],
						children: []
					})
				}
				this.created=true;
			})

		},

	}
</script>

<style>

</style>