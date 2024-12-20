import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { Pressable, ScrollView, View } from "react-native"
import { Button, ConditionalComponent, Screen, SvgIcon, Text, TextField, ZipcodeField } from "app/components"
import { AppTabNavigatorParamList, AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import useStyle from "app/hooks/useStyle"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ActivityIndicator, RadioButton } from 'react-native-paper';
import { colors } from "app/theme"
import { isIos } from "app/theme/constants"
import { fileManagement } from "app/utils/FileMangement"
import { useApi } from "app/hooks/useApi"
import { formValidation } from "app/utils/formValidation"
import * as Yup from 'yup'
import { validateParams } from "app/utils/generics"
import DownloadFile from "app/components/DownloadFile"



const components = {
  RadioButtonContainer(props: any) {
    const { style: $, setCustomerAddType, customerAddType } = props

    return (
      <View style={$.only(['mb-20', 'mt-5'])}>
        <RadioButton.Group onValueChange={(value) => setCustomerAddType(value)} value={customerAddType}  >
          <Pressable
            onPress={() => setCustomerAddType('bulk')}
            style={$.only(['rowAlign'])}>
            <RadioButton.Android value="bulk" color={colors.palette.primary500} />
            <Text style={$.only(['h5', 'fc-n800', 'ffMedium'])}>Bulk Customer Uploading</Text>
          </Pressable>
          <Pressable
            onPress={() => setCustomerAddType('individual')}
            style={$.only(['rowAlign'])}>
            <RadioButton.Android value="individual" color={colors.palette.primary500} />
            <Text style={$.only(['h5', 'fc-n800', 'ffMedium'])}>Individual Customer Uploading</Text>
          </Pressable>
        </RadioButton.Group>
      </View>
    )
  },
  BulkCustomerContainer(props: any) {
    const { style: $ } = props
    const [file, setFile] = useState<any>(null);
    const [isFileDownloading, setIsFileDownloading] = useState<boolean>(false)

    const pickImage = async () => {
      const data = await fileManagement.filePicker('document')
      if (data) {
        setFile(data?.result)
      }
    };

    return (
      <View >
        <View style={$.only(['rowItemAlignBetween'])}>
          <Text style={$['label']}>Upload Customer File</Text>
          <DownloadFile
            onDownloadStart={() => setIsFileDownloading(true)}
            onDownloadStop={() => setIsFileDownloading(false)}
            onPress={(submitFunc: any) => submitFunc('customer_sample')}
          >
            <View style={$.only(['centerItem', 'bg-p500', 'w-80', 'h-35', 'br-5'])}>
              <ConditionalComponent condition={isFileDownloading}>
                <ActivityIndicator size={'small'} color="white" />
                <>
                  <SvgIcon icon="download" size={20} />
                  <Text style={$.only(['h6', 'ffMedium'])}>Sample</Text>
                </>
              </ConditionalComponent>
            </View>
          </DownloadFile>
        </View>

        <Pressable style={$['imageInput']} onPress={pickImage} >
          <ConditionalComponent condition={!file} >
            <View style={$.only(['columnAlign',])}>
              <SvgIcon icon="upload" size={30} />
              <Text style={$.only(['body1', 'fc-n700'])}>Upload Product CSV/Excel File </Text>
            </View>
            <View style={$.only(['h-100', 'w-75%'])}>
              <Text style={$.only(['fc-n700', 'ffMedium', 'ta-center'])}>{file?.name}</Text>
              <Text style={$['changeButton']}>Change</Text>
            </View>
          </ConditionalComponent>
        </Pressable>
      </View>
    )
  },
  IndividualCustomerContainer(props: any) {
    const { style: $, inputData, setInputData, errors, setErrors } = props

    function handleChange(input: string, text: string) {
      setInputData((prev: any) => ({
        ...prev,
        [input]: text
      }))
      if (errors[input] === true) {
        setErrors((prev: any) => ({ ...prev, [input]: false }))
      }
    }

    return (
      // <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={100} >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View >
          <Text style={$['label']}>Customer Name</Text>
          <TextField
            style={$['textField']}
            placeholder="Enter Customer Name"
            inputWrapperStyle={[$['textFieldWrapper'], errors?.full_name && $.only(['bc-red'])]}
            value={inputData?.full_name}
            onChangeText={(value: any) => handleChange('full_name', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Social Handle</Text>
          <TextField
            style={$['textField']}
            placeholder="Enter Social Handle"
            inputWrapperStyle={[$['textFieldWrapper']]}
            value={inputData?.social_handle}
            onChangeText={(value: any) => handleChange('social_handle', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Email Address</Text>
          <TextField
            style={$['textField']}
            placeholder="Enter Email Address"
            inputWrapperStyle={[$['textFieldWrapper'], errors?.email && $.only(['bc-red'])]}
            value={inputData?.email}
            onChangeText={(value: any) => handleChange('email', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Contact Number</Text>
          <TextField
            style={$['textField']}
            placeholder="Enter Contact Number"
            inputWrapperStyle={[$['textFieldWrapper'], errors?.mobile && $.only(['bc-red'])]}
            keyboardType="numeric"
            maxLength={10}
            value={inputData?.mobile}
            onChangeText={(value: any) => handleChange('mobile', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Zipcode</Text>
          <ZipcodeField
            style={$['textField']}
            inputWrapperStyle={[$['textFieldWrapper'], errors?.zipcode && $.only(['bc-red'])]}
            placeholder="Enter Zipcode"
            value={inputData?.zipcode}
            onChangeText={(value: any) => handleChange('zipcode', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Street Address</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={[$['textFieldWrapper'], errors?.address && $.only(['bc-red'])]}
            placeholder="Enter Street Address"
            value={inputData?.address}
            onChangeText={(value: any) => handleChange('address', value)}
          />
        </View>
      </ScrollView>
      // </KeyboardAvoidingView>
    )
  },
  ButtonContainer(props: any) {
    const { style: $, customerAddType, inputData, setErrors } = props
    const navigation = useNavigation<any>()
    const { orderId }: any = validateParams(useRoute())
    const { call: submitCall, isLoading, rootApi } = useApi({})


    const handler = {
      handleSubmit() {
        formValidation({
          validationSchema: handler.validationSchema,
          inputData,
          setErrors,
          callback: handler.validationCallback
        })
      },
      validationSchema: Yup.object({
        "full_name": Yup.string().required("Please, enter customer name!"),
        "email": Yup.string().email().required("Please, enter email!"),
        "mobile": Yup.string().min(10, "Mobile number should contains at least 10 digit").required("Please, enter mobile number!"),
        "zipcode": Yup.string().min(6, "Zipcode should contains at least 6 digit").required("Please, enter zipcode!"),
        "address": Yup.string().required("Please, enter address!"),
      }),
      validationCallback() {
        rootApi.customer.post({
          call: submitCall,
          props: {
            data: inputData,
            meta: {
              successCallback({ data, query }) {
                if (orderId) {
                  navigation.navigate('CreateOrder', { orderId, userId: data?.id })
                } else {
                  navigation.navigate('Customers')
                }
              }
            }
          }
        })
      }
    }

    return (
      <Button
        style={$['button']}
        text={customerAddType === 'bulk' ? 'Add Customers' : orderId ? 'Update Customer' : 'Add Customer'}
        textStyle={$.only(['btn', 'fc-n100'])}
        pressedStyle={$.only(['bw-1', 'bc-p600'])}
        pressedTextStyle={$.only(['fc-p600'])}
        onPress={handler.handleSubmit}
        pending={isLoading}
      />
    )
  }
}


interface AddNewCustomerScreenProps extends AppTabNavigatorScreenProps<"AddNewCustomer"> { }
export const AddNewCustomerScreen: FC<AddNewCustomerScreenProps> = observer(function AddNewCustomerScreen() {
  const { orderId, socialHandle }: any = validateParams(useRoute())
  const [$] = useStyle($InitialStyle)
  const [customerAddType, setCustomerAddType] = useState<'bulk' | 'individual'>('individual')

  const [inputData, setInputData] = useState<any>({
    "full_name": "",
    "social_handle": socialHandle ?? "",
    "email": "",
    "mobile": "",
    "address": "",
    "password": "123@password",
    "zipcode": "",
  })

  const [errors, setErrors] = useState<any>({
    "full_name": false,
    "email": false,
    "mobile": false,
    "address": false,
    "zipcode": false,
  })

  return (
    <Screen style={$.only([`f-1`,])} >
      <View style={$.only(['columnItemBetween', 'pt-5'])}>
        <View style={$.only(['h-87%'])}>
          <ConditionalComponent condition={!orderId}>
            <components.RadioButtonContainer
              style={$}
              customerAddType={customerAddType}
              setCustomerAddType={setCustomerAddType}
            />
          </ConditionalComponent>
          <ConditionalComponent condition={customerAddType === 'bulk'} >
            <components.BulkCustomerContainer style={$} />
            <components.IndividualCustomerContainer
              style={$}
              inputData={inputData}
              setInputData={setInputData}
              errors={errors}
              setErrors={setErrors}
            />
          </ConditionalComponent>
        </View>
        <View style={$.only(['h-13%'])}>
          <components.ButtonContainer
            style={$}
            customerAddType={customerAddType}
            inputData={inputData}
            setErrors={setErrors}
          />
        </View>
      </View>
    </Screen>
  )
})


const $InitialStyle = {
  'inputRow': ['pt-10'],
  'label': ['h5', 'fc-n800', 'mb-5', 'ffMedium'],
  'textField': [`h-${isIos ? 35 : 40}`, `pv-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
  'textFieldWrapper': ['h-42'],
  'dropdownField': ['bc-n400', 'br-3', 'bw-1', 'h-42.5'],
  'imageInput': ['centerItem', 'bw-1', 'bc-n400', 'br-4', 'p-15', 'h-150', 'mt-5'],
  'uploadedImageCont': ['h-90', 'w-140', 'mb-10', 'bw-1', 'bc-n400', 'br-6'],
  'changeButton': ['body1', 'bg-p700', 'mh-25', 'br-15', 'ph-5', 'mt-7', 'lh-25', 'pb-2', 'ta-center', 'ffBold'],
  'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-15', 'w-100%',]
}
