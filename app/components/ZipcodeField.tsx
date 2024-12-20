import * as React from "react"
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "app/components/Text"
import useStyle from "app/hooks/useStyle"
import { TextField } from "./TextField"
import { useApi } from "app/hooks/useApi"
import { debounce } from 'lodash';
import { SvgIcon } from "./SvgIcon"
import { ConditionalComponent } from "./Show"


export interface ZipcodeProps {
  style?: StyleProp<ViewStyle>
  inputWrapperStyle?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  placeholder?: string
  keyboardType?: 'default' | "numeric"
  maxLength?: number
  value?: string
  prefix?:string
  suffix?:string
  onChangeText?: (value?: string) => void
  onPress?:()=>void
}

export const ZipcodeField = observer(function Zipcode(props: ZipcodeProps) {
  const {
    style,
    inputWrapperStyle,
    containerStyle,
    placeholder,
    keyboardType ='default',
    maxLength,
    value,
    prefix,
    suffix,
    onChangeText,
    onPress
  } = props

  const [$] = useStyle({})
  const { data, isLoading, call, rootApi } = useApi({})

  const [suggestion, setSuggestion] = React.useState("loading...")
  const [showSuggestion, setShowSuggestion] = React.useState(false)
  const [selected, setSelected] = React.useState(false)

  function handlePress() {
    setShowSuggestion(false)
    if (!isLoading && data) {
      setSelected(true)
    }
  }
  
  const debouncedFetch = React.useCallback(
    debounce((text: string) => {
      rootApi.geo.zipcode({
        call,
        urlSuffix: `${text}/`,
        props: {
          meta: {
            showErrorMessage: false,
            successCallback({ data, query }) {
              const response = data?.data;
              const prefix_string = !!prefix?prefix?.trim() + ',':""
              const suffix_string = !!suffix?suffix?.trim():""
              setSuggestion(`${prefix_string} ${response?.formatted_address} ${suffix_string}`);
            },
            errorCallback({ error, query }) {
              setSuggestion("zipcode not found...");
            },
          },
        },
      });
    }, 500),
    [data, isLoading, setSuggestion]
  );

  function handleChange(text: any) {
    if (text === "") {
      setShowSuggestion(false);
      return;
    }
    if (!showSuggestion) setShowSuggestion(true);
    if (suggestion !== "loading...") setSuggestion("loading...");
    if (selected) setSelected(false);

    if (text && text.length > 5) {
      debouncedFetch(text);
    }
  }

  return (
    <>
      <TextField
        style={style}
        inputWrapperStyle={inputWrapperStyle}
        containerStyle={containerStyle}
        placeholder={placeholder}
        keyboardType={keyboardType}
        maxLength={maxLength}
        value={value}
        onChangeText={(value) => { handleChange(value); onChangeText?.(value) }}
        onPress={onPress}
        RightAccessory={() => {
          return (
            <ConditionalComponent condition={selected}>
              <View style={$.only(['h-40', 'w-30', 'centerItem'])}>
                <SvgIcon icon="success" size={20} />
              </View>
            </ConditionalComponent>
          )
        }}
      />
      <ConditionalComponent condition={!showSuggestion && (!suggestion.includes('loading') && !suggestion.includes('not found'))}>
        <Text style={$.only(['h6', 'fc-n600'])}>{suggestion}</Text>
      </ConditionalComponent>

      <View style={[$.only(['relative']), !showSuggestion && $.only(['d-none'])]}>
        <View style={$.only(['absolute', 'z-1', 'mt-5', 'ph-10', 'pv-8', 'bg-n300', 'br-2', 'w-100%'])}>
          <TouchableOpacity onPress={handlePress}>
            <Text style={$.only(['fc-black', 'h5'])}>{suggestion}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
})

