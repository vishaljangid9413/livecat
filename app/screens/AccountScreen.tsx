import React, { FC, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, Platform, Pressable, ScrollView, Switch, View } from "react-native"
import { ConditionalComponent, Screen, SvgIcon, Text } from "app/components"
import { Dropdown } from "app/components/Dropdown"
import { colors } from "app/theme"
import { useNavigation } from "@react-navigation/native"
import { isIos } from "app/theme/constants"
import { fileManagement, formatResult } from "app/utils/FileMangement"
import { useApi } from "app/hooks/useApi"
import { useStores } from "app/models"
import { HOST_URL } from "app/config/config.base"
import useStyle from "app/hooks/useStyle"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"


const components = {
  BannerCont: observer((props: any) => {
    const { styles: $, data } = props
    const { call, rootApi } = useApi({})
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
      let result = await fileManagement.filePicker()
      if (result) {
        setImage(result?.assets?.[0].uri);

        rootApi.auth.profileUpdate({
          call, urlSuffix: `${data?.id}/`,
          props: {
            data: { 'photo': formatResult(result) },
            meta: {
              errorCallback: () => setImage(null)
            }
          }
        })
      }
    };

    return (
      <View style={$['bannerCont']}>
        <Image source={require('../../assets/images/profile_bg.png')} style={$.only(['w-100%', 'absolute', 'top-0'])} />
        <View style={$['profileCont']}>
          <ConditionalComponent condition={image || data?.photo} >
            <Image source={{ uri: image ? image : HOST_URL + data?.photo }} style={$['profileImage']} />
            <Image source={require('../../assets/images/profile-pic.jpg')} style={$['profileImage']} />
          </ConditionalComponent>
          <SvgIcon icon="edit" size={35} onPress={pickImage} />
        </View>
      </View>
    )
  }),
  TitleCont: observer((props: any) => {
    const { styles: $, data } = props

    return (
      <View style={$.only(['columnItemAlignCenter'])}>
        <Text style={$['nameText']}>{data?.user?.full_name ?? "--"}</Text>
        <View style={$.only(['row', 'ai-center', 'g-10'])}>
          <SvgIcon icon="email" size={15} />
          <Text style={$['text']}>{data?.user?.email ?? "--"}</Text>
        </View>
        <View style={$.only(['row', 'ai-center', 'g-5'])}>
          <SvgIcon icon="whatsapp" size={15} />
          <Text style={$['text']}>{data?.user?.mobile ?? "--"}</Text>
        </View>
      </View>
    )
  }),
  SocialMediaCont: observer((props: any) => {
    const { styles: $, data } = props

    return (
      <View style={$.only(['rowItemCenter', 'g-10', 'mv-10'])}>
        {data?.facebook && <SvgIcon icon="facebook" size={32} />}
        {data?.instagram && <SvgIcon icon="instagram" size={32} />}
        {data?.linkedin && <SvgIcon icon="linkedin" size={32} />}
        {data?.youtube && <SvgIcon icon="youtube" size={32} />}
        {data?.website && <SvgIcon icon="website" size={32} />}
        {data?.whatsapp && <SvgIcon icon="whatsapp" size={32} />}
        {data?.telegram && <SvgIcon icon="telegram" size={32} />}
      </View>
    )
  }),
  FirstSection: observer((props: any) => {
    const { styles: $, data } = props
    const navigation = useNavigation<any>()
    const { call, rootApi } = useApi({})
    const [notification, setNotification] = useState(data?.user?.notification)
    const [language, setLanguage] = useState(data?.user?.language)

    function handleNotification(value: boolean) {
      setNotification(value)
      rootApi.auth.userUpdate({
        call, urlSuffix: `${data?.user?.id}/`,
        props: {
          data: { 'notification': value },
          meta: {
            errorCallback: () => setNotification(!value)
          }
        }
      })
    }

    function handleLanguage(value: any) {
      if (value !== language) {
        setLanguage(value)
        rootApi.auth.userUpdate({
          call, urlSuffix: `${data?.user?.id}/`,
          props: {
            data: { 'language': value },
            meta: {
              errorCallback: () => setLanguage(data?.user?.language)
            }
          }
        })
      }
    }

    useMemo(() => {
      setNotification(data?.user?.notification)
    }, [data?.user?.theme])

    return (
      <View style={[$['sections'], { shadowOffset: { width: 0, height: 2 } }]}>
        <Pressable
          style={$.only(['rowAlign', 'g-8'])}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <SvgIcon icon="editProfile" size={20} />
          <Text style={$['text']}>Edit Profile Information</Text>
        </Pressable>
        <View style={$.only(['rowItemAlignBetween'])}>
          <View style={$.only(['rowAlign', 'g-8'])}>
            <SvgIcon icon="bell" size={20} />
            <Text style={$['text']}>Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: colors.palette.primary100, true: colors.palette.primary500 }}
            thumbColor={true ? 'white' : colors.palette.primary700}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleNotification}
            value={notification}
            style={[$.only(['h-40']), isIos && $.only(['h-30', 'mv-10'])]}
          />
        </View>
        <View style={$.only(['rowItemAlignBetween'])}>
          <View style={$.only(['rowAlign', 'g-8'])}>
            <SvgIcon icon="language" size={20} />
            <Text style={$['text']}>Languages</Text>
          </View>
          <Dropdown
            multiSelect={false}
            required={true}
            labelPosition="top"
            placeholder={language}
            options={['English', 'Chinese', 'Urdu']}
            selectedValues={[language]}
            onChange={handleLanguage}
            style={$.only(['h-20', 'pt-5', 'mt-0', 'fc-p500'])}
            containerStyle={$.only(['mt-2', 'h-25'])}
            inputWrapperStyle={$.only(['bc-n400', 'bw-0', 'w-80', 'ta-center', 'h-25'])}
            placeholderTextColor={colors.palette.primary500}
            RightAccessory={() => (<></>)}
          />
        </View>
      </View>
    )
  }),
  SecondSection: observer((props: any) => {
    const { styles: $, data } = props
    const { call, rootApi } = useApi({})
    const [theme, setTheme] = useState(data?.user?.theme !== 'light')

    function handleTheme(value: boolean) {
      setTheme(value)
      rootApi.auth.userUpdate({
        call, urlSuffix: `${data?.user?.id}/`,
        props: {
          data: { 'theme': value ? 'dark' : 'light' },
          meta: {
            errorCallback: () => setTheme(!value)
          }
        }
      })
    }

    useMemo(() => {
      setTheme(data?.user?.theme !== 'light')
    }, [data?.user?.theme])

    return (
      <View style={[$['sections'], { shadowOffset: { width: 0, height: 2 } }]}>
        <Pressable style={$.only(['rowAlign', 'g-8'])}>
          <SvgIcon icon="security" size={20} />
          <Text style={$['text']}>Security</Text>
        </Pressable>
        <View style={$.only(['rowItemAlignBetween', 'h-30'])}>
          <View style={$.only(['rowAlign', 'g-8'])}>
            <SvgIcon icon="theme" size={20} />
            <Text style={$['text']}>Theme</Text>
          </View>
          <Switch
            trackColor={{ false: colors.palette.primary100, true: colors.palette.primary500 }}
            thumbColor={true ? 'white' : colors.palette.primary700}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleTheme}
            value={theme}
            style={[$.only(['h-40']), isIos && $.only(['h-30', 'mv-10'])]}
          />
        </View>
      </View>
    )
  }),
  ThirdSection: observer((props: any) => {
    const { styles: $ } = props

    return (
      <View style={[$['sections'], { shadowOffset: { width: 0, height: 2 } }]}>
        <Pressable style={$.only(['rowAlign', 'g-8', 'mv-5'])}>
          <SvgIcon icon="helpSupport" size={20} />
          <Text style={$['text']}>Help & Support</Text>
        </Pressable>
        <Pressable style={$.only(['rowAlign', 'g-8', 'mv-5'])}>
          <SvgIcon icon="contactUs" size={20} />
          <Text style={$['text']}>Contact Us</Text>
        </Pressable>
        <Pressable style={$.only(['rowAlign', 'g-8', 'mv-5'])}>
          <SvgIcon icon="privacyPolicy" size={20} />
          <Text style={$['text']}>Privacy Policy</Text>
        </Pressable>
      </View>
    )
  }),
  FourthSection: observer((props: any) => {
    const { styles: $ } = props
    const {authStore:{getUser, clearToken}} = useStores()
    const {call, rootApi} = useApi({})

    function handleSubmit(action:'logout'|'deactivate'|'delete'){
      if(action === 'logout'){
        clearToken()
      }else if(['deactivate', 'delete'].includes(action)){
        rootApi.auth.delete({
          call, urlSuffix:`${getUser?.id}/?action=${action}`,
          props:{
            meta:{
              errorMessage:`Unable to ${action} account!`
            }
          }
        })
      }
    }
    
    return (
      <View style={[$['sections'], { shadowOffset: { width: 0, height: 2 } }]}>
        <Pressable style={$.only(['rowAlign', 'g-8', 'mv-5'])} onPress={()=>handleSubmit('logout')}>
          <SvgIcon icon="logout" size={20} />
          <Text style={$['text']}>Logout</Text>
        </Pressable>
        <Pressable style={$.only(['rowAlign', 'g-8', 'mv-5'])} onPress={()=>handleSubmit('deactivate')}>
          <SvgIcon icon="deActiveAccount" size={20} />
          <Text style={$['text']}>Deactivate Account</Text>
        </Pressable>
        <Pressable style={$.only(['rowAlign', 'g-8', 'mv-5'])} onPress={()=>handleSubmit('delete')}>
          <SvgIcon icon="deleteAccount" size={20} />
          <Text style={$['text']}>Delete Account</Text>
        </Pressable>
      </View>
    )
  })
}


