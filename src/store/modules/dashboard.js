const state = () => ({
    showSideMenu: true,
    showProfileEditor: false,
    showNotification: false,
    currentRoute: null,
    viewSwitch: 'card',
    searchKeyword: '',
    filterValue: '',
    panelData: [{
        title: '逾期未還',
        icon: "fas fa-bomb",
        bgColor: 'red',
        count: 0
    }],
    router: [{
        link: "member",
        icon: "fas fa-users",
        title: "會員查詢",
    }, {
        link: "goods",
        icon: "fas fa-gifts",
        title: "物件管理",
    }, {
        link: "iou",
        icon: "fas fa-receipt",
        title: "租借管理",
    }, {
        link: "balance",
        icon: "fas fa-funnel-dollar",
        title: "帳務核對",
    }],
})

const mutations = {
    triggerSideMenu(state, status) {
        switch (status) {
            case undefined:
                state.showSideMenu = !state.showSideMenu;
                break;

            case true:
                state.showSideMenu = true;
                break;

            case false:
                state.showSideMenu = false;
                break;

            default:// do nothing
                break;
        }
    },
    triggerViewSwitch(state, status) {
        state.viewSwitch = status;
    },
    checkCurrentRoute(state, name) {
        state.currentRoute = name;
    },
    showProfileEditor(state) {
        state.showProfileEditor = !state.showProfileEditor;
    },
    showNotification(state) {
        state.showNotification = !state.showNotification;
    },
    setSearchKeyword(state, word) {
        state.searchKeyword = word;
    },
    setFilterValue(state, value) {
        state.filterValue = value;
    },
    computedPanelDataCount(state) {
        state.panelData.forEach((element) => {
            if (element.title === "逾期未還") {
                element.count = this.state.iou.iou.filter(
                    (item) => item.status === 0 && new Date(item.returnDate) < new Date()
                ).length;
            }
        });
    }
}

export default {
    namespaced: true,
    state,
    mutations
}