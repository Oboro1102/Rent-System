import axios from 'axios';
import { useRouter } from "vue-router";

const router = useRouter();
const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
});

instance.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    console.warn("你要找的頁面不存在")
                    router.push({ name: "Error" });
                    break
                case 500:
                    console.warn("程式發生問題")
                    router.push({ name: "Error" });
                    break
                default:
                    console.warn(error.message)
            }
        }
        if (!window.navigator.onLine) {
            alert("網路出了點問題，請重新連線後重整網頁");
            return;
        }
        return Promise.reject(error);
    }
);

export const getMembers = (memberNumber) => instance.get('?results=' + `${memberNumber}`)
