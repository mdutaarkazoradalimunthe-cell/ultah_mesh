/* =========================================================
   tebak.js — kuis tebak-tebakan di kejutan.html
   3 langkah: 2 soal essay bebas + 1 tanggal lahir (wajib benar)
   Tanggal lahir dijawab lewat papan tombol di layar (tanpa keyboard HP)
   ========================================================= */

/* GANTI: tanggal lahir yang benar, format dd-mm-yyyy tanpa strip */
const TANGGAL_LAHIR = "10112006";

const PANJANG_PIN = 8;
let digit = ""; /* isi kotak digit saat ini */

function $(pilih) {
    return document.querySelector(pilih);
}

function tampilkanLangkah(id) {
    document.querySelectorAll(".langkah").forEach(function (el) {
        el.hidden = el.id !== id;
        el.classList.toggle("aktif", el.id === id);
    });

    const aktif = document.getElementById(id);
    if (aktif) {
        const isian = aktif.querySelector(".isian");
        if (isian) setTimeout(function () { isian.focus(); }, 150);
    }
}

/* Getar saat jawaban salah (dihapus lagi setelah animasi selesai) */
function goyang(elemen) {
    elemen.classList.remove("goyang");
    void elemen.offsetWidth; /* paksa ulang animasi */
    elemen.classList.add("goyang");
}

function pesanSalah(id, tampil) {
    const p = document.getElementById(id);
    if (p) p.classList.toggle("tampil", tampil);
}

/* ---------------------------------------------------------
   SOAL 1 & 2 — essay, jawaban bebas asal tidak kosong
--------------------------------------------------------- */
function pasangSoalEssay() {
    [1, 2].forEach(function (n) {
        const tombol = document.querySelector('[data-lanjut="' + n + '"]');
        const isian = document.getElementById("jawab-" + n);
        if (!tombol || !isian) return;

        function cek() {
            if (!isian.value.trim()) {
                pesanSalah("salah-" + n, true);
                goyang(isian);
                isian.focus();
                return;
            }
            pesanSalah("salah-" + n, false);
            tampilkanLangkah("langkah-" + (n + 1));
        }

        tombol.addEventListener("click", cek);
        isian.addEventListener("keydown", function (e) {
            if (e.key === "Enter") cek();
        });
        isian.addEventListener("input", function () {
            pesanSalah("salah-" + n, false);
        });
    });
}

/* ---------------------------------------------------------
   SOAL 3 — papan tombol angka di layar
--------------------------------------------------------- */
function gambarDigit() {
    const kotak = document.querySelectorAll("#slot-digit .kotak-digit");
    kotak.forEach(function (k, i) {
        k.textContent = digit[i] || "";
        k.classList.toggle("terisi", Boolean(digit[i]));
    });
}

function cekTanggal() {
    if (digit.length < PANJANG_PIN) return;

    if (digit === TANGGAL_LAHIR) {
        pesanSalah("salah-3", false);
        /* Musik TIDAK di sini — menyala saat tombol "Lihat disini" diklik */
        tampilkanLangkah("langkah-sukses");
        return;
    }

    /* Salah: getar + pesan, lalu kotak dikosongkan */
    goyang($("#kartu-pin"));
    pesanSalah("salah-3", true);
    setTimeout(function () {
        digit = "";
        gambarDigit();
    }, 450);
}

function pasangPapanTombol() {
    const papan = $("#papan-tombol");
    if (!papan) return;

    papan.addEventListener("click", function (e) {
        const tombol = e.target.closest("button");
        if (!tombol) return;

        pesanSalah("salah-3", false);

        if (tombol.hasAttribute("data-hapus")) {
            digit = digit.slice(0, -1);
            gambarDigit();
            return;
        }

        if (tombol.hasAttribute("data-batal")) {
            digit = "";
            gambarDigit();
            return;
        }

        const angka = tombol.getAttribute("data-angka");
        if (angka === null || digit.length >= PANJANG_PIN) return;

        digit += angka;
        gambarDigit();
        cekTanggal();
    });
}

/* ---------------------------------------------------------
   JALANKAN (tebak.js dipakai dengan defer → DOM sudah siap)
--------------------------------------------------------- */
pasangSoalEssay();
pasangPapanTombol();
gambarDigit();
