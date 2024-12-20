import React, { useEffect, useMemo, useState } from "react"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, useNavigation, useRoute } from "@react-navigation/native"
import { Image, Pressable, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgIcon, Text, TextField } from "../components"
import { colors, spacing } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import {
  AccountScreen,
  AddNewCustomerScreen,
  AddProductsScreen,
  AddVendorScreen,
  CongratulationsScreen,
  CreateLiveShowScreen,
  CreateOrderScreen,
  CustomersScreen,
  EditProfileScreen,
  InvoiceScreen,
  LiveShowDetailScreen,
  LiveShowProductsScreen,
  LiveShowsScreen,
  OrdersScreen,
  ProductDetailScreen,
  ProductsListScreen,
  ProductsUploadScreen,
  SavedOrdersScreen,
  VendorsScreen,
} from "app/screens"

import { observer } from "mobx-react-lite"
import useStyle from "app/hooks/useStyle"
import { isIos } from "app/theme/constants"
import { useStores } from "app/models"
import { HOST_URL } from "app/config/config.base"

export type AppTabNavigatorParamList = {
  ProductsList: undefined
  Customers: undefined
  LiveShows: undefined
  LiveShowProducts: undefined
  Orders: undefined
  Vendors: undefined
  Account: undefined
  LiveShowDetail: undefined
  ProductDetail: undefined
  CreateLiveShow: undefined
  AddProducts: undefined
  ProductsUpload: undefined
  CreateOrder: undefined
  Congratulations: undefined
  Invoice: undefined
  AddNewCustomer: undefined
  AddVendor: undefined
  EditProfile: any
  SavedOrders: undefined
}

