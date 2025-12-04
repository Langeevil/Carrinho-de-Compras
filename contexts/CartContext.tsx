import React, { createContext, useContext, useMemo, useReducer } from 'react';

import type { CartItem, Product } from '@/types';

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'add'; product: Product }
  | { type: 'increment'; id: number }
  | { type: 'decrement'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clear' };

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
    default:
      return state;
  }
}

export function CartProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
}
