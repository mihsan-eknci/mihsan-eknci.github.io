/**
 * hafta7.js — Etkinlik Kayıt Sayfası Mantığı
 *
 * Görevler:
 *  1. Form gönderimini yönet (event.preventDefault)
 *  2. Boş alan doğrulaması yap
 *  3. Başarılı başvuruda innerHTML ile özet kartı oluştur
 *  4. "Tema Değiştir" ile dark/light mode toggle (classList.toggle)
 */

'use strict';

(function initHafta7() {

    // ─── Elementler ──────────────────────────────────────────────────
    const form            = document.getElementById('registrationForm');
    const formAlert       = document.getElementById('formAlert');
    const resultPlaceholder = document.getElementById('resultPlaceholder');
    const resultSummary   = document.getElementById('resultSummary');
    const themeToggleBtn  = document.getElementById('themeToggleBtn');
    const themeIcon       = document.getElementById('themeIcon');
    const body            = document.getElementById('hafta7Body');
    const heroKayitBtn    = document.getElementById('heroKayitBtn');
    const submitBtn       = document.getElementById('submitBtn');

    let isDark = false;

    // ─── 1. Hero "Kayıt Ol" → Forma smooth scroll ────────────────────
    if (heroKayitBtn) {
        heroKayitBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.getElementById('kayitFormu');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Kısa gecikme sonrası ilk alanı odakla
                setTimeout(() => {
                    const firstInput = document.getElementById('fullName');
                    if (firstInput) firstInput.focus();
                }, 600);
            }
        });
    }

    // ─── 2. Tema Değiştirme ───────────────────────────────────────────
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function () {
            isDark = !isDark;

            // classList.toggle ile dark class ekle/kaldır
            body.classList.toggle('h7-dark-mode', isDark);

            // İkon ve yazı güncelle
            if (isDark) {
                themeIcon.classList.remove('bi-moon-stars-fill');
                themeIcon.classList.add('bi-sun-fill');
                themeToggleBtn.innerHTML = '<i class="bi bi-sun-fill me-2" id="themeIcon"></i>Açık Tema';
            } else {
                const newIcon = themeToggleBtn.querySelector('i');
                if (newIcon) {
                    newIcon.classList.remove('bi-sun-fill');
                    newIcon.classList.add('bi-moon-stars-fill');
                }
                themeToggleBtn.innerHTML = '<i class="bi bi-moon-stars-fill me-2" id="themeIcon"></i>Tema Değiştir';
            }
        });
    }

    // ─── 3. Form Doğrulama Yardımcısı ────────────────────────────────
    function showAlert(message, type = 'danger') {
        formAlert.className = `alert alert-${type} h7-form-alert`;
        formAlert.innerHTML = `<i class="bi bi-${type === 'danger' ? 'exclamation-triangle' : 'check-circle'}-fill me-2"></i>${message}`;
        formAlert.classList.remove('d-none');
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideAlert() {
        formAlert.classList.add('d-none');
    }

    function getCheckedTopics() {
        const boxes = document.querySelectorAll('.h7-check-group input[type="checkbox"]:checked');
        return Array.from(boxes).map(b => b.value);
    }

    function getSelectedAttendance() {
        const checked = document.querySelector('input[name="attendanceType"]:checked');
        return checked ? checked.value : '';
    }

    // ─── 4. Form Gönderimi ────────────────────────────────────────────
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();   // Sayfa yenilemesini engelle

            hideAlert();

            // Alan değerlerini al
            const fullName    = document.getElementById('fullName').value.trim();
            const emailAddr   = document.getElementById('emailAddr').value.trim();
            const department  = document.getElementById('department').value;
            const attendance  = getSelectedAttendance();
            const topics      = getCheckedTopics();
            const userMessage = document.getElementById('userMessage').value.trim();

            // ── Doğrulama ──
            const errors = [];
            if (!fullName)      errors.push('Ad Soyad alanı boş bırakılamaz.');
            if (!emailAddr)     errors.push('E-posta alanı boş bırakılamaz.');
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddr))
                                errors.push('Geçerli bir e-posta adresi girin.');
            if (!department)    errors.push('Lütfen bölümünüzü seçin.');
            if (!userMessage)   errors.push('Kısa mesaj alanı boş bırakılamaz.');

            if (errors.length > 0) {
                showAlert(errors.join('<br>'), 'danger');
                return;
            }

            // ── Başarı: Özet Kartı oluştur ──
            buildSummaryCard({ fullName, emailAddr, department, attendance, topics, userMessage });
            showAlert('Başvurunuz başarıyla alındı! 🎉 Onay e-postası kısa sürede gönderilecek.', 'success');

            // Gönder butonunu başarı moduna al
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="bi bi-check2-circle me-2"></i>Başvuru Tamamlandı';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-success');
        });
    }

    // ─── 5. Özet Kartı Oluşturma (innerHTML) ─────────────────────────
    function buildSummaryCard(data) {
        const topicsHtml = data.topics.length
            ? data.topics.map(t => `<span class="badge h7-topic-badge">${t}</span>`).join(' ')
            : '<span class="text-muted fst-italic">Seçilmedi</span>';

        const now = new Date();
        const dateStr = now.toLocaleDateString('tr-TR', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        resultSummary.innerHTML = `
            <div class="card h7-summary-card border-0 shadow-sm">
                <div class="card-body p-4">
                    <!-- Başlık -->
                    <div class="h7-summary-header d-flex align-items-center gap-3 mb-4">
                        <div class="h7-avatar">${getInitials(data.fullName)}</div>
                        <div>
                            <h5 class="h7-summary-name mb-0">${escapeHtml(data.fullName)}</h5>
                            <small class="text-muted">${escapeHtml(data.department)}</small>
                        </div>
                        <span class="ms-auto badge h7-status-badge">✅ Onaylandı</span>
                    </div>

                    <!-- Detaylar -->
                    <ul class="list-unstyled h7-summary-list">
                        <li>
                            <i class="bi bi-envelope-fill"></i>
                            <span>${escapeHtml(data.emailAddr)}</span>
                        </li>
                        <li>
                            <i class="bi bi-ticket-perforated-fill"></i>
                            <span>${escapeHtml(data.attendance)}</span>
                        </li>
                        <li class="align-items-start">
                            <i class="bi bi-stars mt-1"></i>
                            <span>${topicsHtml}</span>
                        </li>
                        <li class="align-items-start">
                            <i class="bi bi-chat-left-text-fill mt-1"></i>
                            <span class="fst-italic">"${escapeHtml(data.userMessage)}"</span>
                        </li>
                    </ul>

                    <!-- Etkinlik Bilgisi -->
                    <div class="h7-summary-event">
                        <div class="h7-summary-event-row">
                            <i class="bi bi-calendar-event-fill"></i>
                            <span>15 Mayıs 2026 — TechConf 2026</span>
                        </div>
                        <div class="h7-summary-event-row">
                            <i class="bi bi-geo-alt-fill"></i>
                            <span>İstanbul Kongre Merkezi, Türkiye</span>
                        </div>
                    </div>

                    <!-- Başvuru Tarihi -->
                    <div class="h7-summary-footer mt-3">
                        <i class="bi bi-clock-fill me-1"></i>
                        Başvuru: ${dateStr}
                    </div>
                </div>
            </div>
        `;

        // Placeholder'ı gizle, özeti göster
        resultPlaceholder.classList.add('d-none');
        resultSummary.classList.remove('d-none');

        // Sonuç paneline smooth scroll
        resultSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ─── Yardımcı Fonksiyonlar ────────────────────────────────────────
    function getInitials(name) {
        return name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(w => w[0].toUpperCase())
            .join('');
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // ─── 6. Kalan Yer Sayacı Animasyonu (kosmetik) ────────────────────
    const spotsEl = document.getElementById('spotsLeft');
    if (spotsEl) {
        let count = 247;
        setInterval(() => {
            if (count > 230 && Math.random() < 0.3) {
                count -= Math.floor(Math.random() * 3) + 1;
                spotsEl.textContent = count;
                spotsEl.classList.add('h7-spots-flash');
                setTimeout(() => spotsEl.classList.remove('h7-spots-flash'), 400);
            }
        }, 4000);
    }

})();
