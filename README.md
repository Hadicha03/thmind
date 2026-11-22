# 🚀 TH Mind — Dasturlash Akademiyasi (Frontend & Backend)

**TH Mind** — o'quvchilar uchun frontend va backend dasturlashni amaliy topshiriqlar, sun'iy intellekt (AI) nazorati va rasmiy sertifikat taqdim etish bilan o'rgatuvchi zamonaviy ta'lim platformasi.

---

## ⚙️ Talablar

- Node.js va npm o'rnatilgan bo'lishi kerak.
- Birinchi ishga tushirishda backend va frontend paketlari avtomatik o'rnatiladi; buning uchun internetga ulanish zarur.

---

## 🎨 Asosiy Xususiyatlar

1. **Ustuvor Ranglar (Qizil va Ko'k):**
   - Zamonaviy neon va dual-gradient qizil (`#ef4444`) va ko'k (`#2563eb` / `#3b82f6`) ranglar palitrasi.
   - Logo, tugmalar, kartalar, yorliqlar va sertifikat dizaynida qizil-ko'k uyg'unligi.

2. **Yagona Sahifa (Single HTML / SPA):**
   - Bitta HTML orqali butun platforma ishlaydi.
   - Yuqori paneldagi **Frontend** va **Backend** tugmalari:
     - **Frontend tanlanganda:** HTML asoslari, CSS bilan bezash, JavaScript darslari va amaliy topshiriqlari chiqadi.
     - **Backend tanlanganda:** Tekshiruv funksiyalari, API javoblari, ma'lumotlar ustida ishlash darslari va topshiriqlari chiqadi.
     - **Kompyuter savodxonligi tanlanganda:** 2 oylik kurs (24 mavzu + PowerPoint bonus) — kompyuter qismlari, Windows, fayllar, Word, Excel, Internet, email va onlayn xavfsizlik. Har bir mavzu: darslik + amaliy mashq + 5 ta test savoli (o'tish uchun kamida 80%). Barcha mavzular topshirilsa, sertifikat beriladi. Kurs mazmuni: `backend/src/seed-savodxonlik.js`.

3. **Dark / Light Mode (Tungi va Kunduzgi Rejim):**
   - Bitta tugma orqali qulay tungi (Dark) yoki kunduzgi (Light) ko'rinishga o'tish imkoniyati.
   - Foydalanuvchi tanlovi xotirada (`localStorage`) saqlanadi.

4. **Sun'iy Intellekt (AI) Tahlili va Xatolarni Tushuntirish:**
   - O'quvchi kod yozib **"Tekshirish & AI Tahlil"** (yoki `Ctrl + Enter`) bosganda, AI:
     - Avtomatik unit testlarni ishga tushiradi.
     - Xato bo'lsa: **xato mohiyatini**, **qaysi qatorda/mantiqda xato ketganini**, **qanday to'g'rilash kerakligini** o'zbek tilida tushuntirib beradi.
     - Hammasi to'g'ri bo'lsa: tabriklaydi va **eng yaxshi dasturlash amaliyotlari (Pro-maslahat)** bilan o'rtoqlashadi.
   - **Google Gemini AI integratsiyasi:** Admin panelda Gemini API kaliti kiritilsa, Google Gemini 1.5/2.0 Flash orqali tahlil qilinadi; kalit kiritilmagan holda ham o'rnatilgan lokal AI ustoz to'liq ishlaydi.
   - **AI bilan muloqot:** O'quvchi istalgan paytda AI ustozga topshiriq yuzasidan o'z savolini berishi mumkin.

5. **Jonli Natija (Live HTML/CSS Preview):**
   - HTML va CSS topshiriqlarida o'quvchi yozgan kodi brauzerda qanday ko'rinishini real vaqtda jonli ko'ra oladi.

6. **Kurs Oxirida Rasmiy Sertifikat:**
   - Kursdagi barcha topshiriqlar 100% to'g'ri bajarilganda:
     - Bayroqcha va konfetti salyutlari otiladi!
     - O'quvchining to'liq ism-familiyasi kiritiladi.
     - Unikal ID raqamli (`THM-FRONTEND-...` yoki `THM-BACKEND-...`), oltin muhrli va rasmiy imzoli sertifikat taqdim etiladi.
     - Sertifikatni **chop etish (Print)** yoki **PDF shaklida saqlash** tugmasi mavjud.
     - Istalgan shaxs saytning **"Tekshirish"** bo'limida sertifikat ID raqamini kiritib, uning haqiqiyligini tekshira oladi.

7. **Keng Imkoniyatli Admin Paneli:**
   - Sayt yuqorisidagi **"Admin"** tugmasi orqali kiriladi (standart parol: `admin`).
   - **Statistika:** O'quvchilar soni, topshiriqlar, yuborilgan yechimlar, muvaffaqiyat foizi.
   - **Topshiriqlar boshqaruvi:** Yangi topshiriq qo'shish, mavjudlarini tahrirlash (sarlavha, yo'nalish, til, ball, boshlang'ich kod, yechim kodi, yo'riqnoma, testlar JSON), o'chirish.
   - **Talabalar yechimlari:** O'quvchilar yuborgan kodlar va AI taqrizlarini kuzatib borish.
   - **Sertifikatlar:** Barcha berilgan sertifikatlar ro'yxati.
   - **AI va Tizim Sozlamalari:** Gemini API kalitini kiritish, modelni tanlash, tizim promptini o'zgartirish, admin parolini yangilash yoki bazani tiklash.

---

## 💻 Loyihani Ishga Tushirish

### 1-usul: `start.bat` orqali (eng oson)
Fayllar orasidagi `start.bat` fayliga sichqoncha bilan ikki marta bosing. U avtomatik tarzda:
- Backend va frontend serverlarini ishga tushiradi (port band bo'lsa, bo'sh port tanlaydi).
- Terminalda ko'rsatilgan Frontend manzilini brauzerda oching.

### 2-usul: Buyruqlar satri orqali
```bash
npm run dev
```

Brauzerda Dev Manager ko'rsatgan Frontend manzilini oching (odatda **`http://127.0.0.1:5173`**).

---

## 🔑 Admin Kirish Ma'lumotlari
- **Admin Paroli:** `admin` (Admin panel sozlamalaridan xohlagan paytda o'zgartirishingiz mumkin).
