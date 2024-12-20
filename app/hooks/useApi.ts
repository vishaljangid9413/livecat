import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { axiosApi } from 'app/services/api/axios_api';
import { rootApi, rootApiType } from 'app/services/api/registery/rootApi';
import { RootStore } from 'app/models';
import useMemoAfterMount from './useMemoAfterMount';
import { debounce } from 'app/utils/debouce';
import useImmediateState from './useImmediateState';

// Define type for Use Api Hook
type UseApiProps = {
    cacheTime?: number,
    staleTime?: number,
    searchText?: string|null
}
type UseApiResponse = {
    data: any,
    error: any,
    isLoading: any,
    dependentQueryData: any,
    queryClient: any,
    rootApi: rootApiType,
    call: (props: CallParams) => void,
    refetch: any,
    cancelQuery: any
}

// Define a type for the API response data
type ApiResponse<T> = T; // You can modify this to be more specific
type ApiError = {
    message: string;
};

// Define the data and function types for the API calls
type ApiMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type ContentTypes = 'formdata' | 'json';


interface StoreParams<K extends keyof RootStore> {
    name: K; // The selected store (e.g., 'authStore')
    keyProp: keyof RootStore[K]; // Dynamically fetch keys of the selected store
}

interface MetaParams {
    showErrorMessage?: boolean;
    showSuccessMessage?: boolean;
    errorMessage?: string;
    successMessage?: string;
    errorCallback?: ((errorData: any) => void) | undefined;
    successCallback?: ((successData: any) => void) | undefined;
    settledCallback?: ((settledData: any) => void) | undefined;
    store?: StoreParams<keyof RootStore>; // Dynamic typing for store and keyProp
}

type OptimisticCallback<T> = (newData: T) => Promise<void | { previousData: T }>;


// Define parameters for the API call
interface CallParams {
    url: string | { [key: string]: string }[];
    dependentQueryUrl?: string; // Optional, query url to dependent query on primary query
    invalidateQueryUrl?: string; // Optional, query url to refresh after mutation
    method?: ApiMethods; // Optional, default is 'GET'
    data?: any; // Data can be of any type
    contentType?: ContentTypes; // Optional, default is 'json'
    optimisticCallback?: OptimisticCallback<any>; // Optional optimistic update callback
    forceRefetch?: boolean;
    debounceTime?:number
    meta?: MetaParams;
}

interface MutationParams<T> {
    url: string;
    data?: any;
    method: 'POST' | 'PATCH' | 'DELETE';
    contentType?: ContentTypes;
    optimisticCallback?: OptimisticCallback<T>,
    invalidateQueryKey?:string
    meta: MetaParams
}

interface MutationContext {
    previousData?: any; // Holds the previous data for rollback
}


