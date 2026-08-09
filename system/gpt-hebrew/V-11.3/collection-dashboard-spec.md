<div dir="rtl">

# דשבורד אוסף [CA-DB-C] ‏(GPT · גרסת atar-runtime)

> **גרסת atar-runtime — המפרט הקנוני לדשבורד אוסף ב־GPT.** הרינדור מתבצע באמצעות חבילת **`atar-runtime`** המשותפת — JavaScript רגיל עם D3 ו־Leaflet מ־`cdn.jsdelivr.net/npm` — אותו runtime המשמש את Claude ואת Gemini. הבוט מחלץ נתונים בלבד; ה־runtime אחראי לכל הטאבים, למפה, ל־RTL ולטאב שאילתת AI. גרסת `collection-dashboard-runtime` הישנה של alephplace נמצאת בארכיון.

## 1. טריגר

- לאחר הניתוח בשלב 3 של MA-RC: ״האם ליצור דשבורד חזותי לאוסף זה?״
- בבקשה ישירה: ״דשבורד״, ״דשבורד אוסף״, ״הצג חזותית״, `dashboard`, ‏`collection dashboard` או `visualize`.
- הפעל רק לאחר הסכמה. השב **רק** בתוצר.

## 2. מעטפת HTML ‏(atar-runtime)

מעטפת דקה הטוענת את `atar-runtime` וקוראת ל־`mount(container, DATA, {})` עם `DATA.type = "collection"`. ה־runtime מזריק את הסגנונות וטוען את Leaflet בעצמו; אין להוסיף Leaflet, קובץ CSS או קוד רינדור.

```html
<!DOCTYPE html>
<html lang="{LANG}" dir="{DIR}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{COLLECTION_NAME} — דשבורד אוסף</title>
</head>
<body>
  <div id="root" style="height:100vh"></div>
  <script src="https://cdn.jsdelivr.net/npm/atar-runtime@0.3.7/dist/atar-runtime.umd.js"></script>
  <script>
    var DATA = {
      type: "collection",
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

**מסירה ב־GPT:** פעל לפי **מסירת HTML ב־GPT-5.6** שב־`instructions.md`. שם קובץ חלופי: `{collection-name}-cbsa-collection-dashboard.html`.

## 3. חילוץ נתונים

בנה JSON לכל אתר על בסיס פלט שלב 2 ב־MA-RC. השתמש רק בנתונים שחולצו; אין להמציא.

**פתרון מיקום — מחייב לפני יצירת `DATA`:** לכל אתר השתמש בקואורדינטות שסופקו; אחרת מותר חיפוש רשת ממוקד לאימות כתובת או עוגן מקום. אם הכתובת אינה נפתרת אך היישוב או האזור ברורים, השתמש בנקודה מקורבת שלהם. השאר `lat` ו־`lng` ריקים רק כשאין עוגן מזוהה, ורשום זאת ב־`collectionSummary.gaps`. כאשר לפחות אתר אחד ניתן למיקום, המפה חייבת להופיע.

## 4. סכמת נתונים ‏(`type: "collection"`)

שמות המפתחות וערכי ה־enum נשארים באנגלית. שדות התוכן המוצגים למשתמש נכתבים בשפת הפלט.

```jsonc
{
  "type": "collection",
  "collection": { "name": "", "source": "", "depth": "", "date": "", "itemCount": 0 },
  "sites": [ {
    "id": "", "name": "", "region": "", "lat": null, "lng": null,
    "depth": "rich|medium|thin", "type": "", "typeCategory": "", "period": "", "periodCategory": "",
    "description": "", "significanceSummary": "",
    "highlight": "MANDATORY — one-sentence collection-level insight for this site",
    "values": { "Historical": "e|i|a", "Scientific": "e|i|a" },
    "valueSpecs": { "Historical": "what it means at this site" },
    "integrity": "", "integrityNote": "", "threats": [],
    "comparativeBasis": "", "claimScope": "local|regional|national|international"
  } ],
  "themes": [ { "id": "", "label": "", "description": "", "sites": ["siteId"], "evidence": { "siteId": "supporting text" } } ],
  "collectionSummary": { "narrative": "", "patterns": [], "gaps": [], "distinctives": [] },
  "tabs": []
}
```

ב־`values`: ‏`e` = מפורש, `i` = משתמע, `a` = אינו קיים.

## 5. הטאבים שמרנדר ה־runtime

טאבים קבועים ואוטומטיים: **סקירה · מפה · ערכים · [נושאים]**; אחריהם `tabs[]` הדינמיים ולבסוף **שאילתת AI** פעילה. ב־GPT, ‏`host={}` ולכן שאילתת AI פועלת כהעתקה לצ'אט. סמני המפה נצבעים לפי עומק `rich`/`medium`/`thin` וכוללים מסנן עומק. לחיצה על שם אתר בכל מקום ממקדת את הסמן שלו. ה־runtime מציג תוויות עבריות לפי שפת התוכן.

**`tabs[]` דינמיים** — ניתוחי שלב 3 ב־MA-RC — סוגים: `table` עם `{columns, rows}` · `cards` עם `{cards:[{title,subtitle,body,level,badges}]}` · `matrix` עם `{rowLabels,colLabels,cells}` בערכים 0–3 · `prose` עם `{sections:[{title,body}]}` · `custom` עם `{html}`. השתמש בדיוק ב־`site.name`/`id` כדי שהקישורים יפעלו.

## 6. כללי איכות נתונים

- רק נתונים שחולצו; אין להמציא.
- `themes[]` מחייב ואינו ריק — לפחות תמה אחת. לכל הפחות, קבץ אתרים לפי דפוסי ערכים חופפים וכלול `evidence` לכל אתר.
- `site.highlight` מחייב ואינו ריק לכל אתר.
- לכל אתר `id` תקין; ב־`values` נעשה שימוש עקבי ב־`e`/`i`/`a`.
- קואורדינטות: הפעל את כלל פתרון המיקום; אין להשתמש ב־`null` כאשר היישוב או האזור מזוהים.

## 7. בדיקת תאימות

- [ ] הפלט הוא fenced block יחיד מסוג `html`, ובו מעטפת דקה בלבד: `<div id="root">` יחיד, סקריפט UMD, ‏`DATA` פנימי תקין ו־`mount`.
- [ ] ה־runtime מ־`cdn.jsdelivr.net/npm/atar-runtime@0.3.7`; קריאת `mount(root, DATA, {})`; ומתקיים `DATA.type === "collection"`.
- [ ] אין Leaflet, ‏CSS, ‏`<style>` או קוד רינדור במעטפת; ה־runtime טוען אותם.
- [ ] `themes[]` אינו ריק; לכל אתר `highlight` שאינו ריק ו־`id` תקין; הערכים משתמשים ב־`e`/`i`/`a`.
- [ ] לכל אתר שעוגן המקום שלו מזוהה יש `lat` ו־`lng`; כאשר קיימת לפחות נקודה אחת, טאב המפה מציג מפה.
- [ ] `lang`/`dir` תואמים לשפה; המסירה פועלת לפי `instructions.md`; שם קובץ החלופה נכון.

## 8. המשך לאחר הדשבורד

אין לצרף הצעה זו לתשובת הארטיפקט. לאחר שהמשתמש מאשר ש־Preview נפתח, או שואל מה הלאה, הצע: ״האם לייצא את נתוני האוסף שחולצו כקובץ JSON מובנה?״

</div>
