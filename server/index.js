const path = require('path');
const express = require('express');
const { sendToSupport } = require('./support');

const app = express();
const PORT = process.env.PORT || 3000;
const minimumSubmission = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public'), { extensions: ['html'] }));

app.post('/contact', (req, res) => {
  const name = (req.body.name || '').trim();
  const email = (req.body.email || '').trim();
  const message = (req.body.message || '').trim();
  //read the honeypot field as well as the timestamp sent from the form 
  const honeypot = (req.body.website || '').trim()
  const loadedAt = Number(req.body.loadedAt);

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Please fill in your name, email and message.' });
  }
  //Calculate how many miliseconds elapsed between page load and submit
  const elapsedMs = Date.now() - loadedAt
  const isSpam = Boolean(honeypot) || !Number.isFinite(loadedAt) || elapsedMs < minimumSubmission;

  if(isSpam){
    return res.json({ok: true})
  }

  sendToSupport({ name, email, message });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Calico Media site running at http://localhost:${PORT}`);
});
