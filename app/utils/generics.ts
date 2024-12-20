import { useMemo } from "react"

export const validateParams=(route:any)=>{
    return useMemo(()=>{
        if(route?.params){
            return route?.params
        }
        return {}
    },[route?.params])
}
