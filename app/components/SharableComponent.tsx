import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { captureRef } from "react-native-view-shot"
import * as Sharing from 'expo-sharing';
import { WINDOW_HEIGHT } from "@gorhom/bottom-sheet";
import { ErrorToast } from "app/utils/formValidation";
import { useApi } from "app/hooks/useApi";
import useStyle from "app/hooks/useStyle";

export interface SharableComponentProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  children: [React.ReactNode, React.ReactNode] | React.ReactNode // Expect two children
}

/**
 * Describe your component here
 */
export const SharableComponent = observer(React.forwardRef(function SharableComponent(props: SharableComponentProps, ref) {
  const { style, children } = props
  const [$] = useStyle({
    'container':[`h-${WINDOW_HEIGHT-100}`, 'centerItem', 'op-0']
  })

  const viewRef = React.useRef<View>(null); 

  React.useImperativeHandle(ref, () => ({
    share: async () => {
      try {
        const uri = await captureRef(viewRef, {
          format: 'png', 
          quality: 1,    
        });
  
        __DEV__ && console.log('Screenshot saved at:', uri);
  
        // Share the captured image
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri);
        } else {
          ErrorToast('Sharing is not available on this device!');
        }
      } catch (error) {
        ErrorToast('Unable to share detail!');
      }
    }
  }));

  return (
    <View ref={viewRef} style={[$['container'], style]} collapsable={false}>
      <View style={$.only(['w-100%'])}>
        {children}
      </View>
    </View>
  )
}))

const $container: ViewStyle = {
  height:WINDOW_HEIGHT - 100,
  justifyContent:'center',
  alignItems:'center',
  opacity: 0, // Make it invisible
}

