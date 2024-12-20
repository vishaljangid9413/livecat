import * as React from "react"
import { Dimensions, FlatList, Image, ScrollView, View } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "app/components/Text"
import useStyle from "app/hooks/useStyle"
import { isIos, SCREEN_HEIGHT } from "app/theme/constants"
import { HOST_URL } from "app/config/config.base"
import BottomSheet, { BottomSheetView, SCREEN_WIDTH } from "@gorhom/bottom-sheet"
import { Button } from "./Button"
import { useNavigation } from "@react-navigation/native"
import { ConditionalComponent } from "./Show"


const components = {
  ListContainer(props: any) {
    const { style: $, data, activeItem, setActiveItem, setActiveImageItem, renderList } = props
    const screenHeight = SCREEN_HEIGHT()

    const viewabilityConfigCallbackPairs = React.useRef(
      [{
        viewabilityConfig: {
          minimumViewTime: 10,
          itemVisiblePercentThreshold: 100
        },
        onViewableItemsChanged: (value: any) => {
          const index = value.changed[0].index
          const isViewable = value.changed[0].isViewable

          if (isViewable) {
            setActiveItem(index)
            setActiveImageItem((prev: any) => {
              if(prev?.[data?.[index]?.id]){
                return prev
              }else{
                return {...prev, [data?.[index]?.id]: 0}
              }
            })
          }
        }
      }]
    );

    const onViewableItemsChangedForImage = (value: any) => {
      const index = value.changed[0].index
      const isViewable = value.changed[0].isViewable
      isViewable && setActiveImageItem((prev: any) => ({
        ...prev, [data?.[activeItem]?.id]: index
      }))
    }

    return (
      <FlatList
        data={data}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        initialNumToRender={data?.length}
        initialScrollIndex={activeItem}
        onScrollToIndexFailed={(value: any) => { }}
        getItemLayout={(_, index) => ({
          length: screenHeight,
          offset: screenHeight * index,
          index,
        })}
        keyExtractor={(item) => item.id}
        snapToAlignment="start"
        decelerationRate="normal"
        disableIntervalMomentum={true}
        pagingEnabled={true}
        snapToInterval={screenHeight}
        renderItem={({ item, index }) => (
          <ConditionalComponent condition={!!renderList}>
            {renderList?.(item)}

            <View key={item?.id} style={[$['imageCont'], { height: screenHeight }]}>
              <ConditionalComponent condition={item?.product_images?.length < 1}>
                <Image source={require('../../assets/images/product_description.png')} style={$.only(['wh100%'])} />

                <FlatList
                  data={[...item.product_images].reverse()}
                  onViewableItemsChanged={onViewableItemsChangedForImage}
                  initialNumToRender={item?.product_images?.length}
                  initialScrollIndex={0}
                  onScrollToIndexFailed={(value: any) => { }}
                  getItemLayout={(_, index) => {
                    return {
                      length: SCREEN_WIDTH,
                      offset: SCREEN_WIDTH * index,
                      index,
                    }
                  }}
                  snapToAlignment="start"
                  decelerationRate="fast"
                  disableIntervalMomentum={true}
                  horizontal
                  keyExtractor={(item) => item}
                  snapToInterval={SCREEN_WIDTH}
                  renderItem={({ item: imageUrl }) => (
                    <View key={imageUrl} style={[$['imageCont'], { height: screenHeight }]}>
                      <Image source={{ uri: `${HOST_URL}${imageUrl}` }} style={$.only(['wh100%'])} />
                    </View>
                  )}
                />
              </ConditionalComponent>
            </View>
          </ConditionalComponent>
        )}
      />
    )
  },
  BottomDrawerContainer(props: any) {
    const { style: $, data, activeItem, activeImageItem, renderDrawerContent } = props

    const navigation = useNavigation<any>()
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const productData = data?.[activeItem] 

    function slideIndicator() {
      return (
        <View style={$.only(['p-10', 'columnItemAlignCenter', 'g-5'])}>
          <View style={$.only(['rowAlign', 'g-3'])}>
            <ConditionalComponent condition={
              (
                !!Object.keys(activeImageItem)?.find(
                  (item: any) => item === productData?.id?.toString())
              ) &&
              (productData?.product_images?.length > 1)
            }>
              <>
                {productData?.product_images?.map((item: string, index: any) => (
                  <View
                    key={`${item}_${index}`}
                    style={
                      $.only([ 'br-50',
                        ...activeImageItem?.[productData?.id] === index ?
                        ['bg-red', 'h-7', 'w-7']:
                        ['bg-black', 'h-5', 'w-5']
                      ])
                    }
                  ></View>
                ))}
              </>
            </ConditionalComponent>
          </View>
          <View style={$.only(['bg-p400', 'h-5', 'w-30', 'br-10'])}></View>
        </View>
      )
    }

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["5%", `${isIos ? 18 : 16.5}%`, "60%",]}
        enableContentPanningGesture={false}
        animateOnMount={true}
        index={1}
        onClose={() => bottomSheetRef.current?.expand()}
        handleIndicatorStyle={$.only(['bg-p300'])}
        containerStyle={$.only(['z-2'])}
        handleComponent={slideIndicator}
      >
        <BottomSheetView style={$.only(['p-16', 'pt-3', 'h-100%'])}>
          {
            renderDrawerContent ?
              renderDrawerContent(productData) :
              <>
                <View style={$.only(['rowItemBetween',])}>
                  <ConditionalComponent condition={productData}>
                    <>
                      <View style={$.only(['w-60%'])}>
                        <Text style={$['productName']}>{productData?.sku_title}</Text>
                        <Text style={$['productPrice']}>Price Rs. {productData?.unit_price}/-</Text>
                      </View>
                      <View style={$['productCodeCont']}>
                        <Text style={$['productCode']}>Product Code {productData?.sku_code}</Text>
                      </View>
                    </>
                    <>
                      <Image source={require('../../assets/skeleton/product_content.gif')} style={$.only(['w-57%', 'h-70'])} />
                      <Image source={require('../../assets/skeleton/product_code.gif')} style={$.only(['w-38%', 'h-65'])} />
                    </>
                  </ConditionalComponent>
                </View>
                <View style={$.only(['h-78%', 'mt-10'])}>
                  <ScrollView showsVerticalScrollIndicator={false} >
                    <Text style={$.only(['h4', 'fc-n900', 'ffMedium', 'pb-5'])}>Description </Text>
                    <Text style={$.only(['body1', 'fc-n700'])}>{productData?.product_description}</Text>
                    <Button
                      style={$['submitButton']}
                      text="Create Order"
                      textStyle={$.only(['btn', 'fc-n100'])}
                      onPress={() => navigation.navigate('CreateOrder', { skuId: productData?.id })}
                    />
                  </ScrollView>
                </View>
              </>
          }
        </BottomSheetView>
      </BottomSheet>
    )
  }
}