interface AccountScreenProps extends AppTabNavigatorScreenProps<"Account"> { }
export const AccountScreen: FC<AccountScreenProps> = observer(function AccountScreen() {
  const [$] = useStyle($InitialStyle)
  const { call, rootApi } = useApi({})
  const navigation = useNavigation<any>()
  const { authStore: { getProfile } } = useStores()

  useEffect(() => {
    rootApi.auth.profile({
      call,
      props: {
        meta: {
          errorCallback({ error, query }) {
            navigation.goBack()
          }
        }
      }
    })
  }, [])

  return (
    <Screen style={$.only(['f-1', 'ph-0'])} preset="scroll">
      <components.BannerCont
        styles={$}
        data={getProfile}
      />
      <ScrollView style={$.only(['ph-16', 'mt-20'])} showsVerticalScrollIndicator={false}>
        <components.TitleCont styles={$} data={getProfile} />
        <components.SocialMediaCont styles={$} data={getProfile} />
        <components.FirstSection styles={$} data={getProfile} />
        <components.SecondSection styles={$} data={getProfile} />
        <components.ThirdSection styles={$} data={getProfile} />
        <components.FourthSection styles={$} data={getProfile} />
      </ScrollView>
    </Screen>
  )
})


const iosShadowProperty = Platform.OS !== 'ios' ? ['of-hidden'] :
  ['sc-n700', 'shOffSetW0H2', 'so-0.3', 'sr-4']

const $InitialStyle = {
  'bannerCont': ['w-100%', 'h-240', 'centerItem'],
  'profileCont': ['w-130', 'h-125', 'mb--10', 'relative', 'jc-flex-end', 'ai-flex-end'],
  'profileImage': ['w-130', 'h-130', 'br-100', 'absolute', 'top-0'],
  'sections': ['mv-7', 'mh-3', 'p-10', 'el-3', 'bg-white', 'br-5', ...iosShadowProperty],
  'text': ['body1', 'fc-n900'],
  'nameText': ['h1', 'fc-n1000', 'ffMedium', 'ta-center'],
}

