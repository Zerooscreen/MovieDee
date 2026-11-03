const API = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY || '513182919ede525d4b5c8292e15b3c06';
const IMG = 'https://image.tmdb.org/t/p/';

async function tmdb(path, params = {}) {
  const url = new URL(API + path);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'th-TH'); // <-- bahasa Thailand
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  
  try {
    // Menambahkan User-Agent agar tidak diblokir oleh firewall TMDB di server cloud
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      const err = new Error('TMDB request failed: ' + res.status);
      err.status = res.status;
      throw err;
    }
    return res.json();
  } catch (error) {
    console.error("TMDB Fetch Error:", error.message);
    throw error;
  }
}

function img(path, size = 'w500') {
  return path ? IMG + size + path : 'https://placehold.co/342x513/17171b/8d8a92?text=No+Image';
}

// Slug URL dari judul (menjaga huruf Thai, membuang simbol).
// PENTING: tidak di-encode di sini -> encode HANYA saat membangun href/redirect,
// supaya tetap cocok dengan req.params.slug yang otomatis di-decode Express.
function slugify(title = '') {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .slice(0, 60) || 'title';
}

module.exports = { tmdb, img, slugify, API_KEY };
