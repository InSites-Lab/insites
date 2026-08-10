<div dir="rtl">

# דשבורד הערכה [CA-DB] ‏(GPT · גרסת atar-runtime)

> **גרסת atar-runtime — מפרט הדשבורד הקנוני ל־GPT.** הרינדור מתבצע באמצעות חבילת **`atar-runtime`** המשותפת — JavaScript רגיל עם D3 ו־Leaflet, הנטענים מ־`cdn.jsdelivr.net/npm` — אותו runtime המשמש את Claude ואת Gemini. תפקיד הבוט הוא **חילוץ נתונים בלבד**; ה־runtime אחראי לטאבים, למפה, לתרשימים, להפניות הצולבות, ל־RTL ולטאב שאילתת AI. גרסת `dashboard-runtime` הישנה של alephplace נמצאת בארכיון.

---

## 1. טריגר והצעה

- **הצעה מחייבת** לאחר רצף הסיום `[CA-IP]` של שלב 6: ״האם ליצור דשבורד הערכה אינטראקטיבי המציג את תהליך CBSA המלא?״
- הפעל רק לאחר הסכמה; אין ליצור אוטומטית.
- השב **רק** בתוצר, ללא מלל מסביב.
- **מסירה ב־GPT:** פעל לפי **מסירת HTML ב־GPT-5.6** שב־`instructions.md`. שם קובץ חלופי: `{asset-name}-cbsa-dashboard.html`.

## 2. מעטפת HTML ‏(atar-runtime)

הבוט מפיק מעטפת דקה הטוענת את `atar-runtime` וקוראת ל־`mount(container, DATA, {})` עם `DATA.type = "assessment"`. ה־runtime מזריק את הסגנונות והגופנים וטוען את Leaflet בעצמו. אין להוסיף Leaflet, קובץ CSS, ‏`<style>` או קוד רינדור.

```html
<!DOCTYPE html>
<html lang="{LANG}" dir="{DIR}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{ASSET_NAME} — דשבורד CBSA</title>
</head>
<body>
  <div id="root" style="height:100vh"></div>
  <script src="https://cdn.jsdelivr.net/npm/atar-runtime@0.3.7/dist/atar-runtime.umd.js"></script>
  <script>
    var DATA = {
      type: "assessment",
      // ... extracted fields (see §4 Data Schema) ...
    };
    (function () {
      function go() { window.AtarRuntime.mount(document.getElementById("root"), DATA, {}); }
      if (window.AtarRuntime) go(); else window.addEventListener("load", go);
    })();
  </script>
</body>
</html>
```

**כללים:**
- בפלט עברי קבע `{LANG}`/`{DIR}` כ־`he`/`rtl`; בשפה אחרת קבע בהתאם. ה־runtime מזהה עברית ומפעיל RTL גם אוטומטית.
- `DATA` חייב להיות JavaScript פנימי תקין; אין להשתמש ב־`fetch()`.
- אין להוסיף CSS או JavaScript פנימיים מעבר להשמת `DATA` ולקריאת `mount`.

## 3. חילוץ נתונים

קרא מחדש את כל פלטי השלבים וחלץ:

| חלק | מקור | נתונים לחילוץ |
| --- | --- | --- |
| זהות הנכס | שלב 0 | שם, מיקום, סוג, תקופה, תיאור קצר של כ־20 מילים וקואורדינטות |
| איכות נתונים | שלב 0 | מקורות שהועלו ופערים שזוהו |
| ציר זמן | שלב 1 | 5–10 אירועים מתוארכים עם `year`, ‏`label`, ‏`changeType` — `use`/`structure`/`setting`/`infrastructure` |
| הקשרים | שלב 1 | לכל הקשר: `type`, ‏`label`, ‏`relatedValues`, ‏`timespan` |
| ערכים | שלב 2 | לכל ערך: שם, קטגוריה `[CA-V]`, ראיה `sourced`/`inferred`/`uncertain` וסיכום |
| טבלת מאפיינים | שלב 2.1 | לכל שורה: מאפיין, ערכים, משמעות והשלכה |
| אותנטיות | שלב 3 | נארה גריד כאובייקטים מובנים — היבט, תיאור, ביטוי ערך ודירוג — וסיכום |
| השוואה | שלב 4 | לכל אתר: שם, תקופה, אדריכל, הבחנה, קריטריונים וסיכום |
| משמעות | שלב 5 | נוסח ההצהרה המלא |
| פגיעוּת | שלבים 2 ו־3 | כל ערך × היבט Nara ← השפעה 3/2/1 |
| איכות התהליך | שלב 6 | `quickBoosts`, ‏`nextSteps`, חוזקות ופערים |
| מיקום | שלב 0 + הקשר | קווי רוחב/אורך לנכס ולאתרי השוואה: `explicit` / `inferred` / `null` |
| תמות | שלבים 1–3 | קיבוץ ערכים, הקשרים ואיומים לפי חוט נרטיבי, לפחות שני חברים בכל קבוצה |

