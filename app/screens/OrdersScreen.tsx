import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Image, Pressable, View } from "react-native"
import { AddIcon, Button, ConditionalComponent, ProductCard, Screen, SvgIcon, Text, TextField } from "app/components"
import useStyle from "app/hooks/useStyle"
import { isIos, SCREEN_HEIGHT } from "app/theme/constants"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { Dropdown } from "app/components/Dropdown"
import { colors } from "app/theme"
import { useApi } from "app/hooks/useApi"
import { ActivityIndicator } from "react-native-paper"
import { useStores } from "app/models"
import { fileManagement, formatResult } from "app/utils/FileMangement"
import { ErrorToast, SuccessToast } from "app/utils/formValidation"
import { rootApi } from "app/services/api/registery/rootApi"
import { useNavigation } from "@react-navigation/native"
import DownloadFile from "app/components/DownloadFile"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"


const components = {
  IconsContainer: observer((props: any) => {
    const { style: $, isSeller, handleDrawer, isFilterConsistValue } = props
    const navigation = useNavigation<any>()

    return (
      <ConditionalComponent condition={isSeller}>
        <>
          <Pressable
            style={$['saveOrderButton']}
            onPress={() => navigation.navigate('SavedOrders')}
          >
            <SvgIcon icon="orderChecklist" size={35} />
          </Pressable>
          <Pressable
            style={$['filterButton']}
            onPress={() => handleDrawer('filter')}
          >
            <SvgIcon icon={isFilterConsistValue ? "filterApplied" : "filter"} size={35} />
          </Pressable>
          <Pressable
            style={$['uploadButton']}
            onPress={() => handleDrawer('upload')}
          >
            <SvgIcon icon="uploadFile" size={35} />
          </Pressable>
          <AddIcon navigate="CreateOrder" style={$.only(['right-16'])} />
        </>

        <Pressable
          style={[$['filterButton'], $.only(['bottom-15'])]}
          onPress={() => handleDrawer('filter')}
        >
          <SvgIcon icon="filter" size={35} />
        </Pressable>
      </ConditionalComponent>
    )
  }),
  OrderContainer(props: any) {
    const { style: $, data } = props

    return (
      <View style={$.only(['ph-16', `h-${SCREEN_HEIGHT()}`])}>
        <FlatList
          onRefresh={() => { }}
          refreshing={false}
          showsVerticalScrollIndicator={false}
          data={data}
          contentContainerStyle={$.only(['g-5', 'pv-15'])}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ index, item }: any) => (
            <ProductCard
              data={item}
              isOrderCard={true}
            />
          )}
        />
      </View>
    )
  },
  BottomDrawerContainer: observer((props: any) => {
    const {
      style: $,
      data,
      isSeller,
      bottomSheetRef,
      drawerContainer,
      setFilterData,
      isFilterConsistValue,
      setIsFilterConsistValue
    } = props

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["100%", "60%"]}
        enablePanDownToClose={true}
        animateOnMount={true}
        index={-1}
        handleIndicatorStyle={$.only(['bg-p300'])}
        containerStyle={$.only(['z-2'])}
        backgroundStyle={$.only(['bg-n100'])}
      >
        <BottomSheetView style={$.only(['h-100%'])}>
          <ConditionalComponent condition={drawerContainer === 'upload'} >
            <components.UploadContainer
              style={$}
              bottomSheetRef={bottomSheetRef}
            />
            <components.FilterContainer
              style={$}
              data={data}
              isSeller={isSeller}
              bottomSheetRef={bottomSheetRef}
              setFilterData={setFilterData}
              isFilterConsistValue={isFilterConsistValue}
              setIsFilterConsistValue={setIsFilterConsistValue}
            />
          </ConditionalComponent>
        </BottomSheetView>
      </BottomSheet>
    )
  }),
  UploadContainer(props: any) {
    const { style: $, bottomSheetRef } = props
    const { isLoading, call, rootApi } = useApi({})
    const [file, setFile] = useState<any>(null)
    const [isFileDownloading, setIsFileDownloading] = useState<boolean>(false)

    const pickDocument = async () => {
      const response = await fileManagement.filePicker('document')
      if (response) {
        setFile(response)
      }
    };

    function handleSubmit() {
      rootApi.order.bulkUpload({
        call,
        props: {
          data: { 'file': formatResult(file) },
          meta: { successCallback }
        }
      })
    }

    function successCallback(props: any) {
      const { data, faulty_orders } = props?.data?.data

      if (faulty_orders.length > 0) {
        let message;
        if (data.length > 0) {
          message = `${data.length} orders created successfully and ${faulty_orders.length} faulty orders found!`
        } else {
          message = `0 orders created successfully!`
        }
        ErrorToast(message)
      } else {
        SuccessToast(`${data.length} orders created successfully!`)
      }
      bottomSheetRef.current.close()
      setFile(null)
    }

    return (
      <View style={$.only(['p-15'])}>
        <View style={$['bannerCont']}>
          <Image source={require('../../assets/images/product_upload_vector.png')} style={$.only(['wh100%'])} />
        </View>
        <View>
          <View style={$.only(['rowItemAlignBetween'])}>
            <Text style={$['label']}>Upload Order File</Text>
            <DownloadFile
              onDownloadStart={() => setIsFileDownloading(true)}
              onDownloadStop={() => setIsFileDownloading(false)}
              onPress={(submitFunc: any) => submitFunc('order_sample')}
            >
              <View style={$.only(['centerItem', 'bg-p500', 'w-80', 'h-35', 'br-5'])}>
                <ConditionalComponent condition={isFileDownloading}>
                  <ActivityIndicator size={'small'} color="white" />
                  <>
                    <SvgIcon icon="download" size={20} />
                    <Text style={$.only(['h6', 'ffMedium'])}>Sample</Text>
                  </>
                </ConditionalComponent>
              </View>
            </DownloadFile>
          </View>
          <Pressable
            style={$['imageInput']}
            onPress={pickDocument}
          >
            <ConditionalComponent condition={!file}>
              <View style={$.only(['columnAlign',])}>
                <SvgIcon icon="upload" size={30} />
                <Text style={$.only(['body1', 'fc-n700'])}>Upload Orders CSV/Excel File </Text>
              </View>
              <View style={$.only(['h-100', 'w-75%'])}>
                <Text style={$.only(['fc-n700', 'ffMedium', 'ta-center'])}>{file?.assets[0]?.name}</Text>
                <Text style={$['changeButton']}>Change</Text>
              </View>
            </ConditionalComponent>
          </Pressable>
        </View>
        <Button
          style={$['applyFilterButton']}
          text="Submit"
          textStyle={$.only(['btn', 'fc-n100'])}
          pressedStyle={$.only(['bg-white', 'bc-p600', 'bw-1'])}
          pressedTextStyle={$.only(['fc-p600', 'btn'])}
          onPress={handleSubmit}
          pending={isLoading}
        />
      </View>
    )
  },
  FilterContainer: observer((props: any) => {
    const {
      style: $,
      data,
      isSeller,
      bottomSheetRef,
      setFilterData,
      isFilterConsistValue,
      setIsFilterConsistValue
    } = props

    const { data: response, isLoading, call } = useApi({})
    const products = response?.results
    __DEV__ && console.print("ISE SELLL", isSeller)

    const [inputData, setInputData] = useState<any>({
      "product": null,
      "status": null,
      "type": null,
      "code": null,
      "customer": null,
      "address": null,
    })

    const handler = {
      handleChange(input: string, value: string) {
        setIsFilterConsistValue(true)
        setInputData((prev: any) => ({
          ...prev,
          [input]: !!value ? value : null
        }))
      },

      handleSubmit() {
        if (isFilterConsistValue) {
          setFilterData(() => data?.filter((item: any) => {
            const matchesProduct = inputData.product
              ? item?.product_name?.toLowerCase().includes(inputData.product.toLowerCase().trim())
              : true

            const matchesCustomer = inputData.customer
              ? item?.user_full_name?.toLowerCase().includes(inputData.customer.toLowerCase().trim())
              : true

            const matchesCode = inputData.code
              ? item?.sku_code?.toLowerCase().includes(inputData.code.toLowerCase().trim())
              : true

            const matchesAddress = inputData.address
              ? item?.shipping_address?.toLowerCase().includes(inputData.address.toLowerCase().trim())
              : true

            const matchesStatus = inputData.status
              ? item?.status?.toLowerCase().includes(inputData.status.toLowerCase().trim())
              : true

            const matchesType = inputData.type
              ? inputData?.type === 'Verified'
                ? item?.user_full_name !== "N/A" && item?.shipping_address !== "N/A"
                : item?.user_full_name === "N/A" || item?.shipping_address === "N/A"
              : true

            return (
              matchesProduct &&
              matchesCustomer &&
              matchesCode &&
              matchesAddress &&
              matchesStatus &&
              matchesType
            )
          })
          )
        }
        bottomSheetRef.current.close()
      },

      handleClearFilter() {
        setIsFilterConsistValue(false)
        setInputData({
          "product": null,
          "code": null,
          "customer": null,
          "address": null,
          "status": null
        })
        setFilterData(data)
        bottomSheetRef.current.close()
      }
    }

    useEffect(() => {
      rootApi.catalogue.skus({ call })
    }, [])

    return (
      <View style={$.only(['p-16', 'pt-0'])}>
        <>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Product Name</Text>
            <Dropdown
              multiSelect={false}
              required={true}
              labelPosition="top"
              placeholder={inputData?.product ?? "Select Product Name"}
              options={products?.map((item: any) => item?.sku_title)}
              selectedValues={[inputData?.product]}
              onChange={(value) => handler.handleChange('product', value)}
              style={[$.only(['fc-n700']), isIos && $.only(['pt-8', 'mv-0'])]}
              containerStyle={$.only(['mt-2'])}
              inputWrapperStyle={$.only(['bc-n400', 'br-3', 'bw-1'])}
              placeholderTextColor={colors.palette.neutral700}
              editable={!isLoading}
            />
          </View>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Order Status</Text>
            <Dropdown
              multiSelect={false}
              required={true}
              labelPosition="top"
              placeholder={inputData?.status ?? "Select Order Status"}
              options={['Processing', 'Booked', 'Completed']}
              selectedValues={[inputData?.status]}
              onChange={(value) => handler.handleChange('status', value)}
              style={[$.only(['fc-n700']), isIos && $.only(['pt-8', 'mv-0'])]}
              containerStyle={$.only(['mt-2'])}
              inputWrapperStyle={$.only(['bc-n400', 'br-3', 'bw-1'])}
              placeholderTextColor={colors.palette.neutral700}
            />
          </View>
          <ConditionalComponent condition={isSeller}>
            <View style={$['inputRow']}>
              <Text style={$['label']}>Order Type</Text>
              <Dropdown
                multiSelect={false}
                required={true}
                labelPosition="top"
                placeholder={inputData?.type ?? "Select Order Type"}
                options={['Verified', 'Unverified']}
                selectedValues={[inputData?.status]}
                onChange={(value) => handler.handleChange('type', value)}
                style={[$.only(['fc-n700']), isIos && $.only(['pt-0', 'mv-0'])]}
                containerStyle={$.only(['mt-2'])}
                inputWrapperStyle={$.only(['bc-n400', 'br-3', 'bw-1'])}
                placeholderTextColor={colors.palette.neutral700}
              />
            </View>
          </ConditionalComponent>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Product Code</Text>
            <TextField
              style={$['textField']}
              placeholder="Enter Product Code"
              keyboardType="numeric"
              inputWrapperStyle={$['textFieldWrapper']}
              value={inputData?.code}
              onChangeText={(text: any) => handler.handleChange('code', text)}
            />
          </View>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Customer Name/ID</Text>
            <TextField
              style={$['textField']}
              placeholder="Enter Customer Name/ID"
              inputWrapperStyle={$['textFieldWrapper']}
              value={inputData?.customer}
              onChangeText={(text: any) => handler.handleChange('customer', text)}
            />
          </View>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Address</Text>
            <TextField
              style={$['textField']}
              placeholder="Enter address"
              inputWrapperStyle={$['textFieldWrapper']}
              value={inputData?.address}
              onChangeText={(text: any) => handler.handleChange('address', text)}
            />
          </View>
        </>
        <Button
          style={$['applyFilterButton']}
          text="Apply Filter"
          textStyle={$.only(['btn', 'fc-n100'])}
          pressedStyle={$.only(['bg-white', 'bc-p600', 'bw-1'])}
          pressedTextStyle={$.only(['fc-p600', 'btn'])}
          onPress={handler.handleSubmit}
        />
        <Button
          style={$['clearFilterButton']}
          text="Clear Filter"
          textStyle={$.only(['btn', 'fc-n100'])}
          pressedStyle={$.only(['bg-white', 'bc-n600', 'bw-1'])}
          pressedTextStyle={$.only(['fc-black', 'btn'])}
          onPress={handler.handleClearFilter}
        />
      </View>
    )
  })
}


