import * as ImagePicker from "expo-image-picker"
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import * as DocumentPicker from 'expo-document-picker';
import { ErrorToast } from "./formValidation";
import { Alert } from "react-native";

class FileManagement {

  private async requestPermission(permissionType: 'mediaLibrary' | 'camera') {
    const permissionRequest = permissionType === 'mediaLibrary' 
      ? ImagePicker.requestMediaLibraryPermissionsAsync() 
      : ImagePicker.requestCameraPermissionsAsync();

    const result = await permissionRequest;
    if (result.status !== 'granted') {
      ErrorToast(`${permissionType} permission is required.`);
      return false;
    }
    return true;
  }

  private async initializeMediaLibraryPermissions() {
    return await this.requestPermission('mediaLibrary');
  }

  private async initializeCameraPermissions() {
    return await this.requestPermission('camera');
  }

  async filePicker(type: 'image' | 'document' = 'image', browse?: 'gallery' | 'camera'): Promise<any> {
    try {
      if (type === 'image') {
        return await this.imagePicker(browse);
      } else {
        return await this.documentPicker();
      }
    } catch (error) {
      ErrorToast("An error occurred while picking the file.");
      return null;
    }
  }

  private async documentPicker() {
    try {
      const result: DocumentPicker.DocumentPickerResult = await DocumentPicker.getDocumentAsync({
        type: [
          'text/comma-separated-values', // CSV
          'text/csv', // CSV
          'application/msword', // MS Word
          'application/vnd.ms-excel', // XLS (Older Excel format)
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
          'officedocument.spreadsheetml.sheet',
          'application/vnd.google-apps.spreadsheet', // Google Spreadsheet
        ],
        copyToCacheDirectory: true, // Optionally, you can copy the file to the cache directory
        multiple: false,
      });

      if (!result.canceled) {
        const maxSize = 100 * 1024 * 1024; // Max file size (100MB)
        if ((result.assets[0].size || maxSize) > maxSize) {
          ErrorToast("File is too large!");
          return null;
        }
        return result;
      }
      return null;
    } catch (error) {
      ErrorToast("Unable to pick document.");
      return null;
    }
  }

  private async imagePicker(browse?: 'gallery' | 'camera') {
    try {
      if (browse) {
        return browse === 'gallery' ? await this.pickFromGallery() : await this.pickFromCamera();
      } else {
        return await new Promise((resolve) => {
          Alert.alert(
            'Pick an Image',
            'Would you like to take a photo or pick an image from your gallery?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
              { text: 'Take a Photo', onPress: () => resolve(this.pickFromCamera()) },
              { text: 'Choose from Gallery', onPress: () => resolve(this.pickFromGallery()) },
            ]
          );
        });
      }
    } catch (error) {
      ErrorToast("An error occurred while picking the image.");
      return null;
    }
  }

  private async pickFromGallery() {
    const perm = await this.initializeMediaLibraryPermissions();
    if (perm) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        allowsMultipleSelection: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        return result;
      }
    }
    return null;
  }

  private async pickFromCamera() {
    const perm = await this.initializeCameraPermissions();
    if (perm) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        base64: true,
        quality: 0.5
      });
      if (!result.canceled) {
        return result;
      }
    }
    return null;
  }
}


export const fileManagement = new FileManagement()

// Helper function to download and store files locally
export const downloadFile = async (url: string, fileName: string): Promise<string> => {
  try {
    // Get file extension from URL
    const fileExtension = url.split('.').pop()?.toLowerCase() || 'tmp';

    // Define file path in the local file system
    const filePath = `${FileSystem.documentDirectory}${fileName}.${fileExtension}`;

    // Download the file and save it locally
    const { uri } = await FileSystem.downloadAsync(url, filePath);
    return uri;
  } catch (error) {
    throw new Error(`Error downloading file from ${url}: ${error}`);
  }
};

export const downloadLocalFile = async (fileUri: string) => {
  try {
    const asset = await Asset.fromModule(fileUri); // Path to the dummy image
    await asset.downloadAsync(); // Ensure the asset is available
    return asset.localUri; // Use the local URI of the dummy file
  } catch (error) {
    throw new Error(`Error downloading file from ${fileUri}: ${error}`);
  }
}

export const formatResult = (result: any) => {
  const uri = result.assets ? result.assets[0].uri : ""
  let filename: string = uri.split("/").pop() || ""
  let match = /\.(\w+)$/.exec(filename)
  // let type:string = match ? `image/${match[1]}` : `image`;
  let extension = match ? match[1].toLowerCase() : "";
  // Set MIME type based on the file extension
  let type: string;
  if (extension === "csv") {
    type = "text/csv";
  } else if (extension === "xlsx") {
    type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  } else if (extension === "xls") {
    type = "application/vnd.ms-excel";
  } else if (extension === "image" && match) {
    type = `image/${match[1]}`;
  } else {
    type = `application/octet-stream`; // Default for unknown file types
  }
  return { uri: uri, name: filename, type }
}

