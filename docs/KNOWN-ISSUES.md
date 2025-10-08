# Known Issues

This document tracks known limitations, architectural constraints, and potential solutions for the Cyberknights website.

---

## 🔗 Link Previews Show Same Content for All Pages

**Status:** Known Limitation (SPA Architecture)  
**Severity:** Low (Cosmetic/UX)  
**Affected Areas:** Social media shares, SMS previews, rich link cards

### Problem Description

When sharing links to different pages of the website (e.g., `https://ccri-cyberknights.github.io/page/#/linux` vs `https://ccri-cyberknights.github.io/page/#/calendar`), all link previews display the **same title, description, and thumbnail** regardless of which page is being shared.

This occurs because:
1. The site is a **Single Page Application (SPA)** with hash-based routing (`#/route`)
2. Open Graph (OG) meta tags exist in `index.html` but are **static**
3. Social media crawlers (Facebook, Twitter, LinkedIn, SMS apps) **do not execute JavaScript**
4. Crawlers only read the initial HTML, which is identical for all routes

### Current Implementation

```html
<!-- Lines 9-11 in index.html -->
<meta property="og:title" content="CCRI Cyber Club">
<meta property="og:description" content="A centralized hub for the CCRI Cyber Club...">
<meta property="og:image" content="https://ccri-cyberknights.github.io/page/images/branding/cybersmith.webp">
```

These tags never change, regardless of the active route.

### Why Dynamic Updates Don't Work

**Social media crawlers are non-JavaScript clients.** They:
- ❌ Don't execute JavaScript
- ❌ Don't respect client-side routing
- ❌ Don't see dynamically updated meta tags
- ✅ Only read the initial server response

This means JavaScript-based solutions (updating OG tags on route change) **will not fix link previews** on social platforms.

---

## 💡 Potential Solutions

### Option 1: Improve Default OG Tags (Quick Fix)
**Effort:** Low | **Impact:** Low | **Status:** Recommended

Make the default OG tags more compelling and representative of the entire site.

**Pros:**
- Quick to implement (5 minutes)
- Better than current generic description
- No architectural changes

**Cons:**
- Still shows same preview for all pages
- Doesn't solve the core issue

**Implementation:**
```html
<meta property="og:title" content="CCRI Cyberknights - Cybersecurity Club & Resources">
<meta property="og:description" content="Linux guides, cybersecurity resources, event calendar, and educational content for CCRI's Cyber Club community.">
<meta property="og:image" content="https://ccri-cyberknights.github.io/page/images/branding/cybersmith.webp">
<meta property="og:type" content="website">
<meta property="og:url" content="https://ccri-cyberknights.github.io/page/">
```

---

### Option 2: Prerendering (Full Solution)
**Effort:** Medium-High | **Impact:** High | **Status:** Viable for GitHub Pages

Use a prerendering tool to generate **static HTML files** for each major route during the build process.

**How It Works:**
1. Build tool (e.g., `prerender-spa-plugin`) crawls your SPA
2. Generates static HTML files with unique OG tags:
   - `index.html` (home page)
   - `linux/index.html` (Linux guide)
   - `calendar/index.html` (calendar page)
   - `resources/index.html` (resources page)
3. Each file contains route-specific meta tags
4. Social crawlers see the correct tags for each page

**GitHub Pages Compatibility:**
- ✅ **Works perfectly** - GitHub Pages serves static HTML files
- ✅ No server-side rendering required
- ✅ Crawlers get unique content per route
- ⚠️ **Requires HTML5 History Mode** (URLs like `/linux` instead of `/#/linux`)

**Current Blocker:**
Our site uses **hash-based routing** (`#/linux`). Prerendering requires **HTML5 History Mode** (`/linux`).

**Migration Path:**
1. Switch from hash routing to History Mode
2. Add 404 redirect trick for GitHub Pages (or rely on prerendered files)
3. Integrate prerendering into build process
4. Generate unique OG tags per route

**Pros:**
- ✅ Solves link preview issue completely
- ✅ SEO benefits (crawlable content)
- ✅ Works with GitHub Pages
- ✅ No server required

**Cons:**
- ❌ Requires routing refactor (hash → history mode)
- ❌ Adds build complexity
- ❌ Must regenerate on content changes
- ❌ Moderate development effort (8-12 hours)

---

### Option 3: Dynamic Meta Tags (Partial Solution)
**Effort:** Low | **Impact:** Low | **Status:** Not Recommended

Update OG tags via JavaScript when routes change.

**Pros:**
- Easy to implement
- Works for browsers and some apps

**Cons:**
- ❌ **Does not fix social media previews** (main use case)
- ❌ Doesn't solve the core problem
- ❌ Wasted effort for minimal benefit

**Verdict:** Not worth implementing given the limitation.

---

### Option 4: Separate Static Pages (Nuclear Option)
**Effort:** High | **Impact:** High | **Status:** Not Recommended

Create separate HTML files for each major section (abandoning SPA architecture).

**Pros:**
- ✅ Perfect link previews
- ✅ Perfect SEO
- ✅ No build tools needed

**Cons:**
- ❌ Loses SPA benefits (instant navigation, state management)
- ❌ Massive refactor (40+ hours)
- ❌ Duplicated code across files
- ❌ Harder to maintain

**Verdict:** Not worth the tradeoff.

---

## 📊 Recommendation

**Short-term (Now):**
- Implement **Option 1** (Improve Default OG Tags)
- Document this limitation in user-facing docs
- Accept that all pages share the same preview

**Long-term (Future Consideration):**
- Evaluate **Option 2** (Prerendering) if:
  - Link previews become a priority
  - SEO becomes important
  - Team has bandwidth for routing refactor
- Estimated effort: 8-12 hours for full implementation

---

## 🔍 Technical Details

### Hash Routing vs History Mode

**Current (Hash Mode):**
```
https://ccri-cyberknights.github.io/page/#/linux
https://ccri-cyberknights.github.io/page/#/calendar
```
- All routes load the same `index.html`
- Fragment (`#/linux`) is client-side only
- Server never sees the route
- Crawlers see identical HTML

**Prerendering Requires (History Mode):**
```
https://ccri-cyberknights.github.io/page/linux
https://ccri-cyberknights.github.io/page/calendar
```
- Each route has its own HTML file
- Server serves different files per route
- Crawlers see unique content

### GitHub Pages 404 Redirect Trick

For History Mode SPAs on GitHub Pages, add to `404.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <script>
    // Redirect 404s back to index.html with path preserved
    sessionStorage.redirect = location.href;
  </script>
  <meta http-equiv="refresh" content="0;URL='/'">
</head>
</html>
```

Then in `index.html`:
```javascript
// Restore the intended route
(function() {
  var redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect != location.href) {
    history.replaceState(null, null, redirect);
  }
})();
```

**Note:** With prerendering, this trick is only needed for non-prerendered routes.

---

## 📚 Related Documentation

- **Architecture:** `docs/ARCHITECTURE.md` - SPA routing implementation
- **Routing:** `docs/ROUTING.md` - Hash-based navigation system
- **UI Standards:** `docs/UI.md` - Meta tag standards (future)

---

## 📝 Change Log

| Date | Change | Author |
|------|--------|--------|
| Oct 8, 2025 | Initial documentation of link preview limitation | Cyberknights Team |

---

**Last Updated:** October 8, 2025  
**Maintained By:** Cyberknights Development Team
