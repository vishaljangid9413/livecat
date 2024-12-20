import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, Pressable, ScrollView, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, SvgIcon, Text } from "app/components"
import { AppTabNavigatorParamList } from "app/navigators/AppTabNavigator"
import { SCREEN_HEIGHT } from "app/theme/constants"
import useStyle from "app/hooks/useStyle"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ProductDetailScreenProps extends AppTabNavigatorParamList<"ProductDetail"> { }

export const ProductDetailScreen: FC<ProductDetailScreenProps> = observer(function ProductDetailScreen() {
  const [$] = useStyle({
    'bannerCont': ['h-220','of-auto','itemCenter'],
    'productName':['h1','fc-n800','ffSemiBold'],
    'productPrice':['h3','fc-n800','ffMedium'],
    'productCodeCont':['pv-5', 'ph-10', 'bg-p600', 'br-5', 'w-156'],
    'productCode':['h2', 'ta-center', 'ffBold'],
    'buttonCont': ['absolute', 'bottom-0', 'left-0', 'right-0', 'ph-15','bg-white'],
    'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-10', 'w-100%',]
  })
  const navigation = useNavigation<any>()

  return (
    <Screen style={$.only(['f-1', 'ph-0','relative'])} preset="fixed" >
      <View >
        <View style={$['bannerCont']}>
          <Image source={require('../../assets/images/product_description.png')} style={$.only(['wh100%'])} />
        </View>
        <View style={$.only(['h-65%', 'p-16'])}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={$.only(['rowItemAlignBetween', 'mb-10'])}>
              <View>
                <Text style={$['productName']}>Shoes</Text>
                <Text style={$['productPrice']}>Price Rs. 3500</Text>
              </View>
              <View style={$['productCodeCont']}>
                <Text style={$['productCode']}>Product Code 1688</Text>
              </View>
            </View>
            <View style={$.only([`pb-70`])}>
              <Text style={$.only(['h4','fc-n900','ffMedium','pb-5'])}>Description </Text>
              <Text style={$.only(['body1','fc-n700'])}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem reiciendis nobis corrupti, sapiente sequi mollitia numquam aspernatur excepturi asperiores voluptas temporibus possimus expedita veniam aliquam delectus voluptatibus .
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempora omnis sint dolorum non molestias sequi hic quos quis, quasi cum fugit expedita possimus aspernatur excepturi deserunt pariatur! Enim ipsam soluta, eos vel sapiente, nulla pariatur veritatis id architecto voluptas libero consequuntur earum eum consectetur dolorum aspernatur excepturi quod? Velit, illum.
              </Text>
            </View>
          </ScrollView> 
        </View>

      </View>
      <View style={$['buttonCont']}>
        <Button
          style={$['button']} 
          text="Create Order"
          textStyle={$.only(['btn', 'fc-n100'])}
          pressedStyle={$.only(['bw-1','bc-p600'])}
          pressedTextStyle={$.only(['fc-p600'])}
          // pending={true}
          // text={isBasketSubmitPending ? "...Submitting" : "Submit"}
          // onPress={() => handleSubmit()}
        />
      </View>
    </Screen>
  )
})

