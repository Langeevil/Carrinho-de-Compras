import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useCart } from '@/contexts/CartContext';
import { fetchProducts } from '@/services/products';
import { Product } from '@/types';

const palette = {
  blue: '#0d6efd',
  darkBlue: '#0a2d6f',
  turquoise: '#4fd1ff',
  gold: '#ffc107',
  white: '#ffffff',
  muted: '#7a8599',
  surface: '#f5f7fb',
  lightGray: '#e8eef7',
  success: '#28a745',
};

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, items } = useCart();

  const loadProducts = useCallback(async (isRefresh = false) => {
    setError(null);
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const onRefresh = useCallback(async () => {
    await loadProducts(true);
  }, [loadProducts]);

  const renderItem = ({ item }: { item: Product }) => {
    const itemInCart = items.find((cartItem) => cartItem.id === item.id);
    const hasImage = item.imagem?.trim();

    return (
      <TouchableOpacity 
        style={styles.productCard}
        activeOpacity={0.85}
      >
        <View style={styles.imageContainer}>
          {hasImage ? (
            <ImageWithFallback
              uri={item.imagem.trim()}
              style={styles.productImage}
              resizeMode="cover"
              placeholderColor={palette.lightGray}
            />
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <Feather name="package" size={40} color={palette.muted} />
            </View>
          )}
          {itemInCart && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemInCart.quantidade}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.nome}</Text>
          <Text style={styles.productPrice}>{currency.format(item.preco)}</Text>
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => addToCart(item)}
        >
          <Feather name="plus" size={20} color={palette.white} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Descubra</Text>
        <Text style={styles.heroSubtitle}>Adicione itens exclusivos ao seu carrinho</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={palette.blue} />
          <Text style={styles.helperText}>Buscando dados do jsonbin.io...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => loadProducts()}>
            <Text style={styles.secondaryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.helperText}>Nenhum produto encontrado.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 26,
    backgroundColor: palette.darkBlue,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: palette.darkBlue,
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: palette.white,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    marginTop: 10,
    color: palette.turquoise,
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 28,
    paddingTop: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  helperText: {
    color: palette.muted,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 8,
  },
  productCard: {
    flex: 0.5,
    backgroundColor: palette.white,
    borderRadius: 20,
    marginHorizontal: 6,
    marginVertical: 10,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: palette.lightGray,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: palette.lightGray,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2ff',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: palette.success,
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  badgeText: {
    color: palette.white,
    fontWeight: '900',
    fontSize: 12,
  },
  productInfo: {
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 4,
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.darkBlue,
    letterSpacing: -0.2,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: palette.blue,
  },
  addButton: {
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: palette.blue,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.blue,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  button: {
    marginTop: 12,
    backgroundColor: palette.blue,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: palette.blue,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
    borderWidth: 1,
    borderColor: '#0a52c8',
  },
  buttonText: {
    color: palette.white,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  secondaryButton: {
    marginTop: 8,
    backgroundColor: palette.turquoise,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: palette.turquoise,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 7,
    borderWidth: 1,
    borderColor: '#20b6ff',
  },
  secondaryButtonText: {
    color: palette.white,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});