**פתרון מיקום — מחייב לפני יצירת `DATA`:** השתמש בקואורדינטות שסופקו. אם חסרות אך קיימת כתובת או עוגן מקום, מותר חיפוש רשת ממוקד לאימות המיקום. אם הכתובת אינה נפתרת אך היישוב או האזור ברורים, השתמש בנקודה מקורבת שלהם והגדר `coordinateSource:"inferred"`; אין להשאיר `null` רק משום שהרחוב או מספר הבית לא אומתו. השתמש ב־`null` רק כשאין עוגן מקום מזוהה, ואז רשום פער ב־`dataQuality.gaps`. כאשר התקבלה נקודה מפורשת או מוסקת, המפה חייבת להופיע.

## 4. סכמת נתונים ‏(`type: "assessment"`)

הפעולה `normalize()` של ה־runtime מקבלת הן את המפתחות הקנוניים הבאים והן את הקיצורים של GPT. הסכמה תקפה כפי שהיא. שמות המפתחות וערכי ה־enum אינם מתורגמים; ערכי התוכן המוצגים למשתמש נכתבים בעברית.

```jsonc
{
  "type": "assessment",
  "asset": { "name": "", "location": "", "type": "", "period": "", "description": "",
             "coordinates": { "lat": null, "lng": null }, "coordinateSource": "explicit|inferred|unknown" },
  "dataQuality": { "sources": ["filename.pdf"], "gaps": ["missing X"] },
  "timeline": [ { "year": "1923–1924", "yearStart": 1923, "label": "...", "changeType": "structure" } ],
  "contexts": [ { "id": "ctx_hist", "type": "historical", "label": "...", "relatedValues": ["Historical"], "timespan": "1915–1960s" } ],
  "values": [ { "id": "v_hist", "name": "...", "category": "Historical", "evidence": "sourced", "summary": "..." } ],
  "attrTable": [ { "attribute": "...", "values": ["Social"], "significance": "...", "implication": "..." } ],
  "authenticity": { "grid": [ { "aspect": "Form & Design", "description": "...", "valueExpression": "Historical", "rating": "high|medium|low|low-medium" } ], "summary": "..." },
  "comparative": { "summary": "...", "sites": [ { "name": "...", "period": "...", "architect": "...", "distinction": "...", "criteria": { "rarity": "high", "documentation": "moderate", "condition": "unknown" }, "coordinates": { "lat": null, "lng": null } } ] },
  "significance": "full statement text",
  "vulnerability": [ { "value": "Historical", "form": 3, "material": 3, "use": 2, "setting": 2 } ],
  "processQuality": { "quickBoosts": ["..."], "nextSteps": ["..."] },
  "themes": { "valueThemes": [], "contextThemes": [], "threatThemes": [] },
  "tabs": []
}
```

כינויים שקולים — שניהם תקפים: `attrTable`↔`attributeTable` · `comparative.sites`↔`comparators` · מחרוזת `significance`↔`{statement}`.

## 5. הטאבים שמרנדר ה־runtime

טאבים קבועים, אוטומטיים ובסדר זה: **סקירה · מפה · ציר זמן · הקשרים וערכים · [נושאים] · שלמות · השוואה · משמעות**; אחריהם `tabs[]` הדינמיים ולבסוף **שאילתת AI** פעילה. ב־GPT, ‏`host={}` ולכן שאילתת AI פועלת כהעתקה לצ'אט. טאב הנושאים מוסתר כאשר קיימות פחות משתי תמות בסך הכול. ה־runtime מציג תוויות עבריות לפי שפת התוכן.

**`tabs[]` דינמיים** — סוגים: `table` עם `{columns, rows}` · `cards` עם `{cards:[{title,subtitle,body,level,badges}]}` · `matrix` עם `{rowLabels,colLabels,cells}` בערכים 0–3 · `prose` עם `{sections:[{title,body}]}` ותמיכה ב־`**bold**` · `custom` עם `{html}`. תאים התואמים לשם הנכס או לאתר השוואה מקבלים קישור אוטומטי.

