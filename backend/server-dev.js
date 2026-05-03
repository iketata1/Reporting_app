const express = require('express');
const cors = require('cors');
const app = require('./server');

const devApp = express();

devApp.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

devApp.use('/api', app);

const PORT = process.env.PORT || 5002;

devApp.listen(PORT, () => {
  console.log(`Development server running on http://localhost:${PORT}`);
});
