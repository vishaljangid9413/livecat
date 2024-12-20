import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { observer } from "mobx-react-lite"

export interface ModalProps {
  style?: StyleProp<ViewStyle>
}

export const Modal = observer(function Modal(props: ModalProps) {

  return (
    // <Modal style={{ maxHeight: "90%" }} isVisible={isVisible} onBackdropPress={toggleDropdown}>
      
    // </Modal>
    <LinearGradient
        // colors={['#08BEE7', '#FF971D']}
        colors={["#FFFFFF", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[$gradientBorder, { maxHeight: "100%" }]}
      >
        {/* <View style={[$modalContent, { maxHeight: "100%" }]}>
          <Text
            preset="formLabel"
            text={label}
            tx={labelTx}
            txOptions={labelTxOptions}
            {...LabelTextProps}
            style={[$labelStyles, { fontSize: 18, textAlign: "center" }]}
          />
          <View
            style={{
              position: "absolute",
              alignItems: "flex-end",
              top: -15,
              right: -15,
            }}
          >
            <LinearGradient
              // colors={['#08BEE7', '#FF971D']}
              colors={["#FFFFFF", "#FFFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={$iconGradientBorder}
            >
              <View
                style={{
                  backgroundColor: colors.background,
                  padding: 3,
                  borderRadius: 25,
                  alignItems: "center",
                  margin: 2,
                }}
              >
                {!isIos && <Icon onPress={toggleDropdown} icon="x" size={25} />}
              </View>
            </LinearGradient>
          </View>

          {isSearchable && (
            <TextField
              placeholder={searchPlaceholder ?? "Search..."}
              onChangeText={(value: string) => {
                setSearchTemp(setSearch?.(value))
              }}
              inputWrapperStyle={{
                padding: 10,
              }}
              containerStyle={{
                marginBottom: 15,
              }}
            />
          )}
          <ConditionalComponent
            condition={isSearchable ? searchTemp?.length > 0 : options?.length > 0}
          >
            <FlatList
              data={isSearchable ? searchTemp : options}
              style={{ borderTopColor: colors.palette.primary400, borderTopWidth: 1 }}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectOption(item)}
                  style={[
                    $option,
                    {
                      backgroundColor: selectedValues.includes(item)
                        ? "#5a0da1"
                        : colors.background,
                    },
                  ]}
                >
                  <Text style={{ color: selectedValues.includes(item) ? "white" : "black" }}>
                    {item}
                  </Text>
                  {multiSelect && selectedValues.includes(item) && (
                    <TouchableOpacity onPress={() => handleSelectOption(item)}>
                      <Icon icon="x" size={16} />
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              )}
            />
            <Text style={{ color: "black" }}>{"No results..."}</Text>
          </ConditionalComponent>
        </View> */}
      </LinearGradient>
  )
})

const $gradientBorder: ViewStyle = {
  // flex:1,
  borderRadius: 5, // <-- Outer Border Radius
}
const $iconGradientBorder: ViewStyle = {
  height: 35,
  width: 35,
  borderRadius: 20, // <-- Outer Border Radius
}