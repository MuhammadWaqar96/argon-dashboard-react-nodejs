import axios from 'axios';
import config from "../config";

// const https = require('https');
//
// const agent = new https.Agent({
//     rejectUnauthorized: false,
// });

const instance = axios.create({
    baseURL: config.WS_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


instance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // config.headers["Authorization"] = 'Bearer ' + token;  // for Spring Boot back-end
        config.headers["x-access-token"] = token; // for Node.js Express back-end
        config.headers.Authentication = `Bearer ${token}`
    }
    return config;
},
    (error) => {
        return Promise.reject(error);
    }
);


instance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        console.log(err)
        const originalConfig = err.config;

        if (originalConfig.url !== "/auth/signin" && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const rs = await instance.post("/auth/refresh", {
                        refreshToken: localStorage.getItem('refreshToken'),
                    });

                    const { accessToken } = rs.data;
                    localStorage.setItem("token",accessToken)


                    return instance(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    }
);
// instance.interceptors.request.use(async (config) => {
//     const token = localStorage.getItem('token');
//     return config;
// });

export const getAll = async () => (

    await instance.get('user/profile/all')
);

export const register = async (name, email, password, phone, agency, role) => (
    await instance.post('auth/signup', { name, email, password, phone, agency, role })
);

export const confirmRegister = async id => (
    await instance.post(`users/confirm/${id}`)
);

export const forgotPassword = async email => (
    await instance.post('users/forgotpassword', { email })
);

export const confirmReset = async (id, password) => (
    await instance.post(`users/resetpass/${id}`, { password })
);

export const login = async (email, password) => (
    await instance.post('auth/login', { email, password })
);

export const logout = async token => (
    await instance.post('users/logout', { token })
);

export const edit = async (userID, name, email) => (
    await instance.put('/user/profile', { name })
);
