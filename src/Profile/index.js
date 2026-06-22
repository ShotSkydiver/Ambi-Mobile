/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { Text, View, StatusBar, Alert } from 'react-native';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';
import { connect, useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import RNPhotoLibraryAssets from 'react-native-photo-library-assets';
import { v4 as uuid } from 'uuid';
import i18n from 'format-message';
import {
  connectActionSheet,
  useActionSheet
} from '@expo/react-native-action-sheet';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {
  IconHeaderButtons,
  Item,
  HiddenItem,
  OverflowMenu
} from '../shared/HeaderButtons';
import Feed from '../Feed';
import { AUTH_ACTION_TYPES } from '../Auth/redux/actionTypes';
import { normalizeUser } from './utils';
import uploadFile from '../shared/utils/uploadFile';
import UserService from './UserService';
import Avatar from '../shared/Avatars';
import { FullScreenLoader } from '../shared/Loader';
import EmptyState from '../shared/EmptyState';
import { updateCurrentUserInView } from './redux/actions';
import { newsfeedType } from '../Feed/enums';
import { DEVICE_HEIGHT, DEFAULT_COLORS } from '../shared/constants';
import {
  ThemeConstants,
  ShadowStyles,
  AmbiColors
} from '../shared/contexts/themeContext';

const HeaderPicName = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;
const Name = styled(Text)`
  font-family: Circular-Bold;
  font-size: 20px;
  margin-left: 20px;
`;

const Profile = ({
  navigation,
  route,
  currentUser,
  updateCurrentUserInView
}) => {
  const userInView = route?.params?.user;
  const headerHeight = route.params?.headerHeight || 220;
  const isSelf = userInView?.id === currentUser.id;
  const user = isSelf ? currentUser : userInView;

  const { showActionSheetWithOptions } = useActionSheet();
  const dispatch = useDispatch();

  const { coverBannerUrl, avatarUrl, displayName, avatarMedia, id } =
    normalizeUser(user);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadingText, setUploadingText] = useState(
    'Uploading cover photo...'
  );
  const [newProfilePic, setNewProfilePic] = useState(avatarMedia || avatarUrl);
  const [newCoverPhoto, setNewCoverPhoto] = useState(coverBannerUrl || '');

  const onProfileImagePress = () => {
    navigation.navigate('NativeModalNavigator', {
      screen: 'ImagePreviewScreen',
      params: {
        images: [{ links: { content: avatarMedia || avatarUrl } }]
      }
    });
  };

  const updateUserProfile = async (result, isCoverBanner) => {
    const updateParams = isCoverBanner
      ? { coverBannerMediaId: result.data.id }
      : { avatarMediaId: result.data.id };
    const userProfileToUpdate = {
      ...user.profile,
      ...updateParams
    };
    try {
      const updatedUserProfile = await UserService.updateUserProfile(
        userProfileToUpdate
      );
      const updatedUser = { ...user, profile: updatedUserProfile };

      dispatch({
        type: AUTH_ACTION_TYPES.LOGGED_IN,
        user: updatedUser
      });
    } catch (err) {
      setIsUploading(false);
      console.warn(
        `error updating user ${
          isCoverBanner ? 'background cover' : 'profile picture'
        }: `,
        err
      );
    }
    setIsUploading(false);
  };

  const updateProfilePicOrCover = async (pic, isCoverBanner) => {
    try {
      await uploadFile({
        url: '/users/media',
        file: pic,
        events: {
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
          onUploadFinished: ({ name, result }) => {
            setUploadingText(`Finished uploading ${name}!`);
            updateUserProfile(result, isCoverBanner);
          }
        }
      });
    } catch (err) {
      console.warn('error updating user profile: ', err);
      setIsUploading(false);
    }
  };

  const openImagePicker = async isCoverBanner => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        cropperCircleOverlay: !isCoverBanner,
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

      if (image) {
        setIsUploading(true);
        setUploadingText('Processing image...');
        const imageUri = await RNPhotoLibraryAssets.getImageForAsset(
          image.localIdentifier
        );
        const processedImage = {
          ...image,
          path: imageUri,
          filename: image.filename || image.name,
          type: image.type || image.mime,
          uniqueIdentifier: uuid()
        };

        if (isCoverBanner) {
          setNewCoverPhoto(processedImage.path);
        } else {
          setNewProfilePic(processedImage.path);
        }
        await updateProfilePicOrCover(processedImage, isCoverBanner);
      }
    } catch (err) {
      setIsUploading(false);
      if (isCoverBanner) {
        setNewCoverPhoto(coverBannerUrl);
      } else {
        setNewProfilePic(avatarMedia || avatarUrl);
      }
      if (err.code && err.code !== 'E_PICKER_CANCELLED') {
        console.error(err.code, err.message);
      }
    }
  };

  const openCamera = async isCoverBanner => {
    try {
      const image = await ImagePicker.openCamera({
        waitAnimationEnd: false
      });
      if (image) {
        if (isCoverBanner) {
          setNewCoverPhoto(image.path);
        } else {
          setNewProfilePic(image.path);
        }
        await updateProfilePicOrCover(image, isCoverBanner);
      }
    } catch (err) {
      setIsUploading(false);
      if (isCoverBanner) {
        setNewCoverPhoto(coverBannerUrl);
      } else {
        setNewProfilePic(avatarMedia || avatarUrl);
      }
      if (err.code && err.code !== 'E_PICKER_CANCELLED') {
        console.warn(err.code, err.message);
      }
    }
  };

  const onPhotoActionSheetSelection = (index, isCoverBanner) => {
    if (index === 0) {
      ImagePicker.clean();
      openImagePicker(isCoverBanner);
    } else if (index === 1) {
      ImagePicker.clean();
      openCamera(isCoverBanner);
    }
  };

  const showPhotoActionSheet = isCoverBanner => {
    const optionsToShow = ['Photo Library', 'Take Photo', 'Cancel'];
    showActionSheetWithOptions(
      {
        options: optionsToShow,
        cancelButtonIndex: 2,
        tintColor: AmbiColors.ambiBlue
      },
      buttonIndex => {
        onPhotoActionSheetSelection(buttonIndex, isCoverBanner);
      }
    );
  };

  const hasProfilePic = !!(avatarMedia || avatarUrl);

  const onActionSheetSelection = async index => {
    try {
      showPhotoActionSheet(index === 1);
    } catch (err) {
      console.error(err);
    }
  };

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  useEffect(() => {
    updateCurrentUserInView(user);
    const showActionSheet = ({ hiddenButtons }) => {
      const optionsToShow = [
        `${hasProfilePic ? 'Change' : 'Add'} Profile Picture`,
        `${coverBannerUrl ? 'Change' : 'Add'} Cover Banner`,
        'Cancel'
      ];
      showActionSheetWithOptions(
        {
          options: optionsToShow,
          cancelButtonIndex: 2,
          title: 'Profile Options',
          tintColor: AmbiColors.ambiBlue
        },
        buttonIndex => {
          if (buttonIndex !== 2) {
            hiddenButtons[buttonIndex].onPress();
          }
        }
      );
    };
    navigation.setOptions({
      headerLeft: () => {
        return (
          <IconHeaderButtons useLeftHeader>
            <Item
              title="Close"
              iconName="close"
              color={ThemeConstants.dark.textPrimary}
              onPress={() => {
                navigation.pop();
              }}
              manualInset
              style={{
                ...ShadowStyles.buttonsAndText
              }}
            />
          </IconHeaderButtons>
        );
      },
      headerRight: () => {
        return (
          isSelf && (
            <IconHeaderButtons useLeftHeader>
              <OverflowMenu
                onPress={showActionSheet}
                style={{
                  marginTop: 0,
                  marginRight: 16
                }}
                OverflowIcon={
                  <MaterialIcon
                    name="more-horiz"
                    size={25}
                    color={ThemeConstants.dark.textPrimary}
                    style={{
                      ...ShadowStyles.buttonsAndText
                    }}
                  />
                }
              >
                <HiddenItem
                  title={`${hasProfilePic ? 'Change' : 'Add'} Profile Picture`}
                  color={themeColors.textPrimary}
                  iconName="cloud-upload"
                  onPress={() => onActionSheetSelection(0)}
                />
                <HiddenItem
                  title={`${coverBannerUrl ? 'Change' : 'Add'} Cover Banner`}
                  color={themeColors.textPrimary}
                  iconName="cloud-upload"
                  onPress={() => onActionSheetSelection(1)}
                />
              </OverflowMenu>
            </IconHeaderButtons>
          )
        );
      },
      headerTitleContainerStyle: { top: 50 }
    });
  }, []);

  useEffect(() => {
    const backgroundCover = newCoverPhoto || coverBannerUrl;
    const profilePicture = newProfilePic || avatarMedia || avatarUrl;
    navigation.setOptions({
      headerBackground: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            padding: 0,
            height: 220,
            backgroundColor: themeColors.elementBGColor
          }}
        >
          <FastImage
            style={{
              flex: 1,
              height: 220,
              opacity: 0.6,
              backgroundColor: !backgroundCover
                ? DEFAULT_COLORS[id % DEFAULT_COLORS.length]
                : themeColors.elementBGColor
            }}
            source={{ uri: backgroundCover || '' }}
            noBanner={!coverBannerUrl}
            id={id}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      ),
      headerTitle: () => (
        <HeaderPicName>
          <Avatar
            style={({ paddingBottom: 14 }, ShadowStyles.buttonsAndText)}
            size={100}
            url={profilePicture}
            onPress={onProfileImagePress}
          />
          <Name
            style={{
              ...ShadowStyles.buttonsAndText,
              color: ThemeConstants.dark.textPrimary
            }}
          >
            {displayName}
          </Name>
        </HeaderPicName>
      )
    });
  }, [newCoverPhoto, newProfilePic]);

  const feedType = isSelf ? newsfeedType.PERSONAL : newsfeedType.OTHER_USER;

  return (
    <View style={{ flex: 1 }}>
      <Feed
        newsfeedType={feedType}
        navigation={navigation}
        hostInfo={user}
        headerHeight={headerHeight}
        emptyComponent={
          <EmptyState
            style={{ marginTop: DEVICE_HEIGHT / 8 }}
            title={i18n('No Posts here!')}
          />
        }
      />
      {isUploading && (
        <FullScreenLoader
          text={uploadingText}
          bgColor={themeColors.backgroundColor}
        />
      )}
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        animated
      />
    </View>
  );
};

const ConnectedProfile = connectActionSheet(Profile);
export default connect(
  state => ({
    currentUser: state.auth.user
  }),
  { updateCurrentUserInView }
)(ConnectedProfile);
