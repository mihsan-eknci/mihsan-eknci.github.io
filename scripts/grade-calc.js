/**
 * grade-calc.js
 * Öğrenci Not Hesaplama Uygulaması
 * Ortalama = (Vize * 0.4) + (Final * 0.6)
 */

'use strict';

// ─── DOM Referansları ───────────────────────────────────────────
const form          = document.getElementById('gradeForm');
const studentName   = document.getElementById('studentName');
const vizeInput     = document.getElementById('vizeNote');
const finalInput    = document.getElementById('finalNote');
const calcBtn       = document.getElementById('calcBtn');
const resetBtn      = document.getElementById('resetBtn');

const resultPanel   = document.getElementById('resultPanel');
const resultPlaceholder = document.getElementById('resultPlaceholder');
const resultContent = document.getElementById('resultContent');

const resultName    = document.getElementById('resultName');
const scoreCircle   = document.getElementById('scoreCircle');
const scoreValue    = document.getElementById('scoreValue');
const letterBadge   = document.getElementById('letterBadge');
const statusBadge   = document.getElementById('statusBadge');
const vizeContrib   = document.getElementById('vizeContrib');
const finalContrib  = document.getElementById('finalContrib');

// ─── Not Baremi ─────────────────────────────────────────────────
/**
 * @param {number} avg - 0..100 arası ortalama
 * @returns {{ letter: string, colorClass: string }}
 */
function getLetterGrade(avg) {
    if (avg >= 90) return { letter: 'AA', colorClass: 'grade-aa' };
    if (avg >= 85) return { letter: 'BA', colorClass: 'grade-ba' };
    if (avg >= 80) return { letter: 'BB', colorClass: 'grade-bb' };
    if (avg >= 75) return { letter: 'CB', colorClass: 'grade-cb' };
    if (avg >= 70) return { letter: 'CC', colorClass: 'grade-cc' };
    if (avg >= 65) return { letter: 'DC', colorClass: 'grade-dc' };
    if (avg >= 60) return { letter: 'DD', colorClass: 'grade-dd' };
    if (avg >= 50) return { letter: 'FD', colorClass: 'grade-fd' };
    return { letter: 'FF', colorClass: 'grade-ff' };
}

// ─── Validasyon ─────────────────────────────────────────────────
/**
 * @param {HTMLInputElement} input
 * @param {number} val
 * @returns {boolean}
 */
function validateNote(input, val) {
    const valid = !isNaN(val) && val >= 0 && val <= 100;
    input.classList.toggle('error', !valid);
    return valid;
}

// ─── Puan Çemberi Güncelle ──────────────────────────────────────
/**
 * Conic-gradient ile dolum animasyonu
 * @param {number} avg
 */
function updateScoreRing(avg) {
    const deg = Math.round((avg / 100) * 360);
    // Renk: geçti → mavi/yeşil, kaldı → kırmızı
    const color = avg >= 50 ? '#4a90e2' : '#e74c3c';
    scoreCircle.style.background =
        `conic-gradient(${color} ${deg}deg, #e1e4e8 ${deg}deg)`;
}

// ─── Ana Hesaplama Fonksiyonu ────────────────────────────────────
function calculate() {
    const vize  = parseFloat(vizeInput.value);
    const final = parseFloat(finalInput.value);

    const vizeValid  = validateNote(vizeInput, vize);
    const finalValid = validateNote(finalInput, final);

    if (!vizeValid || !finalValid) {
        shakePanel();
        return;
    }

    // Formül: Ortalama = (Vize × 0.4) + (Final × 0.6)
    const vizeKatki  = vize  * 0.4;
    const finalKatki = final * 0.6;
    const avg        = vizeKatki + finalKatki;

    const { letter } = getLetterGrade(avg);
    const passed      = avg >= 50;

    // Ad Soyad
    const name = studentName.value.trim() || 'Öğrenci';
    resultName.textContent = `🎓 ${name}`;

    // Puan Çemberi
    scoreValue.textContent = avg.toFixed(1);
    updateScoreRing(avg);

    // Harf Notu Rozeti
    letterBadge.textContent = letter;

    // Durum Rozeti
    statusBadge.textContent = passed ? '✅ Geçti' : '❌ Kaldı';
    statusBadge.className   = 'result-badge status-badge ' + (passed ? 'status-gecti' : 'status-kaldi');

    // Katkı Dökümü
    vizeContrib.textContent  = `${vize.toFixed(1)} × 0.4 = ${vizeKatki.toFixed(2)}`;
    finalContrib.textContent = `${final.toFixed(1)} × 0.6 = ${finalKatki.toFixed(2)}`;

    // Göster
    resultPlaceholder.style.display = 'none';
    resultContent.style.display     = 'flex';
    resultPanel.style.alignItems    = 'flex-start';
}

// ─── Sıfırlama ──────────────────────────────────────────────────
function reset() {
    form.reset();
    [vizeInput, finalInput].forEach(el => el.classList.remove('error'));
    resultContent.style.display     = 'none';
    resultPlaceholder.style.display = 'flex';
    resultPanel.style.alignItems    = 'center';
    scoreCircle.style.background    = 'conic-gradient(#4a90e2 0deg, #e1e4e8 0deg)';
}

// ─── Shake Efekti (hata durumu) ─────────────────────────────────
function shakePanel() {
    calcBtn.style.animation = 'none';
    calcBtn.offsetHeight; // reflow
    calcBtn.style.animation = 'shake 0.4s ease';
    setTimeout(() => { calcBtn.style.animation = ''; }, 400);
}

// ─── Inject Shake Keyframes ─────────────────────────────────────
(function injectShake() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%       { transform: translateX(-6px); }
            40%       { transform: translateX(6px); }
            60%       { transform: translateX(-4px); }
            80%       { transform: translateX(4px); }
        }
    `;
    document.head.appendChild(style);
})();

// ─── Event Listeners ────────────────────────────────────────────
form.addEventListener('submit', function (e) {
    e.preventDefault();
    calculate();
});

resetBtn.addEventListener('click', reset);

// Enter ile de hesaplansın
[vizeInput, finalInput].forEach(input => {
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') calculate();
    });
});
