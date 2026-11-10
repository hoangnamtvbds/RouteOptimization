export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { url } = req.body || {};
  if (!url) return res.status(400).json({ error: 'URL không được để trống' });

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const finalUrl = response.url;
    const atMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return res.status(200).json({ lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) });
    }

    const qMatch = finalUrl.match(/[?&](?:q|ll)=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      return res.status(200).json({ lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) });
    }

    return res.status(422).json({ error: 'Không tìm thấy tọa độ trong link' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
