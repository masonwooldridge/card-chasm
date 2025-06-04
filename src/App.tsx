import { useState } from "react";
import axios from "axios";

function App() {
  const [name, setName] = useState("");
  const [cardUrl, setCardUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCardUrl(null);
    try {
      const res = await axios.get(
        `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
          name.trim()
        )}`
      );
      setCardUrl(res.data.image_uris?.normal || res.data.card_faces?.[0]?.image_uris.normal);
    } catch {
      setError("Card not found.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Card-Chasm Search MVP</h1>
      <form onSubmit={searchCard} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Lightning Bolt"
          className="border px-2 py-1 rounded"
        />
        <button className="bg-blue-600 text-white px-3 py-1 rounded">
          Search
        </button>
      </form>
      {error && <p className="text-red-600">{error}</p>}
      {cardUrl && <img src={cardUrl} alt={name} className="w-64" />}
    </div>
  );
}

export default App;