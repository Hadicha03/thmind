export const catalog = [
  {
    slug: "frontend",
    title: "Frontend dasturlash",
    summary: "HTML, CSS va JavaScript bilan sahifa tuzish va jonlantirish.",
    description:
      "Bu kursda brauzerda ko'rinadigan qismni noldan yig'asiz. Har bir mavzuda avval nazariy tushuntirish beriladi, so'ng amaliy vazifa topshiriladi.",
    track: "frontend",
    level: "Boshlang'ich",
    sort_order: 1,
    modules: [
      {
        title: "HTML asoslari",
        summary: "Sarlavha, ro'yxat, havola va forma — sahifaning skeleti.",
        sort_order: 1,
        tasks: [
          {
            title: "Sarlavha va paragraf",
            language: "html",
            points: 10,
            sort_order: 1,
            starter_code: "<!-- h1 va p yozing -->\n",
            solution_code: "<h1>Mening Birinchi Saytim</h1>\n<p>Men dasturlashni muvaffaqiyatli o'rganmoqdaman.</p>\n",
            theory: `### 📖 1. HTML da Sarlavha va Paragraflar

HTML (HyperText Markup Language) — bu veb-sahifaning skeleti hisoblanadi. Sahifadagi har qanday maqola yoki bo'lim sarlavhalar va matnlardan iborat bo'ladi.

#### 1. Sarlavha tegi (\`<h1>\` - \`<h6>\`)
- \`<h1>\` — sahifadagi eng katta va eng muhim asosiy sarlavha hisoblanadi (masalan, maqola yoki sahifa nomi).
- HTML da sarlavhalar \`<h1>\` dan boshlanib, \`<h6>\` gacha bo'ladi (katta hajmdan kichik hajmga qarab).
- Odatda har bir sahifada bitta asosiy \`<h1>\` ishlatiladi.

#### 2. Paragraf tegi (\`<p>\`)
- \`<p>\` tegi (paragraph — xatboshi) oddiy matnlarni yozish uchun xizmat qiladi.
- Har bir \`<p>\` tegi matnni yangi satrdan boshlaydi va yuqori hamda pastidan tabiiy bo'shliq (margin) qoldiradi.

#### 💡 Teglarni yozish qoidasi:
Deyarli barcha HTML teglari **ochuvchi** va **yopuvchi** juftlikdan iborat bo'ladi:
\`\`\`html
<h1>Bu yerga sarlavha yoziladi</h1>
<p>Bu yerga esa oddiy matn yoziladi.</p>
\`\`\`

> **Muhim eslatma:** Teg ichidagi matnni o'zingiz xohlagancha erkin yozishingiz mumkin! Asosiy maqsad — teglar to'g'ri ochilgani va yopilganini tekshirishdir.`,
            instructions: `### 🎯 Amaliy Topshiriq:
1. Sahifaga bitta \`<h1>\` sarlavha tegi yozing.
2. Bitta \`<p>\` paragraf tegi yozing.
3. **Matn erkin:** Sarlavha va paragraf ichiga o'zingiz yoqtirgan istalgan matnni yozishingiz mumkin (masalan, o'z ismingiz, salomlashish yoki shior).

Misol:
\`\`\`html
<h1>Mening Saytim</h1>
<p>Dasturlash olamiga xush kelibsiz!</p>
\`\`\``,
            checker: {
              checks: [
                {
                  name: "Asosiy sarlavha (h1)",
                  select: "h1",
                  min: 1,
                  hint: "<h1>...</h1> ko'rinishida yozing. Ichiga istalgan matn yozishingiz mumkin.",
                },
                {
                  name: "Paragraf (p)",
                  select: "p",
                  min: 1,
                  hint: "<p>...</p> ko'rinishida yozing. Ichiga istalgan matn yozishingiz mumkin.",
                },
              ],
            },
          },
          {
            title: "Ro'yxat va havola",
            language: "html",
            points: 10,
            sort_order: 2,
            starter_code: "<!-- ul, li va a yozing -->\n",
            solution_code:
              "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>\n<a href=\"https://google.com\">Qidiruv tizimi</a>\n",
            theory: `### 📖 2. Ro'yxatlar va Giperhavolalar

Veb-sahifada ma'lumotlarni tartiblash va boshqa sahifalarga yo'naltirish eng ko'p uchraydigan vazifalardan biridir.

#### 1. Tartibsiz ro'yxat (\`<ul>\` va \`<li>\`)
- \`<ul>\` (Unordered List) — tartibsiz (nuqtali) ro'yxat konteyneri.
- \`<li>\` (List Item) — ro'yxatning har bir bandi (elementi).
- Barcha \`<li>\` teglari albatta \`<ul>\` yoki \`<ol>\` ichida turishi kerak.

#### 2. Giperhavola (\`<a>\` tegi va \`href\` atributi)
- \`<a>\` (Anchor) — boshqa sahifaga yoki manzilga o'tish imkonini beruvchi havola yaratadi.
- \`href\` atributi (Hypertext Reference) — havola bosilganda ochilishi kerak bo'lgan manzilni bildiradi.

\`\`\`html
<ul>
  <li>Olma</li>
  <li>Nok</li>
  <li>Uzum</li>
</ul>

<a href="https://example.com">Saytga o'tish</a>
\`\`\``,
            instructions: `### 🎯 Amaliy Topshiriq:
1. Bitta \`<ul>\` ro'yxat konteyneri oching.
2. Uning ichida kamida 3 ta \`<li>\` ro'yxat bandi bo'lsin.
3. \`href\` atributi mavjud bo'lgan kamida bitta \`<a>\` havola qo'ying.
4. **Matn erkin:** Ro'yxat bandlari va havolaning matnini o'zingiz xohlagancha erkin tanlang!`,
            checker: {
              checks: [
                {
                  name: "Ro'yxat bandlari (ul li)",
                  select: "ul li",
                  min: 3,
                  hint: "<ul> ichida kamida 3 ta <li> bo'lsin.",
                },
                {
                  name: "Havola (a[href])",
                  select: "a[href]",
                  min: 1,
                  hint: '<a href="https://...">Havola matni</a> ko\'rinishida yozing.',
                },
              ],
            },
          },
          {
            title: "Kirish formasi",
            language: "html",
            points: 10,
            sort_order: 3,
            starter_code: "<!-- form, email input va button -->\n",
            solution_code:
              "<form>\n  <input name=\"email\" type=\"email\" placeholder=\"Emailingizni yozing\" />\n  <button type=\"submit\">Yuborish</button>\n</form>\n",
            theory: `### 📖 3. Veb Formalari (HTML Forms)

Foydalanuvchidan ma'lumot (ism, email, parol, xabar) qabul qilish va serverga yuborish uchun formalar ishlatiladi.

#### 1. Forma konteyneri (\`<form>\`)
- Barcha kiritish maydonlari va tugmalar \`<form> ... </form>\` teglari orasiga joylashtiriladi.

#### 2. Matn kiritish maydoni (\`<input>\`)
- \`<input>\` tegi juft emas (yopuvchi tegi yo'q).
- \`name\` atributi — serverga yuborilayotganda bu maydon qanday nom bilan borishini belgilaydi (masalan: \`name="email"\`).
- \`type\` atributi — maydon turini bildiradi (masalan: \`text\`, \`email\`, \`password\`).

#### 3. Yuborish tugmasi (\`<button>\`)
- Forma ichidagi tugma bosilganda kiritilgan ma'lumotlar tasdiqlanadi.

\`\`\`html
<form>
  <input name="email" type="email" />
  <button>Yuborish</button>
</form>
\`\`\``,
            instructions: `### 🎯 Amaliy Topshiriq:
1. \`<form>\` konteynerini yarating.
2. Uning ichida \`name\` atributi \`email\` bo'lgan bitta \`<input>\` bo'lsin.
3. Forma ichida bitta \`<button>\` tugmasi bo'lsin. Matnini xohlagancha yozishingiz mumkin.`,
            checker: {
              checks: [
                { name: "Forma (form)", select: "form", min: 1, hint: "<form> ... </form> yozing." },
                {
                  name: "Email maydoni",
                  select: "form input[name='email']",
                  min: 1,
                  hint: '<input name="email" ... /> yozing.',
                },
                {
                  name: "Tugma (button)",
                  select: "form button",
                  min: 1,
                  hint: "Forma ichida <button>...</button> tugmasi bo'lsin.",
                },
              ],
            },
          },
        ],
      },
      {
        title: "CSS bilan bezash",
        summary: "Rang, flexbox va tugma holati.",
        sort_order: 2,
        tasks: [
          {
            title: "Karta uslubi",
            language: "css",
            points: 10,
            sort_order: 1,
            starter_code: ".card {\n  \n}\n",
            solution_code: ".card {\n  background-color: #2563eb;\n  padding: 20px;\n  border-radius: 12px;\n}\n",
            theory: `### 📖 4. CSS Asoslari: Rang, Ichki Bo'shliq va Burchaklar

CSS (Cascading Style Sheets) veb-sahifaga chiroyli dizayn, ranglar va o'lchamlar beradi.

#### CSS Qoidasi tuzilishi:
\`\`\`css
selektor {
  xossa: qiymat;
}
\`\`\`

#### Asosiy xossalar:
1. **\`background-color\`** (yoki \`background\`) — elementning orqa fon rangini belgilaydi (nom bilan: \`red\`, \`blue\` yoki kod bilan: \`#2563eb\`).
2. **\`padding\`** — elementning kontenti va uning chegarasi orasidagi **ichki bo'shliq** (masalan: \`16px\`, \`20px\`).
3. **\`border-radius\`** — elementning o'tkir burchaklarini yumaloqlashtiradi (masalan: \`8px\`, \`12px\`).

\`\`\`css
.card {
  background-color: #3b82f6;
  padding: 16px;
  border-radius: 10px;
}
\`\`\``,
            instructions: `### 🎯 Amaliy Topshiriq:
\`.card\` selektoriga o'zingiz yoqtirgan ixtiyoriy qiymatlar bilan quyidagi 3 ta xossani yozing:
- Fon: \`background-color\` yoki \`background\`
- Ichki bo'shliq: \`padding\`
- Burchak yumaloqligi: \`border-radius\`

> **Qiymatlar erkin:** Rangni xohlagan rangizga, o'lchamlarni istalgan pikselga qo'yishingiz mumkin!`,
            checker: {
              checks: [
                {
                  name: "Karta selektori (.card)",
                  selector: ".card",
                  hint: ".card { background: ...; padding: ...; border-radius: ...; }",
                  properties: [
                    { names: ["background-color", "background"], label: "fon (background)" },
                    { names: ["padding"], label: "padding" },
                    { names: ["border-radius"], label: "border-radius" },
                  ],
                },
              ],
            },
          },
          {
            title: "Qatorni markazlash",
            language: "css",
            points: 10,
            sort_order: 2,
            starter_code: ".row {\n  \n}\n",
            solution_code:
              ".row {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n",
            theory: `### 📖 5. CSS Flexbox: Elementlarni Markazlash

Flexbox — zamonaviy CSS da elementlarni bir qatorga terish va ularni markazga joylashtirishning eng qulay usuli.

#### Asosiy Flexbox xossalari:
1. **\`display: flex\`** — elementni flex-konteynerga aylantiradi. Ichidagi bolalari darhol bir qatorga teriladi.
2. **\`justify-content: center\`** — gorizontal o'q bo'yicha elementlarni o'rtaga (markazga) joylashtiradi.
3. **\`align-items: center\`** — vertikal o'q bo'yicha elementlarni o'rtaga (markazga) joylashtiradi.

Ushbu 3 ta xossa birgalikda har qanday elementni blok markaziga to'liq keltiradi!`,
            instructions: `### 🎯 Amaliy Topshiriq:
\`.row\` selektorida quyidagi 3 ta xossani yozing:
1. \`display: flex;\`
2. \`justify-content: center;\`
3. \`align-items: center;\``,
            checker: {
              checks: [
                {
                  name: "Flex markaz (.row)",
                  selector: ".row",
                  hint: "display: flex; justify-content: center; align-items: center;",
                  properties: [
                    { names: ["display"], includes: "flex", label: "display: flex" },
                    { names: ["justify-content"], includes: "center", label: "justify-content: center" },
                    { names: ["align-items"], includes: "center", label: "align-items: center" },
                  ],
                },
              ],
            },
          },
          {
            title: "Tugma va hover",
            language: "css",
            points: 10,
            sort_order: 3,
            starter_code: ".btn {\n  \n}\n\n.btn:hover {\n  \n}\n",
            solution_code:
              ".btn {\n  background: #ef4444;\n  color: white;\n  border-radius: 8px;\n}\n\n.btn:hover {\n  background: #2563eb;\n}\n",
            theory: `### 📖 6. Tugmalar va :hover Psevdo-klassi

Veb-saytlarda tugmalar foydalanuvchi ularning ustiga sichqonchani olib borganda (hover) o'zgarishi kerak. Bu saytni jonli va interaktiv qiladi.

#### 1. Asosiy tugma uslubi (\`.btn\`):
- Fon rangi: \`background\`
- Matn rangi: \`color\`
- Burchaklar: \`border-radius\`

#### 2. Hover holati (\`.btn:hover\`):
- \`:hover\` — sichqoncha kursori element ustiga kelganda faollashadi.
- Bu holatda odatda fon rangi o'zgartiriladi yoki xiralik (\`opacity\`) qo'llaniladi.`,
            instructions: `### 🎯 Amaliy Topshiriq:
1. \`.btn\` qoidasida: fon (\`background\`), matn rangi (\`color\`) va \`border-radius\` bo'lsin.
2. \`.btn:hover\` qoidasida ko'rinish o'zgarishi (masalan, yangi fon rangi yoki shaffoflik) bo'lsin.
3. Qiymatlar va ranglarni o'zingiz yoqtirganicha tanlashingiz mumkin!`,
            checker: {
              checks: [
                {
                  name: "Tugma (.btn)",
                  selector: ".btn",
                  hint: ".btn ichida background, color va border-radius bo'lsin.",
                  properties: [
                    { names: ["background", "background-color"], label: "fon" },
                    { names: ["color"], label: "color" },
                    { names: ["border-radius"], label: "border-radius" },
                  ],
                },
                {
                  name: "Hover (.btn:hover)",
                  selector: ".btn:hover",
                  any: true,
                  hint: ".btn:hover ichida fon yoki effekt bo'lsin.",
                  properties: [
                    { names: ["background", "background-color", "opacity", "transform", "filter", "color"], label: "hover effekti" },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        title: "JavaScript",
        summary: "Funksiya, massiv va matn ustida ishlash.",
        sort_order: 3,
        tasks: [
          {
            title: "Ikki sonni qo'shish",
            language: "javascript",
            points: 10,
            sort_order: 1,
            starter_code: "function add(a, b) {\n  \n}\n",
            solution_code: "function add(a, b) {\n  return a + b;\n}\n",
            theory: `### 📖 7. JavaScript: Funksiyalar va Arifmetika

Funksiya — ma'lum bir vazifani bajaruvchi qayta ishlatiladigan kod blokidir.

#### Funksiya tuzilishi:
\`\`\`javascript
function funksiyaNomi(parametr1, parametr2) {
  return natija;
}
\`\`\`

#### \`return\` operatori nima?
- \`return\` funksiya bajargan ish natijasini tashqariga qaytaradi.
- **Eslatma:** \`console.log()\` faqat konsolga chiqaradi, lekin natijani qaytarmaydi. Dasturda qiymat olish uchun har doim \`return\` ishlatiladi.
- Sonlarni qo'shish uchun oddiy \`+\` operatori ishlatiladi: \`a + b\`.`,
            instructions: `### 🎯 Amaliy Topshiriq:
\`add(a, b)\` nomli funksiya yozing. U ikkita sonni qabul qilib, ularning yig'indisini \`return\` orqali qaytarsin.

Misol: \`add(2, 3)\` chaqirilganda \`5\` qaytishi kerak.`,
            checker: {
              tests: [
                { name: "2 + 3", fn: "add", args: [2, 3], expect: 5, hint: "return a + b yozing." },
                { name: "0 + 0", fn: "add", args: [0, 0], expect: 0, hint: "Natija return orqali chiqishi kerak." },
                { name: "Manfiy son", fn: "add", args: [-4, 10], expect: 6, hint: "Manfiy son ham + bilan qo'shiladi." },
              ],
            },
          },
          {
            title: "Juft sonlarni ajratish",
            language: "javascript",
            points: 10,
            sort_order: 2,
            starter_code: "function evenNumbers(arr) {\n  \n}\n",
            solution_code: "function evenNumbers(arr) {\n  return arr.filter((n) => n % 2 === 0);\n}\n",
            theory: `### 📖 8. Massivlar va .filter() Metodi

Massiv (Array) — bir nechta qiymatlarni bitta ro'yxatda saqlaydi.

#### \`.filter()\` metodi nima qiladi?
- Massivdagi elementlarni bittalab tekshirib, shartga mos kelganlaridan yangi massiv tuzadi.
- Juft sonni aniqlash uchun **qoldiqli bo'lish** (\`%\`) ishlatiladi:
  \`n % 2 === 0\` — agar son 2 ga qoldiqsiz bo'linsa, demak u juft!

\`\`\`javascript
const sonlar = [1, 2, 3, 4, 5, 6];
const juftlar = sonlar.filter(n => n % 2 === 0); // [2, 4, 6]
\`\`\``,
            instructions: `### 🎯 Amaliy Topshiriq:
\`evenNumbers(arr)\` funksiyasi sonlar massivini qabul qilib, faqat juft sonlardan iborat yangi massiv qaytarsin. Tartib buzilmasin.`,
            checker: {
              tests: [
                { name: "Aralash", fn: "evenNumbers", args: [[1, 2, 3, 4]], expect: [2, 4], hint: "filter va n % 2 === 0 ishlating." },
                { name: "Juft yo'q", fn: "evenNumbers", args: [[1, 3, 5]], expect: [], hint: "Mos kelmasa bo'sh massiv [] qaytaring." },
                { name: "Bo'sh massiv", fn: "evenNumbers", args: [[]], expect: [], hint: "Bo'sh massivda [] qaytaring." },
              ],
            },
          },
          {
            title: "Salomlashish",
            language: "javascript",
            points: 10,
            sort_order: 3,
            starter_code: "function greet(name) {\n  \n}\n",
            solution_code: "function greet(name) {\n  return `Salom, ${name}!`;\n}\n",
            theory: `### 📖 9. Satrlar va Shablon Qatorlar (Template Literals)

JavaScriptda matnlarni o'zgaruvchilar bilan birlashtirishning eng zamonaviy va qulay usuli — **shablon qatorlar** (backtick: \` \` \`).

#### Misol:
\`\`\`javascript
const ism = "Ali";
const xabar = \`Salom, \${ism}!\`; // "Salom, Ali!"
\`\`\`
Ushbu usulda satr ichiga \`\${o'zgaruvchi}\` ko'rinishida istalgan qiymatni oson joylash mumkin.`,
            instructions: `### 🎯 Amaliy Topshiriq:
\`greet(name)\` funksiyasi berilgan ism bilan salomlashuv matnini qaytarsin.
Masalan: \`greet("Ali")\` chaqirilganda \`Salom, Ali!\` (yoki \`Salom Ali\`) qaytarsin.`,
            checker: {
              tests: [
                { name: "Ali", fn: "greet", args: ["Ali"], expect: "Salom, Ali!", hint: "Ismni salomlashish bilan birga qaytaring." },
                { name: "Dasturchi", fn: "greet", args: ["Dasturchi"], expect: "Salom, Dasturchi!", hint: "name parametrini ishlating." },
              ],
            },
          },
          {
            title: "So'zlarni sanash",
            language: "javascript",
            points: 10,
            sort_order: 4,
            starter_code: "function countWords(text) {\n  \n}\n",
            solution_code:
              "function countWords(text) {\n  const clean = String(text || '').trim();\n  if (!clean) return 0;\n  return clean.split(/\\s+/).length;\n}\n",
            theory: `### 📖 10. Matnni Tahlil Qilish: trim() va split()

Foydalanuvchi yozgan maqola yoki xabardagi so'zlar sonini hisoblash uchun ikkita muhim metod ishlatiladi:

1. **\`trim()\`** — matnning boshidagi va oxiridagi keraksiz bo'sh joylarni (probellarni) olib tashlaydi.
2. **\`split(/\\s+/)\`** — matnni bo'shliqlar bo'yicha bo'lib, so'zlar massiviga aylantiradi.
3. Massivning **\`.length\`** xossasi esa so'zlar sonini beradi!`,
            instructions: `### 🎯 Amaliy Topshiriq:
\`countWords(text)\` funksiyasi matndagi so'zlar sonini butun son sifatida qaytarsin. Agar matn bo'sh bo'lsa, \`0\` qaytsin.`,
            checker: {
              tests: [
                { name: "Oddiy gap", fn: "countWords", args: ["Salom dunyo"], expect: 2, hint: "trim va split ishlating." },
                { name: "Ortiqcha bo'shliq", fn: "countWords", args: ["  bitta   ikkita  "], expect: 2, hint: "Bir nechta probelni bitta qilib bo'ling." },
                { name: "Bo'sh matn", fn: "countWords", args: ["   "], expect: 0, hint: "Bo'sh matnda 0 qaytaring." },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    slug: "backend",
    title: "Backend dasturlash",
    summary: "Funksiya, API javobi va ma'lumotlar ustida ishlash.",
    description:
      "Server tomoni so'rovni tekshiradi, javob qaytaradi va ma'lumotni ajratadi. Har bir mavzuda server mantig'i avval tushuntiriladi, so'ng amaliyot o'tiladi.",
    track: "backend",
    level: "Boshlang'ich",
    sort_order: 2,
    modules: [
      {
        title: "Tekshiruv funksiyalari",
        summary: "Email va hisob-kitob kabi server tekshiruvlari.",
        sort_order: 1,
        tasks: [
          {
            title: "Emailni tekshirish",
            language: "javascript",
            points: 10,
            sort_order: 1,
            starter_code: "function isValidEmail(email) {\n  \n}\n",
            solution_code:
              "function isValidEmail(email) {\n  return typeof email === 'string' && email.includes('@') && email.includes('.');\n}\n",
            theory: `### 📖 1. Backend Validatsiyasi: Ma'lumotlarni Tekshirish

Backend dasturlashda eng muhim qoida: **"Mijozdan kelgan har qanday ma'lumotni bazaga saqlashdan oldin tekshirish shart!"**

Agar foydalanuvchi xato yoki noto'g'ri email kiritgan bo'lsa, server xatolik qaytarishi kerak.
Oddiy email shartlari:
1. U albatta satr (string) turi bo'lishi kerak (\`typeof email === 'string'\`).
2. Uning ichida \`@\` belgisi bo'lishi kerak (\`email.includes('@')\`).
3. Uning ichida domen nuqtasi bo'lishi kerak (\`email.includes('.')\`).`,
            instructions: `### 🎯 Amaliy Topshiriq:
\`isValidEmail(email)\` funksiyasi berilgan qiymat to'g'ri email satri bo'lsa \`true\`, aks holda \`false\` qaytarsin.`,
            checker: {
              tests: [
                { name: "To'g'ri email", fn: "isValidEmail", args: ["ali@thmind.uz"], expect: true, hint: "@ va nuqta borligini tekshiring." },
                { name: "@ belgisi yo'q", fn: "isValidEmail", args: ["thmind.uz"], expect: false, hint: "@ bo'lmasa false qaytaring." },
                { name: "Nuqta yo'q", fn: "isValidEmail", args: ["ali@thmind"], expect: false, hint: "Nuqta ham bo'lishi kerak." },
                { name: "Satr bo'lmagan qiymat", fn: "isValidEmail", args: [123], expect: false, hint: "Satr bo'lmasa false qaytaring." },
              ],
            },
          },
          {
            title: "Buyurtma summasini hisoblash",
            language: "javascript",
            points: 10,
            sort_order: 2,
            starter_code: "function calculateTotal(items) {\n  \n}\n",
            solution_code:
              "function calculateTotal(items) {\n  return items.reduce((sum, item) => sum + item.price * item.qty, 0);\n}\n",
            theory: `### 📖 2. Savatcha va Hisob-Kitob Mantig'i

Onlayn do'konlarda mijoz bir nechta mahsulot sotib oladi. Har bir buyum obyekt sifatida keladi:
\`{ price: 10000, qty: 2 }\` (narxi va miqdori).

Jami summa — har bir mahsulot narxini miqdoriga ko'paytirib, hammasini qo'shib chiqishdir.
Buning uchun \`.reduce()\` metodi juda qo'l keladi:
\`\`\`javascript
const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
\`\`\``,
            instructions: `### 🎯 Amaliy Topshiriq:
\`calculateTotal(items)\` funksiyasi savatchadagi barcha tovarlarning umumiy summasini son ko'rinishida qaytarsin. Agar ro'yxat bo'sh bo'lsa, \`0\` qaytsin.`,
            checker: {
              tests: [
                {
                  name: "Ikki buyum",
                  fn: "calculateTotal",
                  args: [[{ price: 10, qty: 2 }, { price: 5, qty: 1 }]],
                  expect: 25,
                  hint: "price * qty ni qo'shing (10*2 + 5*1 = 25).",
                },
                { name: "Bo'sh savatcha", fn: "calculateTotal", args: [[]], expect: 0, hint: "Bo'sh massivda 0 qaytaring." },
              ],
            },
          },
        ],
      },
      {
        title: "API javoblari",
        summary: "Status kodi va JSON shakli.",
        sort_order: 2,
        tasks: [
          {
            title: "Foydalanuvchi yaratish",
            language: "javascript",
            points: 10,
            sort_order: 1,
            starter_code: "function createUser(body) {\n  \n}\n",
            solution_code:
              "function createUser(body) {\n  if (!body || !body.name || !body.email) {\n    return { status: 400, error: 'name va email shart' };\n  }\n  if (!String(body.email).includes('@')) {\n    return { status: 400, error: 'email noto\\'g\\'ri' };\n  }\n  return { status: 201, user: { name: body.name, email: body.email } };\n}\n",
            theory: `### 📖 3. REST API: HTTP Status Kodlari va JSON

Frontend serverdan ma'lumot so'raganda yoki yangi yozuv yuborganda, backend javob (Response) qaytaradi.

#### Asosiy HTTP Status Kodlari:
- \`201 Created\` — yangi ma'lumot muvaffaqiyatli yaratildi.
- \`400 Bad Request\` — mijoz yuborgan so'rovda xatolik bor (masalan, kerakli maydon to'ldirilmagan).

Javob odatda status va tegishli ma'lumotdan iborat JSON obyekt bo'ladi:
\`\`\`javascript
{ status: 201, user: { name: "Ali", email: "ali@gmail.com" } }
\`\`\``,
            instructions: `### 🎯 Amaliy Topshiriq:
\`createUser(body)\` funksiyasini yozing:
- Agar \`name\` yoki \`email\` bo'sh bo'lsa: \`{ status: 400, error: "name va email shart" }\` qaytarsin.
- Agar \`email\` ichida \`@\` bo'lmasa: \`{ status: 400, error: "email noto'g'ri" }\` qaytarsin.
- Hammasi to'g'ri bo'lsa: \`{ status: 201, user: { name: body.name, email: body.email } }\` qaytarsin.`,
            checker: {
              tests: [
                {
                  name: "Bo'sh maydon",
                  fn: "createUser",
                  args: [{}],
                  expect: { status: 400, error: "name va email shart" },
                  hint: "name va email borligini tekshiring.",
                },
                {
                  name: "@ belgisi yo'q",
                  fn: "createUser",
                  args: [{ name: "Ali", email: "ali" }],
                  expect: { status: 400, error: "email noto'g'ri" },
                  hint: "email ichida @ bo'lmasa xato.",
                },
                {
                  name: "Muvaffaqiyatli yaratish",
                  fn: "createUser",
                  args: [{ name: "Ali", email: "ali@thmind.uz" }],
                  expect: { status: 201, user: { name: "Ali", email: "ali@thmind.uz" } },
                  hint: "status: 201 va user qaytaring.",
                },
              ],
            },
          },
          {
            title: "Kirish javobi",
            language: "javascript",
            points: 10,
            sort_order: 2,
            starter_code: "function login(body) {\n  \n}\n",
            solution_code:
              "function login(body) {\n  if (!body || !body.email || !body.password) {\n    return { status: 400, error: 'email va parol shart' };\n  }\n  if (String(body.password).length < 6) {\n    return { status: 400, error: 'parol kamida 6 ta belgi' };\n  }\n  return { status: 200, token: 'ok' };\n}\n",
            theory: `### 📖 4. Kirish (Autentifikatsiya) Mantig'i

Tizimga kirish (Login) jarayonida server email va parolni tekshiradi:
1. Maydonlar to'ldirilganmi?
2. Xavfsizlik talablariga mosmi (masalan, parol kamida 6 ta belgidan iboratmi)?
3. Hammasi to'g'ri bo'lsa, \`200 OK\` status va sessiya tokeni beriladi.`,
            instructions: `### 🎯 Amaliy Topshiriq:
\`login(body)\` funksiyasini yozing:
- \`email\` yoki \`password\` yo'q bo'lsa: \`{ status: 400, error: "email va parol shart" }\`
- Parol 6 tadan kam bo'lsa: \`{ status: 400, error: "parol kamida 6 ta belgi" }\`
- Hammasi to'g'ri bo'lsa: \`{ status: 200, token: "ok" }\``,
            checker: {
              tests: [
                {
                  name: "Bo'sh maydon",
                  fn: "login",
                  args: [{}],
                  expect: { status: 400, error: "email va parol shart" },
                  hint: "Ikkala maydon mavjudligini tekshiring.",
                },
                {
                  name: "Qisqa parol",
                  fn: "login",
                  args: [{ email: "a@b.c", password: "123" }],
                  expect: { status: 400, error: "parol kamida 6 ta belgi" },
                  hint: "password.length < 6 bo'lsa xato.",
                },
                {
                  name: "To'g'ri kirish",
                  fn: "login",
                  args: [{ email: "a@b.c", password: "123456" }],
                  expect: { status: 200, token: "ok" },
                  hint: "status 200 va token qaytaring.",
                },
              ],
            },
          },
          {
            title: "Topilmadi javobi",
            language: "javascript",
            points: 10,
            sort_order: 3,
            starter_code: "function notFound(path) {\n  \n}\n",
            solution_code:
              "function notFound(path) {\n  return { status: 404, error: 'Topilmadi', path };\n}\n",
            theory: `### 📖 5. 404 Not Found Xatoligi

Serverda mavjud bo'lmagan manzil so'ralganda, server \`404 Not Found\` xatosini qaytarishi lozim. Mijoz qaysi yo'lni qidirib adashganini bilishi uchun so'ralgan yo'l (\`path\`) ham javobda qaytariladi.`,
            instructions: `### 🎯 Amaliy Topshiriq:
\`notFound(path)\` funksiyasi quyidagi obyektni qaytarsin:
\`{ status: 404, error: "Topilmadi", path: path }\``,
            checker: {
              tests: [
                {
                  name: "/noma'lum yo'l",
                  fn: "notFound",
                  args: ["/yoq"],
                  expect: { status: 404, error: "Topilmadi", path: "/yoq" },
                  hint: "status, error va path qaytaring.",
                },
              ],
            },
          },
        ],
      },
      {
        title: "Ma'lumotlar ustida ishlash",
        summary: "Qidirish va filtrlash.",
        sort_order: 3,
        tasks: [
          {
            title: "Id bo'yicha topish",
            language: "javascript",
            points: 10,
            sort_order: 1,
            starter_code: "function findById(users, id) {\n  \n}\n",
            solution_code:
              "function findById(users, id) {\n  return users.find((user) => user.id === id) || null;\n}\n",
            theory: `### 📖 6. Ma'lumotlarni ID bo'yicha Qidirish

Backend bazadagi yuzlab yozuvlar orasidan bitta foydalanuvchini uning unikal \`id\` raqami bo'yicha topishi kerak.
Buning uchun \`.find()\` metodi ishlatiladi. Agar element topilmasa, \`.find()\` metodi \`undefined\` beradi. Biz uni xavfsiz \`null\` ga o'giramiz:
\`\`\`javascript
const user = users.find(u => u.id === id) || null;
\`\`\``,
            instructions: `### 🎯 Amaliy Topshiriq:
\`findById(users, id)\` funksiyasi berilgan \`id\` ga teng foydalanuvchini topsin. Topilmasa \`null\` qaytarsin.`,
            checker: {
              tests: [
                {
                  name: "Mavjud ID",
                  fn: "findById",
                  args: [[{ id: 1, name: "Ali" }, { id: 2, name: "Vali" }], 2],
                  expect: { id: 2, name: "Vali" },
                  hint: "user.id === id tekshiring.",
                },
                {
                  name: "Mavjud bo'lmagan ID",
                  fn: "findById",
                  args: [[{ id: 1, name: "Ali" }], 99],
                  expect: null,
                  hint: "Topilmasa null qaytaring.",
                },
              ],
            },
          },
          {
            title: "Faol foydalanuvchilar",
            language: "javascript",
            points: 10,
            sort_order: 2,
            starter_code: "function filterActive(users) {\n  \n}\n",
            solution_code:
              "function filterActive(users) {\n  return users.filter((user) => user.status === 'active');\n}\n",
            theory: `### 📖 7. Ma'lumotlarni Filtrlash (Filtering)

Foydalanuvchilar ro'yxatidan faqat faol (statusi "active") bo'lganlarini tanlab olish backendda juda ko'p qo'llaniladi:
\`\`\`javascript
const activeUsers = users.filter(user => user.status === "active");
\`\`\``,
            instructions: `### 🎯 Amaliy Topshiriq:
\`filterActive(users)\` funksiyasi faqat \`status === 'active'\` bo'lgan foydalanuvchilar massivini qaytarsin. Hech kim mos kelmasa \`[]\` qaytsin.`,
            checker: {
              tests: [
                {
                  name: "Aralash holatlar",
                  fn: "filterActive",
                  args: [[
                    { id: 1, status: "active" },
                    { id: 2, status: "off" },
                    { id: 3, status: "active" },
                  ]],
                  expect: [
                    { id: 1, status: "active" },
                    { id: 3, status: "active" },
                  ],
                  hint: "user.status === 'active' shartini bering.",
                },
                {
                  name: "Faol yo'q",
                  fn: "filterActive",
                  args: [[{ id: 1, status: "off" }]],
                  expect: [],
                  hint: "Mos kelmasa bo'sh massiv [] qaytaring.",
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
