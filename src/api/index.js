import axios from 'axios';
import { useRouter } from "vue-router";

const router = useRouter();
const instance = axios.create({
    headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response, message } = error
        if (response) {
            switch (response.status) {
                case 404:
                    console.warn("你要找的頁面不存在")
                    break
                case 500:
                    console.warn("程式發生問題")
                    break
                default:
                    console.warn(message)
            }

            return router.push({ name: "Error" });
        }
        if (!window.navigator.onLine) {
            alert("網路出了點問題，請重新連線後重整網頁");
            return;
        }
        return Promise.reject(error);
    }
);

export const getMembers = (memberNumber) => instance.get(`https://randomuser.me/api/?results=${memberNumber}`)
