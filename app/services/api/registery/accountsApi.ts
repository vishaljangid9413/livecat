import { CallParamsApi, ExecutableFunctionType } from "./api.types";

export interface AccountsAPIType {
    personal: {get:ExecutableFunctionType, patch:ExecutableFunctionType};
    address: {get:ExecutableFunctionType, post:ExecutableFunctionType, patch:ExecutableFunctionType};
    bank: {get:ExecutableFunctionType, post:ExecutableFunctionType, patch:ExecutableFunctionType};
    business: {get:ExecutableFunctionType, post:ExecutableFunctionType, patch:ExecutableFunctionType};
}

export const AccountsAPI:AccountsAPIType = {
    personal:{
        get:({ call, props }) => {
            const data: CallParamsApi = {
              url: 'accounts/personal/',
              meta: {
                errorMessage: "Unable to fetch personal details!"
              }
            };
            call({ ...data, ...props })
          },
        patch:({ call, props }) => {
            const data: CallParamsApi = {
              url: 'accounts/personal/',
              method:'PATCH',
              meta: {
                showSuccessMessage:true,
                errorMessage: "Unable to update personal details!"
              }
            };
            call({ ...data, ...props })
          },
    },
    address:{
        get:({ call, urlSuffix ="", props }) => {
            const data: CallParamsApi = {
              url: 'addresses/' + urlSuffix,
              meta: {
                errorMessage: "Unable to fetch addresses!"
              }
            };
            call({ ...data, ...props })
          },
        post:({ call, props }) => {
            const data: CallParamsApi = {
              url: 'addresses/',
              method:'POST',
              invalidateQueryUrl:'addresses/',
              meta: {
                showSuccessMessage:true,
                successMessage:"Successfully created address!",
                errorMessage: "Unable to create address!"
              }
            };
            call({ ...data, ...props, meta:{ ...data?.meta, ...props?.meta} })
          },
        patch:({ call, urlSuffix = "", props }) => {
            const data: CallParamsApi = {
              url: 'addresses/' + urlSuffix,
              method:'PATCH',
              invalidateQueryUrl:'addresses/',
              meta: {
                showSuccessMessage:true,
                successMessage:"Successfully updated address!",
                errorMessage: "Unable to update address!"
              }
            };
            call({ ...data, ...props })
          },
    },
    bank:{
        get:({ call, props }) => {
            const data: CallParamsApi = {
              url: 'accounts/bank/',
              meta: {
                errorMessage: "Unable to fetch bank details!"
              }
            };
            call({ ...data, ...props })
          },
        post:({ call, props }) => {
            const data: CallParamsApi = {
              url: 'accounts/bank/',
              method:'POST',
              invalidateQueryUrl:"accounts/bank/",
              meta: {
                showSuccessMessage:true,
                successMessage:"Successfully added bank details!",
                // errorMessage: "Unable to add bank details!"
              }
            };
            call({ ...data, ...props })
          }, 
        patch:({ call, urlSuffix = "", props }) => {
          const data: CallParamsApi = {
            url: `accounts/${urlSuffix}bank/`,
            method:'PATCH',
            invalidateQueryUrl:"accounts/bank/",
            meta: {
              showSuccessMessage:true,
              successMessage:"Successfully updated bank details!",
              // errorMessage: "Unable to update bank details!"
            }
          };
          call({ ...data, ...props })
        },
    },
    business:{
        get:({ call, props }) => {
            const data: CallParamsApi = {
              url: 'accounts/business/',
              meta: {
                errorMessage: "Unable to fetch business details!"
              }
            };
            call({ ...data, ...props })
          },
        post:({ call, props }) => {
            const data: CallParamsApi = {
              url: 'accounts/business/',
              method:'POST',
              contentType:'formdata',
              invalidateQueryUrl:"accounts/business/",
              meta: {
                showSuccessMessage:true,
                successMessage:"Successfully added business!",
                errorMessage: "Unable to added business!"
              }
            };
            call({ ...data, ...props })
          }, 
        patch:({ call, urlSuffix = "", props }) => {
          const data: CallParamsApi = {
            url: `accounts/${urlSuffix}business/`,
            method:'PATCH',
            contentType:'formdata',
            invalidateQueryUrl:"accounts/business/",
            meta: {
              showSuccessMessage:true,
              successMessage:"Successfully updated business details!",
              errorMessage: "Unable to update business details!"
            }
          };
          call({ ...data, ...props })
        },
    },
  
}

