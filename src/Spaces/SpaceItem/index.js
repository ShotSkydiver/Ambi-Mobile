/* eslint-disable react/display-name */
import React, { useEffect, useState, useRef } from 'react';
import { View, StatusBar, Text, Animated, Alert } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { useTheme, useIsFocused } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { useActionSheet } from '@expo/react-native-action-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import i18n from 'format-message';
import { throttle } from 'lodash';
import RNPhotoLibraryAssets from 'react-native-photo-library-assets';
import { v4 as uuid } from 'uuid';

import Avatar from '../../shared/Avatars';
import debounce from '../../shared/utils/debounce';
import { usePermissions } from '../../shared/hooks/usePermissions';
import { IconHeaderButtons, Item } from '../../shared/HeaderButtons';

import {
  deleteSpace,
  deleteSpaceMember,
  updateCurrentSpace
} from '../redux/actions';
import Feed from '../../Feed/index';
import NavigationButton from '../../shared/NavigationButton';
import CreatePostBox from '../../Feed/PostCreator/CreatePostBox';
import EmptyState from '../../shared/EmptyState';
import { DEVICE_HEIGHT, DEFAULT_COLORS } from '../../shared/constants';
import { FullScreenLoader } from '../../shared/Loader';
import { CHAT_TYPES } from '../../Chat/chatsReducer';
import VerifiedIcon from '../../shared/images/ic_verified.svg';
import SpacesService from '../SpacesService';
import { ShadowStyles, AmbiColors } from '../../shared/contexts/themeContext';

const StyledSpace = styled(View)`
  flex: 1;
`;

const StyledHeader = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding: 12px 16px;
  border-top-width: 0.5px;
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 16px;
`;

const StyledTextWrapper = styled(View)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const StyledTitle = styled(Text)`
  font-size: 18px;
  font-family: Circular-Bold;
  line-height: 24px;
`;

const StyledSubtitle = styled(Text)`
  opacity: 0.6;
  font-family: Circular-Book;
  font-size: 14px;
  line-height: 18px;
`;

const StyledIcon = styled(Text)`
  margin-top: 2px;
`;

const VerifiedWrapper = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  margin-top: 2px;
`;

const TextBtnHeader = styled(Item)`
  margin-left: -20px;
  font-weight: 300;
  letter-spacing: 0;
  line-height: 22px;
`;

const BANNER_HEIGHT = 220;

