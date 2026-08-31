# 🏍️ RUSI Motors – Inventory Management System
### Deployment Guide (Super Detailed)

---

# ═══════════════════════════════════════════
# STEP 1 — GUMAWA NG FIREBASE PROJECT
# ═══════════════════════════════════════════

1. Buksan ang browser mo (Chrome preferably)
2. Pumunta sa: https://console.firebase.google.com
3. Mag-sign in gamit ang iyong Google account
   - Kung wala kang Google account → gumawa muna sa accounts.google.com

4. Pagka-login, makikita mo ang Firebase Console homepage
5. I-click ang malaking button na **"Create a project"** (o "Add project")

6. Sa "Project name" field → i-type:
   ```
   rusi-motors-ims
   ```
7. I-click ang **Continue**

8. Sa susunod na screen (Google Analytics) → i-click ang toggle para i-OFF ito
   - Hindi na kailangan ng Analytics para sa project na ito
9. I-click ang **"Create project"**

10. Hintayin ang loading (mga 30 segundo) → pagka-tapos, i-click ang **"Continue"**
    - Dadalhin ka sa iyong project dashboard

---

# ═══════════════════════════════════════════
# STEP 2 — I-ENABLE ANG AUTHENTICATION
# ═══════════════════════════════════════════

Kailangan ito para may login system ang iyong website.

1. Sa left sidebar ng Firebase Console, hanapin ang **"Build"** section
2. I-click ang **"Authentication"**
3. I-click ang **"Get started"** button (nasa gitna ng screen)

4. Makikita mo ang mga "Sign-in providers" — i-click ang **"Email/Password"**

5. I-toggle ang UNANG switch (Email/Password) para maging **BLUE/ON**
   - Huwag i-enable ang "Email link (passwordless)" — yung pangalawa

6. I-click ang **"Save"**

### Gumawa ng Admin Account:

7. Sa taas ng Authentication page, i-click ang tab na **"Users"**
8. I-click ang **"Add user"** button (kanang bahagi)
9. Ilagay:
   - **Email:** `admin@rusimotors.com`
   - **Password:** (gumawa ng malakas na password, halimbawa: `RusiAdmin2026!`)
10. I-click ang **"Add user"**

✅ Done! Dapat makikita na ang user sa listahan.

---

# ═══════════════════════════════════════════
# STEP 3 — I-SET UP ANG FIRESTORE DATABASE
# ═══════════════════════════════════════════

Ito ang database kung saan itatago ang inventory, sales, logs, etc.

1. Sa left sidebar → **Build → Firestore Database**
2. I-click ang **"Create database"** button

3. Sa "Start in..." dialog:
   - Piliin ang **"Start in production mode"**
   - I-click ang **"Next"**

4. Sa "Cloud Firestore location":
   - I-click ang dropdown
   - Piliin ang **`asia-southeast1`** (ito ang pinaka-malapit sa Pilipinas — Singapore)
   - I-click ang **"Enable"**

5. Hintayin ang mga 1-2 minuto habang ginagawa ang database

### I-update ang Security Rules:

6. Pagka-gawa, i-click ang **"Rules"** tab (nasa taas ng Firestore page)

7. Makikita mo ang default rules na may "false" — **BURAHIN LAHAT** at palitan ng ito:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

8. I-click ang **"Publish"** button

✅ Ibig sabihin: Tanging naka-login na users lang ang makaka-read/write ng data.

---

# ═══════════════════════════════════════════
# STEP 4 — KUNIN ANG FIREBASE CONFIG
# ═══════════════════════════════════════════

Ito ang mga "password/keys" ng iyong Firebase project na ilalagay sa code.

1. Sa Firebase Console, i-click ang **gear icon ⚙️** (sa tabi ng "Project Overview" sa taas-kaliwa)
2. I-click ang **"Project settings"**

3. Mag-scroll pababa hanggang makita mo ang **"Your apps"** section
4. I-click ang icon na **`</>`** (Web app icon — mukhang code brackets)

5. Sa "App nickname" → i-type:
   ```
   RUSI Motors IMS
   ```
6. HUWAG i-check ang "Firebase Hosting"
7. I-click ang **"Register app"**

8. Makikita mo ngayon ang isang code block na ganito:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "rusi-motors-ims.firebaseapp.com",
  projectId: "rusi-motors-ims",
  storageBucket: "rusi-motors-ims.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

9. **I-HIGHLIGHT AT I-COPY** ang buong config na iyan (Ctrl+A sa loob ng code box, tapos Ctrl+C)

10. I-click ang **"Continue to console"**

---

# ═══════════════════════════════════════════
# STEP 5 — I-UPDATE ANG CONFIG FILE
# ═══════════════════════════════════════════

Ngayon ilalagay natin ang copied config sa project.

1. Buksan ang File Explorer
2. Pumunta sa:
   ```
   C:\Users\krist\OneDrive\Desktop\RUSI MOTOR\js\
   ```
