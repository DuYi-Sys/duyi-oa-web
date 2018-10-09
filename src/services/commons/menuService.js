let menus=new Map();
menus.set('admin',['/roles','/operations','/users','/questionBank','/studentInput','/studentInfos','/studentQuestion','/studentQuestionType','/studentAnswer','/downloadFileType','/downloadFile','/studentUser'])
menus.set('teacher',['/questionBank','/studentInput'])
menus.set('sales',['/studentInfos'])
//menus.set('teachingAssistant',[''])


export const getMenus = () => {
	return menus;
}
