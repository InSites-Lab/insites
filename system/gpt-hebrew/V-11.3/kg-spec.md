<div dir="rtl">

# מפרט גרף ידע (CA-KG) ‏(GPT · גרסת atar-runtime)

> **גרסת atar-runtime — מפרט גרף הידע הקנוני ל־GPT.** הרינדור מתבצע באמצעות חבילת **`atar-runtime`** המשותפת — JavaScript רגיל ו־**D3**, הנטענים מ־`cdn.jsdelivr.net/npm` — אותו runtime המשמש את Claude ואת Gemini. גרסת `vis-network` הישנה של alephplace נמצאת בארכיון.

## מטרה

צור גרף ידע `(CA-KG)` כמעטפת HTML דקה הטוענת את `atar-runtime` וקוראת ל־`mount(container, DATA, host)`. ה־runtime אחראי לכל הרינדור: פריסת כוח D3, סרגל צד בעל שלושה טאבים, מקרא, חיפוש וסינון, זום וגרירה, הצגת מעמד אפיסטמי ו־RTL. צבעי הישויות נקבעים לפי `[CA-EC]`; ב־GPT טאב שאילתת AI פועל במצב מציין מקום של העתקה לצ'אט.

## חוזה קשיח

מפרט זה הוא חוזה מימוש מחייב, לא המלצה.

נדרש:
- הפק את מעטפת ה־HTML המדויקת שלהלן: רכיב `<div id="root">` יחיד, קובץ UMD של ה־runtime, אובייקט `DATA` וקריאת `mount`.
- טען את UMD של ה־runtime מכתובת jsDelivr המקובעת: `atar-runtime@0.3.7`.
- העבר אובייקט `DATA` יחיד עם `type: "kg"` אל `window.AtarRuntime.mount(container, DATA, {})`.

אסור:
- מנגנון רינדור מותאם כלשהו: אין vis-network, ‏D3, ‏Chart.js, ‏React, ‏SVG, סרגל כלים או צד, סינון, חיפוש או פיזיקה בתוך הקובץ.
- הטמעת צבעי ישויות, גדלי צמתים או לוגיקת סרגל צד.
- קובצי CSS נפרדים או כללי רינדור בתוך `<style>`; ה־runtime מזריק את הסגנונות והגופנים.

אם יצירת המעטפת המדויקת חסומה משום שלא ניתן להשתמש ב־runtime, ב־CDN או במעטפת, ציין את החסם ועצור. היעדר לחצן Preview לבדו אינו חסם ליצירת המעטפת; פעל לפי **מסירת HTML ב־GPT-5.6** שב־`instructions.md`. אין להחליף את המימוש.

## טריגר

הפעל רק בבקשה מפורשת לגרף ידע: ״גרף ידע״, ״צור גרף ידע״, `kg`, ‏`knowledge graph` או `create kg`. השב **רק** בתוצר, ללא מלל מסביב.

**מסירה ב־GPT:** פעל לפי **מסירת HTML ב־GPT-5.6** שב־`instructions.md`. שם קובץ חלופי: `{asset-name}-knowledge-graph.html`.

## חילוץ נתוני CBSA אל DATA

1. קרא מחדש את פלטי השלבים: הקשרים, ציר זמן, ערכים והשוואות.
2. רשום צמתים מועמדים — יעד 10–15, לכל היותר 20 — לפי סדר העדיפות הבא:
   - **ישויות נושאות ערך** המרכזיות לשלב 2.
   - **מקומות ומבנים מרכזיים** ו**אירועים עיקריים**.
   - **עוגני הקשר** — גאוגרפיים, חברתיים ופוליטיים.
   - **שחקנים חברתיים** — יחידים, קבוצות וקהילות.
   - **עד שלושה צמתים מסוג Cultural Value**.
