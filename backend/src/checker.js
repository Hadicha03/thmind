import vm from "node:vm";
import { load } from "cheerio";

function pack(tests) {
  const passed = tests.length > 0 && tests.every((test) => test.passed);
  const failed = tests.filter((test) => !test.passed);
  let explanation;
  if (passed) {
    explanation =
      "Ajoyib! Barcha tekshiruvlar muvaffaqiyatli o'tdi. Sintaksis va mantiq to'g'ri yozilgan — keyingisiga o'tishingiz mumkin.";
  } else if (failed.length === tests.length) {
    explanation =
      "Hali tekshiruvlar o'tmadi. Pastdagi izohni o'qing: u qayerda kamchilik borligini va qanday to'g'rilash kerakligini aytadi.";
  } else {
    explanation = `${tests.length - failed.length} ta tekshiruv o'tdi, ${failed.length} tasi qoldi. Qolgan joy odatda kichik mantiqiy nuqson bo'ladi.`;
  }
  if (!passed) {
    explanation += `\n\n${failed.map((test) => `• ${test.message}`).join("\n")}`;
  }
  return { passed, tests, explanation };
}

function show(value) {
  if (typeof value === "undefined") return "undefined";
  try {
    const text = JSON.stringify(value);
    return text.length > 280 ? `${text.slice(0, 280)}…` : text;
  } catch {
    return String(value);
  }
}

function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortValue(value[key]);
        return acc;
      }, {});
  }
  return value;
}

function deepEqual(actual, expected) {
  if (typeof actual === "number" && typeof expected === "number" && Number.isNaN(actual) && Number.isNaN(expected)) {
    return true;
  }
  // If expected is a string, allow flexible trimmed comparison
  if (typeof actual === "string" && typeof expected === "string") {
    return actual.trim().toLowerCase() === expected.trim().toLowerCase();
  }
  return JSON.stringify(sortValue(actual)) === JSON.stringify(sortValue(expected));
}

