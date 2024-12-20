import React, { FC, useMemo } from "react"
import { observer } from "mobx-react-lite"
import { Image, Pressable, ScrollView, View } from "react-native"
import { ConditionalComponent, Screen, Text } from "app/components"
import { AppTabNavigatorParamList, AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import useStyle from "app/hooks/useStyle"
import { SCREEN_HEIGHT } from "app/theme/constants"
import { useApi } from "app/hooks/useApi"
import { useNavigation, useRoute } from "@react-navigation/native"
import { HOST_URL } from "app/config/config.base"
import { formatDate } from "app/utils/formatDateTime"
import { ActivityIndicator } from "react-native-paper"
import { validateParams } from "app/utils/generics"


const components = {
  ProductContainer(props: any) {
    const { style: $, data } = props

    return (
      <View style={$.only(['rowAlign', 'g-10'])}>
        <View style={$['productImageCont']}>
          <Image
            source={data?.product_image ?
              { uri: HOST_URL + data?.product_image } :
              require('../../assets/images/order_1.png')}
            style={$.only(['wh100%', 'br-5'])}
          />
        </View>
        <View style={$.only(['w-78%'])}>
          <View style={$.only(['rowItemBetween', 'mb-5'])}>
            <Text style={$.only(['h5', 'fc-n900', 'ffMedium', 'w-170'])} ellipsizeMode="tail" numberOfLines={2}>{data?.product_name}</Text>
            <Text style={$.only(['body2', 'fc-booked', 'ffMedium'])}>{data?.status}</Text>
          </View>
          <View style={$.only(['rowItemBetween', 'mb-5'])}>
            <Text style={$.only(['body2', 'fc-n700', 'w-170'])} ellipsizeMode="tail" numberOfLines={2}>Code: {data?.sku_code}</Text>
            <Text style={$.only(['h6', 'fc-n900'])}>$ {data?.price_incl_tax}</Text>
          </View>
          <View style={$.only(['rowItemBetween', 'mb-5'])}>
            <Text style={$.only(['body2', 'fc-n700', 'w-170'])} ellipsizeMode="tail" numberOfLines={2}>{data?.user_full_name}</Text>
            <Text style={$.only(['body2', 'fc-n700'])}>{data?.date_and_time ? formatDate(data?.date_and_time.split(' ')[0]) : "--"}</Text>
          </View>
        </View>
      </View>
    )
  },
  AddressContainer(props: any) {
    const { style: $, data } = props

    return (
      <>
        <ConditionalComponent condition={data?.billing_address}>
          <View style={$.only(['mv-10'])}>
            <Text style={$.only(['h5', 'fc-n900', 'pb-5'])}>Billing Address</Text>
            <Text style={$.only(['body2', 'fc-n700'])}>{data?.user_full_name}</Text>
            <Text style={$.only(['body2', 'fc-n700'])}>{data?.billing_address}</Text>
          </View>
        </ConditionalComponent>
        <ConditionalComponent condition={data?.shipping_address} >
          <View style={$.only(['mv-10'])}>
            <Text style={$.only(['h5', 'fc-n900', 'pb-5'])}>Shipping Address</Text>
            <Text style={$.only(['body2', 'fc-n700'])}>{data?.user_full_name}</Text>
            <Text style={$.only(['body2', 'fc-n700'])}>{data?.shipping_address}</Text>
          </View>
        </ConditionalComponent>
      </>
    )
  },
  AmountContainer(props: any) {
    const { style: $, data } = props

    return (
      <View style={$['amountCont']}>
        <View style={$.only(['rowItemAlignBetween', 'mb-5'])}>
          <Text style={$.only(['body1', 'fc-n700'])}>Net Amount:</Text>
          <Text style={$.only(['h6', 'fc-n700', 'ffMedium'])}>$ {data?.price_excl_tax}</Text>
        </View>
        <View style={$.only(['rowItemAlignBetween', 'mb-5'])}>
          <Text style={$.only(['body1', 'fc-n700'])}>Total Tax:</Text>
          <Text style={$.only(['h6', 'fc-n700', 'ffMedium'])}>$ {data?.price_incl_tax - data?.price_excl_tax}</Text>
        </View>
        <View style={$.only(['rowItemAlignBetween', 'mb-5'])}>
          <Text style={$.only(['body1', 'fc-n700'])}>Total Amount:</Text>
          <Text style={$.only(['h6', 'fc-n700', 'ffMedium'])}>$ {data?.price_incl_tax}</Text>
        </View>
      </View>
    )
  },
  TermsAndConditions(props: any) {
    const { style: $ } = props

    return (
      <View style={$.only(['pv-10'])}>
        <View style={$.only(['rowItemCenter'])}>
          <Text style={$['policyText']}>By continuing you accept our</Text>
          <Pressable onPress={() => { }}>
            <Text style={$['policyTextBlue']}> Terms of Service.</Text>
          </Pressable>
        </View>
        <Text style={$['policyText']}>Also learn how we process your data in our  </Text>
        <View style={$.only(['rowItemCenter'])}>
          <Pressable onPress={() => { }}>
            <Text style={$['policyTextBlue']}>Privacy Policy </Text>
          </Pressable>
          <Text style={$['policyText']}>and</Text>
          <Pressable onPress={() => { }}>
            <Text style={$['policyTextBlue']}> Cookies policy.</Text>
          </Pressable>
        </View>
      </View>
    )
  }
}


interface InvoiceScreenProps extends AppTabNavigatorScreenProps<"Invoice"> { }
export const InvoiceScreen: FC<InvoiceScreenProps> = observer(function InvoiceScreen() {
  const navigation = useNavigation<any>()
  const {orderId}: any = validateParams(useRoute())

  const [$] = useStyle($InitialStyle)
  const { data: response, isLoading, error, call, rootApi } = useApi({})
  const data = response?.data

  if (!orderId || error) {
    navigation.navigate("Orders")
  }

  useMemo(() => {
    if (orderId) {
      rootApi.order.get({
        call, urlSuffix: `${orderId}/`,
        props: {
          meta: {
            errorMessage: "Unable to fetch invoice!"
          }
        }
      })
    }
  }, [orderId])

  return (
    <Screen style={$.only(['f-1'])} preset="fixed">
      <View style={$.only(['columnItemBetween', `h-${SCREEN_HEIGHT()}`])}>
        <ConditionalComponent condition={isLoading || !data}>
          <View style={$['activityIndicator']}>
            <ActivityIndicator size="large" />
          </View>
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={$.only(['mv-20', 'p-5'])}>
                <Image
                  style={$.only(['h-45', 'w-150'])}
                  source={require('../../assets/images/logo_with_name.png')}
                />
              </View>
              <components.ProductContainer style={$} data={data} />
              <components.AddressContainer style={$} data={data} />
              <components.AmountContainer style={$} data={data} />
            </ScrollView>
            <components.TermsAndConditions style={$} />
          </>
        </ConditionalComponent>
      </View>
    </Screen>
  )
})


const $InitialStyle = {
  'productImageCont': ['h-55', 'w-18%', 'centerItem', 'of-auto', 'br-5'],
  'amountCont': ['mv-10', 'bw-1', 'bc-n400', 'br-5', 'p-10'],
  'policyText': ['body2', 'fc-n700', 'ta-center'],
  'policyTextBlue': ['body2', 'fc-p500', 'ta-center'],
  'activityIndicator': ['h-100%', 'as-center', 'jc-center'],
}

