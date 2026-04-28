export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const NUTRITION_DB = '34ef99ee6960800a8c57e61ac53a587a';
  const SPORT_DB = '34ef99ee696080349c00d2a969fae248';
  const NOTION_TOKEN = process.env.NOTION_TOKEN;

  const { db, ...notionBody } = req.body || {};

  const DB_MAP = {
    nutrition: NUTRITION_DB,
    sport: SPORT_DB
  };

  const DATABASE_ID = DB_MAP[db] || db;

  if (!DATABASE_ID) return res.status(400).json({ error: 'Missing db' });

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
