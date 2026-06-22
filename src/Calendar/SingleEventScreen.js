import React from 'react';
import moment from 'moment';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { useTheme } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

const Container = styled(View)`
  flex: 1;
  padding: 16px;
`;

const HeaderContainer = styled(View)`
  height: 160px;
  position: relative;
`;

const HeaderButtons = styled(View)`
  flex-direction: row;
  position: absolute;
  z-index: 2;
  top: 20px;
  font-size: 17px;
  font-family: Circular-Book;
  padding-horizontal: 16;
`;

const BackButtonWrapper = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const Title = styled(Text)`
  font-family: Circular-Bold;
  font-size: 20px;
  letter-spacing: 0;
  line-height: 25px;
  margin-bottom: 8px;
`;

const SubHeading = styled(Text)`
  font-family: Circular-Book;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 18px;
`;

const Icon = styled(Feather)`
  margin-right: 8px;
`;

const InfoRow = styled(View)`
  flex-direction: row;
  margin: 8px 0;
`;

const DateBlock = styled(View)`
  height: 72px;
  width: 72px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;
  align-items: center;
  padding: 8px;
`;

const Month = styled(Text)`
  font-family: circular-bold;
  font-size: 14px;
  letter-spacing: 0;
  opacity: 0.6;
  line-height: 16px;
  text-align: center;
  color: #000000;
`;

const Day = styled(Text)`
  color: #1d2129;
  font-family: circular-bold;
  font-size: 36px;
  letter-spacing: 0;
  line-height: 46px;
`;

function SingleEventScreen({ navigation, route }) {
  const event = route.params?.event;
  const {
    title,
    color: { hexValue },
    description,
    startDatetime,
    createdBy: { class: cls, group, community, user: createdByUser }
  } = event;
  const theme = useTheme();
  const { legacy: themeColors } = theme;

  const createdBySpace = cls || group || community;
  let eventCreatedBy = '';
  if (createdBySpace) {
    eventCreatedBy = createdBySpace.name;
  } else {
    eventCreatedBy = createdByUser.firstName;
  }

  const Header = () => {
    return (
      <HeaderContainer style={{ backgroundColor: hexValue }}>
        <HeaderButtons>
          <BackButtonWrapper onPress={navigation.goBack}>
            <Icon
              name="chevron-left"
              size={24}
              color="#ffffff"
              style={{ marginRight: 0, marginTop: 1 }}
            />
            <Text style={{ color: '#ffffff', fontSize: 17 }}>Calendar</Text>
          </BackButtonWrapper>
          {/* <Icon name="more-horizontal" size={20} color="#ffffff" /> */}
        </HeaderButtons>
      </HeaderContainer>
    );
  };

  return (
    <>
      <Header />
      <Container style={{ backgroundColor: themeColors.body }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Title style={{ color: themeColors.textPrimary }}>{title}</Title>
            <SubHeading>Event by {eventCreatedBy}</SubHeading>
            <View style={{ marginTop: 16 }}>
              <InfoRow>
                <Icon name="clock" size={20} />
                <Text>{moment(startDatetime).format('ddd, MMM D')}</Text>
              </InfoRow>
              <InfoRow>
                <Icon name="map-pin" size={20} />
                <Text>no location</Text>
              </InfoRow>
            </View>
          </View>
          <DateBlock>
            <Month>{moment(startDatetime).format('MMM')}</Month>
            <Day>{moment(startDatetime).format('D')}</Day>
          </DateBlock>
        </View>
        {description && description.length > 0 && <Text>{description}</Text>}
        <StatusBar backgroundColor={hexValue || '#000000'} />
      </Container>
    </>
  );
}

export default SingleEventScreen;
