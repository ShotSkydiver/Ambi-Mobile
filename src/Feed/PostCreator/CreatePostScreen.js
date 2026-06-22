/**
 * CreatePostScreen
 */
/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  TextInput,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import i18n from 'format-message';
import { v4 as uuid } from 'uuid';
import Video from 'react-native-video';
import moment from 'moment';
import styled from 'styled-components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import { useTheme } from '@react-navigation/native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNPhotoLibraryAssets from 'react-native-photo-library-assets';
import { useSelector, useDispatch } from 'react-redux';

import { createPost } from '../redux/actions';
import { IS_ANDROID } from '../../shared/constants';
import { newsfeedType as feedType, permissionScopeName } from '../enums';

// hooks
import { usePermissions } from '../../shared/hooks/usePermissions';
import { AmbiColors, ShadowStyles } from '../../shared/contexts/themeContext';

// components
import Avatar from '../../shared/Avatars';
import HRLine from '../../shared/HRLine';
import LinkPreview from '../../shared/LinkPreview';
import RadioButtonTick from '../../shared/RadioButtonTick';
import { FullScreenLoader } from '../../shared/Loader';
import { IconHeaderButtons, Item } from '../../shared/HeaderButtons';

// images
import PinIcon from '../../shared/images/pin.svg';
import PollIcon from '../../shared/images/poll.svg';

// const
const { ambiBlue: ambiColorBlue, razzmatazz: ambiColorRazzmatazz } = AmbiColors;
const MAX_POLL_OPTIONS = 6;
const MIN_POLL_OPTIONS = 2;

const StyledVideo = styled(Video)`
  flex: 1;
  height: 200px;
  border-radius: 6px;
`;

const CreatePostContainer = styled(KeyboardAvoidingView)`
  flex: 1;
  border-bottom-color: transparent;
`;

const CreatePostContent = styled(ScrollView)`
  flex: 1;
`;

const InputWrapper = styled(View)`
  flex: 1;
  flex-direction: row;
  padding-bottom: 20px;
`;

const Input = styled(TextInput)`
  flex: 1;
  margin-top: ${IS_ANDROID ? '0px' : '6px'};

  font-family: Circular-Book;
  font-size: 18px;
  line-height: 23px;
  font-weight: 300;
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 12px;
`;

const PostMedia = styled(ScrollView)`
  width: 100%;
`;
const ImageWrapper = styled(View)`
  flex: 1;
  width: 100%;
  margin-right: 16px;
`;

const VideoWrapper = styled(View)`
  flex: 1;
  width: 100%;
  height: 200px;
  margin-right: 16px;
`;

const VideoXContainer = styled(View)`
  flex: 1;
  width: 100%;
  height: 50px;
  z-index: 1;
  position: absolute;
  align-items: flex-end;
`;

const PlayButtonContainer = styled(View)`
  flex: 1;
  width: 100%;
  height: 200px;
  margin: 0 auto;
  z-index: 2;
  position: absolute;
  align-items: center;
  justify-content: center;
`;

const XIcon = styled(FeatherIcon)`
  top: 10px;
  left: 105px;
  z-index: 1;
  position: absolute;
`;

const PlayButton = styled(FeatherIcon)`
  position: absolute;
`;

const VideoXIcon = styled(FeatherIcon)`
  top: 10px;
  right: 10px;
  z-index: 1;
  position: absolute;
`;

const MediaImage = styled(Image)`
  width: 140px;
  height: 140px;
  border-radius: 6px;
`;

const PollsContainer = styled(View)`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const PollInputOption = styled(TextInput)`
  width: 100%;
  height: 48px;
  margin: 0 auto 9px auto;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding-left: 16px;
  border-radius: 12px;
`;

const PollInputDate = styled(Text)`
  width: 309px;
  height: 48px;
  overflow: hidden;
  margin: 0 auto 9px 0;
  line-height: 48px;
  padding-left: 16px;

  border-width: 1px;
  border-style: solid;
  border-radius: 12px;
