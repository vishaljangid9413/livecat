import { CallParamsApi, ExecutableFunctionType } from "./api.types";

export interface CatalogueAPIType {
    products: ExecutableFunctionType;
    skus: ExecutableFunctionType;
    skuDelete: ExecutableFunctionType;
    uploadImg: ExecutableFunctionType;
    bulkUpload: ExecutableFunctionType;
    downloadSample: ExecutableFunctionType;
}

export const CatalogueAPI:CatalogueAPIType = {
    products:({call, props})=>{
        const data: CallParamsApi = {
            url: 'products/',
          };
        call({...data, ...props})
    },
    skus:({call, props})=>{
        const data: CallParamsApi = {
            url: 'sku_details/',
          };
        call({...data, ...props})
    },
    skuDelete:({call, urlSuffix, props})=>{
        const data: CallParamsApi = {
            url: 'sku_details/' + urlSuffix,
            method:'DELETE',
            invalidateQueryUrl:'sku_details/',
            meta:{
              showSuccessMessage:true,
              successMessage:'Product deleted successfully!',
            }
          };
        call({...data, ...props})
    },
    uploadImg:({call, props})=>{
        const data: CallParamsApi = {
            url: 'product_files/',
            method:'POST',
            contentType:'formdata',
            invalidateQueryUrl:'sku_details'
          };
        call({...data, ...props, data:{...props?.data, 'file_type':'image', 'is_public':true}})
    }, 
    bulkUpload:({call, props})=>{
        const data: CallParamsApi = {
            url: 'bulk_upload/product/',
            method:'POST',
          };
        call({...data, ...props})
    }, 
    downloadSample:({call, props})=>{
      const data: CallParamsApi = {
        url: 'download_sample_file/',
        method:'POST',
        meta:{
          errorMessage:'Unable to download file!'
        }
      };
    call({...data, ...props, meta:{...data?.meta, ...props?.meta}})
    }
}


