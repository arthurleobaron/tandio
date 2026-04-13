module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { email } = req.body || {};
  
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Adresse email invalide.' });
    }
  
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [parseInt(process.env.BREVO_LIST_ID || '3')],
        updateEnabled: true,
      }),
    });
  
    if (response.ok || response.status === 204) {
      return res.status(200).json({ success: true });
    }
  
    const err = await response.json().catch(() => ({}));
    return res.status(response.status).json({ error: err.message || "Erreur lors de l'inscription." });
  };