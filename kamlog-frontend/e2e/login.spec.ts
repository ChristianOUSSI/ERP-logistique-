import { test, expect } from '@playwright/test';

test('utilisateur peut se connecter et être redirigé vers le dashboard', async ({ page }) => {
  // 1. Accéder à la page de connexion
  await page.goto('/login', { waitUntil: 'domcontentloaded' });

  // 2. Vérifier que la page s'affiche correctement
  await expect(page.getByRole('heading', { name: /System Authentication/i })).toBeVisible();

  // 3. Remplir le formulaire
  await page.getByPlaceholder('user@kamlog.com').fill('admin@kamlog.cm');
  await page.getByPlaceholder('••••••••••••').fill('admin123');

  // 4. Soumettre le formulaire
  await page.getByRole('button', { name: /Initialize Access/i }).click();

  // 5. Vérifier la redirection vers le dashboard
  await expect(page).toHaveURL(/.*\/dashboard|.*\/transport|.*\/magasin/, { timeout: 60000 });
});
