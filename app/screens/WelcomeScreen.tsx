import React, { FC } from "react"
import { Button, Screen, Text } from "app/components"
import { AppStackScreenProps } from "../navigators"
import { Pressable,View} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { WINDOW_HEIGHT } from "app/theme/constants"
import { observer } from "mobx-react-lite"
// import AppIntroSlider from "react-native-app-intro-slider"
import useStyle from "app/hooks/useStyle"

const IMAGE_HEIGHT = (WINDOW_HEIGHT * 48) / 100
const SECTION_HEIGHT = WINDOW_HEIGHT - IMAGE_HEIGHT

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome" | "Products"> { }

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const [$] = useStyle({
    'sliderCont': [`h-${SECTION_HEIGHT+80}`,'jc-space-between'],
    'image': ['w-300',`h-${IMAGE_HEIGHT - 50}`,'mh-auto'],
    'heading': ['h1','ta-center','fc-black','ffSemiBold'],
    'subHeading': ['body1','fc-n700','ta-center'],
    'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-10', 'w-100%',],
    'policyText': ['body2', 'fc-n700', 'ta-center'],
    'policyTextBlue': ['body2', 'fc-p500', 'ta-center'],
  })
  const navigation = useNavigation<any>()

  const slides = [
    {
      key: 1,
      title: 'Title 1',
      text: 'Description.\nSay something cool',
      backgroundColor: '#59b2ab',
    },
    {
      key: 2,
      title: 'Title 2',
      text: 'Other cool stuff',
      backgroundColor: '#febe29',
    },
    {
      key: 3,
      title: 'Rocket guy',
      text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
      backgroundColor: '#22bcb5',
    }
  ];

  return (
    <Screen style={$.only([`f-1`,'columnItemAround'])} safeAreaEdges={['top']} preset="fixed">
        <View style={$['sliderCont']}>
          {/* <AppIntroSlider
            activeDotStyle={$.only(['bg-p400'])}
            data={slides}
            onEndReached={()=>{
              setTimeout(()=>{
                navigation.navigate('Login')
              },3000)
            }}
            renderItem={({ item }) => {
              return (
                <View>
                  <AutoImage style={$['image']} source={require("../../assets/images/welcome.png")} />
                  <View style={{ gap: 8 }}>
                    <Text style={$['heading']}>Welcome to Livecat</Text>
                    <Text style={$['subHeading']}>
                      Figma ipsum component variant main layer. Undo clip stroke ellipse create list editor.
                    </Text>
                  </View>
                </View>
              )
            }}
          /> */}
        </View>

        <Button
          style={$['button']} 
          text="Skip"
          textStyle={$.only(['btn', 'fc-n100'])}
          pressedStyle={$.only(['bw-1','bc-p600'])}
          pressedTextStyle={$.only(['fc-p600'])}
          onPress={() =>navigation.navigate('Login')}
        />

        <View style={$.only(['mt-10'])}>
          <View style={$.only(['rowItemCenter'])}>
            <Text style={$['policyText']}>By continuing you accept our</Text>
            <Pressable onPress={() => { }}>
              <Text style={$['policyTextBlue']}> Terms of Service.</Text>
            </Pressable>
          </View>
          <Text style={$['policyText']}>Also learn how we process your data in our  </Text>
          <View style={$.only(['rowItemCenter'])}>
            <Pressable onPress={() => { }}>
              <Text style={$['policyTextBlue']}>Privacy Policy </Text>
            </Pressable>
            <Text style={$['policyText']}>and</Text>
            <Pressable onPress={() => { }}>
              <Text style={$['policyTextBlue']}> Cookies policy.</Text>
            </Pressable>
          </View>
        </View>
    </Screen>
  )
})
