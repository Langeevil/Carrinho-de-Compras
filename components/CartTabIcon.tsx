import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface CartTabIconProps {
  color: string;
}

export function CartTabIcon({ color }: CartTabIconProps) {
  const { items } = useCart();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const totalItems = items.reduce((sum, item) => sum + item.quantidade, 0);

  useEffect(() => {
    if (totalItems > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [totalItems, scaleAnim]);

  return (
    <View style={styles.container}>
      <IconSymbol size={28} name="cart.fill" color={color} />
      {totalItems > 0 && (
        <Animated.View
          style={[
            styles.badge,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.badgeContent}>
            <View style={[styles.badgeBackground, { borderColor: color }]}>
              <Animated.Text style={[styles.badgeText]}>
                {totalItems > 99 ? '99+' : totalItems}
              </Animated.Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
  },
  badgeContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeBackground: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
});