// Hook definition
export const useApi = <T = any>(
        { 
            cacheTime = 5*60*1000, 
            staleTime = 10000,
            searchText
        }: UseApiProps
    ): UseApiResponse => {
    const queryClient = useQueryClient();

    const [fetchQueryKey, setFetchQueryKey] = useState<string | { [key: string]: string }[] | null>(null);
    const stateDataRef = useRef({
        mutateQueryKey: null as string | { [key: string]: string }[] | null,
        dependentQueryKey: null as string | null,
        forceRefetch: false as boolean,
        method: 'GET' as ApiMethods,
        debounceTime: 0 as number
    });
    const metaDataRef = useRef<MetaParams>({
        showErrorMessage: true as boolean,
        showSuccessMessage: false as boolean,
        errorMessage: undefined as string | undefined,
        successMessage: undefined as string | undefined,
        errorCallback: undefined as (() => void) | undefined,
        successCallback: undefined as (() => void) | undefined,
        settledCallback: undefined as (() => void) | undefined,
    })
    const method = stateDataRef.current.method
    const queryKey = method === 'GET' ? fetchQueryKey : stateDataRef.current.mutateQueryKey
    const dependentQueryKey = stateDataRef.current.dependentQueryKey
    const forceRefetch = stateDataRef.current.forceRefetch
    const debounceTime = stateDataRef.current.debounceTime


    // Handle parallel queries with tags
    const parallelQueries = useQueries({
        queries: Array.isArray(queryKey) && queryKey.length > 0 ?
            queryKey.map((prop: any, index) => {
                const tag: string = Object.keys(prop)[0]
                const url = prop[tag]
                const searchTextSuffix = searchText? `?q=${searchText}`:""
                return {
                    queryKey: [tag + searchTextSuffix, method],
                    queryFn: ({ signal }: any) => url ? 
                        axiosApi({url:url + searchTextSuffix, method, signal}) : 
                        Promise.resolve(null),
                    enabled: !!url && method === 'GET',
                    gcTime: cacheTime,
                    staleTime: forceRefetch ? 0 : staleTime,
                    refetchOnMount: forceRefetch,
                }
            }) : []
    });


    // Single query handling
    const singleQuery = useQuery<ApiResponse<any>, ApiError>({
        queryKey: [queryKey + (searchText ? `?q=${searchText}`:""), method],
        queryFn: ({signal}) => !Array.isArray(queryKey) && queryKey ?
            axiosApi({url:queryKey + (searchText? `?q=${searchText}`:""), method, signal}) :
            Promise.resolve(null),
        // enabled - key manage the execution of api
        // So, we are have several conditions to enabling it or disabling it :-
        //     1.We have searchText or not if it is then freeze api, 
        //       because while search text it will trigger on every mount or rerender.
        //     2.if we do not have query key, method is other than get then freeze api. 
        //     3.If the query key is array, because it is not a multiple query function, so then freeze api. 
        enabled: !searchText && !!queryKey && method === 'GET' && !Array.isArray(queryKey),
        gcTime: cacheTime,
        staleTime: forceRefetch ? 0 : staleTime,
        refetchOnMount: forceRefetch,
        meta: { ...metaDataRef.current } 
    });

        
    // Dependent query handling
    const dependentQuery = useQuery<ApiResponse<any>>({
        queryKey: [dependentQueryKey, method],
        queryFn: ({ signal }) => (dependentQueryKey ? axiosApi({url:dependentQueryKey, method}) : Promise.resolve(null)),
        enabled: !!dependentQueryKey && !!singleQuery.data,
    });


    // Mutation handlers for POST, PATCH, and DELETE
    const mutation = useMutation<
        T, // Type of the data returned by the mutation
        Error, // Type of the error thrown by the mutation
        MutationParams<T>, // Variables passed to the mutate function
        MutationContext // Context used for optimistic updates
    >({
        mutationFn: ({ url, method, contentType, data }: MutationParams<any>) => {
            // if (method === 'POST') return postData({ url, type: contentType, data });
            // if (method === 'PATCH') return patchData({ url, type: contentType, data });
            // if (method === 'DELETE') return deleteData(url);
            // throw new Error('Invalid method');
            return axiosApi({url, method, type:contentType, data})
        },
        onMutate: async ({ data }) => {
            let previousData: T | undefined;
            if (data?.optimisticCallback && data?.invalidateQueryKey) {
                previousData = queryClient.getQueryData([data?.invalidateQueryKey, 'GET'])
                const response = await data.optimisticCallback(data);
                queryClient.setQueryData([data?.invalidateQueryKey, 'GET'], response);
            }
            return { previousData };
        },
        onSuccess: (data: any, variables: any) => {
            !!variables?.invalidateQueryKey && queryClient.invalidateQueries({ queryKey: [variables?.invalidateQueryKey, 'GET'] });
            // !!variables?.invalidateQueryKey && queryClient.refetchQueries({ queryKey: [variables?.invalidateQueryKey, 'GET'] });
        },
        onError: (error, variables, context) => {
            if (context?.previousData && variables?.invalidateQueryKey) {
                queryClient.setQueryData([variables?.invalidateQueryKey, 'GET'], context?.previousData);
            }
        },
        meta: { ...metaDataRef.current }
    });


    // Parallel Query Results data mapper
    let parallelResults: { data: any, error: any, isFetching: any } = { data: {}, error: {}, isFetching: {} };
    Array.isArray(queryKey) && queryKey.forEach((keyObj, index) => {
        const tag = keyObj ? Object.keys(keyObj)[0] : null;
        tag && (parallelResults = {
            data: { ...parallelResults.data, [tag]: parallelQueries?.[index]?.data ?? null },
            error: { ...parallelResults.error, [tag]: parallelQueries?.[index]?.error ?? null },
            isFetching: { ...parallelResults.isFetching, [tag]: parallelQueries?.[index]?.isFetching ?? null }
        });
    });


    const refetchFn = useCallback(() =>{
        Array.isArray(queryKey) ?
            parallelQueries.forEach((query) => query.refetch()) :
            singleQuery.refetch()
    }, [queryKey]);


    // Cancel Query for cancelling the queries running
    const cancelQueryFn = useCallback((queryUrl: string | { [key: string]: string }[], method: ApiMethods = 'GET')=> {
        const query = queryUrl ?? queryKey
        query && Array.isArray(query) ?
        query.forEach((props: any) => {
            const tag: string = Object.keys(props)[0]
            queryClient.cancelQueries({ queryKey: [tag, method], exact: true })
        }) :
        queryClient.cancelQueries({ queryKey: [queryKey, method], exact: true })
    },[queryKey]);


    //Enabling Refetch while dynamic search
    // useMemoAfterMount(()=>{
    //     debounce(()=>{
    //         singleQuery.refetch()
    //         // refetchFn()
    //     },debounceTime)
    // }, [searchText]);

    useMemoAfterMount(()=>{
        debounce(()=>{
            singleQuery.refetch();
        },500)
    }, [searchText])

  
    // Dynamic call function
    const call = useCallback<(prop: CallParams) => void>((
        {
            url,
            method = 'GET',
            data,
            contentType = 'json',
            dependentQueryUrl,
            invalidateQueryUrl,
            optimisticCallback,
            forceRefetch = false,
            debounceTime = 0,
            meta
        }: CallParams
    ) => {
        debounce(()=>{
            if (method === 'GET') {
                if (Array.isArray(url)) {
                    parallelQueries.forEach((query) => query.refetch());
                } else {
                    singleQuery.refetch();
                }
            } else {
                mutation.mutate({
                    url: Array.isArray(url) ? url[0].url : url,
                    method,
                    contentType,
                    data,
                    optimisticCallback,
                    invalidateQueryKey:invalidateQueryUrl,
                    meta: { ...metaDataRef.current, ...meta }
                });
            }

            if (queryKey && (JSON.stringify(queryKey) != JSON.stringify(url))) {
                cancelQueryFn(queryKey, method);
            }
            
            // UPDATING THE STATES AND REFS - DATA CIRCULATING 
            method === 'GET' ? setFetchQueryKey(url) : (stateDataRef.current.mutateQueryKey = url)
            stateDataRef.current.method = method
            stateDataRef.current.forceRefetch = forceRefetch;
            dependentQueryUrl && (stateDataRef.current.dependentQueryKey = dependentQueryUrl)
            debounceTime && (stateDataRef.current.debounceTime = debounceTime)
            meta && (metaDataRef.current = { ...metaDataRef.current, ...meta })
        }, debounceTime)
    }, [parallelQueries, singleQuery, mutation]);

    
    return { 
        data: method !== 'GET' ?
            mutation.data ?? null :
            (
                Array.isArray(queryKey) ?
                    parallelResults.data :
                    singleQuery.data 
            ),
        error: method !== 'GET' ?
            mutation.error :
            (
                Array.isArray(queryKey) ?
                    parallelResults.error :
                    singleQuery.error
            ),
        isLoading: method !== 'GET' ?
            mutation.isPending :
            (
                Array.isArray(queryKey) ?
                    parallelResults.isFetching :
                    singleQuery.isFetching
            ),
        dependentQueryData: dependentQuery.data, // Response Data from the dependent query
        
        queryClient,
        rootApi,
        call,
        refetch: refetchFn,
        cancelQuery: cancelQueryFn
    }; 
};




