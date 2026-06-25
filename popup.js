const LOWER   = 'abcdefghijklmnopqrstuvwxyz';
const UPPER   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS  = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+[]{}|;:,.<>?';

function _cryptoChar(charset) {
  if (!charset || charset.length === 0) return '';
  const max = 256 - (256 % charset.length);
  let val;
  const b = new Uint8Array(1);
  do {
    crypto.getRandomValues(b);
    val = b[0];
  } while (val >= max);
  return charset[val % charset.length];
}

function _cryptoInt(maxExcl) {
  if (maxExcl <= 1) return 0;
  const max = 256 - (256 % maxExcl);
  let val;
  const b = new Uint8Array(1);
  do {
    crypto.getRandomValues(b);
    val = b[0];
  } while (val >= max);
  return val % maxExcl;
}

const STRENGTH_CONFIG = [
  { label: 'Very Weak', color: '#ef4444', segments: 1 },
  { label: 'Weak',      color: '#f97316', segments: 2 },
  { label: 'Fair',       color: '#eab308', segments: 3 },
  { label: 'Strong',    color: '#22c55e', segments: 4 },
  { label: 'Very Strong', color: '#16a34a', segments: 5 }
];

const CHECK_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const X_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

const passwordInput     = document.getElementById('passwordInput');
const toggleVisibility  = document.getElementById('toggleVisibility');
const eyeIcon           = document.getElementById('eyeIcon');
const eyeOffIcon        = document.getElementById('eyeOffIcon');

const strengthSection   = document.getElementById('strengthSection');
const strengthBar       = document.getElementById('strengthBar');
const strengthName      = document.getElementById('strengthName');
const segments          = strengthBar.querySelectorAll('.strength-segment');

const crackSection      = document.getElementById('crackSection');
const crackTimeEl       = document.getElementById('crackTime');

const requirementsSection = document.getElementById('requirementsSection');

const lengthSlider      = document.getElementById('lengthSlider');
const lengthValue       = document.getElementById('lengthValue');
const chkSymbols        = document.getElementById('chkSymbols');
const chkUppercase      = document.getElementById('chkUppercase');
const chkNumbers        = document.getElementById('chkNumbers');
const generateBtn       = document.getElementById('generateBtn');
const generatedRow      = document.getElementById('generatedRow');
const generatedPassword = document.getElementById('generatedPassword');
const copyBtn           = document.getElementById('copyBtn');
const copyIcon          = document.getElementById('copyIcon');
const checkIcon         = document.getElementById('checkIcon');

const settingsBtn       = document.getElementById('settingsBtn');
const settingsPanel     = document.getElementById('settingsPanel');
const settingAutoCopy   = document.getElementById('settingAutoCopy');
const settingShowCrack  = document.getElementById('settingShowCrack');
const settingMinLength  = document.getElementById('settingMinLength');
const strengthenBtn     = document.getElementById('strengthenBtn');

const reqIconEls = [
  document.getElementById('reqIconLength'),
  document.getElementById('reqIconUppercase'),
  document.getElementById('reqIconLowercase'),
  document.getElementById('reqIconNumber'),
  document.getElementById('reqIconSpecial'),
  document.getElementById('reqIconCommon')
];

const LEET_MAP = {
  'a': '@',
  'e': '3',
  'i': '!',
  'o': '0',
  's': '$',
  't': '7',
  'l': '1',
  'b': '8',
  'g': '9'
};

function strengthenPassword(password) {
  let result = password.replace(/\s/g, '');

  let leetResult = '';
  let usedSubs = 0;
  for (const ch of result) {
    if (LEET_MAP[ch] && /[a-z]/.test(ch) && usedSubs < Math.ceil(result.length / 2)) {
      leetResult += LEET_MAP[ch];
      usedSubs++;
    } else {
      leetResult += ch;
    }
  }
  result = leetResult;

  if (!/[A-Z]/.test(result)) {
    let found = false;
    result = result.split('').map(ch => {
      if (!found && /[a-z]/.test(ch)) { found = true; return ch.toUpperCase(); }
      return ch;
    }).join('');
    if (!found) result += 'K';
  }

  if (!/[a-z]/.test(result)) result += _cryptoChar(LOWER);
  if (!/[0-9]/.test(result)) result += _cryptoChar(DIGITS);
  if (!/[^a-zA-Z0-9\s]/.test(result)) result += _cryptoChar(SYMBOLS);

  const extras = UPPER + LOWER + DIGITS + SYMBOLS;
  const minLen = parseInt(settingMinLength.value, 10) || 8;
  while (result.length < minLen) {
    result += _cryptoChar(extras);
  }

  const arr = result.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = _cryptoInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  result = arr.join('');

  let attempts = 0;
  while (getScore(result) <= 2 && attempts < 10) {
    result += _cryptoChar(extras);
    attempts++;
  }

  if (attempts > 0) {
    const arr2 = result.split('');
    for (let i = arr2.length - 1; i > 0; i--) {
      const j = _cryptoInt(i + 1);
      [arr2[i], arr2[j]] = [arr2[j], arr2[i]];
    }
    result = arr2.join('');

    let attempts2 = 0;
    while (getScore(result) <= 2 && attempts2 < 20) {
      result += _cryptoChar(extras);
      attempts2++;
    }
  }

  return result;
}

