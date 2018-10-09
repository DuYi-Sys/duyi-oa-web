export default {
	saveToken(state, token) {
		state.token = token
	},
	setRoles(state,roles){
		state.roles=roles;

	},
	setDepts(state,depts){
		state.depts=depts;

	},
	setPositions(state,positions){
		state.positions=positions;
	},
	setOrganizations(state,organizations){
		state.organizations=organizations;

	},
	setDistricts(state,districts){
		state.districts=districts;

	}

}