// ! Has to apply PAGINATION AND INFINITE QUERY


// **Cleaning after the fetching 
// useMemo(() => {
//     // PARALLEL KEY & SINGLE QUERY KEY  
//     if (
//         (parallelQueries.length === queryKey?.length && parallelQueries.every((rq) => rq.fetchStatus === 'idle')) ||
//         (!!fetchQueryKey && singleQuery.isFetched  && singleQuery.fetchStatus === 'idle')
//     ) {
//         console.print("FIRST.............",(parallelQueries.length === queryKey?.length && parallelQueries.every((rq) => rq.fetchStatus === 'idle')) ||
//         (!!fetchQueryKey && singleQuery.isFetched  && singleQuery.fetchStatus === 'idle'),
//         (parallelQueries.length === queryKey?.length && parallelQueries.every((rq) => rq.fetchStatus === 'idle')),
//         (!!fetchQueryKey && singleQuery.isFetched  && singleQuery.fetchStatus === 'idle'))
//         setFetchQueryKey(null)
//     }
        
//     // DEPENDENT QUERY KEY 
//     if(
//         (!!fetchQueryKey && singleQuery.isFetched  && singleQuery.fetchStatus === 'idle') && 
//         (!!stateDataRef.current.dependentQueryKey && dependentQuery.isFetched  && dependentQuery.fetchStatus === 'idle')
//     ){
//         console.print("SECOND.............", (!!fetchQueryKey && singleQuery.isFetched  && singleQuery.fetchStatus === 'idle') && 
//         (!!stateDataRef.current.dependentQueryKey && dependentQuery.isFetched  && dependentQuery.fetchStatus === 'idle'),
//         (!!fetchQueryKey && singleQuery.isFetched  && singleQuery.fetchStatus === 'idle'),
//         (!!stateDataRef.current.dependentQueryKey && dependentQuery.isFetched  && dependentQuery.fetchStatus === 'idle'))
//         setFetchQueryKey(null)
//         stateDataRef.current.dependentQueryKey = null;
//     } 

