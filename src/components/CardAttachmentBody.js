/**
 * CardAttachmentBody
 */
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const Container = styled(View)`
  flex: 1;
  overflow: hidden;
  max-width: 170px;
  max-height: 120px;
  padding-top: 2px;
  margin-right: 16px;
  padding-right: 4px;
`;

const ContainerRemove = styled(View)`
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border: 0.5px solid;
  z-index: 1;
  display: flex;
  position: absolute;
  align-items: center;
  border-radius: 24px;
  justify-content: center;
`;

const CardAttachmentBody = ({
  style,
  children,
  styleButtonRemove,

  // action
  onRemove
}) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <Container style={style}>
      {onRemove && (
        <ContainerRemove
          style={{
            borderColor: themeColors.systemBorderColor,
            backgroundColor: themeColors.backgroundColor
          }}
        >
          <FeatherIcon
            name="x"
            size={16}
            color={themeColors.darkGreenColor}
            style={styleButtonRemove}
            onPress={onRemove}
          />
        </ContainerRemove>
      )}
      {children}
    </Container>
  );
};

CardAttachmentBody.propTypes = {
  style: PropTypes.shape(),
  children: PropTypes.node,
  styleButtonRemove: PropTypes.shape(),

  // action
  onRemove: PropTypes.func
};

CardAttachmentBody.defaultProps = {
  style: {},
  children: null,
  styleButtonRemove: {},

  // action
  onRemove: null
};

export default CardAttachmentBody;
