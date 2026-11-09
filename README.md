# Arsip Rahasia untuk Mesha

Website **web rahasia** 2 halaman: **HTML + CSS + JavaScript vanilla**
(tanpa framework, tanpa library eksternal selain Google Fonts).
Ucapan ulang tahun **tidak ada di situs ini** — hanya di web kedua
(link Canva setelah kuis selesai).

## Struktur

```
ultah-mesha/
├── index.html       halaman pembuka: hitung mundur + tombol terkunci
├── kejutan.html     halaman arsip: kuis 3 langkah → link web kedua
├── css/
│   ├── style.css    gaya global + halaman index (editorial ungu lembut)
│   └── kejutan.css  kartu kuis, PIN & papan tombol (khusus kejutan)
├── js/
│   ├── kunci.js     SATU file JS logika waktu: penjaga, hitung mundur, toast
│   ├── tebak.js     kuis tebak-tebakan 3 langkah (halaman kejutan)
│   └── musik.js     musik latar: nyala saat tombol "Lihat disini" diklik
├── music/           lagu latar (mp3) untuk halaman kejutan
├── img/             foto1.jpg … foto4.jpg (tidak dipakai, sisa lama)
└── README.md
```

## Cara Menjalankan

Buka `index.html` lewat **Live Server** (VS Code) — atau klik dua kali file
(php/browser biasa juga jalan, semuanya path relatif).

## Cara Menguji (WAJIB dibaca)

Semua dikendalikan satu baris di paling atas `js/kunci.js`:

```js
const WAKTU_BUKA = new Date("2026-11-10T00:00:00+07:00");
```

Saat ini situs **terkunci** (10 November 2026 masih di masa depan).
Untuk menguji tanpa menunggu, ganti sementara menjadi:

1. **Uji kondisi terbuka** — waktu sudah lewat:
   ```js
   const WAKTU_BUKA = new Date(Date.now() - 1000);
   ```
   Buka `kejutan.html` → langsung tampil isinya. Buka `index.html` →
   hitung mundur `00:00:00:00` dan tombol langsung aktif ("Buka sekarang").

2. **Uji kondisi terkunci** — waktu masih beberapa menit lagi:
   ```js
   const WAKTU_BUKA = new Date(Date.now() + 2 * 60 * 1000); // +2 menit
   ```
   - `kejutan.html` → otomatis dialihkan ke `index.html`
    - Klik "Buka kejutan" → toast muncul: *"Eits, belum boleh dibuka…"*
     dan tombol bergoyang
   - Tunggu 2 menit → tanpa refresh, hitung mundur menyentuh nol dan
     tombol berubah aktif sendiri

3. **Kembalikan ke nilai asli setelah selesai:**
   ```js
   const WAKTU_BUKA = new Date("2026-11-10T00:00:00+07:00");
   ```

Penjaga di `kejutan.html` memakai `window.location.replace('index.html')`
sebelum konten sempat dirender — tidak ada status yang disimpan di
localStorage, jadi pengecekan selalu berdasarkan waktu nyata.

## Bagian yang Perlu Diganti

| Bagian | Lokasi |
|---|---|
| Teks pembuka & pengantar | `index.html` — `<header class="pembuka">` |
| Teks pembuka arsip & sapaan | `kejutan.html` — `<header class="judul-kejutan">` |
| Soal 1 & 2 (jawaban bebas) | `kejutan.html` — `<div class="langkah" id="langkah-1/2">` |
| Jawaban benar soal 3 (tanggal lahir) | `js/tebak.js` — konstanta `TANGGAL_LAHIR` (`"10112006"` = 10-11-2006) |
| Link tombol "Lihat disini" (web kedua / Canva) | `kejutan.html` — atribut `href` pada `<a class="btn btn-lihat">` |
| Waktu arsip terbuka | `js/kunci.js` — `WAKTU_BUKA` |
| Musik latar | `js/musik.js` — `NAMA_LAGU` + `MULAI_DETIK` + `src` `<audio>` di `kejutan.html` |
| Warna | `css/style.css` — variabel di `:root` |

## Catatan

- Halaman kejutan hanya berisi pembuka arsip + kuis tebak-tebakan
  3 langkah (2 soal essay bebas + tanggal lahir wajib benar). Tanpa
  ucapan ulang tahun di situs ini. Tombol "Lihat disini" (link web
  kedua di Canva, tempat ucapan berada) baru muncul setelah kuis
  selesai — tanpa gambar.
- Desain **editorial elegan**: latar off-white keunguan, kartu putih,
  aksen lavender (`--ungu`, `--ungu-tua`), tipografi Cormorant Garamond
  + Inter. Tanpa confetti/balon/washi — ruang kosong dan hierarki
  tipografi yang diandalkan.
- Soal ke-3 dijawab lewat papan tombol angka di layar, jadi keyboard HP
  tidak muncul sama sekali.
- JavaScript hanya untuk logika waktu (penjaga, hitung mundur, toast)
  dan kuis — animasi UI (fade-in, goyang, denyut) murni CSS.
- Musik latar (`music/*.mp3`) menyala saat tombol **"Lihat disini"
  diklik** (bukan saat kuis selesai), mulai dari detik ke-6 (lewati
  intro, atur lewat `MULAI_DETIK` di `js/musik.js`), di-loop selama
  halaman `kejutan.html` terbuka, dan berhenti saat tab ditutup.
  Tanpa tombol kontrol. Untuk mengganti lagu: timpa file di
  `folder music/` lalu samakan namanya dengan `NAMA_LAGU` di
  `js/musik.js` dan `src` `<audio>` di `kejutan.html`. Loop-nya
  manual lewat event `ended` (bukan atribut `loop` HTML — atribut itu
  selalu mengulang dari detik 0). Jika browser memblokir autoplay,
  musik mulai pada sentuhan pertama berikutnya di layar.
- Mobile-first, dengan penyesuaian di `min-width: 768px`.
