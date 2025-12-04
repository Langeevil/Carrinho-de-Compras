import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CartItem, Product } from '@/types';

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'increment'; id: number }
  | { type: 'decrement'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clear' }
  | { type: 'hydrate'; items: CartItem[] };

type CartContextValue = {
  items: CartItem[];
  totalGeral: number;
  addToCart: (product: Product) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const exists = state.items.find((item) => item.id === action.product.id);
      if (exists) {
        return {
          items: state.items.map((item) =>
            item.id === action.product.id
              ? { ...item, quantidade: item.quantidade + 1 }
              : item,
          ),
        };
      }
      return {
        items: [...state.items, { ...action.product, quantidade: 1 }],
      };
    }
    case 'increment':
      return {
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantidade: item.quantidade + 1 } : item,
        ),
      };
    case 'decrement':
      return {
        items: state.items.map((item) =>
          item.id === action.id && item.quantidade > 1
            ? { ...item, quantidade: item.quantidade - 1 }
            : item,
        ),
      };
    case 'remove':
      return {
        items: state.items.filter((item) => item.id !== action.id),
      };
    case 'clear':
      return { items: [] };
    case 'hydrate':
      return { items: action.items };
    default:
      return state;
  }
}

export function CartProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem('@cart_items');
        if (stored) {
          const parsed = JSON.parse(stored) as CartItem[];
          dispatch({ type: 'hydrate', items: parsed });
        }
      } catch (err) {
        console.warn('Erro ao carregar carrinho salvo', err);
      } finally {
        setIsHydrated(true);
      }
    };
    void loadCart();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const persist = async () => {
      try {
        await AsyncStorage.setItem('@cart_items', JSON.stringify(state.items));
      } catch (err) {
        console.warn('Erro ao salvar carrinho', err);
      }
    };
    void persist();
  }, [state.items, isHydrated]);

  const totalGeral = useMemo(
    () => state.items.reduce((total, item) => total + item.preco * item.quantidade, 0),
    [state.items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      totalGeral,
      addToCart: (product) => dispatch({ type: 'add', product }),
      increment: (id) => dispatch({ type: 'increment', id }),
      decrement: (id) => dispatch({ type: 'decrement', id }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [state.items, totalGeral],
  );

  if (!isHydrated) {
    return null;
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
}
