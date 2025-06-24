const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let transactions = [];

app.post("/transactions", (req, res) => {
  const { amount, description } = req.body;
  if (typeof amount !== "number" || !description) {
    return res.status(400).json({ error: "Invalid transaction data" });
  }
  const transaction = {
    id: transactions.length + 1,
    amount,
    description,
    cretedAt: new Date(),
  };
  transactions.push(transaction);
  res.status(201).json(transaction);
});

app.get("/transactions", (req, res) => {
  res.json(transactions);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
