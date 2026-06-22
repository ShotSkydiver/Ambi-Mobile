/* eslint-disable react/display-name */
import React from 'react';
import { HeaderStyleInterpolators } from '@react-navigation/stack';
import { useTheme } from '@react-navigation/native';

import Spaces from './index';
import Space from './SpaceItem/index';
import SpaceItem from './SpaceItem/SpaceItem';
import SpaceDetails from './SpaceItem/SpaceDetails';
import { NativeStack, Stack, SlideTransition } from '../Navigation/Navigators';
import { IconHeaderButtons, Item } from '../shared/HeaderButtons';

export function SpaceStackNavigator({ route }) {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  const spaceHeaderOptions = {
    headerTitle: null,
    headerStyleInterpolator: HeaderStyleInterpolators.forFade,
    headerTintColor: themeColors.textPrimary
  };
  const spaceItem = route.params?.spaceItem;

  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerTintColor: themeColors.textPrimary,
        cardStyleInterpolator: SlideTransition
      })}
    >
      <Stack.Screen
        component={Space}
        name="Space"
        options={spaceHeaderOptions}
        initialParams={{ spaceItem }}
      />

      <Stack.Screen
        name="RelatedSpace"
        component={Space}
        options={spaceHeaderOptions}
      />

      <Stack.Screen
        name="Details"
        component={SpaceDetails}
        options={{
          headerTitle: `Details`
        }}
      />
      <Stack.Screen name="About" component={SpaceItem} />
      <Stack.Screen
        name="Members"
        component={SpaceItem}
        options={{
          title: route.params?.title
        }}
      />
      <Stack.Screen name="Related Spaces" component={SpaceItem} />
    </Stack.Navigator>
  );
}

function SpacesStackNavigator() {
  const theme = useTheme();
  const { legacy: themeColors } = theme;
  return (
    <NativeStack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerTitle: route.name === 'Spaces' ? route.name : `All ${route.name}`,
        headerStyle: {
          backgroundColor: themeColors.backgroundColor,
          blurEffect: 'prominent'
        },
        headerHideShadow: true,
        headerTintColor: themeColors.textPrimary,
        headerRight: () => {
          const isSpacesMain = route.name === 'Spaces';
          const isAllGroups = route.name === 'Groups';
          return (
            (isSpacesMain || isAllGroups) && (
              <IconHeaderButtons useLeftHeader>
                <Item
                  title="New"
                  iconName="add"
                  color={themeColors.textPrimary}
                  onPress={() =>
                    navigation.navigate('NativeModalNavigator', {
                      screen: 'CreateGroupScreen'
                    })
                  }
                />
              </IconHeaderButtons>
            )
          );
        }
      })}
    >
      <NativeStack.Screen name="Spaces" component={Spaces} />
      <NativeStack.Screen name="Communities" component={Spaces} />
      <NativeStack.Screen name="Classes" component={Spaces} />
      <NativeStack.Screen name="Groups" component={Spaces} />
      <NativeStack.Screen
        name="Space"
        component={SpaceStackNavigator}
        options={{ headerShown: false }}
      />
    </NativeStack.Navigator>
  );
}

export default SpacesStackNavigator;
