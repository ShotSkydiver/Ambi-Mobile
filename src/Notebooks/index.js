import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import styled from 'styled-components';
import i18n from 'format-message';

import { getNotebooks } from './redux/actions';
import NotebookListItem from './NotebookListItem';
import HRLine from '../shared/HRLine';
import SearchBar from '../shared/SearchBar';

const NotebooksContainer = styled(View)`
  flex: 1;
`;
const NotebooksList = styled(FlatList)``;

const NotebooksMain = ({ notebooks, getNotebooks, navigation }) => {
  const [currentPage] = useState(1);
  useEffect(() => {
    getNotebooks(currentPage);
  }, []);

  return (
    <NotebooksContainer>
      <SearchBar
        placeholder={i18n('Search notebooks')}
        onChangeText={() => {}}
      />
      <NotebooksList
        data={Object.values(notebooks)}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <HRLine />}
        renderItem={({ item }) => (
          <NotebookListItem
            notebook={item}
            key={item.id}
            navigateToNotebook={() =>
              navigation.navigate('SingleNotebookScreen', {
                notebookId: item.id
              })
            }
          />
        )}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index)}
      />
    </NotebooksContainer>
  );
};

const mapStateToProps = state => ({
  notebooks: state.notebooks
});

export default connect(mapStateToProps, { getNotebooks })(NotebooksMain);
