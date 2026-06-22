import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FastImage from 'react-native-fast-image';
import FeatherIcon from 'react-native-vector-icons/Feather';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import { useTheme } from '@react-navigation/native';
import { ambiApi } from '../models/AmbiApi';
import HRLine from './HRLine';
import debounce from './utils/debounce';

const Container = styled(View)`
  align-items: center;
  flex-direction: ${({ previewInline }) => (previewInline ? 'row' : 'column')};
  justify-content: center;
  overflow: hidden;
`;

const CreatedPreviewWrapper = styled(TouchableOpacity)`
  width: 100%;
  overflow: hidden;
  max-width: 100%;
  margin-top: 5px;
  flex-direction: ${({ previewInline }) => (previewInline ? 'row' : 'column')};
`;

const CreatedPreviewInfoWrapper = styled(View)`
  flex: 1;
  padding-bottom: 10px;
  justify-content: space-evenly;
`;

const CreatedPreviewImage = styled(FastImage)`
  border-radius: 8px;
  margin-bottom: 12px;
`;

const CreatedPreviewInfo = styled(Text)`
  padding: 2px 0;
`;

const CreatedPreviewTitle = styled(Text)`
  width: 100%;
  font-size: 14px;
  font-family: Circular-Bold;
  line-height: 20px;
  margin-bottom: 4px;
`;

const CreatedPreviewUrl = styled(Text)`
  font-size: 14px;
  line-height: 20px;
  font-family: Circular-Book;
`;

const WrapperImage = styled(View)`
  position: relative;
`;

const WrapperInfo = styled(View)`
  flex: 1;
  position: relative;
`;

const Icon = styled(FeatherIcon)`
  color: #1d2129;
  margin: 5px;
`;

const RemoveBtnContainer = styled(View)`
  top: 10px;
  left: 10px;
  position: absolute;
  border-radius: 50px;
  background-color: white;
`;

const InfoCloseIcon = styled(FeatherIcon)``;

const PreviewImage = styled(FastImage)`
  margin-right: ${({ previewInline }) => (previewInline ? '12px' : 'auto')};
  border-radius: 8px;
`;

const PreviewTitle = styled(Text)`
  flex: 1;
  margin: 5px 0;
  font-size: 16px;
  font-family: Circular-Bold;
`;

const PreviewDescription = styled(Text)`
  margin: 5px 0;
  overflow: visible;
  font-size: ${({ previewInline }) => (previewInline ? '14px' : '16px')};
  font-family: Circular-Book;
`;

let oldUrlLinkpreview = null;

