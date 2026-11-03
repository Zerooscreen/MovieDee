const API = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY || '513182919ede525d4b5c8292e15b3c06';
const IMG = 'https://image.tmdb.org/t/p/';

// Data cadangan (Fallback) jika jaringan ke TMDB diblokir hosting
const fallbackMovies = {
  results: [
    {
      id: 1,
      title: "ตัวอย่างภาพยนตร์ไทย (MovieDee Demo)",
      name: "ตัวอย่างซีรีส์ไทย (MovieDee Demo)",
      poster_path: null,
      backdrop_path: null,
      overview: "ระบบกำลังจำลองข้อมูลเนื่องจากข้อจำกัดเครือข่ายของเซิร์ฟเวอร์โฮสติ้ง",
      vote_average: 8.5,
      release_date: "2026-01-01",
      first_air_date: "2026-01-01"
    }
  ],
  total_pages: 1
};

async function tmdb(path, params = {}) {
  const url = new URL(API + path);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'th-TH');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!res.ok) {
      console.error(`TMDB Error [${res.status}], menggunakan fallback data.`);
      return fallbackMovies;
    }
    return await res.json();
  } catch (err) {
    console.error("Fetch failed, menggunakan fallback data:", err.message);
    return fallbackMovies; // Mengembalikan data cadangan agar tidak error 500
  }
}

function img(path, size = 'w500') {
  return path ? IMG + size + path : 'https://placehold.co/342x513/17171b/8d8a92?text=MovieDee';
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