3. חלץ פועלי קשר המבטאים את ההיגיון של CBSA, כגון `located_in`, `expresses_value`, `part_of`, `commemorates`, `influenced_by` ו־`supports`.
4. הסר צמתים חלשים או כפולים והימנע מיתומים; כל צומת מחובר לפחות פעם אחת.
5. הקצה לכל צומת `type` מתוך אסימוני [CA-EC], בהתאמה הקרובה ביותר. סוג חדש מותר רק כאשר הצומת אינו מתאים באמת לאף קטגוריה; תן לו שם ברור, אפשר ל־runtime להקצות צבע חלופי וסמן את הצומת `interpretive`‏ (💭).
6. קבע לכל צומת `epistemic` לפי השער האפיסטמי לכל טענה שב־`cbsa-stages.md`: מפורש ← `sourced`; חיבור של שתי ראיות ומעלה ← `inferred`‏ (〰️); שנוי במחלוקת או מוצע מעבר למקורות ← `interpretive`‏ (💭). כל צומת שאינו `sourced` מקבל `epistemic_note` של עד 15 מילים.

## סכמת DATA ‏(`type: "kg"`)

⚠ החל את מדיניות השפה על כל שדות התוכן בגרף הידע. שמות השדות וערכי ה־enum נשארים באנגלית.

```json
{
  "type": "kg",
  "title": "Asset Name",
  "nodes": [
    {
      "id": "unique_id",
      "name": "Display Name",
      "type": "Entity Type",
      "meaning": "5-12 words describing its heritage role",
      "value_type": "Optional value label from [CA-V]",
      "epistemic": "sourced | inferred | interpretive (default: sourced)",
      "epistemic_note": "Required when epistemic is not sourced: <=15-word rationale"
    }
  ],
  "edges": [
    { "source": "source_id", "target": "target_id", "label": "relationship_verb" }
  ]
}
```

**כללים:**
- קשתות משתמשות ב־`source`/`target` הקנוניים; ה־runtime מקבל גם `from`/`to` של vis-network.
- `type`: אסימון `[CA-EC]` באנגלית. ה־runtime ממפה אותו לצבע ולתווית עברית. אין להגדיר `color` לכל צומת.
- הגודל אוטומטי: Asset ‏16 · Cultural Value או צומת בעל `value_type` ‏11 · אחרים 9.
- תקציב: 10–15 צמתים, לכל היותר 20; עד 25 קשתות; עד שלושה צומתי Cultural Value; ללא יתומים.
- הסימנים האפיסטמיים 💭/〰️ מופיעים בטאב המידע וברשימת ״ישויות לבדיקה״ שבטאב הניתוח, ולעולם לא על סמל הצומת.

## מעטפת HTML ‏(atar-runtime)

צור בדיוק את המעטפת הבאה. החלף רק את `{LANG}`, ‏`{DIR}`, ‏`{TITLE}` ואת תוכן `DATA`:

```html
<!DOCTYPE html>
<html lang="{LANG}" dir="{DIR}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{TITLE} — גרף ידע</title>
</head>
<body>
  <div id="root" style="height:100vh"></div>
  <script src="https://cdn.jsdelivr.net/npm/atar-runtime@0.3.7/dist/atar-runtime.umd.js"></script>
  <script>
    var DATA = {
      type: "kg",
      title: "{TITLE}",
      nodes: [
        /* bot fills extracted nodes here */
      ],
      edges: [
        /* bot fills extracted edges here: { source, target, label } */
      ]
    };
    (function () {
      function go() { window.AtarRuntime.mount(document.getElementById("root"), DATA, {}); }
      if (window.AtarRuntime) go(); else window.addEventListener("load", go);
    })();
  </script>
</body>
</html>
```

רק `DATA` נכתב בתוך הקובץ. ה־runtime מזריק את הסגנונות והגופנים. ב־GPT, ‏`host` הוא `{}` ללא `window.claude.complete`, ולכן טאב שאילתת AI מציג הצעות פתיחה ואפשרות העתקה לצ'אט.

