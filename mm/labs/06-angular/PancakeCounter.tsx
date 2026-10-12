import { useState } from 'react';
export function PancakeCounter() {
  const [pancakes, setPancakes] = useState(0);
  const syrup = pancakes * 2;
  function reward() { setPancakes(n => n + 1); }
  return (
    <>
      <h2>Pancakes: {pancakes}</h2>
      <p>Syrup servings: {syrup}</p>
      <button onClick={reward}>Reward a slide ride</button>
      {pancakes > 0 && <p>Breakfast is ready!</p>}
    </>
  );
}