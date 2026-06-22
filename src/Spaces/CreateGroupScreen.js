/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  StatusBar
} from 'react-native';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActionSheet } from '@expo/react-native-action-sheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RNPhotoLibraryAssets from 'react-native-photo-library-assets';
import { v4 as uuid } from 'uuid';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';
import { createSpace, addMemberToSpace } from './redux/actions';
import SpacesService from './SpacesService';
import RadioButton from '../shared/RadioButton';
import Avatar from '../shared/Avatars';
import HRLine from '../shared/HRLine';
import { FullScreenLoader } from '../shared/Loader';
import { IS_ANDROID } from '../shared/constants';
import { AmbiColors } from '../shared/contexts/themeContext';
import { IconHeaderButtons, Item } from '../shared/HeaderButtons';

const Container = styled(KeyboardAvoidingView)`
  flex: 1;
`;

const CreateGroupContainer = styled(ScrollView)``;

const SectionHeader = styled(View)`
  padding-bottom: 8px;
`;
const SectionTitle = styled(Text)`
  font-size: 16px;
  font-family: Circular-Bold;
  line-height: 20px;
`;

const BannerAndName = styled(View)`
  height: 166px;
  align-items: center;
  margin-bottom: 6px;
  justify-content: center;
  border-top-width: ${StyleSheet.hairlineWidth};
  border-bottom-width: ${StyleSheet.hairlineWidth};
`;
const Banner = styled(TouchableOpacity)`
  width: 80px;
  height: 80px;
  border: 2px solid #ced1d9;
  align-items: center;
  border-radius: 8px;
  margin-bottom: 16px;
  justify-content: center;
`;

const BannerImage = styled(Image)`
  width: 80px;
  height: 80px;
  border-radius: 8px;
`;

const NameInput = styled(TextInput)`
  width: 80%;
  padding: 0px 0px 8px 0px;
  font-size: 16px;
  text-align: center;
  font-family: Circular-Book;
`;

const Wrapper = styled(View)`
  padding: 10px 16px;
  border-top-width: ${StyleSheet.hairlineWidth};
  border-bottom-width: ${StyleSheet.hairlineWidth};
`;

const DescriptionWrapper = styled(Wrapper)`
  min-height: 90px;
  margin-bottom: 6px;
`;

const DescriptionInput = styled(TextInput)`
  padding: 16px 0 6px 16px;
  font-size: 14px;
  font-family: Circular-Book;
  line-height: 18px;
`;

const InviteUsersWrapper = styled(Wrapper)`
  min-height: 90px;
  margin-bottom: 6px;
`;

const InvitedUsers = styled(TouchableOpacity)`
  padding: 16px 0 6px 16px;
  flex-direction: row;
`;

const InviteUsersPlaceholder = styled(View)`
  align-items: center;
  flex-direction: row;
`;
const UserImage = styled(Avatar)`
  margin-right: 8px;
`;

const PlaceholderText = styled(Text)`
  font-size: 14px;
  font-family: Circular-Book;
  margin-left: 12px;
  line-height: 18px;
`;

const PrivacyWrapper = styled(Wrapper)``;
const PrivacyOptionsWrapper = styled(View)`
  padding: 12px 32px 0px 32px;
  align-items: center;
  margin-bottom: 4px;
`;
const PrivacyOption = styled(View)`
  margin: 12px 0;
  padding: 0 16px;
  flex-direction: row;
  justify-content: space-between;
`;
const OptionInfo = styled(View)`
  width: 100%;
  margin: 0 16px 0 8px;
`;

const OptionTitle = styled(SectionTitle)``;
const OptionDesc = styled(Text)`
  opacity: 0.6;
  font-size: 12px;
  margin-top: 4px;
  line-height: 15px;
  font-family: Circular-Book;
`;

const EditUsers = styled(View)`
  width: 40;
  height: 40;
  border-width: 2px;
  align-items: center;
  border-radius: 20px;
  justify-content: center;
`;

const privacyOptions = [
  {
    title: i18n('Public'),
    icon: 'globe',
    description: i18n(
      `Anyone on the network can discover, join, and see posts and content inside this group.`
    )
  },
  {
    title: i18n('Private'),
    icon: 'lock',
    description: i18n(
      `Anyone on the network can discover and request to join, but must be approved by a group admin to join and view this groups posts and content.`
    )
  },
  {
    title: i18n('Secret'),
    icon: 'eye-off',
    description: i18n(
      'No one on the network can freely discover or request to join this group, members may only join if invited first.'
    )
  }
];

const CreateGroupScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const initialGroupInfo = {
    name: '',
    description: '',
    coverBannerMedia: null,
    isPrivate: false,
    isSecret: false
  };
  const [groupInfo, setGroupInfo] = useState(initialGroupInfo);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [privacy, setPrivacy] = useState('Public');
  const [showLoader, toggleLoader] = useState(false);

  const { showActionSheetWithOptions } = useActionSheet();

  const { coverBannerMedia } = groupInfo;
  const spaceType = 'group';

  const newInvitedUsers = route.params?.invitedUsers || [];

  const createGroup = async () => {
    try {
      toggleLoader(true);
      const newGroup = await createSpace(groupInfo, spaceType)(dispatch);
      const members = await SpacesService.getSpaceMembers(
        newGroup.id,
        spaceType
      );
      newGroup.members = members;
      await Promise.all(
        invitedUsers.map(async member => {
          try {
            if (member) {
              await addMemberToSpace(newGroup, spaceType, member)(dispatch);
            }
          } catch (err) {
            console.error(err);
          }
        })
      );
      toggleLoader(false);
      navigation.pop();
      navigation.navigate('Space', {
        spaceItem: newGroup,
        isFromCreation: true
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setInvitedUsers(newInvitedUsers);
  }, [newInvitedUsers.length]);

  useEffect(() => {
    const groupName = groupInfo.name;
    const allowCreate = groupName && groupName.length > 0;
    const onPress = () => {
      if (allowCreate) {
        createGroup();
      }
    };
    navigation.setOptions({
      headerRight: () => {
        return (
          <IconHeaderButtons useLeftHeader>
            <Item
              title="Create"
              color={AmbiColors.ambiBlue}
              onPress={onPress}
              disabled={!allowCreate}
              actionable
            />
          </IconHeaderButtons>
        );
      }
    });
  }, [groupInfo.name, invitedUsers]);

  useEffect(() => {
    return () => {
      if (groupInfo.coverBannerMedia) {
        ImagePicker.clean();
      }
      setGroupInfo(initialGroupInfo);
    };
  }, []);

  const setGroupName = name => setGroupInfo({ ...groupInfo, name });
  const setGroupDescription = description =>
    setGroupInfo({ ...groupInfo, description });

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
        const imageUri = await RNPhotoLibraryAssets.getImageForAsset(
          banner.localIdentifier
        );
        const processedBanner = {
          ...banner,
          path: imageUri,
          filename: banner.filename || banner.name,
          type: banner.type || banner.mime,
          uniqueIdentifier: uuid()
        };

        setGroupInfo({
          ...groupInfo,
          coverBannerMedia: processedBanner.path
        });
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
        cropping: true,
        mediaType: 'photo',
        waitAnimationEnd: false
      });
      if (banner) {
        console.warn('camera: ', banner);
        setGroupInfo({
          ...groupInfo,
          coverBannerMedia: banner.path
        });
      }
    } catch (err) {
      if (err.code && err.code !== 'E_PICKER_CANCELLED') {
        console.warn(err.code, err.message);
      }
    }
  };

  const onActionSheetSelection = (index, hasExistingPhoto) => {
    if (index === 0) {
      ImagePicker.clean();
      openImagePicker();
    } else if (index === 1) {
      ImagePicker.clean();
      openCamera();
    } else if (index === 2 && hasExistingPhoto) {
      ImagePicker.clean();
      setGroupInfo({
        ...groupInfo,
        coverBannerMedia: null
      });
    }
  };

  const showActionSheet = hasExistingPhoto => {
    const optionsToShow = hasExistingPhoto
      ? ['Photo Library', 'Take Photo', 'Remove Existing Photo', 'Cancel']
      : ['Photo Library', 'Take Photo', 'Cancel'];
    showActionSheetWithOptions(
      {
        options: optionsToShow,
        destructiveButtonIndex: hasExistingPhoto ? 2 : undefined,
        cancelButtonIndex: hasExistingPhoto ? 3 : 2,
        title: `${hasExistingPhoto ? 'Modify' : 'Add'} Cover Photo`,
        message: 'Change the cover photo for this group',
        tintColor: AmbiColors.ambiBlue
      },
      buttonIndex => {
        onActionSheetSelection(buttonIndex, hasExistingPhoto);
      }
    );
  };

  const navigateToInviteUsers = () => {
    navigation.navigate('InviteUsersScreen', {
      type: spaceType,
      newCreation: true,
      invitedUsers
    });
  };

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <Container behavior={IS_ANDROID ? 'height' : 'padding'}>
      <SafeAreaView
        style={{ backgroundColor: themeColors.backgroundColor, flex: 1 }}
        mode="padding"
        edges={['right', 'bottom', 'left']}
      >
        <CreateGroupContainer
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          {showLoader && (
            <FullScreenLoader text={i18n('Creating your group now...')} />
          )}
          <BannerAndName
            style={{
              backgroundColor: themeColors.elementBGColor,
              borderBottomColor: themeColors.systemBorderColor,
              borderTopColor: themeColors.systemBorderColor
            }}
          >
            <Banner
              onPress={() => showActionSheet(coverBannerMedia !== null)}
              style={{
                borderColor: themeColors.disabled
              }}
            >
              {coverBannerMedia != null ? (
                <BannerImage source={{ uri: coverBannerMedia }} />
              ) : (
                <FeatherIcon
                  name="image"
                  size={24}
                  color={themeColors.disabled}
                />
              )}
            </Banner>
            <NameInput
              textAlign="center"
              placeholder={i18n('Name your group')}
              onChangeText={setGroupName}
              autoCapitalize="words"
              returnKeyType="done"
              placeholderTextColor={themeColors.textPrimaryInactive}
              style={{
                color: themeColors.textPrimary,
                borderBottomColor: themeColors.systemBorderColor,
                borderBottomWidth: StyleSheet.hairlineWidth
              }}
            />
          </BannerAndName>

          <DescriptionWrapper
            style={{
              backgroundColor: themeColors.elementBGColor,
              borderTopColor: themeColors.systemBorderColor,
              borderBottomColor: themeColors.systemBorderColor
            }}
          >
            <SectionHeader>
              <SectionTitle style={{ color: themeColors.textPrimary }}>
                {i18n('description')}
              </SectionTitle>
            </SectionHeader>
            <HRLine opacity={0.8} fullWidth />
            <DescriptionInput
              multiline
              placeholder={i18n('Enter a description…')}
              placeholderTextColor={themeColors.textPrimaryInactive}
              style={{
                color: themeColors.textPrimary
              }}
              onChangeText={setGroupDescription}
            />
          </DescriptionWrapper>

          <InviteUsersWrapper
            style={{
              backgroundColor: themeColors.elementBGColor,
              borderTopColor: themeColors.systemBorderColor,
              borderBottomColor: themeColors.systemBorderColor
            }}
          >
            <SectionHeader>
              <SectionTitle style={{ color: themeColors.textPrimary }}>
                {i18n('invite members')}
              </SectionTitle>
            </SectionHeader>
            <HRLine opacity={0.8} fullWidth />
            <InvitedUsers onPress={navigateToInviteUsers}>
              {invitedUsers.length === 0 ? (
                <InviteUsersPlaceholder>
                  <FeatherIcon
                    name="user-plus"
                    size={24}
                    color={themeColors.textPrimaryInactive}
                  />
                  <PlaceholderText style={{ color: themeColors.slateGray }}>
                    {i18n('Add members to invite')}
                  </PlaceholderText>
                </InviteUsersPlaceholder>
              ) : (
                <InviteUsersPlaceholder>
                  {invitedUsers.map(user => {
                    const userAvatarMedia =
                      typeof user.avatarMedia === 'string'
                        ? JSON.parse(user.avatarMedia)
                        : user.avatarMedia;
                    const avatarUrl =
                      userAvatarMedia && userAvatarMedia.links
                        ? userAvatarMedia.links.content
                        : user.avatarUrl;
                    return (
                      <UserImage url={avatarUrl} size={40} key={user.id} />
                    );
                  })}
                  <EditUsers style={{ borderColor: themeColors.disabled }}>
                    <FeatherIcon
                      name="edit-2"
                      size={20}
                      color={themeColors.slateGray}
                      onPress={navigateToInviteUsers}
                    />
                  </EditUsers>
                </InviteUsersPlaceholder>
              )}
            </InvitedUsers>
          </InviteUsersWrapper>

          <PrivacyWrapper
            style={{
              backgroundColor: themeColors.elementBGColor,
              borderTopColor: themeColors.systemBorderColor,
              borderBottomColor: themeColors.systemBorderColor
            }}
          >
            <SectionHeader>
              <SectionTitle style={{ color: themeColors.textPrimary }}>
                {i18n('privacy')}
              </SectionTitle>
            </SectionHeader>
            <HRLine opacity={0.8} fullWidth />
            <PrivacyOptionsWrapper>
              {privacyOptions.map(({ title, icon, description }) => {
                const isPrivate = title === i18n('Private');
                const isSecret = title === 'Secret';
                const isActive = privacy === title;
                return (
                  <PrivacyOption key={title}>
                    <FeatherIcon
                      name={icon}
                      size={24}
                      style={{ color: themeColors.textPrimaryInactive }}
                    />
                    <OptionInfo>
                      <OptionTitle style={{ color: themeColors.textPrimary }}>
                        {title}
                      </OptionTitle>
                      <OptionDesc style={{ color: themeColors.textPrimary }}>
                        {description}
                      </OptionDesc>
                    </OptionInfo>
                    <RadioButton
                      onPress={() => {
                        setGroupInfo({ ...groupInfo, isPrivate, isSecret });
                        setPrivacy(title);
                      }}
                      isActive={isActive}
                    />
                  </PrivacyOption>
                );
              })}
            </PrivacyOptionsWrapper>
          </PrivacyWrapper>
        </CreateGroupContainer>
      </SafeAreaView>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        animated
        translucent
      />
    </Container>
  );
};

export default CreateGroupScreen;
