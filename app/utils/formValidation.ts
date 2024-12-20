import Toast from "react-native-toast-message"

type inputType = {
    validationSchema:any,
    inputData:any,
    setErrors:any,
    callback:()=>void
}

export const formValidation = async(props:inputType)=>{
    const {validationSchema, inputData, setErrors, callback} = props
    try{
        await validationSchema.validate(inputData, { abortEarly: false })
        callback()
      }catch(err:any){
        Toast.show({
          type: "error",
          text1: "Error !",
          text2: err?.errors[0],
        })
        const errorTemp: { [key: string]: boolean } = {};
        err.inner.map(({ path }: any) => {
          errorTemp[path] = true
        })
        setErrors({ ...errorTemp })
      }
}

export const isValidUrl = (url?:string) => {
  if(!url){
    return true
  }
  try {
    new URL(url);
  } catch (e) {
    return false;
  }
  return true;
};

export const showToast = (type:'error'|'info'|'success', message?:string)=>{
  if(message){
    Toast.show({
      type,
      text1:type.charAt(0).toUpperCase() + type.slice(1),
      text2:message
    })
  }
}

export const SuccessToast = (message:string)=>{
  Toast.show({
    type:'success',
    text1:'Success',
    text2:message
  })
}

export const ErrorToast = (message:string)=>{
  Toast.show({
    type:'error',
    text1:'Error',
    text2:message
  })
}

export const InfoToast = (message:string)=>{
  Toast.show({
    type:'info',
    text1:'Info',
    text2:message
  })
}
