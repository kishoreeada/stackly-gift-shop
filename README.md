# Stackly Gift Shop — v25 Final Repair

Final targeted repair pass for dashboard spacing, dashboard navigation, auth-link routing and the 404 experience.

## Fixed
- Removed the oversized dashboard whitespace caused by AOS initialization order.
- AOS now loads before dashboard initialization.
- Client/Admin Overview tabs now route to their own dashboard index pages.
- Dashboard active-tab state and spacing are consistent across all 5 tabs.
- Auth "Create an account" / "Sign in to Luméa" links are no longer rewritten to 404.
- Rebuilt the 404 page with a responsive editorial layout, Stackly branding, GSAP and AOS.
- Verified all local HTML href targets resolve to existing files.

## Run
Open `index.html` using a local development server.
# Stackly Gift Shop

## Project Architecture

```text
STACKLY-GIFT-SHOP/
├── index.html
├── 404.html
├── pages/
│   ├── shop/
│   ├── gift-guide/
│   ├── about/
│   └── contact/
├── auth/
│   ├── login.html
│   └── signup.html
├── dashboards/
│   ├── admin/
│   └── customer/
├── assets/
│   ├── images/
│   │   ├── heroes/
│   │   ├── shop/
│   │   ├── gift-guide/
│   │   ├── about/
│   │   ├── contact/
│   │   ├── dashboards/
│   │   └── brand/
│   ├── icons/
│   └── fonts/
├── css/
├── js/
├── docs/
├── README.md
└── project-manifest.json
```

## Page Architecture

- Public landing page: `index.html`
- Custom error page: `404.html`
- Shop: 1 parent + 6 editorial subpages
- Gift Guide: 1 parent + 6 editorial subpages
- Our Story: 1 parent + 6 editorial subpages
- Contact: 1 parent + 6 editorial subpages
- Authentication: Login + Signup
- Admin portal: Overview, Catalog, Customers, Chatbot, Settings
- Customer portal: Overview, Orders, Saved Gifts, Gift Calendar, Profile

## Shared Frontend

- HTML5
- CSS3
- JavaScript ES6+
- Flexbox responsive architecture
- GSAP + ScrollTrigger
- AOS
- Font Awesome
- Responsive desktop/tablet/mobile navigation
- Custom validation and 404 routing

## Routing Contract

- Stackly logo → Home
- Five primary header links → implemented pages
- Header Sign Up / Login → authentication
- Non-header CTA/demo links → custom 404
- Valid signup → Login
- Valid login → role-specific dashboard

## Assets

Editorial imagery is delivered as optimized WebP through the image optimization URL layer. The Stackly brand logo is stored locally under `assets/images/brand/`.

## Documentation

The POC documentation will be placed under `docs/` after final project QA.


## v24 Final QA Fixes

- Dashboard sidebar alignment and active-state styling corrected.
- Stackly logo is used in dashboard sidebars and returns to Home.
- Dashboard tab navigation remains functional.
- Contact guidance icon corrected.
- Inner-page hero hierarchy and spacing refined.
- Contact header routing corrected.
