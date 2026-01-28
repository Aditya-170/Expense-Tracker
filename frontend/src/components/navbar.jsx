import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#222" }}>
      <Link to="/" style={{ color: "white", marginRight: "15px" }}>Home</Link>
      <Link to="/add-expense" style={{ color: "white", marginRight: "15px" }}>Add Expense</Link>
      <Link to="/expenses" style={{ color: "white" }}>Show Expenses</Link>
    </nav>
  );
}
