import { getMembers } from "@/api/index.js";

const state = () => ({
    showIouView: false,
    members: [],
})

const getters = {
    sortedMembers: state => {
        return state.members.sort((a, b) => {
            return new Date(a.registered.date) <
                new Date(b.registered.date)
                ? 1
                : -1;
        })
    }
}

const mutations = {
    showIouView(state, status) {
        state.showIouView = status;
    },
    getMembers(state, members) {
        state.members = members;
    },
}

const actions = {
    getMembers({ commit }) {
        commit('triggerLoadingArea', true, { root: true });

        getMembers(10).then((response) => {
            commit('getMembers', response.data.results);
            commit('triggerLoadingArea', false, { root: true });
            commit("iou/distributionLessee", null, { root: true });
        }).catch((error) => {
            console.warn(error);
        });
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}