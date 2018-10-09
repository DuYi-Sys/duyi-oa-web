export default{
	sleep:async function(ms){
		await innerSleep(ms)
	},
	
}
function innerSleep(ms){
	return new Promise(resolve => setTimeout(resolve, ms))
}
