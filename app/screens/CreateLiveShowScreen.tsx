import React, { FC, useEffect, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { Image, Pressable, ScrollView, View } from "react-native"
import { Button, Screen, SvgIcon, Text, TextField } from "app/components"
import { AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator";
import useStyle from "app/hooks/useStyle";
import Checkbox from 'expo-checkbox';
import { isIos } from "app/theme/constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Dropdown } from "app/components/Dropdown";
import { colors } from "app/theme";
import { useApi } from "app/hooks/useApi";
import { fileManagement, formatResult } from "app/utils/FileMangement";
import { formValidation } from "app/utils/formValidation";
import { validateParams } from "app/utils/generics";
import * as Yup from 'yup'
import DateTimePicker from 'react-native-ui-datepicker';

const components = {
  InputContainer(props: any) {
    const {
      style: $,
      data,
      inputData,
      setInputData,
      errors,
      setErrors,
    } = props
    const { data: response, call, rootApi } = useApi({})
    const platformData = response?.data

    useEffect(() => {
      rootApi.liveshow.platform({ call })
    }, [])

    return (
      <View>
        <components.TitleInputContainer
          style={$}
          inputData={inputData}
          setInputData={setInputData}
          errors={errors}
          setErrors={setErrors}
        />
        <components.DateTimeInputContainer
          style={$}
          data={data}
          inputData={inputData}
          setInputData={setInputData}
          errors={errors}
          setErrors={setErrors}
        />
        <components.TimeZoneContainer
          style={$}
          inputData={inputData}
          setInputData={setInputData}
        />
        {platformData?.length > 0 && <components.CheckBoxContainer
          style={$}
          data={platformData}
          inputData={inputData}
          setInputData={setInputData}
        />}
        <components.BannerContainer
          style={$}
          data={data}
          inputData={inputData}
          setInputData={setInputData}
        />
      </View>
    )
  },
  TitleInputContainer(props: any) {
    const { style: $, inputData, setInputData, errors, setErrors } = props

    const handlChange = (text: string) => {
      setInputData((prev: any) => ({ ...prev, 'title': text }))
      setErrors((prev: any) => ({ ...prev, 'title': false }))
    }

    return (
      <View style={$['inputRow']}>
        <Text style={$['label']}>Title</Text>
        <TextField
          style={$['textField']}
          placeholder="Add your Title"
          onChangeText={handlChange}
          value={inputData?.title}
          maxLength={40}
          inputWrapperStyle={[$['textFieldWrapper'], errors?.title && $.only(['bc-red'])]}
        />
      </View>
    )
  },
  DateTimeInputContainer(props: any) {
    const { style: $, data, inputData, setInputData, errors, setErrors } = props
    const [datePickerMode, setDatePickerMode] = useState<any>();
    const [dateData, setDateData] = useState<any>({});

    const currentDate = new Date(); // Current date
    const previousDate = new Date();
    
    const [date,setDate] = useState<any>(currentDate)


    previousDate.setDate(currentDate.getDate() - 1);

    function handleChangeDateTime(text: any, mode: "date" | "time") {
      setDatePickerMode(mode)
      setDateData((prev: any) => ({ ...prev, [mode]: { ...prev[mode], 'string': text } }))
    }

    const handleSetDate = (dateString: any, mode?: "date" | "time") => {
      const pickerMode = datePickerMode ?? mode
      const date = dateString ? new Date(dateString) : new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed in JS
      const year = date.getFullYear();
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0'); // Add leading 0 to minutes
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const string = pickerMode === 'date' ?
        `${day}/${month}/${year}` :
        `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`
      const input = pickerMode === 'date' ?
        `${year}-${month}-${day}` :
        `${hours.toString().padStart(2, '0')}:${minutes}`
      
      setDate(dateString)

      setDateData((data: any) => ({
        ...data,
        [pickerMode]: { day, month, year, hours, minutes, ampm, string, input }
      }))
      __DEV__ && console.log('input',input)
      setInputData((prev: any) => ({ ...prev, [pickerMode]: input }))
      setErrors((prev: any) => ({ ...prev, [pickerMode]: false }))
      setDatePickerMode(null)
    };

    useMemo(() => {
      if (data) {
        handleSetDate(data?.date, 'date')
        handleSetDate(`${data?.date}T${data?.time}`, 'time')
      }
    }, [data])

    return (
      <View style={[$['inputRow']]}>
        {/* <View style={$.only(['w-47%'])}>
          <Text style={$['label']}>Date</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={[$['textFieldWrapper'], errors?.date && $.only(['bc-red'])]}
            LeftAccessory={() => (
              <View style={$['inputLeftIcons']}>
                <SvgIcon icon="calender" size={18} />
              </View>
            )}
            placeholder="DD/MM/YYYY"
            value={dateData?.['date']?.string}
            onChangeText={(text: any) => handleChangeDateTime(text, 'date')}
            onPress={() => setDatePickerMode('date')}
            keyboardType="numeric"
          />
        </View> */}
        
        <Text style={[$['label'],$['inputRow']]}>Pick Date for your </Text>
        {/* <DateTimePickerModal
          isVisible={!!datePickerMode}
          mode={datePickerMode}
          onConfirm={(data: any) => handleSetDate(data)}
          onCancel={() => setDatePickerMode('')}
        /> */}
        <DateTimePicker
          mode="single"
          date={date}
          minDate={previousDate}
          onChange={(params) => handleSetDate(params.date,'date')}
        />
        <View style={$.only(['w-100%'])}>
          <Text style={$['label']}>Time</Text>
          <TextField
            style={$['textField']}
            inputWrapperStyle={[$['textFieldWrapper'], errors?.time && $.only(['bc-red'])]}
            LeftAccessory={() => (
              <View style={$['inputLeftIcons']}>
                <SvgIcon icon="clock" size={18} />
              </View>
            )}
            placeholder="HH:MM AM/PM"
            value={dateData?.['time']?.string}
            onChangeText={(text: any) => handleChangeDateTime(text, 'time')}
            onPress={() => setDatePickerMode('time')}
            keyboardType="numeric"
          />
        </View>
      </View>
    )
  },
  TimeZoneContainer(props: any) {
    const { style: $, inputData, setInputData } = props
    const { data: response, call, rootApi } = useApi({})
    const data = response?.data

    const handleChange = (value: string) => {
      const timezone = data?.filter((obj: any) => {
        return obj?.name === value
      })
      setInputData((prev: any) => ({ ...prev, 'timezone': timezone[0]?.id }))
    }

    const selectedTimezone = useMemo(() => {
      return data?.filter((obj: any) => (obj?.id === inputData?.timezone))[0]?.name
    }, [inputData?.timezone])

    useEffect(() => {
      rootApi.geo.timezone({ call })
    }, [])

    return (
      <View style={$['inputRow']}>
        <Text style={$['label']}>Time Zone</Text>
        <Dropdown
          multiSelect={false}
          required={true}
          labelPosition="top"
          placeholder={selectedTimezone ?? "Select Time Zone"}
          options={data?.map((obj: any) => (obj?.name))}
          selectedValues={[selectedTimezone]}
          onChange={handleChange}
          style={[$.only(['fc-n700']), isIos && $.only(['pt-0', 'mv-0'])]}
          containerStyle={$.only(['mt-2'])}
          inputWrapperStyle={$.only(['bc-n400', 'br-3', 'bw-1'])}
          placeholderTextColor={colors.palette.neutral700}
        />
      </View>
    )
  },
  CheckBoxContainer(props: any) {
    const { style: $, data, inputData, setInputData, } = props

    const handleChange = (pk: number) => {
      setInputData((prev: any) => ({
        ...prev,
        'platforms': prev?.platforms.includes(pk) ?
          prev?.platforms.filter((id: number) => id !== pk) :
          [...prev?.platforms, pk]
      })
      )
    }
    return (
      <View style={$['inputRow']}>
        <Text style={$['label']}>Select Platforms</Text>
        <View style={$.only(['rowItemAlignBetween', 'fWrap-wrap', 'g-10', 'ph-5'])}>
          {
            data?.map((obj: any, index: any) => (
              <View key={obj?.id} style={$['checkBoxRow']}>
                <Checkbox
                  style={$['checkBox']}
                  value={inputData?.platforms.includes(obj?.id)}
                  onValueChange={() => handleChange(obj?.id)}
                  color={inputData?.platforms.includes(obj?.id) ? colors.palette.primary500 : undefined}
                />
                <Text style={$['checkBoxLabel']}>{obj?.name}</Text>
              </View>
            ))
          }
        </View>
      </View>
    )
  },
  BannerContainer(props: any) {
    const { style: $, data, setInputData } = props
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
      let result = await fileManagement.filePicker()
      if (result) {
        setImage(result?.assets[0]?.uri);
        setInputData((prev: any) => ({
          ...prev,
          'banner_image': formatResult(result)
        }))
      }
    };

    return (
      <View style={$['inputRow']}>
        <Text style={$['label']}>Upload Banner Image</Text>
        <Pressable style={$['imageInput']} onPress={pickImage} >
          {
            !image && !data?.banner_image ? (
              <View style={$.only(['columnAlign',])}>
                <SvgIcon icon="upload" size={30} />
                <Text style={$.only(['body1', 'fc-n700'])}>Upload Banner Image</Text>
              </View>
            ) : (
              <View style={$['uploadedImageCont']}>
                <Image source={{ uri: image ?? data?.banner_image }} style={$.only(['wh100%', 'br-6'])} />
                <Text style={$['changeButton']}>Change</Text>
              </View>
            )
          }
        </Pressable>
      </View>
    )
  },
  ButtonContainer(props: any) {
    const { style: $, showId, inputData, setInputData, setErrors } = props
    const navigation = useNavigation<any>()
    const { data: response, isLoading, call, rootApi } = useApi({})
    const submitResponse = response?.data

    const handler = {
      handleSubmit() {
        formValidation({
          validationSchema:handler.validationSchema,
          inputData,
          setErrors,
          callback: handler.validationCallback
        })
      },
      validationSchema: Yup.object({
        "title": Yup.string().required("Please, enter title!"),
        "date": Yup.string().required("Please, select date!"),
        "time": Yup.string().required("Please, select time!"),
      }),
      validationCallback() {
        const apiData = {
          call,
          props: {
            data: inputData
          }
        }
        if (showId) {
          rootApi.liveshow.patch({
            ...apiData, urlSuffix: `${showId}/`
          })
        } else {
          rootApi.liveshow.post(apiData)
        }
      }
    }

    useMemo(() => {
      if (submitResponse) {
        if (showId) {
          navigation.navigate('LiveShowDetail', { showId })
        } else {
          navigation.navigate('AddProducts', { showId: submitResponse?.id })
        }
      }
    }, [submitResponse])

    return (
      <Button
        style={$['button']}
        text={showId ? "Submit" : "Next"}
        textStyle={$.only(['btn', 'fc-n100'])}
        pressedStyle={$.only(['bw-1', 'bc-p600'])}
        pressedTextStyle={$.only(['fc-p600'])}
        onPress={handler.handleSubmit}
        pending={isLoading}
      />
    )
  }
}


interface CreateLiveShowScreenProps extends AppTabNavigatorScreenProps<"CreateLiveShow"> { }
export const CreateLiveShowScreen: FC<CreateLiveShowScreenProps> = observer(function CreateLiveShowScreen() {
  const [$] = useStyle($InitialStyle)
  const {showId}:any = validateParams(useRoute())

  const { data: response, call, rootApi } = useApi({})
  const data = response?.data

  const [inputData, setInputData] = useState({
    "title": "",
    "date": "",
    "time": "",
    "timezone": "",
    "platforms": [],
  });

  const [errors, setErrors] = useState({
    "title": false,
    "date": false,
    "time": false,
  });

  useMemo(() => {
    if (showId) {
      rootApi.liveshow.get({
        call,
        urlSuffix: `${showId}/`,
      })
    }
  }, [showId])

  useMemo(() => {
    if (data) {
      setInputData({
        "title": data?.title,
        "date": "",
        "time": "",
        "timezone": data?.timezone,
        "platforms": data?.platforms.map((obj: any) => (obj?.platform))
      })
    }
  }, [data])

  return (
    <Screen style={$.only([`f-1`,])} preset="fixed">
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <View style={$.only(['columnItemBetween', 'pt-5'])}>
          <components.InputContainer
            style={$}
            data={data}
            inputData={inputData}
            setInputData={setInputData}
            errors={errors}
            setErrors={setErrors}
          />
          <components.ButtonContainer
            style={$}
            showId={showId}
            inputData={inputData}
            setInputData={setInputData}
            setErrors={setErrors}
          />
        </View>
      </ScrollView>
    </Screen>
  )
})


const $InitialStyle = {
  'inputRow': ['pt-10'],
  'label': ['h5', 'fc-n800', 'ffMedium', 'mb-5'],
  'textField': [`h-${isIos ? 35 : 40}`, `pv-${isIos ? 0 : 10}`, 'ph-10', 'body1', 'fc-n700'],
  'textFieldWrapper': ['h-42'],
  'inputLeftIcons': ['centerItem', 'p-10', 'pr-5'],
  'checkBoxRow': ['rowAlign', 'g-5'],
  'checkBoxLabel': ['body1', 'fc-n800'],
  'checkBox': ['h-15', 'w-15'],
  'imageInput': ['centerItem', 'bw-1', 'bc-n400', 'br-4', 'p-15', 'h-150', 'mt-5'],
  'uploadedImageCont': ['h-90', 'w-140', 'mb-10', 'bw-1', 'bc-n400', 'br-6'],
  'changeButton': ['body1', 'bg-p700', 'mh-25', 'br-15', 'ph-5', 'mt-4', 'lh-25', 'pb-2', 'ta-center', 'ffBold'],
  'button': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-10', 'w-100%',]
}
