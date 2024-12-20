import React, { FC, useMemo, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, Image, Platform, Pressable, View } from "react-native"
import { Button, ConditionalComponent, ProductCard, Screen, SvgIcon, Text } from "app/components"
import { AppTabNavigatorParamList, AppTabNavigatorScreenProps } from "app/navigators/AppTabNavigator"
import useStyle from "app/hooks/useStyle"
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';
import { SCREEN_HEIGHT } from "app/theme/constants"
import { useApi } from "app/hooks/useApi"
import { fileManagement } from "app/utils/FileMangement"
import { ErrorToast, SuccessToast } from "app/utils/formValidation"
import DownloadFile from "app/components/DownloadFile"
import { ActivityIndicator } from "react-native-paper"


const components = {
  UploadContainer(props: any) {
    const { style: $, file, setFile } = props
    const [isFileDownloading, setIsFileDownloading] = useState<boolean>(false)

    const pickDocument = async () => {
      const result = await fileManagement.filePicker('document')
      if (result) {
        setFile(result?.assets[0])
      }
    };

    return (
      <>
        <View style={$['bannerCont']}>
          <Image source={require('../../assets/images/product_upload_vector.png')} style={$.only(['wh100%'])} />
        </View> 
        <View style={$['inputRow']}>
          <View style={$.only(['rowItemAlignBetween'])}>
            <Text style={$['label']}>Upload Product File</Text>

            <DownloadFile
              onDownloadStart={() => setIsFileDownloading(true)}
              onDownloadStop={() => setIsFileDownloading(false)}
              onPress={(submitFunc:any)=>submitFunc('product_sample')}
            >
              <View style={$.only(['centerItem', 'bg-p500', 'w-80', 'h-35', 'br-5'])}>
                <ConditionalComponent condition={isFileDownloading}>
                  <ActivityIndicator size={'small'} color="white" />
                  <>
                    <SvgIcon icon="download" size={20} />
                    <Text style={$.only(['h6', 'ffMedium'])}>Sample</Text>
                  </>
                </ConditionalComponent>
              </View>
            </DownloadFile>

          </View>
          <Pressable style={$['imageInput']} onPress={pickDocument}>
            <ConditionalComponent condition={!file}>
              <View style={$.only(['columnAlign',])}>
                <SvgIcon icon="upload" size={30} />
                <Text style={$.only(['body1', 'fc-n700'])}>Upload Product CSV/Excel File </Text>
              </View>
              <View style={$.only(['h-100', 'w-75%'])}>
                <Text style={$.only(['fc-n700', 'ffMedium', 'ta-center'])}>{file?.name}</Text>
                <Text style={$['changeButton']}>Change</Text>
              </View>
            </ConditionalComponent>
          </Pressable>
        </View>
      </>
    );
  },
  ProductsContainer(props: any) {
    const { style: $, productsData, setFile, setProductsData, setIsUploadCont } = props
    const { isLoading, call, rootApi } = useApi({})

    function handleSubmit() {
      rootApi.catalogue.bulkUpload({
        call,
        props: {
          data: { 'data': productsData },
          meta: { successCallback }
        }
      })
    }

    function successCallback(props: any) {
      const { data, faulty_products } = props?.data?.data

      if (faulty_products.length > 0) {
        let message;
        if (data.length > 0) {
          message = `Number of products uploaded are ${data.length} and ${faulty_products.length} faulty products found!`
        } else {
          message = `Number of products uploaded are 0!`
        }
        ErrorToast(message)
      } else {
        SuccessToast(`Number of products uploaded are ${data.length}!`)
      }

      setIsUploadCont(true)
      setFile(null)
      setProductsData([])
    }

    return (
      <View style={$.only([`h-${SCREEN_HEIGHT()}`])}>
        <View style={$.only(['h-90%'])}>
          <ConditionalComponent condition={productsData.length > 0} >
            <FlatList
              showsVerticalScrollIndicator={false}
              data={productsData}
              contentContainerStyle={$.only(['g-5', 'pv-15'])}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ index, item }: any) => (
                <ProductCard data={{ ...item }} />
              )}
            />
            <View style={$['EmptyScreen']}>
              <SvgIcon icon="emptyProduct" />
            </View>
          </ConditionalComponent>
        </View>
        <View style={$.only(['rowItemBetween'])}>
          <Button
            style={[$['submitButton'], $.only(['bg-white', 'bw-1', 'bc-p600'])]}
            text="Re - Upload"
            textStyle={$.only(['btn', 'fc-p600'])}
            pressedStyle={$.only(['bg-p600'])}
            pressedTextStyle={$.only(['fc-n100'])}
            onPress={() => setIsUploadCont(true)}
          />
          <Button
            style={$['submitButton']}
            text="Submit"
            textStyle={$.only(['btn', 'fc-n100'])}
            pressedStyle={$.only(['bw-1', 'bc-p600'])}
            pressedTextStyle={$.only(['fc-p600'])}
            onPress={handleSubmit}
            pending={isLoading}
          />
        </View>
      </View>
    )
  }
}


