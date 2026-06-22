/**
 * reducers from CommentComposer
 */

export const initialState = {
  attachments: [],
  commentText: '',
  loadAttachments: false,
  hasLinkPreview: false,
  linkPreviewAttributes: {}
};

export const POST_COMMENT_TYPES = {
  RESET_STATE: 'CONTAINERS/COMMENT_COMPOSER/RESET_STATE',
  LOAD_COMMENT: 'CONTAINERS/COMMENT_COMPOSER/LOAD_COMMENT',
  SET_ATTACHMENTS: 'CONTAINERS/COMMENT_COMPOSER/SET_ATTACHMENTS',
  ADD_ATTACHMENTS: 'CONTAINERS/COMMENT_COMPOSER/ADD_ATTACHMENTS',
  REMOVE_ATTACHMENTS: 'CONTAINERS/COMMENT_COMPOSER/REMOVE_ATTACHMENTS',
  SET_COMMENT_TEXT: 'CONTAINERS/COMMENT_COMPOSER/SET_COMMENT_TEXT',
  SET_LINK_PREVIEW_ATTRIBUTES:
    'CONTAINERS/COMMENT_COMPOSER/SET_LINK_PREVIEW_ATTRIBUTES'
};

export const reducers = (state, action) => {
  switch (action.type) {
    case POST_COMMENT_TYPES.RESET_STATE:
      return {
        ...initialState
      };

    case POST_COMMENT_TYPES.LOAD_COMMENT:
      return {
        ...state,
        ...action.comment
      };

    case POST_COMMENT_TYPES.SET_ATTACHMENTS:
      return {
        ...state,
        attachments: action.attachments
      };

    case POST_COMMENT_TYPES.ADD_ATTACHMENTS:
      return {
        ...state,
        attachments: [...state.attachments, ...action.attachments]
      };

    case POST_COMMENT_TYPES.REMOVE_ATTACHMENT:
      const { removeKey } = action;
      return {
        ...state,
        attachments: [...state.attachments].filter(
          attachment =>
            attachment.id !== removeKey &&
            attachment.uniqueIdentifier !== removeKey
        )
      };

    case POST_COMMENT_TYPES.SET_COMMENT_TEXT:
      return {
        ...state,
        commentText: action.commentText
      };

    case POST_COMMENT_TYPES.SET_LINK_PREVIEW_ATTRIBUTES:
      return {
        ...state,
        linkPreviewAttributes: action.linkPreviewAttributes
      };

    default:
      return state;
  }
};

export const resetState = dispatch =>
  dispatch({ type: POST_COMMENT_TYPES.RESET_STATE, initialState });

export const loadComment = (dispatch, comment) =>
  dispatch({ type: POST_COMMENT_TYPES.LOAD_COMMENT, comment });

export const setAttachments = (dispatch, attachments) =>
  dispatch({ type: POST_COMMENT_TYPES.SET_ATTACHMENTS, attachments });

export const addAttachments = (dispatch, attachments) =>
  dispatch({ type: POST_COMMENT_TYPES.ADD_ATTACHMENTS, attachments });

export const removeAttachment = (dispatch, removeKey) => {
  dispatch({ type: POST_COMMENT_TYPES.REMOVE_ATTACHMENT, removeKey });
};

export const setCommentText = (dispatch, commentText) =>
  dispatch({ type: POST_COMMENT_TYPES.SET_COMMENT_TEXT, commentText });

export const setLinkPreviewAttributes = (dispatch, linkPreviewAttributes) =>
  dispatch({ type: POST_COMMENT_TYPES.SET_LINK_PREVIEW_ATTRIBUTES, linkPreviewAttributes }); // eslint-disable-line
