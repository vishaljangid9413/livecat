import React, { FC, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, ScrollView, View } from "react-native"
import { Button, Screen, SvgIcon, Text, TextField, ZipcodeField } from "app/components"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { colors } from "app/theme"
import useStyle from "app/hooks/useStyle"
import { isIos, SCREEN_HEIGHT } from "app/theme/constants"
import { Dropdown } from "app/components/Dropdown"
import { fileManagement, formatResult } from "app/utils/FileMangement"
import { useApi } from "app/hooks/useApi"
import * as Yup from 'yup'
import { formValidation, isValidUrl } from "app/utils/formValidation"
import Checkbox from "expo-checkbox"
import { HOST_URL } from "app/config/config.base"
import { useStores } from "app/models"


const components = {
  PersonalContainer() {
    const [$] = useStyle({
      'profileCont': ['w-95', 'h-95', 'relative', 'jc-flex-end', 'ai-flex-end'],
      'profileImage': ['w-95', 'h-95', 'br-100', 'absolute', 'top-0'],
      'inputRow': ['pt-10'],
      'label': ['h5', 'fc-n800', 'ffMedium', 'mb-5'],
      'textField': ['h-40', `pt-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
      'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-15', 'w-100%',]
    })
    const { data: profileResponse, call, rootApi } = useApi({})
    const profileData = profileResponse?.data
    const { data: timezoneResponse, call: timezoneCall } = useApi({})
    const timezoneData = timezoneResponse?.data
    const { call: submitCall } = useApi({})

    const [inputData, setInputData] = useState<any>({
      "full_name": "",
      "email": "",
      "mobile": "",
      "mpin": "",
      "timezone": ""
    })

    const [errors, setErrors] = useState<any>({
      "full_name": false,
      "email": false,
      "mobile": false,
      "mpin": false,
    })

    const handler = {
      handleChange(input: string, text: string) {
        if (input === 'timezone') {
          const timezone = timezoneData?.filter((obj: any) => {
            return obj?.name === text
          })
          setInputData((prev: any) => ({ ...prev, 'timezone': timezone[0]?.id }))
          return
        }

        setInputData((prev: any) => ({
          ...prev,
          [input]: text
        }))
        if (errors[input] === true) {
          setErrors((prev: any) => ({ ...prev, [input]: false }))
        }
      },
      handleSubmit() {
        formValidation({
          validationSchema: handler.validationSchema,
          inputData,
          setErrors,
          callback: handler.validationCallback
        })
      },
      validationSchema: Yup.object({
        "full_name": Yup.string().required("Please, enter full name!"),
        "email": Yup.string().email().required("Please, enter email!"),
        "mobile": Yup.string().min(10, "Mobile number should consist 10 digit").required("Please, enter mobile number!"),
        "mpin": Yup.string().min(6, "PIN should consist 6 digit").required("Please, enter PIN!"),
      }),
      validationCallback() {
        let data: any = {}
        for (const [key, value] of Object.entries(inputData)) {
          if (inputData[key] !== profileData?.user?.[key]) {
            data[key] = inputData[key]
          }
        }
        if (data) {
          rootApi.account.personal.patch({
            call: submitCall,
            props: {
              data: data
            }
          })
        }
      }
    }

    const selectedTimezone = useMemo(() => {
      if (timezoneData) {
        return timezoneData?.filter((obj: any) => (obj?.id === inputData?.timezone))[0]?.name
      }
    }, [timezoneData, inputData?.timezone])

    useEffect(() => {
      rootApi.auth.profile({ call })
      rootApi.geo.timezone({ call: timezoneCall })
    }, [])

    useMemo(() => {
      if (profileData) {
        setInputData({
          "full_name": profileData?.user?.full_name,
          "email": profileData?.user?.email,
          "mobile": profileData?.user?.mobile,
          "mpin": profileData?.user?.mpin,
          "timezone": profileData?.user?.timezone
        })
      }
    }, [profileData])

    return (
      <ScrollView style={$.only(['ph-16', 'bg-n50'])} >
        <View style={$['inputRow']}>
          <Text style={$['label']}>Full Name</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.full_name && $.only(['bc-red'])}
            placeholder="Enter your name"
            value={inputData?.full_name}
            onChangeText={(text) => handler.handleChange('full_name', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Email Address</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.email && $.only(['bc-red'])}
            placeholder="Enter Email Address"
            value={inputData?.email}
            onChangeText={(text) => handler.handleChange('email', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Mobile Number</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.mobile && $.only(['bc-red'])}
            placeholder="Enter Mobile Number"
            keyboardType="numeric"
            maxLength={10}
            value={inputData?.mobile}
            onChangeText={(text) => handler.handleChange('mobile', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>PIN</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.mpin && $.only(['bc-red'])}
            placeholder="Enter PIN Number"
            keyboardType="numeric"
            maxLength={6}
            value={inputData?.mpin}
            onChangeText={(text) => handler.handleChange('mpin', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Select Time Zone</Text>
          <Dropdown
            multiSelect={false}
            required={true}
            labelPosition="top"
            placeholder={selectedTimezone ?? "Select Time Zone"}
            options={timezoneData?.map((obj: any) => (obj?.name))}
            selectedValues={[selectedTimezone]}
            onChange={(text) => handler.handleChange('timezone', text)}
            style={[$.only(['fc-n700']), isIos && $.only(['pt-0', 'mv-0'])]}
            containerStyle={$.only(['mt-2'])}
            inputWrapperStyle={$.only(['bc-n400', 'br-3', 'bw-1'])}
            placeholderTextColor={colors.palette.neutral700}
          />
        </View>
        <Button
          style={$['button']}
          text="Save"
          textStyle={$.only(['btn', 'fc-n100'])}
          pressedStyle={$.only(['bw-1', 'bc-p600'])}
          pressedTextStyle={$.only(['fc-p600'])}
          onPress={handler.handleSubmit}
        />
      </ScrollView>
    )
  },
  BusinessContainer() {
    const [$] = useStyle({
      'screen': ['ph-16', 'bg-n50', 'columnItemBetween', `h-${SCREEN_HEIGHT() - (isIos ? 80 : 40)}`],
      'profileCont': ['w-95', 'h-95', 'relative', 'jc-flex-end', 'ai-flex-end'],
      'profileImage': ['w-95', 'h-95', 'br-100', 'absolute', 'top-0'],
      'inputRow': ['pt-10'],
      'label': ['h5', 'fc-n800', 'ffMedium', 'mb-5'],
      'textField': ['h-40', `pt-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
      'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-15', 'w-100%',]
    })
    const [image, setImage] = useState<string | null>(null);

    const { data: response, call, rootApi } = useApi({})
    const data = response?.data[0]
    const { call: submitCall, isLoading } = useApi({})

    const [inputData, setInputData] = useState<any>({
      "business_name": "",
      "tax_number": "",
      "business_address": "",
      "zipcode": "",
      "logo": ""
    })

    const [errors, setErrors] = useState<any>({
      "business_name": false,
      "tax_number": false,
      "business_address": false,
      "zipcode": false,
    })

    const handler = {
      handleChange(input: string, text: any) {
        setInputData((prev: any) => ({
          ...prev,
          [input]: text
        }))
        setErrors((prev: any) => ({ ...prev, [input]: false }))
      },
      handlePickImage: async () => {
        let result = await fileManagement.filePicker()
        if (result) {
          setImage(result?.assets[0]?.uri);
          if (data) {
            rootApi.account.business.patch({
              call: submitCall,
              urlSuffix: `${data?.id}/`,
              props: { data: { 'logo': formatResult(result) } }
            })
          } else {
            setInputData((prev: any) => ({
              ...prev,
              'logo': formatResult(result)
            }))
          }
        }
      },
      handleSubmit() {
        formValidation({
          validationSchema: handler.validationSchema,
          inputData,
          setErrors,
          callback: handler.validationCallback
        })
      },
      validationSchema: Yup.object({
        "business_name": Yup.string().required("Please, enter business name!"),
        "tax_number": Yup.string().min(15, "Tax number at least contain 15 digits!")
          .required("Please, enter tax number!"),
        "business_address": Yup.string().min(15, "Address at least contain 15 characters!")
          .required("Please, enter business address!"),
        "zipcode": Yup.string().min(6, "Zipcode at least contain 6 digits!")
          .required("Please, enter zipcode!"),
      }),
      validationCallback() {
        if (data) {
          let submitData: any = {}
          for (const [key, value] of Object.entries(inputData)) {
            if ((inputData[key] !== data?.[key]) && key !== 'zipcode') {
              submitData[key] = inputData[key]
            }
            if (inputData['zipcode'] !== data?.zipcode?.code) {
              submitData['zipcode'] = inputData['zipcode']
            }
          }
          if (Object.keys(submitData).length > 0) {
            rootApi.account.business.patch({
              call: submitCall,
              urlSuffix: `${data?.id}/`,
              props: {
                data: submitData
              }
            })
          }
        } else {
          rootApi.account.business.post({
            call: submitCall,
            props: {
              data: inputData
            }
          })
        }
      }
    }

    useEffect(() => {
      rootApi.account.business.get({ call })
    }, [])

    useMemo(() => {
      if (data) {
        setInputData({
          "business_name": data?.business_name,
          "tax_number": data?.tax_number,
          "business_address": data?.business_address,
          "zipcode": data?.zipcode?.code,
          "logo": data?.logo,
        })
      }
    }, [data])

    return (
      <ScrollView style={$.only(['ph-16', 'bg-n50'])} >
        <View style={$.only(['centerItem', 'h-130'])}>
          <View style={$['profileCont']}>
            {
              !image && !inputData?.logo ?
                <Image source={require('../../assets/images/business-img.png')} style={$['profileImage']} /> :
                <Image source={{ uri: image ?? (HOST_URL + inputData?.logo) }} style={$['profileImage']} />
            }
            <SvgIcon icon="edit" size={25} onPress={handler.handlePickImage} />
          </View>
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Business Name</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.business_name && $.only(['bc-red'])}
            placeholder="Enter Business Name"
            value={inputData?.business_name}
            onChangeText={(text: any) => handler.handleChange('business_name', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Tax Number</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.tax_number && $.only(['bc-red'])}
            placeholder="Enter Tax Number"
            maxLength={15}
            value={inputData?.tax_number}
            onChangeText={(text: any) => handler.handleChange('tax_number', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Business Address</Text>
          <TextField
            style={[$['textField'], $.only(['h-125', 'pt-10'])]}
            inputWrapperStyle={errors?.business_address && $.only(['bc-red'])}
            multiline={true}
            numberOfLines={5}
            placeholder="Enter Business Address"
            value={inputData?.business_address}
            onChangeText={(text: any) => handler.handleChange('business_address', text)}
          />
        </View>
        {data?.city && <View style={$['inputRow']}>
          <Text style={$['label']}>City</Text>
          <TextField
            style={$['textField']}
            editable={false}
            value={data?.city?.name}
          />
        </View>}
        {data?.state && <View style={$['inputRow']}>
          <Text style={$['label']}>State</Text>
          <TextField
            style={$['textField']}
            editable={false}
            value={data?.state?.name}
          />
        </View>}
        {data?.country && <View style={$['inputRow']}>
          <Text style={$['label']}>Country</Text>
          <TextField
            style={$['textField']}
            editable={false}
            value={data?.country?.name}
          />
        </View>}
        <View style={$['inputRow']}>
          <Text style={$['label']}>Zipcode</Text>
          <ZipcodeField
           style={$['textField']}
           inputWrapperStyle={errors?.zipcode && $.only(['bc-red'])}
           placeholder="Enter Zipcode"
           value={inputData?.zipcode}
           onChangeText={(text: any) => handler.handleChange('zipcode', text)}
          />
        </View>
        <Button
          style={$['button']}
          text="Save"
          textStyle={$.only(['btn', 'fc-n100'])}
          pressedStyle={$.only(['bw-1', 'bc-p600'])}
          pressedTextStyle={$.only(['fc-p600'])}
          onPress={handler.handleSubmit}
          pending={isLoading}
        />
      </ScrollView>
    )
  },
  SocialContainer(props: any) {
    const [$] = useStyle({
      'inputRow': ['pt-10'],
      'label': ['h5', 'fc-n800', 'ffMedium', 'mb-5'],
      'textField': ['h-40', `pt-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
      'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-15', 'w-100%',]
    })

    const { data: profileResponse, call, rootApi } = useApi({})
    const profileData = profileResponse?.data
    const { call: submitCall, isLoading } = useApi({})

    const [inputData, setInputData] = useState<any>({
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      website: "",
      whatsapp: "",
      telegram: "",
      blog: "",
      e_card: ""
    })

    const [errors, setErrors] = useState<any>({
      facebook: false,
      instagram: false,
      linkedin: false,
      youtube: false,
      website: false,
      whatsapp: false,
      telegram: false,
      blog: false,
      e_card: false,
    })

    const handler = {
      handleChange(input: string, text: string) {
        setInputData((prev: any) => ({
          ...prev,
          [input]: text
        }))
        if (errors[input] === true) {
          setErrors((prev: any) => ({ ...prev, [input]: false }))
        }
      },
      handleSubmit() {
        formValidation({
          validationSchema: handler.validationSchema,
          inputData,
          setErrors,
          callback: handler.validationCallback
        })
      },
      validationSchema: Yup.object({
        "facebook": Yup.string().required("Please, enter facebook link!")
          .test("Facebook URL", "Facebook URL is not valid!", (value) => isValidUrl(value)),
        "instagram": Yup.string().required("Please, enter instagram link!")
          .test("Instagram URL", "Instagram URL is not valid!", (value) => isValidUrl(value)),
        "linkedin": Yup.string().test("Linkedin URL", "Linkedin URL is not valid!", (value) => isValidUrl(value)),
        "youtube": Yup.string().test("Youtube URL", "Youtube URL is not valid!", (value) => isValidUrl(value)),
        "website": Yup.string().test("Website URL", "Website URL is not valid!", (value) => isValidUrl(value)),
        "whatsapp": Yup.string().test("Whatsapp URL", "Whatsapp URL is not valid!", (value) => isValidUrl(value)),
        "telegram": Yup.string().test("Telegram URL", "Telegram URL is not valid!", (value) => isValidUrl(value)),
        "blog": Yup.string().test("Blog URL", "Blog URL is not valid!", (value) => isValidUrl(value)),
        "e_card": Yup.string().test("E-Card URL", "E-Card URL is not valid!", (value) => isValidUrl(value)),
      }),
      validationCallback() {
        let submitData: any = {}
        for (const [key, value] of Object.entries(inputData)) {
          if (inputData[key] && (inputData[key] !== profileData?.[key])) {
            submitData[key] = inputData[key]
          }
        }
        if (Object.keys(submitData).length > 0) {
          rootApi.auth.profileUpdate({
            call: submitCall,
            urlSuffix: `${profileData?.id}/`,
            props: {
              data: submitData,
              meta: {
                showSuccessMessage: true,
                successMessage: "Social details updated successfully!",
                errorMessage: "Unable to update social details!"
              }
            }
          })
        }
      }
    }

    useEffect(() => {
      rootApi.auth.profile({ call })
    }, [])

    useMemo(() => {
      if (profileData) {
        setInputData({
          facebook: profileData?.facebook ?? "",
          instagram: profileData?.instagram ?? "",
          linkedin: profileData?.linkedin ?? "",
          youtube: profileData?.youtube ?? "",
          website: profileData?.website ?? "",
          whatsapp: profileData?.whatsapp ?? "",
          telegram: profileData?.telegram ?? "",
          blog: profileData?.blog ?? "",
          e_card: profileData?.e_card ?? "",
        })
      }
    }, [profileData])

    return (
      <ScrollView style={$.only(['ph-16', 'bg-n50'])} >
        <View style={$['inputRow']}>
          <Text style={$['label']}>Facebook Link</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.facebook && $.only(['bc-red'])}
            placeholder="Enter Facebook Link"
            value={inputData?.facebook}
            onChangeText={(value: any) => handler.handleChange('facebook', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Instagram Link</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.instagram && $.only(['bc-red'])}
            placeholder="Enter Instagram Link"
            value={inputData?.instagram}
            onChangeText={(value: any) => handler.handleChange('instagram', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>LinkedIn Link</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.linkedin && $.only(['bc-red'])}
            placeholder="Enter LinkedIn Link"
            value={inputData?.linkedin}
            onChangeText={(value: any) => handler.handleChange('linkedin', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Youtube Link</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.youtube && $.only(['bc-red'])}
            placeholder="Enter Youtube Link"
            value={inputData?.youtube}
            onChangeText={(value: any) => handler.handleChange('youtube', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Twitter Link</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.twitter && $.only(['bc-red'])}
            placeholder="Enter Twitter Link"
            value={inputData?.twitter}
            onChangeText={(value: any) => handler.handleChange('twitter', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Whatsapp Link</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.whatsapp && $.only(['bc-red'])}
            placeholder="Enter Whatsapp Link"
            value={inputData?.whatsapp}
            onChangeText={(value: any) => handler.handleChange('whatsapp', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Telegram Link</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.telegram && $.only(['bc-red'])}
            placeholder="Enter Telegram Link"
            value={inputData?.telegram}
            onChangeText={(value: any) => handler.handleChange('telegram', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Blog Link</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.blog && $.only(['bc-red'])}
            placeholder="Enter Blog Link"
            value={inputData?.blog}
            onChangeText={(value: any) => handler.handleChange('blog', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>E-Card Link</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.e_card && $.only(['bc-red'])}
            placeholder="Enter E-Card Link"
            value={inputData?.e_card}
            onChangeText={(value: any) => handler.handleChange('e_card', value)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Website Link</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.website && $.only(['bc-red'])}
            placeholder="Enter Website Link"
            value={inputData?.website}
            onChangeText={(value: any) => handler.handleChange('website', value)}
          />
        </View>
        <Button
          style={$['button']}
          text="Save"
          textStyle={$.only(['btn', 'fc-n100'])}
          pressedStyle={$.only(['bw-1', 'bc-p600'])}
          pressedTextStyle={$.only(['fc-p600'])}
          onPress={handler.handleSubmit}
          pending={isLoading}
        />
      </ScrollView>
    )
  },
  BankContainer(props: any) {
    const [$] = useStyle({
      'screen': ['ph-16', 'pt-10', 'bg-n50', 'columnItemBetween', `h-${SCREEN_HEIGHT() - (isIos ? 80 : 40)}`],
      'inputRow': ['pt-10'],
      'label': ['h5', 'fc-n800', 'ffMedium', 'mb-5'],
      'textField': ['h-40', `pt-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
      'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-15', 'w-100%',]
    })
    const { data: response, call, rootApi } = useApi({})
    const data = response?.data[0]
    const { call: submitCall, isLoading } = useApi({})

    const [inputData, setInputData] = useState<any>({
      "account_name": "",
      "account_number": "",
      "bank_name": "",
      "bank_micr_code": "",
      "bank_swift_code": "",
      "bank_ifsc_code": "",
      "bank_address": "",
      "is_default": false
    })

    const [errors, setErrors] = useState<any>({
      "account_name": false,
      "account_number": false,
      "bank_name": false,
      "bank_micr_code": false,
      "bank_swift_code": false,
      "bank_ifsc_code": false,
      "bank_address": false
    })

    const handler = {
      handleChange(input: string, text: any) {
        setInputData((prev: any) => ({
          ...prev,
          [input]: text
        }))
        setErrors((prev: any) => ({ ...prev, [input]: false }))
      },
      handleSubmit() {
        formValidation({
          validationSchema: handler.validationSchema,
          inputData,
          setErrors,
          callback: handler.validationCallback
        })
      },
      validationSchema: Yup.object({
        "account_name": Yup.string().required("Please, enter account holder name!"),
        "account_number": Yup.string().min(11, "Account number at least contain 11 digits!")
          .required("Please, enter account number!"),
        "bank_name": Yup.string().required("Please, enter bank name!"),
        "bank_micr_code": Yup.string().min(9, "MICR code at least contain 9 digits!")
          .required("Please, enter MICR code!"),
        "bank_swift_code": Yup.string().min(8, "Swift code at least contain 8 digits!")
          .required("Please, enter Swift code!"),
        "bank_ifsc_code": Yup.string().min(11, "IFSC code at least contain 11 digits!")
          .required("Please, enter IFSC code!"),
        "bank_address": Yup.string().required("Please, enter bank address!")
      }),
      validationCallback() {
        if (data) {
          let submitData: any = {}
          for (const [key, value] of Object.entries(inputData)) {
            if (inputData[key] !== data?.[key]) {
              submitData[key] = inputData[key]
            }
          }
          if (Object.keys(submitData).length > 0) {
            rootApi.account.bank.patch({
              call: submitCall,
              urlSuffix: `${data?.id}/`,
              props: {
                data: submitData
              }
            })
          }
        } else {
          rootApi.account.bank.post({
            call: submitCall,
            props: {
              data: inputData
            }
          })
        }
      }
    }

    useEffect(() => {
      rootApi.account.bank.get({ call })
    }, [])

    useMemo(() => {
      if (data) {
        setInputData({
          "account_name": data?.account_name,
          "account_number": data?.account_number,
          "bank_name": data?.bank_name,
          "bank_micr_code": data?.bank_micr_code,
          "bank_swift_code": data?.bank_swift_code,
          "bank_ifsc_code": data?.bank_ifsc_code,
          "bank_address": data?.bank_address,
          "is_default": data?.is_default,
        })
      }
    }, [data])

    return (
      <ScrollView style={$.only(['ph-16', 'bg-n50'])} >
        <View style={$['inputRow']}>
          <Text style={$['label']}>Account Holder Name</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.account_name && $.only(['bc-red'])}
            placeholder="Enter Name"
            value={inputData?.account_name}
            onChangeText={(text) => handler.handleChange('account_name', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Account Number</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.account_number && $.only(['bc-red'])}
            placeholder="Enter Account Number"
            keyboardType="numeric"
            maxLength={16}
            value={inputData?.account_number}
            onChangeText={(text) => handler.handleChange('account_number', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Bank Name</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.bank_name && $.only(['bc-red'])}
            placeholder="Enter Bank Name"
            value={inputData?.bank_name}
            onChangeText={(text) => handler.handleChange('bank_name', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>MICR Code</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.bank_micr_code && $.only(['bc-red'])}
            placeholder="Enter MICR Code"
            keyboardType="numeric"
            maxLength={9}
            value={inputData?.bank_micr_code}
            onChangeText={(text) => handler.handleChange('bank_micr_code', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Swift Code</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.bank_swift_code && $.only(['bc-red'])}
            placeholder="Enter Swift Code"
            maxLength={11}
            value={inputData?.bank_swift_code}
            onChangeText={(text) => handler.handleChange('bank_swift_code', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>IFSC Code</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.bank_ifsc_code && $.only(['bc-red'])}
            placeholder="Enter IFSC Code"
            keyboardType="numeric"
            maxLength={11}
            value={inputData?.bank_ifsc_code}
            onChangeText={(text) => handler.handleChange('bank_ifsc_code', text)}
          />
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Bank Address</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={errors?.bank_address && $.only(['bc-red'])}
            placeholder="Enter Branch Name"
            value={inputData?.bank_address}
            onChangeText={(text) => handler.handleChange('bank_address', text)}
          />
        </View>
        <View style={$.only(['mt-15', 'row', 'g-10'])}>
          <Checkbox
            style={$['checkBox']}
            value={inputData?.is_default}
            onValueChange={(value) => handler.handleChange('is_default', value)}
            color={inputData?.is_default ? colors.palette.primary500 : undefined}
          />
          <Text style={$['label']}>Default Bank</Text>
        </View>
        <Button
          style={$['button']}
          text="Save"
          textStyle={$.only(['btn', 'fc-n100'])}
          pressedStyle={$.only(['bw-1', 'bc-p600'])}
          pressedTextStyle={$.only(['fc-p600'])}
          onPress={handler.handleSubmit}
          pending={isLoading}
        />
      </ScrollView>
    )
  },
  AddressContainer() {
    const [$] = useStyle({
      'screen': ['ph-16', 'bg-n50', 'columnItemBetween', `h-${SCREEN_HEIGHT() - (isIos ? 80 : 40)}`],
      'inputRow': ['mt-10'],
      'label': ['h5', 'fc-n800', 'ffMedium', 'mb-5'],
      'textField': ['h-40', `pt-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
      'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-15', 'w-100%',]
    })
    const { authStore: { getUser } } = useStores()
    const { data: response, call, rootApi } = useApi({})
    const data = response?.data[0]
    const { isLoading, call: submitCall } = useApi({})

    const [inputData, setInputData] = useState<any>({
      "address": "",
      "zipcode": "",
      "is_default": false
    })

    const [errors, setErrors] = useState<any>({
      "address": false,
      "zipcode": false,
    })

    const handler = {
      handleChange(input: string, text: any) {
        setInputData((prev: any) => ({
          ...prev,
          [input]: text
        }))
        setErrors((prev: any) => ({ ...prev, [input]: false }))
      },
      handleSubmit() {
        formValidation({
          validationSchema: handler.validationSchema,
          inputData,
          setErrors,
          callback: handler.validationCallback
        })
      },
      validationSchema: Yup.object({
        "address": Yup.string().required("Please, enter address!"),
        "zipcode": Yup.string().min(6, "Zipcode at least contain 6 digits!").required("Please, enter zipcode!")
      }),
      validationCallback() {
        if (data) {
          let submitData: any = {}
          if (inputData?.address !== data?.address) {
            submitData['address'] = inputData?.address
          }
          if (inputData?.zipcode !== data?.zipcode?.code) {
            submitData['zipcode'] = inputData?.zipcode
          }
          if (inputData?.is_default !== data?.is_default) {
            submitData['is_default'] = inputData?.is_default
          }
          if (Object.keys(submitData).length > 0) {
            rootApi.account.address.patch({
              call: submitCall,
              urlSuffix: `${data?.id}/`,
              props: {
                data: submitData
              }
            })
          }

        } else {
          rootApi.account.address.post({
            call: submitCall,
            props: {
              data: inputData
            }
          })
        }
      }
    }

    useEffect(() => {
      rootApi.account.address.get({
        call, urlSuffix: `${getUser?.id}/`
      })
    }, [])

    useMemo(() => {
      if (data) {
        setInputData({
          "address": data?.address,
          "zipcode": data?.zipcode?.code,
          "is_default": data?.is_default
        })
      }
    }, [data])

    return (
      <View style={$['screen']}>
        <View>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Full Address</Text>
            <TextField
              style={[$['textField'], $.only(['h-100'])]}
              inputWrapperStyle={errors?.address && $.only(['bc-red'])}
              multiline={true}
              numberOfLines={3}
              placeholder="Enter Full Address"
              value={inputData?.address}
              onChangeText={(text) => handler.handleChange('address', text)}
            />
          </View>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Zipcode</Text>
            <ZipcodeField
              style={$['textField']}
              inputWrapperStyle={errors?.zipcode && $.only(['bc-red'])}
              placeholder="Enter Zipcode"
              keyboardType="numeric"
              value={inputData?.zipcode}
              onChangeText={(text) => handler.handleChange('zipcode', text)}
            />
          </View>
          <View style={$.only(['mt-15', 'row', 'g-10'])}>
            <Checkbox
              style={$['checkBox']}
              value={inputData?.is_default}
              onValueChange={(value) => handler.handleChange('is_default', value)}
              color={inputData?.is_default ? colors.palette.primary500 : undefined}
            />
            <Text style={$['label']}>Default Address</Text>
          </View>
        </View>
        <Button
          style={$['button']}
          text="Save"
          textStyle={$.only(['btn', 'fc-n100'])}
          pressedStyle={$.only(['bw-1', 'bc-p600'])}
          pressedTextStyle={$.only(['fc-p600'])}
          onPress={handler.handleSubmit}
          pending={isLoading}
        />
      </View>
    )
  }
}


interface EditProfileScreenProps extends AppTabNavigatorScreenProps<"EditProfile"> {
  setNavigatorRoute: React.Dispatch<any>;
}
export const EditProfileScreen: FC<EditProfileScreenProps> = observer(function EditProfileScreen({ setNavigatorRoute }: any) {
  const Tab = createMaterialTopTabNavigator()
  const [$] = useStyle({})

  useEffect(() => {
    setNavigatorRoute('Personal')
    return () => { setNavigatorRoute(undefined) }
  }, [])

  return (
    <Screen style={$.only(['f-1', 'ph-0', 'h-100'])} preset="scroll">
      <Tab.Navigator
        initialRouteName={"Pictures"}
        screenOptions={{
          tabBarItemStyle: { paddingHorizontal: 0 },
          swipeEnabled: false,
          tabBarActiveTintColor: colors.palette.primary600,
          tabBarInactiveTintColor: colors.palette.neutral700,
          tabBarLabelStyle: $.only(['fs-11.5', 'ffMedium']),
          tabBarStyle: { height: 40, backgroundColor: 'white' },
        }}
        sceneContainerStyle={{ backgroundColor: "white" }}
        screenListeners={{ tabPress: (e) => setNavigatorRoute(e.target?.split('-')[0]) }}
      >
        <Tab.Screen name="Personal" component={components.PersonalContainer} />
        <Tab.Screen name="Social" component={components.SocialContainer} />
        <Tab.Screen name="Business" component={components.BusinessContainer} />
        <Tab.Screen name="Bank" component={components.BankContainer} />
        <Tab.Screen name="Address" component={components.AddressContainer} />
      </Tab.Navigator>
    </Screen>
  )
})



