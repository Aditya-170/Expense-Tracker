import { Routes, Route } from "react-router-dom";
import AddExpense from "./pages/AddExpense";
// import Expenses from "./pages/Expenses";
import Home from "./pages/home";
import Navbar from "./components/navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-expense" element={<AddExpense />} />
        {/* <Route path="/expenses" element={<Expenses />} /> */}
      </Routes>
    </>
  );
}