export interface ProductDetailProps {
  style?: any
  data: any
  currentItem?: number
  renderList?: (data: any) => JSX.Element
  renderDrawerContent?: (data: any) => JSX.Element
}
export const ProductDetail = observer(function ProductDetail(props: ProductDetailProps) {
  const { style, data, currentItem, renderList, renderDrawerContent } = props
  const [styles] = useStyle($InitialStyle)
  const [activeItem, setActiveItem] = React.useState(0)
  const [activeImageItem, setActiveImageItem] = React.useState({})
  const $ = { ...styles, ...style }

  React.useEffect(() => {
    if (data && currentItem) {
      const currentItemIndex = data?.findIndex((item: any) => item?.product_id === currentItem)
      setActiveItem(currentItemIndex)
      setActiveImageItem({ [data?.[currentItemIndex]?.id]: 0 })
    }
  }, [data])

  return (
    <View >
      <components.ListContainer
        style={$}
        data={data}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        setActiveImageItem={setActiveImageItem}
        renderList={renderList}
      />
      <components.BottomDrawerContainer
        style={$}
        data={data}
        activeItem={activeItem}
        activeImageItem={activeImageItem}
        setActiveImageItem={setActiveImageItem}
        renderDrawerContent={renderDrawerContent}
      />
    </View>
  )
})


const $InitialStyle = {
  'imageCont': [`w-${Dimensions.get("window").width}`, 'centerItem', 'bw-1', 'bbc-white', 'bg-n300'],
  'productName': ['h2', 'fc-n800', 'ffSemiBold'],
  'productPrice': ['h4', 'fc-n800', 'ffMedium'],
  'productCodeCont': ['pv-5', 'ph-10', 'bg-p600', 'br-5', 'w-126', 'h-65'],
  'productCode': ['h4', 'ta-center', 'ffBold'],
  'EmptyScreen': ['ph-40'],
  'submitButton': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-10', 'w-100%',]
}
