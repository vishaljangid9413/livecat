import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, View } from "react-native"
import { Button, ConditionalComponent, ProductCard, Screen, Text, TextField, ZipcodeField } from "app/components"
import { AppTabNavigatorParamList, AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import { useNavigation, useRoute } from "@react-navigation/native"
import useStyle from "app/hooks/useStyle"
import { isIos } from "app/theme/constants"
import { Dropdown } from "app/components/Dropdown"
import { colors } from "app/theme"
import Checkbox from "expo-checkbox"
import { useApi } from "app/hooks/useApi"
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import { ThemedButton } from 'react-native-really-awesome-button';
import { ErrorToast, formValidation } from "app/utils/formValidation"
import * as Yup from 'yup'
import { validateParams } from "app/utils/generics"
import useMemoAfterMount from "app/hooks/useMemoAfterMount"


const components = {
  UserContainer(props: any) {
    const {
      style: $,
      orderData,
      users,
      products,
      isLoading,

      userData,
      setUserData,
      inputData,
      setInputData,
      productData,
      setProductData,
      errors,
      setErrors,
      AMOUNT_INC_TAX
    } = props
    const { skuId, orderId, userId }: any = validateParams(useRoute())
    const navigation = useNavigation<any>()


    function handleChange(input: string, value: any) {
      let inputDataObj: any = {}
      if (input === 'sku') {
        const product = products?.results?.find(
          (item: any) => item?.sku_title === value
        )
        setProductData(product)
        inputDataObj = {
          'sku': product?.id,
          'price_excl_tax': product?.unit_price,
          'price_incl_tax': product?.unit_price
        }
      } else if (input === 'user') {
        const user = users?.results?.find(
          (item: any) => item?.full_name === value
        )
        setUserData(user)
        inputDataObj['user'] = user?.id
      } else {
        inputDataObj[input] = parseInt(value, 10)
      }

      setInputData((prev: any) => ({ ...prev, ...inputDataObj }))
      setErrors((prev: any) => ({ ...prev, [input]: false }))
    }

    useMemoAfterMount(() => {
      if (inputData?.user ?? userId) {
        const user = users?.results?.find(
          (item: any) => item?.id === (inputData?.user ?? userId)
        )
        setUserData(user)
      }
    }, [users])

    useMemoAfterMount(() => {
      if (skuId ?? inputData?.sku !== 'N/A') {
        const product = products?.results?.find(
          (item: any) => item?.id === (skuId ?? inputData?.sku)
        )
        setProductData(product)
        setInputData((prev: any) => ({ ...prev, 'sku': (skuId ?? inputData?.sku) }))
      }
    }, [products])


    return (
      <View style={[$['section'], $.only(['ph-15'])]}>
        <Text style={$['heading']}>Product Details</Text>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Product Name</Text>
          <Dropdown
            multiSelect={false}
            required={true}
            labelPosition="top"
            placeholder={productData?.sku_title ?? "Select Product Name"}
            options={products?.results?.map((item: any) => item?.sku_title)}
            selectedValues={[productData?.sku_title]}
            onChange={(value) => handleChange('sku', value)}
            style={[$.only(['fc-n700']), isIos && $.only(['pt-8', 'mv-0'])]}
            containerStyle={$.only(['mt-2',])}
            inputWrapperStyle={[$['inputWrapper'], errors?.sku && $.only(['bc-red'])]}
            placeholderTextColor={colors.palette.neutral700}
            editable={!isLoading?.products}
          />
        </View>
        <ConditionalComponent condition={!!productData} >
          <View style={$['inputRow']}>
            <ProductCard
              data={productData}
              linksDisplay={false}
            />
          </View>
        </ConditionalComponent>
        <ConditionalComponent condition={inputData?.user === 'N/A'}>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Customer Name: {orderData?.social_handle}</Text>
            <ThemedButton
              name="rick" type="primary"
              backgroundColor="#075aa6"
              backgroundDarker="#288fed"
              textColor="white" size="small" stretch
              onPress={() => {
                navigation.navigate('AddNewCustomer', {
                  orderId,
                  socialHandle: orderData?.social_handle
                })
              }}
            > Update Customer
            </ThemedButton>
          </View>

          <View style={$['inputRow']}>
            <Text style={$['label']}>Customer Name</Text>
            <Dropdown
              multiSelect={false}
              required={true}
              labelPosition="top"
              placeholder={userData?.full_name ?? "Select Customer Name"}
              options={users?.results?.map((item: any) => item?.full_name)}
              selectedValues={[userData?.full_name]}
              onChange={(value) => handleChange('user', value)}
              style={[$.only(['fc-n700']), isIos && $.only(['pt-8', 'mv-0'])]}
              containerStyle={$.only(['mt-2',])}
              inputWrapperStyle={[$['inputWrapper'], errors?.user && $.only(['bc-red'])]}
              placeholderTextColor={colors.palette.neutral700}
              editable={!isLoading?.users}
            />
          </View>
        </ConditionalComponent>
        <View style={[$.only(['pt-10', 'rowItemAlignBetween'])]}>
          <View style={$.only(['w-48%'])}>
            <Text style={$['label']}>Product Code </Text>
            <TextField
              style={$['textField']}
              placeholder="Enter Product Code"
              inputWrapperStyle={$['textFieldWrapper']}
              editable={false}
              value={productData?.sku_code}
            />
          </View>
          <View style={$.only(['w-48%'])}>
            <Text style={$['label']}>Quantity</Text>
            <TextField
              style={$['textField']}
              placeholder="Enter Quantity"
              inputWrapperStyle={[$['inputWrapper'], errors?.quantity && $.only(['bc-red'])]}
              keyboardType="numeric"
              value={inputData?.['quantity'] && inputData?.['quantity']?.toString()}
              onChangeText={(value: any) => handleChange('quantity', value)}
            />
          </View>
        </View>
        <View style={$['inputRow']}>
          <Text style={$['label']}>Product Price [incl. tax]</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={$['textFieldWrapper']}
            editable={false}
            value={`${AMOUNT_INC_TAX}/-`}
          />
        </View>
      </View>
    )
  },
  AddressContainer(props: any) {
    const { style: $, userData, setInputData, errors, setErrors, bottomSheetRef } = props
    const { data: response, call: addressCall, rootApi } = useApi({})
    const addressResponse = response?.data

    const [addresses, setAddresses] = useState<any>({ shipping_address: '', billing_address: '' })
    const [checkbox, setCheckbox] = useState<any>(false)

    const handler = {
      handleChange(input: string, value: string) {
        const address = addressResponse?.find(
          (item: any) => `${item?.address}, ${item?.zipcode?.formatted_address}` === value
        )
        setAddresses((prev: any) => ({
          ...prev,
          [input]: address
        }))

        setInputData((prev: any) => ({
          ...prev,
          [input]: address?.id
        }))
        setErrors((prev: any) => ({
          ...prev,
          [input]: false
        }))
      },
      handleCheckbox(value: boolean) {
        if (!value) {
          setCheckbox(value)
          setAddresses((prev: any) => ({
            ...prev,
            'shipping_address': ""
          }))
          setInputData((prev: any) => ({
            ...prev,
            'shipping_address': ""
          }))
        } else if (addresses?.['billing_address']) {
          setAddresses((prev: any) => ({
            ...prev,
            'shipping_address': prev['billing_address']
          }))
          setInputData((prev: any) => ({
            ...prev,
            'shipping_address': prev['billing_address']
          }))
          setCheckbox(value)
        } else {
          ErrorToast('Please, select a Billing address!')
          setErrors((prev: any) => ({ ...prev, 'billing_address': true }))
        }
      },
      handleDrawerOpen(input: string) {
        let userError = false;
        if (userData) {
          bottomSheetRef.current?.snapToIndex(0)
        } else {
          userError = true;
          ErrorToast('Please, select a customer')
        }
        setErrors((prev: any) => ({
          ...prev,
          'user': userError,
          [input]: false
        }))
      }
    }

    useMemo(() => {
      if (userData) {
        rootApi.account.address.get({
          call: addressCall,
          urlSuffix: `${userData?.id}/`
        })
      }
    }, [userData])

    return (
      <View style={$.only(['ph-15'])}>
        <View style={$['section']}>
          <Text style={$['heading']}>Billing Address</Text>
          <ConditionalComponent condition={addressResponse?.length > 0} >
            <View style={$['inputRow']}>
              <Text style={$['label']}>Billing Addresses</Text>
              <Dropdown
                multiSelect={false}
                required={true}
                labelPosition="top"
                placeholder={"Select Billing Address"}
                options={addressResponse?.map(
                  (item: any) => `${item?.address}, ${item?.zipcode?.formatted_address}`
                )}
                selectedValues={[
                  `${addresses?.['billing_address']?.address}, 
                  ${addresses?.['billing_address']?.zipcode?.formatted_address}`
                ]}
                onChange={(value) => handler.handleChange('billing_address', value)}
                style={[$.only(['fc-n700']), isIos && $.only(['pt-0', 'mv-0'])]}
                containerStyle={$.only(['mt-2',])}
                inputWrapperStyle={[
                  $['inputWrapper'],
                  addresses?.['billing_address'] && $.only(['h-60']),
                  errors?.billing_address && $.only(['bc-red'])
                ]}
                placeholderTextColor={colors.palette.neutral700}
              />
            </View>
          </ConditionalComponent>
          <View style={$['inputRow']}>
            <ThemedButton
              name="rick"
              type="primary"
              backgroundColor="#075aa6"
              backgroundDarker="#288fed"
              textColor="white"
              size="small"
              stretch
              onPress={() => handler.handleDrawerOpen('billing_address')}
            >
              Add Billing Address
            </ThemedButton>
          </View>
        </View>

        <View style={$['section']}>
          <Text style={$['heading']}>Shipping Address</Text>
          <ConditionalComponent condition={(addressResponse?.length > 0 && checkbox === false)}>
            <View style={$['inputRow']}>
              <Text style={$['label']}>Shipping Addresses</Text>
              <Dropdown
                multiSelect={false}
                required={true}
                labelPosition="top"
                placeholder={"Select Shipping Address"}
                options={addressResponse?.map(
                  (item: any) => `${item?.address}, ${item?.zipcode?.formatted_address}`
                )}
                selectedValues={[
                  `${addresses?.['shipping_address']?.address}, 
                  ${addresses?.['shipping_address']?.zipcode?.formatted_address}`
                ]}
                onChange={(value) => handler.handleChange('shipping_address', value)}
                style={[$.only(['fc-n700']), isIos && $.only(['pt-0', 'mv-0'])]}
                containerStyle={$.only(['mt-2',])}
                inputWrapperStyle={[
                  $['inputWrapper'],
                  addresses?.['shipping_address'] && $.only(['h-60']),
                  errors?.shipping_address && $.only(['bc-red'])
                ]}
                placeholderTextColor={colors.palette.neutral700}
              />
            </View>
          </ConditionalComponent>
          <View style={$['inputRow']}>
            <ThemedButton
              name="rick" type="primary" stretch
              textColor="white" size="small"
              backgroundColor="#075aa6"
              backgroundDarker="#288fed"
              onPress={() => handler.handleDrawerOpen('shipping_address')}
            >
              Add Shipping Address
            </ThemedButton>
          </View>
          <View style={$.only(['pt-10', 'rowAlign'])}>
            <Checkbox
              style={$['checkBox']}
              value={checkbox}
              onValueChange={handler.handleCheckbox}
              color={true ? colors.palette.primary500 : undefined}
            />
            <Text style={$['label']}>Same as Billing Address</Text>
          </View>
        </View>
      </View>
    )
  },
  BottomDrawerContainer(props: any) {
    const { style: $, userData, bottomSheetRef } = props
    const { isLoading, call, rootApi } = useApi({})

    const [formData, setFormData] = useState({
      "address": "",
      "zipcode": "",
    })

    const [formErrors, setFormErrors] = useState({
      "address": false,
      "zipcode": false,
    })

    const handler = {
      handleChange(input: string, text: any) {
        setFormData((prev: any) => ({
          ...prev,
          [input]: text
        }))
        setFormErrors((prev: any) => ({ ...prev, [input]: false }))
      },
      handleSubmit() {
        formValidation({
          validationSchema: handler.validationSchema,
          inputData: formData,
          setErrors: formErrors,
          callback: handler.validationCallback
        })
      },
      validationSchema: Yup.object({
        "address": Yup.string().required("Please, enter address!"),
        "zipcode": Yup.string().min(6, "Zipcode at least contain 6 digits!").required("Please, enter zipcode!")
      }),
      validationCallback() {
        rootApi.account.address.post({
          call,
          props: {
            data: { ...formData, "user": userData?.id },
            invalidateQueryUrl: `addresses/${userData?.id}/`,
            meta: {
              successCallback({ data, query }) {
                bottomSheetRef.current?.close()
              }
            }
          }
        })
      }
    }

    const renderBackdrop = useCallback((props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ), []);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["45%", "75%",]}
        enablePanDownToClose={true}
        animateOnMount={true}
        backdropComponent={renderBackdrop}
        index={-1}
        handleIndicatorStyle={$.only(['bg-p300'])}
        containerStyle={$.only(['z-2'])}
      >
        <BottomSheetView style={$.only(['p-16', 'pt-0', 'h-100%'])}>
          <Text style={$['heading']}>Add Address</Text>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Zipcode</Text>
            <ZipcodeField
              style={$['textField']}
              inputWrapperStyle={[$['inputWrapper'], formErrors?.zipcode && $.only(['bc-red'])]}
              placeholder="Enter Zipcode"
              onChangeText={(value: any) => handler.handleChange('zipcode', value)}
              onPress={() => bottomSheetRef.current.snapToIndex(1)}
              value={formData?.zipcode}
            />
          </View>
          <View style={$['inputRow']}>
            <Text style={$['label']}>Address</Text>
            <TextField
              style={$['textField']}
              placeholder="Enter Address"
              inputWrapperStyle={[$['inputWrapper'], formErrors?.address && $.only(['bc-red'])]}
              onChangeText={(value: any) => handler.handleChange('address', value)}
              onPress={() => bottomSheetRef.current.snapToIndex(1)}
              value={formData?.address}
            />
          </View>
          <Button
            style={$['submitButton']}
            text="Submit"
            textStyle={$.only(['btn', 'fc-n100'])}
            pressedStyle={$.only(['bg-white', 'bc-p600', 'bw-1'])}
            pressedTextStyle={$['buttonText']}
            onPress={handler.handleSubmit}
            pending={isLoading}
          />
        </BottomSheetView>
      </BottomSheet>
    )
  }
}