3. I-right-click ang **`firebase-config.js`**
4. Piliin ang **"Open with"** → **Notepad** (o VS Code kung naka-install)

5. Makikita mo ang file na may placeholder values:
```javascript
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  ...
```

6. **I-REPLACE** ang buong `firebaseConfig` object — yung `{...}` part — gamit ang values na kinopya mo kanina mula Firebase

7. Halimbawa, dapat maging ganito (iyong values, hindi ito):
```javascript
const firebaseConfig = {
  apiKey:            "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain:        "rusi-motors-ims.firebaseapp.com",
  projectId:         "rusi-motors-ims",
  storageBucket:     "rusi-motors-ims.appspot.com",
  messagingSenderId: "123456789012",
  appId:             "1:123456789012:web:abcdef1234567890"
};
```

8. I-save ang file: **Ctrl+S**

---

# ═══════════════════════════════════════════
# STEP 6 — GUMAWA NG GITHUB ACCOUNT AT REPO
# ═══════════════════════════════════════════

### Gumawa ng GitHub Account (kung wala pa):

1. Pumunta sa: https://github.com
2. I-click ang **"Sign up"** (kanang taas)
3. I-enter ang iyong:
   - **Email address**
   - **Password**
   - **Username** (ito ang magiging part ng iyong website URL — piliin ang madaling matandaan, walang espasyo)
     - Halimbawa: `kristmotors` o `rusimotors2026`
4. Sundin ang verification steps (puzzle, email confirmation, etc.)
5. Pagka-done, pumunta sa homepage ng GitHub

### Gumawa ng Repository:

6. Sa GitHub homepage, i-click ang **"+"** button (kanang taas, sa tabi ng iyong avatar)
7. I-click ang **"New repository"**

8. Punan ang form:
   - **Repository name:** `rusi-motors-ims`
   - **Description:** `RUSI Motors Inventory Management System` (optional)
   - **Visibility:** piliin ang **Public** ⬅️ IMPORTANT — kailangan Public para libre ang GitHub Pages
   - **HUWAG** i-check ang "Add a README file"
   - **HUWAG** mag-add ng .gitignore
   - **HUWAG** mag-choose ng license

9. I-click ang **"Create repository"** (berdeng button sa baba)

---

# ═══════════════════════════════════════════
# STEP 7 — I-UPLOAD ANG MGA FILES SA GITHUB
# ═══════════════════════════════════════════

Pinaka-madaling paraan — drag and drop sa browser.

1. Pagka-gawa ng repository, makikita mo ang empty repo page
   - Makikita mo ang text na "Quick setup" at mga instructions

2. Hanapin ang link na nagsasabi ng:
   **"uploading an existing file"**
   (nasa loob ng "…or create a new repository on the command line" section)
   - I-click ang link na iyon

3. Magbubukas ang **drag-and-drop upload page**

4. Buksan ang File Explorer at pumunta sa:
   ```
   C:\Users\krist\OneDrive\Desktop\RUSI MOTOR\
   ```

5. **I-SELECT LAHAT** ng files at folders:
   - I-click ang unang file
   - Pindutin ang **Ctrl+A** para select all
   - I-drag ang lahat patungo sa browser window (sa dotted box na "Drag files here")

   ### Mga Files na dapat ma-upload:
   ```
   📄 index.html
   📄 dashboard.html
   📄 inventory.html
   📄 sales.html
   📄 suppliers.html
   📄 reports.html
   📄 users.html
   📄 logs.html
   📄 lowstock.html
   📄 README.md
   📁 css/
       └── style.css
   📁 js/
       ├── firebase-config.js  ← (updated na ito with your config)
       ├── auth.js
       ├── app.js
       └── logs.js
   ```

   ⚠️ **IMPORTANTENG TANDAAN:**
   - Kung hindi ma-drag ang folders (css/ at js/), kailangan mong i-upload ng hiwalay:
     a. I-upload muna ang lahat ng .html files at README.md
     b. I-click "Commit changes"
     c. Pagkatapos, i-click ang "Add file" → "Upload files" ulit
     d. I-drag ang css folder → commit
     e. I-drag ang js folder → commit

6. Pagka-upload ng lahat, mag-scroll pababa sa **"Commit changes"** section:
   - Sa first text box → i-type: `Initial commit - RUSI Motors IMS`
   - Iwanan ang second box (description) — blank lang
   - Siguruhing naka-select ang **"Commit directly to the main branch"**

7. I-click ang **"Commit changes"** (berdeng button)

8. Hintayin ang upload — depende sa speed ng internet, baka 1-3 minuto

---

# ═══════════════════════════════════════════
# STEP 8 — I-ENABLE ANG GITHUB PAGES
# ═══════════════════════════════════════════

Ito ang mag-publish ng iyong website sa internet — LIBRE!

1. Sa iyong GitHub repository page, i-click ang **"Settings"** tab
   (nasa taas ng repo, katabi ng "Insights")

