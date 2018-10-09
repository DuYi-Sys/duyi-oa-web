
import { getDatas, addData, updateData, getData, deleteData } from '@/services/commons/httpservice'

class PagedDataTable {
	constructor() {
		this.total = 0;
		this.pageSize = 5;
		this.page = 1;
	}
	init() {
		this.total = 0;
		this.pageSize = 5;
		this.page = 1;
	}
	change(p) {
		this.page = p;
	}
	getDatas(url, params) {
		let the=this;
		params.page=this.page-1;
		params.size = this.pageSize;
		return new Promise(function(resolve, reject) {
			getDatas(url, params).then(res => {
				the.total = res.data.totalElements;
				the.page = res.data.number + 1;
				resolve(res.data.content);
			}).catch(err=>{
				reject(err)
			})
		})
	}
	
}
export default PagedDataTable;