/**
 * unit-converter.js
 * Birim Dönüştürücü Uygulaması
 * Desteklenen dönüşümler:
 *   Metre      → Kilometre   (km = m / 1000)
 *   Celsius    → Fahrenheit  (°F = (°C × 1.8) + 32)
 *   Kilogram   → Gram        (g  = kg × 1000)
 */

'use strict';

// ─── Dönüşüm Tanımları ──────────────────────────────────────────
const conversions = {
    'mekm': {
        desc:       'Metre → Kilometre',
        sourceUnit: 'm',
        targetUnit: 'km',
        formula:    'değer ÷ 1000',
        convert:    v => v / 1000,
        format:     r => r.toFixed(6).replace(/\.?0+$/, '')   // gereksiz sıfırları kaldır
    },
    'cf': {
        desc:       'Celsius → Fahrenheit',
        sourceUnit: '°C',
        targetUnit: '°F',
        formula:    '(°C × 1.8) + 32',
        convert:    v => (v * 1.8) + 32,
        format:     r => r.toFixed(2)
    },
    'kgg': {
        desc:       'Kilogram → Gram',
        sourceUnit: 'kg',
        targetUnit: 'g',
        formula:    'değer × 1000',
        convert:    v => v * 1000,
        format:     r => r.toLocaleString('tr-TR')
    }
};

// Tab data-type → conversions key eşlemesi
// data-type: 'm-km' → rawKey: 'mkm' → activeKey: 'mekm'
// data-type: 'c-f'  → rawKey: 'cf'  → activeKey: 'cf'
// data-type: 'kg-g' → rawKey: 'kgg' → activeKey: 'kgg'
const tabKeyMap = {
    'mkm':  'mekm',
    'cf':   'cf',
    'kgg':  'kgg'
};

// ─── DOM Referansları ───────────────────────────────────────────
const form              = document.getElementById('converterForm');
const valueInput        = document.getElementById('valueInput');
const conversionType    = document.getElementById('conversionType');
const convertBtn        = document.getElementById('convertBtn');
const ucResetBtn        = document.getElementById('ucResetBtn');
const unitTag           = document.getElementById('unitTag');
const conversionDesc    = document.getElementById('conversionDesc');
const typeTabs          = document.querySelectorAll('.type-tab');

const ucResultPanel     = document.getElementById('ucResultPanel');
const ucResultPlaceholder = document.getElementById('ucResultPlaceholder');
const ucResultContent   = document.getElementById('ucResultContent');

const sourceVal         = document.getElementById('sourceVal');
const sourceUnit        = document.getElementById('sourceUnit');
const targetVal         = document.getElementById('targetVal');
const targetUnit        = document.getElementById('targetUnit');
const formulaText       = document.getElementById('formulaText');

// ─── Aktif Dönüşüm State ────────────────────────────────────────
let activeKey = 'mekm';  // varsayılan

// ─── Tab Seçimi ─────────────────────────────────────────────────
typeTabs.forEach(tab => {
    tab.addEventListener('click', function () {
        // Tab UI güncelle
        typeTabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // type-key belirle
        const dataType = this.dataset.type; // 'm-km', 'c-f', 'kg-g'
        const rawKey   = dataType.replace(/-/g, '');   // 'mkm', 'cf', 'kgg'
        activeKey      = tabKeyMap[rawKey] || 'mekm';

        // select senkronize et (erişilebilirlik / fallback)
        conversionType.value = dataType;

        // UI ipuçlarını güncelle
        updateUIHints();

        // Sonuç panelini sıfırla
        resetResult();
    });
});

/**
 * Birim etiketi ve açıklama metnini günceller
 */
function updateUIHints() {
    const conv      = conversions[activeKey];
    unitTag.textContent     = conv.sourceUnit;
    conversionDesc.textContent = conv.desc;
}

// ─── Ana Dönüşüm Fonksiyonu ─────────────────────────────────────
function convert() {
    const raw = valueInput.value.trim();
    const val = parseFloat(raw);

    if (raw === '' || isNaN(val)) {
        valueInput.classList.add('error');
        shakeBtn();
        return;
    }
    valueInput.classList.remove('error');

    const conv   = conversions[activeKey];
    const result = conv.convert(val);

    // Sonuçları doldur
    sourceVal.textContent  = val.toLocaleString('tr-TR');
    sourceUnit.textContent = conv.sourceUnit;
    targetVal.textContent  = conv.format(result);
    targetUnit.textContent = conv.targetUnit;
    formulaText.textContent = `${val} → ${conv.formula}`;

    // Göster
    ucResultPlaceholder.style.display = 'none';
    ucResultContent.style.display     = 'flex';
    ucResultPanel.style.alignItems    = 'flex-start';
}

// ─── Sıfırla ────────────────────────────────────────────────────
function resetResult() {
    valueInput.value                  = '';
    valueInput.classList.remove('error');
    ucResultContent.style.display     = 'none';
    ucResultPlaceholder.style.display = 'flex';
    ucResultPanel.style.alignItems    = 'center';
}

// ─── Shake Butonu ────────────────────────────────────────────────
function shakeBtn() {
    convertBtn.style.animation = 'none';
    convertBtn.offsetHeight;
    convertBtn.style.animation = 'shake 0.4s ease';
    setTimeout(() => { convertBtn.style.animation = ''; }, 400);
}

// ─── Shake Keyframes Inject ──────────────────────────────────────
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
    convert();
});

ucResetBtn.addEventListener('click', resetResult);

// Enter ile anında dönüştür
valueInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') convert();
});

// Anlık dönüşüm (isteğe bağlı — input event)
valueInput.addEventListener('input', function () {
    if (this.value.trim() !== '' && !isNaN(parseFloat(this.value))) {
        convert();
    }
});

// ─── İlk UI İpuçlarını Ayarla ───────────────────────────────────
updateUIHints();
