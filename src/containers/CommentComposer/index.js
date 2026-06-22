/**
 * CommentComposer
 */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef, useReducer, useCallback } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { v4 as uuid } from 'uuid';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { useTheme } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import { useSelector } from 'react-redux';

// components
import Avatar from '../../shared/Avatars';
import LinkPreview from '../../shared/LinkPreview';
import CommentText from '../../components/CommentText';
import CenteredIcon from '../../shared/CenteredIcon';
import AttachmentPicker from '../../shared/AttachmentPicker';
import CardAttachmentPreview from '../../components/CardAttachmentPreview';

// manage state
import {
  reducers,
  initialState,

  // actions
  resetState,
  loadComment,
  setAttachments,
  setCommentText,
  removeAttachment,
  setLinkPreviewAttributes
} from './reducers';

// helpers
import { normalizeUser } from '../../Profile/utils';
import { contentIsOnlyEmojis } from '../../shared/utils/helpers';

// Images
import IconSend from '../../shared/images/ic_send.svg';

// constants
import { DEFAULT_PROFILE_PIC } from '../../shared/constants';
import { AmbiColors } from '../../shared/contexts/themeContext';

const Container = styled(View)`
  width: 100%;
  flex-direction: column;
`;

const ContentInput = styled(View)`
  min-height: 30px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
`;

const Input = styled(TextInput)`
  flex: 1;
  font-size: 14px;
  margin-top: 5px;
  min-height: 25px;
  max-height: 150px;
  font-weight: 300;
  font-family: Circular;
  line-height: 18px;
  margin-bottom: 5px;
  padding-right: 15px;
  padding-vertical: 5px;
`;

const ParentButton = styled(TouchableOpacity)`
  height: 30px;
  display: flex;
  margin-top: 8px;
  justify-content: center;
`;

const ContentBody = styled(View)`
  padding-left: ${({ paddingLeft }) => (paddingLeft ? '50px' : '0')};
  padding-bottom: ${({ paddingBottom }) => (paddingBottom ? '10px' : '0')};
`;

const ContentFiles = styled(View)`
  position: relative;
  margin-top: 5px;
  min-height: 90px;
`;

const ContentLinkPreview = styled(View)`
  overflow: hidden;
  position: relative;
`;

const SimpleLineButtons = styled(SimpleLineIcon)`
  display: flex;
  margin-top: 10px;
  margin-left: 17px;
`;

const ButtonSend = styled(IconSend)`
  min-width: 24px;
  min-height: 24px;
`;

const AvatarComment = styled(Avatar)`
  width: 30px;
  display: flex;
  align-self: center;
  margin-right: 16px;
`;

const pickAttachment = new AttachmentPicker();

