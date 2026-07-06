const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const leadsFile = path.resolve(process.env.LEADS_FILE_PATH || path.join(__dirname, 'data', 'leads.json'));

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));

app.post('/api/contact', (req, res) => {
  const required = ['name', 'phone', 'email', 'businessName', 'serviceNeeded', 'message'];
  const missing = required.some((field) => !req.body[field] || String(req.body[field]).trim().length < 2);

  if (missing) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const lead = {
    name: String(req.body.name).trim(),
    phone: String(req.body.phone).trim(),
    email: String(req.body.email).trim(),
    businessName: String(req.body.businessName).trim(),
    serviceNeeded: String(req.body.serviceNeeded).trim(),
    message: String(req.body.message).trim(),
    createdAt: new Date().toISOString(),
    source: 'marvinsolis.com'
  };

  fs.mkdirSync(path.dirname(leadsFile), { recursive: true });
  let leads = [];
  if (fs.existsSync(leadsFile)) {
    try {
      leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
    } catch {
      leads = [];
    }
  }

  leads.push(lead);
  fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
  return res.json({ ok: true });
});

app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('.xml') || filePath.endsWith('.txt')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Marvin Solis website running on port ${PORT}`);
});
