import { Feather } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity, useWindowDimensions, View
} from 'react-native';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useCart } from '@/contexts/CartContext';
import { fetchProducts } from '@/services/products';
import { Product } from '@/types';

const palette = {
  blue: '#2563eb',
  darkBlue: '#0f172a',
  turquoise: '#38bdf8',
  gold: '#d4af37',
  white: '#ffffff',
  muted: '#94a3b8',
  surface: '#f8fafc',
  lightGray: '#e2e8f0',
  success: '#10b981',
  border: '#e5e7eb',
  shadow: '#0f172a14',
};

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, items } = useCart();

  const { width } = useWindowDimensions();
  // responsive columns: 1 column on very small screens, 2 on most phones, 3 on wide/tablet
  const columns = width >= 900 ? 3 : width >= 600 ? 2 : 1;
  const listPaddingHorizontal = 12 * 2; // styles.listContent.paddingHorizontal * 2
  const gapBetween = 12; // approximate gap used in columnWrapperStyle
  const cardWidth = Math.max(140, Math.floor((width - listPaddingHorizontal - gapBetween * (columns - 1)) / columns) - 4);

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
    const cardStyle = [styles.productCard, { width: cardWidth }];
    const imageHeight = Math.round(cardWidth * 0.66);

    return (
      <View style={cardStyle}>
        <View style={[styles.imageContainer, { height: imageHeight }]}> 
          {hasImage ? (
            <ImageWithFallback
              uri={item.imagem.trim()}
              style={styles.productImage}
              resizeMode="contain"
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
          <Text style={styles.productName} numberOfLines={2}>
            {item.nome}
          </Text>
          <Text style={styles.productPrice}>{currency.format(item.preco)}</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
            <Feather name="plus" size={18} color={palette.white} />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View>
          <Text style={styles.heroKicker}>Coleção</Text>
          <Text style={styles.heroTitle}>Produtos</Text>
          <Text style={styles.heroSubtitle}>Escolha e leve para o carrinho</Text>
        </View>
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
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 12 }}
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
    paddingHorizontal: 22,
    paddingTop: 38,
    paddingBottom: 24,
    backgroundColor: palette.darkBlue,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: palette.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  heroKicker: {
    color: palette.turquoise,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontSize: 12,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: palette.white,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    marginTop: 6,
    color: '#cbd5e1',
    fontWeight: '500',
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
    borderRadius: 18,
    marginHorizontal: 6,
    marginVertical: 10,
    paddingBottom: 10,
    shadowColor: palette.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1,
    borderColor: palette.border,
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
    gap: 6,
    flex: 1,
  },
  productName: {
    fontSize: 15,
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
    marginTop: 10,
    backgroundColor: palette.blue,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.blue,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    flexDirection: 'row',
    gap: 6,
  },
  addButtonText: {
    color: palette.white,
    fontWeight: '800',
    fontSize: 13,
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
