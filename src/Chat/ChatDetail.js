/* eslint-disable react/display-name */
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import RNPhotoLibraryAssets from 'react-native-photo-library-assets';
import { v4 as uuid } from 'uuid';

import useTwilioChatClient from './Twilio/useTwilioChatClient';
import { ambiApi } from '../models/AmbiApi';
import { User } from '../models/User';
import {
  ChatDetailHeaderTitle,
  ChatDetailHeaderRight
} from './ChatDetailHeader';
import ChatMessagesList from './ChatMessagesList';
import ChatInput from './ChatInput';
import { FullScreenLoader } from '../shared/Loader';
import { IS_ANDROID } from '../shared/constants';
import { CHAT_TYPES } from './chatsReducer';

const Container = styled(View)`
  flex: 1;
  padding-bottom: 0px;
`;

function ChatDetail({ navigation, route }) {
  const dispatch = useDispatch();
  const chats = useSelector(state => state.chats);
  const user = useSelector(state => state.auth.user);
  const currentUser = new User(user);

  const { chatChannels, error, currentPage } = chats;
  const channelSid = route.params?.channelSid;
  const channel = chatChannels.find(c => c.sid === channelSid);

  const { getHydratedChannel, Client: twilioClient } = useTwilioChatClient();

  const theme = useTheme();
  const { legacy: themeColors } = theme;

  // This is mainly used to navigate straight to a chat from a push notification.
  useEffect(() => {
    if (route.params?.channelSid && !channel) {
      twilioClient
        .getChannelBySid(route.params?.channelSid)
        .then(async channelRes => {
          const newChannel = await getHydratedChannel(channelRes);
          dispatch({
            type: CHAT_TYPES.UPDATE_CHANNELS,
            channel: newChannel
          });
        });
    }
  }, [route.params?.channelSid]);

  const { sid, messagesCount } = channel || {};

  useEffect(() => {
    if (messagesCount > 0) {
      channel.setAllMessagesConsumed();
      const updatedChannel = channel;
      channel.hydration.unreadCount = 0;
      dispatch({
        type: CHAT_TYPES.UPDATE_CHANNELS,
        channel: updatedChannel
      });
    }
  }, [messagesCount]);

  useEffect(() => {
    if (channel) {
      const {
        members,
        attributes: { space }
      } = channel;
      const isMultiMemberChannel = members.length > 2 || space; // one-to-one is not considered as a multiMember channel
      navigation.setOptions({
        headerCenter: () => {
          return (
            <ChatDetailHeaderTitle
              navigation={navigation}
              route={route}
              theme={themeColors}
              channel={channel}
              isMultiMemberChannel={isMultiMemberChannel}
            />
          );
        },
        headerRight: () => {
          const isChannelMembersScreen = route.name === 'ChatChannelMembers';
          if (isChannelMembersScreen && space) {
            return null;
          }
          return (
            <ChatDetailHeaderRight
              navigation={navigation}
              route={route}
              theme={themeColors}
              channel={channel}
              isMultiMemberChannel={isMultiMemberChannel}
            />
          );
        }
      });
    }
  }, [channel?.sid]);

  const handleUploadMedia = async (mediaItems, user, channelSid) => {
    try {
      await Promise.all(
        mediaItems.map(async ({ id, uri, name, type }) => {
          dispatch({
            type: CHAT_TYPES.UPLOADING_FILE,
            user,
            id,
            channelSid
          });
          try {
            const result = await ambiApi.uploadToApi({
              url: '/chat/media',
              file: {
                uri,
                name,
                type
              },
              onUploadProgress: ({ loaded, total }) => {
                dispatch({
                  type: CHAT_TYPES.UPLOADING_FILE_PROGRESS,
                  id,
                  channelSid,
                  progress: (100.0 * loaded) / total
                });
              }
            });
            const mediaAttributes = {
              media: { ...result.data.data, name }
            };
            channel
              .sendMessage('', mediaAttributes)
              .then(() => {
                dispatch({
                  type: CHAT_TYPES.UPLOADING_FILE_SUCCEEDED,
                  id,
                  channelSid
                });
              })
              .catch(err => {
                console.warn('Failed to send media message: ', err);
              });
          } catch (exception) {
            console.error('Unable to upload file: ', exception);
            dispatch({
              type: CHAT_TYPES.UPLOADING_FILE_FAILED,
              id,
              channelSid
            });
          }
        })
      );
    } catch (err) {
      console.warn(err);
    }
  };

  const saveImage = image => {
    const parts = image.path.split('/');
    const name = parts[parts.length - 1];
    handleUploadMedia(
      [
        {
          id: image.path,
          uri: image.path,
          name,
          type: image.mime
        }
      ],
      currentUser,
      sid
    );
  };

  const openCamera = async () => {
    const image = await ImagePicker.openCamera({});
    if (image.path) {
      await saveImage(image);
    }
  };

  const openPicker = async () => {
    const image = await ImagePicker.openPicker({
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
      // waitAnimationEnd: false
    });

    if (image) {
      if (!image.sourceURL) {
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

        await saveImage(processedImage);
      } else {
        await saveImage(image);
      }
    }
  };

  return (
    <Container style={{ backgroundColor: themeColors.body }}>
      {!channel && <FullScreenLoader text="loading..." />}
      {error && <Text>{i18n('Unable to Load Chat')}</Text>}
      {!error && channel && (
        <>
          <ChatMessagesList
            onLinkPress={uri => InAppBrowser.open(uri)}
            navigation={navigation}
            currentUser={currentUser}
            currentPage={currentPage}
            channel={channel}
          />
          <ChatInput
            channel={channel}
            onCameraPress={openCamera}
            onPhotoLibraryPress={openPicker}
          />
          {!IS_ANDROID && <KeyboardSpacer topSpacing={0} />}
        </>
      )}
    </Container>
  );
}

export default ChatDetail;