interface OrdersScreenProps extends AppTabNavigatorScreenProps<"Orders"> {}
export const OrdersScreen: FC<OrdersScreenProps> = observer(function OrdersScreen() {
  const { authStore: { getSearchText, isSeller } } = useStores()
  const [$] = useStyle($InitialStyle)
  const { data: response, isLoading, call, rootApi } = useApi({ searchText: getSearchText })
  const data = response?.data

  const bottomSheetRef = useRef<BottomSheet>(null);
  const [drawerContainer, setDrawerContainer] = useState<'filter' | 'upload'>('filter')
  const [filterData, setFilterData] = useState<any>(null)
  const [isFilterConsistValue, setIsFilterConsistValue] = useState(false)

  function handleDrawer(container: 'filter' | 'upload') {
    bottomSheetRef.current?.snapToIndex(0)
    setDrawerContainer(container)
  }

  useEffect(() => {
    setFilterData(data?.results)
  }, [data])

  useEffect(() => {
    rootApi.order.get({ call })
  }, [])

  return (
    <Screen style={$.only(['f-1', 'ph-0'])} preset="fixed" >
      <View style={[$.only(['relative']),{height: "100%"}]}>

        {/* ICONS  */}
       <components.IconsContainer
          style={$}
          isSeller={isSeller}
          handleDrawer={handleDrawer}
          isFilterConsistValue={isFilterConsistValue}
        />

          <ConditionalComponent condition={isLoading || !filterData}>
          <View style={$['activityIndicator']}>
            <ActivityIndicator size="large" />
          </View>
          <ConditionalComponent condition={filterData?.length > 0}>
            <components.OrderContainer
              style={$}
              data={filterData}
              handleDrawer={handleDrawer}
            />
            <View style={$['EmptyScreen']}>
              <SvgIcon icon="emptyOrder" />
            </View>
          </ConditionalComponent>
        </ConditionalComponent>

        <components.BottomDrawerContainer
          style={$}
          data={data?.results}
          isSeller={isSeller}
          bottomSheetRef={bottomSheetRef}
          drawerContainer={drawerContainer}
          setFilterData={setFilterData}
          isFilterConsistValue={isFilterConsistValue}
          setIsFilterConsistValue={setIsFilterConsistValue}
        />
      </View>
    </Screen>
  )
})


