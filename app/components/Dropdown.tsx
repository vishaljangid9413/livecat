import React, { ComponentType, forwardRef, Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
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
import { isRTL, translate } from "../i18n"
import { colors, spacing, typography } from "../theme"
import { Text, TextProps } from "./Text"
import { TextField } from "./TextField"
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from "./Icon"
import { SvgIcon } from "./SvgIcon"
import { isIos } from "app/theme/constants"
import { ConditionalComponent } from "./Show"
// import Modal from 'react-native-modal';

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

  labelStyle?: StyleProp<TextStyle>
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps["text"]
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
  searchPlaceholder?: TextProps["text"]
  /**
   * Optional input style override.
   */
  style?: StyleProp<TextStyle>
  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>
  mainContainerStyle?: StyleProp<ViewStyle>
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
  isSearchable?: boolean;
  options: Array<any>;
  multiSelect?: boolean;
  selectedValues: Array<string>
  setSearch?: (value: any) => void;
  onChange: (value: any) => void;
}

export const Dropdown = forwardRef(function Dropdown(props: DropdownProps, ref: Ref<TextInput>) {
  const {
    required,
    labelTx,
    label,
    labelPosition = "top",
    labelTxOptions,
    placeholderTx,
    placeholder,
    placeholderTxOptions,
    searchPlaceholder,
    helper,
    helperTx,
    helperTxOptions,
    status,
    RightAccessory,
    LeftAccessory,
    HelperTextProps,
    LabelTextProps,
    labelStyle,
    style: $inputStyleOverride,
    containerStyle: $containerStyleOverride,
    mainContainerStyle,
    inputWrapperStyle: $inputWrapperStyleOverride,
    options,
    multiSelect = false,
    selectedValues,
    isSearchable = false,
    setSearch,
    onChange,
    ...TextInputProps

  } = props
  const input = useRef<any>()

  const disabled = TextInputProps.editable === false || status === "disabled"

  const placeholderContent = placeholderTx
    ? translate(placeholderTx, placeholderTxOptions)
    : placeholder

  const $containerStyles = [$containerStyleOverride]

  const $labelStyles = [$labelStyle, LabelTextProps?.style, labelStyle]

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
  useImperativeHandle(ref, () => input.current)

  const [carrotIcon, setCarrotIcon] = useState('DownArrow')
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const toggleDropdown = () => {
    setCarrotIcon(carrotIcon === "DownArrow" ? "UpArrow" : "DownArrow");
    setIsVisible(!isVisible);
  };

  const handleSelectOption = (option: any) => {
    if (multiSelect) {
      const updatedSelection = [...selectedValues];
      if (updatedSelection.includes(option)) {
        updatedSelection.splice(updatedSelection.indexOf(option), 1);
      } else {
        updatedSelection.push(option);
      }
      onChange(updatedSelection);
    } else {
      setSelectedOption(option)
      onChange(option);
      toggleDropdown();
    }
  };

  useMemo(() => {
    if (Array.isArray(selectedValues) && !selectedValues[0]) {
      setSelectedOption("")
    }
  }, [selectedValues])

  const [searchTemp, setSearchTemp] = useState<any>(options)
  useEffect(()=>{
    if(options){
      setSearchTemp(options)
    }
  },[options])

  return (
    <View
      style={[$container, mainContainerStyle]}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={[{ marginTop: spacing.sm }, $containerStyles]}
        onPress={toggleDropdown}
        accessibilityState={{ disabled }}
      >
        {!!(label ?? labelTx) && (labelPosition === "top") && (
          <View
            style={{
              flexDirection: "row"
            }}
          >
            <Text
              preset="formLabel"
              text={label}
              tx={labelTx}
              txOptions={labelTxOptions}
              {...LabelTextProps}
              style={$labelStyles}
            />
            {required &&
              <Text
                text="*"
                style={$requiredStyles}
              />}
          </View>
        )}

        <View style={$inputWrapperStyles}>
          {!!LeftAccessory ?
            (
              <LeftAccessory
                style={$leftAccessoryStyle}
                status={status}
                editable={!disabled}
                multiline={TextInputProps?.multiline ?? false}
              />
            )
            :
            ((labelPosition === "left") &&
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 7,
                  borderRightWidth: 1,
                  borderRightColor: colors.border,
                  backgroundColor: colors.textDim
                }}
              >
                <Text style={[$labelStyle, { lineHeight: 24 }]}>{label}</Text>
                {/* <SvgIcon icon={carrotIcon} size={25}/> */}
              </View>
            )
          }
          <TextInput
            ref={input}
            underlineColorAndroid={colors.transparent}
            textAlignVertical="top"
            placeholder={placeholderContent}
            placeholderTextColor={colors.text}
            {...TextInputProps}
            // editable={!disabled}
            editable={false}
            style={$inputStyles}
            value={selectedOption}
            numberOfLines={2}
            multiline
          />

          <TouchableOpacity
            onPress={toggleDropdown}
          >
            {!!RightAccessory ?
              (
                <RightAccessory
                  style={$rightAccessoryStyle}
                  status={status}
                  editable={!disabled}
                  multiline={TextInputProps.multiline ?? false}
                />
              )
              :
              (
                <View
                  style={{
                    padding: 7
                  }}
                >
                  <SvgIcon icon="dropdown" size={25} />
                </View>
              )
            }
          </TouchableOpacity>
        </View>

        {!!(helper ?? helperTx) && (
          <Text
            preset="formHelper"
            text={helper}
            tx={helperTx}
            txOptions={helperTxOptions}
            {...HelperTextProps}
            style={$helperStyles}
          />
        )}
      </TouchableOpacity>
      {multiSelect && selectedValues.length > 0 && (
        <View style={$selectedItems}>
          {
            selectedValues?.map((value) => {
              return (
                <View key={value} style={$selectedItem}>
                  <Text>{value}</Text>
                  <TouchableOpacity onPress={() => handleSelectOption(value)} style={{ marginLeft: 3 }}>
                    <Icon icon="x" size={16} />
                  </TouchableOpacity>
                </View>
              )
            })}
        </View>
      )}
      
    </View>
  )
})

