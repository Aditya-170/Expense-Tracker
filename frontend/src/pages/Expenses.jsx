import { useEffect, useState } from "react";
import API from "../services/api";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    const res = await API.get("/expenses");
    setExpenses(res.data);
  };

  const deleteExpense = async (id) => {
    await API.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Expenses List</h2>

      {expenses.map((exp) => (
        <div key={exp.id} style={{ marginBottom: "10px" }}>
          💸 {exp.amount} | {exp.category}
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => deleteExpense(exp.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
