import React, { useEffect, useRef } from 'react';
import { View, Image, StatusBar, Text } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import styled from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'format-message';
import { ActionButton, LineButton, Spacer } from './shared';
import { AmbiColors } from '../shared/contexts/themeContext';
import HeroImage from './images/hero.png';
import FistBump from './images/fist-bump.svg';
import Blocks from './images/blocks.png';
import Network from './images/network.png';

const Container = styled(View)`
  position: relative;
`;

const SignUpOrLoginText = styled(Text)`
  height: 60px;
  width: 301px;
  color: #ffffff;
  font-family: Circular-Bold;
  font-size: 16px;
  letter-spacing: 0;
  line-height: 20px;
  text-align: center;
`;

const OnboardingView = ({ navigation }) => {
  const refOnboarding = useRef(null);
  const pageColors = [
    AmbiColors.ambiBlue,
    AmbiColors.focusMode,
    AmbiColors.positive,
    AmbiColors.razzmatazz
  ];

  const changePageIndex = pageIndex => {
    if (pageIndex === 3) {
      AsyncStorage.setItem('isSkipped', 'true');
    }
  };

  const onSkip = () => {
    AsyncStorage.setItem('isSkipped', 'true');
  };

  useEffect(() => {
    AsyncStorage.getItem('isSkipped').then(isSkipped => {
      if (isSkipped) {
        refOnboarding?.current?.flatList?.scrollToIndex({ index: 3 });
      }
    });
  }, []);

  const navigateTo = route => () => {
    navigation.navigate(route);
  };

  return (
    <View style={{ flex: 1 }}>
      <Onboarding
        ref={refOnboarding}
        showDone={false}
        skipToPage={3}
        onSkip={onSkip}
        titleStyles={{ fontFamily: 'Circular-Bold' }}
        subTitleStyles={{ fontFamily: 'Circular-Book' }}
        containerStyles={{ paddingHorizontal: 16 }}
        imageContainerStyles={{ paddingBottom: 30 }}
        pageIndexCallback={changePageIndex}
        pages={[
          {
            title: 'The future of learning starts here',
            subtitle:
              'Ambi helps every student stay more engaged, so they can succeed in school -- and beyond.',
            backgroundColor: pageColors[0],
            image: (
              <Image
                source={HeroImage}
                style={{ resizeMode: 'contain', height: 180 }}
              />
            )
          },
          {
            title: 'Available to Anyone, Anywhere, Anytime',
            subtitle:
              'Accessible on any device, customized to how you want to learn.',
            backgroundColor: pageColors[1],
            image: <FistBump height={140} fill="white" />
          },
          {
            title: 'A Broad Range of Topics and Interests',
            subtitle:
              'Not just academic topics; we cover a broad range of topics from artisanal cheesemaking to quantum physics.',
            backgroundColor: pageColors[2],
            image: (
              <Image
                source={Blocks}
                style={{ resizeMode: 'contain', height: 140 }}
              />
            )
          },
          {
            title: "Let's Get Started!",
            subtitle: (
              <Container style={{ paddingHorizontal: 8, width: '100%' }}>
                <View style={{ alignItems: 'center', marginBottom: 8 }}>
                  <SignUpOrLoginText>
                    Want to join ambi? Sign up with your email today! Or, if you
                    already have an existing account just sign in below:{' '}
                  </SignUpOrLoginText>
                </View>
                <Spacer height="14px" />
                <ActionButton
                  title={i18n('Create a New Account')}
                  onPress={navigateTo('SignUpStackNavigator')}
                  useWhiteStyle
                />
                <Spacer height="16px" />
                <LineButton
                  title={i18n('Login to Ambi')}
                  onPress={navigateTo('LoginStackNavigator')}
                  useWhiteStyle
                />
              </Container>
            ),
            backgroundColor: pageColors[3],
            image: (
              <Image
                source={Network}
                style={{ resizeMode: 'contain', height: 160 }}
              />
            )
          }
        ]}
      />
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
    </View>
  );
};

export default OnboardingView;
