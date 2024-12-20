import React, { FC, useState } from "react"
import { $heading, $link, $secondaryText, $textAlign } from "app/theme/style"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { borderRadius, colors, gap } from "app/theme"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { observer } from "mobx-react-lite"
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { CELL_COUNT } from "app/theme/constants"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface OtpVerificationScreenProps extends AppStackScreenProps<"OtpVerification"> {}

export const OtpVerificationScreen: FC<OtpVerificationScreenProps> = observer(function OtpVerificationScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  const [OTP,setOTP] = useState<string>('')
  const [value, setValue] = useState<string>('');
  
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <Screen style={$root} preset="fixed" safeAreaEdges={['top','bottom']}>
      <View style={gap.medium}>
        <View style={gap.normal}>
          <Text style={[$heading.h1,$textAlign.center]}>OTP Verification</Text>
          <Text style={[$secondaryText.text1]}>Enter the verification code we just sent to your number +919 *******53.</Text>
        </View>
        <View style={gap.normal}>
          <CodeField
            ref={ref}
            {...props}
            // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
            value={OTP}
            onChangeText={setOTP}
            cellCount={CELL_COUNT}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[$cell,borderRadius.normal, isFocused && {borderColor: colors.focus}]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
          <Text style={[$secondaryText.text1,$textAlign.center]}>Didn’t receive code? <Text style={$link}>Resend</Text></Text>
        </View>
      </View>
      <Button
        style={{marginTop:100}}
        preset="default"
        text="Verify"
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  justifyContent:'center'
}

const $cell:StyleProp<TextStyle> = {
  width: 46,
  height: 50,
  lineHeight: 45,
  fontSize: 24,
  borderWidth: 2,
  borderColor: colors.palette.neutral400,
  textAlign: 'center',
}