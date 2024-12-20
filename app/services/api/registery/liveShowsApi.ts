import { CallParamsApi, ExecutableFunctionType } from "./api.types";

export interface LiveShowsAPIType {
  get: ExecutableFunctionType;
  post: ExecutableFunctionType;
  patch: ExecutableFunctionType;
  delete: ExecutableFunctionType;
  skus: ExecutableFunctionType;
  skuAdd: ExecutableFunctionType;
  skuDelete: ExecutableFunctionType;
  skuSequence: ExecutableFunctionType;
  platform:ExecutableFunctionType;
}

export const LiveShowsApi: LiveShowsAPIType = {
  get: ({ call, urlSuffix = "", props }) => {
    const data: CallParamsApi = {
      url: 'liveshows/' + urlSuffix,
      debounceTime:urlSuffix?500:0,
      meta: {
        errorMessage: "Unable to fetch live show!"
      }
    };
    call({ ...data, meta:{...data?.meta, ...props?.meta} })
  },
  post:({call, props})=>{
    const data: CallParamsApi = {
      url:'liveshows/',
      method:'POST',
      contentType:'formdata',
      meta:{
        showSuccessMessage:true,
        successMessage:"Successfully created live show!",
        errorMessage:"Unable to create live show!",
      }
    }
    call({...data, ...props})
  },
  patch:({call, urlSuffix, props})=>{
    const data: CallParamsApi = {
      url:'liveshows/' + urlSuffix,
      method:'PATCH',
      contentType:'formdata',
    }
    call({...data, ...props})
  },
  delete: ({ call, urlSuffix, props }) => {
    const data: CallParamsApi = {
      url: 'liveshows/' + urlSuffix, 
      method: 'DELETE',
      invalidateQueryUrl:'liveshows/',
      meta: {
        errorMessage:"Unable to delete live show!"
      }
    };
    call({ ...data, ...props, meta:{...data?.meta, ...props?.meta} })
  },
  skus: ({ call, urlSuffix, props }) => {
    const data: CallParamsApi = {
      url: 'liveshow_sku/' + urlSuffix,
    };
    call({ ...data, ...props })
  },
  skuAdd: ({ call, urlSuffix, props }) => {
    const data: CallParamsApi = { 
      url: 'liveshow_sku/',
      method: 'POST',
      invalidateQueryUrl:'liveshows/',
    };
    call({ ...data, ...props })
  },
  skuSequence: ({ call, urlSuffix, props }) => {
    const data: CallParamsApi = { 
      url: 'liveshow_sku/'+urlSuffix,
      method:'PATCH',
      meta:{
        showErrorMessage:false
      }
    };
    call({ ...data, ...props })
  },
  skuDelete: ({ call, urlSuffix, props }) => {
    const data: CallParamsApi = {
      url: 'liveshow_sku/' + urlSuffix,
      method: 'DELETE',
    };
    call({ ...data, ...props })
  },
  platform:({call, urlSuffix, props})=> {
    const data:CallParamsApi = {
      url: 'platform/',
    }
    call({ ...data, ...props})
  },
}


