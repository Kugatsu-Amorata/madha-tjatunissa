# 📊 Dashboard Data Madha

> Dashboard internal PT KB Finansia Multi Finance — dibangun dengan HTML, CSS, dan JavaScript murni, di-host via **GitHub Pages**.

---

## 🗂️ Halaman yang Tersedia

| Ikon | Halaman | Deskripsi |
|------|---------|-----------|
| 📊 | **KMOB** | Data KMOB (Motor Over Budget) — Agreement, Nama, Area, Cabang, Klasifikasi, Plat, Phone |
| 🏢 | **Cabang** | Data seluruh cabang operasional — Nama, Alamat, Telepon, Area, Status |
| 👥 | **Karyawan** | Direktori karyawan — Emp.No, Nama, Sub Departemen, Jabatan |
| ☪️ | **Al-Quran** | Al-Quran digital 114 Surah + Jadwal Sholat Kemenag RI + Kalender Hijriyah |
| 🧮 | **Kalkulator** | Kalkulator finansial (halaman terpisah `kalkulator.html`) |
| 🎵 | **Musik** | Music player Spotify-style dengan playlist JSON (halaman terpisah `music.html`) |

---

## 📁 Struktur File

```
madha-tjatunissa/
├── index.html              ← Dashboard utama
├── kalkulator.html         ← Halaman kalkulator
├── music.html              ← Halaman playlist musik (BARU)
├── assets/
│   ├── js/
│   │   └── music-player.js ← Global music player engine (BARU)
│   └── music/
│       ├── playlist.json   ← Sumber data playlist (BARU)
│       ├── lagu1.mp3       ← File audio
│       ├── cover1.jpg      ← Cover art
│       └── ...
└── README.md
```

---

## 🎵 Music Player — Spotify Style

### Fitur
- **Floating bar** fixed di bawah layar, muncul di semua halaman
- **Cover art** dengan animasi rotasi saat play
- **Play / Pause / Next / Previous** dengan loop otomatis
- **Progress bar** interaktif — bisa di-drag untuk seek
- **Volume control** dengan slider
- **Persistence via localStorage** — lagu tetap berjalan saat pindah halaman dan posisi terakhir tersimpan
- **Halaman playlist** (`music.html`) dengan tampilan daftar lagu ala Spotify
- **Highlight track aktif** di halaman playlist
- **Tombol Putar Semua & Acak** di hero playlist

### Arsitektur

```
music-player.js          ← Single file, semua logic
    │
    ├── fetch(playlist.json)   ← Load data lagu
    ├── injectPlayer()         ← Buat floating bar di DOM
    ├── loadTrack(i)           ← Load & play lagu ke-i
    ├── localStorage           ← Simpan posisi & index
    └── window.MDP (API)       ← Kontrol dari halaman lain
```

### Cara Menambah Lagu

1. Upload file `.mp3` dan gambar cover ke `assets/music/`
2. Edit `assets/music/playlist.json`:

```json
[
  {
    "title": "Judul Lagu",
    "artist": "Nama Artis",
    "album": "Nama Album",
    "file": "assets/music/namafile.mp3",
    "cover": "assets/music/cover.jpg",
    "duration": "3:45"
  }
]
```

3. Push ke GitHub — selesai! Tidak perlu sentuh HTML.

### Integrasi ke Halaman Lain

Tambahkan satu baris sebelum `</body>` di halaman apapun:

```html
<script src="assets/js/music-player.js"></script>
```

### API Global (`window.MDP`)

```javascript
MDP.play()        // Play
MDP.pause()       // Pause
MDP.next()        // Lagu berikutnya
MDP.prev()        // Lagu sebelumnya
MDP.playAt(3)     // Play lagu ke-index 3
MDP.getIndex()    // Dapatkan index lagu saat ini
MDP.getPlaylist() // Dapatkan array playlist
```

### Event Custom

```javascript
// Dipicu setelah playlist berhasil dimuat
window.addEventListener('mdp:ready', function(e) {
  const playlist = e.detail.playlist;
  console.log('Playlist loaded:', playlist.length, 'lagu');
});
```

