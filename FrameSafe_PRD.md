# FrameSafe — Product Requirement Document (PRD)

> **Version:** 1.0.0 · **Date:** October 29, 2026 · **Status:** Draft for Review
> **Author:** Product Team · **Classification:** Internal — Confidential

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Vision & Mission](#3-vision--mission)
4. [Target Customer](#4-target-customer)
5. [User Persona](#5-user-persona)
6. [User Pain Points](#6-user-pain-points)
7. [Value Proposition](#7-value-proposition)
8. [Unique Selling Proposition (USP)](#8-unique-selling-proposition-usp)
9. [User Journey](#9-user-journey)
10. [Feature Requirements](#10-feature-requirements)
11. [Functional Requirements](#11-functional-requirements)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [Database Impact Analysis](#13-database-impact-analysis)
14. [Backend API Planning](#14-backend-api-planning)
15. [MVP Development Roadmap](#15-mvp-development-roadmap)
16. [Risiko Produk](#16-risiko-produk)
17. [Kesimpulan](#17-kesimpulan)

---

## 1. Executive Summary

FrameSafe adalah **Secure Photography Delivery Platform** yang dirancang untuk menjawab kesenjangan fundamental dalam ekosistem pengiriman foto profesional. Di era digital saat ini, fotografer profesional menghadapi tantangan serius: foto dikirimkan sebelum pembayaran selesai, dan tidak ada mekanisme kontrol yang efektif setelah file berpindah tangan.

FrameSafe memposisikan diri sebagai **lapisan keamanan antara kreasi fotografer dan konsumsi client**, dengan pipeline yang terdiri dari:

- **Protected Preview System** — client dapat mengevaluasi hasil foto tanpa memiliki akses ke aset HD.
- **Payment-Gated HD Unlock** — akses file beresolusi penuh hanya terbuka setelah pembayaran dikonfirmasi.
- **AI Adaptive Watermark** — watermark yang menyesuaikan karakteristik visual gambar, meningkatkan estetika preview sekaligus mempersulit penghapusan.
- **Invisible Watermark (Digital Fingerprint)** — identitas kepemilikan yang tertanam di setiap foto untuk keperluan tracking dan bukti digital.

Platform ini dibangun di atas stack **Node.js / Express / TypeScript / Prisma / PostgreSQL**, dengan fondasi backend Phase 2–4 yang telah selesai, mencakup autentikasi, manajemen profil fotografer, album CRUD, dan manajemen foto.

FrameSafe bukan sekadar aplikasi watermark. Ini adalah **infrastruktur kepercayaan** untuk industri fotografi profesional.

---

## 2. Problem Statement

### Konteks Industri

Industri fotografi profesional di Indonesia — khususnya segmen wedding, event, dan studio — beroperasi dengan model bisnis berbasis kepercayaan. Fotografer menginvestasikan waktu, peralatan, dan keahlian sebelum menerima pembayaran penuh, sementara client menginginkan kepastian kualitas sebelum melunasi pembayaran.

Ketidakseimbangan ini menciptakan celah yang dieksploitasi, baik disengaja maupun tidak.

### Root Cause Analysis

```
Fotografer selesai editing
          │
          ▼
Foto dikirim via WhatsApp / Google Drive
          │
          ▼
Client memiliki file asli
          │
    ┌─────┴──────┐
    │            │
Client bayar  Client tidak bayar
    │            │
  Selesai     Fotografer
              kehilangan
              aset & pendapatan
```

### Permasalahan Teridentifikasi

| # | Masalah | Dampak | Frekuensi |
|---|---------|--------|-----------|
| 1 | Foto terkirim sebelum pembayaran lunas | Fotografer tidak memiliki leverage negosiasi | Tinggi |
| 2 | Tidak ada kontrol penyebaran setelah pengiriman | Foto beredar tanpa kredit/izin | Tinggi |
| 3 | Watermark statis mudah dipotong atau dihapus | Preview tidak aman untuk dibagikan | Sedang |
| 4 | Tidak ada bukti digital kepemilikan foto | Klaim sengketa sulit dibuktikan | Rendah–Sedang |
| 5 | Tidak ada sistem pembayaran terintegrasi | Alur kerja manual dan rawan kesalahan | Tinggi |
| 6 | Platform umum (Google Drive) tidak memiliki akses kontrol berbasis pembayaran | Client dengan link dapat mengunduh kapan saja | Tinggi |

### Dampak Bisnis untuk Fotografer

- **Revenue loss** dari foto yang digunakan tanpa pelunasan.
- **Reputational risk** saat foto beredar tanpa kredit yang benar.
- **Operational friction** dari pengelolaan manual link pengiriman dan konfirmasi pembayaran.

---

## 3. Vision & Mission

### Vision

> *"Menjadi infrastruktur kepercayaan standar industri untuk pengiriman karya fotografi profesional di Asia Tenggara."*

### Mission

> *"Memberdayakan fotografer dengan teknologi yang melindungi karya mereka, mengamankan pendapatan mereka, dan membangun kepercayaan yang lebih dalam antara fotografer dan client — dari preview pertama hingga delivery final."*

### Strategic Goals (12 Bulan)

1. Menjadi platform pilihan utama bagi wedding & event photographer untuk pengiriman foto aman.
2. Membangun reputasi sebagai platform dengan sistem watermark paling canggih di segmen SMB fotografi.
3. Mencapai Product-Market Fit pada segmen fotografer profesional Indonesia.

---

## 4. Target Customer

### Primary User — Photographer

**Siapa mereka:**
Fotografer profesional atau semi-profesional yang menerima bayaran atas jasa fotografi mereka dan mengirimkan hasil kerja kepada client.

**Segmen spesifik:**

| Segmen | Karakteristik | Prioritas |
|--------|--------------|-----------|
| Wedding Photographer | Volume album tinggi, nominal kontrak besar, risiko non-payment tinggi | **Primer** |
| Event Photographer | Corporate event, ulang tahun, konser; jadwal padat, multiple client | **Primer** |
| Studio Foto | Foto produk, potret keluarga, pas foto semi-professional | Sekunder |
| Freelance Photographer | Skala kecil, penghasilan tidak tetap, lebih rentan kehilangan pembayaran | Sekunder |

**Geographic Focus (MVP):** Indonesia, dengan potensi ekspansi ke Malaysia dan Filipina sebagai *future consideration*.

---

### Secondary User — Client

**Siapa mereka:**
Individu atau perusahaan yang menyewa jasa fotografer dan membayar untuk hasil foto final.

**Segmen:**
- Pasangan yang menyewa wedding photographer
- Perusahaan yang menyewa fotografer event korporat
- Individu yang memesan sesi foto studio

---

## 5. User Persona

### Persona 1 — "Andi, Wedding Photographer"

```
┌─────────────────────────────────────────────────────────────┐
│  ANDI SETIAWAN, 29 tahun                                    │
│  Wedding & Prewedding Photographer, Freelancer              │
│  Yogyakarta · 4 tahun pengalaman                           │
├─────────────────────────────────────────────────────────────┤
│  GOALS                                                      │
│  • Dibayar tepat waktu setelah pekerjaan selesai           │
│  • Portofolio terlindungi dari penggunaan tanpa izin       │
│  • Workflow pengiriman foto yang efisien                   │
├─────────────────────────────────────────────────────────────┤
│  FRUSTRATIONS                                               │
│  • Pernah dua kali klien tidak melunasi setelah foto       │
│    dikirim via Google Drive                                 │
│  • Watermark dipotong dari foto preview                    │
│  • Harus follow-up manual pembayaran lewat WhatsApp        │
├─────────────────────────────────────────────────────────────┤
│  TOOLS SAAT INI                                             │
│  WhatsApp, Google Drive, Canva (untuk watermark manual)    │
├─────────────────────────────────────────────────────────────┤
│  QUOTE                                                      │
│  "Saya sudah kirim foto, tapi klien bilang nanti dulu      │
│   soal pelunasan. Saya tidak punya pegangan apa-apa."      │
└─────────────────────────────────────────────────────────────┘
```

---

### Persona 2 — "Rini, Event Photographer (Studio Owner)"

```
┌─────────────────────────────────────────────────────────────┐
│  RINI HARTATI, 35 tahun                                     │
│  Pemilik Studio Foto, Event Photographer                    │
│  Jakarta · 8 tahun pengalaman                              │
├─────────────────────────────────────────────────────────────┤
│  GOALS                                                      │
│  • Mengelola multiple album untuk berbagai client           │
│  • Menjaga brand studio tetap terlihat di setiap foto      │
│  • Alur pembayaran yang rapi dan terdokumentasi            │
├─────────────────────────────────────────────────────────────┤
│  FRUSTRATIONS                                               │
│  • Foto studio bocor ke kompetitor lewat client            │
│  • Manajemen album manual di Drive sudah tidak efisien     │
│  • Tidak ada audit trail siapa yang sudah download foto    │
├─────────────────────────────────────────────────────────────┤
│  TOOLS SAAT INI                                             │
│  Google Drive, WeTransfer, Invoice manual (PDF)            │
└─────────────────────────────────────────────────────────────┘
```

---

### Persona 3 — "Budi, Client (Pengantin)"

```
┌─────────────────────────────────────────────────────────────┐
│  BUDI SANTOSO, 31 tahun                                     │
│  Konsumen jasa wedding photographer                         │
│  Surabaya                                                   │
├─────────────────────────────────────────────────────────────┤
│  GOALS                                                      │
│  • Bisa review foto sebelum bayar lunas                    │
│  • Proses unduh foto yang mudah setelah pembayaran         │
│  • Kepastian foto tidak akan hilang atau kadaluarsa        │
├─────────────────────────────────────────────────────────────┤
│  FRUSTRATIONS                                               │
│  • Tidak tahu cara membayar selain transfer manual         │
│  • Link dari WhatsApp sering kadaluarsa                    │
│  • Ingin bisa preview foto dulu sebelum melunasi           │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. User Pain Points

### Photographer Pain Points

| Pain Point | Severity | Frequency | Current Workaround |
|------------|----------|-----------|-------------------|
| Foto digunakan sebelum bayar lunas | 🔴 Critical | Sangat Sering | Tidak ada / kepercayaan saja |
| Watermark mudah dihapus/dipotong | 🔴 Critical | Sering | Logo di tengah (merusak estetika) |
| Tidak ada bukti kepemilikan digital | 🟡 High | Kadang | Screenshot chat / kontrak fisik |
| Tidak ada tracking download foto | 🟡 High | Sering | Tidak ada tracking |
| Alur konfirmasi pembayaran manual | 🟡 High | Sangat Sering | WhatsApp, transfer manual |
| Link Google Drive beredar tidak terkontrol | 🟠 Medium | Kadang | Password protect (tidak selalu berhasil) |

### Client Pain Points

| Pain Point | Severity | Frequency | Current Workaround |
|------------|----------|-----------|-------------------|
| Tidak bisa preview foto sebelum bayar | 🟡 High | Sering | Kepercayaan penuh pada fotografer |
| Proses pembayaran tidak terintegrasi | 🟠 Medium | Sering | Transfer manual + konfirmasi WA |
| Link foto sering kadaluarsa atau hilang | 🟠 Medium | Kadang | Minta kirim ulang ke fotografer |

---

## 7. Value Proposition

### Untuk Photographer

> **"Kirim foto dengan aman. Terima pembayaran dengan pasti."**

FrameSafe memberi fotografer kontrol penuh atas karya mereka:

- **Kontrol akses berbasis pembayaran** — HD hanya bisa diunduh setelah pembayaran dikonfirmasi.
- **Perlindungan preview** dengan watermark adaptif yang tidak merusak estetika.
- **Digital fingerprint** sebagai bukti kepemilikan yang tertanam dalam file.
- **Dashboard manajemen** album, foto, dan status pembayaran dalam satu platform.

### Untuk Client

> **"Lihat dulu, bayar setelah puas, unduh dengan mudah."**

FrameSafe memberi client pengalaman yang transparan dan terpercaya:

- Preview foto resolusi terlindungi sebelum pelunasan.
- Pembayaran terintegrasi langsung dalam platform.
- Akses HD langsung tersedia setelah pembayaran dikonfirmasi.

---

## 8. Unique Selling Proposition (USP)

FrameSafe bukan sekedar platform watermark. Tiga pilar diferensiasi utama:

---

### USP 1 — AI Adaptive Watermark

**Apa yang ada sekarang:**
Watermark tradisional adalah overlay statis — logo di pojok atau teks di tengah. Mudah dipotong (crop) atau dihapus menggunakan tools editing seperti Photoshop, Canva, atau bahkan aplikasi mobile gratis.

**Apa yang FrameSafe tawarkan:**
Watermark yang *berperilaku secara adaptif* terhadap konten visual gambar:

- Watermark menyesuaikan **posisi, opasitas, dan pola** berdasarkan analisis komposisi gambar.
- Distribusi watermark tidak seragam — menyebar di area visual yang relevan sehingga penghapusan parsial merusak bagian foto yang bermakna.
- Estetika preview tetap terjaga — watermark terasa sebagai bagian dari gambar, bukan gangguan.

> [!IMPORTANT]
> FrameSafe **tidak mengklaim** watermark adaptif ini 100% tidak dapat dihapus. Teknologi ini dirancang untuk meningkatkan *cost of effort* penghapusan secara signifikan, bukan menjamin ketidakmungkinan mutlak.

**Posisi kompetitif:**
Tidak ada platform delivery foto SMB (small-medium business) yang saat ini menawarkan watermark adaptif berbasis analisis visual.

---

### USP 2 — Invisible Watermark (Digital Fingerprint)

**Konsep:**
Setiap foto yang diproses oleh FrameSafe mendapatkan identitas digital tersembunyi yang tertanam di data gambar.

**Informasi yang dapat dikodekan:**
- Identitas fotografer (Photographer ID)
- Identitas album (Album ID)
- Timestamp pemrosesan
- Informasi kepemilikan (ownership metadata)

**Manfaat:**
- Jika foto tersebar di platform lain, identitas asal dapat di-trace.
- Memberi fotografer bukti digital dalam sengketa kepemilikan.
- Berfungsi sebagai *deterrent* — fotografer dapat memberi tahu client bahwa setiap foto memiliki sidik jari digital.

> [!NOTE]
> Implementasi invisible watermark menggunakan teknik steganografi digital (LSB encoding, DCT-domain embedding, atau library steganografi yang sudah tersedia). Kedalaman implementasi akan ditentukan pada fase R&D engineering.

---

### USP 3 — Secure Photo Delivery dengan Payment Gate

**Alur yang membedakan:**

Platform lain (Google Drive, WeTransfer) bersifat *fire-and-forget* — setelah link dibagikan, fotografer tidak punya kontrol.

FrameSafe membangun **payment gate** sebagai kondisi akses:

```
Preview (terlindungi) → Pembayaran → HD Access
        ▲                                ▲
  Selalu tersedia              Hanya setelah konfirmasi
  untuk client                    pembayaran
```

Tidak ada platform delivery foto yang secara native mengintegrasikan payment gate sebagai mekanisme akses kontrol.

---

## 9. User Journey

### Photographer Journey

```
1. REGISTER & SETUP
   │
   ├── Buka FrameSafe
   ├── Register akun (email + password)
   ├── Verifikasi email
   └── Buat Photographer Profile
         (nama, brand, bio, kontak)

2. ALBUM CREATION
   │
   ├── Buat Album baru
   ├── Isi metadata album
   │     (nama, deskripsi, event date, client name)
   └── Set status album: DRAFT

3. PHOTO UPLOAD
   │
   ├── Upload foto (single / bulk)
   ├── Sistem memproses foto:
   │     ├── Generate protected preview (compressed + watermarked)
   │     ├── Apply AI Adaptive Watermark pada preview
   │     ├── Embed Invisible Watermark pada preview & HD
   │     └── Simpan HD original secara terpisah (private storage)
   └── Review hasil preview

4. PUBLISH & SHARE
   │
   ├── Set Album status: PUBLISHED
   ├── Generate shareable link album
   ├── Kirim link kepada client (via email, WhatsApp, dll.)
   └── Monitor status: views, payments

5. PAYMENT & DELIVERY
   │
   ├── Notifikasi: Client membuka album
   ├── Notifikasi: Client melakukan pembayaran
   ├── Sistem otomatis unlock akses HD untuk client
   └── Konfirmasi delivery selesai
```

---

### Client Journey

```
1. ALBUM ACCESS
   │
   ├── Terima link album dari fotografer
   ├── Buka link (tidak perlu registrasi untuk view) *
   └── Lihat preview foto (terlindungi, low-res + watermark)

   * Future consideration: opsional registrasi client untuk akses

2. PAYMENT
   │
   ├── Klik tombol "Bayar & Unlock HD"
   ├── Pilih metode pembayaran (Payment Gateway)
   ├── Konfirmasi pembayaran
   └── Sistem memproses & memverifikasi

3. HD ACCESS
   │
   ├── Sistem membuka akses HD secara otomatis
   ├── Client menerima notifikasi "Foto Siap Diunduh"
   ├── Akses halaman album — foto tampil dalam resolusi penuh
   └── Download foto HD (individual atau bulk ZIP)
```

---

## 10. Feature Requirements

### MVP Features *(Wajib untuk versi pertama)*

| # | Fitur | Deskripsi | Priority |
|---|-------|-----------|----------|
| 1 | **Autentikasi Photographer** | Register, login, JWT auth — *sudah selesai* | 🔴 Must Have |
| 2 | **Photographer Profile** | Profil lengkap fotografer — *sudah selesai* | 🔴 Must Have |
| 3 | **Album CRUD** | Buat, baca, edit, hapus album — *sudah selesai* | 🔴 Must Have |
| 4 | **Album Status** | Draft / Published — *sudah selesai* | 🔴 Must Have |
| 5 | **Photo Upload & Management** | Upload, get, update, delete — *sudah selesai* | 🔴 Must Have |
| 6 | **Protected Preview Generation** | Kompresi foto + apply watermark untuk preview | 🔴 Must Have |
| 7 | **Visible Adaptive Watermark** | Watermark yang adaptif terhadap komposisi visual | 🔴 Must Have |
| 8 | **Invisible Watermark Embedding** | Embed fingerprint digital ke setiap foto | 🔴 Must Have |
| 9 | **Shareable Album Link** | Link album yang bisa dibagikan ke client | 🔴 Must Have |
| 10 | **Client Album View** | Client dapat melihat preview album tanpa akun | 🔴 Must Have |
| 11 | **Payment Integration** | Integrasi payment gateway (Midtrans/Xendit) | 🔴 Must Have |
| 12 | **Payment-Gated HD Unlock** | HD ter-unlock otomatis setelah pembayaran sukses | 🔴 Must Have |
| 13 | **HD Photo Download** | Client dapat download foto HD setelah bayar | 🔴 Must Have |
| 14 | **Basic Notification** | Notifikasi email: album viewed, payment received | 🔴 Must Have |
| 15 | **Photographer Dashboard** | Overview album, status pembayaran, download count | 🔴 Must Have |

---

### Future Features *(Pengembangan berikutnya — Future Consideration)*

| # | Fitur | Deskripsi | Phase |
|---|-------|-----------|-------|
| F1 | **Client Account System** | Registrasi dan login untuk client | Phase 5 |
| F2 | **Bulk ZIP Download** | Download semua foto HD sekaligus | Phase 5 |
| F3 | **Album Expiry Date** | Link album kadaluarsa setelah tanggal tertentu | Phase 5 |
| F4 | **Download Analytics** | Tracking siapa yang download, kapan, berapa kali | Phase 6 |
| F5 | **Invisible Watermark Decoder** | Tools untuk baca fingerprint dari foto yang beredar | Phase 6 |
| F6 | **Custom Watermark Template** | Photographer bisa set template watermark brand mereka | Phase 6 |
| F7 | **Partial Unlock** | Unlock sebagian foto setelah DP, sisanya setelah lunas | Phase 6 |
| F8 | **Album Password Protection** | Tambahan lapisan keamanan dengan password | Phase 6 |
| F9 | **Multi-photographer (Studio Mode)** | Satu studio dengan beberapa akun fotografer | Phase 7 |
| F10 | **Subscription & Pricing Tiers** | Free, Pro, Studio tier | Phase 7 |
| F11 | **Mobile App (React Native / Flutter)** | Aplikasi mobile untuk photographer & client | Phase 8 |
| F12 | **API for Third-party Integration** | API publik untuk integrasi studio management software | Phase 8 |
| F13 | **AI Photo Selection Assistant** | AI membantu pilih foto terbaik dari sesi foto | Future |
| F14 | **Contract & Invoice Module** | Generate kontrak dan invoice dalam platform | Future |

---

## 11. Functional Requirements

### 11.1 User Management

| ID | Requirement | Priority |
|----|-------------|----------|
| UM-01 | Sistem harus mendukung registrasi photographer dengan email dan password | Must Have |
| UM-02 | Sistem harus mengimplementasikan autentikasi berbasis JWT | Must Have |
| UM-03 | Sistem harus mendukung pembuatan dan pembaruan photographer profile | Must Have |
| UM-04 | Sistem harus memvalidasi kepemilikan resource (photographer hanya bisa akses albumnya sendiri) | Must Have |
| UM-05 | Sistem harus mendukung akses album oleh client tanpa memerlukan akun *(untuk MVP)* | Must Have |
| UM-06 | Sistem harus mendukung registrasi client *(future consideration)* | Future |

---

### 11.2 Album Management

| ID | Requirement | Priority |
|----|-------------|----------|
| AM-01 | Photographer dapat membuat album dengan metadata (nama, deskripsi, client name, event date) | Must Have |
| AM-02 | Photographer dapat mengubah status album: DRAFT, PUBLISHED | Must Have |
| AM-03 | Sistem hanya menampilkan album PUBLISHED kepada client | Must Have |
| AM-04 | Sistem harus generate shareable link unik per album | Must Have |
| AM-05 | Photographer dapat melihat statistik dasar album (jumlah foto, status pembayaran) | Must Have |
| AM-06 | Album dapat memiliki expiry date *(future consideration)* | Future |

---

### 11.3 Photo Management

| ID | Requirement | Priority |
|----|-------------|----------|
| PM-01 | Photographer dapat upload foto (format: JPG, PNG, WEBP) | Must Have |
| PM-02 | Sistem harus menyimpan file HD original di private/secure storage | Must Have |
| PM-03 | Sistem harus generate protected preview secara otomatis setelah upload | Must Have |
| PM-04 | Preview harus dalam resolusi tereduksi (≤ 1000px lebar atau sesuai konfigurasi) | Must Have |
| PM-05 | Preview harus memiliki AI Adaptive Watermark yang ter-apply otomatis | Must Have |
| PM-06 | Setiap foto harus mendapatkan invisible watermark saat upload | Must Have |
| PM-07 | Photographer dapat update metadata foto dan menghapus foto | Must Have |
| PM-08 | Client hanya dapat melihat preview — akses URL HD tidak terekspos sebelum pembayaran | Must Have |

---

### 11.4 Payment System

| ID | Requirement | Priority |
|----|-------------|----------|
| PY-01 | Sistem harus terintegrasi dengan setidaknya satu payment gateway (Midtrans atau Xendit) | Must Have |
| PY-02 | Sistem harus membuat payment session/invoice per album | Must Have |
| PY-03 | Sistem harus memverifikasi status pembayaran via webhook dari payment gateway | Must Have |
| PY-04 | Setelah pembayaran dikonfirmasi, sistem otomatis membuka akses HD untuk album tersebut | Must Have |
| PY-05 | Sistem harus menyimpan riwayat transaksi pembayaran | Must Have |
| PY-06 | Photographer harus mendapat notifikasi saat pembayaran diterima | Must Have |
| PY-07 | Sistem harus menangani payment failure dengan graceful error handling | Must Have |
| PY-08 | Sistem harus mendukung partial unlock (bayar DP → unlock sebagian) *(future consideration)* | Future |

---

### 11.5 Watermark System

| ID | Requirement | Priority |
|----|-------------|----------|
| WM-01 | Sistem harus menganalisis komposisi visual foto sebelum menerapkan watermark | Must Have |
| WM-02 | AI Adaptive Watermark harus menyesuaikan posisi dan distribusi berdasarkan konten gambar | Must Have |
| WM-03 | Watermark tidak boleh menutup 100% konten foto (preview harus tetap evaluable oleh client) | Must Have |
| WM-04 | Invisible watermark harus mengandung: Photographer ID, Album ID, Timestamp, Ownership tag | Must Have |
| WM-05 | Invisible watermark harus bertahan setelah kompresi JPEG standar | Should Have |
| WM-06 | Sistem tidak boleh membuat klaim "watermark 100% tidak dapat dihapus" dalam UI/marketing | Must Have |
| WM-07 | Photographer dapat mengkustomisasi template/logo watermark *(future consideration)* | Future |

---

### 11.6 Client Access

| ID | Requirement | Priority |
|----|-------------|----------|
| CA-01 | Client dapat membuka album melalui shareable link tanpa login | Must Have |
| CA-02 | Client hanya dapat melihat preview (low-res + watermarked) sebelum pembayaran | Must Have |
| CA-03 | Setelah pembayaran, client mendapat akses ke URL HD yang bersifat sementara (signed URL) | Must Have |
| CA-04 | Signed URL untuk download HD harus memiliki expiry time | Must Have |
| CA-05 | Sistem harus mencatat aktivitas download (log) | Should Have |
| CA-06 | Client dapat mendownload foto HD secara individual | Must Have |
| CA-07 | Bulk download sebagai ZIP *(future consideration)* | Future |

---

## 12. Non-Functional Requirements

### 12.1 Security

| ID | Requirement | Detail |
|----|-------------|--------|
| SEC-01 | **Authentication** | JWT token dengan expiry, refresh token mechanism |
| SEC-02 | **File Storage Security** | HD files disimpan di private bucket (tidak dapat diakses langsung via URL publik) |
| SEC-03 | **Signed URL** | HD download menggunakan pre-signed URL dengan TTL (Time-To-Live) singkat (15–60 menit) |
| SEC-04 | **Input Validation** | Validasi semua input API untuk mencegah injection, XSS, dan malformed data |
| SEC-05 | **Rate Limiting** | Implementasi rate limiting pada endpoint kritis (login, upload, payment) |
| SEC-06 | **Payment Security** | Webhook payment divalidasi dengan signature/secret dari payment gateway |
| SEC-07 | **Ownership Enforcement** | Setiap operasi pada resource divalidasi kepemilikannya di database |
| SEC-08 | **HTTPS Only** | Seluruh komunikasi API menggunakan HTTPS |
| SEC-09 | **Password Hashing** | Password disimpan dengan bcrypt (salt rounds ≥ 12) |

---

### 12.2 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| PERF-01 | **API Response Time** | 95th percentile < 500ms untuk operasi non-file |
| PERF-02 | **Photo Upload Processing** | Preview generation + watermark ≤ 30 detik per foto (tergantung ukuran) |
| PERF-03 | **Album Load Time** | Halaman album dengan 100 preview foto ≤ 3 detik |
| PERF-04 | **Concurrent Users** | MVP harus mampu handle 100 concurrent users |
| PERF-05 | **Image Processing Queue** | Upload foto diproses via background job/queue untuk tidak memblokir API response |

---

### 12.3 Scalability

| ID | Requirement | Detail |
|----|-------------|--------|
| SCAL-01 | **Horizontal Scaling** | Backend harus stateless untuk mendukung horizontal scaling |
| SCAL-02 | **Storage** | Gunakan cloud storage (AWS S3, GCS, atau equivalent) yang skalabel |
| SCAL-03 | **Database** | PostgreSQL dengan connection pooling (PgBouncer atau Prisma connection pool) |
| SCAL-04 | **Queue System** | Background processing untuk watermarking menggunakan job queue (BullMQ/Redis) |
| SCAL-05 | **CDN** | Preview foto di-serve via CDN untuk mengurangi latency client |

---

### 12.4 Data Privacy

| ID | Requirement | Detail |
|----|-------------|--------|
| DP-01 | **Data Minimization** | Hanya kumpulkan data yang diperlukan dari client |
| DP-02 | **Storage Separation** | Preview (publik) dan HD (privat) disimpan di bucket terpisah |
| DP-03 | **Data Retention** | Definisikan kebijakan retensi data foto (minimal setelah pembayaran + 1 tahun, *kebijakan detail adalah future consideration*) |
| DP-04 | **GDPR/UU PDP Awareness** | Platform harus siap untuk kepatuhan UU Perlindungan Data Pribadi Indonesia |
| DP-05 | **No Third-party Photo Sharing** | Foto tidak boleh dibagikan ke pihak ketiga tanpa izin photographer |

---

## 13. Database Impact Analysis

### Status Database Saat Ini

Berdasarkan development Phase 2–4 yang telah selesai, diasumsikan model yang sudah ada:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  profile   PhotographerProfile?
  albums    Album[]
}

model PhotographerProfile {
  id           String @id @default(cuid())
  userId       String @unique
  // ... profile fields
  user         User   @relation(fields: [userId], references: [id])
}

model Album {
  id          String      @id @default(cuid())
  userId      String
  title       String
  description String?
  status      AlbumStatus @default(DRAFT)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  user        User        @relation(fields: [userId], references: [id])
  photos      Photo[]
}

model Photo {
  id        String   @id @default(cuid())
  albumId   String
  // ... photo fields (filename, url, etc.)
  album     Album    @relation(fields: [albumId], references: [id])
}

enum AlbumStatus {
  DRAFT
  PUBLISHED
}
```

---

### Analisis Perubahan Database yang Diperlukan

#### A. Perubahan pada Model Album

**Kebutuhan:** Shareable link, payment status, harga, client info.

```prisma
model Album {
  // ... existing fields

  // NEW: Payment & Access Control
  price          Decimal?        // Harga album (null = gratis)
  currency       String          @default("IDR")
  clientName     String?         // Nama client
  clientEmail    String?         // Email client untuk notifikasi
  shareToken     String          @unique @default(cuid()) // Unique token untuk link
  eventDate      DateTime?       // Tanggal event

  // Relations baru
  payment        Payment?
}
```

---

#### B. Perubahan pada Model Photo

**Kebutuhan:** Dua URL (preview vs HD), watermark metadata, invisible watermark status.

```prisma
model Photo {
  // ... existing fields

  // NEW: Dual Storage
  hdStorageKey       String    // Key/path ke HD file di private storage
  previewStorageKey  String    // Key/path ke preview di public/CDN storage
  hdUrl              String?   // Signed URL (generated on-demand, tidak disimpan permanen)
  previewUrl         String    // URL publik preview (CDN)

  // NEW: Processing Status
  processingStatus   PhotoProcessingStatus @default(PENDING)
  watermarkApplied   Boolean               @default(false)
  invisibleWmApplied Boolean               @default(false)
  invisibleWmPayload String?               // JSON payload yang di-embed (untuk referensi)

  // NEW: Metadata
  originalFilename   String?
  mimeType           String    @default("image/jpeg")
  fileSizeBytes      Int?
  width              Int?      // Dimensi foto asli
  height             Int?
}

enum PhotoProcessingStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}
```

---

#### C. Model Baru — Payment

**Kebutuhan:** Sistem pembayaran ter-integrasi dengan payment gateway.

```prisma
model Payment {
  id                String        @id @default(cuid())
  albumId           String        @unique
  amount            Decimal
  currency          String        @default("IDR")
  status            PaymentStatus @default(PENDING)

  // Payment Gateway
  gatewayProvider   String        // "midtrans" | "xendit"
  gatewayTransactionId String?    @unique // ID transaksi dari gateway
  gatewayPaymentUrl    String?    // URL redirect ke halaman pembayaran
  gatewayRawResponse   Json?      // Raw response dari gateway (untuk audit)

  // Timestamps
  paidAt            DateTime?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  // Payer info (client)
  payerName         String?
  payerEmail        String?

  // Relations
  album             Album         @relation(fields: [albumId], references: [id])
}

enum PaymentStatus {
  PENDING
  PROCESSING
  PAID
  FAILED
  EXPIRED
  REFUNDED
}
```

---

#### D. Model Baru — AlbumAccess

**Kebutuhan:** Tracking akses client, kontrol HD unlock.

```prisma
model AlbumAccess {
  id          String   @id @default(cuid())
  albumId     String
  // Identifikasi client (tidak wajib login di MVP)
  clientEmail String?
  clientIp    String?  // Untuk anonymous tracking
  isUnlocked  Boolean  @default(false) // true setelah payment sukses
  unlockedAt  DateTime?
  firstViewAt DateTime?
  lastViewAt  DateTime?
  viewCount   Int      @default(0)
  createdAt   DateTime @default(now())

  album       Album    @relation(fields: [albumId], references: [id])
}
```

---

#### E. Model Baru — DownloadLog

**Kebutuhan:** Audit trail download foto HD.

```prisma
model DownloadLog {
  id          String   @id @default(cuid())
  photoId     String
  albumId     String
  clientEmail String?
  clientIp    String?
  downloadedAt DateTime @default(now())

  photo       Photo    @relation(fields: [photoId], references: [id])
  album       Album    @relation(fields: [albumId], references: [id])
}
```

---

### Ringkasan Database Impact

| Model | Action | Alasan |
|-------|--------|--------|
| `Album` | **ALTER** — tambah fields | shareToken, price, clientEmail, eventDate |
| `Photo` | **ALTER** — tambah fields | hdStorageKey, previewUrl, processingStatus, watermark flags |
| `Payment` | **CREATE** | Sistem pembayaran baru |
| `AlbumAccess` | **CREATE** | Tracking akses & HD unlock state |
| `DownloadLog` | **CREATE** | Audit trail download |

---

## 14. Backend API Planning

### Authentication *(Sudah ada)*

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/auth/register` | Registrasi photographer | ❌ |
| `POST` | `/auth/login` | Login & get JWT | ❌ |
| `POST` | `/auth/refresh` | Refresh JWT token | ✅ |
| `POST` | `/auth/logout` | Invalidate token | ✅ |

---

### Photographer Profile *(Sudah ada)*

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/profile` | Get photographer profile | ✅ |
| `PUT` | `/profile` | Update photographer profile | ✅ |

---

### Album Management *(Sudah ada — perlu extension)*

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/albums` | Buat album baru | ✅ |
| `GET` | `/albums` | List semua album milik photographer | ✅ |
| `GET` | `/albums/:id` | Get detail album | ✅ |
| `PUT` | `/albums/:id` | Update album | ✅ |
| `DELETE` | `/albums/:id` | Hapus album | ✅ |
| `PATCH` | `/albums/:id/status` | Ubah status DRAFT/PUBLISHED | ✅ |
| `GET` | `/albums/:id/share-link` | Generate/get shareable link | ✅ |

---

### Photo Management *(Sudah ada — perlu extension)*

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/albums/:albumId/photos` | Upload foto baru | ✅ |
| `GET` | `/albums/:albumId/photos` | List foto dalam album | ✅ |
| `GET` | `/albums/:albumId/photos/:id` | Get detail foto | ✅ |
| `PUT` | `/albums/:albumId/photos/:id` | Update metadata foto | ✅ |
| `DELETE` | `/albums/:albumId/photos/:id` | Hapus foto | ✅ |
| `GET` | `/photos/:id/hd-url` | Generate signed URL untuk HD download | ✅ |

---

### Client Access *(Baru)*

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/c/:shareToken` | Get album public view (preview only) | ❌ |
| `GET` | `/c/:shareToken/photos` | List preview foto untuk client | ❌ |
| `POST` | `/c/:shareToken/access` | Inisiasi akses client (catat IP, email) | ❌ |
| `GET` | `/c/:shareToken/hd/:photoId` | Get signed HD URL (hanya jika unlocked) | ❌ |

---

### Payment *(Baru)*

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/payments/create` | Buat payment session untuk album | ❌ |
| `GET` | `/payments/:albumId/status` | Cek status pembayaran album | ❌ |
| `POST` | `/payments/webhook/midtrans` | Webhook handler Midtrans | ❌ (IP Whitelist) |
| `POST` | `/payments/webhook/xendit` | Webhook handler Xendit | ❌ (Signature) |
| `GET` | `/photographer/payments` | List semua pembayaran (dashboard) | ✅ |

---

### Watermark *(Internal — tidak diekspos ke client)*

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `POST` | `/internal/watermark/process` | Trigger processing foto (dipanggil queue worker) | Internal |
| `GET` | `/internal/watermark/status/:photoId` | Cek status processing | Internal |

---

### Notification *(Baru)*

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| `GET` | `/notifications` | List notifikasi photographer | ✅ |
| `PATCH` | `/notifications/:id/read` | Tandai notifikasi sebagai dibaca | ✅ |

---

## 15. MVP Development Roadmap

### Prinsip Prioritas

Roadmap disusun berdasarkan:
1. **Dependency chain** — fitur yang menjadi prasyarat fitur lain didahulukan.
2. **User value** — setiap phase menghasilkan sesuatu yang bisa didemonstrasikan.
3. **Risk mitigation** — komponen teknis berisiko tinggi (watermark, payment) diprototipkan lebih awal.

---

### Phase 2–4 ✅ Selesai

- Register, Login, JWT Auth
- Photographer Profile
- Album CRUD + Status
- Photo CRUD + Ownership Protection

**Output:** Backend dasar siap.

---

### Phase 5 — Photo Processing Pipeline *(2–3 minggu)*

> [!IMPORTANT]
> Phase ini adalah fondasi teknis terpenting. Tanpa pipeline ini, fitur utama FrameSafe tidak dapat berjalan.

**Tasks:**
- [ ] Setup cloud storage (AWS S3 atau GCS): private bucket (HD) + public bucket (preview)
- [ ] Implementasi upload handler: terima file, simpan HD ke private bucket
- [ ] Setup job queue (BullMQ + Redis) untuk background processing
- [ ] Implementasi image resizing & compression untuk preview generation
- [ ] Prototyping & implementasi **Visible AI Adaptive Watermark**
  - Analisis komposisi gambar (brightness map, edge detection)
  - Adaptive positioning & opacity logic
- [ ] Prototyping & implementasi **Invisible Watermark**
  - Evaluasi library: Steganography LSB atau DCT-domain
  - Embed: Photographer ID + Album ID + Timestamp
- [ ] Update Photo model di database (hdStorageKey, previewUrl, processingStatus, dll.)
- [ ] API: Photo upload trigger processing pipeline
- [ ] API: Get processing status

**Output:** Foto yang diupload otomatis menghasilkan preview berair-mark + HD tersimpan aman.

---

### Phase 6 — Client Access & Shareable Link *(1–2 minggu)*

**Tasks:**
- [ ] Tambah `shareToken` ke Album model
- [ ] API: Generate & get shareable album link
- [ ] API: Public album view (`GET /c/:shareToken`)
- [ ] API: Public photo list preview (`GET /c/:shareToken/photos`)
- [ ] Logic: Hanya foto dengan processingStatus = COMPLETED yang tampil
- [ ] Implement signed URL generation untuk HD (dengan TTL)
- [ ] Logic: Signed URL hanya digenerate jika album access = unlocked

**Output:** Client dapat membuka album via link dan melihat preview foto.

---

### Phase 7 — Payment Integration *(2–3 minggu)*

**Tasks:**
- [ ] Evaluasi & pilih payment gateway (rekomendasi: **Midtrans** untuk pasar Indonesia)
- [ ] Buat Payment model di database
- [ ] API: `POST /payments/create` — buat payment session
- [ ] Integrasi Midtrans Snap API atau Payment Link
- [ ] Implementasi **Webhook handler** untuk konfirmasi pembayaran
- [ ] Logic: Update AlbumAccess.isUnlocked = true saat payment sukses
- [ ] Kirim notifikasi email ke photographer dan client
- [ ] Error handling: payment timeout, failure, expired

**Output:** Client dapat membayar, dan HD ter-unlock otomatis.

---

### Phase 8 — Photographer Dashboard *(1–2 minggu)*

**Tasks:**
- [ ] API: Dashboard summary (total album, total pendapatan, pending payment)
- [ ] API: List pembayaran dengan status
- [ ] API: Album detail dengan statistik (views, payment status)
- [ ] Notifikasi sistem (in-app + email)
- [ ] DownloadLog implementation

**Output:** Photographer memiliki visibilitas penuh atas status album dan pembayaran.

---

### Phase 9 — Security Hardening & Testing *(1–2 minggu)*

**Tasks:**
- [ ] Rate limiting pada semua endpoint publik
- [ ] Input validation audit
- [ ] Webhook signature validation
- [ ] Penetration testing dasar (akses HD tanpa bayar)
- [ ] Load testing (target: 100 concurrent users)
- [ ] Error handling & logging standar

**Output:** Platform siap untuk beta testing.

---

### Phase 10 — Beta & Launch Preparation *(1 minggu)*

**Tasks:**
- [ ] Onboard 5–10 fotografer beta tester
- [ ] Feedback collection & bug fixing
- [ ] Dokumentasi API (Swagger/Postman)
- [ ] Setup monitoring (Sentry/Datadog)
- [ ] Soft launch

---

### Timeline Overview

```
Phase 2-4  ██████████ (Selesai)
Phase 5    ████████████████████░░░░░░░░░░  2-3 minggu
Phase 6    ░░░░░░░░░░░████████████░░░░░░░  1-2 minggu
Phase 7    ░░░░░░░░░░░░░░░░░░░░░████████████████░░░  2-3 minggu
Phase 8    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████████  1-2 minggu
Phase 9    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████  1-2 minggu
Phase 10   ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██  1 minggu

Estimasi Total MVP: 8–13 minggu dari sekarang
```

---

## 16. Risiko Produk

### Risk Matrix

| ID | Risiko | Likelihood | Impact | Level |
|----|--------|-----------|--------|-------|
| R1 | AI Watermark dapat dihapus dengan tools canggih | Tinggi | Medium | 🟡 Medium |
| R2 | Biaya storage cloud melebihi proyeksi | Medium | High | 🟡 Medium |
| R3 | Integrasi payment gateway kompleks / bermasalah | Medium | High | 🔴 High |
| R4 | Adopsi pengguna lambat (Market Education) | Medium | High | 🔴 High |
| R5 | Pelanggaran data / kebocoran HD foto | Rendah | Critical | 🔴 High |
| R6 | Performance foto processing terlalu lambat | Medium | Medium | 🟡 Medium |
| R7 | Kompetitor meniru fitur utama | Tinggi | Medium | 🟡 Medium |

---

### R1 — AI Watermark Removal

**Risiko:** Tools AI generatif modern (Inpainting, Stable Diffusion) semakin mampu menghapus watermark dari foto.

**Mitigasi:**
- Jangan pernah mengklaim watermark "tidak bisa dihapus" (sudah ada di requirement).
- Posisikan watermark sebagai *deterrent* (mengurangi motivasi), bukan *absolute protection*.
- Pasangkan dengan invisible watermark sebagai bukti kepemilikan setelah terjadi pelanggaran.
- Edukasi fotografer tentang kombinasi perlindungan yang layak.
- Lakukan iterasi algoritma watermark secara berkala.

---

### R2 — Storage Cost

**Risiko:** Setiap album menyimpan dua versi foto (HD + preview). Untuk fotografer wedding dengan 500+ foto per event, storage cost bisa signifikan.

**Mitigasi:**
- Implementasi **Tiered Storage** (hot storage untuk foto baru, cold storage untuk arsip > 6 bulan).
- Definisikan kebijakan retensi foto yang jelas di Terms of Service.
- Pertimbangkan model pricing berbasis storage usage pada tier berbayar *(future consideration)*.
- Mulai dengan GCS Nearline atau AWS S3 Intelligent-Tiering.

---

### R3 — Payment Integration Complexity

**Risiko:** Integrasi payment gateway memerlukan verifikasi bisnis, testing webhook di production, dan penanganan edge case (double payment, timeout, reconciliation).

**Mitigasi:**
- Pilih payment gateway dengan dokumentasi dan SDK Node.js yang mature (**Midtrans** direkomendasikan untuk Indonesia).
- Mulai dengan metode pembayaran yang paling umum (bank transfer + QRIS).
- Implementasikan idempotency key untuk mencegah double processing.
- Buat logging lengkap untuk setiap transaksi.

---

### R4 — User Adoption

**Risiko:** Fotografer terbiasa dengan tool gratis (Google Drive, WhatsApp). Mengubah behavior membutuhkan edukasi dan nilai yang jelas.

**Mitigasi:**
- **Free tier yang bermakna** — fotografer dapat mencoba tanpa kartu kredit.
- Onboarding yang sangat mudah (upload pertama dalam < 5 menit).
- Content marketing: studi kasus fotografer yang pernah dirugikan klien.
- Partnership dengan komunitas fotografer Indonesia (Instagram, komunitas wedding organizer).

---

### R5 — Data Breach / HD Photo Leak

**Risiko:** Jika storage private terkompromi, foto HD klien bocor sebelum pembayaran.

**Mitigasi:**
- HD files tidak pernah memiliki URL publik permanen — selalu via signed URL berumur pendek.
- Enkripsi file HD at-rest di storage.
- Audit access log secara berkala.
- Implementasi security monitoring dan anomaly detection *(future consideration)*.

---

### R6 — Processing Performance

**Risiko:** Watermarking dan image processing bisa memakan waktu lama untuk foto resolusi tinggi (>30MB RAW).

**Mitigasi:**
- Semua processing dijalankan secara asynchronous via job queue.
- Beri feedback status kepada photographer ("2 dari 50 foto sedang diproses").
- Tentukan batas ukuran file upload yang masuk akal (mis. JPEG ≤ 50MB per foto).
- Evaluasi penggunaan worker node terpisah untuk image processing.

---

### R7 — Kompetitor

**Risiko:** Platform besar (Pixieset, ShootProof, Pic-Time) sudah melayani fotografer internasional. Pemain lokal bisa meniru.

**Mitigasi:**
- Fokus pada **pasar Indonesia** yang kurang terlayani oleh platform internasional (harga, payment gateway lokal, bahasa).
- Kecepatan eksekusi dan iterasi produk menjadi keunggulan utama.
- Bangun network effect dari komunitas fotografer lokal lebih cepat dari kompetitor.
- Invisible watermark + AI adaptive watermark sebagai moat teknis yang membutuhkan waktu untuk ditiru.

---

## 17. Kesimpulan

### Evaluasi Peluang Produk

FrameSafe memiliki **peluang nyata** untuk menjadi produk yang berbeda dan relevan, dengan sejumlah alasan:

---

**1. Pasar yang Underserved**

Platform pengiriman foto profesional untuk segmen SMB fotografi di Indonesia praktis tidak ada yang melayani secara lokal. Pixieset dan ShootProof beroperasi untuk pasar barat dengan payment gateway dan pricing yang tidak ramah fotografer Indonesia. FrameSafe dapat mengisi kekosongan ini dengan solusi yang native untuk ekosistem lokal.

---

**2. Pain Point yang Nyata dan Terverifikasi**

Masalah fotografer yang tidak dibayar setelah mengirim foto bukan anekdot — ini adalah keluhan yang konsisten dalam komunitas fotografer Indonesia. Ini menandakan **validated problem** yang belum punya solusi teknologi yang memadai.

---

**3. Diferensiasi Teknis yang Bermakna**

AI Adaptive Watermark dan Invisible Watermark bukan sekadar fitur tambahan — keduanya membangun **moat teknologi** yang membutuhkan R&D dan waktu untuk ditiru. Posisi sebagai platform dengan watermark paling canggih di segmen ini bisa menjadi identitas produk jangka panjang.

---

**4. Fondasi Teknis yang Solid**

Backend Phase 2–4 yang sudah selesai menunjukkan bahwa tim memiliki kemampuan eksekusi teknis. Stack yang dipilih (Node.js / TypeScript / Prisma / PostgreSQL) adalah pilihan yang mature dan produktif untuk fase pengembangan berikutnya.

---

**5. Model Bisnis yang Jelas**

Payment-gated HD delivery secara natural mendukung model bisnis berbasis komisi transaksi atau subscription. Photographer yang berhasil menerima pembayaran melalui FrameSafe memiliki insentif kuat untuk terus menggunakan platform.

---

### Rekomendasi Eksekusi

> [!IMPORTANT]
> Prioritas utama adalah menyelesaikan **Phase 5 (Photo Processing Pipeline)** secepat mungkin. Ini adalah komponen yang paling kompleks secara teknis dan merupakan inti dari proposisi nilai FrameSafe. Jangan launch tanpa pipeline ini berfungsi dengan baik.

> [!TIP]
> Lakukan **beta testing dengan 5–10 fotografer nyata** sebelum launch publik. Feedback dari penggunaan real-world akan mengungkap masalah yang tidak terlihat dalam spesifikasi.

---

### Penilaian Akhir

| Dimensi | Penilaian | Catatan |
|---------|-----------|---------|
| **Problem Validity** | ✅ Tinggi | Pain point nyata dan terverifikasi |
| **Market Opportunity** | ✅ Tinggi | Pasar lokal belum terlayani |
| **Technical Feasibility** | ✅ Medium–Tinggi | Stack solid, tantangan ada di watermark R&D |
| **Competitive Differentiation** | ✅ Tinggi | Kombinasi AI watermark + payment gate unik di segmen |
| **Execution Risk** | ⚠️ Medium | Payment integration & user adoption perlu perhatian |
| **Business Model Clarity** | ✅ Medium | Model dasar jelas, detail pricing perlu dikerjakan |

**Verdict:** FrameSafe memiliki fondasi yang kuat untuk berkembang dari alat teknis menjadi platform bisnis yang berkelanjutan. Dengan eksekusi yang fokus pada MVP dan validasi pasar yang cepat, FrameSafe berpotensi menjadi **standar industri baru untuk pengiriman foto profesional di Indonesia**.

---

*Dokumen ini merupakan living document. Revisi dilakukan berdasarkan feedback validasi produk dan perubahan kebutuhan bisnis.*

---

> **PRD Version:** 1.0.0 · **Last Updated:** October 29, 2026
> **Next Review:** After Phase 5 completion
