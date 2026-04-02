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

---

## 📁 Struktur File

```
madha-tjatunissa/
├── index.html          ← Dashboard utama (semua halaman dalam satu file)
├── kalkulator.html     ← Halaman kalkulator
├── assets/
│   └── music/          ← File audio .mp3 untuk music player
└── README.md           ← Dokumentasi ini
```

---

## 🔗 Sumber Data (Google Sheets)

Semua data ditarik **langsung dari Google Sheets** yang telah dipublikasikan ke web (CSV), tanpa backend server.

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
  // tambahkan kolom baru di sini:
  cabang:   col[4]?.trim() || '',  // ← contoh kolom E
});
```

Lalu tambahkan `<th>` dan `<td>` yang sesuai di tabel HTML halaman Karyawan.

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

## 🎵 Music Player

Music player otomatis memuat playlist dari folder `assets/music/`.  
Format yang didukung: **MP3**.

Untuk menambah lagu:
1. Upload file `.mp3` ke folder `assets/music/`
2. Playlist akan dideteksi otomatis dari `manifest.json` (jika ada) atau daftar manual di kode

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
| [Unsplash](https://unsplash.com/) | Background foto |
| [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Font utama |
| GitHub Pages | Hosting gratis |

---

## 👤 Author

**Kugatsu-Amorata**  
Repository: `madha-tjatunissa`  
Live site: [kugatsu-amorata.github.io/madha-tjatunissa](https://kugatsu-amorata.github.io/madha-tjatunissa/index.html)

---

*Last updated: April 2026*