**דוח, תחקיר וניתוח מפגש כטאבים מסוג `prose`** — הפק בסדר זה לאחר טאב המשמעות ובמזהים ובסמלים הבאים. את `label` כתוב בשפת הפלט:
- `{ id:"report", label:"דוח", icon:"📄", type:"prose", data:{ sections:[…] } }` — **תמיד**; יעד 800–1,200 מילים; סיום בסעיף ״📥 בקש בצ'אט לייצא…״.
- `{ id:"debrief", label:"תחקיר", icon:"💬", type:"prose" }` — רק אם תחקיר המפגש שלאחר שלב 6 הושלם, בשלושה חלקי שאלה/תשובה.
- `{ id:"session", label:"ניתוח המפגש", icon:"📊", type:"prose" }` — רק אם המשתמש הסכים: מפת אינטראקציות, רפלקציה עצמית וחתימת מפגש.

## 6. כללי איכות נתונים

1. רק נתונים שהופיעו בשיחה; אין להמציא. שלב שדולג ← `null` ורישום ב־`dataQuality.gaps`.
2. `authenticity.grid` מכיל אובייקטים מובנים; אין לשטח למחרוזות.
3. `comparative.sites` מכיל אובייקט לכל אתר עם קריטריונים; אין ליצור רשימת שמות שטוחה.
4. `timeline[].changeType` מחייב; `contexts[].relatedValues` מקשר כל הקשר לקטגוריות ערך.
5. הפעל את כלל פתרון המיקום שלעיל: עוגן מקום מוכר וחד־משמעי מחייב קואורדינטות מקורבות עם `coordinateSource:"inferred"`; השתמש ב־`null` רק כאשר המיקום לא זוהה או עמום, ודווח מדוע.
6. `vulnerability`: ‏3 = חמורה, 2 = בינונית, 1 = קלה.
7. כל תמה כוללת לפחות שני חברים; מלא `themes` רק אם יש לפחות שלושה ערכים או שלושה הקשרים.
8. ב־`tabs[]` השתמש בשמות המדויקים של הנכס ואתרי ההשוואה כדי שהקישורים יפעלו.

## 7. המשך לאחר הדשבורד

אין לצרף מלל המשך לתשובת הארטיפקט. לאחר שהמשתמש מאשר ש־Preview נפתח, או שואל מה הלאה, הצע: ״האם תרצה: 1. **לייצא** את ההערכה כמסמך Word מעוצב? 2. להפעיל **קריאת הערכה** ולנתח אותה מזוויות שונות? אפשר לבחור בשניהם, באחד מהם או באף אחד.״

השתמש ב־**Code Interpreter** לייצוא DOCX. תחקיר המפגש מופעל לפי `[CA-IP]` לאחר אישור שלב 6; אין להתחיל אותו מתשובת הארטיפקט. אם התחקיר ודוח המפגש הושלמו לאחר דשבורד מוקדם יותר, הצע לצרפם כטאבי `prose` במזהים `debrief` ו־`session` וליצור את הדשבורד מחדש.

## 8. בדיקת תאימות

- [ ] הפלט הוא fenced block יחיד מסוג `html`, ובו מעטפת דקה בלבד: `<div id="root">` יחיד, סקריפט UMD, ‏`DATA` פנימי תקין ו־`mount`.
- [ ] ה־runtime מ־`cdn.jsdelivr.net/npm/atar-runtime@0.3.7`; קריאת `mount(root, DATA, {})`; ומתקיים `DATA.type === "assessment"`.
- [ ] אין Leaflet, ‏CSS, ‏`<style>` או קוד רינדור במעטפת; ה־runtime טוען אותם.
- [ ] `authenticity.grid` מובנה; `comparative.sites` לכל אתר; `timeline[].changeType`; ‏`contexts[].relatedValues`; ו־`vulnerability`.
- [ ] בדיקת המיקום הושלמה: לנכס יש קואורדינטות מפורשות או מוסקות ומפה כאשר קיים עוגן מקום ברור; אחרת `dataQuality.gaps` מציין את העמימות שלא נפתרה.
- [ ] טאב הנושאים מופיע רק כשיש לפחות שתי תמות; טאב הדוח מסוג `prose` קיים תמיד; תחקיר וניתוח מפגש קיימים רק אם התרחשו.
- [ ] רק נתוני שיחה אמיתיים; `lang`/`dir` תואמים לשפה; המסירה פועלת לפי `instructions.md`; שם קובץ החלופה נכון.

**הצעת ייצוא — המשך מחייב:** לאחר שהמשתמש מאשר שהתוצר נפתח או שואל מה הלאה, הצע: ״האם לייצא את ההערכה כמסמך Word מעוצב?״

</div>
