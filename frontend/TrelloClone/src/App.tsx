import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import {
  DefaultTheme as PaperDefaultTheme,
  MD3DarkTheme as PaperDarkTheme,
  PaperProvider,
  Text,
} from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const LightTheme = {
    ...PaperDefaultTheme,
    colors: {
      ...PaperDefaultTheme.colors,
      primary: '#0079BF', // Trello Blue
      accent: '#61BD4F',
      background: '#F4F5F7',
      surface: '#FFFFFF',
      text: '#172B4D',
      placeholder: '#A5ADBA',
      disabled: '#C1C7D0',
      card: '#E2E4E9',
      border: '#DFE1E6',
    },
  };

  const DarkTheme = {
    ...PaperDarkTheme,
    colors: {
      ...PaperDarkTheme.colors,
      primary: '#0079BF',
      accent: '#61BD4F',
      background: '#1E1E1E',
      surface: '#2C2C2C',
      text: '#FFFFFF',
      placeholder: '#A5ADBA',
      disabled: '#3C3C3C',
      card: '#2A2A2A',
      border: '#444444',
    },
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  const theme = isDarkMode ? DarkTheme : LightTheme;


  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={theme}>
        <Toast
          config={{
            error: ({ text1, text2 }) => (
              <View style={{ backgroundColor: '#e74c3c', padding: 10, borderRadius: 5 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
                <Text style={{ color: 'white' }}>{text2}</Text>
              </View>
            ),
          }}
        />
        <AppNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