interface CreateOrderScreenProps extends AppTabNavigatorScreenProps<"CreateOrder"> { }
export const CreateOrderScreen: FC<CreateOrderScreenProps> = observer(function CreateOrderScreen() {
  const navigation = useNavigation<any>()
  const { orderId, userId }: any = validateParams(useRoute())

  const [$] = useStyle($InitialStyle)
  const { data, isLoading, call } = useApi({ staleTime: 0, cacheTime: 0 })
  const users = data?.users
  const products = data?.products

  const { isLoading: submitLoading, call: submitCall, rootApi } = useApi({})
  const { data: orderResponse, call: orderCall } = useApi({})
  const orderData = orderResponse?.data

  const bottomSheetRef = useRef<any>(null);
  const [userData, setUserData] = useState<any>()
  const [productData, setProductData] = useState<any>()

  const [inputData, setInputData] = useState<any>({
    sku: '',
    user: '',
    quantity: 1,
    shipping_address: '',
    billing_address: '',
  })
  const [errors, setErrors] = useState({
    sku: false,
    user: false,
    quantity: false,
    shipping_address: false,
    billing_address: false,
  })

  const AMOUNT_INC_TAX = useMemo(() => {
    const unitPrice = parseFloat(productData?.['unit_price'])
    const quantity = parseFloat(inputData?.quantity)
    if (isNaN(unitPrice) || isNaN(quantity) || quantity === 0) {
      return 0
    }
    return (unitPrice * 1.1 * quantity).toFixed(2)
  }, [inputData?.quantity, productData])


  const handler = {
    handleSubmit() {
      formValidation({
        validationSchema: handler.validationSchema,
        inputData,
        setErrors,
        callback: handler.validationCallback
      })
    },
    validationSchema: Yup.object({
      "sku": Yup.string().required("Please, select Product!"),
      "user": Yup.string().required("Please, select Customer!"),
      "quantity": Yup.string().required("Please, enter Quantity!")
        .test(
          'is-valid-integer',
          'Quantity must be a valid integer between 1 and 10,000',
          (value) => {
            if (!value) return false;
            const numberValue = Number(value);
            return (
              Number.isInteger(numberValue) &&
              numberValue > 0 &&
              numberValue < 10000
            )
          }),
      "shipping_address": Yup.string().required("Please, select a Shipping address!"),
      "billing_address": Yup.string().required("Please, select a Billing address!"),
    }),
    validationCallback() {
      const submitData = {
        call: submitCall,
        props: {
          data: inputData,
          meta: {
            successCallback: handler.successCallback
          }
        }
      }
      if (orderId) {
        rootApi.order.patch({ ...submitData, urlSuffix: `${orderId}/` })
      } else {
        rootApi.order.post(submitData)
      }
    },
    successCallback({ data, query }: any) {
      const response = data?.data
      navigation.navigate("Congratulations", {
        orderId: response?.order_id,
        amount: AMOUNT_INC_TAX
      })
    }
  }

  // UPDATING UNVERIFIED ORDERS 
  useMemoAfterMount(() => {
    if (orderData) {
      setInputData({
        sku: orderData?.sku,
        user: orderData?.user ?? userId ?? 'N/A',
        quantity: orderData?.quantity,
        shipping_address: orderData?.shipping_address ?? 'N/A',
        billing_address: orderData?.shipping_address ?? 'N/A',
      })
    }
  }, [orderData])

  useMemo(() => {
    if (orderId) {
      rootApi.order.get({
        call: orderCall,
        urlSuffix: `${orderId}/?generic=true`,
      })
    }
  }, [orderId])

  useEffect(() => {
    call({
      url: [
        { 'products': 'sku_details/' },
        { 'users': 'users/' }
      ]
    })
  }, [])

  return (
    <Screen style={$.only(['f-1', 'ph-0'])} preset="scroll">
      <ScrollView showsVerticalScrollIndicator={false}>
        <components.UserContainer
          style={$}
          orderData={orderData}
          users={users}
          products={products}
          isLoading={isLoading}
          userData={userData}
          setUserData={setUserData}
          inputData={inputData}
          setInputData={setInputData}
          productData={productData}
          setProductData={setProductData}
          errors={errors}
          setErrors={setErrors}
          AMOUNT_INC_TAX={AMOUNT_INC_TAX}
        />
        <components.AddressContainer
          style={$}
          userData={userData}
          setInputData={setInputData}
          errors={errors}
          setErrors={setErrors}
          bottomSheetRef={bottomSheetRef}
        />
        <View style={$.only(['ph-15'])}>
          <Button
            style={$['submitButton']}
            text={orderId ? "Update Order" : "Create Order"}
            textStyle={$.only(['btn', 'fc-n100'])}
            pressedStyle={$.only(['bg-white', 'bc-p600', 'bw-1'])}
            pressedTextStyle={$['buttonText']}
            onPress={handler.handleSubmit}
            pending={submitLoading}
          />
        </View>
      </ScrollView>
      <components.BottomDrawerContainer
        style={$}
        userData={userData}
        bottomSheetRef={bottomSheetRef}
      />
    </Screen>
  )
})


const $InitialStyle = {
  'heading': ['h3', 'fc-n800', 'ffSemiBold'],
  'section': ['pt-20'],
  'inputRow': ['pt-10'],
  'label': ['h5', 'fc-n900', 'mb-5', 'ffNormal'],
  'textField': [`h-${isIos ? 35 : 40}`, `pv-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
  'textFieldWrapper': ['h-42'],
  'inputWrapper': ['bc-n400', 'br-3', 'bw-1', 'h-41'],
  'checkBox': ['h-20', 'w-20', 'mr-10',],
  'buttonText': ['fc-p600', 'btn'],
  'submitButton': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-10', 'w-100%',]
}