function getScore(p, zxcvbnResult = null) {
  if (!p || p.length === 0) return 0;
  
  const result = zxcvbnResult || zxcvbn(p);
  let score = result.score;
  
  const minLen = parseInt(settingMinLength.value, 10) || 8;
  const effectiveLen = p.replace(/\s/g, '').length;
  if (effectiveLen < minLen) {
    score = Math.min(score, 0);
  }

  const hasUpper   = /[A-Z]/.test(p);
  const hasLower   = /[a-z]/.test(p);
  const hasNumber  = /[0-9]/.test(p);
  const hasSpecial = /[^a-zA-Z0-9\s]/.test(p);

  let typesPresent = 0;
  if (hasUpper) typesPresent++;
  if (hasLower) typesPresent++;
  if (hasNumber) typesPresent++;
  if (hasSpecial) typesPresent++;

  if (typesPresent === 1) score = Math.min(score, 2);

  return Math.max(0, Math.min(4, score));
}

function updateAnalysis() {
  const password = passwordInput.value;

  if (!password) {
    strengthSection.style.display = 'none';
    crackSection.style.display = 'none';
    requirementsSection.style.display = 'none';
    strengthenBtn.style.display = 'none';
    return;
  }

  strengthSection.style.display = '';
  crackSection.style.display = settingShowCrack.checked ? '' : 'none';
  requirementsSection.style.display = '';

  const zxcvbnResult = zxcvbn(password);
  
  const baseScore = getScore(password, zxcvbnResult);

  const minLen = parseInt(settingMinLength.value, 10) || 8;
  const isCommon = zxcvbnResult.sequence.some(s => 
    s.pattern === 'dictionary' && 
    (s.dictionary_name === 'passwords' || s.dictionary_name === 'english_wikipedia' || s.dictionary_name === 'female_names' || s.dictionary_name === 'male_names' || s.dictionary_name === 'surnames' || s.dictionary_name === 'us_tv_and_film')
  );

  const isInRockYou = typeof ROCKYOU_SET !== 'undefined' && ROCKYOU_SET.has(password.toLowerCase().trim());

  const reqs = {
    length:    password.replace(/\s/g, '').length >= minLen,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number:    /[0-9]/.test(password),
    special:   /[^a-zA-Z0-9\s]/.test(password),
    common:    !isCommon && !isInRockYou && zxcvbnResult.score >= 2
  };

  const failedReqs = Object.values(reqs).filter(v => !v).length;
  let score = baseScore;

  if (isInRockYou) {
    score = 0;
  } else if (failedReqs >= 3) {
    score = Math.min(score, 1);
  } else if (failedReqs >= 1) {
    score = Math.min(score, 2);  
  }

  const config = STRENGTH_CONFIG[score];

  strengthName.textContent = config.label;
  strengthName.style.color = config.color;

  segments.forEach((seg, i) => {
    seg.style.background = i < config.segments ? config.color : '#e5e7eb';
  });

  const ceilings = [3, 6, 8, 10, Infinity];
  const maxLog = ceilings[score];
  const effectiveLog = Math.min(zxcvbnResult.guesses_log10, maxLog);
  const guesses = Math.pow(10, effectiveLog);
  
  const attackSpeed = 10;
  const sec = guesses / attackSpeed;
  
  const fmt = (n, s, pl) => `${n} ${n === 1 ? s : pl}`;
  let timeDisplay;
  
  if (sec < 1)               timeDisplay = 'Instantly';
  else if (sec < 60)         timeDisplay = fmt(Math.round(sec), 'second', 'seconds');
  else if (sec < 3600)       timeDisplay = fmt(Math.round(sec / 60), 'minute', 'minutes');
  else if (sec < 86400)      timeDisplay = fmt(Math.round(sec / 3600), 'hour', 'hours');
  else if (sec < 2592000)    timeDisplay = fmt(Math.round(sec / 86400), 'day', 'days');
  else if (sec < 31536000)   timeDisplay = fmt(Math.round(sec / 2592000), 'month', 'months');
  else if (sec < 3.154e9)    timeDisplay = fmt(Math.round(sec / 31536000), 'year', 'years');
  else if (sec < 3.154e11)   timeDisplay = fmt(Math.round(sec / 3.154e9), 'century', 'centuries');
  else timeDisplay = 'Centuries+';

  crackTimeEl.textContent = timeDisplay === 'Instantly' 
    ? 'Instantly' 
    : timeDisplay.charAt(0).toUpperCase() + timeDisplay.slice(1);

  const reqElements = [
    { key: 'length', el: document.getElementById('reqIconLength') },
    { key: 'uppercase', el: document.getElementById('reqIconUppercase') },
    { key: 'lowercase', el: document.getElementById('reqIconLowercase') },
    { key: 'number', el: document.getElementById('reqIconNumber') },
    { key: 'special', el: document.getElementById('reqIconSpecial') },
    { key: 'common', el: document.getElementById('reqIconCommon') }
  ];

  reqElements.forEach(({ key, el }) => {
    if (el) el.innerHTML = reqs[key] ? CHECK_SVG : X_SVG;
  });

  strengthenBtn.style.display = score < 2 ? 'flex' : 'none';
}

