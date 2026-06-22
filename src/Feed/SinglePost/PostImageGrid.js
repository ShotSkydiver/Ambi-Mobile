import React, { Fragment, memo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import FastImage from 'react-native-fast-image';

const ImageGridContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: ${({ numImages }) =>
    numImages > 1 ? 'space-between' : 'center'};
  padding-top: 16px;
`;

const PostImage = styled(FastImage)`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  border-radius: 7px;
  margin-bottom: 8px;
`;

const ImagesWrapper = styled(View)`
  width: 100%;
  height: 208px;
  margin-left: 10px;
`;

const ImageOverlayText = styled(Text)`
  color: white;
  font-family: Circular-Book;
  font-size: 24px;
  line-height: 30px;
  position: absolute;
  top: 140px;
  left: 60px;
`;

const styles = StyleSheet.create({
  imageOverlayText: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: 0,
      height: 0
    },
    textShadowRadius: 3
  }
});

const ImageGrid = ({ images, navigation }) => {
  const numImages = images.length;
  const width = numImages > 1 ? 168 : 320;

  const firstImage = images[0];
  const nextTwoImages = numImages > 2 ? [images[1], images[2]] : [];

  const secondImage = numImages === 2 && images[1];
  const remainingImages = numImages > 3 ? images.slice(3, numImages) : [];

  const navigateToImagePreviewScreen = img => () =>
    navigation.navigate('NativeModalNavigator', {
      screen: 'ImagePreviewScreen',
      params: {
        images,
        selectedImage: { url: img.links.content }
      }
    });

  const getImgUrl = img => {
    if (numImages === 1) {
      return img.links.image_320_208 || img.links.content;
    }
    return img.links.image_168_208 || img.links.content;
  };

  const ImageView = ({ img, height }) => (
    <TouchableOpacity onPress={navigateToImagePreviewScreen(img)}>
      <PostImage
        source={{
          uri: img.links ? getImgUrl(img) : img.path,
          priority: FastImage.priority.normal
        }}
        width={width}
        height={height}
        resizeMode={FastImage.resizeMode.cover}
      />
    </TouchableOpacity>
  );

  return (
    <ImageGridContainer numImages={numImages}>
      {firstImage && <ImageView img={firstImage} height={208} />}
      {secondImage && <ImageView img={secondImage} height={200} />}
      {numImages > 2 && (
        <ImagesWrapper>
          {nextTwoImages.map((img, index) => {
            return (
              <Fragment key={img.id}>
                <ImageView img={img} height={100} />
                {remainingImages.length > 0 && index === 1 && (
                  <ImageOverlayText style={styles.imageOverlayText}>
                    + {remainingImages.length}
                  </ImageOverlayText>
                )}
              </Fragment>
            );
          })}
        </ImagesWrapper>
      )}
    </ImageGridContainer>
  );
};

export default memo(ImageGrid, () => true);
