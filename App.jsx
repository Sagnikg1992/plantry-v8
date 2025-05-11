
import React, { useState, useEffect, useRef } from "react";

const mealSuggestions = [
  { meal: "Chicken Biryani", tags: ["Comfort food", "Spicy"], cuisine: "Indian", ingredients: ["chicken", "rice"], mealType: ["Lunch", "Dinner"], calories: 700 },
  { meal: "Palak Paneer with Roti", tags: ["Comfort food"], cuisine: "Indian", ingredients: ["paneer", "spinach"], mealType: ["Lunch", "Dinner"], calories: 500 },
  { meal: "Hakka Noodles", tags: ["Spicy"], cuisine: "Chinese", ingredients: ["noodles", "vegetables"], mealType: ["Lunch", "Dinner"], calories: 650 },
  { meal: "Tomato Basil Pasta", tags: ["Light"], cuisine: "Italian", ingredients: ["pasta", "tomato"], mealType: ["Lunch", "Dinner"], calories: 550 }
];

const allTags = ["Comfort food", "My Favourites", "Spicy", "Light", "Feast with guests"];
const allCuisines = ["Indian", "Italian", "Chinese", "Continental"];

export default function App() {
  const [mealIdea, setMealIdea] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [mealType, setMealType] = useState("");
  const [maxCalories, setMaxCalories] = useState(1000);
  const [favourites, setFavourites] = useState([]);
  const [showPref, setShowPref] = useState(false);
  const [showCuisines, setShowCuisines] = useState(false);
  const prefRef = useRef(null);
  const cuisineRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        prefRef.current && !prefRef.current.contains(e.target) &&
        cuisineRef.current && !cuisineRef.current.contains(e.target)
      ) {
        setShowPref(false);
        setShowCuisines(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelection = (value, selectedList, setter) => {
    setter(
      selectedList.includes(value)
        ? selectedList.filter((v) => v !== value)
        : [...selectedList, value]
    );
  };

  const generateCustomMeal = () => {
    const filtered = mealSuggestions.filter((meal) => {
      const matchPref = preferences.length ? preferences.some((pref) => meal.tags.includes(pref)) : true;
      const matchCuisine = cuisines.length ? cuisines.includes(meal.cuisine) : true;
      const matchIngr = ingredient ? meal.ingredients.includes(ingredient.toLowerCase()) : true;
      const matchType = mealType ? (Array.isArray(meal.mealType) ? meal.mealType.includes(mealType) : meal.mealType === mealType) : true;
      const matchCal = meal.calories <= maxCalories;
      return matchPref && matchCuisine && matchIngr && matchType && matchCal;
    });
    setMealIdea(filtered.length ? filtered[Math.floor(Math.random() * filtered.length)] : null);
  };

  const clearFilters = () => {
    setPreferences([]);
    setCuisines([]);
    setIngredient("");
    setMealType("");
    setMaxCalories(1000);
    setMealIdea(null);
  };

  const saveFavourite = () => {
    if (mealIdea && !favourites.includes(mealIdea.meal)) {
      setFavourites([...favourites, mealIdea.meal]);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>Daily Meal Ideas</h1>

      <div ref={prefRef}>
        <label>Preferences</label>
        <select multiple value={preferences} onChange={(e) => setPreferences(Array.from(e.target.selectedOptions, o => o.value))}>
          {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>
      </div>

      <div ref={cuisineRef}>
        <label>Cuisines</label>
        <select multiple value={cuisines} onChange={(e) => setCuisines(Array.from(e.target.selectedOptions, o => o.value))}>
          {allCuisines.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <label>Meal Type</label>
      <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
        <option value="">Select Meal Type</option>
        <option>Breakfast</option>
        <option>Lunch</option>
        <option>Evening Snack</option>
        <option>Dinner</option>
      </select>

      <label>Max Calories: {maxCalories}</label>
      <input type="range" min="100" max="1000" step="50" value={maxCalories} onChange={(e) => setMaxCalories(+e.target.value)} />

      <input type="text" placeholder="Ingredient" value={ingredient} onChange={(e) => setIngredient(e.target.value)} />

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button onClick={generateCustomMeal}>Suggest a Meal</button>
        <button onClick={clearFilters}>Clear</button>
      </div>

      {mealIdea && (
        <div style={{ marginTop: 20, background: "#eee", padding: 10 }}>
          <h3>{mealIdea.meal}</h3>
          <p>Calories: {mealIdea.calories}</p>
          <button onClick={saveFavourite}>Save as Favourite</button>
        </div>
      )}

      {mealIdea === null && (preferences.length > 0 || cuisines.length > 0 || ingredient || mealType || maxCalories < 1000) && (
        <p>No meals found. Try loosening filters.</p>
      )}
    </div>
  );
}
