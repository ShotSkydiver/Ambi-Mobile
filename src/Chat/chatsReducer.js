export const CHAT_TYPES = {
  LOADING_CHANNELS: 'CHAT/LOADING',
  LOADED_CHANNELS: 'CHAT/LOADED',
  ERROR: 'CHAT/ERROR',
  SETUP_TWILIO_CLIENT: 'CHAT/SETUP_TWILIO_CLIENT',
  UPDATE_CHANNELS: 'CHAT/UPDATE_CHANNELS',
  LOADED_IMAGE: 'CHAT/LOADED_IMAGE',
  UPLOADING_FILE: 'CHAT/UPLOADING_FILE',
  UPLOADING_FILE_PROGRESS: 'CHAT/UPLOADING_FILE_PROGRESS',
  UPLOADING_FILE_FAILED: 'CHAT/UPLOADING_FILE_FAILED',
  UPLOADING_FILE_SUCCEEDED: 'CHAT/UPLOADING_FILE_SUCCEEDED',
  REMOVE_CHANNEL: 'CHAT/REMOVE_CHANNEL',
  CREATING_NEW_CHANNEL: 'CHAT/CREATING_NEW_CHANNEL'
};

const chatsInitialState = {
  loading: true,
  twilioClient: null,
  chatChannels: [],
  error: undefined,
  currentPage: 1,
  reachedEnd: false,
  bottomNavUnreadCount: 0,
  appIconBadgeCount: 0,
  isCreatingNewChatChannel: false
};

const unreadChannelsCount = channels => {
  let count = 0;
  channels.forEach(ch => {
    if (ch?.hydration?.unreadCount > 0) {
      count += 1;
    }
  });
  return count;
};

const unreadMessagesCount = channels => {
  let count = 0;
  channels.forEach(ch => {
    if (ch?.hydration?.unreadCount > 0) {
      count += ch?.hydration?.unreadCount;
    }
  });
  return count;
};

export function ChatsReducer(state = chatsInitialState, action) {
  switch (action.type) {
    case CHAT_TYPES.SETUP_TWILIO_CLIENT:
      return { ...state, twilioClient: action.client };
    case CHAT_TYPES.LOADING_CHANNELS: {
      return {
        ...state,
        loading: true
      };
    }

    case CHAT_TYPES.LOADED_CHANNELS:
      return {
        ...state,
        loading: false,
        chatChannels: action.channels,
        currentPage: action.page || state.currentPage
        // reachedEnd: action.data.length === 0
      };

    case CHAT_TYPES.ERROR:
      return {
        ...state,
        loading: false,
        error: true
      };

    case CHAT_TYPES.CREATING_NEW_CHANNEL:
      return {
        ...state,
        isCreatingNewChatChannel: action.isCreatingNewChatChannel
      };

    case CHAT_TYPES.UPDATE_CHANNELS: {
      const { channel, moveChannelToTop } = action;
      const currentChannelsInState = state.chatChannels;
      const existingChannel = currentChannelsInState.find(
        ch => ch.sid === channel.sid
      );
      const mappedChannels = currentChannelsInState.map(ch => {
        if (ch.sid === channel.sid) {
          return channel;
        }
        return ch;
      });
      const filteredChannels = currentChannelsInState.filter(ch => {
        return ch.sid !== channel.sid;
      });
      let updatedChatChannels = currentChannelsInState;
      if (existingChannel) {
        updatedChatChannels = moveChannelToTop
          ? [channel, ...filteredChannels]
          : mappedChannels;
      } else {
        updatedChatChannels = [channel, ...currentChannelsInState];
      }
      return {
        ...state,
        chatChannels: updatedChatChannels,
        bottomNavUnreadCount: unreadChannelsCount(updatedChatChannels),
        appIconBadgeCount: unreadMessagesCount(updatedChatChannels)
      };
    }
    case CHAT_TYPES.UPDATE_PAGE:
      return {
        ...state,
        currentPage: action.page
      };
    case CHAT_TYPES.UPLOADING_FILE:
      return {
        ...state,
        chatChannels: state.chatChannels.map(ch => {
          const updatedChannel = ch;
          if (ch.sid === action.channelSid) {
            updatedChannel.messages = [
              {
                type: 'upload',
                progress: 0,
                from: { user: action.user }
              },
              ...updatedChannel.messages
            ];
          }
          return updatedChannel;
        })
      };
    case CHAT_TYPES.UPLOADING_FILE_PROGRESS:
      return {
        ...state,
        chatChannels: state.chatChannels.map(ch => {
          const updatedChannel = ch;
          if (ch.sid === action.channelSid) {
            updatedChannel.messages = updatedChannel.messages.map(message => {
              const mappedMessage = message;
              if (mappedMessage.type === 'upload') {
                mappedMessage.progress = action.progress;
              }
              return mappedMessage;
            });
          }
          return updatedChannel;
        })
      };
    case CHAT_TYPES.UPLOADING_FILE_SUCCEEDED:
    case CHAT_TYPES.UPLOADING_FILE_FAILED:
      return {
        ...state,
        chatChannels: state.chatChannels.map(ch => {
          const updatedChannel = ch;
          if (ch.sid === action.channelSid) {
            updatedChannel.messages = updatedChannel.messages.filter(
              message => message.type !== 'upload'
            );
          }
          return updatedChannel;
        })
      };
    case CHAT_TYPES.REMOVE_CHANNEL:
      const { channelSid, uniqueName } = action;
      return {
        ...state,
        chatChannels: state.chatChannels.filter(ch => {
          return channelSid
            ? ch.sid !== channelSid
            : ch.uniqueName !== uniqueName;
        })
      };
    default:
      return state;
  }
}
