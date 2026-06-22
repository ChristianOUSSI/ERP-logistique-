# TODO - Fix Next.js Google Fonts download failures + address 404 spam

- [ ] Root cause analysis: Next.js tries to download Inter + JetBrains Mono via next/font/google in `src/app/layout.tsx`.
- [ ] Update `src/app/layout.tsx` to stop fetching from Google Fonts when offline (use local fonts or disable download).
- [ ] Ensure CSS variables/classes still work (keep `--font-inter` and `--font-jetbrains-mono`).
- [ ] Optional: remove `<link rel="stylesheet" ... Material Symbols ...>` if it also fetches externally, or add local fallback.
- [ ] Re-run `npm run dev` to confirm no `fonts.googleapis.com` failures.
- [ ] Address 404 spam for `logo-kamlog.svg` and NextAuth routes (only if requested / necessary).

