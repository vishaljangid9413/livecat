import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Pressable, ScrollView, View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { AutoImage, Button, ConditionalComponent, Screen, SvgIcon, Text, TextField, Timer, ZipcodeField } from "app/components"
import { isIos, WINDOW_HEIGHT } from "app/theme/constants"
import { ErrorToast, formValidation } from "app/utils/formValidation"
import { useApi } from "app/hooks/useApi"
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field"
import { colors } from "app/theme"
import useStyle from "app/hooks/useStyle"
import * as Yup from 'yup'
import { useNavigation } from "@react-navigation/native"


const components = {
  RegisterContainer(props: any) {
    const { style: $, setContainer, inputData, setInputData, errors, setErrors, handleSendOtp } = props
    const navigation = useNavigation<any>()

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
          callback: () => {
            setContainer(false)
            handleSendOtp()
          }
        })
      },
      validationSchema: Yup.object({
        "full_name": Yup.string().required("Please, enter customer name!"),
        "social_handle": Yup.string().required("Please, enter social handle!"),
        "email": Yup.string().email().required("Please, enter email!"),
        "mobile": Yup.string().min(10, "Mobile number should contains at least 10 digit").required("Please, enter mobile number!"),
        "mpin": Yup.string().min(6, "MPIN should contains at least 6 digit").required("Please, enter MPIN!"),
        "zipcode": Yup.string().min(6, "Zipcode should contains at least 6 digit").required("Please, enter zipcode!"),
        "address": Yup.string().required("Please, enter address!"),
      })
    }

    return (
      <View style={$.only(['h-100%'])}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={$['image']}>
            <AutoImage source={require("../../assets/images/app-icon-all.png")} style={$.only(['wh100%'])} />
          </View>
          <Text style={$['heading']}>Register Your Account</Text>

          <View style={$.only(['mt-10'])}>
            <Text style={$['label']}>Customer Name</Text>
            <TextField
              style={$['textField']}
              placeholder="Enter Customer Name"
              inputWrapperStyle={[$['textFieldWrapper'], errors?.full_name && $.only(['bc-red'])]}
              value={inputData?.full_name} 
              onChangeText={(value: any) => handler.handleChange('full_name', value)}
            /> 
          </View>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Social Handle</Text>
            <TextField
              style={$['textField']}
              placeholder="Enter Social Handle"
              inputWrapperStyle={[$['textFieldWrapper'], errors?.social_handle && $.only(['bc-red'])]}
              value={inputData?.social_handle}
              onChangeText={(value: any) => handler.handleChange('social_handle', value)}
            />
          </View>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Email Address</Text>
            <TextField
              style={$['textField']}
              placeholder="Enter Email Address"
              inputWrapperStyle={[$['textFieldWrapper'], errors?.email && $.only(['bc-red'])]}
              value={inputData?.email}
              onChangeText={(value: any) => handler.handleChange('email', value)}
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
              onChangeText={(value: any) => handler.handleChange('mobile', value)}
            />
          </View>
          <View style={$['inputRow']}>
            <Text style={$['label']}>MPIN</Text>
            <TextField
              style={$['textField']}
              placeholder="Enter MPIN"
              inputWrapperStyle={[$['textFieldWrapper'], errors?.mpin && $.only(['bc-red'])]}
              maxLength={6}
              keyboardType="numeric"
              value={inputData?.mpin}
              onChangeText={(value: any) => handler.handleChange('mpin', value)}
            />
          </View>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Zipcode</Text>
            <ZipcodeField
              style={$['textField']}
              inputWrapperStyle={[$['textFieldWrapper'], errors?.zipcode && $.only(['bc-red'])]}
              placeholder="Enter Zipcode"
              value={inputData?.zipcode}
              onChangeText={(value: any) => handler.handleChange('zipcode', value)}
            />
          </View>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Street Address</Text>
            <TextField
              style={$['textField']}
              inputWrapperStyle={[$['textFieldWrapper'], errors?.address && $.only(['bc-red'])]}
              placeholder="Enter Street Address"
              value={inputData?.address}
              onChangeText={(value: any) => handler.handleChange('address', value)}
            />
          </View>

          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={$.only(['h6', 'mt-5', 'ffNormal', 'fc-p600'])}>Already have an account?</Text>
          </Pressable>
          <Button
            style={$['button']}
            text='Send OTP'
            textStyle={$.only(['btn', 'fc-n100'])}
            pressedStyle={$.only(['bw-1', 'bc-p600'])}
            pressedTextStyle={$.only(['fc-p600'])}
            onPress={handler.handleSubmit}
          />
        </ScrollView>
      </View>
    )
  },
  OtpContainer(props: any) {
    const { style: $, setContainer, inputData, handleSendOtp } = props

    const { call, isLoading, rootApi } = useApi({})
    const [OTP, setOTP] = useState<string>('')
    const [value, setValue] = useState<string>('');
    const [isTimerStop, setIsTimerStop] = useState<boolean>(false);

    const timerRef = useRef<any>();
    const ref = useBlurOnFulfill({ cellCount: 6 });
    const [prop, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

    function handlePressBack(){
      setContainer(true)
      timerRef.current?.reset() 
    }

    function handleResendOTP() {
      timerRef.current?.restart()
      setIsTimerStop(false)
      handleSendOtp()
    }

    function handleSubmit() {
      if (OTP.length < 6) {
        ErrorToast('Enter valid OTP!')
      } else {
        rootApi.auth.register({
          call,
          props: {
            data: { ...inputData, 'otp': OTP },
            meta: {
              errorCallback({ error, query }) {
                setContainer(true)
              }
            }
          }
        })
      }
    }

    useEffect(()=>{timerRef.current.start()},[])

    return (
      <View style={$.only([`h-${WINDOW_HEIGHT}`, 'relative', 'columnItemCenter'])}>
        <Pressable style={$.only(['absolute', `top-${isIos ? 0 : 10}`])}>
          <SvgIcon icon="back" size={25} onPress={handlePressBack} />
        </Pressable>
        <View style={$.only(['h-30%', 'columnItemBetween'])}>
          <View>
            <Text style={$['heading']}>OTP Verification</Text>
            <Text style={$['subHeading']}>
              {`Enter verification code we just sent to your number ${inputData?.mobile.replace(/^(\d{2})\d{5}(\d{3})$/, '$1*****$2')}.`}
            </Text>

            <View style={$.only(['mt-20'])}>
              <CodeField
                ref={ref} {...prop}
                value={OTP}
                onChangeText={setOTP}
                cellCount={6}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[$['inputCell'], isFocused && { borderColor: colors.focus }]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
              <ConditionalComponent condition={isTimerStop}>
                <View style={$.only(['rowItemCenter', 'mt-5'])}>
                  <Text style={$.only(['body1', 'fc-n700'])}>Didn't receive code? </Text>
                  <Pressable onPress={handleResendOTP}>
                    <Text style={$.only(['body1', 'fc-p500'])}> Resend</Text>
                  </Pressable>
                </View>
              </ConditionalComponent>
                <View style={[$.only(['rowItemCenter', 'mt-5', isTimerStop && 'd-none'])]}>
                  <Text style={$.only(['body1', 'fc-n700'])}>Timer: </Text>
                  <Timer 
                    ref={timerRef} 
                    style={$.only(['body1', 'fc-n700'])} 
                    count={20} 
                    onComplete={setIsTimerStop} 
                  />
                </View>
            </View>
          </View>
          <Button
            style={$['button']}
            text="Login" 
            textStyle={$.only(['btn', 'fc-n100'])}
            pressedStyle={$.only(['bw-1', 'bc-p600'])}
            pressedTextStyle={$.only(['fc-p600'])}
            onPress={handleSubmit}
            pending={isLoading}
          />
        </View>
      </View>
    )
  }
}