---

## 🔗 Sumber Data (Google Sheets)

Semua data dashboard ditarik **langsung dari Google Sheets** yang telah dipublikasikan ke web (CSV), tanpa backend server.

### KMOB
```
Sheet: (internal)
Kolom: Agreement | Nama | Area | Cabang | Klasifikasi | Plat | Phone | Keterangan | Alasan
```

### Cabang
```
Sheet: (internal)
Kolom: No | Cabang | Alamat | Telepon | Area
```

### Karyawan
```
Sheet ID : 1IZRUXiieRvOLkv3GNx3QSbW9k6K-aRKZccHBG-iFmfg
GID      : 1011154443
Kolom    : A=Emp.No | B=Nama | C=Sub Departemen | D=Jabatan
```

---

## ⚙️ Cara Update Data

### Memperbarui URL Google Sheets

1. Buka Google Sheets yang ingin dipublikasikan
2. Klik **File → Share → Publish to web**
3. Pilih sheet yang diinginkan → format **CSV** → klik **Publish**
4. Salin URL yang muncul
5. Di `index.html`, cari konstanta berikut dan ganti URL-nya:

```javascript
// KMOB
const url = "https://docs.google.com/spreadsheets/d/e/...csv";

// Cabang
const cabangUrl = "https://docs.google.com/spreadsheets/d/e/...csv";

// Karyawan
const karyawanUrl = "https://docs.google.com/spreadsheets/d/e/...csv";
```

### Menambah Kolom Karyawan

Jika ingin menampilkan kolom E, F, dst — edit fungsi `loadKaryawan()` di `index.html`:

```javascript
dataKaryawan.push({
  empNo:    col[0]?.trim() || '',
  nama:     col[1]?.trim() || '',
  subDept:  col[2]?.trim() || '',
  jobTitle: col[3]?.trim() || '',
  cabang:   col[4]?.trim() || '',  // ← contoh kolom E
});
```

---

## 🚀 Deploy ke GitHub Pages

1. Push semua file ke branch `main`
2. Buka **Settings → Pages**
3. Source: `Deploy from a branch` → branch `main` → folder `/ (root)`
4. Klik **Save** — site akan live di:
   ```
   https://<username>.github.io/<repo-name>/
   ```

> ✅ Tidak perlu server — semua berjalan di sisi browser (client-side only).

---

## 🕌 Jadwal Sholat

Jadwal sholat menggunakan **AlAdhan API** (gratis, tanpa API key):
- Koordinat: **Jakarta Selatan** (-6.2615, 106.8106)
- Metode: **Kemenag RI (Method 20)**
- Di-cache harian — hanya 1 request per hari

Untuk mengubah lokasi, edit di `index.html`:
```javascript
var url = 'https://api.aladhan.com/v1/timings/'+key
        + '?latitude=-6.2615&longitude=106.8106'  // ← ganti koordinat
        + '&method=20&school=1'
        + '&timezonestring=Asia%2FJakarta';
```

---

## 🛠️ Teknologi

| Teknologi | Kegunaan |
|-----------|----------|
| HTML5 / CSS3 | Struktur & tampilan |
| Vanilla JavaScript | Logika, fetch data, navigasi |
| [Chart.js](https://www.chartjs.org/) | Grafik distribusi area & departemen |
| [Google Sheets CSV](https://support.google.com/docs/answer/37579) | Sumber data real-time |
| [AlAdhan API](https://aladhan.com/prayer-times-api) | Jadwal sholat |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Music player |
| localStorage | Persistensi state music player |
| [Syne + DM Sans](https://fonts.google.com/) | Font music player |
| [Unsplash](https://unsplash.com/) | Background foto |
| [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Font dashboard utama |
| GitHub Pages | Hosting gratis |

---

## 👤 Author

**Kugatsu-Amorata**  
Repository: `madha-tjatunissa`  
Live site: [kugatsu-amorata.github.io/madha-tjatunissa](https://kugatsu-amorata.github.io/madha-tjatunissa/index.html)

---

*Last updated: April 2026*
