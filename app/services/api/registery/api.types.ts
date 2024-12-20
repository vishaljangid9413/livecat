import { RootStore } from "app/models";

// Define parameters for the API call
interface StoreParams<K extends keyof RootStore> {
    name: K; // The selected store (e.g., 'authStore')
    keyProp: keyof RootStore[K]; // Dynamically fetch keys of the selected store
}

interface ErrorCallbackParams {
    error: any;
    query: any;
    rootStore: RootStore
}

interface SuccessCallbackParams {
    data: any;
    query: any;
    rootStore: RootStore
}

interface SettledCallbackParams {
    data: any;
    error: any;
    query: any;
    rootStore: RootStore
}

interface MetaParams {
    showErrorMessage?: boolean;
    showSuccessMessage?: boolean;
    errorMessage?: string;
    successMessage?: string;
    errorCallback?: ((errorData: ErrorCallbackParams) => void);
    successCallback?: ((successData: SuccessCallbackParams) => void);
    settledCallback?: ((settledData: SettledCallbackParams) => void);
    store?: StoreParams<keyof RootStore>; // Dynamic typing for store and keyProp
}

export interface CallParamsApi {
    url?: string | { [key: string]: string }[];
    dependentQueryUrl?: string; // Optional, query url to dependent query on primary query
    invalidateQueryUrl?: string; // Optional, query url to refresh after mutation
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'; // Optional, default is 'GET'
    data?: any; // Data can be of any type
    contentType?: 'formdata' | 'json'; // Optional, default is 'json'
    onMutateCallback?: (newData: any) => Promise<void | { previousData: any }>; // Optional optimistic update callback
    forceRefetch?: boolean; //Option to force Refetch Query
    debounceTime?: number
    meta?: MetaParams;
}

export type MethodPropsType = {
    call: any,
    urlSuffix?: string
    props?: CallParamsApi,
}

export type ExecutableFunctionType = (args: MethodPropsType) => void;

