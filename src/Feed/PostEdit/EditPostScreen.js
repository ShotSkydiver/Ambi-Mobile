/**
 * EditPostScreen
 */
/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  StatusBar,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import i18n from 'format-message';
import { v4 as uuid } from 'uuid';
import Video from 'react-native-video';
import moment from 'moment';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import FeatherIcon from 'react-native-vector-icons/Feather';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNPhotoLibraryAssets from 'react-native-photo-library-assets';
import { useSelector, useDispatch } from 'react-redux';

import { IS_ANDROID } from '../../shared/constants';
import { permissionScopeName } from '../enums';
import { editPost as editPostHandler } from '../redux/actions';

// hooks
import { AmbiColors } from '../../shared/contexts/themeContext';
import { usePermissions } from '../../shared/hooks/usePermissions';

// components
import HRLine from '../../shared/HRLine';
import Avatar from '../../shared/Avatars';
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

const EditPostContainer = styled(KeyboardAvoidingView)`
  flex: 1;
  border-bottom-color: transparent;
`;

const EditPostContent = styled(ScrollView)`
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

  font-size: 18px;
  font-family: Circular-Book;
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
  height: 220px;
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
  height: 220px;
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

const PollInputOptions = styled(TextInput)`
  width: 100%;
  height: 48px;
  margin: 0 auto 8px auto;
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

  font-size: 14px;
  font-family: Circular-Book;
  line-height: 18px;
  margin-left: 8px;
`;

const EditPostFooter = styled(View)`
  margin-top: 24px;
`;

const EditPostTypeTitle = styled(Text)`
  color: #707689;

  font-size: 16px;
  font-family: Circular-Bold;
  line-height: 16px;
`;

const EditPostType = styled(TouchableOpacity)`
  flex: 1;
  height: 55px;
  align-items: center;
  flex-direction: row;
`;

const EditPostTypeName = styled(Text)`
  font-size: 14px;
  font-family: Circular-Book;
  line-height: 18px;
  margin-left: 8px;
`;

const VideoButton = styled(TouchableOpacity)`
  flex: 1;
`;

const EditPin = styled(EditPostTypeName)`
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
  color: ${({ color }) => color || '#fff'};
  font-size: 16px;
  font-family: Circular;
  line-height: 16px;
