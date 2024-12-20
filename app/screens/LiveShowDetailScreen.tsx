import React, { FC, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, Pressable, View } from "react-native"
import { AddIcon, Button, ConditionalComponent, ProductCard, Screen, SharableComponent, SvgIcon, Text } from "app/components"
import { AppTabNavigatorParamList, AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import { isIos, SCREEN_HEIGHT } from "app/theme/constants"
import useStyle from "app/hooks/useStyle"
import { ScrollView } from "react-native-gesture-handler"
import { useApi } from "app/hooks/useApi"
import { useNavigation, useRoute } from "@react-navigation/native"
import { ActivityIndicator } from "react-native-paper"
import { formatDate, formatTime } from "app/utils/formatDateTime"
import { validateParams } from "app/utils/generics"
import { ErrorToast } from "app/utils/formValidation"
import { throttle } from "app/utils/debouce"
import { useStores } from "app/models"


const components = {
  BannerContainer(props: any) {
    const { style: $, data, shareViewRef, navigation } = props
    const { authStore: { isSeller } } = useStores()
    const { call, rootApi } = useApi({})

    function handleEdit() {
      navigation.navigate('CreateLiveShow', {
        showId: data?.id
      })
    }

    function handleDelete() {
      rootApi.liveshow.delete({
        call, urlSuffix: `${data?.id}/`,
        props: {
          meta: {
            successCallback({ data, query }) {
              navigation.navigate("LiveShows")
            }
          }
        }
      })
    }

    return (
      <View style={$['bannerCont']}>
        <Image
          style={$.only(['wh100%'])}
          source={
            data?.banner_image ?
              { uri: data?.banner_image } :
              require('../../assets/images/product_description.png')
          }
        />
        <ConditionalComponent condition={isSeller}>
          <View style={$['editIcons']}>
            <SvgIcon
              icon="edit"
              size={28}
              onPress={handleEdit}
            />
            <View style={$.only(['bg-white', 'br-50', 'p-4'])}>
              <SvgIcon
                icon="share" size={18}
                onPress={() => { shareViewRef.current.share() }}
              />
            </View>
            <View style={$.only(['bg-white', 'br-50', 'p-4'])}>
              <SvgIcon
                icon="delete" size={18}
                onPress={handleDelete}
              />
            </View>
          </View>
        </ConditionalComponent>
      </View>
    )
  },
  ContentContainer(props: any) {
    const { style: $, data } = props
    const navigation = useNavigation<any>()
    const { authStore: { isSeller } } = useStores()

    function handleGoLive() {
      if (data?.products?.length > 0) {
        navigation.navigate('LiveShowProducts', { showId: data?.id })
      } else {
        ErrorToast("Please, add some products first!")
      }
    }

    return (
      <>
        <View style={$.only(['rowItemAlignBetween'])}>
          <Text style={$.only(['h4', 'fc-n900', 'w-80%'])}>{data?.title}</Text>
          <ConditionalComponent condition={isSeller}>
            <Pressable style={$['liveButton']} onPress={handleGoLive}>
              <Text style={$.only(['h6'])}>Go Live</Text>
            </Pressable>
          </ConditionalComponent>
        </View>
        <View style={$.only(['rowItemAlignBetween', 'pv-5'])}>
          <View style={$.only(['rowAlign'])}>
            <SvgIcon icon="calender" size={18} />
            <Text style={$['text']}>{formatDate(data?.date)}</Text>
          </View>
          <View style={$.only(['rowAlign'])}>
            <SvgIcon icon="clock" size={18} />
            <Text style={$['text']}>{formatTime(data?.time)}</Text>
          </View>
        </View>
        <ConditionalComponent condition={data?.platforms.length > 0} >
          <View style={$.only(['row', 'pv-5', 'g-8'])}>
            {
              data?.platforms.map((item: any, index: any) => (
                <SvgIcon key={index} icon="facebook" size={25} />
              ))
            }
          </View>
        </ConditionalComponent>
      </>
    )
  },
  ProductContainer(props: any) {
    const { style: $, data, showId,isSeller, navigation } = props
    const { call, rootApi } = useApi({})
    const [productSequence, setProductSequence] = useState<any>([])

    const handler = {
      handleSequence(navigate: string, cardId: number) {
        if (productSequence?.length > 0) {
          throttle(() => {
            const newSequence = handler.sequenceChance(navigate, cardId)
            handler.submit(newSequence)
          }, 500)
        }
      },
      sequenceChance(navigate: string, cardId: number) {
        const product = data?.products?.find((item: any) => item?.sku?.id === cardId)
        const index = productSequence.findIndex((item: any) => item === product?.id)
        let newSequence = [...productSequence]
        if (navigate == 'up' && index > 0) {
          newSequence[index] = newSequence[index - 1]
          newSequence[index - 1] = product?.id
        } else if (navigate == 'down' && index < productSequence?.length - 1) {
          newSequence[index] = newSequence[index + 1]
          newSequence[index + 1] = product?.id
        }
        return newSequence
      },
      submit(newSequence: any) {
        if (JSON.stringify(newSequence) !== JSON.stringify(productSequence)) {
          setProductSequence(newSequence)

          rootApi.liveshow.skuSequence({
            call, urlSuffix: `${data?.id}/`,
            props: {
              data: { 'sequence': newSequence },
              meta: {
                errorCallback({ error, query }) {
                  setProductSequence(productSequence)
                },
              }
            }
          })
        }
      }
    }

    useMemo(() => {
      if (data?.products?.length > 0) {
        setProductSequence(data?.products?.map((item: any) => item?.id))
      }
    }, [data?.products])

    return (
      <View style={$.only(['pv-10', `h-${isIos ? 320 : 310}`])}>
        <ConditionalComponent condition={data?.products.length > 0} >
          <ScrollView
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={$.only(['column'])}
          >
            {
              productSequence?.map((productId: string, index: number) => {
                const product = data?.products?.find((item: any) => item?.id === productId)
                return (
                  <View key={product?.id} style={$.only(['relative'])}>
                    <ProductCard
                      data={product?.sku}
                      extraData={{ showId }}
                      style={$.only(['mb-5'])}
                      isLiveShowCard={true}
                      onSequenceChange={handler.handleSequence}
                    />
                    <View style={$['productIndexCont']}>
                      <Text style={$['productIndex']}>{index + 1}</Text>
                    </View>
                  </View>
                )
              })
            }
          </ScrollView>
          <View style={$['EmptyScreen']}>
            <View style={$.only(['centerItem'])}>
              <SvgIcon icon="emptyProduct" size={200} />
            </View>
            <ConditionalComponent
              condition={isSeller}
            >
              <Button
                style={$['button']}
                text="Add Product"
                textStyle={$.only(['btn', 'fc-n100'])}
                pressedStyle={$.only(['bw-1', 'bc-p600'])}
                pressedTextStyle={$.only(['fc-p600'])}
                onPress={() => navigation.navigate('AddProducts', { showId, selectedSKUs: [] })}
              />
            </ConditionalComponent>
          </View>
        </ConditionalComponent>
      </View>
    )
  }
}


interface LiveShowDetailScreenProps extends AppTabNavigatorScreenProps<"LiveShowDetail"> { }
export const LiveShowDetailScreen: FC<LiveShowDetailScreenProps> = observer(function LiveShowDetailScreen() {
  const [$] = useStyle($InititalStyle)
  const navigation = useNavigation<any>()
  const { showId }: any = validateParams(useRoute())
  const { data: response, isLoading, call, rootApi } = useApi({})
  const data = response?.data
  const shareViewRef = useRef<any>()
  const {
    authStore: { isSeller },
  } = useStores()

  useMemo(() => {
    if (showId) {
      rootApi.liveshow.get({
        call, urlSuffix: `${showId}/`,
        props:{
          meta:{
            errorCallback:()=> navigation.goBack()
          }
        }
      })
    }
  }, [showId])

  return (
    <Screen style={$['screen']} preset="scroll">
      <View style={$.only(['relative', `h-${SCREEN_HEIGHT()}`])}>
        <ConditionalComponent condition={isLoading || !data}>
          <View style={[$['activityIndicator']]}>
            <ActivityIndicator size="large" />
          </View>
          <>
            <ConditionalComponent
              condition={isSeller}
            >
              <Pressable style={$['saveOrderButton']}
                onPress={() => navigation.navigate('SavedOrders', { skuIds: data?.sku_list })}>
                <SvgIcon icon="orderChecklist" size={35} />
              </Pressable>
            </ConditionalComponent>
            <AddIcon
              navigate="CreateLiveShow"
              params={{ showId }}
              style={$.only(['right-16',])}
            />

            <components.BannerContainer
              style={$}
              data={data}
              shareViewRef={shareViewRef}
              navigation={navigation}
            />
            <View style={$.only(['p-12', 'ph-16'])}>
              <components.ContentContainer style={$} data={data} />
              <components.ProductContainer
                style={$}
                data={data}
                showId={showId}
                navigation={navigation}
                isSeller={isSeller}
              />
            </View>

            {/* Sharable Component  */}
            <SharableComponent ref={shareViewRef}>
              <components.BannerContainer
                style={$}
                data={data}
                navigation={navigation}
              />
              <View style={$.only(['p-12', 'ph-16', 'bg-white'])}>
                <components.ContentContainer style={$} data={data} />
              </View>
            </SharableComponent>
          </>
        </ConditionalComponent>
      </View>
    </Screen>
  )
})


const $InititalStyle = {
  'screen': ['f-1', 'ph-0'],
  'bannerCont': ['h-240', 'of-auto', 'itemCenter', 'relative',],
  'editIcons': ['absolute', 'right-16', 'top-20', 'column', 'g-10'],
  'text': ['fc-n700', 'body1', 'ph-8'],
  'productIndexCont': ['absolute', 'centerItem', 'bg-p300', 'br-40', 'w-20', 'h-20'],
  'productIndex': ['body2', 'fc-n50', 'ffSemiBold'],
  'liveButton': ['pb-2.5', 'pt-0', 'ph-7', 'br-15', 'bg-red'],
  'activityIndicator': ['h-100%', 'as-center', 'jc-center'],
  'EmptyScreen': ['column'],
  'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'w-100%',],
  'saveOrderButton': ['absolute', 'bottom-60', 'right-16', 'z-1'],
}

