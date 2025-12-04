import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/types';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function CartScreen() {
  const { items, increment, decrement, remove, totalGeral } = useCart();

  const renderItem = ({ item }: { item: CartItem }) => {
    const subtotal = item.preco * item.quantidade;

    return (
      <View style={styles.card}>
        {item.imagem ? (
          <Image source={{ uri: item.imagem }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Feather name="image" size={24} color="#9AA0A6" />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title}>{item.nome}</Text>
          <Text style={styles.price}>{currency.format(item.preco)}</Text>

          <View style={styles.row}>
            <View style={styles.quantityWrapper}>
              <Pressable
                style={[
                  styles.qtyButton,
                  item.quantidade === 1 && styles.qtyButtonDisabled,
                ]}
                onPress={() => decrement(item.id)}
                disabled={item.quantidade === 1}>
                <Text style={styles.qtyButtonText}>−</Text>
              </Pressable>
              <Text style={styles.quantity}>{item.quantidade}</Text>
              <Pressable style={styles.qtyButton} onPress={() => increment(item.id)}>
                <Text style={styles.qtyButtonText}>+</Text>
              </Pressable>
            </View>

            <Text style={styles.subtotal}>{currency.format(subtotal)}</Text>
          </View>
        </View>

        <Pressable style={styles.deleteButton} onPress={() => remove(item.id)}>
          <Feather name="trash-2" size={18} color="#c0392b" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Seu carrinho</Text>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="shopping-bag" size={32} color="#999" />
          <Text style={styles.emptyText}>Nenhum item adicionado ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <View style={styles.totalBar}>
        <Text style={styles.totalLabel}>Total geral</Text>
        <Text style={styles.totalValue}>{currency.format(totalGeral)}</Text>
      </View>
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
    paddingBottom: 120,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#eaeaea',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d0d0d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonDisabled: {
    opacity: 0.4,
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  quantity: {
    minWidth: 22,
    textAlign: 'center',
    fontWeight: '700',
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    color: '#777',
  },
  totalBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0a7ea4',
  },
});
