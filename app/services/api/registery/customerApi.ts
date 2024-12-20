import { CallParamsApi, ExecutableFunctionType } from "./api.types";

export interface CustomerAPIType {
    get: ExecutableFunctionType;
    post: ExecutableFunctionType;
    patch: ExecutableFunctionType;
    delete: ExecutableFunctionType;
}

export const CustomerApi:CustomerAPIType = {
    get:({call, props})=>{
        const data: CallParamsApi = {
            url: 'users/',
          };
        call({...data, ...props})
    },
    post:({call, props})=>{
      const data: CallParamsApi ={
        url:'users/',
        method:'POST',
        meta:{
          showSuccessMessage:true,
          successMessage:'Customer added successfully!',
          errorMessage:"Unable to add customer!"
        }
      }
      call({...data, ...props, meta:{...data?.meta, ...props?.meta}})
    },    
    patch:({call, urlSuffix, props})=>{
      const data: CallParamsApi ={
        url:'users/' + urlSuffix,
        method:'PATCH',
        meta:{
          showSuccessMessage:true,
          successMessage:'Customer updated successfully!',
          errorMessage:"Unable to update customer!"
        }
      }
      call({...data, ...props, meta:{...data?.meta, ...props?.meta}})
    },    
    delete:({call, urlSuffix, props})=>{
        const data: CallParamsApi = {
            url: 'users/' + urlSuffix,
            method:'DELETE',
            invalidateQueryUrl:'users/',
            meta:{
              successMessage:'Customer deleted successfully!',
              showSuccessMessage:true,
            }
          };
        call({...data, ...props})
    },
}


