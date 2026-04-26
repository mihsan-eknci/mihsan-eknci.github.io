/**
 * navbar.js — Merkezi Navbar Yöneticisi
 *
 * Görevler:
 *  1. window.location.pathname'e göre aktif nav linkini otomatik işaretler.
 *  2. "Uygulamalar" alt sayfalarında dropdown toggle'ı da aktif yapar.
 *  3. Dropdown için click-toggle (mobil & klavye desteği) sağlar.
 *  4. Dışarı tıklandığında dropdown'ı kapatır.
 */

'use strict';

(function initNavbar() {

    // ─── 1. Aktif Sayfa Tespiti ───────────────────────────────────────
    const currentFile = window.location.pathname
        .split('/')
        .filter(Boolean)          // boş parçaları at
        .pop()                    // son segment → 'about.html' gibi
        || 'index.html';          // kök URL için fallback

    // Uygulama sayfaları — dropdown toggle da aktif olacak
    const appPages = ['grade-calc.html', 'unit-converter.html'];
    const isAppPage = appPages.includes(currentFile);

    // Tüm nav linklerini tara
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // href'deki dosya adını al ('about.html', '#' vb.)
        const linkFile = href.split('/').pop();

        if (linkFile === currentFile) {
            link.classList.add('active');
        }
    });

    // ─── 2. Dropdown Toggle → Aktif (uygulama sayfaları) ─────────────
    if (isAppPage) {
        const toggle = document.querySelector('.dropdown-toggle');
        if (toggle) toggle.classList.add('active');
    }

    // ─── 3. Dropdown Click-Toggle (mobil & klavye) ────────────────────
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            const li = this.closest('.dropdown');
            const isOpen = li.classList.contains('open');

            // Önce tüm açık dropdown'ları kapat
            document.querySelectorAll('.dropdown.open')
                .forEach(d => d.classList.remove('open'));

            // Tıklanan kapalıysa aç
            if (!isOpen) li.classList.add('open');
        });

        // Klavye erişilebilirliği — Enter/Space ile aç/kapat
        toggle.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // ─── 4. Dışarı Tıklayınca Kapat ──────────────────────────────────
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown.open')
                .forEach(d => d.classList.remove('open'));
        }
    });

    // Escape tuşu ile kapat
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown.open')
                .forEach(d => d.classList.remove('open'));
        }
    });

})();
