
import React, { useEffect, useState } from "react";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/restaurants`)
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error("Error loading restaurants", err));
  }, []);

  return (
    <div>
      <h2>Restaurants</h2>
      <ul>
        {restaurants.map((r) => (
          <li key={r._id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Restaurants;
