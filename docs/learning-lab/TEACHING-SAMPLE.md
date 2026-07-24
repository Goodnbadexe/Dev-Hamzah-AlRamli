# Learning Lab — Teaching-Style Sample (DRAFT for owner sign-off)

> The pre-payment trust artifact required by USAGE-RULES ("a small example showing the
> teaching style") and PRD §7. Topic: binary numbers (neutral, universal). It visibly walks
> the progressive-teaching loop: explain → connect → demonstrate → reproduce → check →
> identify the gap → explain why → next step. ≤5 minutes to read.
> **Both language versions are drafts — Hamzah reviews, edits into his own voice, and signs
> off before launch.** Renders on /learn as the "sample.module" section.

---

## EN version

### SAMPLE MODULE — How computers count (binary, in 5 minutes)

**1 · The idea, simply.** You count with ten symbols (0–9) because you have ten fingers.
A computer has one "finger" that's either ON or OFF. So it counts with two symbols: 0 and 1.
That's all binary is — counting when you only own two symbols.

**2 · Connect it to something you know.** When you pass 9, you write 10 — "one group of ten,
zero left over." Binary does the identical move, just earlier: pass 1, write 10 — "one group
of TWO, zero left over." Same rule you've used since childhood; smaller group size.

**3 · Watch it work.** Count to five in both systems:
`0, 1, 2, 3, 4, 5` ↔ `0, 1, 10, 11, 100, 101`.
Read `101` right-to-left as slots worth 1, 2, 4: one 4 + zero 2 + one 1 = **5**.

**4 · Your turn.** Without looking up: what is `110` in normal numbers?
(Slots right-to-left: 1, 2, 4.)

**5 · Check yourself.** If you said **6** — correct: zero 1 + one 2 + one 4.
If you said 3, you read the slots left-to-right — that's the single most common beginner slip.

**6 · Why that mistake happens.** We read text left-to-right, but number slots grow
right-to-left (in every base — 123 means 3 ones, 2 tens, 1 hundred). Your habit collided
with the system's rule. Now you know the rule, the habit stops winning.

**7 · What would come next.** In your personalized path this unlocks the next verified step:
why 8 slots make a byte, why `11111111` = 255, and why that number shows up everywhere —
from RGB colors to IP addresses.

*This is how every module works: you don't memorize my answer — you reproduce the reasoning,
we catch the exact place it breaks, and the next step unlocks when this one is truly yours.*

---

## AR version (draft — needs owner native review)

### وحدة تجريبية — كيف يعدّ الحاسوب (النظام الثنائي في ٥ دقائق)

**١ · الفكرة ببساطة.** أنت تعدّ بعشرة رموز (٠–٩) لأن لديك عشرة أصابع. الحاسوب لديه "إصبع"
واحد فقط: إمّا مُشغَّل أو مُطفأ. لذلك يعدّ برمزين فقط: 0 و 1. هذا كل ما في النظام الثنائي —
عَدٌّ لا تملك فيه سوى رمزين.

**٢ · اربطها بما تعرفه.** عندما تتجاوز ٩ تكتب 10 — أي "مجموعة واحدة من عشرة، ولا شيء زائد".
النظام الثنائي يفعل الحركة نفسها لكن أبكر: تتجاوز 1 فتكتب 10 — "مجموعة واحدة من اثنين،
ولا شيء زائد". القاعدة ذاتها التي تستخدمها منذ الطفولة؛ فقط حجم المجموعة أصغر.

**٣ · شاهدها تعمل.** العدّ حتى خمسة في النظامين:
`0, 1, 2, 3, 4, 5` ↔ `0, 1, 10, 11, 100, 101`.
اقرأ `101` من اليمين إلى اليسار كخانات قيمتها 1 و2 و4: أربعة واحدة + اثنان صفر + واحد واحد = **٥**.

**٤ · دورك الآن.** دون البحث: ما قيمة `110` بالأرقام العادية؟ (الخانات من اليمين: 1، 2، 4.)

**٥ · تحقق من إجابتك.** إذا قلت **٦** — صحيح: صفر×1 + واحد×2 + واحد×4.
وإذا قلت ٣ فقد قرأت الخانات من اليسار إلى اليمين — وهذا أكثر خطأ شائع لدى المبتدئين.

**٦ · لماذا يحدث هذا الخطأ؟** نحن نقرأ النص من اتجاه واحد، لكن خانات الأرقام تكبر من اليمين
إلى اليسار في كل الأنظمة (123 تعني ٣ آحاد و٢ عشرات و١ مئة). عادتك اصطدمت بقاعدة النظام.
والآن بعد أن عرفت القاعدة، لن تنتصر العادة.

**٧ · ما الخطوة التالية؟** في مسارك الشخصي تُفتح الخطوة المؤكدة التالية: لماذا ٨ خانات تصنع
"بايت"، ولماذا `11111111` تساوي 255، ولماذا يظهر هذا الرقم في كل مكان — من ألوان RGB إلى
عناوين IP.

*هكذا تعمل كل وحدة: لا تحفظ إجابتي — بل تعيد إنتاج طريقة التفكير، نكتشف معًا النقطة التي
تنكسر عندها بالضبط، ولا تُفتح الخطوة التالية إلا عندما تصبح هذه الخطوة ملكك فعلًا.*
