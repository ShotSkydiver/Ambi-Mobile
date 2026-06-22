// eslint-disable-next-line react-native/split-platform-components
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import RNPhotoLibraryAssets from 'react-native-photo-library-assets';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { AmbiColors } from './contexts/themeContext';

const GetActionSheetWithOptions = () =>
  useActionSheet().showActionSheetWithOptions;

export default class AttachmentPicker {
  constructor(
    captions = {
      image: 'Image',
      document: 'Document',
      cancel: 'Cancel',
      title: 'Pick type of media'
    },
    showActionSheetWithOptions = GetActionSheetWithOptions()
  ) {
    this.pick = () => {
      return this._picker();
    };

    this._picker = () => {
      return new Promise((resolve, reject) => {
        const { image, document, cancel, title } = this._captions;
        const options = [image, document, cancel];
        const handlers = [
          this._pickImage,
          this._pickDocument,
          this._pickClosed
        ];
        const cancelButtonIndex = options.indexOf(cancel);

        showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
            title,
            tintColor: AmbiColors.ambiBlue
          },
          buttonIndex => {
            handlers[buttonIndex](resolve, reject);
          }
        );
      });
    };

    this._pickImage = async (resolve, reject) => {
      try {
        const media = await ImagePicker.openPicker({
          multiple: false,
          compressVideoPreset: 'Passthrough',
          writeTempFile: true,
          compressVideo: false,
          smartAlbums: [
            'UserLibrary',
            'Favorites',
            'RecentlyAdded',
            'Videos',
            'SelfPortraits',
            'LivePhotos',
            'DepthEffect',
            'Panoramas',
            'Bursts',
            'Screenshots',
            'LongExposure',
            'Animated',
            'Generic',
            'AllHidden',
            'Regular',
            'PhotoStream',
            'CloudShared'
          ]
        });

        if (media.mime.startsWith('video')) {
          resolve(media);
        } else {
          const imageUri = await RNPhotoLibraryAssets.getImageForAsset(
            media.localIdentifier
          );
          const processedMedia = {
            ...media,
            localPath: imageUri
          };
          resolve(processedMedia);
        }
      } catch (err) {
        reject(err);
      }
    };

    this._pickDocument = async (resolve, reject) => {
      try {
        const result = await DocumentPicker.pick({
          type: [
            DocumentPicker.types.pdf,
            DocumentPicker.types.video,
            DocumentPicker.types.images
          ]
        });
        resolve(result);
      } catch (_a) {
        reject(new Error('Action cancelled!'));
      }
    };

    this._pickClosed = (_, reject) => {
      reject(new Error('Action cancelled!'));
    };

    this._captions = captions;
  }
}
