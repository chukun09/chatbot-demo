// server.js
import express from 'express';
import fetch from 'node-fetch'; // or use global fetch in Node 18+
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.post('/api/anthropic', async (req, res) => {
  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const data = await anthropicRes.json();
  res.json(data);
});

app.listen(PORT, () => console.log('proxy on' + PORT));