const tabBarLabelMap: any = {
  ProductsList: "Products",
  Customers: "Customers List",
  LiveShows: "Live Shows",
  LiveShowProducts: "Live Show Products",
  Orders: "Orders",
  Vendors: "Vendors",
  Account: "Account",
  LiveShowDetail: "Live Show Details",
  ProductDetail: "Product Detail",
  CreateLiveShow: "Create Live Show",
  AddProducts: "Add Products",
  ProductsUpload: "Products Upload",
  CreateOrder: "Create Order",
  Congratulations: " ",
  Invoice: "Order Invoice",
  AddNewCustomer: "Add New customer",
  AddVendor: "Manage Vendor",
  SavedOrders: "Saved Orders",
  EditProfile: "Profile",
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
// Create a custom header component
interface headerProps {
  title?: string
}

const CustomHeader = observer(function CustomHeader(props: headerProps) {
  const { title } = props
  const {
    authStore: { setSearchText, clearSearchText, getProfile },
  } = useStores()
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { top } = useSafeAreaInsets()
  const [searchInput, setSearchInput] = useState("")

  // Add the SCREEN NAMES TO SHOW THE BACK ICON
  const tabScreen = [
    "Products",
    "Orders",
    "Live Shows",
    "Customers",
    "Customers List",
    "Vendors",
  ].includes(title ?? route.name)
  // ADD THE SCREEN NAMES TO SHOW THE SEARCH BAR
  const searchScreen = [
    "Products",
    "Orders",
    "Live Shows",
    "Customers List",
    "Vendors",
    "Add Products",
  ].includes(title ?? route.name)

  const [styles] = useStyle({
    container: ["bg-p500", "ph-20", `h-${searchScreen ? 140 : 90}`],
    normalScreen: ["rowItemAlignBetween", `mt-${top + 10 - (isIos ? 10 : 0)}`, "g-10", "w-100%"],
    tabScreen: ["h-30", `mt-${top + (isIos ? 0 : 10)}`],
    normalScreenText: ["body1", "fc-n100"],
    tabScreenText: ["h3", "fc-n100"],
    productImageCont: ["h-30", "w-30", "centerItem", "of-hidden", "br-30"],
  })

  function handleChange(text: string) {
    setSearchInput(text)
    setSearchText(text)
  }

  const profilePhoto = useMemo(() => {
    return getProfile?.photo
      ? { uri: HOST_URL + getProfile?.photo }
      : require("../../assets/images/profile-pic.jpg")
  }, [getProfile?.photo])

  useEffect(() => {
    setSearchInput("")
    clearSearchText()
  }, [route.name])

  return (
    <View style={[styles["container"], searchScreen && styles.only(["bblr-20", "bbrr-20"])]}>
      {searchScreen ? (
        <View style={styles["tabScreen"]}>
          <View style={styles.only(["rowItemAlignBetween"])}>
            <View style={styles.only(["rowAlign", "g-7"])}>
              {!tabScreen && <SvgIcon icon="back" size={18} onPress={() => navigation.goBack()} />}
              <Text style={styles["tabScreenText"]}>{title ?? route.name}</Text>
            </View>
            <Pressable
              style={styles["productImageCont"]}
              onPress={() => navigation.navigate("Account")}
            >
              <Image source={profilePhoto} style={styles.only(["wh100%", "br-5"])} />
            </Pressable>
          </View>
          <TextField
            inputWrapperStyle={styles.only(["h-40", "br-20", "mt-10"])}
            style={styles.only([
              `h-${isIos ? 33 : 37}`,
              `pv-${isIos ? 0 : 10}`,
              "body1",
              "fc-n700",
            ])}
            placeholder="Search"
            value={searchInput}
            onChangeText={handleChange}
            LeftAccessory={() => (
              <View style={styles.only(["centerItem", "w-15%", "h-100%"])}>
                <SvgIcon icon="search" size={20} />
              </View>
            )}
          />
        </View>
      ) : (
        <View style={styles["normalScreen"]}>
          <Pressable
            style={styles.only(["rowAlign", "g-10"])}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <SvgIcon icon="whiteArrow" size={18} />
            <Text style={styles["normalScreenText"]}>{title ?? route.name}</Text>
          </Pressable>
          <Pressable
            style={styles["productImageCont"]}
            onPress={() => navigation.navigate("Account")}
          >
            <Image source={profilePhoto} style={styles.only(["wh100%", "br-5"])} />
          </Pressable>
        </View>
      )}
    </View>
  )
})

export type AppTabNavigatorScreenProps<T extends keyof AppTabNavigatorParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<AppTabNavigatorParamList, T>,
    AppStackScreenProps<keyof AppStackParamList>
  >

const Tab = createBottomTabNavigator<AppTabNavigatorParamList>()
  
export const AppTabNavigator: React.FC = observer(function navigationComponent() {
  const {
    authStore: { isSeller },
  } = useStores()

  const { bottom } = useSafeAreaInsets()

  const [styles] = useStyle({
    tabBar: ["bg-n50","btlr-20", "btrr-20", "ph-10", `h-${bottom + 70}`],
    label: ["fs-11.5", "lh-14", "fw-900", "pv-10"],
    item: [`pt-${spacing.sm}`],
  })

  const [profileNavigatorRoute, setProfileNavigatorRoute] = useState<any>(undefined)

  function getTabBarLabel(routeKey: string) {
    return profileNavigatorRoute ?? (tabBarLabelMap[routeKey] || routeKey)
  }

  return (
    <View style={{ flex: 1,backgroundColor: "white"}}>
      <Tab.Navigator
        backBehavior="history"
        initialRouteName="ProductsList"
          screenOptions={({ route, navigation }) => ({
          headerShown: true,
          header: ({ navigation }) => <CustomHeader title={getTabBarLabel(route.name)} />,
          tabBarHideOnKeyboard: true,
          tabBarStyle: styles["tabBar"],
          tabBarActiveTintColor: colors.palette.primary600,
          tabBarInactiveTintColor: colors.palette.neutral700,
          tabBarLabelStyle: styles["label"],
          tabBarItemStyle: styles["item"],
        })}
      >
        <Tab.Screen
          name="LiveShows"
          component={LiveShowsScreen}
          options={{
            headerShown: true,
            unmountOnBlur: true,
            tabBarLabel: "Live Shows",
            tabBarIcon: ({ focused }) => {
              return (
                <SvgIcon
                  disabled={true}
                  icon={focused ? "selectedLiveShow" : "deSelectedLiveshow"}
                  size={30}
                />
              )
            },
          }}
        />
        <Tab.Screen
          name="ProductsList"
          component={ProductsListScreen}
          options={{
            unmountOnBlur: true,
            tabBarLabel: "Products",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedProduct" : "deSelectedProduct"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Vendors"
          component={VendorsScreen}
          // options={{
          //   tabBarItemStyle: { display: isSeller ? undefined : "none" },
          //   unmountOnBlur: true,
          //   tabBarLabel: "Vendors",
          //   tabBarIcon: ({ focused }) => (
          //     <SvgIcon disabled={true} icon={focused ? "selectedVendor" : "vendor"} size={30} />
          //   ),
          // }}
          options={ isSeller ? {
              unmountOnBlur: true,
              tabBarLabel: "Vendors",
              tabBarIcon: ({ focused }) => (
                <SvgIcon disabled={true} icon={focused ? "selectedVendor" : "vendor"} size={30} />
              ),
            } : {
              tabBarItemStyle: { display:"none" },
              unmountOnBlur: true,
              tabBarLabel: "Vendors",
              tabBarIcon: ({ focused }) => (
                <SvgIcon disabled={true} icon={focused ? "selectedVendor" : "vendor"} size={30} />
              ),
            }}
        />
        <Tab.Screen
          name="Customers"
          component={CustomersScreen}
          options={ isSeller ? {
            unmountOnBlur: true,
            tabBarLabel: "Customers",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedCustomers" : "deSelectedCustomer"}
                size={30}
              />
            ),
          }:{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "Customers",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedCustomers" : "deSelectedCustomer"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Orders"
          component={OrdersScreen}
          options={{
            unmountOnBlur: true,
            tabBarLabel: "Orders",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedOrder" : "deSelectedOrder"}
                size={30}
              />
            ),
          }}
        />

        <Tab.Screen
          name="LiveShowDetail"
          component={LiveShowDetailScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "LiveShowDetail",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="LiveShowProducts"
          component={LiveShowProductsScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "LiveShowProducts",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "ProductDetail",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="CreateLiveShow"
          component={CreateLiveShowScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "CreateLiveShow",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="AddProducts"
          component={AddProductsScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "AddProducts",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ProductsUpload"
          component={ProductsUploadScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "ProductsUpload",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="CreateOrder"
          component={CreateOrderScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "CreateOrder",
          }}
        />
        <Tab.Screen
          name="SavedOrders"
          component={SavedOrdersScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "SavedOrders",
          }}
        />
        <Tab.Screen
          name="Congratulations"
          component={CongratulationsScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "Congratulations",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Invoice"
          component={InvoiceScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "Invoice",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="AddNewCustomer"
          component={AddNewCustomerScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "AddNewCustomer",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="AddVendor"
          component={AddVendorScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "AddVendor",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "Account",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        />
        <Tab.Screen
          name="EditProfile"
          // component={EditProfileScreen}
          options={{
            tabBarItemStyle: { display: "none" },
            unmountOnBlur: true,
            tabBarLabel: "EditProfile",
            tabBarIcon: ({ focused }) => (
              <SvgIcon
                disabled={true}
                icon={focused ? "selectedAccount" : "deSelectedAccount"}
                size={30}
              />
            ),
          }}
        >
          {({ navigation, route }) => (
            <EditProfileScreen
              setNavigatorRoute={setProfileNavigatorRoute}
              navigation={navigation}
              route={route}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  )
})
