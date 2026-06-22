import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import i18n from 'format-message';
import { AmbiColors } from './contexts/themeContext';

const SearchContainer = styled(View)`
  flex: 1;
  justify-content: center;
  height: 36px;
`;

const Icon = styled(FeatherIcon)`
  width: 30px;
  position: absolute;
  top: 10px;
  left: 12px;
`;

const SearchInput = styled(TextInput)`
  padding: 0 36px;
  font-family: 'Circular-Book';
  font-size: 17px;
  line-height: 22px;
`;

const styles = StyleSheet.create({
  searchContainer: {
    borderRadius: 5,
    borderWidth: 0.5
    // shadowColor: 'rgba(0, 0, 0, 0.5)',
    // shadowOffset: { height: 0 },
    // shadowOpacity: 0.08,
    // shadowRadius: 0.82
  }
});

function Search(
  { autoFocus, placeholder, value, onChange, onChangeText, transparent, style },
  ref
) {
  const [isFocused, setIsFocused] = useState(false);
  const toggleInputFocus = () => setIsFocused(!isFocused);
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <SearchContainer
      style={[
        styles.searchContainer,
        {
          style,
          borderColor: transparent
            ? AmbiColors.transparent
            : themeColors.systemBorderColor,
          backgroundColor: transparent
            ? 'rgba(255, 255, 255, 0.2)'
            : isFocused
            ? themeColors.body
            : themeColors.searchBG
        }
      ]}
      transparent={transparent}
      isFocused={isFocused}
    >
      <Icon
        name="search"
        size={16}
        color={
          transparent
            ? '#ffffff'
            : isFocused
            ? AmbiColors.ambiBlue
            : themeColors.textPrimaryInactive
        }
        transparent={transparent}
      />
      <SearchInput
        ref={ref}
        placeholder={placeholder || i18n('Search ambi')}
        autoFocus={autoFocus}
        value={value}
        blurOnSubmit
        onChangeText={onChangeText}
        onChange={onChange}
        onFocus={toggleInputFocus}
        onBlur={toggleInputFocus}
        transparent={transparent}
        style={{
          color: transparent
            ? '#ffffff'
            : isFocused
            ? themeColors.textPrimary
            : themeColors.textPrimaryInactive
        }}
        placeholderTextColor={
          transparent
            ? 'rgba(255,255,255,0.87)'
            : isFocused
            ? themeColors.textPrimaryInactive
            : themeColors.textPrimaryInactive
        }
      />
    </SearchContainer>
  );
}

Search.propTypes = {
  autoFocus: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
};

Search.defaultProps = {
  autoFocus: false,
  placeholder: i18n('search'),
  value: '',
  onChange: null
};

const SearchWithForwardRef = forwardRef(Search);

export { SearchWithForwardRef as default };