function checkJs(code, spec) {
  const tests = Array.isArray(spec?.tests) ? spec.tests : [];
  if (!tests.length) {
    return pack([{ name: "Tekshiruv", passed: false, message: "Bu vazifa uchun testlar sozlanmagan." }]);
  }
  const bans = [
    { re: /\brequire\s*\(/, message: "require() ishlatib bo'lmaydi. Faqat oddiy JavaScript funksiyasi yozing." },
    { re: /\bprocess\b/, message: "process obyektiga ruxsat yo'q. Vazifa sof funksiya bilan yechiladi." },
    { re: /\bimport\s*\(|^\s*import\s/m, message: "import ga ruxsat yo'q. Funksiyani shu faylning o'zida yozing." },
    { re: /\beval\s*\(|\bFunction\s*\(/, message: "eval va Function konstruktori yopiq. Oddiy funksiya yozing." },
    { re: /\b(child_process|fs|net|http|https)\b|node:/, message: "Fayl tizimi va tarmoqqa ruxsat yo'q. Hisoblashni funksiya ichida qiling." },
  ];
  for (const ban of bans) {
    if (ban.re.test(code)) {
      return pack([{ name: "Xavfsizlik", passed: false, message: ban.message }]);
    }
  }

  const names = [...new Set(tests.map((test) => test.fn))];
  for (const name of names) {
    if (!/^[A-Za-z_$][\w$]*$/.test(name)) {
      return pack([{ name: "Tekshiruv", passed: false, message: "Test funksiya nomi noto'g'ri sozlangan." }]);
    }
  }

  const sandbox = {
    console: { log() {}, error() {}, warn() {}, info() {} },
  };
  vm.createContext(sandbox);
  const exportLines = names
    .map((name) => `__box[${JSON.stringify(name)}] = typeof ${name} === "function" ? ${name} : undefined;`)
    .join("\n");
  const wrapped = `${code}\nvar __box = {};\n${exportLines}`;

  try {
    vm.runInContext(wrapped, sandbox, { timeout: 1000 });
  } catch (error) {
    const timedOut = /timed out|Script execution/i.test(error.message || "");
    const message = timedOut
      ? "Kod belgilangan vaqtda tugamadi. Ehtimol, cheksiz tsikl bor. Shartni va hisoblagichni qayta tekshiring."
      : `Kod ishga tushmadi: ${error.message}. Qavslar, nuqta-vergul va funksiya nomini tekshiring.`;
    return pack([{ name: "Ishga tushirish", passed: false, message }]);
  }

  const box = sandbox.__box || {};
  const results = tests.map((test) => {
    const fn = box[test.fn];
    const argsText = (test.args || []).map(show).join(", ");
    if (typeof fn !== "function") {
      return {
        name: test.name,
        passed: false,
        expected: test.expect,
        actual: null,
        message: `\`${test.fn}\` nomli funksiya topilmadi. Uni shunday e'lon qiling: function ${test.fn}(...) { ... }. ${test.hint || ""}`.trim(),
      };
    }
    try {
      const actual = fn(...(test.args || []));
      if (actual && typeof actual.then === "function") {
        return {
          name: test.name,
          passed: false,
          expected: test.expect,
          actual: "Promise",
          message: `${test.fn} darhol qiymat qaytarishi kerak. async yoki Promise ishlatmang.`,
        };
      }

      // Flexible matching for greet or custom checks
      let ok = false;
      if (test.fn === "greet" && typeof actual === "string") {
        const nameArg = String(test.args?.[0] || "").toLowerCase();
        const actLower = actual.toLowerCase();
        // As long as greeting contains the name and some greeting word, pass!
        ok = actLower.includes(nameArg) && (actLower.includes("salom") || actLower.includes("hello"));
      } else {
        ok = deepEqual(actual, test.expect);
      }

      return {
        name: test.name,
        passed: ok,
        expected: test.expect,
        actual,
        message: ok
          ? `${test.name} to'g'ri bajarildi.`
          : `${test.fn}(${argsText}) chaqirilganda kutilgan natija chiqmadi. ${test.hint || ""}`.trim(),
      };
    } catch (error) {
      return {
        name: test.name,
        passed: false,
        expected: test.expect,
        actual: null,
        message: `${test.fn}(${argsText}) ishlaganda xato berdi: ${error.message}. ${test.hint || ""}`.trim(),
      };
    }
  });
  return pack(results);
}

function checkHtml(code, spec) {
  if (/<script\b/i.test(code)) {
    return pack([
      {
        name: "HTML",
        passed: false,
        message: "Bu vazifada <script> kerak emas. Faqat sahifa tuzilmasini yozing: teglar, matn, havola yoki forma.",
      },
    ]);
  }
  const $ = load(code);
  const checks = Array.isArray(spec?.checks) ? spec.checks : [];
  const results = checks.map((check) => {
    const els = $(check.select);
    const hint = check.hint ? ` ${check.hint}` : "";
    if (els.length < (check.min ?? 1)) {
      return {
        name: check.name,
        passed: false,
        message: `${check.name}: \`${check.select}\` tegi topilmadi yoki yetarli emas (hozir ${els.length} ta).${hint}`,
      };
    }

    // Flexible text requirement: Tag should simply have some content (not empty), user can write ANY text!
    const voidTags = ["input", "img", "br", "hr", "meta", "link"];
    const isVoid = els.toArray().some((el) => voidTags.includes(el.name?.toLowerCase()));
    const text = els.text().replace(/\s+/g, " ").trim();
    if (!isVoid && check.requireText !== false && !els.children().length && text.length === 0) {
      return {
        name: check.name,
        passed: false,
        message: `${check.name}: \`${check.select}\` tegi ichiga biror matn yozing (istalgan so'z bo'lishi mumkin).${hint}`,
      };
    }

    // Attribute check
    if (check.attr) {
      const { name, equals, startsWith, includes } = check.attr;
      const ok = els.toArray().some((el) => {
        const value = $(el).attr(name) || "";
        if (equals != null) return value === equals;
        if (startsWith) return value.startsWith(startsWith);
        if (includes) return value.includes(includes);
        return value.length > 0;
      });
      if (!ok) {
        return {
          name: check.name,
          passed: false,
          message: `${check.name}: ${name} atributi talabga mos emas.${hint}`,
        };
      }
    }
    return { name: check.name, passed: true, message: `${check.name} tegi to'g'ri yozilgan.` };
  });
  return pack(results);
}

function extractBlocks(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks = [];
  const re = /([^{}@]+)\{([^{}]*)\}/g;
  let match;
  while ((match = re.exec(clean))) {
    const selector = match[1].trim();
    if (!selector || selector.startsWith("@")) continue;
    blocks.push({ selector, body: match[2] });
  }
  return blocks;
}

function propsOf(body) {
  const map = new Map();
  for (const part of body.split(";")) {
    const idx = part.indexOf(":");
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim().toLowerCase();
    const value = part.slice(idx + 1).trim().toLowerCase();
    if (name && value) map.set(name, value);
  }
  return map;
}

function findBlock(blocks, selector) {
  const want = selector.replace(/\s+/g, "").toLowerCase();
  return blocks.find((block) =>
    block.selector.split(",").some((item) => item.replace(/\s+/g, "").toLowerCase() === want),
  );
}

function hasProp(map, prop) {
  for (const name of prop.names) {
    const value = map.get(name);
    if (!value) continue;
    if (prop.includes && !value.replace(/\s+/g, "").includes(String(prop.includes).replace(/\s+/g, "").toLowerCase())) {
      continue;
    }
    return true;
  }
  return false;
}

function checkCss(code, spec) {
  if (/expression\s*\(|javascript:|@import|url\s*\(\s*['"]?\s*https?:/i.test(code)) {
    return pack([
      {
        name: "CSS",
        passed: false,
        message: "Tashqi manzil, @import yoki xavfli ifoda ishlatmang. Stillarni shu faylda yozing.",
      },
    ]);
  }
  const blocks = extractBlocks(code);
  const checks = Array.isArray(spec?.checks) ? spec.checks : [];
  const results = checks.map((check) => {
    const hint = check.hint ? ` ${check.hint}` : "";
    const block = findBlock(blocks, check.selector);
    if (!block) {
      return {
        name: check.name,
        passed: false,
        message: `${check.name}: \`${check.selector}\` selektori topilmadi. Qoidani shu nom bilan yozing.${hint}`,
      };
    }
    const map = propsOf(block.body);
    const props = check.properties || [];
    const matched = props.filter((prop) => hasProp(map, prop));
    const ok = check.any ? matched.length > 0 : matched.length === props.length;
    if (!ok) {
      const missing = (check.any ? props : props.filter((prop) => !hasProp(map, prop)))
        .map((prop) => prop.label || prop.names[0])
        .join(", ");
      return {
        name: check.name,
        passed: false,
        message: `${check.name}: \`${check.selector}\` ichida quyidagilar yetishmayapti yoki qiymati mos emas: ${missing}.${hint}`,
      };
    }
    return { name: check.name, passed: true, message: `${check.name} qoidasi to'g'ri yozilgan.` };
  });
  return pack(results);
}

function checkQuiz(code, spec) {
  const questions = Array.isArray(spec?.questions) ? spec.questions : [];
  if (!questions.length) {
    return pack([{ name: "Test", passed: false, message: "Bu mavzu uchun test savollari sozlanmagan." }]);
  }
  let answers;
  try {
    const parsed = JSON.parse(code);
    answers = Array.isArray(parsed) ? parsed : parsed?.answers;
  } catch {
    answers = null;
  }
  if (!Array.isArray(answers)) {
    return pack([{ name: "Test", passed: false, message: "Javoblar formati noto'g'ri. Savollarga javob belgilab, qaytadan yuboring." }]);
  }

  const results = questions.map((question, idx) => {
    const name = `${idx + 1}-savol`;
    const given = answers[idx];
    if (given === null || given === undefined || given === "") {
      return { name, passed: false, message: `${idx + 1}-savolga javob belgilanmagan.` };
    }
    const ok = Number(given) === Number(question.answer);
    return {
      name,
      passed: ok,
      message: ok
        ? "To'g'ri javob!"
        : `Noto'g'ri javob.${question.hint ? ` Maslahat: ${question.hint}` : " Darsni qayta o'qib chiqing."}`,
    };
  });

  const correct = results.filter((r) => r.passed).length;
  const percent = Math.round((correct / questions.length) * 100);
  const required = Number(spec.pass_percent) || 100;
  const passed = percent >= required;
  const failed = results.filter((r) => !r.passed);
  let explanation = passed
    ? `Ajoyib! ${questions.length} ta savoldan ${correct} tasiga to'g'ri javob berdingiz (${percent}%). Mavzu muvaffaqiyatli o'zlashtirildi!`
    : `${questions.length} ta savoldan ${correct} tasiga to'g'ri javob berdingiz (${percent}%). O'tish uchun kamida ${required}% kerak. Darsni qayta ko'rib chiqing va yana urinib ko'ring.`;
  if (failed.length) {
    explanation += `\n\n${failed.map((r) => `• ${r.name}: ${r.message}`).join("\n")}`;
  }
  return { passed, tests: results, explanation, score: { correct, total: questions.length, percent, required } };
}

export function runChecks(language, code, spec) {
  const source = String(code || "");
  if (source.trim().length < 2) {
    return pack([{ name: "Kod", passed: false, message: "Javob bo'sh. Avval kod yozing, so'ng tekshirish tugmasini bosing." }]);
  }
  if (source.length > 30000) {
    return pack([{ name: "Kod", passed: false, message: "Kod juda uzun. Vazifa uchun kerakli qismni qoldiring." }]);
  }
  try {
    if (language === "html") return checkHtml(source, spec);
    if (language === "css") return checkCss(source, spec);
    if (language === "quiz") return checkQuiz(source, spec);
    return checkJs(source, spec);
  } catch (error) {
    return pack([{ name: "Tekshiruv", passed: false, message: `Tekshiruv paytida kutilmagan xato: ${error.message}` }]);
  }
}

export function validateSpec(language, spec) {
  if (!spec || typeof spec !== "object") return "Tekshiruv JSON obyekt bo'lishi kerak.";
  if (language === "javascript") {
    if (!Array.isArray(spec.tests) || spec.tests.length === 0) return "JavaScript tekshiruvida tests ro'yxati bo'lishi kerak.";
    for (const test of spec.tests) {
      if (!test.fn || !test.name || !("expect" in test)) return "Har bir testda name, fn va expect bo'lishi kerak.";
    }
    return "";
  }
  if (language === "html" || language === "css") {
    if (!Array.isArray(spec.checks) || spec.checks.length === 0) return "checks ro'yxati bo'lishi kerak.";
    return "";
  }
  if (language === "quiz") {
    if (!Array.isArray(spec.questions) || spec.questions.length === 0) return "Testda questions ro'yxati bo'lishi kerak.";
    for (const item of spec.questions) {
      if (!item.q || !Array.isArray(item.options) || item.options.length < 2) {
        return "Har bir savolda q va kamida 2 ta options bo'lishi kerak.";
      }
      if (!Number.isInteger(item.answer) || item.answer < 0 || item.answer >= item.options.length) {
        return "Har bir savolda answer — to'g'ri variant indeksi (0 dan boshlab) bo'lishi kerak.";
      }
    }
    return "";
  }
  return "Til javascript, html, css yoki quiz bo'lishi kerak.";
}
