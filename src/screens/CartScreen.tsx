import { Feather } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/types';

const palette = {
  blue: '#0d6efd',
  darkBlue: '#0a2d6f',
  turquoise: '#4fd1ff',
  gold: '#ffc107',
  white: '#ffffff',
  muted: '#7a8599',
  surface: '#f5f7fb',
  lightGray: '#e8eef7',
  danger: '#dc3545',
  success: '#28a745',
};

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CartScreen() {
  const { items, increment, decrement, remove, totalGeral } = useCart();

  const renderItem = ({ item }: { item: CartItem }) => {
    const subtotal = item.preco * item.quantidade;
    const hasImage = item.imagem?.trim();

    return (
      <View style={styles.card}>
        <View style={styles.imageSection}>
          {hasImage ? (
            <ImageWithFallback
              uri={item.imagem.trim()}
              style={styles.image}
              resizeMode="cover"
              placeholderColor={palette.lightGray}
            />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Feather name="package" size={32} color={palette.muted} />
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={2}>{item.nome}</Text>
            <Text style={styles.price}>{currency.format(item.preco)}</Text>
          </View>

          <View style={styles.quantitySection}>
            <View style={styles.quantityWrapper}>
              <Pressable
                style={[styles.qtyButton, item.quantidade === 1 && styles.qtyButtonDisabled]}
                onPress={() => decrement(item.id)}
                disabled={item.quantidade === 1}
              >
                <Feather name="minus" size={16} color={palette.darkBlue} />
              </Pressable>
              <Text style={styles.quantity}>{item.quantidade}</Text>
              <Pressable 
                style={styles.qtyButton}
                onPress={() => increment(item.id)}
              >
                <Feather name="plus" size={16} color={palette.darkBlue} />
              </Pressable>
            </View>
            
            <Text style={styles.subtotal}>{currency.format(subtotal)}</Text>
          </View>
        </View>

        <Pressable 
          style={styles.deleteButton}
          onPress={() => remove(item.id)}
        >
          <Feather name="trash-2" size={20} color={palette.danger} />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seu carrinho</Text>
        <Text style={styles.headerSubtitle}>Gerencie seus itens</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="shopping-bag" size={48} color={palette.muted} />
          <Text style={styles.emptyText}>Nenhum item adicionado ainda.</Text>
          <Text style={styles.emptySubtext}>Explore nossos produtos!</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            scrollEnabled={true}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalValue}>{currency.format(totalGeral)}</Text>
            </View>
            
            <Pressable style={styles.checkoutButton}>
              <Feather name="credit-card" size={20} color={palette.white} />
              <Text style={styles.checkoutText}>Finalizar compra</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 20,
    backgroundColor: palette.darkBlue,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: palette.darkBlue,
    shadowOpacity: 0.24,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: palette.white,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    marginTop: 8,
    color: palette.turquoise,
    fontWeight: '600',
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: palette.lightGray,
    overflow: 'hidden',
  },
  imageSection: {
    width: 100,
    height: 120,
    backgroundColor: palette.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2ff',
  },
  infoSection: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  textContent: {
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.darkBlue,
    letterSpacing: -0.2,
  },
  price: {
    fontSize: 14,
    color: palette.blue,
    fontWeight: '700',
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: palette.lightGray,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: '#d0d6e2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  qtyButtonDisabled: {
    opacity: 0.4,
  },
  qtyButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: palette.darkBlue,
  },
  quantity: {
    minWidth: 18,
    textAlign: 'center',
    fontWeight: '800',
    color: palette.darkBlue,
    fontSize: 13,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '900',
    color: palette.gold,
    minWidth: 70,
    textAlign: 'right',
  },
  deleteButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.darkBlue,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 13,
    color: palette.muted,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderColor: palette.lightGray,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
  },
  totalSection: {
    paddingHorizontal: 4,
  },
  totalLabel: {
    fontSize: 13,
    color: palette.muted,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: palette.darkBlue,
    marginTop: 4,
  },
  checkoutButton: {
    flexDirection: 'row',
    backgroundColor: palette.success,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: palette.success,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  checkoutText: {
    color: palette.white,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
