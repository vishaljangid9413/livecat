import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, View } from "react-native"
import { Button, Screen, Text } from "app/components"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import useStyle from "app/hooks/useStyle"
import { SCREEN_HEIGHT } from "app/theme/constants"
import { useNavigation, useRoute } from "@react-navigation/native"
import { validateParams } from "app/utils/generics"


interface CongratulationsScreenProps extends AppTabNavigatorScreenProps<"Congratulations"> { }
export const CongratulationsScreen: FC<CongratulationsScreenProps> = observer(function CongratulationsScreen() {
  const navigation = useNavigation<any>();
  const [$] = useStyle($InitialStyle)
  const {orderId, amount}:any = validateParams(useRoute())

  return (
    <Screen style={$.only(['f-1'])} preset="fixed">
      <View style={$.only(['columnItemBetween', `h-${SCREEN_HEIGHT()}`])}>
        <View>
          <View style={$['imageCont']}>
            <Image source={require('../../assets/images/payment_success.png')} style={$.only(['w-100%'])} />
          </View>
          <View style={$.only(['h-40%','columnItemAlignBetween'])}>
            <Text style={$.only(['w-60%','h3','fc-n700','ffMedium','ta-center'])}>Your Order has been successfully created</Text>
            <View style={$.only(['w-50%'])}>
              <Text style={$.only(['body1','fc-n800','ta-center'])}>Total Amount</Text>
              <Text style={$['amountText']}>{amount ?? '0'}/-</Text>
            </View>
            <Button
              text="Track Order"
              style={$['button']}
              textStyle={$['buttonText']}
              pressedStyle={$['pressedButton']}
              pressedTextStyle={$['pressedButtonText']}
              onPress={() => navigation.navigate('Orders')}
            />
          </View>
        </View>
        <View style={$.only(['centerItem','g-10','pv-15'])}>
          <Button
            text="Back To Products"
            style={$['button']}
            textStyle={$['buttonText']}
            pressedStyle={$['pressedButton']}
            pressedTextStyle={$['pressedButtonText']}
            onPress={() => navigation.navigate('ProductsList')}
          />
          <Button
            text="Invoice Share"
            style={[$['button'],$['pressedButton']]}
            textStyle={$.only(['fc-white','btn'])}
            pressedStyle={$.only(['bg-white'])}
            pressedTextStyle={$['buttonText']}  
            onPress={() => navigation.navigate('Invoice', {orderId:orderId})}
          />
        </View>
      </View>
    </Screen>
  )
})

const $InitialStyle = {
  'imageCont':['p-30','ph-50','h-250','centerItem'],
  'amountText':['h3','fc-n900','ffMedium','ta-center','pt-5'],
  'button':['w-47%','h-42','br-20','bg-white','bw-1','bc-p600'],
  'buttonText':['fc-p600','btn'],
  'pressedButton':['bg-p600'],
  'pressedButtonText':['fc-white','btn'],
}