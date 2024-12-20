import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { AddIcon, ConditionalComponent, ProductCard, Screen, SvgIcon } from "app/components"
import useStyle from "app/hooks/useStyle"
import { FlatList } from "react-native-gesture-handler"
import { useApi } from "app/hooks/useApi"
import { ActivityIndicator } from "react-native-paper"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import { SCREEN_HEIGHT } from "app/theme/constants"
import { useStores } from "app/models"


interface ProductsListScreenProps extends AppTabNavigatorScreenProps<"ProductsList"> { }
export const ProductsListScreen: FC<ProductsListScreenProps> = observer(function ProductsListScreen() {
  const { authStore: { getSearchText } } = useStores()
  const [$] = useStyle({
    'screen': ['relative', `h-${SCREEN_HEIGHT()}`],
    'EmptyScreen': ['ph-40'],
    'activityIndicator': ['h-100%', 'as-center', 'jc-center'],
  })
  const { data, isLoading, call, rootApi } = useApi({searchText:getSearchText})

  useEffect(() => {
    rootApi.catalogue.skus({ call })
  }, [])
 
  return (
    <Screen style={$.only([`f-1`])} preset="fixed" >
      <View style={[$['screen'],{ height:"100%"}]}>
        <AddIcon navigate="ProductsUpload" />
        <ConditionalComponent condition={isLoading || !data} >
          <View style={$['activityIndicator']}>
            <ActivityIndicator size="large" />
          </View>
          <ConditionalComponent condition={data?.count > 0 && data?.results}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data?.results}
              contentContainerStyle={$.only(['g-5', 'pv-15'])}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ index, item }: any) => (
                <ProductCard data={{ ...item }} />
              )}
            />
            <View style={$['EmptyScreen']}>
              <SvgIcon icon="emptyProduct" />
            </View>
          </ConditionalComponent>
        </ConditionalComponent>
      </View>
    </Screen>
  )
})
