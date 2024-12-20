import React, { FC, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, ScrollView, View } from "react-native"
import { Button, ConditionalComponent, Screen, SvgIcon, Text, TextField, ZipcodeField } from "app/components"
import { AppTabNavigatorParamList, AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import useStyle from "app/hooks/useStyle"
import { useNavigation, useRoute } from "@react-navigation/native"
import { isIos } from "app/theme/constants"
import { fileManagement, formatResult } from "app/utils/FileMangement"
import { useApi } from "app/hooks/useApi"
import * as Yup from 'yup'
import { formValidation } from "app/utils/formValidation"
import { HOST_URL } from "app/config/config.base"
import { validateParams } from "app/utils/generics"


const components = {
  InputContainer(props: any) {
    const { style: $, data, image, setImage, inputData, setInputData, errors, setErrors } = props
    const { call: submitCall, rootApi } = useApi({})

    function handleChange(input: string, text: any) {
      setInputData((prev: any) => ({
        ...prev,
        [input]: text
      }))
      setErrors((prev: any) => ({ ...prev, [input]: false }))
    }

    const pickImage = async () => {
      let result = await fileManagement.filePicker()
      if (result) {
        setImage(result?.assets[0]?.uri);
        if (data) {
          rootApi.vendor.patch({
            call: submitCall,
            urlSuffix: `${data?.id}/`,
            props: { 
              data: { 'logo': formatResult(result) },
              meta:{
                errorMessage:"Unable to update image!",
                successCallback({ data, query }) {
                  setImage(null)   
                }
              }
            }
          })
        } else {
          setInputData((prev: any) => ({
            ...prev,
            'logo': formatResult(result)
          }))
        }
      }
    };

    return (
      <>
        <View style={$.only(['centerItem', 'h-110', 'pt-10'])}>
          <View style={$['profileCont']}>
            <ConditionalComponent condition={!image && !inputData?.logo} >
              <Image source={require('../../assets/images/business-img.png')} style={$['profileImage']} />
              <Image source={{ uri: image ?? (HOST_URL + inputData?.logo) }} style={$['profileImage']} />
            </ConditionalComponent>
            <SvgIcon icon="edit" size={25} onPress={pickImage} />
          </View>
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Vendor Name</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={[$['textFieldWrapper'], errors?.name && $.only(['bc-red'])]}
            placeholder="Enter Vendor Name"
            value={inputData?.name}
            onChangeText={(value: any) => handleChange('name', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Email Address</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={[$['textFieldWrapper'], errors?.email && $.only(['bc-red'])]}
            placeholder="Enter Email Address"
            value={inputData?.email}
            onChangeText={(value: any) => handleChange('email', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Contact Number</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={[$['textFieldWrapper'], errors?.mobile && $.only(['bc-red'])]}
            placeholder="Enter Contact Number"
            keyboardType="numeric"
            maxLength={10}
            value={inputData?.mobile}
            onChangeText={(value: any) => handleChange('mobile', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Tax ID</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={[$['textFieldWrapper'], errors?.tax && $.only(['bc-red'])]}
            placeholder="Enter Tax ID"
            value={inputData?.tax}
            onChangeText={(value: any) => handleChange('tax', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Contact Person Name</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={[$['textFieldWrapper'], errors?.contact_person && $.only(['bc-red'])]}
            placeholder="Enter Contact Person Name"
            value={inputData?.contact_person}
            onChangeText={(value: any) => handleChange('contact_person', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Street Address</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={[$['textFieldWrapper'], errors?.street_address && $.only(['bc-red'])]}
            placeholder="Enter Street Address"
            value={inputData?.street_address}
            onChangeText={(value: any) => handleChange('street_address', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Zipcode</Text>
          <ZipcodeField
            style={$['textField']}
            inputWrapperStyle={[$['textFieldWrapper'], errors?.zipcode && $.only(['bc-red'])]}
            placeholder="Enter Zipcode"
            value={inputData?.zipcode}
            prefix={inputData?.street_address}
            onChangeText={(value: any) => handleChange('zipcode', value)}
          />
        </View>
      </>
    )
  },
  ButtonContainer(props: any) {
    const { style: $, data, inputData, setErrors } = props
    const { call: submitCall, isLoading, rootApi } = useApi({})
    const navigation = useNavigation<any>()

    const handler = {
      handleSubmit() {
        formValidation({
          inputData,
          setErrors,
          validationSchema: handler.validationSchema,
          callback: handler.validationCallback
        })
      },
      validationSchema: Yup.object({
        "name": Yup.string().required("Please, enter vendor name!"),
        "email": Yup.string().email("Please, enter a valid email!").required("Please, enter vendor email!"),
        "mobile": Yup.string().min(10, "Mobile number contains at least 10 digits").required("Please, enter mobile number!"),
        "tax": Yup.string().min(10, "Tax ID contains at least 8 digits").required("Please, enter tax ID!"),
        "zipcode": Yup.string().min(6, "Zipcode should contains at least 10 digits").required("Please, enter zipcode!"),
      }),
      validationCallback() {
        if (data) {
          handler.submitPatch(data)
        } else {
          handler.submitPost()
        }
      },
      submitPatch(data:any){
        let submitData: any = {}
        for (const [key, value] of Object.entries(inputData)) {
          if (inputData[key] !== data?.[key]) {
            submitData[key] = inputData[key]
          }
        }
        if (Object.keys(submitData).length > 0) {
          handler.submitPatch(submitData)
          rootApi.vendor.patch({
            call: submitCall,
            urlSuffix: `${data?.id}/`,
            props: {
              data: submitData,
              meta:{
                successCallback({ data, query }) {
                  navigation.navigate('Vendors')
                },
              }
            }
          })
        }
      },
      submitPost(){
        rootApi.vendor.post({
          call: submitCall,
          props: {
            data: inputData,
            meta:{
              successCallback({ data, query }) {
                navigation.navigate('Vendors')
              }
            }
          }
        })
      }
    }

    return (
      <Button
        style={$['button']}
        text="Save"
        textStyle={$.only(['btn', 'fc-n100'])}  
        pressedStyle={$.only(['bw-1', 'bc-p600'])}
        pressedTextStyle={$.only(['fc-p600'])}
        onPress={handler.handleSubmit}
        pending={isLoading}
      />
    )
  },
}


interface AddVendorScreenProps extends AppTabNavigatorScreenProps<"AddVendor"> { }
export const AddVendorScreen: FC<AddVendorScreenProps> = observer(function AddVendorScreen() {
  const [$] = useStyle($InitialStyle)
  const {vendorId}: any = validateParams(useRoute())

  const [image, setImage] = useState<string | null>(null);
  const { data: response, call, rootApi } = useApi({})
  const data = response?.data

  const [inputData, setInputData] = useState<any>({
    "name": "",
    "email": "",
    "mobile": "",
    "tax": "",
    "logo": "",
    "contact_person": "",
    "street_address": "",
    "zipcode": "",
  })

  const [errors, setErrors] = useState<any>({
    "name": false,
    "email": false,
    "mobile": false,
    "tax": false,
    "zipcode": false,
  })

  useMemo(() => {
    if (vendorId) {
      rootApi.vendor.get({
        call, urlSuffix: `${vendorId}/`
      })
    }
  }, [vendorId])

  useMemo(() => {
    if (data) {
      setInputData({
        "name": data?.name,
        "email": data?.email,
        "mobile": data?.mobile,
        "logo": data?.logo,
        "contact_person": data?.contact_person,
        "street_address": data?.street_address,
        "zipcode": data?.zipcode?.code,
      })
    }
  }, [data])


  return (
    <Screen style={$.only([`f-1`,])} preset="fixed">
      <ScrollView showsVerticalScrollIndicator={false}>
        <components.InputContainer
          style={$}
          data={data}
          image={image}
          setImage={setImage}
          inputData={inputData}
          setInputData={setInputData}
          errors={errors}
          setErrors={setErrors}
        />
        <components.ButtonContainer
          style={$}
          data={data}
          inputData={inputData}
          setErrors={setErrors}
        />
      </ScrollView>
    </Screen>
  )
})

const $InitialStyle = {
  'profileCont': ['w-95', 'h-95', 'relative', 'jc-flex-end', 'ai-flex-end'],
  'profileImage': ['w-95', 'h-95', 'br-100', 'absolute', 'top-0'],
  'inputRow': ['pt-10'],
  'label': ['h5', 'fc-n800', 'ffMedium', 'mb-5'],
  'textField': [`h-${isIos ? 35 : 40}`, `pv-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
  'textFieldWrapper': ['h-42'],
  'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-10', 'mt-20', 'w-100%',]
}
