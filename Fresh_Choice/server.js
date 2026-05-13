import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/meal', async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: req.body.prompt }] }]
        })
      }
    );
    const data = await response.json();
    console.log('Full Gemini response:', JSON.stringify(data, null, 2));

    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      res.status(500).json({ error: 'No response from Gemini' });
      return;
    }

    const text = data.candidates[0].content.parts[0].text;
    res.json({ text });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3001, () => console.log('✅ API server running on http://localhost:3001'));
console.log('Key loaded:', !!process.env.GEMINI_API_KEY);