2. Sa left sidebar ng Settings page, i-scroll pababa at hanapin ang **"Pages"**
   (nasa ilalim ng "Code and automation" section)
   - I-click ang **"Pages"**

3. Sa **"Branch"** section:
   - I-click ang dropdown na nagsasabi ng **"None"**
   - Piliin ang **`main`**
   - Sa pangalawang dropdown → piliin ang **`/ (root)`**
   - I-click ang **"Save"**

4. Mag-refresh ng page pagkatapos ng 30 segundo

5. Makikita mo sa taas ng Pages settings:
   > ✅ **"Your site is live at https://YOUR_USERNAME.github.io/rusi-motors-ims/"**

   - Halimbawa: `https://kristmotors.github.io/rusi-motors-ims/`

6. I-click ang link para buksan ang iyong website! 🎉

---

# ═══════════════════════════════════════════
# STEP 9 — I-AUTHORIZE ANG DOMAIN SA FIREBASE
# ═══════════════════════════════════════════

Ito ang kailangan para gumana ang login sa iyong live website.
Kung hindi mo ito gagawin, mag-eerror ang login kahit tama ang password.

1. Bumalik sa **Firebase Console**: https://console.firebase.google.com
2. Piliin ang iyong project (`rusi-motors-ims`)
3. Sa left sidebar → **Build → Authentication**
4. I-click ang **"Settings"** tab (nasa taas, katabi ng "Users" at "Sign-in method")
5. I-scroll pababa at hanapin ang **"Authorized domains"** section
6. I-click ang **"Add domain"** button
7. I-type ang iyong GitHub Pages domain:
   ```
   YOUR_USERNAME.github.io
   ```
   Halimbawa: `kristmotors.github.io`
8. I-click ang **"Add"**

✅ Done! Ngayon gumana na ang login sa live website.

---

# ═══════════════════════════════════════════
# STEP 10 — I-TEST ANG WEBSITE
# ═══════════════════════════════════════════

1. Buksan ang iyong website: `https://YOUR_USERNAME.github.io/rusi-motors-ims/`
2. Makikita mo ang RUSI Motors login page (dark professional theme)
3. I-login gamit ang:
   - **Email:** `admin@rusimotors.com`
   - **Password:** (yung ginawa mo sa Step 2)
4. Dapat mag-redirect ka sa Dashboard

### I-test ang bawat feature:
- [ ] Dashboard — may stats at charts (empty pa dahil walang data yet)
- [ ] Inventory → i-click "Add Item" → mag-try ng pagdagdag
- [ ] Sales → i-click "Record Sale" → mag-try ng pagdagdag
- [ ] Suppliers → mag-dagdag ng supplier
- [ ] Reports → may charts (kapag may data na)
- [ ] Users → mag-dagdag ng user profile
- [ ] Logs → dapat may entries na (login mo ay naka-log na)
- [ ] Low Stock → depende sa inventory data mo

---

# ═══════════════════════════════════════════
# ❓ COMMON PROBLEMS AT SOLUSYON
# ═══════════════════════════════════════════

**Problem:** "auth/configuration-not-found" error sa login
**Solusyon:** Hindi pa na-authorize ang GitHub domain → Ulitin ang Step 9

**Problem:** Blank white page ang website
**Solusyon:** Baka hindi na-upload ang css/ folder → I-check sa GitHub repo kung may css/style.css

**Problem:** "Firebase: No Firebase App" error sa console
**Solusyon:** Mali ang firebase-config.js → I-double check ang values mula Firebase Console

**Problem:** Login successful pero hindi nag-redirect sa dashboard
**Solusyon:** Baka hindi na-upload ang dashboard.html → I-check sa GitHub repo

**Problem:** GitHub Pages ay nagsasabi "404 Not Found"
**Solusyon:** Hintayin pa ng 5 minuto — minsan nagtatagal ang GitHub Pages deployment

**Problem:** Hindi ma-drag ang folders sa GitHub upload
**Solusyon:** I-upload ng isa-isa ang css/ at js/ folders (see Step 7, bullet point about folders)

---

# ═══════════════════════════════════════════
# 📋 CHECKLIST — BAGO IPASA
# ═══════════════════════════════════════════

- [ ] Firebase project created
- [ ] Authentication (Email/Password) enabled
- [ ] Admin user created sa Firebase
- [ ] Firestore database created (asia-southeast1)
- [ ] Firestore security rules updated
- [ ] `js/firebase-config.js` updated with real config values
- [ ] GitHub account created
- [ ] GitHub repository created (Public)
- [ ] All files uploaded to GitHub
- [ ] GitHub Pages enabled on main branch
- [ ] GitHub domain added to Firebase Authorized Domains
- [ ] Login works on live website
- [ ] All 7 features tested

---

**Live URL format:** `https://YOUR_GITHUB_USERNAME.github.io/rusi-motors-ims/`

© 2026 RUSI Motors Corporation — IAS101 / CC105 Midterm Exam Output