const $InitialStyle = {
  'saveOrderButton': ['absolute', 'bottom-150', 'right-16', 'z-1'],
  'filterButton': ['absolute', 'bottom-105', 'right-16', 'z-1'],
  'uploadButton': ['absolute', 'bottom-60', 'right-16', 'z-1'],

  'bannerCont': [`h-${isIos ? 320 : 295}`, 'p-30', 'of-auto', 'itemCenter'],
  'imageInput': ['centerItem', 'bw-1', 'bc-n400', 'br-4', 'p-15', 'h-150', 'mt-5'],
  'uploadedImageCont': ['h-90', 'w-140', 'mb-10', 'bw-1', 'bc-n400', 'br-6'],
  'changeButton': ['body1', 'bg-p700', 'mh-25', 'br-15', 'ph-5', 'mt-7', 'lh-25', 'pb-2', 'ta-center', 'ffBold'],

  'inputRow': ['pt-5'],
  'label': ['h5', 'fc-n900', 'mb-5', 'ffNormal'],
  'textField': [`h-${isIos ? 35 : 40}`, `pv-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700', 'bg-n100'],
  'textFieldWrapper': ['h-42'],
  'applyFilterButton': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-15', 'w-100%',],
  'clearFilterButton': ['bw-0', 'bg-n600', 'br-30', 'h-45', 'w-100%',],
  'EmptyScreen': ['ph-40'],
  'activityIndicator': ['h-100%', 'as-center', 'jc-center'],
}