function generatePasswordString(length, useSymbols, useUppercase, useNumbers) {
  const mandatory = [_cryptoChar(LOWER)];
  let fullCharset = LOWER;

  if (useUppercase) { mandatory.push(_cryptoChar(UPPER));   fullCharset += UPPER; }
  if (useNumbers)   { mandatory.push(_cryptoChar(DIGITS));  fullCharset += DIGITS; }
  if (useSymbols)   { mandatory.push(_cryptoChar(SYMBOLS)); fullCharset += SYMBOLS; }

  const minLen = parseInt(settingMinLength.value, 10) || 8;
  const effectiveLen = Math.max(length, mandatory.length, minLen);
  const remaining = effectiveLen - mandatory.length;
  const rest = Array.from({ length: remaining }, () => _cryptoChar(fullCharset));

  const all = [...mandatory, ...rest];
  for (let i = all.length - 1; i > 0; i--) {
    const j = _cryptoInt(i + 1);
    [all[i], all[j]] = [all[j], all[i]];
  }

  return all.join('');
}

settingsBtn.addEventListener('click', () => {
  const isOpen = settingsPanel.style.display !== 'none';
  settingsPanel.style.display = isOpen ? 'none' : '';
  settingsBtn.classList.toggle('active', !isOpen);
});

settingShowCrack.addEventListener('change', () => {
  if (passwordInput.value) {
    crackSection.style.display = settingShowCrack.checked ? '' : 'none';
  }
});

settingMinLength.addEventListener('change', () => {
  const minLen = parseInt(settingMinLength.value, 10) || 8;
  const reqLengthText = document.querySelector('[data-req="length"] .req-text');
  if (reqLengthText) reqLengthText.textContent = `At least ${minLen} characters`;
  updateAnalysis();
});

strengthenBtn.addEventListener('click', () => {
  const current = passwordInput.value;
  if (!current.trim()) return;
  const stronger = strengthenPassword(current);
  passwordInput.value = stronger;
  updateAnalysis();
});

passwordInput.addEventListener('input', updateAnalysis);

toggleVisibility.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  eyeIcon.style.display = isPassword ? 'none' : '';
  eyeOffIcon.style.display = isPassword ? '' : 'none';
  passwordInput.focus();
});

lengthSlider.addEventListener('input', () => {
  lengthValue.textContent = lengthSlider.value;
});

generateBtn.addEventListener('click', () => {
  const length = parseInt(lengthSlider.value, 10);
  const pw = generatePasswordString(
    length,
    chkSymbols.checked,
    chkUppercase.checked,
    chkNumbers.checked
  );

  generatedPassword.textContent = pw;
  generatedRow.style.display = 'flex';

  if (settingAutoCopy.checked) {
    navigator.clipboard.writeText(pw).then(() => {
      copyIcon.style.display = 'none';
      checkIcon.style.display = '';
      setTimeout(() => {
        copyIcon.style.display = '';
        checkIcon.style.display = 'none';
      }, 1500);
    }).catch(() => {
      alert("Failed to copy password to clipboard.");
    });
  }
});

copyBtn.addEventListener('click', async () => {
  const pw = generatedPassword.textContent;
  if (!pw) return;

  try {
    await navigator.clipboard.writeText(pw);

    copyIcon.style.display = 'none';
    checkIcon.style.display = '';

    setTimeout(() => {
      copyIcon.style.display = '';
      checkIcon.style.display = 'none';
    }, 1500);
  } catch (err) {
    alert("Failed to copy password to clipboard.");
  }
});

passwordInput.focus();
