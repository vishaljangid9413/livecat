import React, { FC, useState } from "react"
import { AppStackScreenProps } from "app/navigators"
import { Pressable, View } from "react-native"
import { observer } from "mobx-react-lite"
import { AutoImage, Button, ConditionalComponent, Screen, SvgIcon, Text, TextField } from "app/components"
import { isIos, WINDOW_HEIGHT } from "app/theme/constants"
import useStyle from "app/hooks/useStyle"
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field"
import { colors } from "app/theme"
import { useApi } from "app/hooks/useApi"
import { ErrorToast } from "app/utils/formValidation"
import { useNavigation } from "@react-navigation/native"


const components = {
  LoginContainer(props: any) {
    const { style: $, setContainer, mobile, setMobile } = props
    const [error, setError] = useState(false)
    const navigation = useNavigation<any>()

    function handlePress() {
      if (mobile.length === 10) {
        setContainer(false)
      } else {
        setError(true)
        ErrorToast('Enter valid input!')
      }
    }
    
    return (
      <View style={$.only(['columnItemBetween', 'pt-5'])}>
        <View style={$.only(['h-87%'])}>
          <AutoImage style={$['image']} source={require("../../assets/images/welcome.png")} />
          <View style={$.only(['h-222', 'columnItemBetween', 'pt-10'])}>
            <Text style={$['heading']}>Login Your Account</Text>
            <View style={$['inputRow']}>
              <Text style={$['label']}>Mobile Number</Text>
              <TextField
                style={$['textField']}
                placeholder="Enter Mobile Number"
                inputWrapperStyle={[$['textFieldWrapper'], error && $.only(['bc-red'])]}
                keyboardType="numeric"
                maxLength={10}
                value={mobile}
                onChangeText={(text) => { setError(false); setMobile(text) }}
              />
            </View>
            <Pressable onPress={()=>navigation.navigate('Register')}>
              <Text style={$.only(['h6', 'ml-5', 'ffNormal', 'fc-p600'])}>Didn't have an account?</Text>
            </Pressable>
            <Button
              style={$['button']}
              text="Next"
              textStyle={$.only(['btn', 'fc-n100'])}
              pressedStyle={$.only(['bw-1', 'bc-p600'])}
              pressedTextStyle={$.only(['fc-p600'])}
              onPress={handlePress}
            />
          </View>
        </View>
      </View>
    )
  },
  OtpContainer(props: any) {
    const { style: $, setContainer, mobile } = props
    const { isLoading, call, rootApi } = useApi({})

    const [OTP, setOTP] = useState<string>('')
    const [value, setValue] = useState<string>('');
    const ref = useBlurOnFulfill({ cellCount: 6 });
    const [prop, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

    function handleSubmit() {
      if (mobile.length !== 10) {
        setContainer(true)
        return
      }

      if (OTP.length < 6) {
        ErrorToast('Enter proper MPIN!')
      } else {
        rootApi.auth.login({
          call,
          props: {
            data: { 'username': mobile, 'password': OTP },
          }
        })
      }
    }

    return (
      <View style={$.only([`h-${WINDOW_HEIGHT}`, 'relative', 'columnItemCenter'])}>
        <Pressable style={$.only(['absolute', `top-${isIos ? 0 : 10}`])}>
          <SvgIcon icon="back" size={25} onPress={() => setContainer(true)} />
        </Pressable>
        <View style={$.only(['h-30%', 'columnItemBetween'])}>
          <View>
            <Text style={$['heading']}>Enter MPIN</Text>
            <Text style={$['subHeading']}>Enter your Mobile Pin</Text>

            <View style={$.only(['mt-20'])}>
              <CodeField
                ref={ref}
                {...prop}
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

              <View style={$.only(['rowItemCenter', 'mt-5', 'd-none'])}>
                <Text style={$.only(['body1', 'fc-n700'])}>Didn't receive code? </Text>
                <Pressable onPress={() => { }}>
                  <Text style={$.only(['body1', 'fc-p500'])}> Resend</Text>
                </Pressable>
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


interface LoginScreenProps extends AppStackScreenProps<"Login"> { }
export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen() {
  const [$] = useStyle($InitialStyle)
  const [isLoginContainer, setIsLoginContainer] = useState(true)
  const [mobile, setMobile] = useState<string>('')

  return (
    <Screen style={$.only(['f-1'])} preset="scroll" safeAreaEdges={['top', 'bottom']}>
      <ConditionalComponent condition={isLoginContainer}>
        <components.LoginContainer
          style={$}
          setContainer={setIsLoginContainer}
          mobile={mobile}
          setMobile={setMobile}
        />
        <components.OtpContainer
          setContainer={setIsLoginContainer}
          mobile={mobile}
          style={$}
        />
      </ConditionalComponent>
    </Screen>
  )
})


const $InitialStyle = {
  'image': ['w-300', `h-${250}`, 'mh-auto'],
  'heading': ['h1', 'ta-center', 'fc-black', 'ffSemiBold'],
  'subHeading': ['body1', 'ta-center', 'fc-n700'],
  'inputRow': ['pt-10'],
  'label': ['h5', 'fc-n800', 'mb-5', 'ffNormal'],
  'textField': [`h-${isIos ? 35 : 40}`, `pv-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
  'textFieldWrapper': ['bc-n400'],
  'inputCell': ['w-45', 'h-50', 'lh-45', 'fc-p400', 'fs-24', 'bw-2', 'bc-n400', 'ta-center', 'br-6'],
  'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-10', 'w-100%',],
}
