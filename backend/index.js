// index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Sample test route
app.get('/api/orders', (req, res) => {
  res.json([
    {
      id: "ORD-001",
      customerName: "John Doe",
      total: 45.99,
      status: "paid",
    },
    {
      id: "ORD-002",
      customerName: "Jane Smith",
      total: 62.50,
      status: "processing",
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
