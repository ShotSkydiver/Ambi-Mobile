import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import styled from 'styled-components';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '@react-navigation/native';
import { ActionButton, Spacer } from './shared';

const Container = styled(View)`
  flex: 1;
  justify-content: center;
`;

const InfoTitle = styled(Text)`
  font-family: Circular-Bold;
  font-size: 17px;
  line-height: 22px;
  text-align: center;
  margin-bottom: 8px;
`;

const InfoSummary = styled(Text)`
  opacity: 0.6;
  font-family: Circular-Book;
  font-size: 16px;
  line-height: 20px;
  text-align: center;
`;

const SSOFail = ({ navigation }) => {
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  return (
    <Container style={{ backgroundColor: themeColors.backgroundColor }}>
      <FontAwesome
        name="times"
        size={60}
        color={themeColors.error}
        solid
        style={{ textAlign: 'center' }}
      />
      <Spacer height="12px" />
      <View style={{ paddingHorizontal: 65 }}>
        <InfoTitle style={{ color: themeColors.slateGray }}>
          Something went wrong
        </InfoTitle>
        <InfoSummary style={{ color: themeColors.textPrimary }}>
          Sorry, we could not log you into ambi at this time.
        </InfoSummary>
      </View>
      <View style={{ paddingHorizontal: 25 }}>
        <Spacer height="40px" />
        <ActionButton
          title="Back to login"
          onPress={() => navigation.popToTop()}
        />
        <Spacer height="22px" />
      </View>
    </Container>
  );
};

SSOFail.propTypes = {
  navigation: PropTypes.shape({}).isRequired
};

export default SSOFail;
