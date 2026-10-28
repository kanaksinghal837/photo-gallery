import { useState, useCallback, useMemo, useReducer, useEffect } from "react";
import useFetchPhotos from "../hooks/useFetchPhotos";

// Reducer: favourites ka logic yahan hai
function favReducer(state, action) {
  switch (action.type) {
    case "TOGGLE":
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id];
    default:
      return state;
  }
}

// localStorage se purani favourites load karo
function initFavourites() {
  return JSON.parse(localStorage.getItem("favourites") || "[]");
}

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [search, setSearch] = useState("");
  const [favourites, dispatch] = useReducer(favReducer, [], initFavourites);

  // Jab favourites change hon, localStorage mein save karo
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const filtered = useMemo(() => {
    return photos.filter((p) =>
      p.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [photos, search]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="w-10 h-10 mx-auto border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="p-8 text-center text-red-600">Error: {error}</p>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <input
        value={search}
        onChange={handleSearch}
        placeholder="Search by author name"
        className="w-full mb-4 p-2 border rounded"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((photo) => (
          <div key={photo.id} className="bg-white rounded shadow p-2">
            <img
              src={photo.download_url}
              alt={photo.author}
              className="w-full h-48 object-cover rounded"
            />
            <div className="flex justify-between items-center mt-2">
              <p>{photo.author}</p>
              <button onClick={() => dispatch({ type: "TOGGLE", id: photo.id })}>
                {favourites.includes(photo.id) ? "❤️" : "🤍"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}