const CommentComposer = ({
  style,
  action,
  comment,
  inputProps,
  showAvatar,
  parentIdForReply,

  // prop actions
  onSave,
  onCancel
}) => {
  const isOnlyEmoji = contentIsOnlyEmojis(comment?.body || '');

  const [localState, dispatch] = useReducer(reducers, initialState);
  const { attachments, commentText, linkPreviewAttributes } = localState;

  const inputRef = useRef(null);
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const userAuth = useSelector(state => state.auth.user) || {};
  const userData = normalizeUser(userAuth);
  const { avatarUrl, avatarMedia } = userData;
  const userAvatar = avatarMedia || avatarUrl || DEFAULT_PROFILE_PIC;

  const localInputProps = {
    ...inputProps,
    style: { color: themeColors.textPrimary },
    selectionColor: AmbiColors.razzmatazz,
    placeholderTextColor: themeColors.slateGray
  };

  /** load comment values */
  useEffect(() => {
    if (action === 'edit' && inputRef && inputRef.current) {
      inputRef.current.focus();
    }

    if (action === 'edit' || action === 'readonly') {
      if (comment) {
        const {
          body: oldBody = '',
          linkPreviewAttributes: oldLinkPreviewAttributes = {},
          postCommentAttachments: oldAttachments = []
        } = comment || {};

        const loadAttachments = (oldAttachments || []).map(item => {
          if (item?.links?.content) {
            return {
              ...item,
              type: item.contentType,
              path: item.links.content
            };
          }

          return { ...item, type: item.contentType };
        });

        loadComment(dispatch, {
          commentText: oldBody,
          attachments: loadAttachments,
          linkPreviewAttributes: oldLinkPreviewAttributes || {}
        });
      }
    }
  }, [action, comment]);

  const _loadFiles = async () => {
    try {
      const file = await pickAttachment.pick();

      const formatImages = [
        {
          ...file,
          path:
            file.localPath ||
            `${file.sourceURL || file.uri}`.replace('file://', ''),
          filename: file.filename || file.name,
          type: file.type || file.mime,
          uniqueIdentifier: uuid()
        }
      ];

      console.warn('wtf: ', formatImages);

      setAttachments(dispatch, formatImages);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.warn('cancel picker file', err);
      } else {
        throw err;
      }
    }
  };

  const _onChangeText = useCallback(
    val => setCommentText(dispatch, val),
    [dispatch]
  );
  const _handleLinkPreview = useCallback(
    val => setLinkPreviewAttributes(dispatch, val),
    [dispatch]
  );

  const _onSave = useCallback(() => {
    const canPost = attachments.length > 0 || commentText.length;
    if (!canPost) {
      return;
    }
    const commentBody = {
      comment: {
        body: commentText,
        attachments,
        linkPreviewAttributes
      }
    };

    if (comment) {
      const { id: oldCommentId, parentPostCommentId: oldParentPostCommentId } =
        comment;
      commentBody.comment.id = oldCommentId;
      commentBody.comment.parentPostCommentId = oldParentPostCommentId;
    }

    if (parentIdForReply > 0) {
      commentBody.comment.parentPostCommentId = parentIdForReply;
    }

    if (onSave) {
      onSave(commentBody);
      resetState(dispatch);
      if (inputRef && inputRef.current) {
        inputRef.current.blur();
      }
    }
  }, [dispatch, commentText, attachments, linkPreviewAttributes]);

  const _onCancelEdit = useCallback(() => {
    if (!onCancel) {
      return;
    }
    resetState(dispatch);
    onCancel();
  }, [onCancel]);

  const _onRemove = useCallback(itemKey => {
    removeAttachment(dispatch, itemKey);
  }, []);

  let actionRemove = null;
  if (action === 'create' || action === 'edit') {
    actionRemove = _onRemove;
  }

  return (
    <Container style={style}>
      {/** Show comment text for readonly option */}
      {action === 'readonly' && commentText !== '' && (
        <CommentText
          text={commentText}
          styleText={{
            color: themeColors.darkGreenColor,
            fontSize: isOnlyEmoji ? 40 : 15,
            paddingTop: isOnlyEmoji ? 30 : 0
          }}
        />
      )}

      {action !== 'readonly' && (
        <ContentInput>
          {showAvatar && <AvatarComment url={userAvatar} size={34} />}
          <Input
            ref={inputRef}
            value={commentText}
            multiline
            textAlignVertical="top"
            onChangeText={_onChangeText}
            selectionColor={AmbiColors.razzmatazz}
            placeholderTextColor={themeColors.slateGray}
            {...localInputProps}
          />

          {/** buttons for create option */}
          {onSave && action === 'create' && (
            <>
              <ParentButton onPress={_loadFiles} style={{ marginLeft: 5 }}>
                <CenteredIcon
                  name="plus-circle"
                  size={24}
                  color={themeColors.textDisabled}
                />
              </ParentButton>

              <ParentButton
                onPress={_onSave}
                style={{ marginLeft: 15, marginRight: 5 }}
              >
                <ButtonSend
                  width={24}
                  height={24}
                  stroke={
                    attachments.length > 0 || commentText.length
                      ? AmbiColors.ambiBlue
                      : themeColors.textDisabled
                  }
                  strokeWidth={2}
                />
              </ParentButton>
            </>
          )}

          {/** buttons for edit option */}
          {onSave && action === 'edit' && (
            <>
              <ParentButton onPress={_loadFiles} style={{ marginLeft: 5 }}>
                <CenteredIcon
                  name="plus-circle"
                  size={24}
                  color={themeColors.slateGray}
                />
              </ParentButton>

              {onCancel && (
                <SimpleLineButtons
                  name="close"
                  size={22}
                  color={AmbiColors.destructive}
                  style={{ marginLeft: 15 }}
                  onPress={_onCancelEdit}
                />
              )}
              <SimpleLineButtons
                name="check"
                size={22}
                color={AmbiColors.positive}
                style={{ marginLeft: 15, marginRight: 5 }}
                onPress={_onSave}
              />
            </>
          )}
        </ContentInput>
      )}

      <ContentBody
        paddingLeft={showAvatar && action === 'create'}
        paddingBottom={action === 'create' || action === 'edit'}
      >
        {/** Attachments cards */}
        {attachments && attachments.length > 0 && (
          <ContentFiles>
            {attachments.map(file => (
              <CardAttachmentPreview
                key={`card-file-${file.id || file.uniqueIdentifier}`}
                attachment={file}
                onRemove={actionRemove}
                cardImageProps={{
                  imageStyle: {
                    width: 160,
                    height: 110
                  }
                }}
              />
            ))}
          </ContentFiles>
        )}

        {/** LinkPreview content */}
        <ContentLinkPreview>
          <LinkPreview
            containedIn="comment"
            textContent={commentText}
            isCreatedPreview={action === 'readonly'}
            linkPreviewProps={linkPreviewAttributes}
            handleLinkPreview={_handleLinkPreview}
          />
        </ContentLinkPreview>
      </ContentBody>
    </Container>
  );
};

CommentComposer.propTypes = {
  style: PropTypes.shape(),
  action: PropTypes.oneOf(['create', 'edit', 'readonly']),
  showAvatar: PropTypes.bool,
  inputProps: PropTypes.shape({
    placeholder: PropTypes.string
  }),
  parentIdForReply: PropTypes.number,

  // actions
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};

CommentComposer.defaultProps = {
  style: {},
  action: 'create',
  showAvatar: true,
  inputProps: {},
  parentIdForReply: null,

  // actions
  onSave: null,
  onCancel: null
};

export default CommentComposer;
