const express = require('express');
const app = express();

app.use(express.json());

let numbers = [];

app.post('/add-number', (req, res) => {
  const { number } = req.body;
  if (!number || isNaN(number)) {
    return res.status(400).json({ error: 'Invalid number' });
  }
  numbers.push(number);
  res.json({ message: 'Number added successfully' });
});

app.get('/average', (req, res) => {
  if (numbers.length === 0) {
    return res.status(404).json({ error: 'No numbers added' });
  }
  const sum = numbers.reduce((a, b) => a + b, 0);
  const average = sum / numbers.length;
  res.json({ average });
});

app.delete('/reset', (req, res) => {
  numbers = [];
  res.json({ message: 'Numbers reset successfully' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Average Calculator microservice listening on port ${port}`);
});