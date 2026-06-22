import React, { memo, useState } from 'react';
import { View, Alert, StatusBar } from 'react-native';
import styled from 'styled-components';
import { BorderlessButton } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import { SafeAreaView } from 'react-native-safe-area-context';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { ThemeConstants, ShadowStyles } from './contexts/themeContext';
import Loader, { FullScreenLoader } from './Loader';
import ToastMessage from './ToastMessageAndroid';
import { DEVICE_WIDTH, IS_ANDROID } from './constants';

const ImagePreviewHeader = styled(View)`
  background-color: transparent;
  position: absolute;
  z-index: 100;
  top: 5px;
  left: 0px;
`;

const HeaderView = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  width: ${DEVICE_WIDTH};
  padding: 12px 26px;
`;

const HeaderButton = styled(BorderlessButton)`
  flex-direction: row;
  align-items: center;
`;

const ImagePreview = ({ navigation, route }) => {
  let imageIndex = 0;
  const images = route.params?.images || [];
  const imageUrls = images
    .filter(img => img && img.links)
    .map(img => ({ url: img.links.content || img.links.preview }));

  if (imageUrls.length > 0) {
    const selectedImage = route.params?.selectedImage || imageUrls[0];
    imageIndex = imageUrls.findIndex(item => item.url === selectedImage.url);
  }

  const [fetching, setFetching] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(imageIndex);

  const saveImage = async url => {
    try {
      const localImage = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'jpg'
      })
        .fetch('GET', url, {})
        .progress(() => {
          setFetching(true);
        });

      const savedImage = await CameraRoll.save(localImage.data, {
        type: 'photo'
      });
      if (savedImage) {
        setFetching(false);
        setToastMessage('Image saved to device');
        setToastVisible(true);
        if (!IS_ANDROID) {
          Alert.alert('Success', 'Image saved to device');
        }
      }
    } catch (err) {
      console.warn(err.code, err.message);
      setFetching(false);
      setToastMessage('Error saving image to device');
      setToastVisible(true);
      if (!IS_ANDROID) {
        Alert.alert('Error', 'Something went wrong! Please try again');
      }
    }
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: ThemeConstants.dark.elementBGColor }}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: ThemeConstants.dark.elementBGColor }}
        mode="margin"
      >
        <ImageViewer
          pageAnimateTime={300}
          loadingRender={() => <Loader />}
          backgroundColor={ThemeConstants.dark.elementBGColor}
          saveToLocalByLongPress={false}
          imageUrls={imageUrls}
          index={currentIndex}
          onSave={saveImage}
          useNativeDriver
          enablePreload
          renderIndicator={(currentIndex, allSize) =>
            allSize === 1 ? (
              <></>
            ) : (
              ImageViewer.defaultProps.renderIndicator(currentIndex, allSize)
            )
          }
          renderArrowLeft={() => {
            return currentIndex !== 0 ? (
              <BorderlessButton
                onPress={() => {
                  setCurrentIndex(currentIndex - 1);
                }}
                style={ShadowStyles.buttonsAndText}
              >
                <FeatherIcon name="chevron-left" color="#ffffff" size={52} />
              </BorderlessButton>
            ) : null;
          }}
          renderArrowRight={() => {
            return currentIndex < imageUrls.length - 1 ? (
              <BorderlessButton
                onPress={() => {
                  setCurrentIndex(currentIndex + 1);
                }}
                style={ShadowStyles.buttonsAndText}
              >
                <FeatherIcon name="chevron-right" color="#ffffff" size={52} />
              </BorderlessButton>
            ) : null;
          }}
          renderHeader={() => (
            <ImagePreviewHeader>
              <HeaderView>
                <HeaderButton onPress={() => navigation.pop()}>
                  <FeatherIcon
                    name="x"
                    color="#ffffff"
                    size={24}
                    onPress={() => navigation.pop()}
                  />
                </HeaderButton>
                <HeaderButton
                  onPress={() => saveImage(imageUrls[currentIndex || 0].url)}
                >
                  <FeatherIcon
                    name="download"
                    color="#ffffff"
                    size={24}
                    onPress={() => saveImage(imageUrls[currentIndex || 0].url)}
                  />
                </HeaderButton>
              </HeaderView>
            </ImagePreviewHeader>
          )}
        />
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          animated
        />
      </SafeAreaView>
      {IS_ANDROID && (
        <ToastMessage visible={toastVisible} message={toastMessage} />
      )}
      {fetching && (
        <FullScreenLoader bgColor={ThemeConstants.dark.backgroundColor} />
      )}
    </View>
  );
};

export default memo(ImagePreview);
