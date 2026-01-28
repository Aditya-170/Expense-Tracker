import { useState } from "react";

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !category) {
      alert("All fields required");
      return;
    }
    setAmount("");
    setCategory("");
    alert("Expense Added");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Expense</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <br /><br />

        <button type="submit">Add</button>
      </form>
    </div>
  );
}
