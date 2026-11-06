/* =========================================================
   musik.js — musik latar di kejutan.html
   Menyala otomatis setelah tanggal lahir dijawab benar
   (dipanggil tebak.js), loop selama halaman terbuka.
   ========================================================= */

/* GANTI: nama file musik di folder music/ */
const NAMA_LAGU = "Nadin Amizah - Ah (Official Lyric Video) [youaretube.com].mp3";

const musik = document.getElementById("musik-latar");
let sudahCobaDengar = false;

/* Pasang listener sekali-pakai: browser kadang menolak play()
   karena kebijakan autoplay → nyalakan pada sentuhan berikutnya */
function dengarSaatSentuhPertama() {
    ["pointerdown", "touchstart", "keydown"].forEach(function (jenis) {
        window.addEventListener(jenis, function sentuh() {
            window.removeEventListener(jenis, sentuh);
            nyalakanMusik();
        }, { once: true, passive: true });
    });
}

function nyalakanMusik() {
    if (!musik || sudahCobaDengar) return;
    sudahCobaDengar = true;

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
}