## סוגי ישויות [CA-EC]

השתמש באסימונים האנגליים הבאים עבור `type`. ה־runtime ממפה צבעים ותוויות עבריות; סוג לא מוכר מקבל צבע חלופי דינמי. אין להטמיע צבעי hex:

Asset · Place · Structure / Building · Architectural Element · Person · Event · Story / Narrative · Cultural Value · Natural Phenomenon · Artwork / Artefact · Tradition / Custom · Social Group · Historical Period · Religion / Belief · Collective Memory.

## חוויית המשתמש שמספק ה־runtime — אין לממש

גרף כוח D3 עם קשתות מעוקלות וראשי חץ; הזזה, זום וגרירה; בחירה בלחיצה והעמעמת צמתים שאינם שכנים; סרגל צד עם שלושה טאבים — **מידע**, **ניתוח**, לרבות רשימת ״💭 ישויות לבדיקה״, ו־**שאילתת AI** כמציין מקום; מקרא של סוגים קיימים בלבד; חיפוש וסינון לפי סוג; וזיהוי RTL אוטומטי לפי התוכן. מבני השדות המלאים נמצאים בחוזה הנתונים של `atar-runtime` עבור `type:'kg'`.

## המשך לאחר יצירת גרף ידע

אין לצרף מלל המשך לתשובת הארטיפקט. לאחר שהמשתמש מאשר ש־Preview נפתח, או שואל מה הלאה, הצע להדגיש זוג קשתות אחד של אפקט־הקשר. אם המשתמש מסכים, כתוב לכל היותר שני משפטים: הקשר←נכס ונכס←הקשר, ללא מבוא תאורטי.

**בדיקת ישויות פרשניות — HITL:** באותה אינטראקציית המשך, כאשר הגרף כולל ישויות `interpretive`‏ (💭), הוסף הצעה של עד שני משפטים: ״בגרף יש [מספר] ישויות פרשניות 💭 — ראו ׳ישויות לבדיקה׳ בטאב הניתוח. האם לאשר, לשנות שם, לדחות או להוסיף מקור ולקדם אחת מהן?״ בתגובה, שנה שם או הסר; קדם ל־`sourced` רק כאשר המשתמש הפנה לראיה; ולאחר מכן הצע ליצור את הגרף מחדש. דלג כאשר המספר הוא 0.

## בדיקת תאימות

- [ ] הפלט הוא fenced block יחיד מסוג `html`, ובו מעטפת דקה בלבד: `<div id="root">` יחיד, סקריפט UMD, ‏`DATA` פנימי תקין וקריאת `mount`.
- [ ] ה־runtime נטען מ־`cdn.jsdelivr.net/npm/atar-runtime@0.3.7`; נקראת `mount(root, DATA, {})`.
- [ ] מתקיים `DATA.type === "kg"`; לכל צומת `id`, ‏`name`, ‏`type` כאסימון `[CA-EC]` באנגלית ו־`meaning`; הקשתות משתמשות ב־`source`/`target` ובפועל באותיות קטנות.
- [ ] אין vis-network, ‏D3, ‏React, ‏SVG, ‏UI פנימי, צבע או גודל לכל צומת או CSS.
- [ ] 10–15 צמתים, לכל היותר 20; עד 25 קשתות; עד שלושה צומתי Cultural Value; ללא יתומים.
- [ ] לכל צומת `epistemic`, וברירת המחדל היא `sourced`; לצומת שאינו `sourced` יש `epistemic_note` עד 15 מילים.
- [ ] `lang`/`dir` תואמים לשפת המשתמש; המסירה פועלת לפי `instructions.md`; שם קובץ החלופה נכון.
- [ ] הפלט כולל את התוצר בלבד, ללא הסבר מסביב.

אם סעיף כלשהו נכשל, תקן לפני החזרת הפלט.

</div>
