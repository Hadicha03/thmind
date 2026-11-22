import { catalog } from "./seed.js";
import { runChecks } from "./checker.js";

console.log("🔍 TH Mind vazifalarini o'z yechimlari bilan avtotekshiruv boshlanmoqda...\n");

let total = 0;
let passed = 0;
let failed = 0;

for (const track of catalog) {
  console.log(`=== Yo'nalish: ${track.title} (${track.slug}) ===`);
  for (const mod of track.modules || []) {
    console.log(`  📂 Modul: ${mod.title}`);
    for (const task of mod.tasks || []) {
      total++;
      const result = runChecks(task.language, task.solution_code, task.checker);
      if (result.passed) {
        passed++;
        console.log(`    ✅ [${task.language}] ${task.title} - O'TDI`);
      } else {
        failed++;
        console.error(`    ❌ [${task.language}] ${task.title} - XATO:`);
        for (const t of result.tests) {
          if (!t.passed) {
            console.error(`       - ${t.name}: ${t.message}`);
          }
        }
      }
    }
  }
  console.log("");
}

console.log("-----------------------------------------");
console.log(`Jami vazifalar: ${total}`);
console.log(`Muvaffaqiyatli: ${passed}`);
console.log(`Xatolar:        ${failed}`);
console.log("-----------------------------------------");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 Barcha vazifalar va testlar 100% to'g'ri sozlangan!\n");
  process.exit(0);
}
