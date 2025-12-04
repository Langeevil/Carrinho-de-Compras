import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCart } from '@/contexts/CartContext';
import { fetchProducts } from '@/services/products';
import { Product } from '@/types';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

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

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imagem }} style={styles.image} resizeMode="cover" />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.nome}</Text>
          <Text style={styles.price}>{currency.format(item.preco)}</Text>
          {itemInCart ? (
            <Text style={styles.cartInfo}>No carrinho: {itemInCart.quantidade}x</Text>
          ) : null}
          <TouchableOpacity style={styles.button} onPress={() => addToCart(item)}>
            <Text style={styles.buttonText}>Adicionar ao carrinho</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Produtos</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={styles.helperText}>Buscando dados do jsonbin.io...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={() => loadProducts()}>
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  helperText: {
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#eaeaea',
  },
  cardContent: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    color: '#444',
  },
  cartInfo: {
    fontSize: 12,
    color: '#0a7ea4',
    fontWeight: '700',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#0a7ea4',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
