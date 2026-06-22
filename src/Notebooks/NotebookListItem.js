import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import i18n from 'format-message';
import { AvatarGroup } from '../shared/Avatars';

const Container = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  height: 74px;
`;

const ColorStrip = styled(View)`
  width: 8px;
  height: 74px;
  background-color: ${({ color }) => color || '#ffffff'};
`;

const AvatarsContainer = styled(AvatarGroup)`
  margin: 0 16px;
`;

const NotebookInfo = styled(View)``;
const Title = styled(Text)`
  color: #1d2129;
  font-family: Circular-bold;
  font-size: 14px;
  line-height: 24px;
`;

const OtherInfo = styled(View)`
  flex-direction: row;
`;

const InfoText = styled(Text)`
  color: #8a90a2;
  font-family: Circular-Book;
  font-size: 12px;
  line-height: 15px;
  margin-right: 8px;
`;

const NotesCount = styled(InfoText)``;
const FilesCount = styled(InfoText)``;

const NotebookListItem = ({ notebook, navigateToNotebook }) => {
  const { notesCount, filesCount, title } = notebook;
  return (
    <Container onPress={navigateToNotebook}>
      <ColorStrip color={notebook.clientColor.hexValue} />
      <AvatarsContainer urls={[{ url: notebook.createdBy.user.avatarUrl }]} />
      <NotebookInfo>
        <Title>{title}</Title>
        <OtherInfo>
          <NotesCount>
            {notesCount} {notesCount === 1 ? i18n('note') : i18n('notes')} .
          </NotesCount>
          <FilesCount>
            {filesCount} {filesCount === 1 ? i18n('file') : i18n('files')}
          </FilesCount>
        </OtherInfo>
      </NotebookInfo>
    </Container>
  );
};

export default NotebookListItem;
