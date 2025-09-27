// Netlify Function: visitor-profile
// Debug endpoint (simplified) – preferences column removed

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  try {
    const visitorId = event.queryStringParameters && event.queryStringParameters.id;
    if (!visitorId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing id param ?id=visitor_id' }) };
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_DATABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !key) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Supabase env vars missing' }) };
    }

    const client = createClient(supabaseUrl, key, { auth: { autoRefreshToken: false, persistSession: false } });

    const { data, error } = await client
      .from('visitors')
      .select('visitor_id, first_seen, last_seen')
      .eq('visitor_id', visitorId)
      .single();

    if (error) {
      return { statusCode: 404, body: JSON.stringify({ error: error.message }) };
    }

    return { statusCode: 200, body: JSON.stringify({ profile: data }, null, 2) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};