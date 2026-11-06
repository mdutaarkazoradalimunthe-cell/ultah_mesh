/* =========================================================
   kunci.js — satu-satunya JavaScript: logika waktu
   1. Penjaga halaman kejutan (redirect sebelum konten tampil)
   2. Hitung mundur real time di halaman index
   3. Perilaku tombol + toast (tanpa alert bawaan browser)
   ========================================================= */

/* Waktu kejutan terbuka: 10 November 2026 pukul 00:00 WIB (UTC+7).
   Untuk menguji, ganti sementara mis.:
     const WAKTU_BUKA = new Date(Date.now() + 2 * 60 * 1000); // +2 menit
     const WAKTU_BUKA = new Date(Date.now() - 1000);           // sudah lewat
   Kembalikan ke nilai asli setelah selesai menguji. */
const WAKTU_BUKA = new Date(Date.now() - 1000); /* PREVIEW: sementara, kembalikan ke "2026-11-10T00:00:00+07:00" */

/* Apakah sekarang sudah lewat waktu buka? (waktu nyata, tanpa localStorage) */
function sudahWaktunya() {
    return Date.now() >= WAKTU_BUKA.getTime();
}

/* ---------------------------------------------------------
   PENJAGA HALAMAN KEJUTAN
   Dijalankan sinkron saat <script data-jaga> diparse di <head>,
   jadi konten belum sempat dirender kalau terkunci.
--------------------------------------------------------- */
function jagaHalaman() {
    document.documentElement.style.visibility = "hidden"; /* sembunyikan dulu */

    if (!sudahWaktunya()) {
        window.location.replace("index.html"); /* terkunci → kembali ke pembuka */
    } else {
        document.documentElement.style.visibility = "visible"; /* lolos → tampilkan */
    }
}

/* ---------------------------------------------------------
   HITUNG MUNDUR (halaman index)
--------------------------------------------------------- */
function mulaiHitungMundur() {
    const kotak = {
        hari: document.getElementById("hari"),
        jam: document.getElementById("jam"),
        menit: document.getElementById("menit"),
        detik: document.getElementById("detik")
    };
    const tombol = document.getElementById("tombol-buka");

    /* Halaman ini bukan halaman hitung mundur → tidak ada yang dikerjakan */
    if (!tombol || !kotak.hari || !kotak.jam || !kotak.menit || !kotak.detik) return;

    /* Isi kotak dengan angka dua digit */
    function isi(nilai, elemen) {
        elemen.textContent = String(nilai).padStart(2, "0");
    }

    /* Ubah tombol ke status aktif (waktunya sudah tiba) */
    function aktifkanTombol() {
        tombol.classList.add("aktif");
        tombol.textContent = "Buka sekarang";
        tombol.setAttribute("aria-disabled", "false");
    }

    function perbarui() {
        const sisa = WAKTU_BUKA.getTime() - Date.now();

        if (sisa <= 0) {
            /* Hitung mundur mencapai nol → semua nol, tombol aktif */
            isi(0, kotak.hari);
            isi(0, kotak.jam);
            isi(0, kotak.menit);
            isi(0, kotak.detik);
            aktifkanTombol();
            clearInterval(id);
            return;
        }

        isi(Math.floor(sisa / 86400000), kotak.hari);              /* hari */
        isi(Math.floor(sisa / 3600000) % 24, kotak.jam);            /* jam */
        isi(Math.floor(sisa / 60000) % 60, kotak.menit);            /* menit */
        isi(Math.floor(sisa / 1000) % 60, kotak.detik);             /* detik */
    }

    const id = setInterval(perbarui, 1000);
    perbarui(); /* jalan sekali sekarang: kalau sudah waktunya, tombol langsung aktif */
}

/* ---------------------------------------------------------
   TOMBOL "BUKA KEJUTAN" + TOAST PERINGATAN
--------------------------------------------------------- */
function pasangTombol() {
    const tombol = document.getElementById("tombol-buka");
    const toast = document.getElementById("toast");
    if (!tombol || !toast) return;

    let jedaToast;

    tombol.addEventListener("click", function (e) {
        if (sudahWaktunya()) return; /* sudah waktunya → biarkan link berjalan */

        /* Belum waktunya: cegah pindah halaman, tampilkan toast, goyang tombol */
        e.preventDefault();

        toast.classList.add("tampil");
        clearTimeout(jedaToast);
        jedaToast = setTimeout(function () {
            toast.classList.remove("tampil");
        }, 3500);

        tombol.classList.remove("goyang");
        void tombol.offsetWidth; /* paksa ulang animasi kalau diklik cepat */
        tombol.classList.add("goyang");
    });

    /* Berhentikan animasi goyang setelah selesai */
    tombol.addEventListener("animationend", function () {
        tombol.classList.remove("goyang");
    });
}

/* ---------------------------------------------------------
   PENENTUAN MODE BERDASARKAN ATRIBUT <script>
   - <script src="js/kunci.js" data-jaga>  → penjaga halaman kejutan
   - <script src="js/kunci.js" defer>      → hitung mundur + tombol (index)
--------------------------------------------------------- */
const skripAktif = document.currentScript;

if (skripAktif && skripAktif.hasAttribute("data-jaga")) {
    jagaHalaman(); /* sinkron, sebelum konten diparse */
} else {
    function mulaiSemua() {
        mulaiHitungMundur();
        pasangTombol();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mulaiSemua);
    } else {
        mulaiSemua(); /* defer: DOM sudah siap */
    }
}
