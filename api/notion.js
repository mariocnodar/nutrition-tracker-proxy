export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const NUTRITION_DB = '34ef99ee6960800a8c57e61ac53a587a';
  const SPORT_DB = '34ef99ee696080349c00d2a969fae248';
  const NOTION_TOKEN = process.env.NOTION_TOKEN;

  // Choose DB based on path or body param
  const dbType = req.body?.db || 'nutrition';
  const DATABASE_ID = dbType === 'sport' ? SPORT_DB : NUTRITION_DB;

  // Remove db param from body before sending to Notion
  const { db, ...notionBody } = req.body || {};

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notionBody)
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