const LinkPreview = ({
  containedIn,
  textContent,
  linkPreviewProps,
  handleLinkPreview,
  isCreatedPreview
}) => {
  const [showImage, setImageVisibility] = useState(!!linkPreviewProps.image);
  const [showInfo, setInfoVisibility] = useState(!!linkPreviewProps.title);

  const [isZoomLink, setIsZoomLink] = useState(!!linkPreviewProps.title);
  const previewInline = isZoomLink || containedIn === 'comment';

  const getLinkPreview = async () => {
    try {
      // Todo: check for other alternatives than regex.
      const regex = new RegExp(
        '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?'
      );

      const links = textContent.match(regex);
      const oldLinks = `${oldUrlLinkpreview}`.match(regex);

      // this if resolve bug reload url
      if (links && oldLinks && links[0] === oldLinks[0]) {
        return;
      }

      if (links && links.length > 0) {
        let link = links[0];
        if (link.substring(0, 4).toLowerCase() !== 'http') {
          link = `https://${link}`;
        }
        const res = await ambiApi.getFromApi(`/posts/preview?url=${link}`);
        if (res && res.data && res.data.title) {
          const isZoom = link.includes('.zoom.us');
          setIsZoomLink(isZoom);
          if (isZoom && !res.data.image) {
            const zoomData = await ambiApi.getFromApi(
              `/posts/preview?url=https://zoom.us`
            );
            handleLinkPreview({ ...res.data, image: zoomData?.data?.image });
          } else {
            handleLinkPreview(res.data);
          }
          oldUrlLinkpreview = res.data?.url;
          setInfoVisibility(true);
        }
      } else {
        handleLinkPreview({});
      }
    } catch (err) {
      console.warn('error fetching link preview', err);
    }
  };

  useEffect(() => {
    setImageVisibility(!!linkPreviewProps.image);
    setInfoVisibility(!!linkPreviewProps.title);
  }, [linkPreviewProps]);

  useEffect(() => {
    if (!isCreatedPreview && !showInfo && textContent) {
      debounce(getLinkPreview(), 200);
    }
  }, [textContent]);

  useEffect(() => {
    if (linkPreviewProps.image) {
      handleLinkPreview(linkPreviewProps);
      setImageVisibility(true);
    }
  }, [linkPreviewProps.image]);

  const { image, description, title, url } = linkPreviewProps;

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  let fontSize = 16;
  let imageStyle = {
    width: '100%',
    maxWidth: '100%',
    height: 180
  };

  if (isZoomLink) {
    imageStyle = {
      width: 135,
      height: 100,
      maxWidth: 135,
      marginRight: 12
    };
  } else if (containedIn === 'comment') {
    fontSize = 14;
    imageStyle = {
      width: 80,
      height: 100,
      maxWidth: 80,
      marginRight: 5
    };
  }

  return (
    <>
      {isCreatedPreview && (image || title) && url && (
        <>
          <HRLine styles={{ marginBottom: 15, marginTop: 15 }} fullWidth />
          <CreatedPreviewWrapper
            onPress={() => {
              InAppBrowser.open(url);
            }}
            previewInline={previewInline}
          >
            {showImage && !!image && (
              <CreatedPreviewImage
                style={imageStyle}
                source={{ uri: image }}
                previewInline={previewInline}
              />
            )}
            <CreatedPreviewInfoWrapper previewInline={previewInline}>
              <CreatedPreviewTitle
                style={{ color: themeColors.textPrimary }}
                numberOfLines={1}
              >
                {title}
              </CreatedPreviewTitle>
              <CreatedPreviewInfo
                style={{ color: themeColors.slateGray, fontSize }}
                previewInline={previewInline}
                numberOfLines={2}
              >
                {description}
              </CreatedPreviewInfo>
              <CreatedPreviewUrl
                style={{ color: themeColors.slateGray }}
                numberOfLines={1}
              >
                {url}
              </CreatedPreviewUrl>
            </CreatedPreviewInfoWrapper>
          </CreatedPreviewWrapper>
        </>
      )}
      {
        // for comments composer type === create
        !isCreatedPreview && (
          <>
            {title && (showImage || showInfo) && (
              <HRLine styles={{ marginBottom: 15, marginTop: 15 }} fullWidth />
            )}
            <Container previewInline={previewInline}>
              {showImage && !!image && true && (
                <WrapperImage previewInline={previewInline} style={imageStyle}>
                  <PreviewImage
                    style={imageStyle}
                    source={{ uri: image.linkImage || image }}
                    previewInline={previewInline}
                  />
                  {!isCreatedPreview && (
                    <RemoveBtnContainer>
                      <Icon
                        name="x"
                        size={16}
                        color={themeColors.textPrimary}
                        onPress={() => {
                          const updatedLinkPreview = {
                            ...linkPreviewProps,
                            image: null
                          };
                          setImageVisibility(false);
                          handleLinkPreview(updatedLinkPreview);
                        }}
                      />
                    </RemoveBtnContainer>
                  )}
                </WrapperImage>
              )}
              {showInfo && (
                <WrapperInfo>
                  <View
                    style={{
                      width: '95%',
                      alignItems: 'center',
                      flexDirection: 'row'
                    }}
                  >
                    {showInfo && (!showImage || !image) && (
                      <Icon
                        name="x"
                        size={25}
                        color={themeColors.textPrimary}
                        onPress={() => {
                          setInfoVisibility(false);
                          handleLinkPreview({});
                        }}
                      />
                    )}
                    <PreviewTitle
                      style={{ color: themeColors.darkGreenColor }}
                      numberOfLines={1}
                    >
                      {title}
                    </PreviewTitle>
                    {!showImage && (
                      <InfoCloseIcon
                        name="x"
                        type="info"
                        size={24}
                        color={themeColors.body}
                        onPress={() => {
                          setInfoVisibility(false);
                          handleLinkPreview({});
                        }}
                      />
                    )}
                  </View>
                  <PreviewDescription
                    style={{ color: themeColors.slateGray, fontSize }}
                    previewInline={previewInline}
                    numberOfLines={2}
                  >
                    {description}
                  </PreviewDescription>
                  <CreatedPreviewUrl
                    style={{ color: themeColors.slateGray }}
                    numberOfLines={1}
                  >
                    {url}
                  </CreatedPreviewUrl>
                </WrapperInfo>
              )}
            </Container>
          </>
        )
      }
    </>
  );
};

LinkPreview.propTypes = {
  containedIn: PropTypes.oneOf(['post', 'comment']),
  textContent: PropTypes.string,
  linkPreviewProps: PropTypes.shape({}),
  handleLinkPreview: PropTypes.func,
  isCreatedPreview: PropTypes.bool
};

LinkPreview.defaultProps = {
  containedIn: 'post',
  textContent: '',
  linkPreviewProps: {},
  handleLinkPreview: () => {},
  isCreatedPreview: false
};

export default LinkPreview;
