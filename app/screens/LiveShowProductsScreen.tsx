import React, { FC, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, Image, View } from "react-native"
import { ConditionalComponent, ProductDetail, Screen } from "app/components"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import useStyle from "app/hooks/useStyle"
import { validateParams } from "app/utils/generics"
import { useRoute } from "@react-navigation/native"
import { useApi } from "app/hooks/useApi"

interface LiveShowProductsScreenProps extends AppTabNavigatorScreenProps<"LiveShowProducts"> {}
export const LiveShowProductsScreen: FC<LiveShowProductsScreenProps> = observer(function LiveShowProductsScreen() {
  const [$] = useStyle($InitialStyle)
  const {showId}:any = validateParams(useRoute<any>())
  const { data:response, isLoading, call, rootApi } = useApi({})
  const data = response?.data

  useMemo(() => {
    rootApi.liveshow.get({
      call, urlSuffix: `${showId}/`
    })
  }, [showId])

  return (
    <Screen style={$.only(['f-1', 'ph-0'])} preset="fixed" >
      <ConditionalComponent condition={isLoading || !data}>
        <View style={$['skeleton']}>
          <Image source={require('../../assets/skeleton/product_image.gif')} />
        </View>
        <ProductDetail data={data?.products?.map((item:any)=>item?.sku)} />
      </ConditionalComponent>
    </Screen>
  )
})


const $InitialStyle = {
  'skeleton': [`w-${Dimensions.get("window").width}`, 'h-100%', 'centerItem', 'bg-n300'],
  'imageCont': [`w-${Dimensions.get("window").width},'centerItem`, 'bw-1', 'bbc-white', 'bg-black'],
  'productName': ['h2', 'fc-n800', 'ffSemiBold'],
  'productPrice': ['h4', 'fc-n800', 'ffMedium'],
  'productCodeCont': ['pv-5', 'ph-10', 'bg-p600', 'br-5', 'w-126', 'h-65'],
  'productCode': ['h4', 'ta-center', 'ffBold'],
  'activityIndicator': ['h-100%', 'as-center', 'jc-center'],
}