import { useState } from "react";
import axios from "axios";
import DeckSidebar from "./components/DeckSidebar";
import { useDeckStore } from "./store/useDeckStore";

function App() {
  const [name, setName] = useState("");
  const [cardData, setCardData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addCard = useDeckStore((s) => s.addCard);

  const searchCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCardData(null);

    try {
      const res = await axios.get(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
          name.trim()
        )}`
      );
      setCardData(res.data);
    } catch {
      setError("Card not found.");
    }
  };

  return (
    <div className="h-screen flex">
      {/* LEFT: Search area */}
      <main className="flex-1 flex flex-col items-center gap-4 p-8 overflow-auto">
        <h1 className="text-2xl font-bold">Card-Chasm Search MVP</h1>
        <form onSubmit={searchCard} className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Lightning Bolt"
            className="border px-2 py-1 rounded w-64"
          />
          <button className="bg-blue-600 text-white px-3 py-1 rounded">
            Search
          </button>
        </form>

        {error && <p className="text-red-600">{error}</p>}

        {cardData && (
          <div
            className="cursor-pointer"
            onClick={() =>
              addCard({
                id: cardData.id,
                name: cardData.name,
                imageUrl:
                  cardData.image_uris?.normal ||
                  cardData.card_faces?.[0]?.image_uris.normal,
              })
            }
          >
            <img
              src={
                cardData.image_uris?.normal ||
                cardData.card_faces?.[0]?.image_uris.normal
              }
              alt={cardData.name}
              className="w-64"
            />
            <p className="text-center text-sm mt-1">
              Click image to add to deck
            </p>
          </div>
        )}
      </main>

      {/* RIGHT: Deck sidebar */}
      <DeckSidebar />
    </div>
  );
}

export default App;