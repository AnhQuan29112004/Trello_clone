/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';

import { enGB, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en-GB', enGB)
AppRegistry.registerComponent(appName, () => App);
