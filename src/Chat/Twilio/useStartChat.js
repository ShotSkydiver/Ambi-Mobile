import { useDispatch } from 'react-redux';

import useTwilioChatClient from './useTwilioChatClient';
import { CHAT_TYPES } from '../chatsReducer';

function useStartChat(navigation) {
  const dispatch = useDispatch();
  const { createChannel } = useTwilioChatClient();

  const handleStartChat = (channelMembersToAdd, space) => {
    if (!channelMembersToAdd || channelMembersToAdd.length === 0) {
      return null;
    }
    dispatch({
      type: CHAT_TYPES.CREATING_NEW_CHANNEL,
      isCreatingNewChatChannel: true
    });
    return createChannel(channelMembersToAdd, space)
      .then(newChatChannel => {
        if (newChatChannel) {
          dispatch({
            type: CHAT_TYPES.UPDATE_CHANNELS,
            channel: newChatChannel
          });
          dispatch({
            type: CHAT_TYPES.CREATING_NEW_CHANNEL,
            isCreatingNewChatChannel: false
          });
          navigation.navigate('SingleChat', { channelSid: newChatChannel.sid });
        }
      })
      .catch(err => {
        console.warn('error starting a new chat: ', err);
        dispatch({
          type: CHAT_TYPES.CREATING_NEW_CHANNEL,
          isCreatingNewChatChannel: false
        });
      });
  };

  return { handleStartChat };
}

export default useStartChat;
