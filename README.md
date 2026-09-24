# SABR Shift's Report

<p align="center">
  <img src="src/asset/logo/documents.png" alt="SABR Shift's Report logo" width="120" />
</p>

<p align="center">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img alt="FullCalendar" src="https://img.shields.io/badge/FullCalendar-3178C6?style=for-the-badge&logo=fullcalendar&logoColor=white" />
</p>

SABR Shift's Report adalah dashboard berbasis web untuk membantu pencatatan dan monitoring data pasien, pegawai, serta jadwal shift dalam satu tampilan yang rapi dan mudah dipantau.

## ✨ Fitur Utama

- Dashboard laporan pasien dalam format tabel
- Daftar pegawai dengan kolom tanda tangan dan aksi
- Daftar pasien dengan data usia dan pengelolaan sederhana
- Fitur pencarian nama pasien
- Navigasi shift: pagi, siang, dan malam
- Kalender bulanan yang terintegrasi
- Sidebar yang dapat ditutup/ditampilkan untuk pengalaman penggunaan yang lebih bersih
- Desain modern dengan Tailwind CSS

## 🧩 Teknologi yang Digunakan

- HTML5
- Tailwind CSS v4
- JavaScript vanilla
- FullCalendar
- Temporal Polyfill

## 📁 Struktur Proyek

```bash
report/
├── index.html
├── package.json
├── README.md
├── dist/
│   └── style.css
├── src/
│   ├── style.css
│   └── asset/
│       ├── logo/
│       └── signature/
└── node_modules/
```

## 🚀 Cara Menjalankan

### 1. Install dependency

```bash
npm install
```

### 2. Jalankan mode development

```bash
npm run dev
```

Perintah ini akan menjalankan Tailwind CSS dalam mode watch agar file CSS otomatis diperbarui saat ada perubahan.

### 3. Build produksi

```bash
npm run build
```

### 4. Buka aplikasi

Buka file `index.html` di browser, atau gunakan Live Server untuk tampilan yang lebih nyaman saat pengembangan.

## 📝 Catatan Aplikasi

Proyek ini masih berupa dashboard front-end statis yang cocok untuk prototype atau kebutuhan awal sistem pelaporan harian. Struktur datanya masih bersifat dummy, sehingga sangat mudah dikembangkan ke fitur CRUD yang lebih kompleks di masa depan.

## 🎯 Potensi Pengembangan

- Integrasi backend dan database
- CRUD pasien dan pegawai
- Autentikasi pengguna
- Export laporan ke PDF/Excel
- Manajemen jadwal shift yang lebih terstruktur
- Validasi data dan form input

## 📜 Lisensi

Proyek ini menggunakan lisensi ISC.

## 👤 Kontributor

Project ini dibuat sebagai dashboard report management yang dapat terus dikembangkan sesuai kebutuhan operasional tim.

---

Jika kamu mau, saya juga bisa bantu bikin versi README yang lebih premium dengan:

- tampilan hero section lebih modern
- badge teknologi yang lebih banyak
- screenshot mockup section
- versi README dalam bahasa Inggris
- struktur yang lebih cocok untuk portfolio/GitHub project