function Space({ navigation, route }) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const currentSpaceInView = useSelector(
    state => state.spaces?.currentSpaceInView
  );
  const spaceInfo = route.params?.spaceItem || currentSpaceInView;
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    if (spaceInfo && isFocused) {
      updateCurrentSpace(spaceInfo)(dispatch);
    }
  }, [spaceInfo, isFocused]);

  const {
    name,
    id,
    uniqueIdentifier,
    type,
    avatarMedia,
    avatarUrl,
    idParentSpace,
    verified,
    coverBannerMedia,
    coverBannerUrl
  } = spaceInfo;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadingText, setUploadingText] = useState(
    'Uploading cover photo...'
  );
  const [newCoverPhoto, setNewCoverPhoto] = useState(
    coverBannerMedia
      ? coverBannerMedia.links.image_656_250 || coverBannerMedia.links.content
      : coverBannerUrl
  );

  const scrollAnim = useRef(new Animated.Value(0)).current;
  const [scrollOffsetheight, setScrollOffsetHeight] = useState(0);

  const isCommunity = type === 'community';
  const isVerified = verified && verified.isVerified;
  const communityLogoUrl = avatarMedia
    ? avatarMedia.links.image_40_40 || avatarMedia.links.content
    : avatarUrl;
  const { showActionSheetWithOptions } = useActionSheet();
  const isClass = type === 'class';
  const isRelatedSpace = idParentSpace;
  const spaceTypeTitle = `${isRelatedSpace ? 'Related' : ''} ${type.replace(
    /^\w/,
    c => c.toUpperCase()
  )}`;
  const isVerifiedSpace = (isCommunity || isRelatedSpace) && isVerified;

  const { canPerform } = usePermissions({ scope: type, id });
  const isAdmin = canPerform('admin_space');
  const isMember =
    canPerform('view_space') &&
    canPerform('view_space_files') &&
    canPerform('like_post');

  const updateBanner = async banner => {
    const newCover = banner.path;
    setNewCoverPhoto(newCover);
    navigation.setParams({ newCoverPhoto: newCover });
    const updatedSpaceInfo = spaceInfo;

    const newBanner = await SpacesService.uploadMedia(
      updatedSpaceInfo.type.toLowerCase(),
      banner,
      {
        onUploadLoaded: () => {},
        onUploadStarted: () => {
          setIsUploading(true);
          setUploadingText('Uploading cover photo...');
        },
        onUploadProgress: ({ progress }) => {
          setUploadingText(`Uploading... ${progress}%`);
        },
        onUploadError: ({ name }) => {
          Alert.alert(
            `There was an error uploading ${name}! Please try again.`
          );
          setIsUploading(false);
        },
        onUploadFinished: ({ name }) => {
          setUploadingText(`Finished uploading ${name}!`);
        }
      }
    );
    updatedSpaceInfo.coverBannerMedia = newBanner
      ? newBanner.data
      : updatedSpaceInfo.coverBannerMedia;
    updatedSpaceInfo.coverBannerMediaId = newBanner ? newBanner.data.id : null;
    await updateCurrentSpace(updatedSpaceInfo, true)(dispatch);
    setIsUploading(false);
  };

  const openImagePicker = async () => {
    try {
      const banner = await ImagePicker.openPicker({
        cropping: true,
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
        ],
        mediaType: 'photo',
        sortOrder: 'asc',
        waitAnimationEnd: false
      });

      if (banner) {
        setIsUploading(true);
        setUploadingText('Processing image...');
        let imagePath = banner.path;
        if (!banner.sourceURL) {
          imagePath = await RNPhotoLibraryAssets.getImageForAsset(
            banner.localIdentifier
          );
        }
        const processedBanner = {
          ...banner,
          path: imagePath,
          filename: banner.filename || banner.name,
          type: banner.type || banner.mime,
          uniqueIdentifier: uuid()
        };

        updateBanner(processedBanner);
      }
    } catch (err) {
      if (err.code && err.code !== 'E_PICKER_CANCELLED') {
        console.error(err.code, err.message);
      }
    }
  };

  const openCamera = async () => {
    try {
      const banner = await ImagePicker.openCamera({
        waitAnimationEnd: false
      });
      if (banner) {
        updateBanner(banner);
      }
    } catch (err) {
      if (err.code && err.code !== 'E_PICKER_CANCELLED') {
        console.warn(err.code, err.message);
      }
    }
  };

  const onPhotoActionSheetSelection = index => {
    if (index === 0) {
      ImagePicker.clean();
      openImagePicker();
    } else if (index === 1) {
      ImagePicker.clean();
      openCamera();
    }
  };

  const showPhotoActionSheet = () => {
    const optionsToShow = ['Photo Library', 'Take Photo', 'Cancel'];
    showActionSheetWithOptions(
      {
        options: optionsToShow,
        cancelButtonIndex: 2,
        tintColor: AmbiColors.ambiBlue
      },
      buttonIndex => {
        onPhotoActionSheetSelection(buttonIndex);
      }
    );
  };

  const onActionSheetSelection = async index => {
    try {
      if (index === 0 && isAdmin) {
        showPhotoActionSheet();
      } else if (index === 0 && isMember && !isAdmin) {
        // first removing the space channel if exists.
        dispatch({
          type: CHAT_TYPES.REMOVE_CHANNEL,
          uniqueName: `${uniqueIdentifier}-${name}`
        });
        // now deleting the member from the space
        await deleteSpaceMember(id, type, currentUser)(dispatch);
        // and finally we're going away from the space to space list
        navigation.navigate('Spaces');
      } else if (index === 1 && isAdmin && !isClass) {
        // admin deleting the space
        navigation.navigate('Spaces');
        await deleteSpace(id, type)(dispatch);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  useEffect(() => {
    const backButtonHandler = () => {
      if (route.params?.parentSpace) {
        navigation.navigate('Space', {
          spaceItem: route.params?.parentSpace
        });
      } else if (route.params?.isFromCreation) {
        navigation.navigate('Spaces');
      } else {
        navigation.pop();
      }
    };
    navigation.setOptions({
      headerLeft: () => {
        return (
          <IconHeaderButtons useLeftHeader>
            <Item
              title="Back"
              iconName="chevron-left"
              color={themeColors.textPrimary}
              onPress={backButtonHandler}
              manualInset
              style={{
                ...ShadowStyles.buttonsAndText
              }}
            />
            <TextBtnHeader
              title="Back"
              color={themeColors.textPrimary}
              onPress={backButtonHandler}
              style={{
                ...ShadowStyles.buttonsAndText
              }}
            />
          </IconHeaderButtons>
        );
      }
    });
  }, []);

  useEffect(() => {
    const showActionSheet = () => {
      const adminOptionsToShow = [
        'Change Cover Photo',
        `Delete ${spaceTypeTitle}`,
        'Cancel'
      ];
      const memberOptionsToShow = [`Leave ${spaceTypeTitle}`, 'Cancel'];
      const classAdminOptionsToShow = ['Change Cover Photo', 'Cancel'];
      let optionsToShow = memberOptionsToShow;
      if (isAdmin) {
        optionsToShow = isClass ? classAdminOptionsToShow : adminOptionsToShow;
      }
      showActionSheetWithOptions(
        {
          options: optionsToShow,
          destructiveButtonIndex: isAdmin && !isClass ? 1 : 0,
          cancelButtonIndex: isAdmin ? 2 : 1,
          title: `${spaceTypeTitle} Settings`,
          tintColor: AmbiColors.ambiBlue
        },
        buttonIndex => {
          onActionSheetSelection(buttonIndex);
        }
      );
    };
    navigation.setOptions({
      headerRight: () => {
        if (!isMember) {
          return null;
        }
        return (
          <IconHeaderButtons useLeftHeader>
            <Item
              iconName="more-horiz"
              color={themeColors.textPrimary}
              style={{
                ...ShadowStyles.buttonsAndText,
                marginRight: 20
              }}
              onPress={showActionSheet}
            />
          </IconHeaderButtons>
        );
      }
    });
  }, [isMember, isAdmin]);

  useEffect(() => {
    const isHeaderCollapsed = scrollOffsetheight >= 160;
    navigation.setOptions({
      headerTitle: isHeaderCollapsed
        ? () => (
            <StyledTitle style={{ color: themeColors.textPrimary }}>
              {name}
            </StyledTitle>
          )
        : null,
      headerTitleAlign: isHeaderCollapsed ? 'center' : null
    });
  }, [scrollOffsetheight]);

  useEffect(() => {
    const backgroundImageURI = coverBannerMedia
      ? coverBannerMedia.links.image_656_250 || coverBannerMedia.links.content
      : coverBannerUrl;

    const bannerUrl = newCoverPhoto || backgroundImageURI;

    navigation.setOptions({
      headerBackground: () => (
        <Animated.View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            padding: 0,
            height: BANNER_HEIGHT,
            transform: [
              {
                translateY: scrollAnim.interpolate({
                  inputRange: [0, 60, 120, 180, 220],
                  outputRange: [0, -30, -60, -90, -120],
                  extrapolate: 'clamp'
                })
              }
            ],
            opacity: scrollAnim.interpolate({
              inputRange: [0, 60, 120, 180],
              outputRange: [0.6, 0.4, 0.2, 0],
              extrapolate: 'clamp'
            }),
            backgroundColor: themeColors.elementBGColor
          }}
        >
          <FastImage
            style={{
              flex: 1,
              height: BANNER_HEIGHT,
              backgroundColor: !bannerUrl
                ? DEFAULT_COLORS[id % DEFAULT_COLORS.length]
                : themeColors.elementBGColor
            }}
            source={{ uri: bannerUrl || '' }}
            noBanner={!bannerUrl}
            id={id}
            resizeMode={FastImage.resizeMode.cover}
          />
        </Animated.View>
      )
    });
  }, [newCoverPhoto]);

  // Note: navigation.push is pushing a single screen twice on Android.
  // Debouncing fixes that. We need push instead of navigate
  // because of the flow between parent-space and a related-space
  const navigateToDetails = debounce(() => {
    navigation.push('Details', {
      type,
      isRelatedSpace,
      spaceItem: spaceInfo
    });
  }, 10);

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: { contentOffset: { y: scrollAnim } }
      }
    ],
    {
      useNativeDriver: true,
      listener: throttle(e => {
        if (e?.nativeEvent?.contentOffset) {
          setScrollOffsetHeight(e.nativeEvent.contentOffset.y);
        }
      }, 500)
    }
  );

  const headerHeight = useHeaderHeight();

  return (
    <View style={{ flex: 1 }}>
      <StyledSpace>
        <Feed
          hidePageLoader
          navigation={navigation}
          newsfeedType={type}
          onScroll={handleScroll}
          hostInfo={spaceInfo}
          headerHeight={BANNER_HEIGHT - headerHeight}
          emptyComponent={
            <EmptyState
              style={{ marginTop: DEVICE_HEIGHT / 8 }}
              title={i18n('No Posts here!')}
            />
          }
          headerComponent={
            <>
              <StyledHeader
                style={{
                  backgroundColor: themeColors.elementBGColor,
                  borderTopColor: themeColors.systemBorderColor
                }}
              >
                {isCommunity && (
                  <StyledAvatar
                    size={52}
                    onPress={() => {}}
                    url={communityLogoUrl}
                    isSpaceDetails
                  />
                )}
                <StyledTextWrapper>
                  <StyledTitle style={{ color: themeColors.textPrimary }}>
                    {name}
                  </StyledTitle>
                  <VerifiedWrapper>
                    <StyledIcon>
                      {isVerifiedSpace && (
                        <VerifiedIcon width={18} height={18} />
                      )}
                    </StyledIcon>
                    <StyledSubtitle
                      style={{ color: themeColors.textPrimary }}
                    >{`${
                      isVerifiedSpace ? ' Verified ' : ''
                    }${spaceTypeTitle}`}</StyledSubtitle>
                  </VerifiedWrapper>
                </StyledTextWrapper>
              </StyledHeader>
              <NavigationButton
                title={i18n(`${spaceTypeTitle} Details`)}
                iconName="info"
                size="small"
                onPress={navigateToDetails}
              />
              <CreatePostBox
                navigation={navigation}
                route={route}
                newsfeedType={type}
                user={currentUser}
                hostInfo={spaceInfo}
              />
            </>
          }
        />
      </StyledSpace>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        animated
        translucent
      />
      {isUploading && <FullScreenLoader text={uploadingText} />}
    </View>
  );
}

export default Space;
