const state = () => ({
    showIouEditor: false,
    // 借單狀態碼
    // 0:出借中
    // 1:已歸還
    // 2:逾期
    iou: [{
        sn: "20200618",
        returnDate: '2021-01-15',
        status: 1,
        notes: null,
        purchase: [{
            goods: {
                id: "1",
                title: "商品 A",
                pic: require("@/assets/img/geo-chierchia-qZ1KmFjfQq8-unsplash.jpg"),
                price: '500',
            },
            qty: 1,
        }, {
            goods: {
                id: "3",
                title: "商品 C",
                pic: require("@/assets/img/wolfofworld-5_M58FxzfDs-unsplash.jpg"),
                price: '3000',
            },
            qty: 1,
        }],
        lessee: null,
        created: '2021-01-09 10:09'
    }, {
        sn: "20200619",
        returnDate: '2021-01-24',
        status: 0,
        notes: 'saddasddaddadsas',
        purchase: [{
            goods: {
                id: "1",
                title: "商品 A",
                pic: require("@/assets/img/geo-chierchia-qZ1KmFjfQq8-unsplash.jpg"),
                price: '500',
            },
            qty: 8,
        }, {
            goods: {
                id: "2",
                title: "商品 B",
                pic: require("@/assets/img/mikkel-bech-yjAFnkLtKY0-unsplash.jpg"),
                price: '1500',
            },
            qty: 2,
        }],
        lessee: null,
        created: '2021-01-11 16:34'
    }],
})

const mutations = {
    showIouEditor(state, status) {
        state.showIouEditor = status;
    },
    distributionLessee(state) {
        const members = this.state.member.members;

        for (let index = 0; index < state.iou.length; index++) {
            const element = state.iou[index];
            element.lessee = members[index];
            if (element.status === 0 && new Date(element.returnDate) < new Date) {
                element.status = 2;
            }
        }
    },
    addIouData(state, data) {
        state.iou.push(data);
    },
    updateIouStatus(state, data) {
        const updateTarget = state.iou.find(item => item.sn == data.sn);
        updateTarget.status = 1;
    },
}

const actions = {
    addIouData({ commit }, { data }) {
        commit('addIouData', data);
        data.isNew = true;
        setTimeout(() => {
            commit("goods/updateGoodsStock", data, { root: true });
        }, 250);
    },
    updateIouStatus({ commit }, { data }) {
        commit('updateIouStatus', data);
        data.isNew = false;
        setTimeout(() => {
            commit("app/computedPanelDataCount", null, { root: true });
            commit("goods/updateGoodsStock", data, { root: true });
        }, 250);
    },
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}