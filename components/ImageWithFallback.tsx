import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';

interface ImageWithFallbackProps {
  uri: string;
  style: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  placeholderColor?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  uri,
  style,
  resizeMode = 'cover',
  placeholderColor = '#e8eef7',
}) => {
  return (
    <View style={[style, { backgroundColor: placeholderColor }]}>
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        contentFit="contain"
        cachePolicy="memory-disk"
        placeholder={{
          blurhash: 'L5H2SC%2WCnhVont7]WB+KiVqIAG',
          width: 1,
          height: 1
        }}
      />
    </View>
  );
};
