# 🎮 Tugas 2: Three.js Deep Dive & WebXR

### 👤 Identitas Mahasiswa
* **Nama:** [Andro Sihotang]
* **NIM:** [2305010034]
* **Matkul:** [Pengembangan game dan teknologi]

---

## 📝 Deskripsi Proyek
Proyek ini merupakan implementasi scene 3D interaktif berbasis web menggunakan **Three.js (r160)**. Di dalam proyek ini terdapat barisan objek geometris yang dilengkapi dengan pencahayaan realistik, bayangan (*shadows*), kontrol kamera interaktif, fitur deteksi klik/hover (*Raycasting*), serta dukungan teknologi Virtual Reality menggunakan **WebXR API**[cite: 1].

## 🚀 Fitur Utama
* **Modern ES Modules Setup:** Menggunakan CDN `esm.sh` untuk memuat library Three.js r160 terbaru secara modular tanpa perlu instalasi NPM[cite: 1].
* **Pipeline 3D & Prosedural Tekstur:** Kombinasi *Scene*, *Camera*, dan *WebGLRenderer* dengan lantai bertekstur kayu prosedural, dinding bata, dan material kain kain menggunakan `MeshStandardMaterial`[cite: 1].
* **Barisan 5 Objek Geometris:** Menampilkan objek Kubus, Bola, Silinder, Torus, dan Kerucut yang berjejer rapi di atas meja pajangan[cite: 1].
* **OrbitControls & Animasi Dinamis:** Kamera dapat diputar, di-zoom, dan digeser menggunakan mouse[cite: 1]. Objek memiliki animasi berputar (*tumble*) dan melayang halus memanfaatkan fungsi matematika sinus[cite: 1].
* **Sistem Interaksi Raycasting:** 
  * **Hover:** Kursor mouse berubah menjadi *pointer* dan objek memancarkan cahaya redup (*emissive glow*) saat disorot[cite: 1].
  * **Klik:** Objek yang diklik akan membesar (skala 1.25x), memancarkan *glow* kuning, dan memunculkan informasi detail objek pada panel UI[cite: 1].
* **Dukungan WebXR:** Dilengkapi dengan tombol "Masuk VR" yang kompatibel dengan WebXR Emulator untuk simulasi perangkat Virtual Reality[cite: 1].

---

## 🛠️ Cara Menjalankan Proyek Secara Lokal
1. Pastikan Anda sudah memasang ekstensi **Live Server** di VS Code.
2. Buka folder proyek ini di VS Code.
3. Klik kanan pada file `index.html` dan pilih **Open with Live Server**[cite: 1].
4. *Catatan:* Jangan membuka file HTML dengan cara klik ganda langsung (`file:///`) karena browser akan memblokir fitur ES Modules akibat kebijakan CORS[cite: 1].

## 🧪 Panduan Pengujian WebXR Emulator
1. Pasang ekstensi **WebXR API Emulator** di Google Chrome[cite: 1].
2. Buka Developer Tools (F12) dan cari panel **WebXR**.
3. Pilih perangkat VR yang ingin disimulasikan (misal: Oculus Quest)[cite: 1].
4. Klik tombol **"Masuk VR"** pada halaman web untuk masuk ke mode Virtual Reality[cite: 1].
