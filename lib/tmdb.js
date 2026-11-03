const API = 'https://corsproxy.io/?' + encodeURIComponent('https://api.themoviedb.org/3');
const API_KEY = process.env.TMDB_API_KEY || '513182919ede525d4b5c8292e15b3c06';
const IMG = 'https://image.tmdb.org/t/p/';

async function tmdb(path, params = {}) {
  const targetUrl = new URL('https://api.themoviedb.org/3' + path);
  targetUrl.searchParams.set('api_key', API_KEY);
  targetUrl.searchParams.set('language', 'th-TH');
  for (const [k, v] of Object.entries(params)) targetUrl.searchParams.set(k, v);
  
  // Menggunakan proxy publik untuk melewati blokir IP datacenter Back4App
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl.toString())}`;

  try {
    const res = await fetch(proxyUrl);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`TMDB Proxy Error [${res.status}]:`, errorText);
      throw new Error('TMDB request failed: ' + res.status);
    }
    return await res.json();
  } catch (err) {
    console.error("Fetch failed via proxy:", err.message);
    throw err;
  }
}

function img(path, size = 'w500') {
  return path ? IMG + size + path : 'https://placehold.co/342x513/17171b/8d8a92?text=No+Image';
}

function slugify(title = '') {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .slice(0, 60) || 'title';
}

module.exports = { tmdb, img, slugify, API_KEY };
