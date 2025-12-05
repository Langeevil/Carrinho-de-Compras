import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/types';

const palette = {
  blue: '#2563eb',
  darkBlue: '#0f172a',
  turquoise: '#38bdf8',
  gold: '#d4af37',
  white: '#ffffff',
  muted: '#94a3b8',
  surface: '#f8fafc',
  lightGray: '#e2e8f0',
  danger: '#ef4444',
  success: '#10b981',
  border: '#e5e7eb',
  shadow: '#0f172a14',
};

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function CartScreen() {
  const { items, increment, decrement, remove, totalGeral } = useCart();
  const { width } = useWindowDimensions();
  const imageSize = width >= 700 ? 120 : width >= 420 ? 100 : 84;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simula processamento da compra (1 segundo)
    setTimeout(() => {
      setIsProcessing(false);
      
      // Limpa todos os itens do carrinho
      items.forEach(item => {
        for (let i = 0; i < item.quantidade; i++) {
          remove(item.id);
        }
      });

      // Exibe mensagem de sucesso
      Alert.alert(
        '✅ Compra Finalizada!',
        'Sua compra foi processada com sucesso! Obrigado por comprar conosco.',
        [{ text: 'OK', onPress: () => {} }]
      );
    }, 1000);
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    const subtotal = item.preco * item.quantidade;
    const hasImage = item.imagem?.trim();

    return (
      <View style={styles.card}>
        <View style={[styles.imageSection, { width: imageSize, height: Math.round(imageSize * 1.1) }]}> 
          {hasImage ? (
            <ImageWithFallback
              uri={item.imagem.trim()}
              style={styles.image}
              resizeMode="contain"
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
            
            <Pressable 
              style={[styles.checkoutButton, isProcessing && styles.checkoutButtonDisabled]}
              onPress={handleCheckout}
              disabled={isProcessing}
            >
              <Feather name="credit-card" size={20} color={palette.white} />
              <Text style={styles.checkoutText}>
                {isProcessing ? 'Processando...' : 'Finalizar compra'}
              </Text>
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
    paddingHorizontal: 22,
    paddingTop: 38,
    paddingBottom: 22,
    backgroundColor: palette.darkBlue,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: palette.shadow,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: palette.white,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    marginTop: 6,
    color: '#cbd5e1',
    fontWeight: '500',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'stretch',
    shadowColor: palette.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
    maxWidth: 720,
    alignSelf: 'center',
  },
  imageSection: {
    width: 104,
    height: 128,
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
    gap: 6,
  },
  title: {
    fontSize: 16,
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
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 10,
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
    borderColor: palette.border,
    gap: 12,
    shadowColor: palette.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
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
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutText: {
    color: palette.white,
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.2,
  },
});
