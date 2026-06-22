import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from 'format-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import PinIcon from './images/pin.svg';

const BottomSheetModal = styled(Modal)`
  justify-content: flex-end;
  margin: 0;
`;

const OptionsContainer = styled(View)`
  padding-horizontal: 16px;
  padding-top: 16px;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
`;

const OptionsHeading = styled(Text)`
  font-family: Circular-Bold;
  font-size: 16px;
  line-height: 20px;
`;

const ItemContainer = styled(View)`
  align-self: stretch;
  align-items: center;
  flex-direction: row;
  border-bottom-width: 0.5px;
  border-bottom-color: rgba(0, 0, 0, 0.1);
  height: 55px;
`;

const Icon = styled(FeatherIcon)`
  margin-right: 12px;
`;

const IconMaterial = styled(MaterialIcon)`
  margin-right: 12px;
`;

const ItemTitle = styled(Text)`
  font-size: 14px;
  font-family: Circular-Book;
  line-height: 18px;
`;

const OptionItem = ({ icon, title, onPress, imgUrl, iconMaterial }) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <TouchableOpacity onPress={onPress}>
      <ItemContainer>
        {imgUrl && (
          <Image
            source={{ uri: imgUrl }}
            style={{ width: 20, height: 24, marginRight: 14, marginLeft: 4 }}
          />
        )}
        {!imgUrl && iconMaterial && (
          <IconMaterial
            name={iconMaterial}
            size={24}
            style={{ color: themeColors.darkGreenColor }}
          />
        )}
        {!imgUrl && icon && (
          <Icon
            name={icon}
            size={24}
            style={{ color: themeColors.darkGreenColor }}
          />
        )}
        {!imgUrl && !icon && !iconMaterial && (
          <PinIcon
            width={20}
            height={24}
            fill={themeColors.darkGreenColor}
            style={{ marginRight: 14, marginLeft: 4 }}
          />
        )}
        <ItemTitle style={{ color: themeColors.textPrimary }}>
          {title}
        </ItemTitle>
      </ItemContainer>
    </TouchableOpacity>
  );
};

const SheetOptions = ({ options, title }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <OptionsContainer
      style={{
        paddingBottom: insets.bottom,
        backgroundColor: themeColors.body
      }}
    >
      <OptionsHeading style={{ color: themeColors.slateGray }}>
        {i18n('{title}', { title })}
      </OptionsHeading>
      {options.map(option => (
        <OptionItem key={option.title} {...option} />
      ))}
    </OptionsContainer>
  );
};

const BottomSheet = ({
  visible,
  options,
  title,
  toggle,
  backgroundColor,
  backgroundOpacity
}) => {
  return (
    <BottomSheetModal
      isVisible={visible}
      onBackdropPress={toggle}
      backdropColor={backgroundColor}
      backdropOpacity={backgroundOpacity}
      useNativeDriver
      hideModalContentWhileAnimating
      onSwipeComplete={toggle}
      animationOutTiming={500}
      swipeDirection="down"
    >
      <SheetOptions options={options} title={title} />
    </BottomSheetModal>
  );
};

BottomSheet.propTypes = {
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      imgUrl: PropTypes.string,
      onPress: PropTypes.func.isRequired,
      title: PropTypes.string.isRequired,
      iconMaterial: PropTypes.string
    })
  ).isRequired,
  backgroundColor: PropTypes.string,
  backgroundOpacity: PropTypes.number,
  toggle: PropTypes.func.isRequired
};

BottomSheet.defaultProps = {
  title: '',
  backgroundColor: 'rgb(29,33,41)',
  backgroundOpacity: 0.2
};

export default BottomSheet;
