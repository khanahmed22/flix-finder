import { useState } from "react";
import "./App.css";

function Fruits() {
  const fruits = ["apple", "banana", "pineapple"];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredFruits = fruits.filter((fruit) =>
    fruit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <input
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <br />
        Fruits List
        {filteredFruits.map((fruit, index) => (
          <p key={index}>{fruit}</p>
        ))}
      </div>
    </>
  );
}

export default Fruits;
