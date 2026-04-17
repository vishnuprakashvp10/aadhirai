'use client';
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

const CartContext = createContext<{
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((i) =>
          i.product.id === action.product.id
            ? { ...i, quantity: i.quantity + (action.quantity || 1) }
            : i
        );
      } else {
        newItems = [...state.items, { product: action.product, quantity: action.quantity || 1 }];
      }
      return {
        items: newItems,
        itemCount: newItems.reduce((s, i) => s + i.quantity, 0),
        total: newItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
      };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter((i) => i.product.id !== action.productId);
      return {
        items: newItems,
        itemCount: newItems.reduce((s, i) => s + i.quantity, 0),
        total: newItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
      };
    }
    case 'UPDATE_QUANTITY': {
      const newItems =
        action.quantity <= 0
          ? state.items.filter((i) => i.product.id !== action.productId)
          : state.items.map((i) =>
              i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
            );
      return {
        items: newItems,
        itemCount: newItems.reduce((s, i) => s + i.quantity, 0),
        total: newItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
      };
    }
    case 'CLEAR_CART':
      return { items: [], itemCount: 0, total: 0 };
    case 'LOAD_CART': {
      const items = action.items;
      return {
        items,
        itemCount: items.reduce((s, i) => s + i.quantity, 0),
        total: items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], itemCount: 0, total: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('aadhirai_cart');
      if (saved) dispatch({ type: 'LOAD_CART', items: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('aadhirai_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', product, quantity });
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart`, {
      icon: '🛒',
    });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
