const state = () => ({
    showGoodsEditor: false,
    // 商品狀態碼
    // 0:可租借
    // 1:暫停租借
    // 2:已下架
    goods: [{
        id: "1",
        title: "商品 A",
        pic: require("@/assets/img/geo-chierchia-qZ1KmFjfQq8-unsplash.jpg"),
        status: 0,
        price: '500',
        stock: '40',
        summary: '商品 A 的介紹！商品 A 的介紹！商品 A 的介紹！商品 A 的介紹！商品 A 的介紹！'
    }, {
        id: "2",
        title: "商品 B",
        pic: require("@/assets/img/mikkel-bech-yjAFnkLtKY0-unsplash.jpg"),
        status: 1,
        price: '1500',
        stock: '20',
        summary: '商品 B 的介紹！商品 B 的介紹！商品 B 的介紹！商品 B 的介紹！商品 B 的介紹！'
    }, {
        id: "3",
        title: "商品 C",
        pic: require("@/assets/img/wolfofworld-5_M58FxzfDs-unsplash.jpg"),
        status: 2,
        price: '3000',
        stock: '3',
        summary: '商品 C 的介紹！商品 C 的介紹！商品 C 的介紹！商品 C 的介紹！商品 C 的介紹！'
    }],
})

const mutations = {
    showGoodsEditor(state, status) {
        state.showGoodsEditor = status;
    },
    computedGoodsStock(state) {
        const lendedGoods = this.state.iou.iou.filter(item => item.status !== 1);

        for (let a = 0; a < state.goods.length; a++) {
            for (let b = 0; b < lendedGoods.length; b++) {
                let needDeduction = lendedGoods[b].purchase.find(item => item.goods.id === state.goods[a].id);
                if (needDeduction) {
                    state.goods[a].stock -= needDeduction.qty;
                    (state.goods[a].stock).toString();

                    if (state.goods[a].stock == 0) {
                        state.goods[a].status = 2;
                    }
                }
            }
        }
    },
    updateGoodsData(state, data) {
        const item = state.goods.find(item => item.id === data.id);
        if (item) {
            Object.assign(item, data);
        } else {
            state.goods.push(data);
        }
    },
    updateGoodsStock(state, data) {
        if (data.isNew) {
            const newestIou = this.state.iou.iou.find(item => item.sn === data.sn);

            for (let a = 0; a < state.goods.length; a++) {
                let needDeduction = newestIou.purchase.find(item => item.goods.id === state.goods[a].id);
                if (needDeduction) {
                    state.goods[a].stock -= needDeduction.qty;
                    (state.goods[a].stock).toString();

                    if (state.goods[a].stock == 0) {
                        state.goods[a].status = 2;
                    }
                }
            }
        } else {
            const returnIou = this.state.iou.iou.find(item => item.sn === data.sn);

            for (let a = 0; a < state.goods.length; a++) {
                let needDeduction = returnIou.purchase.find(item => item.goods.id === state.goods[a].id);
                if (needDeduction) {
                    state.goods[a].stock += needDeduction.qty;
                    (state.goods[a].stock).toString();
                }
            }
        }
    },
}
const actions = {
    updateGoodsData({ commit }, { data }) {
        commit('updateGoodsData', data);
    },
}
export default {
    namespaced: true,
    state,
    actions,
    mutations
}