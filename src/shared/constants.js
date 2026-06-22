import { Dimensions, Platform } from 'react-native';

export const IS_ANDROID = Platform.OS === 'android';
export const HEADER_BUTTON_SIZE = Platform.OS === 'ios' ? 22 : 25;
export const HEADER_BUTTON_MARGIN_INSET = Platform.OS === 'ios' ? 12 : 16;

export const APPBAR_HEIGHT = Platform.OS === 'ios' ? 50 : 56;

export const FEED_TOP_TABBAR_HEIGHT = 42;
export const HOME_HEADER_HEIGHT = 96 + (IS_ANDROID ? 12 : 0);
export const DEVICE_HEIGHT = Dimensions.get('window').height;
export const DEVICE_WIDTH = Dimensions.get('window').width;

export const hasTransparentStatus = currentRoute => {
  return ['Space', 'community', 'class', 'group', 'Auth', 'More'].includes(
    currentRoute
  );
};

export const hasTransparentNavBar = currentRoute => {
  return ['Space', 'community', 'class', 'group'].includes(currentRoute);
};

export const BUNDLE_ID = 'next.school.ambi';
export const AUTH0_DOMAIN = 'auth.ambinetwork.com';
// export const AUTH0_DOMAIN = 'auth.ambi.school';
export const AUTH0_CUSTOM_DOMAIN = 'ambi-cohoat.auth0.com';
export const AUTH0_REDIRECT_URI = `${BUNDLE_ID}://${AUTH0_DOMAIN}/${Platform.OS}/${BUNDLE_ID}/callback`;
export const AUTH0_CUSTOM_REDIRECT_URI = `${BUNDLE_ID}://${AUTH0_CUSTOM_DOMAIN}/${Platform.OS}/${BUNDLE_ID}/callback`;

export const DEFAULT_PROFILE_PIC =
  'https://static.ambi.school/images/ambi/default-profile-pic.png';
export const DEFAULT_COMMUNITY_AVATAR =
  'https://static.ambi.school/images/ambi/AmbiLogoAvatar.png';
export const DEFAULT_BANNER_COLOR = '#029EE2';

export const DEFAULT_COLORS = [
  '#E52B50',
  '#FFBF00',
  '#9966CC',
  '#FBCEB1',
  '#7FFFD4',
  '#007FFF',
  '#89CFF0',
  '#F5F5DC',
  '#0000FF',
  '#0095B6',
  '#8A2BE2',
  '#DE5D83',
  '#CD7F32',
  '#964B00',
  '#800020',
  '#702963',
  '#960018',
  '#DE3163',
  '#007BA7',
  '#F7E7CE',
  '#7FFF00',
  '#7B3F00',
  '#0047AB',
  '#6F4E37',
  '#B87333',
  '#FF7F50',
  '#DC143C',
  '#00FFFF',
  '#EDC9Af',
  '#7DF9FF',
  '#50C878',
  '#00FF3F',
  '#FFD700',
  '#808080',
  '#3FFF00',
  '#4B0082',
  '#FFFFF0',
  '#00A86B',
  '#29AB87',
  '#B57EDC',
  '#FFF700',
  '#C8A2C8',
  '#BFFF00',
  '#FF00FF',
  '#FF00AF',
  '#E0B0FF',
  '#CC7722',
  '#FF6600',
  '#FF4500',
  '#DA70D6',
  '#FFE5B4',
  '#D1E231',
  '#CCCCFF',
  '#1C39BB',
  '#FD6C9E',
  '#8E4585',
  '#003153',
  '#CC8899',
  '#800080',
  '#E30B5C',
  '#FF0000',
  '#C71585',
  '#FF007F',
  '#E0115F',
  '#FA8072',
  '#92000A',
  '#0F52BA',
  '#FF2400',
  '#C0C0C0',
  '#708090',
  '#A7FC00',
  '#00FF7F',
  '#D2B48C',
  '#483C32',
  '#008080',
  '#40E0D0',
  '#3F00FF',
  '#7F00FF',
  '#40826D',
  '#FFFFFF',
  '#FFFF00'
];
