import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";

function App() {
  const [city, setCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bands, setBands] = useState([]);
  const [loading, setLoading] = useState(true);

  const debouncedFetchBands = debounce(async (city) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://musicbrainz.org/ws/2/artist?query=area:${city} AND type:group&limit=50&fmt=json`
      );
      const data = await response.json();
      setBands(data.artists);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bands:", error);
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://get.geojs.io/v1/ip/geo.json");
        const data = await response.json();
        console.log("User's City Location:", data.city);
        setCity(data.city);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (city) {
      debouncedFetchBands(city);
    }
  }, [city]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCity(searchQuery.trim());
  };

  return (
    <div className="App">
      <h1>Search Top 50 Bands</h1>

      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>

      <h2>Top 50 Bands in {city || "Your City"}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {bands.length > 0 ? (
            bands.map((band) => (
              <li key={band.id}>
                <strong>{band.name}</strong>
              </li>
            ))
          ) : (
            <li>No bands found for this city.</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default App;
