import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Image, Platform, Pressable, ScrollView, TouchableOpacity, View } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { AddIcon, ConditionalComponent, Screen, SvgIcon, Text } from "app/components"
import useStyle from "app/hooks/useStyle"
import { useApi } from "app/hooks/useApi"
import { SCREEN_HEIGHT } from "app/theme/constants"
import { formatDate, formatTime } from "app/utils/formatDateTime"
import { HOST_URL } from "app/config/config.base"
import { useNavigation } from "@react-navigation/native"
import { ActivityIndicator } from "react-native-paper"
import { useStores } from "app/models"
import { ErrorToast } from "app/utils/formValidation"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"


const components = {
  ListContainer(props: any) {
    const { style: $, data } = props
    const {authStore:{isSeller}} = useStores()
    const navigation = useNavigation<any>()

    function handleGoLive(item: any) {
      if (item?.products?.length > 0) {
        navigation.navigate('LiveShowProducts', {showId:item?.id})
      } else {
        ErrorToast("Please, add some products first!")
      }
    }

    return (
      <FlatList
        onRefresh={() => { }}
        refreshing={false}
        showsVerticalScrollIndicator={false}
        data={data}
        contentContainerStyle={$.only(['g-5', 'pv-15'])}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ index, item }: any) => (
          <View style={[$['cardContainer'], { shadowOffset: { width: 0, height: 2 } }]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('LiveShowDetail', { showId: item?.id })}>

              <View style={$.only(['rowItemBetween'])}>
                <View style={$.only(['w-80%'])}>
                  <Text style={$.only(['h4', 'fc-n900', 'ffMedium'])}>{item?.title}</Text>
                  <ConditionalComponent condition={!isSeller}> 
                    <Text style={$.only(['h5', 'fc-n700'])}>Seller: {item?.seller_name}</Text>
                  </ConditionalComponent>
                </View>
                <ConditionalComponent condition={isSeller}>
                  <Pressable
                    style={$['liveButton']}
                    onPress={() => handleGoLive(item)}
                  >
                    <Text style={$.only(['h6'])}>Go Live</Text>
                  </Pressable>
                </ConditionalComponent>
              </View>

              <View style={$.only(['rowAlign', 'p-5'])}>
                <SvgIcon icon="calender" size={18} />
                <Text style={$['text']}>{formatDate(item?.date)}</Text>
                <SvgIcon icon="clock" size={18} />
                <Text style={$['text']}>{formatTime(item?.time)}</Text>
              </View>

            </TouchableOpacity>
            
            <ConditionalComponent condition={isSeller || item?.products?.length > 0}>
              <components.ImageContainer
                style={$}
                showId={item?.id}
                data={item?.products}
                isSeller={isSeller}
              />
            </ConditionalComponent>
          </View>
        )}
      />
    )
  },
  ImageContainer(props: any) {
    const { style: $, showId, data, isSeller } = props
    const navigation = useNavigation<any>()
    function handleAddProduct() {
      navigation.navigate("AddProducts",
        {
          showId: showId,
          selectedSKUs: data?.map((item: any) => item?.sku?.id)
        }
      )
    }

    return (
      <View style={[$.only(['row', 'pr-25'])]}>
        <View style={$.only(['br-4'])}>
          <ScrollView
            scrollEnabled={true}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={$.only(['maxw-100%'])}
          >
            {
              data.map((item: any) => (
                <ConditionalComponent key={item?.id} condition={item?.sku?.product_images.length > 0}>
                  <Image
                    style={$['productImage']}
                    source={{ uri: `${HOST_URL}${item?.sku?.product_images.at(-1)}` }}
                  />
                  <View key={item?.id} style={[$['productImage'], $.only(['centerItem'])]}>
                    <SvgIcon icon="productDummy" size={45} />
                  </View>
                </ConditionalComponent>
              ))
            }
          </ScrollView>
        </View>
        <ConditionalComponent condition={isSeller}>
          <View style={$['addProductIcon']}>
            <SvgIcon
              icon="grayAdd"
              size={20}
              onPress={handleAddProduct} />
          </View>
        </ConditionalComponent>
      </View>
    )
  }
}


interface LiveShowsScreenProps extends AppTabNavigatorScreenProps<"LiveShows"> { }
export const LiveShowsScreen: FC<LiveShowsScreenProps> = observer(function LiveShowsScreen() {
  const { authStore: { getSearchText } } = useStores()
  const [$] = useStyle($InitialStyle)
  const { data:response, isLoading, error, call, rootApi } = useApi({searchText:getSearchText})
  const data = response?.data 

  useEffect(() => {
    rootApi.liveshow.get({call});
  }, [])
  
  function EmptyScreen() {
    return (<View style={$['EmptyScreen']}>
      <SvgIcon icon="emptyLiveShow" />
    </View>)
  }
  
  return (
    <Screen style={$.only([`f-1`])} preset="fixed" >
      <View style={[$.only(['relative']),{height:'100%'}]}>
        <AddIcon navigate="CreateLiveShow" />
       
        <ConditionalComponent condition={error} >
          <EmptyScreen />
          <ConditionalComponent condition={isLoading || !data}>
            <View style={$['activityIndicator']}>
              <ActivityIndicator size="large" />
            </View>
            <ConditionalComponent condition={data?.count > 0 && data}>
              <components.ListContainer 
                style={$}
                data={data?.results}
              />
              <EmptyScreen />
            </ConditionalComponent>
          </ConditionalComponent>
        </ConditionalComponent>
      </View>
    </Screen >
  )
})


const $InitialStyle = {
  'cardContainer': ['el-4', 'bg-n50', 'h-auto', 'w-98%', 'm-3.5', 'br-5', 'p-8',
    ...(Platform.OS !== 'ios' ? [] : ['sc-n700', 'shOffSetW0H2', 'so-0.3', 'sr-4'])],
  'productImage': ['w-60', 'h-60', 'br-5', 'mr-7', 'bw-1', 'bc-n300'],
  'addProductIcon': ['w-8%', 'h-60', 'pl-6', 'centerItem'],
  'text': ['fc-n700', 'body1', 'ph-8'],
  'liveButton': ['pb-2.5', 'pt-0', 'ph-7', 'br-15', 'bg-red'],
  'EmptyScreen': ['ph-40'],
  'activityIndicator': ['h-100%', 'as-center', 'jc-center'],
}
