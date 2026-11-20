# BellyBelly Good — Prompt History

A chronological record of the prompts used to build and iterate on the **BellyBelly Good** ordering web application.

## Earlier Project Milestones (Pre-Summary)

- **Initial Build (`65782b3`)**: Build a mobile-first QSR açaí ordering and real-time order tracking web application (originally The Summer Acai · Punggol Coast).
- **Brand Pivot (`962fb58`)**: Rebrand the application to **BellyBelly Good** (single exclusive flagship outlet at 28 Keong Saik Road, #01-01) and rename the loyalty programme to **Belly Club**.

## Chronological Session Prompts

1. Commit all changes to GitHub.
2. Remove Outlet Info tab from the website and Include a Promotions tab. Remove the Store Info from the image and transfer the necessary information under Promotions tab.
3. Expand the details of the Belly Club membership programme page to include perks for being a Belly Recruit, Belly Warrior and Belly Legend and retain the sign-in and registration page.
4. Commit all changes to GitHub.
5. Remove the registration column and just include a Sign-up Now button. Move the Belly Club page out of the menu bar and keep it at a header below the menu bar including a sign-up button. *(with screenshot attachment)*
6. Commit all changes to GitHub.
7. Lock the Belly Club tab together the menu bar so that it remains visible when users scroll up and down. Remove the Sign-up Now button and remove the "Perks" text beside the Sign-up Now button. *(with screenshot attachment)*
8. Replace Belly Club with Belly Tribe and replace this attached text with Join the Tribe. It's free today! *(with screenshot attachment)*
9. Commit all changes to GitHub.
10. Change these icons to cute mascots instead of a shield, badge and crown. *(with screenshot attachment)*
11. Update the Basket to Cart and include a Sign-Up button above "Proceed to Pay" to state that the % savings if they sign up. *(with screenshot attachment)*
12. Commit all changes to GitHub and collate all prompts above under `prompts.md` filename.
13. include the cart icon as users cannot locate the cart option to identify the list of items
14. commit all changes to github
15. embed the following code in the website, collate all prompts under `prompts.md` filename and commit all changes to github:

```html
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "zgi74gt88t");
</script>
```

16. load the github commit id 97157fd9465b20b2f3b1e0a06794312656b3c81e and display the mobile app design. improve this option to include absolute value of the savings together with the % savings and make it animated and more prominent than the Proceed to Pay option *(with screenshot attachment)*
17. git push to `https://github.com/samwongjh/acai-ordering-system_ver.b.git` *(token redacted)*
18. load the github repository: `https://github.com/samwongjh/acai-ordering-system_ver.a.git` and display the user interface
19. improve this option to make it animated and more prominent. include the absolute value savings together with the % savings. *(with screenshot attachment)*
20. git push to `https://github.com/samwongjh/acai-ordering-system_ver.b.git` *(token redacted)*
21. make adjustments to the Proceed to Pay button based on the attached screenshot *(with screenshot attachment)*
22. include the colour for the Proceed to Pay instead of keeping it white
23. embed Microsoft Clarity in the website with the following code, collate all prompts under `prompts.md` filename and commit changes to github:

```html
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "zgieynu4p6");
</script>
```

24. Put the code I paste below into the file `src/pt.ts`, next to `src/App.tsx`, exactly as written. Keep `SUPABASE_URL` and `SUPABASE_KEY` in `src/pt.ts` as they are. Keep the app front-end only, with no server, `server.ts`, Express, Gemini calls or secrets. Make the app show version A or B using `variant()`, `track("screen_view")`, `track("cta_click")` on `Join now`, `track("goal_complete")`, bottom consent notice with `Accept`/`Decline`, and `loadClarity()` after consent (removing Clarity from `index.html`).
25. Pasted `src/pt.ts` implementation (Supabase publishable client, `variant()`, `track()`, `consent()`, `setConsent()`, `loadClarity()`, and Supabase Auth helpers).
26. commit all changes to github and collate all prompts under `prompts.md` filename
