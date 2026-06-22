import React from 'react';
import { View, Linking } from 'react-native';
import HTML from 'react-native-render-html';
import { useTheme } from '@react-navigation/native';

import { DEVICE_WIDTH } from './constants';

const alterChildren = otherNode => {
  const node = { ...otherNode };

  // v5 of react-native-render-html no longer supports iframe rendering
  // if we need iframe rendering in the future we should use this pacakge:
  // https://github.com/native-html/plugins/tree/master/packages/iframe-plugin#readme

  // if (node.name === 'iframe') {
  //   delete node.attribs.width;
  //   delete node.attribs.height;
  // }
  if (node.name === 'img' && node.attribs.width > 250) {
    delete node.attribs.width;
  }
  return node.children;
};
const HtmlRenderer = ({ content }) => {
  const theme = useTheme();
  const { legacy: colors } = theme;

  const BaseFontStyle = {
    fontFamily: 'Circular-Book',
    color: colors.label,
    fontSize: 14.5
  };

  const styles = {
    h1: {
      fontFamily: 'Circular-Bold',
      fontSize: 20,
      color: colors.label,
      lineHeight: 30,
      marginVertical: 6
    },
    p: {
      fontFamily: 'Circular-Book',
      fontSize: 14.5,
      color: colors.label,
      marginVertical: 12
    },
    em: {
      fontFamily: 'System',
      fontWeight: 'normal',
      color: colors.label,
      fontSize: 14.5
    },
    ol: {
      paddingLeft: 3,
      marginBottom: 1.5
    },
    ul: {
      paddingLeft: 3,
      marginBottom: 1.5
    },
    i: {
      fontFamily: 'System',
      fontWeight: 'normal',
      color: colors.label,
      fontSize: 14.5
    },
    img: {
      borderRadius: 10
    }
    // iframe: {
    //   height: DEVICE_WIDTH - 60
    // }
  };
  return (
    <View style={{ flex: 1 }}>
      <HTML
        tagsStyles={styles}
        alterChildren={alterChildren}
        source={{ html: content }}
        baseFontStyle={BaseFontStyle}
        computeEmbeddedMaxWidth={(contentWidth, tagName) => {
          return tagName === 'img' ? DEVICE_WIDTH - 32 : DEVICE_WIDTH - 20;
        }}
        onLinkPress={(event, href) => {
          Linking.openURL(href);
        }}
      />
    </View>
  );
};

export default HtmlRenderer;
