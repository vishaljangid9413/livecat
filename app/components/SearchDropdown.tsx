import React, {
  ComponentType,
  forwardRef,
  FunctionComponent,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import {
  FlatList,
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { colors, spacing, typography } from "../theme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { isRTL, translate } from "../i18n"
import { Text, TextProps } from "./Text"
import { LinearGradient } from "expo-linear-gradient"
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet"
import { TextField } from "./TextField"
import { SvgIcon } from "./SvgIcon"
import { Button } from "./Button"
// import Modal from "react-native-modal"
import { observer } from "mobx-react-lite"
import { useStores } from "app/models"

export interface DropdownAccessoryProps {
  style: StyleProp<any>
  status: DropdownProps["status"]
  multiline: boolean
  editable: boolean
}

export interface DropdownProps extends Omit<TextInputProps, "ref"> {
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled"
  /**
   * A style modifier for different input states.
   */
  required?: true | false
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps["text"]
  labelPosition?: "left" | "top"
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: TextProps["tx"]
  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the label Text component.
   */
  LabelTextProps?: TextProps
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: Array<string>
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: TextProps["tx"]
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: TextProps
  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: TextProps["text"]
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: TextProps["tx"]
  /**
   * Optional placeholder options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  placeholderTxOptions?: TextProps["txOptions"]
  /**
   * Optional input style override.
   */
  style?: StyleProp<TextStyle>
  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>
  /**
   * An optional component to render on the right side of the input.
   * Example: `RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  RightAccessory?: ComponentType<DropdownAccessoryProps>
  /**
   * An optional component to render on the left side of the input.
   * Example: `LeftAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  LeftAccessory?: ComponentType<DropdownAccessoryProps>
  options: Array<any>
  listType?: string
  listKey?: string
  displayKey?: string
  displayCharacterNumber?: number
  optionComponent?: FunctionComponent<{ item: any }>
  mainContainerStyle?: StyleProp<ViewStyle>
  textFieldStyle?: StyleProp<ViewStyle>
  selectedItemStyle?: StyleProp<ViewStyle>
  multiSelect?: boolean
  selectedValue?: string
  canCancel?: boolean
  values: any
  setSearch?: React.Dispatch<string>
  setSearch1?: (value: string) => void
  setValues: (arg: any) => void
  onChange?: (value: any) => void
  placeholderSearch?: string
  canClearFilter?: boolean
  canApplyFilter?: boolean
}

export const SearchDropdown = observer(
  forwardRef(function Dropdown(
    props: DropdownProps,
    ref: Ref<{ clearAllValues: () => void; setSelectedOptionValues: () => void }>,
  ) {
    const {
      required,
      labelTx,
      label,
      labelPosition = "top",
      labelTxOptions,
      placeholderTx,
      placeholder = "",
      placeholderSearch,
      placeholderTxOptions,
      helper,
      helperTx,
      helperTxOptions,
      status,
      RightAccessory,
      LeftAccessory,
      HelperTextProps,
      LabelTextProps,
      selectedItemStyle,
      style: $inputStyleOverride,
      containerStyle: $containerStyleOverride,
      inputWrapperStyle: $inputWrapperStyleOverride,
      displayCharacterNumber,
      options,
      listType = "string",
      listKey = "id",
      multiSelect = false,
      selectedValue,
      displayKey = "name",
      setValues,
      setSearch1,
      onChange,
      setSearch,
      optionComponent,
      canCancel = true,
      values,
      mainContainerStyle,
      textFieldStyle,
      canClearFilter = true,
      canApplyFilter = true,
      ...TextInputProps
    } = props
    const input = useRef<TextInput | null>(null)
    // const {auth:{getTheme}} = useStores()
    const disabled = TextInputProps.editable === false || status === "disabled"
  
    const placeholderContent = placeholderTx
      ? translate(placeholderTx, placeholderTxOptions)
      : placeholder
  
    const $containerStyles = [$containerStyleOverride]
  
    const $labelStyles = [$labelStyle,{color: getTheme.label}, LabelTextProps?.style]
  
    const $inputWrapperStyles = [
      $inputWrapperStyle,
      status === "error" && { borderColor: colors.error },
      TextInputProps.multiline && { minHeight: 112 },
      LeftAccessory && { paddingStart: 0 },
      RightAccessory && { paddingEnd: 0 },
      $inputWrapperStyleOverride,
    ]
  
    const $inputStyles: any = [
      $inputStyle,
      disabled && { color: colors.textDim },
      isRTL && { textAlign: "right" as TextStyle["textAlign"] },
      TextInputProps.multiline && { height: "auto" },
      $inputStyleOverride,
    ]
  
    const $helperStyles = [
      $helperStyle,
      status === "error" && { color: colors.error },
      HelperTextProps?.style,
    ]
  
    function focusInput() {
      if (disabled) return
  
      input.current?.focus()
    }
    const clearAllValues = () => {
      multiSelect ? setSelectedOption([]) : setSelectedOption("")
      input.current?.clear()
    }
  
    useImperativeHandle(ref, () => ({
      clearAllValues,
      setSelectedOptionValues: () => {
        setSelectedOption(values)
      },
    }))
  
    const [carrotIcon, setCarrotIcon] = useState("DownArrow")
    const [isVisible, setIsVisible] = useState(false)
    const [selectedOption, setSelectedOption] = useState<any>(values)
    const [displayText, setDisplayText] = useState("")
  
    const { top, bottom } = useSafeAreaInsets()
  
    const toggleDropdown = () => {
      setCarrotIcon(carrotIcon === "DownArrow" ? "UpArrow" : "DownArrow")
      setIsVisible(!isVisible)
    }
  
    const handleCancelOption = (option: any) => {
      __DEV__ && console.tron.log("OPTIONS CANCELLED: ")
      if (multiSelect) {
        if (listType === "object") {
          const updatedItems = selectedOption.filter((item: any) => item[listKey] !== option[listKey])
          __DEV__ && console.tron.log("UPDATED iTEMS", updatedItems)
          setSelectedOption(updatedItems)
        } else {
          const updatedItems = selectedOption.filter((item: any) => item !== option)
          setSelectedOption(updatedItems)
        }
      } else {
        setSelectedOption(null)
      }
    }
  
    const handleSelectOption = (option: any) => {
      __DEV__ && console.tron.log("OPTIONS SELECTED: ", option)
      if (multiSelect) {
        if (listType === "object") {
          if (selectedOption) {
            const isSelected = selectedOption.find((instance: any) => {
              return instance.id === option.id
            })
            if (isSelected) {
              setSelectedOption(
                selectedOption.filter((instance: any) => {
                  return instance.id !== option.id
                }),
              )
            } else {
              setSelectedOption([...selectedOption, option])
            }
          } else {
            setSelectedOption([option])
          }
        }
        else{
          if(selectedOption){
            const isSelected = selectedOption.find((instance: any) => {
              return instance === option
            })
            if(isSelected){
              setSelectedOption(
                selectedOption.filter((instance: any) => {
                  return instance!== option
                }),
              )
            }
            else {
              setSelectedOption([...selectedOption, option])
            }
          }
          else{
            setSelectedOption([option])
          }
        }
      } else {
        setSelectedOption(option)
        toggleDropdown()
      }
    }
  
    useEffect(() => {
      __DEV__ && console.tron.log("values:::: ", options)
      if (selectedOption) {
        setValues(multiSelect ? [...selectedOption] : selectedOption)
      } else {
        setValues(null)
      }
    }, [selectedOption])
  
    const isSelected = (item: any) => {
      if(listType === 'string'){
        if(multiSelect){
          const selected = selectedOption.find((option: any) => {
            return option === item
          })
          if (selected) return true
          return false
        }
        else return selectedOption === item
      }
      else{
        const selected = selectedOption.find((option: any) => {
          return option === item
        })
        if (selected) return true
        return false
      }
    }
  
    const textDisplay = (text: string) => {
      if (displayCharacterNumber) {
        if (text.length <= displayCharacterNumber) return text
        return text.slice(0, displayCharacterNumber) + "..."
      }
      return text
    }

    function getNestedValue(obj:any, key:any) {
      if (typeof obj !== 'object' || obj === null) {
        return undefined;
      }
    
      if (obj.hasOwnProperty(key)) {
        return obj[key];
      }
    
      for (let k in obj) {
        if (obj.hasOwnProperty(k)) {
          const result:any = getNestedValue(obj[k], key);
          if (result !== undefined) {
            return result;
          }
        }
      }
    
      return undefined; // Return undefined if the key is not found
    }
    
    
    return (
      <View style={[$container, mainContainerStyle]}>
        <View
          style={[$containerStyles, textFieldStyle]}
          // onPress={toggleDropdown}
          accessibilityState={{ disabled }}
        >
          {!!(label || labelTx) && labelPosition === "top" && (
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text
                preset="formLabel"
                text={`${label}`}
                tx={labelTx}
                txOptions={labelTxOptions}
                {...LabelTextProps}
                style={$labelStyles}
              />
              {required && <Text text="*" style={$requiredStyles} />}
            </View>
          )}
          <TouchableOpacity
            activeOpacity={1}
            style={[
              $selectedItems,
              {borderColor:getTheme.cardBorder},
              status === "error" && { borderColor: colors.error, borderWidth: 1 },
              selectedItemStyle,
            ]}
            onPress={toggleDropdown}
          >
            {
              !multiSelect && selectedOption && !Array.isArray(selectedOption) ?
              <></>
              :
                label &&
                <Text style={{color: getTheme.inputfieldText, fontSize: 12, marginLeft: 8, marginTop: 10 }}>{`Select ${label}`}</Text>
            }
            {
              !multiSelect && selectedOption && !Array.isArray(selectedOption) &&
              <View style={[$selectedItem,{borderColor: getTheme.cardBorder}]}>
              <Text style={{ fontSize: 12,color: getTheme.cardTextaddress }}>
                {selectedValue
                  ? selectedValue
                  : listType === "object"
                  ? textDisplay(getNestedValue(selectedOption,displayKey))
                  : textDisplay(selectedOption)}
              </Text>
              {canCancel && (
                <TouchableOpacity style={{ marginLeft: 3 }}>
                  <SvgIcon
                    icon="Cancel"
                    size={16}
                    onPress={() => handleCancelOption(selectedOption)}
                  />
                </TouchableOpacity>
              )}
            </View>
            }
            <View
              style={{
                padding: 7,
                position: "absolute",
                right: 0,
              }}
            >
              <SvgIcon disabled={true} icon={carrotIcon} size={25} />
            </View>
          </TouchableOpacity>
          {
            multiSelect && (selectedOption && selectedOption.length > 0) &&
            <FlatList
              data={[1]}
              style={{
                borderColor: getTheme.cardBorder,
                borderWidth: 1,
                borderRadius: 5,
                marginTop: 10,
                maxHeight:100
              }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <View
                    style={
                      [$selectedItems, {borderWidth:0 }]
                    }
                  >
                    {multiSelect && selectedOption ? (
                      selectedOption && selectedOption.length > 0 ? (
                        selectedOption.map((value: any, index: number) => (
                          <View key={`option_index_${index}`} style={[$selectedItem,{borderColor: getTheme.cardBorder}]}>
                            <Text style={{color: getTheme.cardTextaddress}}>
                              {selectedValue
                                ? selectedValue
                                : listType === "object"
                                ? textDisplay(getNestedValue(value,displayKey))
                                : textDisplay(value)}
                            </Text>
                            {canCancel && (
                              <TouchableOpacity style={{ marginLeft: 3 }}>
                                <SvgIcon
                                  icon="Cancel"
                                  size={16}
                                  onPress={() => handleCancelOption(value)}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        ))
                      ) : (
                        <></>
                      )
                    ) : selectedOption ? (
                      <>
                        {Array.isArray(selectedOption) ? (
                          <>
                            {selectedOption.length > 0 && (
                              <View style={$selectedItem}>
                                {selectedOption.map((option) => {
                                  return (
                                    <>
                                      <Text style={{ fontSize: 12 }}>
                                        {selectedValue
                                          ? selectedValue
                                          : listType === "object"
                                          ? textDisplay(getNestedValue(option,displayKey))
                                          : textDisplay(option)}
                                      </Text>
                                      {canCancel && (
                                        <TouchableOpacity style={{ marginLeft: 3 }}>
                                          <SvgIcon
                                            icon="Cancel"
                                            size={16}
                                            onPress={() => handleCancelOption(selectedOption)}
                                          />
                                        </TouchableOpacity>
                                      )}
                                    </>
                                  )
                                })}
                              </View>
                            )}
                          </>
                        ) : (
                          // <View style={$selectedItem}>
                          //   <Text style={{ fontSize: 12 }}>
                          //     {selectedValue
                          //       ? selectedValue
                          //       : listType === "object"
                          //       ? textDisplay(selectedOption[displayKey])
                          //       : textDisplay(selectedOption)}
                          //   </Text>
                          //   {canCancel && (
                          //     <TouchableOpacity style={{ marginLeft: 3 }}>
                          //       <SvgIcon
                          //         icon="Cancel"
                          //         size={16}
                          //         onPress={() => handleCancelOption(selectedOption)}
                          //       />
                          //     </TouchableOpacity>
                          //   )}
                          // </View>
                          <></>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </View>
                )
              }}
            />
          }
  
          {!!(helper || helperTx) &&
            helper &&
            helper?.map((text, index) => {
              return (
                <Text
                  key={index}
                  preset="formHelper"
                  text={text}
                  tx={helperTx}
                  txOptions={helperTxOptions}
                  {...HelperTextProps}
                  style={$helperStyles}
                />
              )
            })}
        </View>
        {/* MODAL */}
        <Modal isVisible={isVisible} onBackdropPress={toggleDropdown}>
          <LinearGradient
            colors={["#08BEE7", "#FF971D"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[$gradientBorder, { maxHeight: WINDOW_HEIGHT - top - bottom }]}
          >
            <View style={[$modalContent,{backgroundColor:getTheme.background, height: "100%"}]}>
              <View
                style={{
                  position: "absolute",
                  alignItems: "flex-end",
                  top: -15,
                  right: -15,
                }}
              >
                <LinearGradient
                  colors={["#08BEE7", "#FF971D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={$iconGradientBorder}
                >
                  <View
                    style={{
                      backgroundColor: getTheme.background,
                      padding: 3,
                      borderRadius: 25,
                      alignItems: "center",
                      margin: 2,
                    }}
                  >
                    <SvgIcon onPress={toggleDropdown} icon="Cancel" size={25} />
                  </View>
                </LinearGradient>
              </View>
              {setSearch && (
                <TextField
                  placeholder={placeholderSearch ? placeholderSearch : "Search..."}
                  onChangeText={setSearch}
                  containerStyle={{
                    marginBottom: 15,
                  }}
                />
              )}
              {setSearch1 && (
                <TextField
                  placeholder="Search..."
                  onChangeText={(value) => {
                    setSearch1(value)
                  }}
                  containerStyle={{
                    marginBottom: 15,
                  }}
                />
              )}
              <FlatList
                data={options}
                keyExtractor={(item) => (listType === "object" ? item[listKey] : item.toString())}
                showsVerticalScrollIndicator={false}
                renderItem={
                  listType === "object"
                    ? ({ item }) => (
                        <TouchableOpacity onPress={() => handleSelectOption({ ...item })}>
                          {optionComponent && optionComponent({ item })}
                        </TouchableOpacity>
                      )
                    : ({ item }) => (
                        <TouchableOpacity
                          onPress={() => handleSelectOption(item)}
                          style={[
                            $option,
                            {
                              borderBottomColor: getTheme.cardBorder
                            },
                            {
                              backgroundColor: multiSelect
                                ? isSelected(item)
                                  ? getTheme.secandary
                                  : getTheme.background
                                : selectedOption && selectedOption === item
                                ? getTheme.secandary
                                : getTheme.background,
                            },
                          ]}
                        >
                          <Text style={{color:  getTheme.cardTextaddress}}>{listType === "object" ? item[listKey] : item}</Text>

                          <Text style={{color:  isSelected(item) ? getTheme.buttonText :getTheme.cardTextaddress}}>{listType === "object" ? item[listKey] : item}</Text>
                          {multiSelect && selectedOption === item && (
                            <TouchableOpacity onPress={() => handleCancelOption(item)}>
                              <SvgIcon disabled={true} icon="Cancel" size={16} />
                            </TouchableOpacity>
                          )}
                        </TouchableOpacity>
                      )
                }
              />
              <View style={{marginTop:5, gap: 10 }}>
                {
                  canClearFilter &&
                  <Button text="Clear" onPress={clearAllValues} />
                }
                
                {
                  multiSelect && canApplyFilter &&
                  <Button onPress={toggleDropdown} text="Apply" />
                }
              </View>
            </View>
          </LinearGradient>
        </Modal>
      </View>
    )
  })
) 


const $container: ViewStyle = {
  marginTop: spacing.sm,
  width: "100%",
}
const $labelStyle: TextStyle = {
  fontSize: 13,
  lineHeight: 20,
  fontFamily: typography.primary.normal,
  marginBottom: spacing.xxs,
}

const $requiredStyles: TextStyle = {
  color: colors.error,
  fontSize: 13,
  lineHeight: 20,
  marginLeft: 3,
}

const $inputWrapperStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-start",
  borderWidth: 1,
  borderRadius: 5,
  // backgroundColor: colors.palette.neutral200,
  backgroundColor: colors.transparent,
  borderColor: colors.border,
  overflow: "hidden",
  height: 40,
}

