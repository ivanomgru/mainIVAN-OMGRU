// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,          // اضافه شد
  signInWithPhoneNumber       // اضافه شد
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB2rFmjyPnC5iqHcQHuDfsB48R2leV1Ig0",
  authDomain: "ivan-omgru.firebaseapp.com",
  projectId: "ivan-omgru",
  storageBucket: "ivan-omgru.firebasestorage.app",
  messagingSenderId: "448940443714",
  appId: "1:448940443714:web:5d5b01718d8dfa1301c5db"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ایمیل مدیر سایت
const adminEmails = ["Loverussian62@gmail.com"];

// ======================
// ثبت‌نام با ایمیل/پسورد
// ======================
const signUpForm = document.getElementById("sign-up-one__form");
if(signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("formName").value;
    const email = document.getElementById("formEmail").value;
    const password = document.getElementById("formPassword").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // مدیر نیاز به تایید ایمیل ندارد
      if(!adminEmails.includes(email)) {
        await sendEmailVerification(userCredential.user);
        alert(`🎉 ثبت نام موفق! ایمیل تایید به ${email} ارسال شد.`);
      }

      signUpForm.reset();

      // تشخیص مدیر یا کاربر
      if (adminEmails.includes(email)) {
        alert(`👑 خوش آمدید مدیر عزیز!  
اینجا پنل مدیریتی حرفه‌ای شماست.  
شما می‌توانید همه کاربران، پروژه‌ها، گزارش‌ها و تنظیمات سایت را مدیریت کنید.  
از امکانات پیشرفته و کنترل کامل داشبورد لذت ببرید!`);
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "dashboard.html";
      }

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert(`⚠️ شما قبلاً ثبت‌نام کرده‌اید! لطفاً وارد شوید.`);
      } else {
        alert(`❌ خطا: ${error.message}`);
      }
    }
  });
}

// ======================
// ورود/ثبت‌نام با گوگل
// ======================
const provider = new GoogleAuthProvider();
const googleBtn = document.querySelector(".google-facebook a");
if(googleBtn) {
  googleBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (adminEmails.includes(user.email)) {
        alert(`👑 خوش آمدید مدیر عزیز!  
اینجا پنل مدیریتی حرفه‌ای شماست.  
شما می‌توانید همه کاربران، پروژه‌ها، گزارش‌ها و تنظیمات سایت را مدیریت کنید.  
از امکانات پیشرفته و کنترل کامل داشبورد لذت ببرید!`);
        window.location.href = "admin-dashboard.html";
      } else {
        alert(`🎉 ورود با گوگل موفق! خوش آمدی ${user.displayName}`);
        window.location.href = "dashboard.html";
      }

    } catch (error) {
      if (error.code === 'auth/unauthorized-domain') {
        alert("⚠️ دامنه شما در Firebase مجاز نیست. لطفاً localhost یا دامنه سایت را اضافه کنید.");
      } else {
        alert(`❌ خطا در ورود گوگل: ${error.message}`);
      }
    }
  });
}
// ======================
// ورود با شماره تلفن
// ======================
const phoneInput = document.getElementById("formPhone");
const sendOTPBtn = document.getElementById("sendOTPBtn");

// شماره موبایل ادمین
const adminPhoneNumbers = ["+989223055692"];

if(sendOTPBtn) {
  // راه‌اندازی reCAPTCHA
  window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    'size': 'invisible',
    'callback': (response) => { 
      console.log("reCAPTCHA verified!");
    }
  });

  sendOTPBtn.addEventListener("click", async () => {
    let phoneNumber = phoneInput.value.trim();

    // اعتبارسنجی شماره تلفن
    if (!phoneNumber) {
      alert("❌ لطفاً شماره تلفن را وارد کنید.");
      return;
    }

    if (!phoneNumber.startsWith('+')) {
      alert("❌ لطفاً شماره را با کد کشور وارد کنید (مثال: +989123456789).");
      return;
    }

    phoneNumber = phoneNumber.replace(/[\s\-]/g, '');
    if (!/^\+\d+$/.test(phoneNumber)) {
      alert("❌ فرمت شماره تلفن نامعتبر است. فقط از اعداد و + استفاده کنید.");
      return;
    }

    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;

      const code = prompt("کد OTP که دریافت کردید را وارد کنید:");
      if (!code) return;

      const result = await confirmationResult.confirm(code);
      const user = result.user;
      alert(`🎉 ورود موفق با شماره موبایل: ${user.phoneNumber}`);

      // تشخیص ادمین یا کاربر عادی
      if (adminPhoneNumbers.includes(user.phoneNumber)) {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "dashboard.html";
      }

    } catch(error) {
      console.error(error);
      alert(`❌ خطا در ارسال یا تایید کد: ${error.message}`);
    }
  });
}
// ======================
// ورود با ایمیل/پسورد
// ======================
const loginForm = document.getElementById("login-one__form");
if(loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("formEmail").value;
    const password = document.getElementById("formPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // مدیر نیاز به تایید ایمیل ندارد
      if(!adminEmails.includes(user.email) && !user.emailVerified) {
        alert("⚠️ ایمیل شما هنوز تایید نشده است. لطفاً ایمیل خود را چک کنید.");
        return;
      }

      loginForm.reset();

      if (adminEmails.includes(user.email)) {
        alert(`👑 خوش آمدید مدیر عزیز!  
اینجا پنل مدیریتی حرفه‌ای شماست.  
شما می‌توانید همه کاربران، پروژه‌ها، گزارش‌ها و تنظیمات سایت را مدیریت کنید.  
از امکانات پیشرفته و کنترل کامل داشبورد لذت ببرید!`);
        window.location.href = "admin-dashboard.html";
      } else {
        alert(`🎉 ورود موفق! خوش آمدی ${user.displayName || email}`);
        window.location.href = "dashboard.html";
      }

    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert("⚠️ کاربری با این ایمیل پیدا نشد. لطفاً ثبت نام کنید.");
      } else if (error.code === 'auth/wrong-password') {
        alert("⚠️ رمز عبور اشتباه است.");
      } else {
        alert(`❌ خطا: ${error.message}`);
      }
    }
  });
}