const $container: ViewStyle = {
  // marginTop: spacing.sm
}
const $labelStyle: TextStyle = {
  color: colors.palette.primary500,
  fontSize: 15,
  marginBottom: 4,
  fontWeight: "bold",
}

const $requiredStyles: TextStyle = {
  color: colors.error,
  fontSize: 13.28,
  lineHeight: 20,
  marginLeft: 3
}

const $inputWrapperStyle: ViewStyle = {
  flexDirection: "row",
  alignSelf: "center",
  alignItems: "flex-start",
  borderWidth: 1,
  borderRadius: 5,
  // backgroundColor: colors.palette.neutral200,
  backgroundColor: colors.transparent,
  borderColor: colors.palette.neutral200,
  overflow: "hidden",
  height: 40,
  width: "100%",
}

const $inputStyle: TextStyle = {
  flex: 1,
  alignSelf: "stretch",
  fontFamily: typography.primary.normal,
  color: colors.text,
  fontSize: 13.28,
  lineHeight: 21,
  height: 40,
  // https://github.com/facebook/react-native/issues/21720#issuecomment-532642093
  paddingVertical: 0,
  paddingHorizontal: 0,
  marginVertical: spacing.xs,
  marginHorizontal: spacing.sm,
}

const $helperStyle: TextStyle = {
  marginTop: spacing.xs,
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
  // flex:1,
  backgroundColor: colors.background,
  // borderWidth:1,
  // borderColor: colors.border,
  margin: 2,
  padding: 16,
  borderRadius: 5,
}
const $option: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 10,
  backgroundColor: colors.background,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral200,
}
const $selectedItems: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 5,
  marginTop: 5,
  flexDirection: 'row',
  flexWrap: "wrap",
  padding: 5
}
const $selectedItem: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 10,
  paddingVertical: 2,
  backgroundColor: colors.background,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 20,
  margin: 3,
}
