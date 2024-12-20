import "@expo/metro-runtime"
import React from "react"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ErrorToast, showToast } from "app/utils/formValidation"
import { RootStore, useStores } from "app/models"
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from "react-native-toast-message"
import App from "./app/app"
import * as SplashScreen from "expo-splash-screen"


interface StoreParams<K extends keyof RootStore> {
  name: K; // The selected store (e.g., 'authStore')
  keyProp: keyof RootStore[K]; // Dynamically fetch keys of the selected store
}

interface ErrorCallbackParams{
  error:any;
  query:any;
  rootStore:RootStore
}

interface SuccessCallbackParams{
  data:any;
  query:any;
  rootStore:RootStore
}

interface SettledCallbackParams{
  data:any;
  error:any;
  query:any;
  rootStore:RootStore
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

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  const rootStore = useStores()

  const MetaCacheData = {
    onError: (error: any, query: any) => {
      const meta: MetaParams = query?.method === 'GET' ? query?.options?.meta : query?.meta

      if (error) {
        // TOAST RESPONSE POPUP  
        if (error?.response?.data?.detail.includes('Invalid token')){
          meta?.showErrorMessage && ErrorToast(error?.response?.data?.detail)
          AsyncStorage.clear()
          rootStore.authStore.clearToken()
        }else{
          meta?.showErrorMessage && ErrorToast(meta.errorMessage ?? error?.message ?? 'Something Went Wrong!')
        }
        meta?.errorCallback?.({ error, query, rootStore })
      }
    },
    onSuccess(data: any, query: any) {
      const meta: MetaParams = query?.method === 'GET' ? query?.options?.meta : query?.meta
      // TOAST RESPONSE POPUP
      const message = meta.successMessage ?? data?.message ?? 'Completed Successfully' 
      meta?.showSuccessMessage && showToast(data?.status ?? 'success', message)

      // Set the default authorization header
      if (query?.method === 'POST' && data && ( query?.url?.includes("login") || query?.url?.includes("register"))) {
        AsyncStorage.setItem('token', JSON.stringify(data?.data['token']));
        rootStore.authStore.setToken(data?.data['token'])
      }

      // storing data in store 
      if (meta?.store) {
        const dynamicStore = rootStore[meta?.store?.name]
        data && dynamicStore.setProp(meta?.store?.keyProp, data?.data)
      }
      meta?.successCallback?.({ data, query, rootStore })
    },
    onSettled(data: any, error: any, query: any) {
      const meta = query?.method === 'GET' ? query?.options?.meta : query?.meta
      if (data || error) {
        meta?.settledCallback?.({ data, error, query, rootStore })
      }
    }
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: 1000 * 5, // Data remains fresh for 10 seconds
        // gcTime: 1000 * 5, // Cache data for 5 minutes 
        refetchOnWindowFocus: true, // Refetch on app foreground
        // retry: 3, // Retry failed requests up to 3 times
        retry: 0,
        refetchOnReconnect: true, // Automatically refetch on reconnection
        placeholderData:(prev:any)=>prev, //Rendering the previous data while fetching the new one
      },
    },
    queryCache: new QueryCache(MetaCacheData),
    mutationCache: new MutationCache(MetaCacheData)
  });

  return (
    <QueryClientProvider client={queryClient}>
      <App hideSplashScreen={SplashScreen.hideAsync} />
      <Toast />
    </QueryClientProvider>
  )
}

export default IgniteApp
