# Portfolio content review
Reviewed 2026-09-28. Canonical content: src/data/content.ts. Removed the competing src/data/resume.ts and replaced unused page components.

## Resume
Source: public/Lina-El-Yacoubi-Resume.pdf (both pages).
Verified name, visible email, social URLs, degree, December 2027 graduation date, role titles, employers, dates and skills.
Nordion: 100+ Bill of Materials files consolidated; retrieval from hours to under 10 minutes; 5+ hours of manual updates saved monthly.
uOttawa: internal applications, forms, evaluation workflows, cross-layer debugging, SQL Server / Azure Data Factory ETL work, T-SQL data validation and regression testing.
Removed unsupported join-error diagnosis, print-layout specifics, motivations, pride claims and forced jokes. No invented uOttawa impact figure.

## Project sources and individual contributions
Original portfolio: https://portfoliolinaelyacoubi.netlify.app/
- Weather Dashboard: https://github.com/LinaElYacoubi/Dashboard. Package manifest verifies React, Recharts and Bootstrap. Lina confirmed solo authorship in this session.
- Tutor+: https://github.com/alaekabir/Site-de-Services. Manifest verifies React and React Bootstrap. Lina and Alae are contributors. Lina's commits ce9219ff73660fd7bb7c4bc1e80f2fc3a043af22 and 572d4a1eb73260c78017901374830abcbbd61d2c add the booking interface, booking confirmation and profile confirmation pages. These specific contributions are credited.
- Memory Card Game: https://github.com/alaekabir/Jeu-de-Memoire. Manifest verifies React and Bootstrap. Lina and Alae are contributors. Lina's commit 8a71a4f4da2c4a11ab6f619d09931b11aedee441 adds difficulty/theme selection and passes selections into the game. This specific contribution is credited.
- Custom Vibes: deployed React storefront and original portfolio support product personalization description. No public source repository located. Previous content files say team project but do not substantiate it; the collaboration badge and individual contribution are omitted pending confirmation.
Do not claim production checkout, live weather feeds or booking backends merely from these frontend demos. No project dates or impact numbers are asserted.

## Lina to confirm
Custom Vibes: was this a team project, and which parts did you personally implement?
Resume PDF: the visible email is lelya062@uottawa.ca, but its embedded link is mailto:x@x.com. The website correctly links to mailto:lelya062@uottawa.ca. The supplied PDF is preserved; correct its link in the original resume document before exporting a replacement.

## Artwork
Four distinct editorial illustrations are saved in public/images/:
- weather-dashboard-cover.png
- custom-vibes-cover.png
- tutor-plus-cover.png
- memory-card-game-cover.png
Cream, burgundy and muted gold paper-collage art, without text or logos. These are thematic illustrations, not screenshots. Alt text describes the illustrations.

## Verification
- Production TypeScript/Vite build and Oxlint.
- Headless Edge at 1440, 768, 390 and 320 px: no horizontal overflow.
- Axe WCAG 2 A/AA and 2.1 AA: zero violations at all four widths; mobile menu also passed automated analysis.
- Desktop and mobile screenshots visually inspected.
- Keyboard skip link focuses main; mobile menu Escape closes it and returns focus to toggle.
- Reduced motion sets scroll behavior to auto and removes transitions/transforms.
- Every in-page anchor resolves. All five images loaded; no runtime page errors.
- Local resume URL returns 200; website mailto matches visible PDF email.
- All four demos returned HTTP 200 and rendered in headless Edge. Demo homepages were checked, not full checkout/booking workflows.
- GitHub profile returns 200.
- LinkedIn URL matches the PDF annotation, but LinkedIn returns 999 to automated requests; availability cannot be independently confirmed.
Automated accessibility tests are supplemented by visual and keyboard checks, not a full accessibility certification.

## Interactive layout update
The page now uses a layered studio layout with a project explorer (src/components/ProjectExplorer.tsx), skill category buttons (src/components/SkillNotes.tsx), native expandable experience entries, active-section navigation and email copying with success/failure feedback. All verified project and professional facts remain in src/data/content.ts.
Validated at 1440, 768, 390 and 320 pixels: no horizontal overflow and no automated WCAG A/AA violations. Keyboard project switching, native disclosure activation, mobile menu Escape, skip navigation, reduced motion and clipboard copying passed. Expanded experience state also passed Axe. No browser runtime errors.
