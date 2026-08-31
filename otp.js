// ============================================================
//  RUSI MOTORS – OTP Module (EmailJS)
// ============================================================

const EMAILJS_SERVICE_ID  = 'rusi_motors_service';
const EMAILJS_TEMPLATE_ID = 'template_2r230qs';
const EMAILJS_PUBLIC_KEY  = '-6vJ2tBjvjNkUXWPB';

// Store OTP in memory (sessionStorage for tab persistence)
const OTP_KEY     = 'rusi_otp_code';
const OTP_EMAIL   = 'rusi_otp_email';
const OTP_EXPIRY  = 'rusi_otp_expiry';

// ── Generate 6-digit OTP ─────────────────────────────────
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ── Send OTP via EmailJS ─────────────────────────────────
export async function sendOTP(email, name) {
  const otp     = generateOTP();
  const expiry  = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Save to sessionStorage
  sessionStorage.setItem(OTP_KEY,    otp);
  sessionStorage.setItem(OTP_EMAIL,  email);
  sessionStorage.setItem(OTP_EXPIRY, expiry);

  // Load EmailJS SDK dynamically
  await loadEmailJS();

  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_email:  email,
      to_name:   name || email.split('@')[0],
      otp_code:  otp
    },
    EMAILJS_PUBLIC_KEY
  );

  return otp; // for testing only — remove in production
}

// ── Verify OTP ───────────────────────────────────────────
export function verifyOTP(inputCode, email) {
  const savedOTP    = sessionStorage.getItem(OTP_KEY);
  const savedEmail  = sessionStorage.getItem(OTP_EMAIL);
  const expiry      = parseInt(sessionStorage.getItem(OTP_EXPIRY) || '0');

  if (!savedOTP)                        return { valid: false, reason: 'No OTP found. Please request again.' };
  if (Date.now() > expiry)              return { valid: false, reason: 'OTP has expired. Please request a new one.' };
  if (savedEmail !== email)             return { valid: false, reason: 'Email mismatch.' };
  if (inputCode.trim() !== savedOTP)    return { valid: false, reason: 'Incorrect OTP code.' };

  // Clear after successful verify
  sessionStorage.removeItem(OTP_KEY);
  sessionStorage.removeItem(OTP_EMAIL);
  sessionStorage.removeItem(OTP_EXPIRY);

  return { valid: true };
}

// ── Load EmailJS SDK from CDN ────────────────────────────
function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (window.emailjs) { resolve(); return; }
    const script  = document.createElement('script');
    script.src    = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    script.onload = () => resolve();
    script.onerror= () => reject(new Error('Failed to load EmailJS SDK'));
    document.head.appendChild(script);
  });
}
