/* =========================================================
   musik.js — musik latar di kejutan.html
   Menyala saat tombol "Lihat disini" diklik, mulai dari detik
   MULAI_DETIK, loop manual selama halaman terbuka.
   ========================================================= */

/* GANTI: nama file musik di folder music/ */
const NAMA_LAGU = "Nadin Amizah - Ah (Official Lyric Video) [youaretube.com].mp3";

/* GANTI: detik awal lagu saat diputar (lewati intro) */
const MULAI_DETIK = 6;

const musik = document.getElementById("musik-latar");
let sudahCobaDengar = false;

/* Pasang listener sekali-pakai: browser kadang menolak play()
   karena kebijakan autoplay → nyalakan pada sentuhan berikutnya.
   Begitu SATU jenis event fire, ketiganya dilepas supaya tidak menggantung. */
function dengarSaatSentuhPertama() {
    const daftar = ["pointerdown", "touchstart", "keydown"];

    function lepasSemua() {
        daftar.forEach(function (jenis) {
            window.removeEventListener(jenis, sentuh);
        });
    }

    function sentuh() {
        lepasSemua();
        nyalakanMusik();
    }

    daftar.forEach(function (jenis) {
        window.addEventListener(jenis, sentuh, { passive: true });
    });
}

function nyalakanMusik() {
    if (!musik || sudahCobaDengar) return;
    sudahCobaDengar = true;

    /* Mulai dari detik ke-6 (lewati intro). Kalau sudah lewat, jangan mundur. */
    if (musik.currentTime < MULAI_DETIK) musik.currentTime = MULAI_DETIK;

    const janji = musik.play();
    if (!janji) return; /* browser lama tanpa Promise */

    janji.catch(function () {
        /* Ditolak: tunggu gesture pengguna berikutnya */
        sudahCobaDengar = false;
        dengarSaatSentuhPertama();
    });
}

/* File tidak ditemukan → halaman tetap jalan, hanya peringatan */
if (musik) {
    musik.addEventListener("error", function () {
        console.warn("Musik tidak bisa dimuat: music/" + NAMA_LAGU);
    });

    /* Loop manual: event "ended" tidak pernah terjadi kalau atribut loop
       bawaan masih dipasang (dia selalu mengulang dari detik 0). */
    musik.addEventListener("ended", function () {
        sudahCobaDengar = false; /* izinkan play() lagi */
        musik.currentTime = MULAI_DETIK;
        nyalakanMusik();
    });
}

/* Musik menyala saat tombol "Lihat disini" (link Canva) diklik.
   Link sudah ada di DOM sejak awal, cuma tersembunyi sampai kuis selesai. */
const tombolLihat = document.querySelector(".btn-lihat");
if (tombolLihat) {
    tombolLihat.addEventListener("click", function () {
        nyalakanMusik(); /* gesture klik → play() diizinkan browser */
    });
}
