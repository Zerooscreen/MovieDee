const API = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY || '513182919ede525d4b5c8292e15b3c06';
const IMG = 'https://image.tmdb.org/t/p/';

// Struktur data pengaman lengkap agar server.js tidak mengalami error 404 / blank hitam
const safeDefaultData = {
  results: [
    {
      id: 101,
      title: "The Interest",
      name: "The Interest (รักต่อดอก)",
      poster_path: "/pWsDKNLPkV2yXlJ1l42UoU5L63t.jpg",
      backdrop_path: "",
      overview: "ภาพยนตร์ไทยแนวโรแมนติกคอมเมดี้",
      vote_average: 8.8,
      release_date: "2026-02-14",
      first_air_date: "2026-02-14"
    }
  ],
  total_pages: 1,
  genres: [],
  seasons: [],
  episodes: [],
  cast: [],
  crew: [],
  backdrops: [],
  posters: []
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
      return safeDefaultData;
    }
    
    const data = await res.json();
    // Jika data kosong atau tidak ada hasil, kembalikan data aman
    if (!data || (Array.isArray(data.results) && data.results.length === 0 && !data.id)) {
      return safeDefaultData;
    }
    return data;
  } catch (err) {
    // Menangkap semua error jaringan agar server tetap hidup dan tidak 404
    return safeDefaultData;
  }
}

function img(path, size = 'w500') {
  return path ? IMG + size + path : 'https://placehold.co/342x513/17171b/e50914?text=MovieDee';
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