//     // MUTATION QUERY KEY 
//     if((mutation.data || mutation.error) && mutation.isIdle){
//         stateDataRef.current.mutateQueryKey = null;
//     }
// }, [parallelQueries, singleQuery, dependentQuery]);


// *Code is not working, check it 
// const parallelResults = useMemo(()=>{
//     let rawData: { data: any, error: any, isFetching: any } = { data: {}, error: {}, isFetching: {} };
//     if(parallelQueries){
//         Array.isArray(queryKey) && queryKey.forEach((keyObj, index) => {
//             const tag = keyObj ? Object.keys(keyObj)[0] : null;
//             tag && (rawData = {
//                 data: { ...rawData.data, [tag]: parallelQueries?.[index]?.data ?? null },
//                 error: { ...rawData.error, [tag]: parallelQueries?.[index]?.error ?? null },
//                 isFetching: { ...rawData.isFetching, [tag]: parallelQueries?.[index]?.isFetching ?? null }
//             });
//         });
//     }
// },[parallelQueries])


// **EXAMPLE OF DOING OPTIMISTIC UPDATE
// call({
//     url:"https://post request url",
//     method:"POST",
//     invalidateQueryUrl:"https://url...", //Url of that query whose response data we are manipulating to implement optimistic update
//     optimisticCallback:(data:any)=>{
//         return [...data, { id: Math.random(), name: 'vishal' }];
//     }
// })
