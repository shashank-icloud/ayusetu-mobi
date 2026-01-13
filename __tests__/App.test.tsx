/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-gesture-handler', () => {
  return {
    GestureHandlerRootView: ({ children }: any) => require('react').createElement('View', null, children),
    State: {},
    PanGestureHandler: ({ children }: any) => require('react').createElement('View', null, children),
    TapGestureHandler: ({ children }: any) => require('react').createElement('View', null, children),
    __esModule: true,
    default: {},
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }: any) => React.createElement('View', null, children),
    SafeAreaView: ({ children }: any) => React.createElement('View', null, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    __esModule: true,
  };
});

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    NavigationContainer: ({ children }: any) => React.createElement('View', null, children),
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useRoute: () => ({ params: {} }),
    __esModule: true,
  };
});

jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: () => {
      return {
        Navigator: ({ children }: any) => require('react').createElement('View', null, children),
        Screen: ({ children }: any) => require('react').createElement('View', null, children),
      };
    },
    __esModule: true,
  };
});

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