`;

const PollsFooter = styled(View)`
  flex: 1;
  margin-top: 4px;
  flex-direction: row;
  justify-content: space-between;
`;

const PollModifier = styled(Text)`
  color: ${({ color }) => color};
  font-family: Circular;
  font-size: 16px;
  font-weight: 300;
  line-height: 20px;
`;

const RadioNeverEndsContainer = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const PollEndsTitle = styled(Text)`
  color: ${({ color }) => color};
  margin-top: 24px;
  margin-bottom: 12px;

  font-size: 16px;
  font-family: Circular;
  font-weight: 300;
  line-height: 20px;
`;

const PollEndsDescription = styled(Text)`
  color: ${({ color }) => color};
  margin-left: 8px;

  font-family: Circular-Book;
  font-size: 14px;
  line-height: 18px;
`;

const CreatePostFooter = styled(View)`
  margin-top: 24px;
`;

const CreatePostTypeTitle = styled(Text)`
  color: #707689;

  font-size: 16px;
  font-family: Circular-Bold;
  line-height: 16px;
`;

const CreatePostType = styled(TouchableOpacity)`
  flex: 1;
  height: 55px;
  align-items: center;
  flex-direction: row;
`;

const CreatePostTypeName = styled(Text)`
  font-size: 14px;
  font-family: Circular-Book;
  line-height: 18px;
  margin-left: 8px;
`;

const VideoButton = styled(TouchableOpacity)`
  flex: 1;
`;

const CreateAnnouncement = styled(Text)`
  font-size: 14px;
  font-family: Circular-Book;
  line-height: 14px;
  margin-left: 8px;
`;

const CreatePin = styled(CreatePostTypeName)`
  line-height: 14px;
`;

const ModifierLeft = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const ActiveModifier = styled(View)`
  flex: 1;
  height: 55px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;

const CheckButton = styled(TouchableOpacity)`
  padding: 4px 0;
  flex-direction: row;
  justify-content: space-between;
`;

const Header = styled(Text)`
  color: ${({ color }) => color || 'red'};
  font-size: 16px;
  font-family: Circular;
  line-height: 16px;
`;

