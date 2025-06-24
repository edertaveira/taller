import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setList(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (isNaN(value) || !description) {
      setError("Please enter valid amount and description");
      return;
    }

    const res = await fetch("http://localhost:3000/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: value, description }),
    });

    if (res.ok) {
      setAmount("");
      setDescription("");
      setError("");
      fetchTransactions();
      alert("Transaction submitted successfully!");
    } else {
      const errorData = await res.json();
      setError(errorData.message || "Failed to submit transaction");
    }
  };

  return (
    <div className="max-w-10/12 mx-auto w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Submit Transaction</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 flex flex-col rounded shadow-md"
      >
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mb-4 p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Submit Transaction
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <h3 className="text-2xl my-4">Transactions</h3>
      <ul>
        {isLoading && <p>Loading...</p>}
        {!isLoading && list.length === 0 && <p>No transactions found.</p>}
        {!isLoading &&
          list.map((transaction) => (
            <li key={transaction.id} className="mb-2 bg-gray-100 p-2 rounded">
              {transaction.description}: ${transaction.amount.toFixed(2)}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default App;
