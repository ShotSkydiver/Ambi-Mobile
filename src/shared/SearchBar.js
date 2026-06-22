import React, { forwardRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import i18n from 'format-message';
import { useTheme } from '@react-navigation/native';
import Search from './Search';

const SearchBarContainer = styled(View)`
  height: 52px;
  padding-bottom: 8px;
  padding-top: 6px;
  padding-horizontal: 16px;
`;

function SearchBar(props, ref) {
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  let platformStyles;
  if (Platform.OS === 'ios') {
    platformStyles = {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: themeColors.systemBorderColor
    };
  } else {
    platformStyles = {
      shadowColor: 'black',
      shadowOpacity: 0.1,
      shadowRadius: StyleSheet.hairlineWidth,
      shadowOffset: {
        height: StyleSheet.hairlineWidth
      },
      elevation: 4
    };
  }

  const styles = StyleSheet.create({
    headerContainer: {
      ...platformStyles
    }
  });

  return (
    <SearchBarContainer
      style={[
        styles.headerContainer,
        { backgroundColor: themeColors.backgroundColor }
      ]}
    >
      <Search {...props} ref={ref} />
    </SearchBarContainer>
  );
}

SearchBar.propTypes = {
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

SearchBar.defaultProps = {
  autoFocus: false,
  placeholder: i18n('search'),
  value: '',
  onChange: null
};

const SearchBarWithForwardRef = forwardRef(SearchBar);

export { SearchBarWithForwardRef as default };
