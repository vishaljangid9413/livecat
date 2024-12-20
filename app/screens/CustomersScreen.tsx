import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Image, Platform, TouchableOpacity, View } from "react-native"
import { AddIcon, ConditionalComponent, Screen, SvgIcon, Text } from "app/components"
import useStyle from "app/hooks/useStyle"
import { useApi } from "app/hooks/useApi"
import { SCREEN_HEIGHT } from "app/theme/constants"
import { ActivityIndicator } from "react-native-paper"
import { useStores } from "app/models"
import Checkbox from "expo-checkbox"
import { colors } from "app/theme"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"

interface CustomersScreenProps extends AppTabNavigatorScreenProps<"Customers"> { }
export const CustomersScreen: FC<CustomersScreenProps> = observer(function CustomersScreen() {
  const { authStore: { getSearchText } } = useStores()
  const [$] = useStyle($InitialStyle)
  const { data, isLoading, call, rootApi } = useApi({ searchText: getSearchText })
  const { call: deleteCall } = useApi({})
  const { call: patchCall } = useApi({})

  const [isChecked, setIsChecked] = useState<any>({})

  function handleDelete(id: number) {
    rootApi.customer.delete({
      call: deleteCall, urlSuffix: `${id}/`,
    })
  }

  function handleCheckbox(item: any, value: boolean) {
    if (isChecked?.is_active !== value) {
      setIsChecked((prev: any) => ({ ...prev, [item?.id]: value }))

      rootApi.customer.patch({
        call: patchCall, urlSuffix: `${item?.id}/`,
        props: {
          data: { 'is_active': value },
          meta: {
            showSuccessMessage: false,
            errorMessage: `Unable, to ${value ? 'activate' : 'deactivate'} customer!`,
            errorCallback({ error, query }) {
              setIsChecked((prev: any) => ({ ...prev, [item?.id]: !value }))
            },
          }
        }
      })
    }
  }

  useEffect(() => {
    rootApi.customer.get({ call })
  }, [])

  return (
    <Screen style={$.only([`f-1`, 'relative'])} preset="fixed" >
      <View style={[$.only(['relative']),{height:'100%'}]}>
        <AddIcon navigate="AddNewCustomer" />
        <ConditionalComponent condition={isLoading || !data} >
          <View style={$['activityIndicator']}>
            <ActivityIndicator size="large" />
          </View>
          <ConditionalComponent condition={data?.count > 0 && data}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data?.results}
              contentContainerStyle={$.only(['g-5', 'pv-15'])}
              keyExtractor={(item, index) => item?.id}
              renderItem={({ index, item }: any) => (
                <View style={[$['cardContainer'], { shadowOffset: { width: 0, height: 2 } }]}>
                  <View style={$.only(['rowAlign', 'w-80%', 'g-10'])}>
                    <View style={$['productImageCont']}>
                      <Image source={require('../../assets/images/profile_img.png')} style={$.only(['wh100%', 'br-5'])} />
                    </View>
                    <View style={$.only(['w-80%'])}>
                      <Text style={$['customerName']}>{item?.full_name}</Text>
                      <Text style={$.only(['body2', 'fc-n700'])}>{item?.mobile}</Text>
                      <Text style={$.only(['body2', 'fc-n700'])}>{item?.email}</Text>
                    </View>
                  </View>
                  <View style={$.only(['g-15'])}>
                    <TouchableOpacity style={$.only(['columnAlign'])}
                      onPress={() => handleDelete(item?.id)}>
                      <SvgIcon icon="delete" size={22} />
                    </TouchableOpacity>
                    <Checkbox
                      style={$['checkBox']}
                      value={isChecked?.[item?.id] ?? item?.is_active}
                      onValueChange={(value: any) => handleCheckbox(item, value)}
                      color={(isChecked?.[item?.id] ?? item?.is_active) ? colors.palette.primary500 : undefined}
                    />
                  </View>
                </View>
              )}
            />
            <View style={$['EmptyScreen']}>
              <SvgIcon icon="emptyCustomer" />
            </View>
          </ConditionalComponent>
        </ConditionalComponent>
      </View>
    </Screen>
  )
})

const iosShadowProperty = Platform.OS !== 'ios' ? ['of-hidden',] :
  ['sc-n700', 'shOffSetW0H2', 'so-0.3', 'sr-4']

const $InitialStyle = {
  'cardContainer': ['el-4', 'bg-n50', 'w-98.5%', 'm-2.5', 'br-5', 'p-10', 'rowItemBetween', ...iosShadowProperty],
  'productImageCont': ['h-55', 'w-55', 'centerItem', 'of-hidden', 'br-30'],
  'customerName': ['h5', 'fc-n900', 'ffMedium', 'pv-3'],
  'EmptyScreen': ['ph-40'],
  'activityIndicator': ['h-100%', 'as-center', 'jc-center'],
}