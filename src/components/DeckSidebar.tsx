// src/components/DeckSidebar.tsx
import { useDeckStore } from "../store/useDeckStore";

export default function DeckSidebar() {
  const deck = useDeckStore((s) => s.deck);
  const { increment, decrement, removeCard, clearDeck } = useDeckStore();

  return (
    <aside className="w-72 p-4 border-l flex flex-col gap-2">
      <h2 className="font-bold text-lg">Current Deck</h2>

      {Object.values(deck).length === 0 && (
        <p className="text-sm text-gray-500">No cards yet—click a card to add.</p>
      )}

      {Object.values(deck).map(({ card, qty }) => (
        <div key={card.id} className="flex items-center gap-2">
          <span className="w-8 text-right">{qty}×</span>
          <span className="flex-1 truncate">{card.name}</span>
          <button onClick={() => increment(card.id)}>+</button>
          <button onClick={() => decrement(card.id)}>-</button>
          <button onClick={() => removeCard(card.id)}>🗑️</button>
        </div>
      ))}

      {Object.values(deck).length > 0 && (
        <button
          className="mt-4 bg-red-600 text-white px-3 py-1 rounded"
          onClick={clearDeck}
        >
          Clear deck
        </button>
      )}
    </aside>
  );
}