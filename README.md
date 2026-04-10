# 📊 Dashboard Data Madha

> Dashboard internal PT KB Finansia Multi Finance — dibangun dengan HTML, CSS, dan JavaScript murni, di-host via **GitHub Pages**. Tidak memerlukan server, database, atau framework apapun.

---

## 🗂️ Halaman yang Tersedia

| Ikon | Halaman | File | Deskripsi |
|------|---------|------|-----------|
| 📊 | **KMOB** | `index.html` | Data KMOB (Motor Over Budget) — Agreement, Nama, Area, Cabang, Klasifikasi, Plat, Phone |
| 🏢 | **Cabang** | `index.html` | Data seluruh cabang operasional — Nama, Alamat, Telepon, Area, Status |
| 👥 | **Karyawan** | `index.html` | Direktori karyawan — Emp.No, Nama, Sub Departemen, Jabatan |
| ☪️ | **Al-Quran** | `index.html` | Al-Quran digital 114 Surah + Jadwal Sholat Kemenag RI + Kalender Hijriyah |
| 🧮 | **Kalkulator** | `kalkulator.html` | Kalkulator finansial KMOB (Sale & Leaseback) |
| 🎵 | **Musik** | `music.html` | Music player premium (Spotify-style) dengan daftar putar, favorit, dan filter |

---

## 📁 Struktur File Lengkap

```
madha-tjatunissa/
│
├── index.html              ← Dashboard utama
├── kalkulator.html         ← Kalkulator finansial
├── music.html              ← Halaman music player premium
├── README.md               ← Dokumentasi ini
│
└── assets/
    ├── js/
    │   └── music-player.js     ← Engine global music player
    └── music/
        ├── playlist.json       ← Daftar lagu (EDIT INI untuk tambah/hapus lagu)
        ├── lagu1.mp3           ← File audio
        ├── cover1.jpg          ← Cover art
        └── ...
```

---

## 🎵 Music Player — Panduan Lengkap

### Fitur yang Tersedia

| Fitur | Keterangan |
|-------|-----------|
| ▶️ Floating Player | Bar player fixed di bawah, muncul di semua halaman |
| 🔄 Rotasi Cover | Cover art berputar saat musik diputar |
| ⏮⏭ Prev / Next | Navigasi antar lagu dengan looping otomatis |
| 🔊 Volume | Slider volume di floating player |
| ⏱️ Progress Bar | Bisa diklik/drag untuk skip ke posisi tertentu |
| 💾 Persistence | Lagu tetap berjalan saat pindah halaman, posisi tersimpan |
| ❤️ Favorit | Klik ikon hati untuk simpan lagu favorit |
| 📁 Daftar Putar | Buat folder playlist sendiri, beri nama, tambah lagu |
| 🔍 Pencarian | Real-time search berdasarkan judul atau artis |
| 🎛️ Filter Genre | Filter lagu berdasarkan genre |
| 🕐 Terakhir Diputar | Riwayat 6 lagu terakhir yang diputar |
| 🔀 Acak | Putar lagu secara acak |
| ⌨️ Shortcut | Spasi=play/pause, panah kiri/kanan=prev/next |
| 🌈 Dynamic Color | Background berubah mengikuti warna cover lagu aktif |
| ↕️ Drag & Drop | Ubah urutan lagu dengan drag |

---

## 🎵 Cara Menambah Lagu Baru

### Langkah 1 — Upload file audio ke GitHub

1. Buka repository di GitHub
2. Masuk ke folder `assets/music/`
3. Klik **Add file → Upload files**
4. Upload file `.mp3` atau `.m4a`
5. Klik **Commit changes**

### Langkah 2 — Daftarkan di playlist.json

1. Buka file `assets/music/playlist.json` di GitHub
2. Klik ikon **pensil ✏️** (Edit this file)
3. Tambahkan entri baru di dalam array `[...]`

```json
[
  {
    "title": "Nama Lagu",
    "artist": "Nama Artis",
    "album": "",
    "file": "assets/music/NamaFile.mp3",
    "cover": "assets/music/cover.jpg",
    "duration": "3:45",
    "genre": "Pop"
  }
]
```

**Penjelasan field:**

| Field | Wajib | Keterangan |
|-------|-------|-----------|
| `title` | ✅ | Judul lagu |
| `artist` | - | Nama artis |
| `album` | - | Nama album (boleh `""`) |
| `file` | ✅ | Path ke file audio — harus PERSIS SAMA dengan nama file yang diupload |
| `cover` | - | Path ke gambar cover (boleh `""`) |
| `duration` | - | Format `"m:ss"` misalnya `"3:45"` |
| `genre` | - | Rock, Pop, Indie, Folk, dll — untuk filter chip |

