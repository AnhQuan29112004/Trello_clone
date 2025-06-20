import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

type ThemedTextProps = TextProps & {
  variant?: 'primary' | 'accent' | 'text' | 'placeholder' | 'disabled';
};

const ThemedText = ({ style, variant = 'text', ...props }: ThemedTextProps) => {
  const { colors } = useTheme();

  const color = colors[variant] || colors.text;

  const themedStyle: StyleProp<TextStyle> = {
    color,
  };

  return <Text style={[themedStyle, style]} {...props} />;
};

export default ThemedText;
