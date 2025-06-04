// src/store/useDeckStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Minimal shape for a card we care about right now */
export interface Card {
  id: string;          // Scryfall’s unique card id
  name: string;
  imageUrl: string;    // URL we already have from the search step
}

interface DeckState {
  /** deck keyed by card.id → { card info, quantity } */
  deck: Record<string, { card: Card; qty: number }>;

  /* --- actions --- */
  addCard: (card: Card) => void;
  increment: (cardId: string) => void;
  decrement: (cardId: string) => void;
  removeCard: (cardId: string) => void;
  clearDeck: () => void;
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set) => ({
      deck: {},

      /* add 1 copy (or bump existing) */
      addCard: (card) =>
        set((state) => {
          const existing = state.deck[card.id];
          const qty = existing ? existing.qty + 1 : 1;
          return {
            deck: { ...state.deck, [card.id]: { card, qty } },
          };
        }),

      /* +1 copy */
      increment: (cardId) =>
        set((state) => {
          const entry = state.deck[cardId];
          if (!entry) return state;
          return {
            deck: {
              ...state.deck,
              [cardId]: { ...entry, qty: entry.qty + 1 },
            },
          };
        }),

      /* –1 copy (or drop if qty hits 0) */
      decrement: (cardId) =>
        set((state) => {
          const entry = state.deck[cardId];
          if (!entry) return state;
          if (entry.qty === 1) {
            const { [cardId]: _, ...rest } = state.deck;
            return { deck: rest };
          }
          return {
            deck: {
              ...state.deck,
              [cardId]: { ...entry, qty: entry.qty - 1 },
            },
          };
        }),

      /* nuke the entry entirely */
      removeCard: (cardId) =>
        set((state) => {
          const { [cardId]: _, ...rest } = state.deck;
          return { deck: rest };
        }),

      clearDeck: () => set({ deck: {} }),
    }),
    {
      name: "card-chasm-deck", // <— key used in localStorage
    }
  )
);