4. Klik **Commit changes** — lagu langsung muncul!

---

## ❤️ Cara Menggunakan Fitur Favorit

**Menambahkan ke Favorit:**
- Hover ke baris lagu → klik ikon **hati ♡** yang muncul di kanan baris
- Hati berubah merah ❤️ dan muncul notifikasi

**Melihat daftar Favorit:**
- Klik tombol **"Favorit"** di bagian hero atas halaman, ATAU
- Klik folder **"Favorit"** di sidebar kiri

**Catatan:**
- Data tersimpan di localStorage browser secara otomatis
- Tidak hilang saat refresh, tapi berlaku di browser/perangkat yang sama saja

---

## 📁 Cara Menggunakan Daftar Putar (Folder Playlist)

**Membuat daftar putar baru:**
1. Di sidebar kiri, klik tombol **+** di samping "Daftar Putar"
2. Ketik nama → klik OK
3. Folder langsung muncul dengan ikon acak

**Mengganti nama daftar putar:**
- Klik langsung pada **teks nama folder**
- Ketik nama baru → tekan **Enter** untuk simpan
- Tekan **Escape** untuk batal

**Menambah lagu ke daftar putar:**
1. Hover ke baris lagu
2. Klik ikon **+** di paling kanan baris
3. Pilih folder dari popup yang muncul
4. Klik nama folder yang sama lagi untuk menghapus lagu dari folder tersebut

**Menghapus daftar putar:**
- Hover ke folder → klik ikon **×** yang muncul

> "Semua Lagu" dan "Favorit" adalah folder bawaan yang tidak bisa dihapus.

---

## ⌨️ Keyboard Shortcuts

| Tombol | Fungsi |
|--------|--------|
| `Spasi` | Play / Pause |
| `→` | Lagu berikutnya |
| `←` | Lagu sebelumnya |
| `Escape` | Tutup popup |

---

## 🔗 Sumber Data (Google Sheets)

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

## ⚙️ Cara Update Data Google Sheets

1. Buka Google Sheets → **File → Share → Publish to web**
2. Pilih sheet → format **CSV** → klik **Publish** → salin URL
3. Di `index.html`, ganti URL yang sesuai:

```javascript
const url = "https://docs.google.com/spreadsheets/d/e/...csv";         // KMOB
const cabangUrl = "https://docs.google.com/spreadsheets/d/e/...csv";   // Cabang
const karyawanUrl = "https://docs.google.com/spreadsheets/d/e/...csv"; // Karyawan
```

---

## 🚀 Deploy ke GitHub Pages

1. Push semua file ke branch `main`
2. Buka **Settings → Pages**
3. Source: `Deploy from a branch` → `main` → `/ (root)`
4. Klik **Save** — site live di:

```
https://<username>.github.io/<repo-name>/
```

---

## 🕌 Jadwal Sholat

Menggunakan **AlAdhan API** — koordinat Jakarta Selatan (-6.2615, 106.8106), metode Kemenag RI.

Untuk ganti lokasi, edit di `index.html`:
```javascript
'?latitude=-6.2615&longitude=106.8106'
```

---

## 🛠️ Teknologi

| Teknologi | Kegunaan |
|-----------|----------|
| HTML5 / CSS3 | Struktur & tampilan |
| Vanilla JavaScript | Logika, fetch data, navigasi |
| Chart.js | Grafik distribusi |
| SortableJS | Drag & drop lagu |
| Google Sheets CSV | Sumber data real-time |
| AlAdhan API | Jadwal sholat |
| localStorage | Favorit, daftar putar, riwayat, posisi lagu |
| Syne + DM Sans | Font music player |
| Plus Jakarta Sans | Font dashboard |
| GitHub Pages | Hosting gratis |

---

## ❓ Troubleshooting

**Lagu tidak mau diputar?**
Pastikan nama file di `playlist.json` PERSIS SAMA dengan nama file yang diupload, termasuk huruf besar/kecil.

**Playlist tidak muncul?**
Validasi format JSON di [jsonlint.com](https://jsonlint.com) — pastikan tidak ada koma berlebih.

**Favorit/daftar putar hilang?**
Data di localStorage bisa hilang jika cache browser dibersihkan atau pakai mode incognito.

---

## 👤 Author

**Kugatsu-Amorata**
Repository: `madha-tjatunissa`
Live site: [kugatsu-amorata.github.io/madha-tjatunissa](https://kugatsu-amorata.github.io/madha-tjatunissa/index.html)

*Last updated: April 2026*
