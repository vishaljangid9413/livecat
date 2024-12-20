import React, { FC, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { Button, ConditionalComponent, Screen, SvgIcon, TextField } from "app/components"
import { ErrorToast, formValidation } from "app/utils/formValidation"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import { useNavigation, useRoute } from "@react-navigation/native"
import { isIos, SCREEN_HEIGHT } from "app/theme/constants"
import { validateParams } from "app/utils/generics"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { Dropdown } from "app/components/Dropdown"
import { useApi } from "app/hooks/useApi"
import { colors } from "app/theme"
import * as Yup from 'yup'
import useStyle from "app/hooks/useStyle"


interface SavedOrdersScreenProps extends AppTabNavigatorScreenProps<"SavedOrders"> { }
export const SavedOrdersScreen: FC<SavedOrdersScreenProps> = observer(function SavedOrdersScreen() {
  const { orderStore: { getSavedOrders, addOrder, removeOrder, clearOrders } } = useStores()
  const navigation = useNavigation<any>()

  const [$] = useStyle($InitialStyle)
  const { data:response, isLoading, call, rootApi } = useApi({})
  let data = response?.results
  const { isLoading: submitLoading, call: submitCall } = useApi({})
  const { skuIds } = validateParams(useRoute<any>())
  
  const [inputData, setInputData] = useState<any>({
    "User": "",
    "SKU": "",
    "Quantity": "1",
  })
  const [selectedProduct, setSelectedProduct] = useState<any>(undefined)

  const [errors, setErrors] = useState<any>({
    "User": false,
    "SKU": false,
    "Quantity": false,
  })

  const handler = {
    handleSearch(value:any){
      let filterData = data
      if(value){
        filterData = data?.filter((item:any)=> {
          return item?.sku_code?.toLowerCase()?.includes(value?.toLowerCase()) ||
          item?.sku_title?.toLowerCase()?.includes(value?.toLowerCase()) 
        })
      }
      return filterData?.map((item:any)=>`${item?.sku_title} [${item?.sku_code}]`)
    },
    handleChange(input: string, value: any) {
      if (input === 'SKU'){
        const inputProduct = data?.find((item:any)=> 
          `${item?.sku_title} [${item?.sku_code}]` === value
        )
        setSelectedProduct(inputProduct)
        setInputData((prev:any)=> ({...prev, [input]:inputProduct?.sku_code}))
      }else{
        setInputData((prev: any) => ({ ...prev, [input]: value }))
      }
      setErrors((prev: any) => ({ ...prev, [input]: false }))
    },
    handleAddOrder() {
      formValidation({
        inputData,
        setErrors,
        validationSchema: handler.validationSchema,
        callback: () => {
          addOrder(inputData)
          setInputData({
            "User": "",
            "Quantity": "",
          })
        }
      })
    },
    validationSchema: Yup.object({
      "User": Yup.string().required("Please, enter User handle!"),
      "SKU": Yup.string().required("Please, enter a SKU code!"),
      "Quantity": Yup.string().required("Please, enter Quantity!").test(
        'is-valid-integer',
        'Quantity must be in range between 1 and 10,000',
        (value) => {
          if (!value) return false;
          const numberValue = Number(value);
          return (
            Number.isInteger(numberValue) &&
            numberValue > 0 &&
            numberValue < 1000000
          )
        })
    }),
    handleSubmit() {
      if (getSavedOrders.length === 0) {
        ErrorToast("No saved orders!")
      }

      rootApi.order.bulkUpload({
        call: submitCall,
        props: {
          data: { 'data': getSavedOrders },
          invalidateQueryUrl: undefined,
          contentType: 'json',
          meta: {
            showSuccessMessage: true,
            successMessage: 'Orders submitted successfully!',
            successCallback: handler.successCallback,
          }
        }
      })
    },
    successCallback({ data, query }: any) {
      const response = data?.data
      const faultyOrders = response?.faulty_orders
      if (faultyOrders.length > 0) {
        clearOrders(getSavedOrders.filter((item: any) => faultyOrders.includes(item?.SKU)))
        ErrorToast(`${faultyOrders.length} faulty orders found!`)
      } else {
        clearOrders()
      }
    }
  }

  data = useMemo(()=>{
    if(data?.length > 0){
      if (skuIds){
        return data?.filter((item:any)=> skuIds?.includes(item?.id))
      }
      return data
    }
  },[data])

  useEffect(() => {
    rootApi.catalogue.skus({
      call,
      props: {
        meta: {
          errorCallback: () => navigation.goBack()
        }
      }
    })
  }, [])

  return (
    <Screen style={$.only(['f-1', `h-${SCREEN_HEIGHT()}`])} preset="fixed">
      <View style={$.only(['h-65%'])}>
        <ConditionalComponent condition={getSavedOrders.length === 0}>
          <SvgIcon icon="emptyOrder" />
          <ScrollView showsVerticalScrollIndicator={false}>
            {
              getSavedOrders.map((item: any) => (
                <View key={item?.id} style={$['card']}>
                  <Text style={$['cardHeading']} numberOfLines={2} ellipsizeMode="tail">
                    User: {item?.User}
                  </Text>
                  <View style={$.only(['rowItemAlignBetween', 'pt-5'])}>
                    <Text style={$['cardText']}>Code: {item?.SKU}</Text>
                    <Text style={$['cardText']}>Quantity: {item?.Quantity}</Text>
                  </View>
                  <TouchableOpacity style={$['cardDeleteIcon']} onPress={() => removeOrder(item?.id)} >
                    <SvgIcon icon="delete" size={20} />
                  </TouchableOpacity>
                </View>
              ))
            }
          </ScrollView>
        </ConditionalComponent>
      </View>

      <View style={$.only(['h-35%', 'pt-10'])}>
        <View style={$.only(['w-100%'])}>
          <TextField
            style={$['textField']}
            placeholder="Enter User"
            inputWrapperStyle={[$['inputWrapper'], errors?.SKU && $.only(['bc-red'])]}
            onChangeText={(text: string) => handler.handleChange('User', text)}
            value={inputData?.User}
          />
        </View>
        <View style={$.only(['w-100%', 'mt-12'])}>
          <ConditionalComponent condition={isLoading}>
            <View style={$.only(['bc-n400', 'bw-1', 'br-3', 'h-40'])}>
              <ActivityIndicator size={'large'}  />
            </View>
            <Dropdown
              multiSelect={false}
              required={true}
              labelPosition="top"
              placeholder={"Select Product"}
              options={data?.map((item: any) => `${item?.sku_title} [${item?.sku_code}]`)}
              selectedValues={[`${selectedProduct?.sku_title} [${selectedProduct?.sku_code}]`]}
              onChange={(value) => handler.handleChange('SKU', value)}
              isSearchable={true}
              setSearch={handler.handleSearch}
              style={[$.only(['fc-n700', 'h5']), isIos && $.only(['pt-8', 'mv-0'])]}
              containerStyle={$.only(['mt-2'])}
              inputWrapperStyle={$.only(['bc-n400', 'br-3', 'bw-1'])}
              placeholderTextColor={colors.palette.neutral700}
            />
        </ConditionalComponent>
      </View>
      <View style={$['inputRow']}>
        <View style={$.only(['w-48%'])}>
          <TextField
            style={$['textField']}
            placeholder="Enter Quantity"
            inputWrapperStyle={[$['inputWrapper'], errors?.Quantity && $.only(['bc-red'])]}
            keyboardType="numeric"
            maxLength={6}
            onChangeText={(text: string) => handler.handleChange('Quantity', text)}
            value={inputData?.Quantity}
          />
        </View>
        <View style={$.only(['w-48%'])}>
          <Button
            style={$['addButton']}
            text="Add"
            textStyle={$.only(['btn', 'fc-n100'])}
            pressedStyle={$['pressedButtonStyle']}
            pressedTextStyle={$['pressedButtonText']}
            onPress={handler.handleAddOrder}
          />
        </View>
      </View>

      <Button
        style={$['submitButton']}
        text="Submit Orders"
        textStyle={$.only(['btn', 'fc-n100'])}
        pressedStyle={$['pressedButtonStyle']}
        pressedTextStyle={$['pressedButtonText']}
        onPress={handler.handleSubmit}
        pending={submitLoading}
      />
    </View>
    </Screen >
  )
})

const $InitialStyle = {
  'card': [
    'relative', 'el-4', 'bg-n50', 'w-98.5%', 'm-2.5', 'mt-10', 'p-10', 'br-5', 'bw-0.7', 'bc-white',
    ...(isIos ? ['of-hidden'] : ['sc-n700', 'shOffSetW0H2', 'so-0.3', 'sr-4'])
  ],
  'cardHeading': ['fc-p700', 'h3', 'w-90%'],
  'cardText': ['fc-n600', 'h5'],
  'cardDeleteIcon': ['absolute', 'right-10', 'top-10'],
  'inputRow': ['rowItemAlignBetween'],
  'textField': [`h-${isIos ? 35 : 40}`, 'w-100', `pv-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
  'textFieldWrapper': ['h-42'],
  'inputWrapper': ['bc-n400', 'br-3', 'bw-1', 'h-41'],
  'pressedButtonText': ['fc-p600', 'btn'],
  'pressedButtonStyle': ['bg-white', 'bc-p600', 'bw-1'],
  'addButton': ['bw-0', 'bg-p400', 'br-3', 'h-41', 'mv-10', 'w-100%'],
  'submitButton': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mb-10', 'w-100%']
}
