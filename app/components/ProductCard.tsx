import * as React from "react"
import { ActivityIndicator, Pressable, StyleProp, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors } from "app/theme"
import { Text } from "app/components/Text"
import useStyle from "app/hooks/useStyle"
import { SvgIcon } from "./SvgIcon"
import { useNavigation } from "@react-navigation/native"
import Checkbox from "expo-checkbox"
import { AutoImage } from "./AutoImage"
import { HOST_URL } from "app/config/config.base"
import { isIos } from "app/theme/constants"
import { useApi } from "app/hooks/useApi"
import { fileManagement, formatResult } from "app/utils/FileMangement"
import { formatDate } from "app/utils/formatDateTime"
import { ConditionalComponent } from "./Show"
import { SharableComponent } from "./SharableComponent"
import { useStores } from "app/models"


export interface ProductCardProps {
  style?: StyleProp<ViewStyle>
  data?: any
  extraData?: any
  linksDisplay?: boolean
  checked?: boolean
  onCheck?: any
  isOrderCard?: boolean
  isCheckboxCard?: boolean
  isLiveShowCard?: boolean
  onSequenceChange?: (navigate: string, cardId: number) => void
}

export const ProductCard = observer(function ProductCard(props: ProductCardProps) {
  const {
    style,
    data,
    extraData,
    linksDisplay = true,
    onCheck,
    checked = false,
    isCheckboxCard = false,
    isOrderCard = false,
    isLiveShowCard = false,
    onSequenceChange,
  } = props

  const { authStore: { getUser, isSeller } } = useStores()
  const navigation = useNavigation<any>()
  const [$] = useStyle({
    ...$InitialStyle,
    'container': [
      'row', 'relative', 'el-4', 'bg-n50', `h-${isLiveShowCard ? 88 : 82}`, 'w-98.5%', 'm-2.5', 'br-5', 'bw-0.7',
      `bc-${checked ? "p500" : isOrderCard && (data?.user_full_name === "N/A" || data?.shipping_address === "N/A") ? "pink" : "white"}`,
      ...(isIos ? ['sc-n700', 'shOffSetW0H2', 'so-0.3', 'sr-4'] : ['of-hidden'])
    ],
    'imgCont': ['centerItem', 'w-30%', `minW-${isLiveShowCard ? 85:80}`, 'h-100%', 'of-hidden', 'p-0', 'btlr-5', 'bblr-5'],
    'textCont': ['p-5', 'pl-10', 'w-70%'],
    'iconCont': ['columnAlign', `w-${isOrderCard ? "30" : "10"}%`, 'pv-7', 'g-7', `d-${linksDisplay ? "block" : "none"}`]
  })
  const { isLoading, call, rootApi } = useApi({})

  const shareViewRef = React.useRef<any>();
  const [image, setImage] = React.useState<string | null>(null);
  const [sequenceIcon, setSequenceIcon] = React.useState({
    "up": "blur" as "focus" | "blur",
    "down": "blur" as "focus" | "blur"
  })

  const cardData = {
    id: isOrderCard ? data?.id : data?.product_id,
    row1: isOrderCard ? data?.product_name : (data?.sku_title ?? data?.product_title),
    row2: isOrderCard ? `Code ${data?.sku_code}` : `Price $ ${data?.unit_price}`,
    row3: isOrderCard ? data?.user_full_name : data?.product_description,
    image: undefined as string | undefined,
    status: data?.status,
    amount: data?.cost,
    date: data?.date_and_time?.split(' ')[0]
  }

  if (data?.product_images) {
    cardData.image = data?.product_images?.length > 0 ?
      HOST_URL + data?.product_images.at(-1) : undefined
  } else if (data?.product_image) {
    cardData.image = HOST_URL + data?.product_image
  }

  const handler = {
    pickImage: async () => {
      let result = await fileManagement.filePicker()
      if (result) {
        setImage(result.assets[0].uri);

        rootApi.catalogue.uploadImg({
          call,
          props: {
            data: {
              product: cardData?.id,
              file: formatResult(result)
            },
            meta: {
              errorCallback: () => setImage(null)
            }
          }
        })
      }
    },
    handleDelete() {
      if (isLiveShowCard) {
        rootApi.liveshow.skuDelete({
          call,
          urlSuffix: `?live_show=${extraData?.showId}&sku=${data?.id}`,
          props: {
            invalidateQueryUrl: extraData?.showId ?
              `liveshows/${extraData?.showId}/` : ""
          }
        })
      } else {
        rootApi.catalogue.skuDelete({
          call, urlSuffix: `${data?.id}/`
        })
      }
    },
    handleNavigation() {
      if (isOrderCard) {
        if (data?.user_full_name === "N/A" || data?.shipping_address === "N/A") {
          isSeller && navigation.navigate('CreateOrder', { orderId: cardData?.id })
        } else {
          navigation.navigate('Invoice', { orderId: cardData?.id })
        }
      } else {
        navigation.navigate('ProductDetail', { productId: cardData?.id })
      }
    },
    IconContainer() {
      if (isCheckboxCard) {
        return <Checkbox
          style={$['checkBox']}
          value={checked}
          onValueChange={onCheck}
          color={checked ? colors.palette.primary500 : undefined}
        />
      } else if (isOrderCard) {
        return (
          <View style={$.only(['ta-right'])} >
            <Text style={$.only(['body2', `fc-${cardData.status.toLowerCase()}`, 'ta-right'])}>{cardData.status}</Text>
            <Text style={$.only(['h6', 'fc-n900', 'pt-4', 'ta-right'])}>$ {cardData.amount}</Text>
            <Text style={$.only(['h6', 'fc-n700', 'pv-4', 'ta-right'])}>{formatDate(cardData.date)}</Text>
          </View>
        )
      } else if (cardData?.id) {
        return (
          <>
            <SvgIcon icon="share" size={20} onPress={shareViewRef.current?.share} />
            <ConditionalComponent condition={isSeller}>
              <SvgIcon icon="delete" size={20} onPress={handler.handleDelete} />
            </ConditionalComponent>
          </>
        )
      } else {
        return <></>
      }
    }
  }

  return (
    <View style={[$['container'], { shadowOffset: { width: 0, height: 2 } }, style]}>
      <View style={$.only([`w-${isOrderCard ? 70 : 90}%`, 'row'])}>
        {/* IMAGE CONTAINER  */}
        <TouchableOpacity
          onPress={handler.pickImage}
          disabled={!isSeller || isCheckboxCard || isOrderCard || isLiveShowCard || !cardData?.id}
        >
          <ConditionalComponent condition={!!cardData?.image || !!image}>
            <View style={$['imgCont']}>
              <AutoImage source={{ uri: image ? image : cardData?.image }} style={$.only(['wh100%'])} />
            </View>

            <View style={[$['imgCont'],$.only(['bg-p100']) ]}>
              <ConditionalComponent condition={isLoading}>
                <ActivityIndicator size="large" color={colors.palette.primary400} />
                <ConditionalComponent condition={!isSeller || isCheckboxCard || isOrderCard || isLiveShowCard || !cardData?.id}>
                  <AutoImage source={require('../../assets/images/product_description.png')} style={$.only(['wh100%'])} />
                  <View>
                    <SvgIcon icon="uploadImg" size={35} />
                    <Text style={$.only(['body2', 'fc-n1000'])}>Upload</Text>
                  </View>
                </ConditionalComponent>
              </ConditionalComponent>
            </View>
          </ConditionalComponent>
        </TouchableOpacity>

        {/* CONTENT CONTAINER  */}
        <TouchableOpacity
          style={$['textCont']}
          disabled={isCheckboxCard || isLiveShowCard || !cardData?.id}
          onPress={handler.handleNavigation}
        >
          <Text style={$['row1']} ellipsizeMode="tail" numberOfLines={1}>{cardData.row1}</Text>
          <Text style={$['row2']} ellipsizeMode="tail" numberOfLines={1}>{cardData.row2}</Text>
          <Text style={$['row3']} ellipsizeMode="tail" numberOfLines={1}>{cardData.row3}</Text>
        </TouchableOpacity>
      </View>

      {/* ICON CONTAINER  */}
      <View style={[$['iconCont']]}>
        <handler.IconContainer />
      </View>

      {/* SEQUENCE BUTTON  */}
      <ConditionalComponent condition={isLiveShowCard && isSeller}>
        <View style={$['sequenceButtonCont']}>
          <Pressable
            onPress={() => onSequenceChange?.('up', data?.id)}
            onPressIn={() => { setSequenceIcon((prev: any) => ({ ...prev, 'up': 'focus' })) }}
            onPressOut={() => { setSequenceIcon((prev: any) => ({ ...prev, 'up': 'blur' })) }}
          >
            <SvgIcon icon={sequenceIcon?.up === "blur" ? "upArrow" : "upArrowFill"} size={25}
            />
          </Pressable>

          <Pressable
            onPress={() => onSequenceChange?.('down', data?.id)}
            onPressIn={() => { setSequenceIcon((prev: any) => ({ ...prev, 'down': 'focus' })) }}
            onPressOut={() => { setSequenceIcon((prev: any) => ({ ...prev, 'down': 'blur' })) }}
          >
            <SvgIcon icon={sequenceIcon?.down === "blur" ? "downArrow" : "downArrowFill"} size={25}
            />
          </Pressable>
        </View>
      </ConditionalComponent>

      {/* SHARABLE COMPONENT  */}
      <SharableComponent ref={shareViewRef} >
        <View style={$.only(['h-65%'])}>
          <ConditionalComponent condition={!!cardData?.image || !!image}>
            <AutoImage source={{ uri: image ? image : cardData?.image }} style={$.only(['wh100%'])} />
            <AutoImage source={require('../../assets/images/product_description.png')} style={$.only(['wh100%'])} />
          </ConditionalComponent>
        </View>
        <View style={$['share-contentCont']}>
          <Text style={$['share-title']} numberOfLines={2} ellipsizeMode="tail">{cardData.row1}</Text>
          <View style={$.only(['rowItemAlignBetween'])}>
            <View style={$.only(['w-60%'])}>
              <Text style={$['share-price']}>{cardData.row2}</Text>
            </View>
            <View style={$['share-codeCont']}>
              <Text style={$['share-code']}>{data?.sku_code}</Text>
            </View>
          </View>

          <Text style={$['share-description']} numberOfLines={3} ellipsizeMode="tail">{data?.product_description}</Text>
          <View style={$['share-contactCont']}>
            <View style={$['share-contactView']}>
              <SvgIcon icon="whatsapp" size={20} />
              <Text style={$['share-contact']}>{getUser?.mobile}</Text>
            </View>
            <View style={$['share-contactView']}>
              <SvgIcon icon="email" size={20} />
              <Text style={$['share-contact']}>{getUser?.email}</Text>
            </View>
          </View>
        </View>
      </SharableComponent>
    </View>
  )
})


const $InitialStyle = {
  'row1': ['h5', 'fc-n900', 'ffSemiBold'],
  'row2': ['body1', 'fc-p700'],
  'row3': ['h6', 'fc-n1000', 'pv-4', 'ffMedium'],
  'checkBox': ['h-15', 'w-15'],
  'sequenceButtonCont': ['row', 'g-5', 'absolute', 'right-7', 'bottom-3'],

  'share-contentCont': ['h-35%', 'bg-white', 'p-15', 'relative'],
  'share-title': ['h2', 'fc-n800', 'ffSemiBold'],
  'share-price': ['h4', 'fc-n700', 'ffMedium'],
  'share-codeCont': ['pv-5', 'ph-1', 'bg-p600', 'br-5', 'w-126'],
  'share-code': ['h4', 'ta-center', 'ffBold', 'fc-n100', 'ls-3'],
  'share-description': ['mt-5', 'body1', 'fc-n700'],
  'share-contactCont': ['rowItemAlignBetween', 'fWrap-wrap', 'mt-10'],
  'share-contactView': ['rowAlign', 'g-5', 'mt-5'],
  'share-contact': ['body', 'fc-n700'],
}

