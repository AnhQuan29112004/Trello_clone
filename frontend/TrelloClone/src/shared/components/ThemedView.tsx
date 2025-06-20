import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

type ThemedViewProps = ViewProps & {
  variant?: 'surface' | 'background' | 'card' | 'primary';
  elevation?: number; // optional for surface feel
};

const ThemedView = ({ style, variant = 'background', elevation = 0, ...props }: ThemedViewProps) => {
  const { colors } = useTheme();

  const backgroundColor = colors[variant] || colors.background;

  const themedStyle: StyleProp<ViewStyle> = {
    backgroundColor,
    elevation,
    borderColor: colors.border,
    borderWidth: 0.5,
  };

    const styles = StyleSheet.create({

        removeBorder:{
            borderWidth: 0,
            borderColor: 'transparent',
            elevation: 0, // Android shadow
            shadowColor: 'transparent', // iOS shadow
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
        }
});

  return <View style={[themedStyle, style,styles.removeBorder]} {...props} />;
};

export default ThemedView;
