import { CallParamsApi, ExecutableFunctionType } from "./api.types";

export interface VendorAPIType {
    get: ExecutableFunctionType;
    post: ExecutableFunctionType;
    patch: ExecutableFunctionType;
    delete: ExecutableFunctionType;
}

export const VendorApi:VendorAPIType = {
    get:({call, urlSuffix="", props})=>{
        const data: CallParamsApi = {
            url: 'vendors/' + urlSuffix,
          };
        call({...data, ...props})
    },
    post:({call, props})=>{
      const data: CallParamsApi ={
        url:'vendors/',
        method:'POST',
        contentType:'formdata',
        meta:{
          showSuccessMessage:true,
          successMessage:'Vendor added successfully!'
        }
      }
      call({...data, ...props})
    },
    patch:({call, urlSuffix, props})=>{
      const data: CallParamsApi ={
        url:'vendors/' + urlSuffix,
        method:'PATCH',
        contentType:'formdata',
        meta:{
          showSuccessMessage:true,
          successMessage:'Vendor details updated successfully!'
        }
      }
      call({...data, ...props, meta:{...data.meta, ...props?.meta}})
    },
    delete:({call, urlSuffix = '', props})=>{
        const data: CallParamsApi = {
            url: 'vendors/' + urlSuffix,
            method:'DELETE',
            invalidateQueryUrl:'vendors/',
            meta:{
              showSuccessMessage:true,
              successMessage:'Vendor deleted successfully!',
            }
          };
        call({...data, ...props})
    },
}


