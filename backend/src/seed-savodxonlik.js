// Kompyuter savodxonligi kursi: har bir mavzu = dars (theory) + test savollari (quiz).

function lesson({ title, theory, practice, questions, points = 10 }) {
  const theoryText = practice ? `${theory}\n\n#### 🛠 Amaliy mashq (kompyuteringizda bajaring)\n${practice}` : theory;
  return {
    title,
    language: "quiz",
    points,
    starter_code: "",
    solution_code: JSON.stringify({ answers: questions.map((q) => q.answer) }),
    theory: theoryText,
    instructions: `### 📝 Bilimni tekshirish: ${title}

Darsni diqqat bilan o'qib chiqqaningizdan so'ng o'ng tomondagi **${questions.length} ta test savoliga** javob bering.
- Har bir savolda faqat **bitta to'g'ri javob** bor.
- Mavzudan o'tish uchun kamida **80%** savolga to'g'ri javob berish kerak.
- Xato qilsangiz — maslahatni o'qing va qaytadan urinib ko'ring.`,
    checker: { pass_percent: 80, questions },
  };
}

const q = (question, options, answer, hint) => ({ q: question, options, answer, hint });

export const savodxonlikTrack = {
  slug: "savodxonlik",
  title: "Kompyuter savodxonligi",
  summary: "Kompyuter, Windows, Word, Excel, Internet va PowerPoint — noldan amaliy ko'nikmagacha.",
  description:
    "2 oylik kurs: kompyuter qismlari va Windows'dan boshlab Word, Excel, internet, elektron pochta va onlayn xavfsizlikkacha. Har bir mavzuda avval dars o'tiladi, so'ng test orqali bilim tekshiriladi.",
  track: "savodxonlik",
  level: "Boshlang'ich",
  sort_order: 3,
  modules: [
    {
      title: "1-oy: Kompyuter asoslari va Word",
      summary: "Kompyuter qismlari, Windows, fayllar, klaviatura, dasturlar va Microsoft Word.",
      sort_order: 1,
      tasks: [
        lesson({
          title: "Kompyuter nima? Uning qismlari va turlari",
          theory: `### 💻 1-Mavzu: Kompyuter nima? Uning qismlari va turlari

**Kompyuter** — ma'lumotlarni qabul qiladigan, saqlaydigan, qayta ishlaydigan va natijani chiqarib beradigan elektron qurilma. U hisoblash, yozish, rasm chizish, internetdan foydalanish, o'yin va boshqa ko'plab ishlar uchun ishlatiladi.

#### Kompyuterning asosiy qismlari
- **Monitor** — ma'lumotni ekranga chiqaruvchi qurilma (chiqarish qurilmasi). Matn, rasm va videolarni ko'rsatadi.
- **Sistemali blok** — kompyuterning "miyasi" joylashgan quti. Ichida protsessor, operativ xotira (RAM), qattiq disk, ona plata va quvvat bloki bor.
- **Klaviatura** — harf, raqam va buyruqlarni kiritish qurilmasi (kiritish qurilmasi).
- **Sichqoncha** — ekrandagi kursorni boshqarish va obyektlarni tanlash uchun kiritish qurilmasi.

#### Sistemali blok ichida nimalar bor?
- **Protsessor (CPU)** — barcha hisob-kitoblarni bajaradi.
- **Operativ xotira (RAM)** — hozir ishlayotgan dasturlarni vaqtincha saqlaydi. Kompyuter o'chsa, undagi ma'lumot o'chadi.
- **Qattiq disk (HDD / SSD)** — fayllarni doimiy saqlaydi.
- **Ona plata** — barcha qismlarni bir-biriga ulaydi.

#### Kompyuter turlari
- **Desktop (stol kompyuteri)** — monitor, sistemali blok, klaviatura va sichqoncha alohida bo'ladi. Kuchli, qismlarini almashtirish oson, lekin bir joyda turadi va elektr tarmog'iga ulangan holda ishlaydi.
- **Noutbuk (laptop)** — barcha qismlar bitta ixcham korpusda: ekran, klaviatura, sensor panel (touchpad) va batareya. Ko'chirib yurish qulay, batareyada ishlaydi.
- **Planshet va smartfon** — sensorli ekranli kichik kompyuterlar.
- **Monoblok** — sistemali blok monitor ichiga joylashtirilgan kompyuter.

> **Eslab qoling:** Kiritish qurilmalari — klaviatura, sichqoncha, mikrofon, skaner. Chiqarish qurilmalari — monitor, printer, karnay (kolonka).`,
          practice: `- Kompyuteringizning qismlarini ko'rsatib, har birining nomini ayting.
- Kiritish va chiqarish qurilmalarini 2 ta ro'yxatga ajratib yozing.`,
          questions: [
            q("Kompyuterda ma'lumotni ekranga chiqaruvchi qurilma qaysi?", ["Klaviatura", "Monitor", "Sichqoncha", "Skaner"], 1, "Ekran — bu chiqarish qurilmasi."),
            q("Protsessor, operativ xotira va qattiq disk qayerda joylashgan?", ["Monitorda", "Klaviaturada", "Sistemali blokda", "Sichqonchada"], 2, "Kompyuterning \"miyasi\" joylashgan qutini eslang."),
            q("Quyidagilardan qaysi biri kiritish qurilmasi?", ["Printer", "Monitor", "Karnay", "Klaviatura"], 3, "Kiritish qurilmasi orqali kompyuterga ma'lumot beramiz."),
            q("Noutbukning desktopdan asosiy farqi nimada?", ["Barcha qismlari bitta ixcham korpusda va batareyada ishlay oladi", "Noutbukda monitor bo'lmaydi", "Noutbukda protsessor bo'lmaydi", "Noutbuk faqat internetda ishlaydi"], 0, "Noutbukni ko'tarib yurish mumkinligini eslang."),
            q("Kompyuter o'chganda qaysi xotiradagi ma'lumot o'chib ketadi?", ["Qattiq disk (HDD)", "SSD disk", "Operativ xotira (RAM)", "Fleshka"], 2, "Vaqtincha xotira qaysi ekanini eslang."),
          ],
        }),
        lesson({
          title: "Kompyuterning ishlash prinsipi. Dastur va qurilma farqi",
          theory: `### ⚙️ 2-Mavzu: Kompyuterning ishlash prinsipi. Hardware va Software

#### Kompyuter qanday ishlaydi?
Kompyuter ishi 4 bosqichdan iborat:
- **Kiritish (Input)** — klaviatura, sichqoncha orqali ma'lumot beriladi.
- **Qayta ishlash (Processing)** — protsessor ma'lumotni hisoblaydi va qayta ishlaydi.
- **Saqlash (Storage)** — natija xotira yoki diskda saqlanadi.
- **Chiqarish (Output)** — natija monitor, printer yoki karnay orqali chiqariladi.

> Misol: Klaviaturada "Salom" yozasiz (kiritish) → protsessor harflarni qayta ishlaydi → ekranda "Salom" paydo bo'ladi (chiqarish) → faylni saqlaysiz (saqlash).

#### Hardware (qattiq qurilmalar)
**Hardware** — kompyuterning qo'l bilan ushlab ko'rish mumkin bo'lgan **jismoniy qismlari**: monitor, klaviatura, sichqoncha, protsessor, RAM, qattiq disk, printer, fleshka.

#### Software (dasturiy ta'minot)
**Software** — kompyuterga nima qilish kerakligini aytuvchi **dasturlar va buyruqlar to'plami**. Uni ushlab bo'lmaydi.
- **Tizim dasturlari** — operatsion tizim (Windows, macOS, Linux), drayverlar.
- **Amaliy dasturlar** — Word, Excel, Google Chrome, Telegram, o'yinlar.

#### Hardware va Software birga ishlaydi
Qurilma dasturisiz ishlamaydi, dastur esa qurilmasiz ishga tushmaydi. Masalan, printer (hardware) chop etishi uchun drayver va Word (software) kerak.`,
          practice: `- Atrofingizdagi 5 ta hardware va kompyuteringizdagi 5 ta software nomini yozing.`,
          questions: [
            q("Hardware nima?", ["Kompyuter dasturlari", "Kompyuterning jismoniy (ushlab ko'rish mumkin bo'lgan) qismlari", "Internet saytlari", "Kompyuter viruslari"], 1, "\"Hard\" — qattiq degani."),
            q("Quyidagilardan qaysi biri software (dasturiy ta'minot)?", ["Monitor", "Klaviatura", "Microsoft Word", "Printer"], 2, "Software — ushlab bo'lmaydigan dastur."),
            q("Ma'lumotlarni qayta ishlash (hisoblash) qaysi qism bajaradi?", ["Protsessor (CPU)", "Monitor", "Sichqoncha", "Karnay"], 0, "Kompyuterning \"miyasi\" kim?"),
            q("Kompyuter ishining to'g'ri ketma-ketligi qaysi?", ["Chiqarish → Kiritish → Saqlash", "Saqlash → Chiqarish → Kiritish", "Qayta ishlash → Kiritish → Chiqarish", "Kiritish → Qayta ishlash → Chiqarish"], 3, "Avval ma'lumot beriladi, keyin hisoblanadi, so'ng natija chiqadi."),
            q("Windows qanday dastur turiga kiradi?", ["Amaliy dastur", "Tizim dasturi (operatsion tizim)", "Hardware", "O'yin dasturi"], 1, "Windows kompyuterni boshqaruvchi asosiy dastur."),
          ],
        }),
        lesson({
          title: "Operatsion tizim nima? Windows asosida tushuncha",
          theory: `### 🪟 3-Mavzu: Operatsion tizim nima? Windows

**Operatsion tizim (OT)** — kompyuter yoqilganda birinchi bo'lib ishga tushadigan va qurilmalar, dasturlar hamda foydalanuvchi o'rtasidagi aloqani boshqaradigan asosiy dastur.
Mashhur OTlar: **Windows**, **macOS**, **Linux**, telefonlarda **Android** va **iOS**.

#### Windows'ning asosiy elementlari
- **Ish stoli (Desktop)** — kompyuter yoqilgandan keyin ko'rinadigan asosiy ekran. Unda yorliqlar (ikonkalar) va fon rasmi bo'ladi.
- **Yorliq (ikonka)** — dastur, fayl yoki papkani tez ochish uchun kichik rasm. Ustiga ikki marta bosib ochiladi.
- **Vazifalar paneli (Taskbar)** — ekranning pastki qismidagi chiziq. Unda Start tugmasi, ochiq dasturlar, soat, til, ovoz va internet belgilari turadi.
- **Start menyu** — Windows belgisi tugmasi. Bu yerdan barcha dasturlar, sozlamalar (Settings) va kompyuterni o'chirish (Power) tugmasi ochiladi.
- **Oyna (Window)** — har bir ochilgan dastur oynada ishlaydi. Oynaning yuqori o'ng burchagida 3 tugma bor: **—** (yig'ish), **☐** (kattalashtirish), **✕** (yopish).

#### Kompyuterni to'g'ri o'chirish
Start → Power (O'chirish) → **Shut down**. Kompyuterni tokdan sug'urib o'chirish xavfli — fayllar buzilishi mumkin.
- **Restart** — qayta yuklash.
- **Sleep** — uyqu rejimi (tez qayta uyg'onadi).`,
          practice: `- Start menyuni oching va Kalkulyator dasturini toping.
- Ochilgan oynani yig'ing, kattalashtiring va yoping.`,
          questions: [
            q("Operatsion tizim nima?", ["Matn yozish dasturi", "Kompyuterni va dasturlarni boshqaruvchi asosiy dastur", "Internet brauzeri", "Antivirus"], 1, "Kompyuter yoqilganda birinchi ishga tushadigan dastur."),
            q("Ekranning pastki qismidagi Start tugmasi, soat va ochiq dasturlar turgan chiziq nima deyiladi?", ["Ish stoli", "Oyna", "Vazifalar paneli (Taskbar)", "Papka"], 2, "Ingliz tilida \"Taskbar\"."),
            q("Kompyuterni to'g'ri o'chirish usuli qaysi?", ["Tokdan sug'urish", "Monitorni o'chirish", "Start → Power → Shut down", "Klaviaturani uzish"], 2, "Start menyudagi Power tugmasini eslang."),
            q("Oynaning yuqori o'ng burchagidagi ✕ tugmasi nima qiladi?", ["Oynani yopadi", "Oynani kattalashtiradi", "Oynani yig'adi", "Yangi oyna ochadi"], 0, "✕ — yopish belgisi."),
            q("Quyidagilardan qaysi biri operatsion tizim EMAS?", ["Windows", "Linux", "macOS", "Microsoft Excel"], 3, "Excel — bu amaliy dastur."),
          ],
        }),
        lesson({
          title: "Fayl va papkalar bilan ishlash",
          theory: `### 📁 4-Mavzu: Fayl va papkalar bilan ishlash

- **Fayl** — kompyuterda saqlangan ma'lumot: hujjat, rasm, musiqa, video. Har bir fayl nomi va **kengaytmasi** bor: hisobot.docx (Word), rasm.jpg (rasm), qoshiq.mp3 (musiqa).
- **Papka (Folder)** — fayllarni tartib bilan saqlash uchun "quti". Papka ichida boshqa papka bo'lishi mumkin (**ichma-ich papkalar**).
- **Provodnik (File Explorer)** — fayl va papkalarni ko'rish dasturi. Tezkor ochish: **Win + E**.

#### Asosiy amallar
- **Yaratish:** Bo'sh joyda sichqonchaning o'ng tugmasi → **Создать / New** → **Folder (Papka)**.
- **Nomlash / Qayta nomlash:** Faylni tanlab **F2** bosing yoki o'ng tugma → **Rename (Переименовать)**.
- **Nusxalash:** **Ctrl + C**, keyin kerakli joyda **Ctrl + V**. Asl fayl joyida qoladi.
- **Ko'chirish:** **Ctrl + X** (kesish), keyin **Ctrl + V**. Fayl eski joydan yo'qoladi.
- **O'chirish:** **Delete** tugmasi — fayl **Korzina (Recycle Bin)** ga tushadi va undan qayta tiklash mumkin. **Shift + Delete** — butunlay o'chiradi.
- **Ichma-ich papka:** Papkani oching va uning ichida yana yangi papka yarating. Masalan: Hujjatlar → 2026 → Kurs.

#### Korzina (Recycle Bin)
O'chirilgan fayllar avval Korzinaga tushadi. Korzinani ochib, faylni tanlab **Restore (Восстановить)** bosilsa, fayl joyiga qaytadi.

> **Maslahat:** Fayllarga tushunarli nom bering va ularni mavzular bo'yicha papkalarga ajrating.`,
          practice: `- Ish stolida "Mening kursim" papkasini yarating, ichida "Word" va "Excel" papkalarini oching.
- Bitta faylni nusxalang, boshqasini ko'chiring, so'ng birini o'chirib Korzinadan tiklang.`,
          questions: [
            q("Faylni nusxalash uchun qaysi tugmalar ishlatiladi?", ["Ctrl + X", "Ctrl + C", "Ctrl + Z", "Ctrl + S"], 1, "C — Copy (nusxalash)."),
            q("Delete tugmasi bilan o'chirilgan fayl qayerga tushadi?", ["Butunlay yo'qoladi", "Fleshkaga", "Korzinaga (Recycle Bin)", "Ish stoliga"], 2, "Undan faylni tiklash mumkin."),
            q("Faylni qayta nomlash uchun qaysi tugma bosiladi?", ["F2", "F5", "Esc", "Tab"], 0, "Faylni tanlab shu funksional tugmani bosing."),
            q("Ko'chirish (Ctrl + X va Ctrl + V) nusxalashdan nimasi bilan farq qiladi?", ["Hech qanday farqi yo'q", "Fayl o'chib ketadi", "Fayl ikki marta ko'payadi", "Fayl eski joyidan yo'qolib, yangi joyga o'tadi"], 3, "Kesish (X) faylni eski joydan oladi."),
            q("\"hisobot.docx\" faylidagi \".docx\" nima?", ["Papka nomi", "Fayl kengaytmasi (Word hujjati)", "Virus", "Fayl hajmi"], 1, "Nuqtadan keyingi qism fayl turini bildiradi."),
          ],
        }),
        lesson({
          title: "Klaviatura va sichqoncha asoslari",
          theory: `### ⌨️ 5-Mavzu: Klaviatura va sichqoncha asoslari

#### Klaviaturaning muhim tugmalari
- **Enter** — buyruqni tasdiqlash yoki matnda yangi qatorga o'tish.
- **Shift** — bosib turilsa katta harf yoki tugmadagi yuqori belgi yoziladi (masalan, Shift + 1 = !).
- **Caps Lock** — barcha harflarni doimiy katta qilib yozish.
- **Ctrl** va **Alt** — boshqa tugmalar bilan birga ishlatiladigan yordamchi tugmalar (qisqa buyruqlar).
- **Delete** — kursordan **o'ngdagi** belgini yoki tanlangan faylni o'chiradi.
- **Backspace** — kursordan **chapdagi** belgini o'chiradi.
- **Space (Probel)** — so'zlar orasiga bo'sh joy qo'yadi.
- **Tab** — xatboshi (otstup) qo'yadi yoki keyingi maydonga o'tadi.
- **Esc** — amalni bekor qilish.
- **Win (Windows tugmasi)** — Start menyuni ochadi.

#### Sichqoncha harakatlari
- **Chap tugma bir marta bosish (Click)** — tanlash.
- **Chap tugma ikki marta bosish (Double click)** — fayl, papka yoki dasturni ochish.
- **O'ng tugma bosish (Right click)** — kontekst menyusini ochish (nusxalash, o'chirish, nomlash va h.k.).
- **Sudrab o'tkazish (Drag & Drop)** — chap tugmani bosib turgan holda obyektni boshqa joyga olib borish.
- **G'ildirak (Scroll)** — sahifani yuqoriga va pastga aylantirish.

> Noutbukda sichqoncha o'rnida **sensor panel (touchpad)** ishlatiladi: bir barmoq bilan bosish = chap tugma, ikki barmoq bilan bosish = o'ng tugma.`,
          practice: `- Bloknotda (Notepad) ismingizni katta harflar bilan yozing (Shift va Caps Lock bilan).
- Faylni sichqoncha bilan sudrab boshqa papkaga o'tkazing.`,
          questions: [
            q("Matnda yangi qatorga o'tish uchun qaysi tugma bosiladi?", ["Shift", "Enter", "Alt", "Esc"], 1, "Tasdiqlash tugmasi ham shu."),
            q("Bitta katta harf yozish uchun harf bilan birga qaysi tugma bosib turiladi?", ["Shift", "Ctrl", "Tab", "Delete"], 0, "Bu tugma yuqori registrga o'tkazadi."),
            q("Kursordan chapdagi belgini qaysi tugma o'chiradi?", ["Delete", "Enter", "Backspace", "Space"], 2, "Delete o'ngdagini, bu esa chapdagini o'chiradi."),
            q("Faylni ochish uchun sichqoncha bilan nima qilinadi?", ["O'ng tugmani bir marta bosiladi", "G'ildirak aylantiriladi", "Chap tugma ikki marta tez bosiladi", "Chap tugma bir marta bosiladi"], 2, "Double click."),
            q("Sichqonchaning o'ng tugmasi bosilganda nima ochiladi?", ["Start menyu", "Kontekst menyusi", "Yangi oyna", "Internet"], 1, "Nusxalash, o'chirish kabi buyruqlar ro'yxati."),
          ],
        }),
        lesson({
          title: "Qisqa tugmalar (Shortcuts)",
          theory: `### ⚡ 6-Mavzu: Qisqa tugmalar (Shortcuts)

Qisqa tugmalar (tezkor kombinatsiyalar) ishni sichqonchasiz, bir necha barobar tez bajarishga yordam beradi. Avval birinchi tugma bosib turiladi, keyin ikkinchisi bosiladi.

#### Eng ko'p ishlatiladigan kombinatsiyalar
- **Ctrl + C** — nusxalash (Copy).
- **Ctrl + V** — qo'yish (Paste).
- **Ctrl + X** — kesib olish (Cut).
- **Ctrl + Z** — oxirgi amalni bekor qilish (Undo).
- **Ctrl + Y** — bekor qilingan amalni qaytarish (Redo).
- **Ctrl + S** — faylni saqlash (Save).
- **Ctrl + A** — hammasini belgilash (Select All).
- **Ctrl + P** — chop etish (Print).
- **Ctrl + F** — matndan qidirish (Find).
- **Ctrl + N** — yangi fayl yoki oyna ochish (New).
- **Ctrl + O** — faylni ochish (Open).

#### Windows uchun kombinatsiyalar
- **Alt + Tab** — ochiq oynalar orasida almashish.
- **Alt + F4** — joriy oynani yopish.
- **Win + D** — ish stolini ko'rsatish.
- **Win + E** — Provodnikni (File Explorer) ochish.
- **Win + L** — kompyuterni qulflash.
- **Ctrl + Shift + Esc** — vazifalar menejeri (Task Manager).
- **Alt + Shift** yoki **Win + Space** — klaviatura tilini almashtirish.

> **Eslab qolish usuli:** C — Copy, V — qo'yish (C ning yonida), X — qaychi shakli (kesish), Z — orqaga, S — Save, A — All, P — Print.`,
          practice: `- Bloknotda matn yozing, Ctrl + A bilan belgilang, Ctrl + C bilan nusxalab, Ctrl + V bilan 3 marta qo'ying.
- Ctrl + Z bilan oxirgi amalni bekor qiling va Ctrl + S bilan saqlang.`,
          questions: [
            q("Oxirgi amalni bekor qilish kombinatsiyasi qaysi?", ["Ctrl + Z", "Ctrl + S", "Ctrl + V", "Ctrl + A"], 0, "Undo — orqaga qaytish."),
            q("Faylni saqlash uchun qaysi kombinatsiya ishlatiladi?", ["Ctrl + P", "Ctrl + C", "Ctrl + S", "Ctrl + N"], 2, "S — Save."),
            q("Nusxalangan matnni qo'yish kombinatsiyasi qaysi?", ["Ctrl + X", "Ctrl + V", "Ctrl + Y", "Ctrl + F"], 1, "Paste — C tugmasining yonida."),
            q("Hammasini belgilash (Select All) kombinatsiyasi qaysi?", ["Ctrl + F", "Ctrl + O", "Ctrl + E", "Ctrl + A"], 3, "A — All."),
            q("Ochiq oynalar orasida almashish uchun qaysi kombinatsiya ishlatiladi?", ["Alt + F4", "Alt + Tab", "Win + L", "Ctrl + P"], 1, "Alt + F4 oynani yopadi, bu esa almashtiradi."),
          ],
        }),
        lesson({
          title: "USB fleshka va tashqi qurilmalar bilan ishlash",
          theory: `### 💾 7-Mavzu: USB fleshka va tashqi qurilmalar

**Tashqi qurilmalar** — kompyuterga tashqaridan ulanadigan qurilmalar: USB fleshka, tashqi qattiq disk, printer, skaner, telefon, quloqchin, veb-kamera.
**USB port** — bu qurilmalar ulanadigan to'rtburchak uyacha.

#### Fleshkani ulash va ochish
- Fleshkani USB portga ulang. Ekranda bildirishnoma chiqadi.
- **Provodnik (Win + E)** → **Этот компьютер / This PC** bo'limida fleshka yangi disk sifatida ko'rinadi (masalan, E: yoki F:).
- Ikki marta bosib fleshkani oching.

#### Fayl ko'chirish
- Kompyuterdagi faylni tanlang → **Ctrl + C** → fleshkani oching → **Ctrl + V**.
- Yoki faylni sichqoncha bilan sudrab fleshka oynasiga olib o'ting.
- Fleshkadan kompyuterga ham xuddi shunday ko'chiriladi.

#### Fleshkani xavfsiz chiqarish
Fayl yozilayotganda fleshkani sug'urish fayllarni buzishi mumkin. Taskbardagi **"Безопасное извлечение / Safely Remove Hardware"** belgisini bosing yoki Provodnikda fleshkaga o'ng tugma → **Eject (Извлечь)**. So'ngra sug'uring.

#### Formatlash
**Formatlash** — fleshkani butunlay tozalab, yangidan tayyorlash. **Diqqat: undagi barcha fayllar o'chadi!**
- Provodnikda fleshkaga o'ng tugma → **Format (Форматировать)**.
- Fayl tizimini tanlang: **FAT32** (barcha qurilmalarga mos, lekin 4 GB dan katta faylni saqlamaydi), **exFAT** yoki **NTFS** (katta fayllar uchun).
- **Start** tugmasini bosing.

> **Xavfsizlik:** Begona fleshkani ulaganda uni antivirus bilan tekshiring.`,
          practice: `- Fleshkaga "Kurs" papkasini yarating va unga 2 ta fayl ko'chiring.
- Fleshkani xavfsiz chiqarish orqali uzing.`,
          questions: [
            q("Fleshka kompyuterga qaysi port orqali ulanadi?", ["HDMI", "USB", "Audio", "VGA"], 1, "Universal port nomi."),
            q("Fleshkani formatlaganda nima sodir bo'ladi?", ["Fayllar ikki baravar ko'payadi", "Fleshka tezlashadi va fayllar saqlanib qoladi", "Fleshkadagi barcha fayllar o'chadi", "Fleshka buziladi"], 2, "Formatlash — butunlay tozalash."),
            q("Fleshkani sug'urishdan oldin nima qilish kerak?", ["Kompyuterni o'chirish", "Xavfsiz chiqarish (Eject / Safely Remove)", "Formatlash", "Hech narsa"], 1, "Fayllar buzilmasligi uchun."),
            q("Ulangan fleshka Provodnikning qaysi bo'limida ko'rinadi?", ["Korzinada", "Ish stolida", "Start menyuda", "Этот компьютер (This PC)"], 3, "Disklar ro'yxati qayerda?"),
            q("FAT32 fayl tizimining kamchiligi nima?", ["4 GB dan katta faylni saqlay olmaydi", "Telefonda ishlamaydi", "Faqat rasm saqlaydi", "Kamchiligi yo'q"], 0, "Katta video fayllar uchun exFAT yoki NTFS tanlanadi."),
          ],
        }),
        lesson({
          title: "Dasturlarni o'rnatish va o'chirish",
          theory: `### 📦 8-Mavzu: Dasturlarni o'rnatish va o'chirish

#### Dasturni o'rnatish (Setup file orqali)
- Dasturni **faqat rasmiy saytdan** yuklab oling (masalan, Google Chrome — google.com/chrome).
- Yuklab olingan fayl odatda **setup.exe** yoki **.msi** kengaytmali bo'ladi va **Загрузки / Downloads** papkasiga tushadi.
- Faylni ikki marta bosing. Ruxsat so'ralsa **"Да / Yes"** tugmasini bosing.
- O'rnatish ustasida (Installer) **Next (Далее)** tugmalarini bosib boring, litsenziya shartlariga rozilik bildiring (**I agree**), o'rnatish joyini tanlang.
- **Install** tugmasini bosing va jarayon tugagach **Finish** bosing.
- Dastur yorlig'i ish stolida yoki Start menyuda paydo bo'ladi.

> **Diqqat:** O'rnatish paytida keraksiz qo'shimcha dasturlar (reklama, toolbar) taklif qilinishi mumkin — ularning belgisini (galochka) olib tashlang.

#### Dasturni o'chirish (Control Panel orqali)
- Start → **Control Panel (Панель управления)** → **Programs and Features (Программы и компоненты)**.
- Ro'yxatdan keraksiz dasturni tanlang → **Uninstall (Удалить)**.
- Windows 10/11 da: Start → **Settings (Параметры)** → **Apps (Приложения)** → dasturni tanlab **Uninstall**.

> **Muhim:** Dasturni o'chirish uchun uning yorlig'ini ish stolidan o'chirish yetarli emas! Yorliq — faqat havola, dastur esa kompyuterda qoladi.`,
          practice: `- Rasmiy saytdan bepul dastur (masalan, 7-Zip yoki VLC) yuklab o'rnating.
- Control Panel orqali o'rnatilgan dasturlar ro'yxatini oching.`,
          questions: [
            q("Dasturni qayerdan yuklab olish xavfsiz?", ["Noma'lum saytlardan", "Faqat rasmiy saytdan", "Reklama bannerlaridan", "Begona fleshkadan"], 1, "Viruslardan saqlanish uchun."),
            q("Dastur o'rnatish fayli odatda qanday nomlanadi?", ["setup.exe", "rasm.jpg", "musiqa.mp3", "hujjat.docx"], 0, "Setup — o'rnatish."),
            q("Windowsda dasturni to'g'ri o'chirish yo'li qaysi?", ["Ish stolidagi yorliqni o'chirish", "Kompyuterni qayta yoqish", "Control Panel → Programs and Features → Uninstall", "Fleshkani formatlash"], 2, "Panel upravleniya orqali."),
            q("Ish stolidagi yorliqni o'chirsangiz, dastur kompyuterdan o'chadimi?", ["Ha, butunlay o'chadi", "Faqat internet o'chadi", "Kompyuter o'chadi", "Yo'q, yorliq faqat havola — dastur qoladi"], 3, "Yorliq — bu shunchaki havola."),
            q("O'rnatish ustasida keyingi bosqichga o'tish tugmasi qaysi?", ["Cancel", "Next (Далее)", "Back", "Delete"], 1, "Ingliz tilida \"keyingi\"."),
          ],
        }),
        lesson({
          title: "Word dasturi bilan tanishuv",
          theory: `### 📘 9-Mavzu: Microsoft Word bilan tanishuv

**Microsoft Word** — matnli hujjatlar (ariza, xat, referat, CV, kitob) yaratish va tahrirlash dasturi. Word fayllari **.docx** kengaytmasiga ega.

#### Wordni ochish
Start → **Word** yoki ish stolidagi Word yorlig'i → **Новый документ / Blank document**.

#### Word oynasi (interfeys) qismlari
- **Sarlavha qatori** — yuqorida, hujjat nomi ko'rinadi.
- **Tezkor kirish paneli** — Saqlash, Bekor qilish (Undo) tugmalari.
- **Lenta (Ribbon)** — barcha buyruqlar joylashgan menyular (tablar):
  - **Главная / Home** — shrift, o'lcham, qalin/kursiv, rang, tekislash.
  - **Вставка / Insert** — rasm, jadval, shakl, sahifa raqami qo'shish.
  - **Макет / Layout** — sahifa chegaralari (polya), yo'nalishi (kitob/albom).
  - **Рецензирование / Review** — imlo tekshiruvi.
  - **Вид / View** — hujjat ko'rinishi.
- **Ish maydoni** — matn yoziladigan oq sahifa. Unda miltillab turgan chiziq — **kursor**.
- **Holat qatori** — pastda: sahifa raqami, so'zlar soni, masshtab (zoom).

#### Hujjatni saqlash
- **Ctrl + S** yoki **Файл / File → Сохранить как / Save As**.
- Joyni (masalan, Hujjatlar papkasi) va fayl nomini tanlab **Сохранить / Save** bosiladi.
- PDF sifatida saqlash: Save As → fayl turi **PDF**.`,
          practice: `- Wordni ochib yangi hujjat yarating, ismingizni yozing va "Birinchi hujjat" nomi bilan saqlang.
- Lentadagi Home, Insert va Layout tablarini birma-bir ochib ko'ring.`,
          questions: [
            q("Microsoft Word nima uchun ishlatiladi?", ["Jadval va formulalar uchun", "Matnli hujjatlar yaratish va tahrirlash uchun", "Internetga kirish uchun", "Rasm chizish uchun"], 1, "Ariza, xat, CV..."),
            q("Word hujjatining kengaytmasi qaysi?", [".xlsx", ".pptx", ".docx", ".mp3"], 2, "\"doc\" — document."),
            q("Shrift va matn rangini o'zgartirish tugmalari qaysi tabda joylashgan?", ["Главная (Home)", "Вставка (Insert)", "Вид (View)", "Рецензирование (Review)"], 0, "Asosiy tab."),
            q("Wordda jadval yoki rasm qo'shish qaysi tabda?", ["Главная (Home)", "Вид (View)", "Макет (Layout)", "Вставка (Insert)"], 3, "Insert — qo'shish."),
            q("Wordda hujjatni PDF formatda saqlash mumkinmi?", ["Yo'q, mumkin emas", "Ha, Save As orqali fayl turini PDF tanlab", "Faqat internet orqali", "Faqat chop etib"], 1, "Saqlash oynasida fayl turini tanlang."),
          ],
        }),
        lesson({
          title: "Word'da matn yozish va tahrirlash",
          theory: `### ✍️ 10-Mavzu: Word'da matn yozish va tahrirlash

#### Matnni belgilash
O'zgartirishdan oldin matnni **belgilash** kerak:
- Sichqoncha bilan sudrab belgilash.
- So'zga ikki marta bosish — bitta so'z belgilanadi.
- **Ctrl + A** — butun matn belgilanadi.

#### Shriftni sozlash (Home → Шрифт)
- **Shrift turi** — masalan, Times New Roman, Arial, Calibri.
- **O'lchami** — 12, 14, 16... (rasmiy hujjatlarda odatda 14).
- **Qalin (Bold)** — **Ctrl + B**
- **Kursiv (Italic)** — **Ctrl + I**
- **Tagiga chizilgan (Underline)** — **Ctrl + U**
- **Matn rangi** va **belgilash rangi** (marker).

#### Paragraf sozlamalari (Home → Абзац)
- **Tekislash:** chapga (**Ctrl + L**), markazga (**Ctrl + E**), o'ngga (**Ctrl + R**), ikki tomonlama — eni bo'yicha (**Ctrl + J**).
- **Qatorlar oralig'i** (интервал) — 1.0, 1.15, 1.5, 2.0.
- **Xatboshi (otstup)** — paragraf birinchi qatorining ichkariga surilishi.
- **Ro'yxatlar** — nuqtali (markerli) va raqamli ro'yxat.

#### Matnni stilizatsiya qilish (Стили)
Home → **Стили / Styles**: **Заголовок 1 (Heading 1)**, **Заголовок 2**, **Обычный (Normal)**. Stillar sarlavhalarni bir xil va chiroyli qiladi hamda avtomatik mundarija tuzishga yordam beradi.

#### Imlo tekshiruvi
Qizil to'lqinli chiziq — imlo xatosi, ko'k — grammatik xato. Ustiga o'ng tugma bosib to'g'ri variantni tanlash mumkin.`,
          practice: `- "Mening orzuim" mavzusida 2 paragraf matn yozing.
- Sarlavhani markazga tekislab, qalin va 16 o'lchamli qiling; asosiy matnni Times New Roman 14, eni bo'yicha tekislang, qator oralig'i 1.5.`,
          questions: [
            q("Matnni qalin (Bold) qilish kombinatsiyasi qaysi?", ["Ctrl + I", "Ctrl + U", "Ctrl + B", "Ctrl + E"], 2, "B — Bold."),
            q("Matnni markazga tekislash kombinatsiyasi qaysi?", ["Ctrl + E", "Ctrl + L", "Ctrl + R", "Ctrl + J"], 0, "Center so'zidagi E harfi."),
            q("Matnni o'zgartirishdan oldin nima qilish kerak?", ["Faylni yopish", "Matnni belgilash", "Kompyuterni qayta yoqish", "Matnni o'chirish"], 1, "Avval tanlash kerak."),
            q("Rasmiy hujjatlarda odatda qaysi shrift o'lchami ishlatiladi?", ["8", "36", "72", "14"], 3, "Ko'p rasmiy hujjatlar talabi."),
            q("Wordda qizil to'lqinli chiziq nimani bildiradi?", ["Imlo xatosini", "Saqlanmagan faylni", "Sarlavhani", "Havolani"], 0, "Imlo tekshiruvi."),
          ],
        }),
        lesson({
          title: "Word hujjatiga rasm va jadval qo'shish",
          theory: `### 🖼️ 11-Mavzu: Word hujjatiga rasm, jadval va grafik qo'shish

Barcha qo'shish amallari **Вставка / Insert** tabida joylashgan.

#### Rasm qo'shish
- Insert → **Рисунки / Pictures** → **Это устройство / This Device** → rasmni tanlab **Вставить / Insert**.
- Rasm burchaklaridagi doirachalarni sudrab o'lchamini o'zgartiring.
- **Обтекание текстом / Wrap Text** — rasmning matn bilan joylashuvi (matn ichida, atrofida, oldida/ortida).

#### Jadval qo'shish
- Insert → **Таблица / Table** → kerakli ustun va satrlar sonini sichqoncha bilan belgilang (masalan, 3×4).
- Kataklar orasida **Tab** tugmasi bilan o'tiladi.
- Jadval tanlanganda **Конструктор / Table Design** tabi chiqadi: jadval uslubi, chegaralar, rang.
- **Макет / Layout** tabi: satr yoki ustun qo'shish, o'chirish, kataklarni birlashtirish (**Объединить ячейки / Merge Cells**).

#### Grafik (diagramma) qo'shish
Insert → **Диаграмма / Chart** → turini tanlang (ustunli, doiraviy, chiziqli). Ochiladigan kichik Excel oynasiga ma'lumotlarni kiriting.

#### Shakl va chizmalar
Insert → **Фигуры / Shapes** — to'rtburchak, doira, strelka, chiziq. Sichqoncha bilan sahifada chizib olinadi.
Insert → **SmartArt** — tayyor sxemalar (jarayon, ierarxiya).`,
          practice: `- Hujjatga o'zingiz haqingizda rasm qo'shing va uni matn atrofida joylashtiring.
- 4 ustun, 5 satrli "Dars jadvali" jadvalini tuzing va sarlavha qatorini rang bilan bo'yang.`,
          questions: [
            q("Wordda rasm qo'shish yo'li qaysi?", ["Home → Font", "Insert → Pictures", "View → Zoom", "Layout → Margins"], 1, "Insert — qo'shish tabi."),
            q("Jadval kataklari orasida keyingi katakka qaysi tugma bilan o'tiladi?", ["Tab", "Esc", "Delete", "Caps Lock"], 0, "Bu tugma klaviaturaning chap tomonida."),
            q("Bir nechta katakni bitta qilish amali nima deyiladi?", ["Kataklarni o'chirish", "Kataklarni bo'yash", "Kataklarni birlashtirish (Merge Cells)", "Kataklarni nusxalash"], 2, "Merge — birlashtirish."),
            q("Wordda diagramma qo'shilganda ma'lumotlar qayerga kiritiladi?", ["Bloknotga", "Paint dasturiga", "Brauzerga", "Ochiladigan kichik Excel oynasiga"], 3, "Diagrammalar Excel bilan bog'liq."),
            q("Rasmning matn atrofida joylashuvini sozlash buyrug'i qaysi?", ["Обтекание текстом (Wrap Text)", "Ctrl + S", "Заголовок 1", "Imlo tekshiruvi"], 0, "Wrap — o'rash."),
          ],
        }),
        lesson({
          title: "Amaliy ish: Oddiy hujjat tayyorlash (CV, ariza)",
          points: 15,
          theory: `### 📄 12-Mavzu: Amaliy ish — CV va ariza tayyorlash

#### Ariza (rasmiy hujjat) tuzilishi
- **Yuqori o'ng burchakda** — kimga yozilmoqda: tashkilot rahbarining lavozimi va F.I.Sh. hamda kimdan: arizachining F.I.Sh. va manzili.
- **O'rtada** — "ARIZA" so'zi (markazda, qalin).
- **Asosiy matn** — iltimos mazmuni, eni bo'yicha tekislangan, xatboshi bilan.
- **Pastda** — sana (chapda) va imzo (o'ngda).
- Shrift: **Times New Roman, 14**, qator oralig'i **1.5**, sahifa chegaralari: chap 3 sm, o'ng 1.5 sm, yuqori va past 2 sm.

#### CV (Rezyume) tuzilishi
- **Shaxsiy ma'lumotlar** — F.I.Sh., rasm, telefon, email, manzil.
- **Maqsad** — qaysi lavozimga da'vogarlik.
- **Ta'lim** — o'qigan joylari va yillari.
- **Ish tajribasi** — oxirgi ish joyidan boshlab.
- **Ko'nikmalar** — kompyuter savodxonligi (Word, Excel), tillar.
- **Qo'shimcha** — sertifikatlar, yutuqlar.

> **Maslahat:** CV 1 sahifadan oshmasin, jadval yordamida chiroyli joylashtiring, rasmiy email (ism.familiya@gmail.com) ishlating va imlo xatolarini tekshiring.

#### Wordni real misolda qo'llash
- Sahifa chegaralari: **Макет / Layout → Поля / Margins**.
- Jadval chegaralarini yashirish: jadvalni belgilang → **Границы / Borders → Нет границы / No Border**.
- Tayyor shablonlar: **Файл → Создать / New** → qidiruvga "Resume" yoki "Rezyume" yozing.
- Tayyor hujjatni **PDF** formatida saqlab yuboring.`,
          practice: `- O'zingiz uchun 1 sahifali CV tayyorlang (rasm, ta'lim, ko'nikmalar bilan) va PDF formatda saqlang.
- O'quv markazi direktori nomiga "Kursga qabul qilish to'g'risida" ariza yozing.`,
          questions: [
            q("Arizada \"ARIZA\" so'zi qayerda joylashadi?", ["Pastki o'ng burchakda", "Sahifa o'rtasida, markazga tekislangan holda", "Yuqori chap burchakda", "Umuman yozilmaydi"], 1, "Sarlavha markazda bo'ladi."),
            q("Rasmiy hujjatlar uchun qaysi shrift va o'lcham tavsiya etiladi?", ["Comic Sans, 20", "Arial, 8", "Times New Roman, 14", "Impact, 28"], 2, "Klassik rasmiy shrift."),
            q("CV (rezyume) ning tavsiya etilgan hajmi qancha?", ["1 sahifa", "5 sahifa", "10 sahifa", "Hajmi muhim emas"], 0, "Ish beruvchi qisqa CV ni afzal ko'radi."),
            q("CV da qaysi email manzil to'g'riroq?", ["superboy2005@mail.ru", "qwerty123@gmail.com", "malika_love@mail.ru", "ism.familiya@gmail.com"], 3, "Rasmiy, ism-familiyali manzil."),
            q("Sahifa chegaralari (polya) qaysi tabda sozlanadi?", ["Вставка (Insert)", "Макет (Layout)", "Вид (View)", "Главная (Home)"], 1, "Sahifa maketi."),
          ],
        }),
      ],
    },
    {
      title: "2-oy: Excel, Internet va yakuniy baholash",
      summary: "Excel jadvallari, formulalar, diagrammalar, internet, email, xavfsizlik va sertifikat.",
      sort_order: 2,
      tasks: [
        lesson({
          title: "Excel dasturi bilan tanishuv",
          theory: `### 📗 13-Mavzu: Microsoft Excel bilan tanishuv

**Microsoft Excel** — elektron jadvallar bilan ishlash, hisob-kitob qilish, ma'lumotlarni tahlil qilish va diagramma chizish dasturi. Excel fayli **.xlsx** kengaytmasiga ega va **kitob (Workbook)** deb ataladi.

#### Asosiy tushunchalar
- **Ustun (Column)** — vertikal qator, **harflar** bilan belgilanadi: A, B, C ... Z, AA, AB...
- **Satr (Row)** — gorizontal qator, **raqamlar** bilan belgilanadi: 1, 2, 3...
- **Katak (Cell / Ячейка)** — ustun va satr kesishgan joy. Har bir katakning **manzili** bor: avval ustun harfi, keyin satr raqami. Masalan, **B3** — B ustun va 3-satr kesishmasi.
- **Diapazon** — kataklar guruhi: **A1:A10** (A1 dan A10 gacha).
- **Varaq (Sheet / Лист)** — kitob ichidagi alohida sahifa. Pastda Лист1, Лист2 yorliqlari.

#### Excel oynasi
- **Lenta (Ribbon)** — Главная, Вставка, Формулы, Данные tablari.
- **Nom maydoni (Name Box)** — tanlangan katak manzili ko'rinadi (masalan, A1).
- **Formulalar qatori (fx)** — katak ichidagi qiymat yoki formula ko'rinadi.
- **Ish maydoni** — kataklar to'ri.

#### Harakatlanish
- Strelka tugmalari — kataklar bo'ylab yurish.
- **Enter** — pastki katakka, **Tab** — o'ngdagi katakka o'tish.
- Katakni tahrirlash — ikki marta bosish yoki **F2**.`,
          practice: `- Excelni oching, A1 katakka ismingizni, B1 ga yoshingizni yozing.
- Yangi varaq qo'shib, uni "Mashq" deb qayta nomlang.`,
          questions: [
            q("Excel nima uchun mo'ljallangan?", ["Matn yozish uchun", "Elektron jadvallar va hisob-kitoblar uchun", "Video tahrirlash uchun", "Internetga kirish uchun"], 1, "Jadval va formulalar dasturi."),
            q("Excelda ustunlar qanday belgilanadi?", ["Harflar bilan (A, B, C...)", "Raqamlar bilan (1, 2, 3...)", "Ranglar bilan", "Belgilanmaydi"], 0, "Satrlar raqamli, ustunlar esa..."),
            q("C5 manzili nimani bildiradi?", ["5-ustun va C satr", "C varaq, 5-kitob", "C ustun va 5-satr kesishgan katak", "5 ta katak"], 2, "Avval ustun harfi, keyin satr raqami."),
            q("Excel faylining kengaytmasi qaysi?", [".docx", ".pptx", ".txt", ".xlsx"], 3, "\"xls\" — Excel spreadsheet."),
            q("A1:A10 yozuvi nimani bildiradi?", ["Faqat A1 va A10 kataklarni", "A1 dan A10 gacha bo'lgan kataklar diapazonini", "A ustunni o'chirishni", "10 ta varaqni"], 1, "Ikki nuqta — \"dan ... gacha\"."),
          ],
        }),
        lesson({
          title: "Jadval tuzish va formatlash",
          theory: `### 🗂️ 14-Mavzu: Jadval tuzish va formatlash

#### Ma'lumot kiritish
- Katakni tanlab yozing va **Enter** bosing.
- Matn chapga, sonlar o'ngga tekislanadi.
- Ustun kengligini o'zgartirish: ustun harflari orasidagi chiziqni sudrang yoki ikki marta bosing (avtomatik moslash).

#### Chegara (Границы / Borders)
Excelda kataklar to'ri chop etilmaydi! Jadval chiroyli va chop etiladigan bo'lishi uchun chegara beriladi:
Kataklarni belgilang → Главная → **Границы → Все границы / All Borders**.

#### Rang berish
- **Заливка / Fill Color** (bo'yoq chelagi) — katak fonini bo'yash.
- **Цвет шрифта / Font Color** — matn rangi.
- Qalin, kursiv, shrift o'lchami — Word'dagi kabi.

#### Kataklarni birlashtirish
Jadval sarlavhasini bir nechta ustun ustida markazga qo'yish uchun: kataklarni belgilang → **Объединить и поместить в центре / Merge & Center**.

#### Son formati
Главная → **Число / Number**: Umumiy, Son, **Pul (Денежный)**, **Sana (Дата)**, **Foiz (%)**.

#### Tayyor uslub
Главная → **Форматировать как таблицу / Format as Table** — bir bosishda chiroyli rangli jadval.`,
          practice: `- "Guruh ro'yxati" jadvalini tuzing: №, F.I.Sh., Telefon, Yoshi ustunlari bilan 5 ta o'quvchi.
- Sarlavhani birlashtirib markazga qo'ying, barcha chegaralarni bering va sarlavha qatorini ko'k rangga bo'yang.`,
          questions: [
            q("Excelda jadval chop etilganda chiziqlari ko'rinishi uchun nima qilish kerak?", ["Hech narsa — to'r avtomatik chiqadi", "Chegara (Границы → Все границы) berish", "Shriftni kattalashtirish", "Faylni PDF qilish"], 1, "Kataklar to'ri chop etilmaydi."),
            q("Sarlavhani bir nechta ustun ustida markazga qo'yish buyrug'i qaysi?", ["Merge & Center (Объединить и поместить в центре)", "Fill Color", "Ctrl + Z", "Sort A-Z"], 0, "Birlashtirish va markazlash."),
            q("Katak fonini bo'yash tugmasi qanday ataladi?", ["Цвет шрифта (Font Color)", "Границы (Borders)", "Заливка (Fill Color)", "Формат по образцу"], 2, "Bo'yoq chelagi belgisi."),
            q("Excelda sonlar katakda odatda qayerga tekislanadi?", ["Chapga", "Markazga", "Yuqoriga", "O'ngga"], 3, "Matn chapga, sonlar esa..."),
            q("Ustun kengligini matnga avtomatik moslash uchun nima qilinadi?", ["Ustun harflari orasidagi chiziqqa ikki marta bosiladi", "Ctrl + S bosiladi", "Katak o'chiriladi", "Varaq o'chiriladi"], 0, "Chegaraga double click."),
          ],
        }),
        lesson({
          title: "Formulalar bilan ishlash",
          theory: `### 🧮 15-Mavzu: Excelda formulalar bilan ishlash

Excelda har qanday formula **teng (=) belgisi** bilan boshlanadi! Formulada sonlar o'rniga **katak manzillari** yoziladi — shunda katakdagi qiymat o'zgarsa, natija avtomatik yangilanadi.

#### Arifmetik amallar
- **=A1+B1** — qo'shish
- **=A1-B1** — ayirish
- **=A1*B1** — ko'paytirish (yulduzcha)
- **=A1/B1** — bo'lish (qiya chiziq)
- **=A1^2** — darajaga ko'tarish

#### Asosiy funksiyalar
- **=SUM(A1:A10)** (СУММ) — yig'indi.
- **=AVERAGE(A1:A10)** (СРЗНАЧ) — o'rtacha qiymat.
- **=MAX(A1:A10)** (МАКС) — eng katta qiymat.
- **=MIN(A1:A10)** (МИН) — eng kichik qiymat.
- **=COUNT(A1:A10)** (СЧЁТ) — sonli kataklar soni.
- **=IF(B2>=60;"O'tdi";"Yiqildi")** (ЕСЛИ) — shartli natija.

> **Avtosumma (Σ):** Главная → **Автосумма** tugmasi ustun ostidagi sonlar yig'indisini bir bosishda hisoblaydi.

#### Formulani nusxalash
Formulali katakning pastki o'ng burchagidagi kichik kvadratchani (**to'ldirish markeri**) pastga sudrasangiz, formula boshqa satrlarga ham moslashib nusxalanadi: =A1+B1 → =A2+B2 → =A3+B3.

#### Ko'p uchraydigan xatolar
- **#DIV/0!** — nolga bo'lish.
- **#NAME?** — funksiya nomi xato yozilgan.
- **####** — ustun tor, natija sig'mayapti.`,
          practice: `- A ustunga 5 ta mahsulot narxini, B ustunga sonini yozing. C ustunda =A2*B2 formulasini yozib, pastga sudrang.
- C ustun ostida =SUM, =AVERAGE, =MAX funksiyalarini qo'llang.`,
          questions: [
            q("Excelda formula qaysi belgi bilan boshlanadi?", ["+", "=", "#", "*"], 1, "Teng belgisi."),
            q("A1 dan A10 gacha kataklar yig'indisini hisoblovchi formula qaysi?", ["=SUM(A1:A10)", "=AVERAGE(A1:A10)", "=MAX(A1:A10)", "=A1+A10"], 0, "SUM — yig'indi."),
            q("O'rtacha qiymatni hisoblovchi funksiya qaysi?", ["SUM", "MIN", "AVERAGE", "COUNT"], 2, "Average — o'rtacha."),
            q("Excelda ko'paytirish belgisi qaysi?", ["x", ":", "/", "*"], 3, "Yulduzcha."),
            q("#DIV/0! xatosi nimani bildiradi?", ["Funksiya nomi xato", "Nolga bo'lish amalga oshirilgan", "Ustun tor", "Fayl saqlanmagan"], 1, "DIV — division (bo'lish)."),
          ],
        }),
        lesson({
          title: "Excelda Autofill va tartiblash",
          theory: `### 🔢 16-Mavzu: Excelda Autofill (avtoto'ldirish) va tartiblash

#### Autofill — avtomatik to'ldirish
Katakning pastki o'ng burchagidagi kichik qora kvadrat — **to'ldirish markeri (Fill Handle)**. Uni sudrab ma'lumotlarni tez to'ldirish mumkin:
- **Raqamli ketma-ketlik:** A1 ga 1, A2 ga 2 yozing, ikkalasini belgilab pastga sudrang → 3, 4, 5...
- **Hafta kunlari va oylar:** "Dushanba" yoki "Январь" yozib sudrang — keyingilari avtomatik chiqadi.
- **Sanalar:** 01.09.2026 yozib sudrasangiz, kunlar ketma-ket o'sadi.
- **Formulalar:** formula sudralganda katak manzillari avtomatik moslashadi.
- **Nusxalash:** bitta matnni sudrasangiz, u takrorlanadi.

> **Tez to'ldirish:** to'ldirish markeriga **ikki marta** bossangiz, qo'shni ustundagi ma'lumot tugaguncha avtomatik to'ldiriladi.

#### Tartiblash (Sort / Сортировка)
- Ustundagi istalgan katakni tanlang → **Данные / Data → Сортировка от А до Я (A→Z)** — alifbo bo'yicha yoki sonlarni o'sish tartibida.
- **Я→А (Z→A)** — teskari tartib yoki sonlarni kamayish tartibida.
- **Настраиваемая сортировка / Custom Sort** — bir nechta ustun bo'yicha tartiblash.

#### Filtr (Фильтр)
Данные → **Фильтр** — sarlavhalarda strelkalar paydo bo'ladi. Ular orqali faqat kerakli qatorlarni ko'rsatish mumkin (masalan, faqat "Toshkent" shahri).

> **Diqqat:** Tartiblashda butun jadval birga belgilanishi kerak, aks holda satrlardagi ma'lumotlar aralashib ketadi.`,
          practice: `- A ustunga 1 dan 30 gacha raqamlarni Autofill bilan, B ustunga hafta kunlarini to'ldiring.
- Guruh ro'yxatini familiya bo'yicha A→Z, yoshi bo'yicha kamayish tartibida saralang.`,
          questions: [
            q("Katakning pastki o'ng burchagidagi kichik kvadrat nima deyiladi?", ["Nom maydoni", "To'ldirish markeri (Fill Handle)", "Formula qatori", "Varaq yorlig'i"], 1, "U orqali Autofill qilinadi."),
            q("A1 ga 1, A2 ga 2 yozib, ikkalasini belgilab pastga sudrasak nima bo'ladi?", ["3, 4, 5... ketma-ketlik davom etadi", "Hamma kataklar 1 bo'ladi", "Xato chiqadi", "Kataklar o'chadi"], 0, "Excel qonuniyatni tushunadi."),
            q("Ma'lumotlarni alifbo bo'yicha saralash qaysi tabda?", ["Вставка (Insert)", "Вид (View)", "Данные (Data)", "Рецензирование (Review)"], 2, "Ma'lumotlar bilan ishlash tabi."),
            q("A→Z (А→Я) tartiblash sonlarni qanday joylashtiradi?", ["Kamayish tartibida", "Tasodifiy", "O'zgartirmaydi", "O'sish tartibida (kichikdan kattaga)"], 3, "A dan Z ga — boshidan oxiriga."),
            q("Jadvaldan faqat kerakli qatorlarni ko'rsatish uchun qaysi vosita ishlatiladi?", ["Filtr (Фильтр)", "Autofill", "Merge & Center", "Ctrl + P"], 0, "Saralab ko'rsatish."),
          ],
        }),
        lesson({
          title: "Diagramma chizish",
          theory: `### 📊 17-Mavzu: Excelda diagramma chizish

**Diagramma** — jadvaldagi sonlarni rasm ko'rinishida ifodalash. U ma'lumotni tez tushunish va taqqoslashga yordam beradi.

#### Diagramma yaratish
- Jadvaldagi ma'lumotlarni **sarlavhalari bilan birga** belgilang (masalan, A1:B6).
- **Вставка / Insert → Диаграммы / Charts** guruhidan turini tanlang.
- Yoki **Рекомендуемые диаграммы / Recommended Charts** — Excel o'zi mosini taklif qiladi.
- Tezkor usul: ma'lumotlarni belgilab **Alt + F1** bosing.

#### Diagramma turlari
- **Gistogramma (ustunli)** — qiymatlarni taqqoslash (masalan, oylar bo'yicha savdo).
- **Doiraviy (Круговая / Pie)** — butunning qismlarini foizda ko'rsatish (masalan, xarajatlar taqsimoti).
- **Chiziqli (График / Line)** — vaqt bo'yicha o'zgarish (masalan, harorat yoki narx dinamikasi).
- **Chiziqcha (Линейчатая / Bar)** — gorizontal ustunlar.

#### Diagrammani bezash
Diagramma tanlanganda **Конструктор диаграмм / Chart Design** tabi chiqadi:
- **Diagramma nomi** — ustiga bosib o'zgartiring.
- **Elementlar (+)** — o'qlar nomi, legenda, ma'lumot yorliqlari (qiymatlar).
- **Uslublar va ranglar** — tayyor dizaynlar.
- **Изменить тип диаграммы** — turini o'zgartirish.

> Jadvaldagi son o'zgarsa, diagramma ham avtomatik yangilanadi.`,
          practice: `- 6 oylik "Do'kon savdosi" jadvalini tuzing va gistogramma chizing.
- Oylik xarajatlaringiz bo'yicha doiraviy diagramma yarating va foizlarni ko'rsating.`,
          questions: [
            q("Excelda diagramma qaysi tab orqali qo'shiladi?", ["Главная (Home)", "Вставка (Insert)", "Данные (Data)", "Вид (View)"], 1, "Insert — qo'shish."),
            q("Butunning qismlarini foizda ko'rsatish uchun qaysi diagramma eng mos?", ["Chiziqli (Line)", "Gistogramma", "Doiraviy (Pie)", "Nuqtali"], 2, "Pirog shaklidagi diagramma."),
            q("Vaqt bo'yicha o'zgarishni (masalan, narx dinamikasini) ko'rsatish uchun qaysi diagramma mos?", ["Chiziqli (График / Line)", "Doiraviy", "Jadval", "Hech qaysi"], 0, "Chiziq vaqt o'qi bo'ylab o'zgaradi."),
            q("Jadvaldagi son o'zgarsa, diagramma bilan nima bo'ladi?", ["O'chib ketadi", "O'zgarmaydi", "Xato beradi", "Avtomatik yangilanadi"], 3, "Diagramma jadval bilan bog'langan."),
            q("Diagramma chizishdan oldin nima qilish kerak?", ["Ma'lumotlarni sarlavhalari bilan belgilash", "Faylni yopish", "Jadvalni o'chirish", "Kompyuterni qayta yoqish"], 0, "Excel qaysi ma'lumotni chizishni bilishi kerak."),
          ],
        }),
        lesson({
          title: "Amaliy hisob-kitoblar",
          points: 15,
          theory: `### 💼 18-Mavzu: Amaliy hisob-kitoblar

Excel bilimlarini real hayotiy vazifalarda qo'llaymiz.

#### 1. Ish haqi jadvali
Ustunlar: **F.I.Sh. | Oklad | Ishlangan kun | Hisoblangan | Soliq (12%) | Qo'lga tegadi**
- Hisoblangan: **=B2/22*C2** (oyda 22 ish kuni bo'lsa).
- Soliq: **=D2*12%** yoki **=D2*0,12**.
- Qo'lga tegadi: **=D2-E2**.
- Jami: ustun ostida **=SUM(F2:F10)**.

#### 2. Savdo hisoboti
Ustunlar: **Mahsulot | Narxi | Soni | Summa**
- Summa: **=B2*C2**, pastga sudrab nusxalang.
- Jami tushum: **=SUM(D2:D20)**.
- Eng ko'p sotilgan: **=MAX(C2:C20)**.
- O'rtacha narx: **=AVERAGE(B2:B20)**.
- Natijani diagramma bilan ko'rsating.

#### 3. Dars jadvali
- Satrlar — vaqt (8:30, 10:00...), ustunlar — hafta kunlari (Autofill bilan).
- Sarlavhani birlashtiring, chegara bering, fanlarni rang bilan ajrating.

#### Absolyut murojaat ($)
Agar formulani sudraganda bitta katak (masalan, soliq foizi H1 da) o'zgarmasligi kerak bo'lsa, **$** belgisi qo'yiladi: **=D2*$H$1**. Tez qo'yish — manzilni yozib **F4** bosing.`,
          practice: `- 5 xodim uchun ish haqi jadvalini tuzing, soliq va qo'lga tegadigan summani formulalar bilan hisoblang.
- 8 ta mahsulotdan iborat savdo hisobotini tuzib, jami tushumni hisoblang va diagramma chizing.`,
          questions: [
            q("Narx B2 da, soni C2 da bo'lsa, summa formulasi qanday?", ["=B2+C2", "=B2*C2", "=B2/C2", "=SUM(B2)"], 1, "Narx × son."),
            q("D2 katakdagi summaning 12% ini hisoblovchi formula qaysi?", ["=D2*12%", "=D2+12", "=D2/12", "=12-D2"], 0, "Foizni ko'paytirish orqali."),
            q("Formulani sudraganda katak manzili o'zgarmasligi uchun qaysi belgi qo'yiladi?", ["#", "%", "$", "&"], 2, "Absolyut murojaat belgisi."),
            q("Absolyut murojaatni ($) tez qo'yish uchun qaysi tugma bosiladi?", ["F1", "F2", "F12", "F4"], 3, "Manzilni yozib, shu tugmani bosing."),
            q("Eng ko'p sotilgan mahsulot sonini topish uchun qaysi funksiya ishlatiladi?", ["MIN", "MAX", "COUNT", "AVERAGE"], 1, "Eng katta qiymat."),
          ],
        }),
        lesson({
          title: "Internetga kirish va brauzerlar bilan ishlash",
          theory: `### 🌐 19-Mavzu: Internet va brauzerlar

**Internet** — butun dunyodagi kompyuterlarni bog'lovchi global tarmoq. **Veb-sayt** — internetdagi sahifalar to'plami.
**Brauzer** — saytlarni ochish dasturi: **Google Chrome**, **Microsoft Edge**, Mozilla Firefox, Opera, Yandex Browser.

#### Brauzer qismlari
- **Manzil qatori (Address bar)** — sayt manzili yoziladi: **https://www.google.com**
- **Tablar (vkladkalar)** — bir oynada bir nechta sayt ochish. Yangi tab: **Ctrl + T**, yopish: **Ctrl + W**.
- **Orqaga / Oldinga** strelkalari va **Yangilash** (**F5**).
- **Xatcho'plar (Закладки / Bookmarks)** — sevimli saytni saqlash: **Ctrl + D**.
- **Tarix (History)** — **Ctrl + H**. **Yuklab olinganlar** — **Ctrl + J**.

#### Sayt manzili tuzilishi
**https://www.kun.uz** — **https** (xavfsiz ulanish, qulf belgisi), **www** (World Wide Web), **kun** (sayt nomi), **.uz** (domen — O'zbekiston). Boshqa domenlar: .com, .org, .ru, .edu.

#### Qidiruv tizimlari
**Google**, Yandex, Bing. Qidiruv qatoriga kalit so'zlarni yozing va Enter bosing.
- Aniq ibora: qo'shtirnoq ichida — "kompyuter savodxonligi kursi".
- Faqat bitta saytdan: **site:uz** yoki **site:kun.uz** dollar kursi.
- Rasm qidirish: **Картинки / Images** bo'limi.

#### Inkognito rejimi
**Ctrl + Shift + N** (Chrome) — tarix va parollar saqlanmaydi. Begona kompyuterda foydalanish uchun qulay.`,
          practice: `- Chrome yoki Edge'da 3 ta tab oching: google.com, kun.uz, my.gov.uz.
- Google'da "Excel formulalar" iborasini qidiring va bitta saytni xatcho'pga saqlang.`,
          questions: [
            q("Brauzer nima?", ["Matn muharriri", "Veb-saytlarni ochish dasturi", "Antivirus", "Operatsion tizim"], 1, "Chrome, Edge — bular..."),
            q("Brauzerda yangi tab ochish kombinatsiyasi qaysi?", ["Ctrl + T", "Ctrl + W", "Ctrl + S", "Ctrl + B"], 0, "T — Tab."),
            q("Sayt manzilidagi \"https\" va qulf belgisi nimani bildiradi?", ["Sayt pullik", "Sayt yopiq", "Ulanish xavfsiz (shifrlangan)", "Sayt eskirgan"], 2, "S — secure (xavfsiz)."),
            q("Quyidagilardan qaysi biri qidiruv tizimi?", ["Microsoft Word", "Excel", "Windows", "Google"], 3, "Qidiruv uchun eng mashhur sayt."),
            q("Tarix saqlanmaydigan maxfiy rejim nima deyiladi?", ["Inkognito rejimi", "Uyqu rejimi", "Xatcho'p", "To'liq ekran"], 0, "Chrome'da Ctrl + Shift + N."),
          ],
        }),
        lesson({
          title: "Elektron pochta (Email) ochish va ishlatish",
          theory: `### 📧 20-Mavzu: Elektron pochta (Email)

**Elektron pochta (email)** — internet orqali xat va fayllar yuborish xizmati. Email manzil tuzilishi: **ism.familiya@gmail.com** — **ism.familiya** (login), **@** ("kuchukcha" belgisi), **gmail.com** (pochta xizmati).

#### Gmail hisob ochish
- **gmail.com** saytiga kiring → **Создать аккаунт / Create account** → **Для себя / For myself**.
- Ism, familiya, tug'ilgan sana va jinsni kiriting.
- Login (manzil) tanlang — masalan, ali.valiyev2026.
- Kuchli parol o'ylab toping va tasdiqlang.
- Telefon raqamingizni kiriting va SMS kod bilan tasdiqlang.
- Shartlarga rozilik bildiring — hisob tayyor! Bu hisob YouTube, Google Drive va Play Market uchun ham ishlaydi.

#### Xat yuborish
- **Написать / Compose** tugmasini bosing.
- **Кому / To** — qabul qiluvchining email manzili.
- **Тема / Subject** — xat mavzusi (qisqa va aniq).
- Xat matnini yozing → **Отправить / Send**.

#### Fayl jo'natish
Xat yozish oynasida **qisqich (📎) belgisi — Прикрепить файл / Attach** → faylni tanlang. Gmail'da 25 MB gacha fayl biriktiriladi, kattaroq fayllar avtomatik **Google Drive** havolasi sifatida yuboriladi.

#### Pochta bo'limlari
- **Входящие / Inbox** — kelgan xatlar.
- **Отправленные / Sent** — yuborilgan xatlar.
- **Черновики / Drafts** — saqlangan qoralamalar.
- **Спам / Spam** — shubhali va reklama xatlar.
- **Корзина / Trash** — o'chirilgan xatlar.
- **Ответить / Reply** — javob berish, **Переслать / Forward** — xatni boshqaga yuborish.`,
          practice: `- Gmail hisob oching (yoki mavjudiga kiring).
- Guruhdoshingizga mavzusi bor xat yozing va unga CV faylingizni biriktirib yuboring.`,
          questions: [
            q("To'g'ri yozilgan email manzil qaysi?", ["ali.valiyev.gmail.com", "ali.valiyev@gmail.com", "ali valiyev@gmail", "@ali.valiyev"], 1, "Login, @ belgisi va pochta xizmati."),
            q("Xatga fayl biriktirish belgisi qaysi?", ["Qisqich (📎)", "Yulduzcha (⭐)", "Savat (🗑)", "Qulf (🔒)"], 0, "Attach — biriktirish."),
            q("Xat yozishda qabul qiluvchi manzili qaysi maydonga yoziladi?", ["Тема (Subject)", "Matn qismi", "Кому (To)", "Черновики"], 2, "Kimga yuborilyapti?"),
            q("Shubhali va reklama xatlar odatda qaysi bo'limga tushadi?", ["Входящие (Inbox)", "Отправленные (Sent)", "Черновики (Drafts)", "Спам (Spam)"], 3, "Keraksiz xatlar papkasi."),
            q("Kelgan xatni boshqa odamga yuborish tugmasi qaysi?", ["Ответить (Reply)", "Переслать (Forward)", "Удалить (Delete)", "Архив"], 1, "Forward — oldinga yuborish."),
          ],
        }),
        lesson({
          title: "Onlayn xavfsizlik va parollar",
          theory: `### 🔐 21-Mavzu: Onlayn xavfsizlik va parollar

#### Yaxshi parol qanday bo'ladi?
- Kamida **12 ta belgi**.
- **Katta va kichik harflar, raqamlar va maxsus belgilar** (!, @, #, $) aralash.
- Ism, tug'ilgan sana, telefon raqami yoki **123456**, **qwerty**, **password** kabi oson so'zlar **bo'lmasin**.
- Har bir sayt uchun **alohida** parol.
- Misol: **Olma!Yashil7Daraxt** — eslab qolish oson, topish qiyin.

#### Ikki bosqichli himoya (2FA)
Parol bilan birga telefonga keladigan **SMS kod** yoki ilova orqali tasdiqlash. Parol o'g'irlansa ham, hisob himoyalangan bo'ladi. Gmail, Telegram, bank ilovalarida albatta yoqing.

#### Fishing (firibgarlik) — ehtiyot bo'ling!
**Fishing** — firibgarlar soxta sayt, xat yoki xabar orqali parol, karta raqami yoki SMS kodni o'g'irlashi.
Belgilari:
- "Siz yutdingiz!", "Hisobingiz bloklanadi, zudlik bilan kiring!" kabi shoshiltiruvchi xabarlar.
- Manzili asl saytga o'xshash, lekin farq qiluvchi saytlar: **g00gle.com**, **paynne-uz.com**.
- Noma'lum odamdan kelgan havola yoki fayl (.apk, .exe).
- Karta raqami, **CVV kod** yoki **SMS kodni** so'rash.

> **Oltin qoida:** SMS kod, karta PIN-kodi va parolingizni **hech kimga** — hatto "bank xodimi" yoki "do'stingizga" ham bermang! Rasmiy tashkilotlar buni hech qachon so'ramaydi.

#### Boshqa xavfsizlik qoidalari
- Antivirus o'rnating va Windowsni yangilab turing.
- Ommaviy Wi-Fi'da bank ilovalaridan foydalanmang.
- Begona kompyuterda ishlagach, hisobdan **chiqing (Выйти / Log out)**.
- Muhim fayllarning zaxira nusxasini (backup) saqlang.`,
          practice: `- Gmail hisobingizda ikki bosqichli himoyani (2FA) yoqing.
- O'zingiz uchun yuqoridagi qoidalarga mos kuchli parol namunasini tuzing (lekin hech kimga ko'rsatmang).`,
          questions: [
            q("Quyidagi parollardan qaysi biri eng kuchli?", ["123456", "Olma!Yashil7Daraxt", "qwerty", "Ali2005"], 1, "Uzun, aralash belgili parol."),
            q("Fishing nima?", ["Soxta sayt yoki xabar orqali parol va ma'lumotlarni o'g'irlash", "Baliq ovlash o'yini", "Antivirus dasturi", "Internet tezligi"], 0, "Firibgarlik usuli."),
            q("\"Bank xodimi\" qo'ng'iroq qilib SMS kodni so'rasa nima qilish kerak?", ["Kodni aytish", "Karta raqamini ham aytish", "Hech qachon aytmaslik va qo'ng'iroqni tugatish", "Kodni do'stga yuborish"], 2, "Rasmiy tashkilotlar kod so'ramaydi."),
            q("Ikki bosqichli himoya (2FA) nima?", ["Ikkita kompyuter", "Ikkita brauzer", "Ikki marta parol yozish", "Parol + telefonga keladigan qo'shimcha kod"], 3, "Qo'shimcha tasdiqlash bosqichi."),
            q("Qaysi sayt manzili shubhali (fishing)?", ["google.com", "g00gle-login.com", "gmail.com", "my.gov.uz"], 1, "Harflar o'rniga raqamlar ishlatilgan."),
          ],
        }),
        lesson({
          title: "Word va Excel bo'yicha umumiy takrorlash",
          points: 15,
          theory: `### 🔁 22-Mavzu: Word va Excel bo'yicha umumiy takrorlash

#### Word — asosiy bilimlar
- Fayl kengaytmasi: **.docx**. Saqlash: **Ctrl + S**, PDF ga: Save As → PDF.
- Shrift: **Ctrl + B** (qalin), **Ctrl + I** (kursiv), **Ctrl + U** (tagiga chizish).
- Tekislash: **Ctrl + L / E / R / J**.
- Rasm, jadval, diagramma, shakllar — **Вставка (Insert)** tabi.
- Sahifa chegaralari — **Макет (Layout)**. Stillar — **Главная → Стили**.

#### Excel — asosiy bilimlar
- Fayl kengaytmasi: **.xlsx**. Katak manzili: **ustun harfi + satr raqami** (B3).
- Formula **=** bilan boshlanadi: **=SUM()**, **=AVERAGE()**, **=MAX()**, **=MIN()**, **=IF()**.
- Autofill — to'ldirish markerini sudrash. Absolyut murojaat — **$A$1** (F4).
- Tartiblash va filtr — **Данные (Data)** tabi. Diagramma — **Вставка (Insert)**.
- Chegara, rang, Merge & Center — **Главная (Home)**.

#### 🏁 Kichik loyiha (nazorat ishi)
- **Word:** "O'quv markazim" haqida 1 sahifalik hujjat: sarlavha (Heading 1), 2 paragraf, rasm va 3×4 jadval.
- **Excel:** 10 o'quvchining 3 fandan baholari jadvali: har bir o'quvchi uchun **o'rtacha baho (AVERAGE)**, **natija (=IF(o'rtacha>=4;"A'lo";"Yaxshi"))**, eng yuqori baho (MAX), o'rtacha baho bo'yicha saralash va ustunli diagramma.`,
          practice: `- Yuqoridagi kichik loyihaning Word va Excel qismlarini bajaring va ustozingizga email orqali yuboring.`,
          questions: [
            q("Wordda matnni kursiv qilish kombinatsiyasi qaysi?", ["Ctrl + B", "Ctrl + I", "Ctrl + U", "Ctrl + K"], 1, "I — Italic."),
            q("Excelda B2:B11 kataklarning o'rtachasini hisoblovchi formula qaysi?", ["=AVERAGE(B2:B11)", "=SUM(B2:B11)", "=B2+B11", "=MAX(B2:B11)"], 0, "O'rtacha qiymat funksiyasi."),
            q("Word va Excelda rasm yoki diagramma qo'shish qaysi tabda?", ["Главная (Home)", "Данные (Data)", "Вставка (Insert)", "Вид (View)"], 2, "Insert — qo'shish."),
            q("=IF(C2>=4;\"A'lo\";\"Yaxshi\") formulasi C2=5 bo'lsa nima qaytaradi?", ["Yaxshi", "5", "Xato", "A'lo"], 3, "5 >= 4 sharti bajariladimi?"),
            q("Excelda saralash va filtr qaysi tabda joylashgan?", ["Вставка (Insert)", "Данные (Data)", "Макет (Layout)", "Рецензирование (Review)"], 1, "Ma'lumotlar tabi."),
          ],
        }),
        lesson({
          title: "Sertifikatga tayyorgarlik",
          theory: `### 🎓 23-Mavzu: Sertifikatga tayyorgarlik

Bu mavzuda kurs davomida o'rganilgan barcha bilimlarni mustahkamlaymiz.

#### Kompyuter va Windows
- Qismlar: monitor, sistemali blok, klaviatura, sichqoncha. Hardware — qurilma, software — dastur.
- Operatsion tizim — Windows; ish stoli, taskbar, Start menyu.
- Fayllar: nusxalash (**Ctrl + C / V**), ko'chirish (**Ctrl + X / V**), qayta nomlash (**F2**), o'chirish (**Delete** → Korzina).
- Qisqa tugmalar: **Ctrl + Z** (bekor qilish), **Ctrl + S** (saqlash), **Ctrl + A** (hammasi), **Alt + Tab** (oynalar).
- Fleshka: ulash, xavfsiz chiqarish, formatlash (fayllar o'chadi!).
- Dasturlar: setup.exe orqali o'rnatish, Control Panel orqali o'chirish.

#### Office dasturlari
- **Word** — hujjatlar (.docx): shrift, paragraf, stillar, rasm, jadval, CV va ariza.
- **Excel** — jadvallar (.xlsx): katak, formula (=), SUM, AVERAGE, Autofill, tartiblash, diagramma.
- **PowerPoint** — taqdimotlar (.pptx).

#### Internet va xavfsizlik
- Brauzerlar: Chrome, Edge. Qidiruv: Google. Xavfsiz sayt — **https** va qulf belgisi.
- Email: login@gmail.com, xat yuborish, fayl biriktirish (📎).
- Kuchli parol, 2FA, fishingdan ehtiyot bo'lish, SMS kodni hech kimga bermaslik.

> **Imtihon maslahati:** savolni oxirigacha o'qing, avval aniq noto'g'ri javoblarni chiqarib tashlang, so'ng qolganlari ichidan tanlang.`,
          practice: `- O'zingizni sinab ko'ring: barcha qisqa tugmalarni yozma ravishda eslab, keyin darslar bilan solishtiring.`,
          questions: [
            q("Hardware va software haqida qaysi fikr to'g'ri?", ["Hardware — dastur, software — qurilma", "Hardware — qurilma, software — dastur", "Ikkalasi ham dastur", "Ikkalasi ham qurilma"], 1, "Hard — qattiq, jismoniy."),
            q("Taqdimot (slaydlar) yaratish uchun qaysi dastur ishlatiladi?", ["PowerPoint", "Excel", "Word", "Paint"], 0, "Fayl kengaytmasi .pptx."),
            q("Qaysi kombinatsiya oxirgi amalni bekor qiladi?", ["Ctrl + S", "Ctrl + A", "Ctrl + Z", "Alt + Tab"], 2, "Undo."),
            q("Excelda formulani nusxalab ko'p satrga tez qo'llash uchun nima ishlatiladi?", ["Filtr", "Diagramma", "Ctrl + P", "To'ldirish markeri (Autofill)"], 3, "Pastki o'ng burchakdagi kvadratcha."),
            q("Xavfsiz sayt belgisi qaysi?", ["Manzilda https va qulf belgisi", "Ko'p reklama", "Yorqin ranglar", "\"Siz yutdingiz!\" yozuvi"], 0, "S — secure."),
          ],
        }),
        lesson({
          title: "Yakuniy baholash va natija",
          points: 20,
          theory: `### 🏆 24-Mavzu: Yakuniy baholash va natija

Tabriklaymiz — siz kursning yakuniy bosqichiga yetib keldingiz! Bu mavzuda har bir o'quvchining ko'nikmalari tekshiriladi va baholanadi.

#### Yakuniy amaliy topshiriq (ustoz nazoratida)
- **Windows (10 ball):** "Yakuniy_ish_Ism" papkasini yarating, ichida Word va Excel papkalarini oching, fayllarni nusxalang/ko'chiring.
- **Word (30 ball):** O'zingiz haqingizda CV tayyorlang: rasm, jadval, stillar, to'g'ri formatlash. PDF formatida saqlang.
- **Excel (30 ball):** "Oylik oila byudjeti" jadvali: daromad va xarajatlar, SUM va AVERAGE formulalari, qoldiq hisobi, doiraviy diagramma.
- **Internet va Email (20 ball):** Tayyor fayllarni ustoz emailiga mavzusi bilan, fayllarni biriktirib yuboring.
- **Xavfsizlik (10 ball):** Kuchli parol qoidalari va fishing belgilarini og'zaki tushuntiring.

#### Baholash mezonlari
- **86–100 ball** — A'lo
- **71–85 ball** — Yaxshi
- **56–70 ball** — Qoniqarli

#### Platformadagi sertifikat
Ushbu yo'nalishdagi **barcha mavzular testidan** muvaffaqiyatli o'tsangiz, yuqoridagi **"Sertifikatni Olish"** tugmasi faollashadi va sizga unikal ID raqamli **TH Mind sertifikati** beriladi. Sertifikat haqiqiyligini istalgan kishi "Tekshiruv" bo'limida ID orqali tekshira oladi.

> Quyidagi yakuniy test kurs davomidagi barcha mavzularni qamrab oladi. Omad!`,
          questions: [
            q("Faylni butunlay (Korzinasiz) o'chirish kombinatsiyasi qaysi?", ["Delete", "Shift + Delete", "Ctrl + Z", "Alt + F4"], 1, "Delete bilan yordamchi tugma."),
            q("Excelda =SUM(A1:A3) formulasi A1=2, A2=3, A3=5 bo'lsa nechani qaytaradi?", ["10", "5", "30", "2"], 0, "2 + 3 + 5."),
            q("Wordda sahifa raqamini qo'shish qaysi tabda?", ["Главная (Home)", "Вид (View)", "Вставка (Insert)", "Рецензирование (Review)"], 2, "Qo'shish tabi."),
            q("Elektron pochtada \"Тема (Subject)\" maydoniga nima yoziladi?", ["Parol", "Qabul qiluvchi manzili", "Fayl", "Xatning qisqa mavzusi"], 3, "Xat nima haqida?"),
            q("Quyidagi harakatlardan qaysi biri XAVFSIZ?", ["Noma'lum havoladan .apk faylni o'rnatish", "Bir xil parolni hamma saytda ishlatish", "Hisobda ikki bosqichli himoyani yoqish", "SMS kodni operatorga aytish"], 2, "Qo'shimcha himoya qatlami."),
          ],
        }),
      ],
    },
    {
      title: "Bonus: PowerPoint",
      summary: "Slaydlar yaratish, rasm va matn joylashtirish, animatsiya.",
      sort_order: 3,
      tasks: [
        lesson({
          title: "PowerPoint dasturiga kirish",
          theory: `### 🎞️ Bonus mavzu: PowerPoint dasturiga kirish

**Microsoft PowerPoint** — taqdimotlar (prezentatsiyalar) yaratish dasturi. Taqdimot **slaydlardan** iborat bo'ladi va fayl **.pptx** kengaytmasiga ega.

#### Slaydlar yaratish
- PowerPoint → **Пустая презентация / Blank Presentation**.
- Birinchi slayd — **titul slayd** (sarlavha va qo'shimcha matn).
- Yangi slayd: **Главная → Создать слайд / New Slide** yoki **Ctrl + M**.
- **Макет / Layout** — slayd tuzilishini tanlash (sarlavha va matn, ikki ustun, faqat sarlavha...).
- Chapdagi slaydlar ro'yxatida slaydlarni sudrab tartibini o'zgartirish, o'ng tugma bilan nusxalash yoki o'chirish mumkin.

#### Dizayn
**Дизайн / Design** tabi — tayyor mavzular (temalar), ranglar va fon. **Конструктор / Designer** — slayd uchun chiroyli dizayn variantlarini taklif qiladi.

#### Rasm va matn joylashtirish
- Matn: slayddagi **"Заголовок слайда"** maydoniga bosib yozing. Yangi matn maydoni: **Вставка → Надпись / Text Box**.
- Rasm: **Вставка → Рисунки / Pictures**. Shuningdek jadval, diagramma, video, shakllar ham qo'shiladi.

#### Animatsiya va o'tishlar
- **Анимация / Animations** — slayddagi obyektlarga (matn, rasm) harakat berish: Появление (Paydo bo'lish), Выцветание (Xiralashish), Вылет (Uchib kirish).
- **Переходы / Transitions** — bir slayddan boshqasiga o'tish effekti.
- Me'yorni saqlang: animatsiya ko'p bo'lsa, tinglovchi chalg'iydi.

#### Taqdimotni namoyish qilish
- **F5** — boshidan namoyish. **Shift + F5** — joriy slayddan.
- Keyingi slayd: **strelka →**, **Enter** yoki sichqoncha bosish. Chiqish: **Esc**.

> **Yaxshi taqdimot qoidasi:** bir slaydda kam matn (5–6 qator), katta shrift (24+), sifatli rasmlar va bir xil uslub.`,
          practice: `- "Mening kasbim" mavzusida 5 slaydli taqdimot tayyorlang: titul, 3 ta mazmunli slayd (rasm bilan) va "E'tiboringiz uchun rahmat" slaydi.
- Har bir slaydga o'tish effekti va sarlavhalarga animatsiya qo'shing, F5 bilan namoyish qiling.`,
          questions: [
            q("PowerPoint fayli kengaytmasi qaysi?", [".docx", ".pptx", ".xlsx", ".pdf"], 1, "\"ppt\" — PowerPoint."),
            q("Yangi slayd qo'shish kombinatsiyasi qaysi?", ["Ctrl + M", "Ctrl + S", "Ctrl + N", "Ctrl + P"], 0, "Главная → Создать слайд."),
            q("Taqdimotni boshidan namoyish qilish tugmasi qaysi?", ["F2", "F12", "F5", "Esc"], 2, "Yangilash tugmasi bilan bir xil."),
            q("Slayddagi matn yoki rasmga harakat effekti qaysi tabda beriladi?", ["Дизайн (Design)", "Вставка (Insert)", "Вид (View)", "Анимация (Animations)"], 3, "Animatsiya."),
            q("Yaxshi taqdimot uchun qaysi qoida to'g'ri?", ["Bir slaydga iloji boricha ko'p matn yozish", "Kam matn, katta shrift va sifatli rasmlar", "Har bir so'zga animatsiya qo'shish", "Faqat mayda shrift ishlatish"], 1, "Tinglovchiga qulay bo'lishi kerak."),
          ],
        }),
      ],
    },
  ],
};
