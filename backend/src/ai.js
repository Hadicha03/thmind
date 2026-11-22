import { db } from "./db.js";

/**
 * Intelligent Local AI Tutor reasoning engine in Uzbek
 */
function generateLocalAiAnalysis({ language, code, task, testResult, studentQuestion }) {
  const codeStr = String(code || "").trim();
  const passed = testResult?.passed;
  const tests = testResult?.tests || [];
  const failedTests = tests.filter((t) => !t.passed);

  // If student asked an open question
  if (studentQuestion) {
    const qLower = studentQuestion.toLowerCase();
    if (qLower.includes("maslahat") || qLower.includes("boshlash") || qLower.includes("yordam")) {
      return `Salom! Men TH Mind sun'iy intellekt ustozingizman.\n\n` +
        `Ushbu topshiriq mavzusi: **${task?.title}** (${language.toUpperCase()}).\n\n` +
        `📌 **Yo'riqnoma qisqacha:**\n${task?.instructions || "Topshiriq shartlarini diqqat bilan o'rganing."}\n\n` +
        `💡 **Boshlash uchun tavsiyam:**\n` +
        `- Kod muharriridagi boshlang'ich shablonni o'zgartiring.\n` +
        `- Shartda so'ralgan aynan shu nomli funksiya yoki tegni yozing.\n` +
        `- Tayyor bo'lgach "Tekshirish & AI Tahlil" tugmasini bosing, men darhol tahlil qilib beraman!`;
    }
  }

  // If all tests passed
  if (passed) {
    let proTip = "Kodingiz juda ozoda va standartlarga to'la mos.";
    if (language === "javascript") {
      proTip = "Pro maslahat: O'zgaruvchilarni e'lon qilishda har doim `const` va `let` ishlating, `var` dan qoching. Funksiyalarni qisqa va aniq saqlash yaxshi odat.";
    } else if (language === "html") {
      proTip = "Pro maslahat: Semantik teglardan (header, main, section, footer) foydalanish SEO va ekranni o'quvchi qurilmalar (accessibility) uchun juda muhim.";
    } else if (language === "css") {
      proTip = "Pro maslahat: Zamonaviy CSS da Flexbox va Grid tizimlarini yaxshi o'zlashtirish har qanday murakkab dizaynni oson yasash imkonini beradi.";
    }

    return `🎉 **Ajoyib natija! Barcha tekshiruvlar 100% muvaffaqiyatli o'tdi!**\n\n` +
      `✅ **Tahlil:**\n` +
      `- Siz topshiriq shartini to'g'ri tushundingiz va kerakli mantiqni to'g'ri ifodaladingiz.\n` +
      `- Barcha test holatlari kutilgan natijani qaytardi.\n\n` +
      `💡 **${proTip}**\n\n` +
      `Keyingi topshiriqqa bemalol o'tishingiz mumkin! Olg'a! 🚀`;
  }

  // If there are failures, analyze patterns deeply
  let mistakeType = "Mantiqiy yoki sintaktik kamchilik";
  let explanation = "";
  let suggestion = "";
  let sample = "";

  // Check empty code
  if (codeStr.length < 3) {
    return `⚠️ **Kod maydoni bo'sh!**\n\n` +
      `Siz hali kod yozmadingiz. Iltimos, topshiriq shartini o'qib, o'z yechimingizni yozing va so'ng tekshirish tugmasini bosing.`;
  }

  // JavaScript analysis
  if (language === "javascript") {
    const hasConsoleLog = /console\.log\s*\(/.test(codeStr);
    const hasReturn = /\breturn\b/.test(codeStr);
    const hasFunction = /function\b|\=\>/.test(codeStr);

    if (!hasFunction) {
      mistakeType = "Funksiya e'lon qilinmagan";
      explanation = "Topshiriqda funksiya yozilishi talab qilingan, ammo kodingizda funksiya topilmadi.";
      suggestion = "Funksiyani quyidagicha e'lon qiling: `function funksiyaNomi(...) { ... }`";
    } else if (hasConsoleLog && !hasReturn) {
      mistakeType = "`return` operatori esdan chiqqan";
      explanation = "Siz natijani `console.log()` orqali ekranga chiqargansiz, ammo funksiyadan qiymat `return` qilinmagan. Test tekshirgich funksiyaning qaytargan qiymatini kutyapti.";
      suggestion = "`console.log(...)` o'rniga `return ...` yozing. Masalan: `return a + b;`";
    } else if (failedTests.some((t) => t.message && t.message.includes("undefined"))) {
      mistakeType = "Funksiya undefined qaytaryapti";
      explanation = "Funksiya hech qanday qiymat qaytarmadi yoki `return` bo'sh qoldirilgan.";
      suggestion = "Funksiya oxirida kutilgan hisoblangan natijani `return natija;` orqali qaytarayotganingizga ishonch hosil qiling.";
    } else {
      const firstFail = failedTests[0];
      mistakeType = "Kutilgan natija bilan farq bor";
      explanation = firstFail?.message || "Kodingiz qaytargan javob test talabiga to'liq mos kelmadi.";
      if (firstFail?.expected !== undefined && firstFail?.actual !== undefined) {
        suggestion = `Kutilgan qiymat: \`${JSON.stringify(firstFail.expected)}\`, sizning kodingiz bergan qiymat: \`${JSON.stringify(firstFail.actual)}\`. Shartlar va hisoblash formulasini tekshiring.`;
      } else {
        suggestion = "Topshiriq shartidagi qoidalarni va argumentlar bilan ishlashni qayta ko'rib chiqing.";
      }
    }
  }

  // HTML analysis
  if (language === "html") {
    if (failedTests.some((t) => t.message && t.message.includes("topilmadi"))) {
      mistakeType = "Kerakli HTML tegi topilmadi";
      const failMsg = failedTests[0]?.message || "";
      explanation = `Brauzer kutilgan elementni topa olmadi: ${failMsg}`;
      suggestion = "Teglarning to'g'ri ochilgani va yopilganini tekshiring (masalan: `<h1>...</h1>`, `<p>...</p>`, `<ul>...</ul>`).";
    } else if (failedTests.some((t) => t.message && t.message.includes("matn ichida"))) {
      mistakeType = "Teg ichidagi matn mos emas";
      explanation = "Teg yozilgan, ammo uning ichidagi matn shartda ko'rsatilgan matnga to'g'ri kelmadi.";
      suggestion = "Harflar katta-kichikligi va probellarni shartdagi namunaga qarab aniq yozing.";
    } else {
      mistakeType = "HTML tuzilmasida nomuvofiqlik";
      explanation = failedTests[0]?.message || "HTML teglari yoki atributlari talabga to'liq mos kelmadi.";
      suggestion = "Atributlar to'g'ri yozilganini (masalan, `name=\"email\"`, `href=\"https://...\"`) tekshiring.";
    }
  }

  // CSS analysis
  if (language === "css") {
    if (failedTests.some((t) => t.message && t.message.includes("selektori topilmadi"))) {
      mistakeType = "CSS selektori topilmadi";
      explanation = failedTests[0]?.message || "Shartdagi klass yoki selektor nomi topilmadi.";
      suggestion = "Klass nomidan oldin nuqta qo'yishni unutmang (masalan, `.card { ... }` yoki `.btn { ... }`).";
    } else {
      mistakeType = "CSS xossalari yetishmayapti";
      explanation = failedTests[0]?.message || "Selektor ichida talab qilingan CSS xossalari yozilmagan.";
      suggestion = "Xossalar va qiymatlarni ikki nuqta va nuqta-vergul bilan ajratib yozing: `xossa: qiymat;`.";
    }
  }

  // Construct structured AI response
  let result = `🤖 **AI Ustoz Tahlili va Yo'llanmasi:**\n\n`;
  result += `❌ **1. Aniqlangan kamchilik:** ${mistakeType}\n`;
  result += `🔍 **2. Xato sababi:** ${explanation}\n`;
  result += `💡 **3. Qanday to'g'rilash kerak:** ${suggestion}\n\n`;

  if (failedTests.length > 0) {
    result += `📋 **O'tmagan aniq tekshiruvlar ro'yxati:**\n`;
    failedTests.forEach((t) => {
      result += `- ⚠️ ${t.message}\n`;
    });
  }

  result += `\n✨ *Qayta urinib ko'ring! Dasturlashda har bir xato — bu yangi bilim demakdir.*`;
  return result;
}

/**
 * Call real Google Gemini API if configured
 */
async function callGeminiApi({ apiKey, model, language, code, task, testResult, studentQuestion }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-1.5-flash"}:generateContent?key=${apiKey}`;

  const prompt = `
Siz "TH Mind" o'quv platformasining mehribon, tajribali va do'stona AI ustozisiz.
O'quvchi frontend yoki backend dasturlash bo'yicha topshiriq bajardi.

Mavzu: ${task?.title || "Dasturlash topshirig'i"}
Dasturlash tili: ${language}
Topshiriq yo'riqnomasi:
${task?.instructions || ""}

O'quvchi yozgan kod:
\`\`\`${language}
${code}
\`\`\`

Avtomatik test natijasi:
Barcha testlar o'tdimi: ${testResult?.passed ? "HA (Passed)" : "YO'Q (Failed)"}
Batafsil testlar:
${JSON.stringify(testResult?.tests || [], null, 2)}

O'quvchining savoli (agar bo'lsa): ${studentQuestion || "Yo'q, shunchaki kodimni tekshirib xatolarimni tushuntiring."}

Vazifangiz:
O'quvchiga o'zbek tilida aniq, tushunarli, dalda beruvchi uslubda tahlil berish:
1. Agar barcha testlar o'tgan bo'lsa: tabriklang, koddagi yaxshi jihatlarni ko'rsating va ilg'or dasturchilar odatidan bitta "Pro-maslahat" bering.
2. Agar testlar o'tmagan bo'lsa:
   - Qaysi qatorda yoki qaysi mantiqda xato ketganini o'zbekcha oddiy tilda tushuntiring.
   - Nega bu xato yuz berganini bildiring (masalan console.log va return farqi, yoki yopilmagan teglar, yoki to'g'ri taqqoslash).
   - O'quvchiga tayyor yechimni berib qo'ymasdan, qanday qilib o'zi to'g'rilay olishi uchun aniq qadam-baqadam yo'llanma bering.
   - Rag'batlantiring va dalda bering.
`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1200,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API xatoligi (${response.status}): ${errorText}`);
  }

  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini bo'sh javob qaytardi");
  }

  return text;
}

/**
 * Main AI Evaluation function
 */
export async function analyzeCodeWithAi({ language, code, task, testResult, studentQuestion }) {
  const settings = db.getFullSettings();
  const apiKey = settings?.gemini_api_key?.trim();
  const model = settings?.gemini_model || "gemini-1.5-flash";
  const useRealAi = Boolean(settings?.use_real_ai && apiKey);

  if (useRealAi) {
    try {
      const geminiResponse = await callGeminiApi({
        apiKey,
        model,
        language,
        code,
        task,
        testResult,
        studentQuestion,
      });
      return {
        source: "gemini",
        model,
        analysis: geminiResponse,
      };
    } catch (err) {
      console.warn("Gemini API chaqiruvida xatolik, lokal AI ustoziga o'tilmoqda:", err.message);
      // Fallback to local AI tutor smoothly
      const fallback = generateLocalAiAnalysis({
        language,
        code,
        task,
        testResult,
        studentQuestion,
      });
      return {
        source: "local_fallback",
        analysis: fallback,
        warning: `Gemini API vaqtincha javob bermadi (${err.message}), tahlil TH Mind lokal AI ustozi tomonidan bajarildi.`,
      };
    }
  }

  // Local AI Tutor Engine
  const localAnalysis = generateLocalAiAnalysis({
    language,
    code,
    task,
    testResult,
    studentQuestion,
  });

  return {
    source: "local_tutor",
    analysis: localAnalysis,
  };
}
