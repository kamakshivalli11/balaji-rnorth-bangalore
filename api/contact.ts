import type { IncomingMessage, ServerResponse } from 'http';

// Simple serverless handler that forwards contact form data to Formspree
// Using generic types to avoid depending on @vercel/node types in this repo.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { FORMSPREE_FORM_ID, FORMSPREE_API_KEY } = process.env;
  if (!FORMSPREE_FORM_ID) {
    return res.status(500).json({ message: 'Formspree form ID not configured. Set FORMSPREE_FORM_ID in env.' });
  }

  const body = req.body;
  if (!body || !body.name || !body.phone) {
    return res.status(400).json({ message: 'Missing required fields: name and phone' });
  }

  try {
    const endpoint = `https://formspree.io/f/${FORMSPREE_FORM_ID}`;
    const headers: Record<string, string> = { 'Accept': 'application/json', 'Content-Type': 'application/json' };
    // If you have an API key, include it as Authorization per Formspree docs
    if (FORMSPREE_API_KEY) headers['Authorization'] = `Bearer ${FORMSPREE_API_KEY}`;

    const resp = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const respJson = await resp.json().catch(() => ({}));
    if (resp.ok) {
      return res.status(200).json({ message: 'ok' });
    }

    console.error('Formspree error', resp.status, respJson);
    return res.status(502).json({ message: 'Failed to send message', details: respJson });
  } catch (err) {
    console.error('Contact handler error', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
