import { CallParamsApi, ExecutableFunctionType } from "./api.types";

export interface OrderAPIType {
  get: ExecutableFunctionType;
  post: ExecutableFunctionType;
  patch: ExecutableFunctionType;
  bulkUpload: ExecutableFunctionType;
}

export const OrderAPI: OrderAPIType = {
  get: ({ call, urlSuffix = "", props }) => {
    const data: CallParamsApi = {
      url: 'orders/' + urlSuffix,
    };
    call({ ...data, ...props })
  },
  post: ({ call, props }) => {
    const data: CallParamsApi = {
      url: 'orders/',
      method: 'POST',
      meta: {
        errorMessage: 'Unable to create order!'
      }
    }
    call({ ...data, ...props, meta: { ...data?.meta, ...props?.meta } })
  },
  patch: ({ call, urlSuffix, props }) => {
    const data: CallParamsApi = {
      url: 'orders/' + urlSuffix,
      method:'PATCH',
      meta: {
        errorMessage: 'Unable to update order!'
      }
    }
    call({ ...data, ...props, meta: { ...data?.meta, ...props?.meta } })
  },
  bulkUpload: ({ call, props }) => {
    const data: CallParamsApi = {
      url: 'bulk_upload/order/',
      method: 'POST',
      contentType: 'formdata',
      invalidateQueryUrl: 'orders/'
    };
    call({ ...data, ...props })
  },
}


