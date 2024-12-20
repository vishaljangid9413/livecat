import React, { FC, useEffect, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { View } from "react-native"
import { Button, ConditionalComponent, ProductCard, Screen, SvgIcon } from "app/components"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import { SCREEN_HEIGHT } from "app/theme/constants"
import { useNavigation, useRoute } from "@react-navigation/native"
import useStyle from "app/hooks/useStyle"
import { FlatList } from "react-native-gesture-handler"
import { useApi } from "app/hooks/useApi"
import { ActivityIndicator } from "react-native-paper"
import { validateParams } from "app/utils/generics"
import { ErrorToast } from "app/utils/formValidation"
import { useStores } from "app/models"

interface AddProductsScreenProps extends AppTabNavigatorScreenProps<"AddProducts"> {}
export const AddProductsScreen: FC<AddProductsScreenProps> = observer(function AddProductsScreen() {
  const navigation = useNavigation<any>()
  const {authStore:{getSearchText}} = useStores()

  const {showId, selectedSKUs}: any = validateParams(useRoute())
  const [$] = useStyle($InitialStyle)
  const { data, isLoading, call, rootApi } = useApi({searchText:getSearchText})
  const { call: addProduct, isLoading: addProductLoading } = useApi({})

  const [selectedCheckbox, setSelectedCheckbox] = React.useState<any>([])

  // Filter out Selected Products
  const productsData = useMemo(() => {
    return selectedSKUs ? data?.results?.filter((item: any) => !selectedSKUs.includes(item?.id)) : false
  }, [selectedSKUs, data])

  // Filtering Product data 
  const filterProductsData = useMemo(() => {
    if (!!getSearchText && productsData) {
      const filterData = productsData.filter((item: any) => {
        return item?.sku_title?.toLowerCase().includes(getSearchText.trim())
      })
      return filterData.length > 0 && filterData
    } else {
      return productsData
    }
  }, [getSearchText, productsData])

  function handleToggle(value: boolean, id: number) {
    setSelectedCheckbox(
      (prev: any) => !!value ?
        ([...prev, id]) :
        (prev.filter((item: any) => item != id))
    )
  }

  function handleSubmit() {
    if (selectedCheckbox.length == 0) {
      ErrorToast('Please, select a product')
      return;
    }

    rootApi.liveshow.skuAdd({
      call: addProduct,
      props: {
        data: {
          'live_show': showId,
          'sku': selectedCheckbox
        },
        meta: {
          successCallback({ data, query }) {
            navigation.navigate('LiveShows', {
              showId: showId
            })
          }
        }
      }
    })
  }

  useEffect(() => {
    rootApi.catalogue.skus({ call })
  }, [])

  return (
    <Screen preset="fixed">
      <View style={$.only([`h-${SCREEN_HEIGHT()}`])}>
        <ConditionalComponent condition={isLoading || !data}>
          <View style={$['activityIndicator']}>
            <ActivityIndicator size="large" />
          </View>
          <ConditionalComponent condition={data?.count > 0 && !!filterProductsData[0]}>
            <View style={$.only(['columnItemBetween', 'pt-5', 'h-100%'])}>
              <FlatList
                onRefresh={() => { }}
                refreshing={false}
                data={filterProductsData}
                contentContainerStyle={$.only(['g-5', 'pv-15'])}
                keyExtractor={(item, index) => item?.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ index, item }: any) => (
                  <ProductCard
                    isCheckboxCard={true}
                    onCheck={(value: boolean) => handleToggle(value, item?.id)}
                    data={item}
                    checked={selectedCheckbox.includes(item?.id)}
                  />
                )}
              />
              <Button
                style={$['button']}
                text="Submit"
                textStyle={$.only(['btn', 'fc-n100'])}
                pressedStyle={$.only(['bw-1', 'bc-p600'])}
                pressedTextStyle={$.only(['fc-p600'])}
                onPress={handleSubmit}
                pending={addProductLoading}
              />
            </View>
            <View style={$['EmptyScreen']}>
              <SvgIcon icon="emptyProduct" />
            </View>
          </ConditionalComponent>
        </ConditionalComponent>
      </View>
    </Screen>
  )
})


const $InitialStyle = {
  'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-10', 'w-100%',],
  'activityIndicator': ['h-100%', 'as-center', 'jc-center'],
}
