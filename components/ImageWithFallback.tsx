import { Image, ImageProps } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  uri: string;
  placeholderColor?: string;
} & Omit<ImageProps, 'source'>;

const fallback = require('@/assets/images/partial-react-logo.png');

export function ImageWithFallback({ uri, placeholderColor = '#e5e7eb', style, ...rest }: Props) {
  const [hasError, setHasError] = useState(false);

  if (!uri || hasError) {
    return (
      <View style={[styles.placeholder, { backgroundColor: placeholderColor }, style]}>
        <Image source={fallback} style={StyleSheet.flatten([styles.fallback, style])} {...rest} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={style}
      onError={() => setHasError(true)}
      contentFit="contain"
      cachePolicy="memory-disk"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    width: '100%',
    height: '100%',
  },
});
