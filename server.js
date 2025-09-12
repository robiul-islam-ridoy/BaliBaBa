const express = require('express');
const path = require('path');
const app = express();
const PORT = 5500;

// Root (/) → login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Shop route → index.html
app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static assets (js, css, etc.)
app.use(express.static(path.join(__dirname)));

// Catch-all for other routes (optional)
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
