import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Feather';
import i18n from 'format-message';
import {
  getNotebookItems,
  getNotebookMembers,
  deleteNotebookItem
} from './redux/actions';
import HRLine from '../shared/HRLine';
import EmptyState from '../shared/EmptyState';

const Container = styled(View)`
  flex: 1;
`;

const NotebookItem = styled(View)`
  flex: 1;
  flex-direction: row;
  height: 74px;
`;

const ListHeader = styled(Text)`
  color: #707689;
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
`;

const NotesFilesList = styled(FlatList)`
  padding: 16px;
`;

const ItemTitle = styled(Text)`
  color: #1d2129;
  font-family: Circular-Bold;
  font-size: 14px;
  line-height: 24px;
  margin-left: 16px;
`;

const SingleNotebookScreen = ({
  notebooks,
  navigation,
  route,
  getNotebookItems
  // deleteNotebookItem
}) => {
  const [setActiveNotebookItem] = useState(null);
  const notebookId = route.params?.notebookId;
  const notebook = notebooks[notebookId];

  useEffect(() => {
    if (notebook) {
      getNotebookItems(notebook);
      getNotebookMembers(notebook);
    }
  }, []);

  useEffect(() => {
    navigation.setParams({ notebookTitle: (notebook && notebook.title) || '' });
  }, [notebook]);

  const renderNotebookItem = item => {
    const isFile = !!item.fileName;
    const title = isFile ? item.fileName : item.title;
    return (
      <NotebookItem>
        <Icon name={isFile ? 'file' : 'file-text'} size={24} />
        <ItemTitle>{title}</ItemTitle>
        <Icon
          name="more-horizontal"
          size={24}
          color="#707689"
          onPress={() => {
            setActiveNotebookItem(item);
          }}
        />
      </NotebookItem>
    );
  };

  const noNotesMsg = i18n('No notes or files found...!');

  const NotebookNotesFiles = ({ items }) => (
    <NotesFilesList
      data={items}
      renderItem={({ item }) => renderNotebookItem(item)}
      ItemSeparatorComponent={() => <HRLine />}
      ListHeaderComponent={() => <ListHeader>Notes and files</ListHeader>}
      ListEmptyComponent={() => <EmptyState title={noNotesMsg} />}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => (item.id ? item.id.toString() : index)}
    />
  );

  // const onOptionClick = index => {
  //   const title = notebookItemOptions[index];
  //   if (title === 'delete' && !!activeNotebookItem) {
  //     deleteNotebookItem(notebookId, activeNotebookItem.id);
  //   }
  // };

  if (notebook && notebook.files && notebook.notes) {
    const notesAndFiles = (Object.values(notebook.notes) || []).concat(
      Object.values(notebook.files) || []
    );
    return (
      <Container>
        {notesAndFiles && notesAndFiles.length > 0 && (
          <NotebookNotesFiles items={notesAndFiles} />
        )}
      </Container>
    );
  }
  return null;
};

// SingleNotebookScreen.navigationOptions = navigationOptions({
//   title: ({ navigation }) => route.params?.notebookTitle,
//   backgroundColor: '#ed1d7a',
//   foregroundColor: 'white'
// });

export default connect(
  state => ({
    notebooks: state.notebooks
  }),
  { getNotebookItems, deleteNotebookItem }
)(SingleNotebookScreen);
