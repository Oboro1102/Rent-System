const state = () => ({
    users: [{
        id: 'jijo3%2d',
        title: "萬能器材出租屋",
        mobile: '0965223174',
        username: 'Vendor1',
        password: 'sd$d4saRad',
    }],
})

const mutations = {
    updateUserData(state, data) {
        const item = state.users.find(item => item.id === data.id);
        if (item) {
            Object.assign(item, data);
        } else {
            state.users.push(data);
        }
    },
}

const actions = {
    updateUserData({ commit }, { data }) {
        commit('updateUserData', data);
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}