<div dir=rtl>
# שיפור הנחיות — דגל ספק על טענות התיעוד

> **⚠ סטטוס (2026-06-17):** יושם ב-Claude בלבד (`InSites-Brain/Claude/InSites-CAA-claude.md`, v10.0) — אך **המנגנון עודכן מאז**: ההבחנה אינה לפי *נוכחות הציטוט* אלא לפי **פרוזה מייחסת**; מודל 4 המצבים (מפורש / מוסק 〰️ / פרשני 💭 / ספק-במקור / השערת-הבוט-מעבר-למקורות); הטריגר "conflicts with established knowledge" הוסר (מנדט-הראיות); ומצב E (השערה ללא ציטוט) אושר כעומק פרשני. המסמך ממתין לעדכון מלא + הפצה ל-GPT/Gemini. ראה memory `project_epistemic_source_doubt`.
 
## הבעיה
 
ציטוט מאשר **מיקום**, לא **סטטוס**. הכלל `(ללא סימון) = מפורש במקור`, בצירוף ציטוט נוכח, הלבין פרשנות-כותב לעובדה: התיק כתב "תכנון 'עיר גנים' מודרניסטית" (פרשנות), והפלט העביר זאת לשלב 1 **ללא סימון** עם `[תיק:33]` תקין. הכלי תפס סתירות *עובדתיות* — לא *פרשנות שהוצגה כעובדה*.
 
## העיקרון
 
התיוג הקיים (`〰️`/`💭`) חל על **ההסקות של הבוט עצמו** — עובד, לא משתנה. התוספת: דגל על **טענה פרשנית של התיעוד** שלבוט יש ספק בנכונותה. **נוכחות הציטוט מבדילה את הייחוס** — ללא תג נוסף:
 
| ‏סימון | ‏משמעות |
| --- | --- |
| ‏`💭` בלי ציטוט | ‏ספק בהסקת הבוט |
| ‏`💭 [מקור:עמ']` | ‏ספק בטענת התיעוד |
 
**בתחום**: השכבה הפרשנית של המקור (סיווג, ייחוס, מסקנה מאירוע). **מחוץ לתחום**: עובדות נצפות (צורה, חומר, מידה, מצב) — דורשות גישה לאתר, לא מטופלות כאן.
 
## ההנחיה — תוספת לשער האפיסטמי
 
צעד ל-`Per-Claim Epistemic Gate`:
 
```markdown
3. **Doubt about a source claim** (its interpretation/inference, not its facts):
   Flag a dossier interpretation you doubt is correct as `💭 [source:p]` — the
   citation marks it as the dossier's claim (💭 with no citation = doubt about
   your own inference). Trigger only on: internal contradiction · nothing to
   verify against (unsupported in dossier and in your knowledge) · conflicts with
   established knowledge. Else pass through with citation, no flag. If the author
   already hedged ("possibly"), mirror it. Facts the author observed (form,
   material, measurement, condition) are out of scope.
```
 
שורה ל-`Global Notation Key`, מתחת ל-`(none)`:
 
```markdown
**Rule (asserted ≠ established)**: a citation confirms *location*, not *status*.
Apply Epistemic Gate step 3.
```
 
## הפלט
 
```
🌿 נופי — התיק מתאר את תכנון רינגס כ"עיר גנים" מודרניסטית 💭 [תיק:33]
```
 
הפועל "התיק מתאר" נושא את הייחוס; `💭` את הספק; `[תיק:33]` את המיקום — ואת שיוך הספק לתיעוד. "מדוע 💭?" פותח את ההצדקה (HITL).
 
## הגבול
 
הטריגר החלש הוא "אין במה לאמת" — שיפוט, לא מבחן מכני. עוגן שלב 0 (תיק דרגה-נמוכה או סותר את עצמו → רף חשד גבוה מראש) מפצה.
