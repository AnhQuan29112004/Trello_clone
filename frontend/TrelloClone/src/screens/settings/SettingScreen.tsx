import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { Button, MD3Colors, Text, TextInput } from 'react-native-paper';
import { RootNavigationProp } from '../../types/types';
import authService from '../../services/Auth/authService';


const SettingScreen = () => {

  return (
    <View style={styles.container}>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 20
  },
  input: {
    height: 50,
    width: 250
  }
})

export default SettingScreen;
