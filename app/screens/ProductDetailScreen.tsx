import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Dimensions, Image, View } from "react-native"
import { ConditionalComponent, ProductDetail, Screen, SvgIcon } from "app/components"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import useStyle from "app/hooks/useStyle"
import { useApi } from "app/hooks/useApi"
import { useRoute } from "@react-navigation/native"
import { validateParams } from "app/utils/generics"



interface ProductDetailScreenProps extends AppTabNavigatorScreenProps<"ProductDetail"> { }
export const ProductDetailScreen: FC<ProductDetailScreenProps> = observer(function ProductDetailScreen() {
  const [$] = useStyle($InitialStyle)
  const {productId}:any = validateParams(useRoute<any>())
  const { data, isLoading, call, rootApi } = useApi({})

  useEffect(() => {
    rootApi.catalogue.skus({ call })
  }, [])

  return (
    <Screen style={$.only(['f-1', 'ph-0'])} preset="fixed" >
      <ConditionalComponent condition={(isLoading && !data)}>
        <View style={$['skeleton']}>
          <Image source={require('../../assets/skeleton/product_image.gif')} />
        </View>
        <ConditionalComponent condition={data && data?.count > 0} >
            <ProductDetail
              data={data?.results}
              currentItem={productId}
            />
          <View style={$['EmptyScreen']}>
            <SvgIcon icon="emptyProduct" />
          </View>
        </ConditionalComponent>
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
  'EmptyScreen': ['ph-40'],
  'activityIndicator': ['h-100%', 'as-center', 'jc-center'],
}