interface RegisterScreenProps extends AppStackScreenProps<"Register"> { }
export const RegisterScreen: FC<RegisterScreenProps> = observer(function RegisterScreen() {
  const [$] = useStyle($InitialStyle)
  const { call, rootApi } = useApi({})
  const [isRegisterContainer, setIsRegisterContainer] = useState(true)

  const [inputData, setInputData] = useState<any>({
    "full_name": "",
    "social_handle": "",
    "email": "",
    "mobile": "",
    "password": "123@password",
    "mpin": "",
    "address": "",
    "zipcode": "",
  })

  const [errors, setErrors] = useState<any>({
    "full_name": false,
    "social_handle": false,
    "email": false,
    "mobile": false,
    "mpin": false,
    "address": false,
    "zipcode": false,
  })

  function handleSendOtp() {
    rootApi.auth.sendOtp({
      call, props: { data: { 'email': inputData?.email } }
    })
  }
  
  return (
    <Screen style={$.only(['f-1'])} preset="scroll" safeAreaEdges={['top', ]}>
      <ConditionalComponent condition={isRegisterContainer}>
        <components.RegisterContainer
          style={$}
          setContainer={setIsRegisterContainer}
          inputData={inputData}
          setInputData={setInputData}
          errors={errors}
          setErrors={setErrors}
          handleSendOtp={handleSendOtp}
        />
        <components.OtpContainer
          style={$}
          setContainer={setIsRegisterContainer}
          inputData={inputData}
          handleSendOtp={handleSendOtp}
        />
      </ConditionalComponent>
    </Screen>
  )
})


const $InitialStyle = {
  'image': ['w-100', `h-80`, 'mh-auto'],
  'heading': ['h1', 'ta-center', 'fc-black', 'ffSemiBold'],
  'subHeading': ['body1', 'ta-center', 'fc-n700'],
  'inputRow': ['pt-10'],
  'label': ['h5', 'fc-n800', 'mb-5', 'ffNormal'],
  'textField': [`h-${isIos ? 35 : 40}`, `pv-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
  'textFieldWrapper': ['bc-n400'],
  'inputCell': ['w-45', 'h-50', 'lh-45', 'fc-p400', 'fs-24', 'bw-2', 'bc-n400', 'ta-center', 'br-6'],
  'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-15', 'w-100%']
}

