import { create } from "zustand";
import { persist } from "zustand/middleware";

/** ───── minimal card shape we care about ───── */
export interface Card {
  id: string;          // Scryfall ID
  name: string;
  imageUrl: string;
}

/** ───── zustand state & actions ───── */
interface DeckState {
  deck: Record<string, { card: Card; qty: number }>;
  addCard: (card: Card) => void;
  increment: (cardId: string) => void;
  decrement: (cardId: string) => void;
  removeCard: (cardId: string) => void;
  clearDeck: () => void;
}

/** derived stats helper */
export function getDeckStats(
  deck: Record<string, { card: Card; qty: number }>
) {
  const numCards = Object.values(deck).reduce((s, e) => s + e.qty, 0);
  const overCopies = Object.values(deck).filter(
    (e) => e.qty > 4 && !e.card.name.toLowerCase().includes("basic")
  );
  return {
    numCards,
    legal60: numCards === 60,
    noOverCopies: overCopies.length === 0,
  };
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set) => ({
      deck: {},

      addCard: (card) =>
        set((state) => {
          const entry = state.deck[card.id];
          const qty = entry ? entry.qty + 1 : 1;
          return { deck: { ...state.deck, [card.id]: { card, qty } } };
        }),

      increment: (id) =>
        set((state) => {
          const entry = state.deck[id];
          if (!entry) return state;
          return {
            deck: { ...state.deck, [id]: { ...entry, qty: entry.qty + 1 } },
          };
        }),

      decrement: (id) =>
        set((state) => {
          const entry = state.deck[id];
          if (!entry) return state;
          if (entry.qty === 1) {
            const { [id]: _, ...rest } = state.deck;
            return { deck: rest };
          }
          return {
            deck: { ...state.deck, [id]: { ...entry, qty: entry.qty - 1 } },
          };
        }),

      removeCard: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.deck;
          return { deck: rest };
        }),

      clearDeck: () => set({ deck: {} }),
    }),
    { name: "card-chasm-deck" }
  )
);