const $inputStyle: TextStyle = {
  flex: 1,
  alignSelf: "stretch",
  fontFamily: typography.primary.normal,
  color: colors.text,
  fontSize: 14,

  lineHeight: 21,
  height: 40,
  // https://github.com/facebook/react-native/issues/21720#issuecomment-532642093
  paddingVertical: 0,
  paddingHorizontal: 0,
  marginVertical: spacing.xs,
  marginHorizontal: spacing.sm,
}

const $helperStyle: TextStyle = {
  marginTop: spacing.xxs,
  fontSize: 14,
  lineHeight: 17,
}

const $rightAccessoryStyle: ViewStyle = {
  marginEnd: spacing.xs,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
}
const $leftAccessoryStyle: ViewStyle = {
  marginStart: spacing.xs,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
}
const $modalContent: ViewStyle = {
  // flex: 1,
  // backgroundColor: colors.background,
  // borderWidth:1,
  // borderColor: colors.border,
  padding: 16,
  borderRadius: 5,
}
const $option: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 10,
  borderBottomWidth: 1,
}
const $selectedItems: ViewStyle = {
  borderWidth: 1,
  borderRadius: 5,
  // marginTop: 5,
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  alignContent: "center",
  paddingVertical: 1,
  minHeight: 40,
  width: "100%",
}
const $selectedItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 6,
  paddingVertical: 1,
  borderWidth: 1,
  borderRadius: 20,
  margin: 3,
}
const $gradientBorder: ViewStyle = {
  // flex: 1,
  borderRadius: 7, // <-- Outer Border Radius
  padding:2,
}
const $iconGradientBorder: ViewStyle = {
  height: 35,
  width: 35,
  borderRadius: 20, // <-- Outer Border Radius
}
