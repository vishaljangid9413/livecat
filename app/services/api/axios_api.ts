import AsyncStorage from '@react-native-async-storage/async-storage';
import configProd from 'app/config/config.prod';
import axios, { AxiosResponse } from 'axios';


type AxiosApiParams = {
    url: string;
    data?: any; // Optional, as POST and PATCH will need this, but DELETE might not
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    type?: 'formdata' | 'json'; // Added type property
    signal?: any; // Added type property
}

const axiosMethods = {
    get: axios.get,
    post: axios.post,
    patch: axios.patch,
    put: axios.put,
    delete: axios.delete,
};


export const axiosApi = async <T>({ method, url, data, type, signal }: AxiosApiParams): Promise<any> => {
    const { formatUrl, formatData, header, response } = $Handler
    const methodLower = method.toLowerCase() as keyof typeof axiosMethods;
    if (!axiosMethods[methodLower]) {
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    
    const result: AxiosResponse<T> = await axiosMethods[methodLower](
        formatUrl(url),
        formatData(data, type),
        await header(type, signal)
    )
    return response(result)
}


const $Handler = {
    formatUrl(url: string) {
        return url.includes('http') ? url : `${configProd.API_URL}${url}`
    },
    formatData(data: any, type?: string) {
        if (type === 'formdata') {
            const formData: any = new FormData();
            for (const [key, value] of Object.entries(data)) {
                formData.append(key, value)
            }
            return formData
        }
        return data
    },
    header: async (type?: string, signal?: any) => {
        // *Token Authorization embedding
        const token = await AsyncStorage.getItem('token')
        if (token) {
            axios.defaults.headers.common['Authorization'] = "Token " + token.replace(/['"]+/g, '')
        }
        return {
            headers: {
                signal,
                'Content-Type': type === 'formdata' ?
                    'multipart/form-data' : 'application/json'
            },
            validateStatus: (status: number) => (status < 500)
        }
    },
    response(response: any) {
        if (response?.data?.status === 'error') {
            throw response?.data
        } else if (response?.data?.status === undefined && (Math.round(response.status / 200) !== 1)) {
            throw { 'message': 'Something Went Wrong!' }
        }
        return response?.data
    }
}





// This function is also giving the functionality of aborting queries, but its not working right now
// export const fetchData = async (url: string, signal:any): Promise<ApiResponse<any>> => {
//     const CancelToken = axios.CancelToken
//     const source = CancelToken.source()
//     const correct_url = url.includes('http') ? url:`${configProd.API_URL}${url}`
//     const response = axios.get(correct_url);

//     // Cancel the request if TanStack Query signals to abort
//     signal?.addEventListener('abort', () => {
//         source.cancel('Query has been cancelled!')
//         })
//     return response;
// };  
