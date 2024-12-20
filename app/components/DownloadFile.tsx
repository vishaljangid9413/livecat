import React from 'react';
import { Alert, Pressable } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ErrorToast } from 'app/utils/formValidation';
import { HOST_URL } from 'app/config/config.base';


interface DownloadFileProps {
  onDownloadStart?: () => void;
  onDownloadStop?: () => void;
  onPress?: (value: (fileurl: string) => Promise<void>) => void;
  children?: React.ReactNode;
}

const DownloadFile: React.FC<DownloadFileProps> = ({ onDownloadStart, onDownloadStop, onPress, children }) => {

  const downloadFile = async (fileType: string) => {
    try {
      onDownloadStart?.();
      const url = `${HOST_URL}/api/download_sample_file/?file_type=${fileType}`; 
      const filename = `${fileType}.xlsx`
      const downloadPath = FileSystem.documentDirectory + filename; 
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        downloadPath,
        {},
        (downloadProgress) => {}
      );
      const response = await downloadResumable.downloadAsync();
      
      if(response?.status === 200){
        onDownloadStop?.()
        Alert.alert(
          'Download Complete',
          `File "${filename}" has been downloaded.`,
          [
            {
              text: 'Open File',
              onPress: async () => {
                if (await Sharing.isAvailableAsync()) {
                  await Sharing.shareAsync(response?.uri);
                } else {
                  ErrorToast('Sharing is not available on this device')
                }
              },
            },
            {
              text: 'OK',
              style: 'cancel',
            },
          ]
        );
      }else{
        throw new Error("Failed")
      }
    } catch (error) {
      onDownloadStop?.()
      ErrorToast('Failed to download the file!')
    }
  };

  function handlePress() {
    onDownloadStart?.()
    onPress?.(downloadFile)
  }

  return (
    <Pressable onPress={handlePress}>
      {children}
    </Pressable>
  )
};

export default DownloadFile;