interface ProductsUploadScreenProps extends AppTabNavigatorScreenProps<"ProductsUpload"> { }
export const ProductsUploadScreen: FC<ProductsUploadScreenProps> = observer(function ProductsUploadScreen() {
  const [$] = useStyle(InitialSyle)
  const [isUploadCont, setIsUploadCont] = useState(true)
  const [file, setFile] = useState<any>(null);
  const [productsData, setProductsData] = useState<any>([])

  useMemo(() => {
    (async () => {

      if (file?.uri) {
        // Read file contents 
        const fileContents = await FileSystem.readAsStringAsync(file?.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // Read the file as an XLSX workbook
        const workbook = XLSX.read(fileContents, { type: 'base64' });

        // Extract the first sheet 
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the worksheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // const rows = data.split('\n').map(row => row.split(','));

        const [header, ...rows] = jsonData;
        const rowData = rows.map((row: any) => ({
          category_title: row[0],
          product_title: row[1],
          product_description: row[2],
          treatment: row[3],
          slug: row[4],
          delivery_time: row[5],
          unit_price: row[6],
          offer: row[7],
          origin: row[8],
          length: row[9],
          width: row[10],
          height: row[11],
          weight: row[12],
          material: row[13],
          vendor: row[14],
          pkg_size: row[15],
          pkg_unit: row[16],
          sales_factor: row[17]
        }));
        if (rowData.length > 0) {
          setProductsData(rowData)
          setIsUploadCont(false)
        } else {
          ErrorToast("Uploaded file is empty!")
          setFile(null)
        }
      }
    })()
  }, [file])

  return (
    <Screen style={$.only(['f-1'])} preset="fixed">
      <ConditionalComponent condition={isUploadCont}>
        <components.UploadContainer
          style={$}
          file={file}
          setFile={setFile}
        />
        <components.ProductsContainer
          style={$}
          productsData={productsData}
          setFile={setFile}
          setProductsData={setProductsData}
          setIsUploadCont={setIsUploadCont}
        />
      </ConditionalComponent>
    </Screen>
  )
})


const InitialSyle = {
  'bannerCont': [`h-${Platform.OS === 'ios' ? 320 : 295}`, 'p-30', 'of-auto', 'itemCenter'],
  'inputRow': ['mt-15'],
  'label': ['h5', 'fc-n800', 'mb-5', 'ffMedium'],
  'imageInput': ['centerItem', 'bw-1', 'bc-n400', 'br-4', 'p-15', 'h-150', 'mt-5'],
  'uploadedImageCont': ['h-90', 'w-140', 'mb-10', 'bw-1', 'bc-n400', 'br-6'],
  'changeButton': ['body1', 'bg-p700', 'mh-25', 'br-15', 'ph-5', 'mt-7', 'lh-25', 'pb-2', 'ta-center', 'ffBold'],
  'submitButton': ['bw-0', 'bg-p600', 'br-30', 'h-45', 'mv-10', 'w-46%',],
  'EmptyScreen': ['ph-40'],
}

