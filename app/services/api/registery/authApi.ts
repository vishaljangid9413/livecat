import { CallParamsApi, ExecutableFunctionType } from "./api.types";

export interface AuthAPIType {
    sendOtp: ExecutableFunctionType;
    login: ExecutableFunctionType;
    register: ExecutableFunctionType;
    userUpdate: ExecutableFunctionType;
    delete: ExecutableFunctionType;
    profile: ExecutableFunctionType;
    profileUpdate: ExecutableFunctionType;
}

export const AuthAPI: AuthAPIType = {
    sendOtp: ({ call, props }) => {
        const data: CallParamsApi = {
            url: 'otp/',
            method: 'POST',
        };
        call({ ...data, ...props })
    },
    login: ({ call, props }) => {
        const data: CallParamsApi = {
            url: 'auth/login/',
            method: 'POST',
            meta: {
                store: {
                    name: 'authStore',
                    keyProp: 'user'
                }
            }
        };
        call({ ...data, ...props })
    },
    register: ({ call, props }) => {
        const data: CallParamsApi = {
            url: 'auth/register/',
            method: 'POST',
            meta: {
                store: {
                    name: 'authStore',
                    keyProp: 'user'
                }
            }
        };
        call({ ...data, ...props })
    },
    userUpdate: ({ call, urlSuffix, props }) => {
        const data: CallParamsApi = {
            url: `users/${urlSuffix}`,
            method: "PATCH",
            meta: {
                errorMessage: "Unable to update profile!",
            }
        };
        call({ ...data, ...props, meta: { ...data.meta, ...props?.meta } })
    },
    delete: ({ call, urlSuffix, props }) => {
        const data: CallParamsApi = {
            url: 'users/' + urlSuffix,
            method: 'DELETE',
            meta: {
                successCallback({ rootStore }) {
                    rootStore.authStore.clearToken()
                }
            }
        };
        call({ ...data, ...props, meta: { ...data.meta, ...props?.meta } })
    },
    profile: ({ call, props }) => {
        const data: CallParamsApi = {
            url: 'profile/',
            meta: {
                showSuccessMessage: false,
                store: {
                    name: 'authStore',
                    keyProp: 'profile'
                }
            }
        }
        call({ ...data, ...props, meta: { ...data?.meta, ...props?.meta } })
    },
    profileUpdate: ({ call, urlSuffix, props }) => {
        const data: CallParamsApi = {
            url: "profile/" + urlSuffix,
            method: "PATCH",
            contentType: "formdata",
        }
        call({ ...data, ...props })
    }
}


export interface DummyApiType {
    fetch: ExecutableFunctionType;
}

export const DummyApi: DummyApiType = {
    fetch: ({ call, props }) => {
        const filteredData: CallParamsApi = {
            url: [
                { 'products': 'https://dummyjson.com/products/?delay=1000' },
                { 'recipes': 'https://dummyjson.com/recipes/?delay=4000' },
            ],
            ...props
        };
        call(filteredData)
    }
}

