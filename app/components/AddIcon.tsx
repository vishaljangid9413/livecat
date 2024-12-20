import * as React from "react"
import { Pressable, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { SvgIcon } from "./SvgIcon"
import useStyle from "app/hooks/useStyle"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { ConditionalComponent } from "./Show"

export interface AddIconProps {
  style?: StyleProp<ViewStyle>
  iconSize?: number
  navigate:string
  params?:any
}

/**
 * Describe your component here
 */
export const AddIcon = observer(function AddIcon(props: AddIconProps) {
  const { style,iconSize,navigate,params } = props
  const {authStore:{isSeller}} = useStores()
  const [$] =  useStyle({}) 
  const navigation = useNavigation<any>()

  return (
    <ConditionalComponent condition={isSeller}>
      <Pressable 
      style={[$.only(['absolute','bottom-15', 'right-0','z-1']), style]}
      onPress={()=>navigation.navigate(navigate, params)}
      >
      <SvgIcon icon="add" size={iconSize ?? 35} />
    </Pressable>
    <></>
    </ConditionalComponent>
  )
})
