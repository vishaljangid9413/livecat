import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Image, Platform, View } from "react-native"
import { AddIcon, ConditionalComponent, Screen, SvgIcon, Text } from "app/components"
import useStyle from "app/hooks/useStyle"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import { useApi } from "app/hooks/useApi"
import { ActivityIndicator } from "react-native-paper"
import { HOST_URL } from "app/config/config.base"
import { useStores } from "app/models"
import { useNavigation } from "@react-navigation/native"
import Checkbox from "expo-checkbox"
import { colors } from "app/theme"
import { SCREEN_HEIGHT } from "app/theme/constants"


interface VendorsScreenProps extends AppTabNavigatorScreenProps<"Vendors"> { }
export const VendorsScreen: FC<VendorsScreenProps> = observer(function VendorsScreen() {
  const { authStore: { getSearchText } } = useStores()
  const [$] = useStyle($InitialStyle)
  const navigation = useNavigation<any>()
  const { data: response, isLoading, call, rootApi } = useApi({searchText:getSearchText})
  const data = response?.data
  const {call:patchCall} = useApi({})
  const { call: deleteCall } = useApi({})

  const [isChecked, setIsChecked] = useState<any>({})

  function handleCheckbox(item:any, value:boolean){
    if(isChecked?.is_active !== value){
      setIsChecked((prev:any)=>({...prev, [item?.id]:value}))
      
      rootApi.vendor.patch({
        call:patchCall, urlSuffix:`${item?.id}/`,
        props:{
          data:{'is_active': value},
          meta:{
            showSuccessMessage:false,
            errorMessage:`Unable, to ${value? 'activate':'deactivate'} vendors!`,
            errorCallback({ error, query }) {
                setIsChecked((prev:any)=>({...prev, [item?.id]:!value}))
            },
          }
        }
      })
    }
  }

  function handleDelete(id: number) {
    rootApi.vendor.delete({
      call: deleteCall, urlSuffix: `${id}/`,
    })
  }

  useEffect(() => {
    rootApi.vendor.get({ call })
  }, [])

  function FlatListCard(item: any) {
    return (
      <View style={[$['cardContainer'], { shadowOffset: { width: 0, height: 2 } }]}>
        <View style={$.only(['rowAlign', 'w-80%', 'g-10'])}>
          <View style={$['productImageCont']}>
            <Image
              style={$.only(['wh100%', 'br-5'])}
              source={
                item?.logo ?
                  { uri: `${HOST_URL}${item?.logo}` } :
                  require('../../assets/images/app-icon-all.png')
              }
            />
          </View>
          <View style={$.only(['w-80%'])}>
            <Text style={$['customerName']}>{item?.name}</Text>
            <Text style={$.only(['body2', 'fc-n700'])}>{item?.contact_person}</Text>
            <Text style={$.only(['body2', 'fc-n700'])}>{item?.mobile ?? item?.email}</Text>
            <Text style={$.only(['body2', 'fc-n700'])}>{item?.tax}</Text>
            {item?.street_address && <Text style={$.only(['body2', 'fc-n700'])}>{item?.street_address}</Text>}
            <Text style={$.only(['body2', 'fc-n700'])}>{item?.zipcode?.formatted_address}</Text>
          </View>
        </View>
        <View style={$.only(['h-125', 'w-10%', 'columnItemAlignBetween'])}>
          <View style={$.only(['g-5', 'columnAlign'])}>
            <SvgIcon icon="edit" size={30} onPress={() => navigation.navigate('AddVendor', { vendorId: item?.id })} />
            <SvgIcon icon="delete" size={22} onPress={() => handleDelete(item?.id)} />
          </View>
          <Checkbox
            style={$['checkBox']}
            value={isChecked?.[item?.id] ?? item?.is_active}
            onValueChange={(value: any) => handleCheckbox(item, value)}
            color={(isChecked?.[item?.id] ?? item?.is_active) ? colors.palette.primary500 : undefined}
          />
        </View>
      </View>
    )
  }

  return (
    <Screen style={$.only([`f-1`])} preset="fixed" >
      <View style={$.only(['relative', `h-${SCREEN_HEIGHT()}`])}>
        <AddIcon navigate="AddVendor" params={{ vendorId: null }} />

        <ConditionalComponent condition={isLoading || !data}>
          <View style={$['activityIndicator']}>
            <ActivityIndicator size="large" />
          </View>
          <ConditionalComponent condition={data?.count > 0 && data}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={data?.results}
              contentContainerStyle={$.only(['g-5', 'pv-15'])}
              keyExtractor={(item, index) => item?.id}
              renderItem={({ index, item }: any) => FlatListCard(item)}
            />
            <View style={$['EmptyScreen']}>
              <SvgIcon icon="emptyVendor" />
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
  'cardContainer': ['el-4', 'bg-n50', 'w-98.5%', 'm-2.5', 'br-5', 'p-10', 'pl-15', 'rowItemBetween', ...iosShadowProperty],
  'productImageCont': ['h-55', 'w-55', 'centerItem', 'of-hidden', 'br-30'],
  'customerName': ['h5', 'fc-n900', 'ffMedium', 'pv-3'],
  'EmptyScreen': ['ph-40'],
  'activityIndicator': ['h-100%', 'as-center', 'jc-center'],
}


