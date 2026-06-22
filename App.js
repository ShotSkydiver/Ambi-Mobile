/* eslint-disable no-underscore-dangle */
import React from 'react';
import { Platform, LogBox } from 'react-native';
// import FlexDebugging from 'react-native-flex-debugging';
import { Provider } from 'react-redux';
import {
  SafeAreaProvider,
  initialWindowMetrics
} from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import Main from './src/Main';
import rootReducer from './src/rootReducer';

Platform.select({
  android: () => {
    require('intl');
    require('intl/locale-data/jsonp/en');
    Intl.__disableRegExpRestore && Intl.__disableRegExpRestore();
  },
  ios: () => {
    // FlexDebugging.setNetworkLogging();
    // DevSettings.addMenuItem('Toggle FLEX Explorer', () => {
    // FlexDebugging.toggleExplorer();
    // });
  }
})();

LogBox.ignoreLogs(['Translation for']);

const store = window.__REDUX_DEVTOOLS_EXTENSION__
  ? createStore(
      rootReducer,
      compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__())
    )
  : createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ActionSheetProvider>
        <Provider store={store}>
          <Main />
        </Provider>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
};

export default App;
