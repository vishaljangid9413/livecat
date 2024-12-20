import * as React from "react"
import { ComponentType } from "react"
import {
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"
import { observer } from "mobx-react-lite"

import Add from '../../assets/icons/svg/add.svg'
import Back from '../../assets/icons/svg/back.svg'
import Bell from '../../assets/icons/svg/bell.svg'
import BulkOrder from '../../assets/icons/svg/bulk_order.svg'
import Calender from '../../assets/icons/svg/calender.svg'
import Clock from '../../assets/icons/svg/clock.svg'
import ContactUs from '../../assets/icons/svg/contact_us.svg'
import Customer1 from '../../assets/icons/svg/customer_1.svg'
import Customer2 from '../../assets/icons/svg/customer_2.svg'
import Delete from '../../assets/icons/svg/delete.svg'
import DeSelectedProduct from '../../assets/icons/svg/deselected_product.svg'
import DeSelectedCustomer from '../../assets/icons/svg/deselected_customer.svg'
import DeSelectedLiveshow from '../../assets/icons/svg/deselected_liveshow.svg'
import DeSelectedOrder from '../../assets/icons/svg/deselected_order.svg'
import DeSelectedAccount from '../../assets/icons/svg/deselected_account.svg'
import DeActiveAccount from '../../assets/icons/svg/deactivate_account.svg'
import DeleteAccount from '../../assets/icons/svg/delete_account.svg'
import Dropdown from '../../assets/icons/svg/dropdown.svg'
import DownArrow from '../../assets/icons/svg/down-arrow.svg';
import DownArrowFill from '../../assets/icons/svg/down-arrow-fill.svg';
import Download from '../../assets/icons/svg/download.svg';
import Edit from '../../assets/icons/svg/edit.svg'
import EditProfile from '../../assets/icons/svg/edit_profile.svg'
import Email from '../../assets/icons/svg/email.svg'
import EmptyVendor from '../../assets/icons/svg/empty_vendor.svg'
import EmptyOrder from '../../assets/icons/svg/empty_order.svg';
import EmptyCustomer from '../../assets/icons/svg/empty_customer.svg'
import EmptyLiveShow from '../../assets/icons/svg/empty_live_show.svg'
import EmptyProduct from '../../assets/icons/svg/empty_product.svg'
import Facebook from '../../assets/icons/svg/Facebook.svg'
import Filter from '../../assets/icons/svg/filter.svg'
import FilterApplied from '../../assets/icons/svg/filter_applied.svg'
import GrayAdd from '../../assets/icons/svg/grey_add.svg'
import Gallery from '../../assets/icons/svg/gallery.svg'
import HelpSupport from '../../assets/icons/svg/help_support.svg'
import Instagram from '../../assets/icons/svg/Instagram.svg'
import Language from '../../assets/icons/svg/language.svg'
import LinkedIn from '../../assets/icons/svg/LinkedIn.svg'
import Logout from '../../assets/icons/svg/logout.svg'
import Notification from '../../assets/icons/svg/notification.svg'
import OrderChecklist from '../../assets/icons/svg/order_checklist.svg'
import PrivacyPolicy from '../../assets/icons/svg/privacy_policy.svg';
import ProductDummy from '../../assets/icons/svg/product_dummy.svg';
import ProfileInfo from '../../assets/icons/svg/profile_info.svg';
import Search from '../../assets/icons/svg/search.svg';
import Security from '../../assets/icons/svg/security.svg';
import Select from '../../assets/icons/svg/select.svg';
import SelectedProduct from '../../assets/icons/svg/selected_product.svg'
import SelectedAccount from '../../assets/icons/svg/selected_account.svg';
import SelectedCustomers from '../../assets/icons/svg/Selected_customers.svg';
import SelectedLiveShow from '../../assets/icons/svg/selected_live_show.svg';
import SelectedOrder from '../../assets/icons/svg/selected_order.svg';
import SelectedVendor from '../../assets/icons/svg/selected_vendor.svg';
import Share from '../../assets/icons/svg/share.svg';
import Sms from '../../assets/icons/svg/sms.svg';
import Success from '../../assets/icons/svg/success.svg';
import Theme from '../../assets/icons/svg/theme.svg';
import TwitterX from '../../assets/icons/svg/TwitterX.svg';
import UploadImg from '../../assets/icons/svg/upload_img.svg';
import Upload from '../../assets/icons/svg/upload.svg';
import UploadFile from '../../assets/icons/svg/upload_file.svg';
import UpArrow from '../../assets/icons/svg/up-arrow.svg';
import UpArrowFill from '../../assets/icons/svg/up-arrow-fill.svg';
import Vendor from '../../assets/icons/svg/vendor.svg';
import WhatsApp from '../../assets/icons/svg/whatsapp.svg';
import WhiteArrow from '../../assets/icons/svg/white_arrow.svg';


const iconComponents:any = {
  selectedProduct: SelectedProduct,
  add: Add,
  back: Back,
  bell: Bell,
  bulkOrder: BulkOrder,
  calender: Calender,
  clock: Clock,
  contactUs: ContactUs,
  customer1: Customer1,
  customer2: Customer2,
  delete: Delete,
  deSelectedProduct: DeSelectedProduct,
  deSelectedCustomer: DeSelectedCustomer,
  deSelectedLiveshow: DeSelectedLiveshow,
  deSelectedAccount: DeSelectedAccount,
  deSelectedOrder: DeSelectedOrder,
  deActiveAccount: DeActiveAccount,
  deleteAccount: DeleteAccount,
  dropdown: Dropdown,
  downArrow: DownArrow,
  downArrowFill: DownArrowFill,
  download: Download,
  edit: Edit,
  editProfile: EditProfile,
  email: Email,
  emptyCustomer: EmptyCustomer,
  emptyLiveShow: EmptyLiveShow,
  emptyProduct: EmptyProduct,
  emptyVendor: EmptyVendor,
  emptyOrder: EmptyOrder,
  facebook: Facebook,
  filter: Filter,
  filterApplied: FilterApplied,
  gallery: Gallery,
  grayAdd: GrayAdd,
  helpSupport: HelpSupport,
  instagram: Instagram,
  language: Language,
  linkedIn: LinkedIn,
  logout: Logout,
  notification: Notification,
  orderChecklist: OrderChecklist,
  privacyPolicy: PrivacyPolicy,
  productDummy: ProductDummy,
  profileInfo: ProfileInfo,
  search: Search,
  security: Security,
  select: Select,
  selectedAccount: SelectedAccount,
  selectedCustomers: SelectedCustomers,
  selectedLiveShow: SelectedLiveShow,
  selectedOrder: SelectedOrder,
  selectedVendor: SelectedVendor,
  share: Share,
  sms: Sms,
  success: Success,
  theme: Theme,
  twitterX: TwitterX,
  uploadImg: UploadImg,
  upload: Upload,
  uploadFile: UploadFile,
  upArrow: UpArrow,
  upArrowFill: UpArrowFill,
  vendor: Vendor,
  whatsapp: WhatsApp,
  whiteArrow: WhiteArrow,
};

export default iconComponents;

// export type SvgIconTypes = keyof typeof iconRegistry

interface SvgIconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: string

  /**
   * An optional tint color for the icon
   */
  color?: string
  stroke?: string
  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

export const SvgIcon = observer(function SvgIcon(props: SvgIconProps) {
  const {
    icon,
    color,
    stroke = "",
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper: ComponentType<TouchableOpacityProps> = WrapperProps?.onPress
  ? TouchableOpacity
  : View
  const $imageStyle: StyleProp<ImageStyle> = [
    $imageStyleBase,
    color !== undefined && { tintColor: color },
    size !== undefined && { width: size, height: size },
    $imageStyleOverride,
  ]

  const IconComponent = iconComponents[icon];
  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      {IconComponent && <IconComponent width={size} height={size} fill={color} stroke={stroke}/>}
    </Wrapper>
  )
})


const $imageStyleBase: ImageStyle = {
  resizeMode: "contain",
}