`;

const EditPostScreen = ({ navigation, route }) => {
  const player = useRef(null);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const hostInfo = route.params?.hostInfo; // class, group, userProfiles
  const newsfeedType = route.params?.newsfeedType || 'general';

  const post = route.params?.post;
  const {
    content,
    poll,
    linkPreviewAttributes: linkPreview,
    postPins: oldPostPins = [],
    commentsDisabled: oldCommentsDisabled = false
  } = post;
  const currentPostType = poll ? 'poll' : 'text';
  const oldPostPinned = oldPostPins.length >= 1;
  const postAttachments = post.postAttachments || [];
  const pollOriginalEndDate = poll && poll.endDate ? poll.endDate : new Date();
  const pollOriginalNeverEnds = poll && poll.neverEnds ? poll.neverEnds : false;
  const pollOriginalHidePoll = poll && poll.hideUsers ? poll.hideUsers : false;
  const initialPolls =
    poll && poll.options
      ? poll.options
      : [
          { id: 1, text: '', votes: 0 },
          { id: 2, text: '', votes: 0 }
        ];
  const [postText, setPostText] = useState(content);
  const [neverEnds, setNeverEnds] = useState(pollOriginalNeverEnds);
  const [hidePoll, setHidePoll] = useState(pollOriginalHidePoll);
  const [images, setPostImages] = useState(
    postAttachments.filter(media => media.contentType.includes('image'))
  );
  const [videos, setPostVideos] = useState(
    postAttachments.filter(media => media.contentType.includes('video'))
  );
  const [uploading, setUploading] = useState(false);
  const [uploadingText, setUploadingText] = useState(
    'Uploading attachments...'
  );
  const [pollOptions, setPolls] = useState(initialPolls);
  const [postPinned, setPostPinned] = useState(oldPostPinned);
  const [isPaused, setIsPaused] = useState(false);
  const [commentsDisabled, setCommentsDisabled] = useState(oldCommentsDisabled);
  const [linkPreviewAttributes, setLinkPreviewAttributes] =
    useState(linkPreview);
  const [activePostType, setActivePostType] = useState(currentPostType);
  const [endDateTimePickerVisible, setEndDateTimePickerVisible] =
    useState(false);
  const [endDateFinal, setEndDateFinal] = useState(
    moment(pollOriginalEndDate).format()
  );
  const [endDateUI, setEndDateUI] = useState(
    moment(pollOriginalEndDate).format('DD MMM YYYY h:mm A')
  );

  const isPollActive = activePostType === 'poll';
  const isImageActive = activePostType === 'image';
  const userImageUrl = route.params?.avatarUrl;

  const hasLinkPreview = Object.keys(linkPreviewAttributes).length;

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

  const handleEditPost = async () => {
    navigation.setParams({ postText: '' });
    const updatedPost = {
      ...post,
      content: postText,
      linkPreviewAttributes,
      attachments:
        images.length > 0 || videos.length > 0 ? [...images, ...videos] : null,
      broadcastEnabled: false,
      commentsDisabled,
      postPinned,
      postedTo: {
        clientId: post.postedToClientId,
        userId: post.postedToUserId,
        classId: post.postedToClassId,
        groupId: post.postedToGroupId,
        communityId: post.postedToCommunityId
      },
      postedAs: {
        userId: currentUser.id,
        clientId: post.postedAsClientId,
        classId: post.postedAsClassId,
        groupId: post.postedAsGroupId,
        communityId: post.postedToCommunityId
      }
    };

    if (activePostType === 'poll') {
      const filteredOptions = pollOptions.filter(
        option => option.text.length > 0
      );
      if (filteredOptions.length < 2) {
        // TODO: Show error about requiring at least 2 options
      } else {
        updatedPost.poll = {
          endDate: endDateFinal,
          options: filteredOptions,
          hideUsers: hidePoll,
          neverEnds
        };
      }
    }

    await editPostHandler(updatedPost, post.id, {
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
    const canPost = (images.length > 0 && postText.length) || postText.length;
    const onPress = () => {
      if (canPost) {
        handleEditPost();
      }
    };
    navigation.setOptions({
      headerCenter: () => <Header color={colorText}>Edit Post</Header>,
      headerRight: () => {
        return (
          <IconHeaderButtons useLeftHeader>
            <Item
              title="Save"
              color={canPost ? ambiColorBlue : colorSlateGray}
              onPress={onPress}
              disabled={!canPost}
              actionable
            />
          </IconHeaderButtons>
        );
      }
    });
  }, [
    images,
    postText,
    colorText,
    handleEditPost,
    ambiColorBlue,
    colorSlateGray
  ]);

  useEffect(() => {
    return () => {
      if (images && images.length > 0) {
        ImagePicker.clean();
        setPostImages([]);
      }
    };
  }, []);

  const openImagePicker = async () => {
    try {
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
          const imageUri = await RNPhotoLibraryAssets.getImageForAsset(
            attachment.localIdentifier
          );
          return {
            ...attachment,
            path: imageUri,
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
        setPostImages([...images, ...formattedMedia]);
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
    id: hostInfo?.id || currentUser.id
  };

  const { canPerform } = usePermissions(permissionScopeNameAndId);

  const canPinPost = canPerform('pin_post');
  const canCreatePoll = canPerform('create_poll');
  const canUploadImage = canPerform('upload_image_to_post');
  const canDisableComments = canPerform('disable_post_comments');

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
    <EditPostContainer
      style={{ backgroundColor: colorBody }}
      behavior={IS_ANDROID ? null : 'padding'}
      keyboardVerticalOffset={12}
    >
      <EditPostContent
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 72, // fix for headerTranslucent: true in AuthNavigator
          paddingLeft: 16,
          paddingRight: 16,
          paddingBottom: 16
        }}
      >
        <InputWrapper>
          <StyledAvatar size={40} url={userImageUrl} />
          <Input
            value={postText}
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
                      size={24}
                      color="#fff"
                      onPress={() => removeVideo(vid.path)}
                    />
                  </VideoXContainer>

                  <VideoButton onPress={() => setIsPaused(!isPaused)}>
                    <PlayButtonContainer>
                      {isPaused && (
                        <PlayButton name="play-circle" size={50} color="#fff" />
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
                  <PollInputOptions
                    key={option.id}
                    style={{ borderColor: colorBorder, color: colorText }}
                    value={option.text}
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

        <EditPostFooter>
          <EditPostTypeTitle>Add</EditPostTypeTitle>
          {canUploadImage && (
            <EditPostType
              onPress={() => {
                if (!isPollActive) {
                  openImagePicker();
                }
              }}
            >
              <FeatherIcon
                name="image"
                size={24}
                color={!isPollActive ? colorDarkGreen : colorTextInactive}
              />
              <EditPostTypeName
                style={{
                  color: !isPollActive ? colorDarkGreen : colorTextInactive
                }}
              >
                {i18n('Image or Video')}
              </EditPostTypeName>
            </EditPostType>
          )}
          <HRLine fullWidth />

          {canCreatePoll && (
            <EditPostType
              onPress={() => {
                if (!isImageActive) {
                  setActivePostType(isPollActive ? 'text' : 'poll');
                }
              }}
            >
              <PollIcon
                width={22}
                height={18}
                fill={!isImageActive ? colorDarkGreen : colorTextInactive}
                style={{ marginLeft: 4 }}
              />
              <EditPostTypeName
                style={{
                  color: !isImageActive ? colorDarkGreen : colorTextInactive
                }}
              >
                {isPollActive ? i18n('Remove Poll...') : i18n('Poll...')}
              </EditPostTypeName>
            </EditPostType>
          )}
          <HRLine fullWidth />
          {canPinPost && (
            <EditPostType
              onPress={() => {
                setPostPinned(!postPinned);
              }}
            >
              <ActiveModifier>
                <ModifierLeft>
                  <PinIcon
                    width={20}
                    height={24}
                    fill={postPinned ? ambiColorBlue : colorDarkGreen}
                    style={{ marginLeft: 4 }}
                  />
                  <EditPin
                    style={{
                      color: postPinned ? ambiColorBlue : colorDarkGreen
                    }}
                  >
                    Pin
                  </EditPin>
                </ModifierLeft>
                {postPinned && (
                  <View>
                    <FeatherIcon name="check" size={24} color={ambiColorBlue} />
                  </View>
                )}
              </ActiveModifier>
            </EditPostType>
          )}
          <HRLine fullWidth />
          {canDisableComments && (
            <EditPostType
              onPress={() => {
                setCommentsDisabled(!commentsDisabled);
              }}
              style={{
                justifyContent: 'space-between'
              }}
            >
              <View
                style={{
                  flexDirection: 'row'
                }}
              >
                <FeatherIcon
                  name={commentsDisabled ? 'lock' : 'unlock'}
                  size={24}
                  color={commentsDisabled ? ambiColorBlue : colorDarkGreen}
                />
                <EditPostTypeName
                  style={{
                    paddingTop: 2,
                    color: commentsDisabled ? ambiColorBlue : colorDarkGreen
                  }}
                >
                  {commentsDisabled ? i18n('Locked') : i18n('Lock')}
                </EditPostTypeName>
              </View>
              {commentsDisabled && (
                <FeatherIcon name="x" size={24} color={ambiColorBlue} />
              )}
            </EditPostType>
          )}
          <HRLine fullWidth />
        </EditPostFooter>
      </EditPostContent>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        animated
        translucent
      />
      {uploading && <FullScreenLoader text={uploadingText} />}
    </EditPostContainer>
  );
};

export default EditPostScreen;
