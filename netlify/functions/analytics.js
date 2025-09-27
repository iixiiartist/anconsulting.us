// Netlify Function: analytics event receiver
// Captures lightweight events (booking impressions, clicks) and forwards to Netlify Forms for notification/logging.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { event: eventType, sessionId, timestamp } = data;

    if (!eventType || !sessionId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing event or sessionId' }) };
    }

    const formPayload = new URLSearchParams({
      'form-name': 'chat-analytics',
      'event-type': eventType,
      'session-id': sessionId,
      'timestamp': timestamp || new Date().toISOString()
    });

    // Fire and forget to site root (Netlify form capture)
    await fetch('https://anconsulting.us/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formPayload.toString()
    }).catch(() => {});

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Analytics processing failed' }) };
  }
};
