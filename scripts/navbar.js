/**
 * navbar.js — Merkezi Navbar Yöneticisi
 *
 * Görevler:
 *  1. window.location.pathname'e göre aktif nav linkini otomatik işaretler.
 *  2. "Uygulamalar" alt sayfalarında dropdown toggle'ı da aktif yapar.
 *  3. Dropdown için click-toggle (mobil & klavye desteği) sağlar.
 *  4. Dışarı tıklandığında dropdown'ı kapatir.
 *  5. Hamburger butonu ile mobil menünün açılıp kapanmasını yönetir.
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
    const appPages = ['grade-calc.html', 'unit-converter.html', 'hafta7.html'];
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
            // Mobil menüyü de kapat
            const navLinks = document.querySelector('.nav-links');
            const hamburgerBtn = document.querySelector('.hamburger-btn');
            if (navLinks) navLinks.classList.remove('open');
            if (hamburgerBtn) hamburgerBtn.classList.remove('open');
        }
    });

    // ─── 5. Hamburger Menü Toggle ────────────────────────────────────
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navLinksList = document.querySelector('.nav-links');

    if (hamburgerBtn && navLinksList) {
        hamburgerBtn.addEventListener('click', function () {
            const isOpen = navLinksList.classList.contains('open');
            navLinksList.classList.toggle('open', !isOpen);
            hamburgerBtn.classList.toggle('open', !isOpen);
            hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
        });
    }

    // Hamburger menü - dışarı tıklayınca kapat
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.navbar')) {
            const navLinks = document.querySelector('.nav-links');
            const hamburger = document.querySelector('.hamburger-btn');
            if (navLinks) navLinks.classList.remove('open');
            if (hamburger) {
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });

})();
