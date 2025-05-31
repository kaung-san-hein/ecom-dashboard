import axios, { AxiosRequestConfig } from 'axios'

export const host = 'http://localhost:3000/api/v1'

export const setAccessToken = (token: string) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
}

const allowedMethods = ['get', 'post', 'put', 'delete', 'patch'] as const;
type HttpMethod = typeof allowedMethods[number];

export const call = async (method: HttpMethod, path: string, data?: unknown) => {
    if (!allowedMethods.includes(method)) {
        throw new Error(`Invalid HTTP method: ${method}`);
    }

    const config: AxiosRequestConfig = {
        method,
        url: `${host}/${path}`,
        data,
    };

    const response = await axios(config);
    return response.data;
};
