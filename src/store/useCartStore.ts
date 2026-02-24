import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // product ID
    title: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem, quantity: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item, quantity) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.id === item.id);

                if (existingItem) {
                    const newQuantity = Math.min(existingItem.quantity + quantity, item.stock);
                    set({
                        items: currentItems.map((i) =>
                            i.id === item.id ? { ...i, quantity: newQuantity } : i
                        ),
                    });
                } else {
                    set({ items: [...currentItems, { ...item, quantity: Math.min(quantity, item.stock) }] });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                const item = get().items.find(i => i.id === id);
                if (!item) return;

                const validQuantity = Math.max(1, Math.min(quantity, item.stock));
                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity: validQuantity } : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'ecommerce-cart', // Clave en localStorage
        }
    )
);