const CreatePostScreen = ({ navigation, route }) => {
  const player = useRef(null);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);

  const hostInfo = route.params?.hostInfo; // class, group, userProfiles
  const currentPostType = route.params?.type;
  const newsfeedType = route.params?.newsfeedType;

  const isPersonal =
    newsfeedType === feedType.PERSONAL || newsfeedType === feedType.OTHER_USER;
  const initialPolls = [
    { id: 1, text: '', votes: 0 },
    { id: 2, text: '', votes: 0 }
  ];
  const [postText, setPostText] = useState('');
  const [neverEnds, setNeverEnds] = useState(false);
  const [hidePoll, setHidePoll] = useState(false);
  const [images, setPostImages] = useState([]);
  const [videos, setPostVideos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingText, setUploadingText] = useState(
    'Uploading attachments...'
  );
  const [pollOptions, setPolls] = useState(initialPolls);
  const [isPin, setIsPin] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isAnnouncement, setIsAnnouncement] = useState(false);
  const [linkPreviewAttributes, setLinkPreviewAttributes] = useState({});
  const [activePostType, setActivePostType] = useState(currentPostType);
  const [endDateTimePickerVisible, setEndDateTimePickerVisible] =
    useState(false);
  const [endDateFinal, setEndDateFinal] = useState(moment().format());
  const [endDateUI, setEndDateUI] = useState(
    moment().format('DD MMM YYYY h:mm A')
  );

  const isPollActive = activePostType === 'poll';
  const isImageActive = activePostType === 'image';
  const userImageUrl = route.params?.avatarUrl;

  const hasLinkPreview = linkPreviewAttributes?.title;

  const theme = useTheme();
  const {
    legacy: themeColors,
    legacy: {
      body: colorBody,
      slateGray: colorSlateGray,
      textPrimary: colorText,
      darkGreenColor: colorDarkGreen,
      commentBGColor: colorInputDisable,
      systemBorderColor: colorBorder,
      textPrimaryInactive: colorTextInactive
    }
  } = theme;

  const handleCreatePost = async () => {
    navigation.setParams({ postText: '' });
    if (linkPreviewAttributes.image?.linkImage) {
      delete linkPreviewAttributes.image.linkImage;
    }
    const postInfo = {
      content: postText,
      postedAs: {
        userId: currentUser.id
      },
      linkPreviewAttributes,
      attachments:
        images.length > 0 || videos.length > 0 ? [...images, ...videos] : null,
      announcementEnabled: isAnnouncement,
      postPinned: isPin,
      broadcastEnabled: false,
      commentsDisabled: false
    };

    const updatePostedTo = {
      [feedType.GROUP]: () => {
        postInfo.postedTo = { groupId: hostInfo.id };
      },
      [feedType.CLASS]: () => {
        postInfo.postedTo = { classId: hostInfo.id };
      },
      [feedType.COMMUNITY]: () => {
        postInfo.postedTo = { communityId: hostInfo.id };
      },
      [feedType.PERSONAL]: () => {
        postInfo.postedTo = { userId: hostInfo.id };
      },
      [feedType.OTHER_USER]: () => {
        postInfo.postedTo = { userId: hostInfo.id };
      },
      [feedType.GENERAL]: () => {
        postInfo.postedTo = { userId: currentUser.id };
      }
    };

    updatePostedTo[newsfeedType]();

    if (activePostType === 'poll') {
      const filteredOptions = pollOptions.filter(
        option => option.text.length > 0
      );
      if (filteredOptions.length < 2) {
        // TODO: Show error about requiring at least 2 options
      } else {
        postInfo.poll = {
          endDate: endDateFinal,
          options: filteredOptions,
          hideUsers: hidePoll,
          neverEnds
        };
      }
    }

    await createPost(postInfo, newsfeedType, {
      onUploadLoaded: () => {},
      onUploadStarted: () => {
        setUploading(true);
        setUploadingText('Uploading attachments...');
      },
      onUploadProgress: ({ progress, count }) => {
        const { attachmentNumber, totalAttachments } = count;
        setUploadingText(
          `Uploading attachment ${attachmentNumber}/${totalAttachments}... ${progress}%`
        );
      },
      onUploadError: ({ name }) => {
        Alert.alert(`There was an error uploading ${name}! Please try again.`);
        setUploading(false);
      },
      onUploadFinished: ({ name }) => {
        setUploadingText(`Finished uploading ${name}!`);
      }
    })(dispatch);
    setUploading(false);
    navigation.goBack();
  };

  useLayoutEffect(() => {
    const canPost =
      (images.length > 0 && postText.length) ||
      postText.length ||
      hasLinkPreview;
    const onPress = () => {
      if (canPost) {
        handleCreatePost();
      }
    };
    navigation.setOptions({
      headerCenter: () => <Header color={colorText}>Post to Feed</Header>,
      headerRight: () => {
        return (
          <IconHeaderButtons useLeftHeader>
            <Item
              title="Post"
              color={canPost && !uploading ? ambiColorBlue : colorSlateGray}
              onPress={onPress}
              disabled={!canPost || uploading}
              actionable
            />
          </IconHeaderButtons>
        );
      }
    });
  }, [
    images,
    postText,
    uploading,
    ambiColorBlue,
    colorSlateGray,
    hasLinkPreview,
    handleCreatePost
  ]);

  useEffect(() => {
    return () => {
      if (images && images.length > 0) {
        ImagePicker.clean();
        setPostImages([]);
      }
    };
  }, [linkPreviewAttributes.title]);

  useEffect(() => {
    if (images && hasLinkPreview) {
      const { filename, path: linkImage } = images[images.length - 1] || {
        filename: null,
        path: null
      };
      const image = linkImage
        ? { filename, linkImage }
        : linkPreviewAttributes.image;
      const previewLink = { ...linkPreviewAttributes, image };
      setLinkPreviewAttributes(previewLink);
    }
  }, [images]);

  const openImagePicker = async () => {
    try {
      setActivePostType('image');
      const media = await ImagePicker.openPicker({
        multiple: true,
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

      const mediaIsVideo = media.find(att => att.mime.startsWith('video'));

      setUploading(true);
      setUploadingText('Processing attachments...');
      const formattedMedia = await Promise.all(
        media.map(async attachment => {
          let imagePath = attachment.path;
          if (!attachment.sourceURL) {
            imagePath = await RNPhotoLibraryAssets.getImageForAsset(
              attachment.localIdentifier
            );
          }
          return {
            ...attachment,
            path: imagePath,
            filename: attachment.filename || attachment.name,
            type: attachment.type || attachment.mime,
            uniqueIdentifier: uuid()
          };
        })
      );
      setUploading(false);

      if (mediaIsVideo) {
        setPostVideos(formattedMedia);
      } else {
        setPostImages(formattedMedia);
      }
    } catch (err) {
      console.warn(err);
      setActivePostType('text');
    }
  };

  const removeImage = key => {
    const updatedMedia = images.filter(media => media.path !== key);
    setPostImages(updatedMedia);
    if (updatedMedia.length === 0) {
      setActivePostType('text');
    }
  };

  const removeVideo = key => {
    const updatedMedia = videos.filter(media => media.path !== key);
    setPostVideos(updatedMedia);
    if (updatedMedia.length === 0) {
      setActivePostType('text');
    }
  };

  const addOrRemovePolls = add => {
    const optionCount = pollOptions.length;
    if (add && optionCount < MAX_POLL_OPTIONS) {
      return setPolls(
        pollOptions.concat({
          id: optionCount + 1,
          text: '',
          votes: 0
        })
      );
    }
    if (!add && optionCount > MIN_POLL_OPTIONS) {
      return setPolls(pollOptions.slice(0, optionCount - 1));
    }
    return null;
  };

  const updatePollText = (id, text) => {
    const updatedPollOptions = pollOptions.map(option => {
      if (option.id === id) {
        return { ...option, text };
      }
      return option;
    });
    setPolls(updatedPollOptions);
  };

  const permissionScopeNameAndId = {
    scope: permissionScopeName[newsfeedType],
    id: hostInfo ? hostInfo.id : currentUser.id
  };
  const { canPerform } = usePermissions(permissionScopeNameAndId);

  const canPinPost = canPerform('pin_post');
  const canCreatePoll = canPerform('create_poll');
  const canAnnounce = canPerform('announce_post');
  const canUploadImage = canPerform('upload_image_to_post');

  const insets = useSafeAreaInsets();

  const showEndDateTimePicker = () => {
    if (neverEnds) { return; } // prettier-ignore
    setTimeout(() => {
      setEndDateTimePickerVisible(true);
    }, 500);
  };

  const handleEndDatePicked = date => {
    setEndDateFinal(moment(date).format());
    setEndDateUI(moment(date).format('DD MMM YYYY h:mm A'));
    setEndDateTimePickerVisible(false);
  };

  return (
    <CreatePostContainer
      style={{ backgroundColor: colorBody }}
      behavior={IS_ANDROID ? null : 'padding'}
      keyboardVerticalOffset={12}
    >
      <CreatePostContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 68
        }}
      >
        <InputWrapper>
          <StyledAvatar size={40} url={userImageUrl} />
          <Input
            style={{ color: colorText }}
            autoFocus
            multiline
            placeholder={i18n('Type something...')}
            onChangeText={setPostText}
            selectionColor={ambiColorRazzmatazz}
            placeholderTextColor={colorSlateGray}
          />
        </InputWrapper>
        <View style={{ flex: hasLinkPreview ? 1 : 0 }}>
          <LinkPreview
            textContent={postText}
            handleLinkPreview={setLinkPreviewAttributes}
            linkPreviewProps={linkPreviewAttributes}
          />
        </View>

        {!hasLinkPreview && images.length > 0 && (
          <PostMedia horizontal showsHorizontalScrollIndicator={false}>
            {images.map(img => {
              return (
                <ImageWrapper key={img.path}>
                  <XIcon
                    name="x"
                    size={24}
                    color="#ffffff"
                    onPress={() => removeImage(img.path)}
                  />
                  <MediaImage source={{ uri: img.path }} />
                </ImageWrapper>
              );
            })}
          </PostMedia>
        )}

        {!hasLinkPreview && videos.length > 0 && (
          <PostMedia>
            {videos.map(vid => {
              return (
                <VideoWrapper key={vid.path}>
                  <VideoXContainer>
                    <VideoXIcon
                      name="x"
                      size={26}
                      color="#fff"
                      style={ShadowStyles.buttonsAndText}
                      onPress={() => removeVideo(vid.path)}
                    />
                  </VideoXContainer>

                  <VideoButton onPress={() => setIsPaused(!isPaused)}>
                    <PlayButtonContainer>
                      {isPaused && (
                        <PlayButton
                          name="play-circle"
                          size={50}
                          color="#fff"
                          style={ShadowStyles.buttonsAndText}
                        />
                      )}
                    </PlayButtonContainer>
                    <StyledVideo
                      ref={player}
                      source={{ uri: vid.path }}
                      resizeMode="cover"
                      paused={isPaused}
                      onEnd={() => {
                        setIsPaused(true);
                        player.current.seek(0);
                      }}
                    />
                  </VideoButton>
                </VideoWrapper>
              );
            })}
          </PostMedia>
        )}

        {isPollActive && (
          <ScrollView>
            <PollsContainer>
              {pollOptions.map(option => {
                const placeholderText = i18n('Poll Option { key }', { key: option.id }); // prettier-ignore
                return (
                  <PollInputOption
                    key={option.id}
                    style={{ borderColor: colorBorder, color: colorText }}
                    autoFocus
                    placeholder={placeholderText}
                    onChangeText={text => updatePollText(option.id, text)}
                    numberOfLines={1}
                    placeholderTextColor={colorTextInactive}
                  />
                );
              })}
              <PollsFooter>
                <PollModifier
                  color={
                    pollOptions.length < MAX_POLL_OPTIONS
                      ? ambiColorBlue
                      : colorTextInactive
                  }
                  onPress={() => addOrRemovePolls(true)}
                >
                  Add Option
                </PollModifier>

                <PollModifier
                  color={
                    pollOptions.length > MIN_POLL_OPTIONS
                      ? ambiColorBlue
                      : colorTextInactive
                  }
                  onPress={() => addOrRemovePolls(false)}
                >
                  Remove Option
                </PollModifier>
              </PollsFooter>
              <PollEndsTitle color={colorSlateGray}>
                when does the poll end?
              </PollEndsTitle>
              <DateTimePicker
                mode="datetime"
                is24Hour={false}
                minimumDate={new Date()}
                isVisible={endDateTimePickerVisible && neverEnds === false}
                onConfirm={handleEndDatePicked}
                onCancel={() => setEndDateTimePickerVisible(false)}
              />
              <PollInputDate
                style={{
                  color: endDateUI ? colorText : colorTextInactive,
                  borderColor: neverEnds ? colorInputDisable : colorBorder,
                  backgroundColor: neverEnds ? colorInputDisable : colorBody
                }}
                onPress={showEndDateTimePicker}
                numberOfLines={1}
              >
                {endDateUI || 'Date'}
              </PollInputDate>
              <RadioNeverEndsContainer>
                <CheckButton
                  onPress={() => {
                    setNeverEnds(!neverEnds);
                  }}
                >
                  <RadioButtonTick
                    isChecked={neverEnds === true}
                    onPress={() => {}}
                    theme={themeColors}
                  />
                  <PollEndsDescription color={colorDarkGreen}>
                    this poll never ends
                  </PollEndsDescription>
                </CheckButton>
              </RadioNeverEndsContainer>
              <PollEndsTitle color={colorSlateGray}>
                poll respondent privacy
              </PollEndsTitle>
              <RadioNeverEndsContainer>
                <CheckButton
                  onPress={() => {
                    setHidePoll(!hidePoll);
                  }}
                >
                  <RadioButtonTick
                    isChecked={hidePoll === true}
                    onPress={() => {}}
                    theme={themeColors}
                  />
                  <PollEndsDescription color={colorDarkGreen}>
                    hide poll respondent from other users
                  </PollEndsDescription>
                </CheckButton>
              </RadioNeverEndsContainer>
            </PollsContainer>
          </ScrollView>
        )}

        <CreatePostFooter>
          <CreatePostTypeTitle>Add</CreatePostTypeTitle>
          {canUploadImage && (
            <CreatePostType
              onPress={() => {
                if (!isPollActive && !linkPreviewAttributes.image) {
                  openImagePicker();
                }
              }}
            >
              <FeatherIcon
                name="image"
                size={24}
                color={
                  isPollActive || linkPreviewAttributes.image
                    ? colorTextInactive
                    : colorDarkGreen
                }
              />
              <CreatePostTypeName
                style={{
                  color:
                    isPollActive || linkPreviewAttributes.image
                      ? colorTextInactive
                      : colorDarkGreen
                }}
              >
                {i18n(`Image ${hasLinkPreview ? 'url' : 'or Video'}`)}
              </CreatePostTypeName>
            </CreatePostType>
          )}
          <HRLine fullWidth />

          {canCreatePoll && (
            <CreatePostType
              onPress={() => {
                if (!isImageActive && !hasLinkPreview) {
                  setActivePostType(isPollActive ? 'text' : 'poll');
                }
              }}
            >
              <PollIcon
                width={22}
                height={18}
                fill={
                  !isImageActive && !hasLinkPreview
                    ? colorDarkGreen
                    : colorTextInactive
                }
                style={{ marginLeft: 4 }}
              />
              <CreatePostTypeName
                style={{
                  color:
                    !isImageActive && !hasLinkPreview
                      ? colorDarkGreen
                      : colorTextInactive
                }}
              >
                {isPollActive ? i18n('Remove Poll...') : i18n('Poll...')}
              </CreatePostTypeName>
            </CreatePostType>
          )}
          <HRLine fullWidth />

          {canAnnounce && !isPersonal && (
            <CreatePostType
              onPress={() => {
                setIsAnnouncement(!isAnnouncement);
              }}
            >
              <ActiveModifier>
                <ModifierLeft>
                  <FeatherIcon
                    name="bell"
                    size={24}
                    color={
                      isAnnouncement ? ambiColorRazzmatazz : colorDarkGreen
                    }
                  />
                  <CreateAnnouncement
                    style={{
                      color: isAnnouncement
                        ? ambiColorRazzmatazz
                        : colorDarkGreen
                    }}
                  >
                    {i18n('Announcement')}
                  </CreateAnnouncement>
                </ModifierLeft>
                {isAnnouncement && (
                  <View>
                    <FeatherIcon
                      name="check"
                      size={24}
                      color={ambiColorRazzmatazz}
                    />
                  </View>
                )}
              </ActiveModifier>
            </CreatePostType>
          )}
          <HRLine fullWidth />
          {canPinPost && (
            <CreatePostType
              onPress={() => {
                setIsPin(!isPin);
              }}
            >
              <ActiveModifier>
                <ModifierLeft>
                  <PinIcon
                    width={20}
                    height={24}
                    fill={isPin ? ambiColorBlue : colorDarkGreen}
                    style={{ marginLeft: 4 }}
                  />
                  <CreatePin
                    style={{ color: isPin ? ambiColorBlue : colorDarkGreen }}
                  >
                    Pin
                  </CreatePin>
                </ModifierLeft>
                {isPin && (
                  <View>
                    <FeatherIcon name="check" size={24} color={ambiColorBlue} />
                  </View>
                )}
              </ActiveModifier>
            </CreatePostType>
          )}
          <HRLine fullWidth />
        </CreatePostFooter>
      </CreatePostContent>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        animated
        translucent
      />
      {uploading && <FullScreenLoader text={uploadingText} />}
    </CreatePostContainer>
  );
};

export default CreatePostScreen;
