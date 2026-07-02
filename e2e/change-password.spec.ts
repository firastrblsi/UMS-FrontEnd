import { test, expect, type Page } from '@playwright/test';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function loginAsAdmin(page: Page) {
  await page.goto('/auth/login');
  await page.getByLabel(/email/i).fill('admin@ums.com');
  await page.locator('input[type="password"]').fill('123456');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 10000 });
}

async function navigateToProfile(page: Page) {
  await page.goto('/profile');
  await page.waitForLoadState('networkidle');
}

async function openChangePasswordForm(page: Page) {
  await navigateToProfile(page);
  await page.getByRole('button', { name: /change password/i }).click();
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('UMS-24 — Change Password', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('profile page shows Change Password button', async ({ page }) => {
    await navigateToProfile(page);
    await expect(page.getByRole('button', { name: /change password/i })).toBeVisible();
  });

  test('clicking Change Password shows form with 3 password fields', async ({ page }) => {
    await openChangePasswordForm(page);

    // All three labelled inputs should appear
    await expect(page.getByLabel(/current password/i)).toBeVisible();
    await expect(page.getByLabel(/new password/i)).toBeVisible();
    await expect(page.getByLabel(/confirm/i)).toBeVisible();
  });

  test('Cancel returns to profile view without submitting', async ({ page }) => {
    await openChangePasswordForm(page);

    await page.getByRole('button', { name: /cancel/i }).click();

    // Form gone, profile action buttons back
    await expect(page.getByLabel(/current password/i)).not.toBeVisible();
    await expect(page.getByRole('button', { name: /change password/i })).toBeVisible();
  });

  test('shows inline error when current password is empty', async ({ page }) => {
    await openChangePasswordForm(page);

    // Fill new passwords but leave current empty
    const inputs = page.locator('input[type="password"]');
    await inputs.nth(1).fill('Admin@1234');
    await inputs.nth(2).fill('Admin@1234');

    await page.getByRole('button', { name: /change password/i, exact: false }).last().click();

    await expect(page.getByText(/current password is required/i)).toBeVisible({ timeout: 5000 });
  });

  test('shows inline error when new password is too short', async ({ page }) => {
    await openChangePasswordForm(page);

    const inputs = page.locator('input[type="password"]');
    await inputs.nth(0).fill('123456');
    await inputs.nth(1).fill('short');
    await inputs.nth(2).fill('short');

    await page.getByRole('button', { name: /change password/i, exact: false }).last().click();

    await expect(page.getByText(/at least 8 characters/i)).toBeVisible({ timeout: 5000 });
  });

  test('shows inline error when passwords do not match', async ({ page }) => {
    await openChangePasswordForm(page);

    const inputs = page.locator('input[type="password"]');
    await inputs.nth(0).fill('123456');
    await inputs.nth(1).fill('Admin@1234');
    await inputs.nth(2).fill('Admin@9999');

    await page.getByRole('button', { name: /change password/i, exact: false }).last().click();

    await expect(page.getByText(/passwords don't match/i)).toBeVisible({ timeout: 5000 });
  });

  test('shows error toast when current password is wrong', async ({ page }) => {
    // Mock the backend to return 401 — endpoint may not be live yet in test env
    await page.route('**/auth/change-password', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          statusCode: 401,
          message: 'Current password is incorrect',
        }),
      });
    });

    await openChangePasswordForm(page);

    const inputs = page.locator('input[type="password"]');
    await inputs.nth(0).fill('WrongPassword99');
    await inputs.nth(1).fill('Admin@1234');
    await inputs.nth(2).fill('Admin@1234');

    await page.getByRole('button', { name: /change password/i, exact: false }).last().click();

    // Error toast should appear with the backend message
    await expect(page.getByText(/current password is incorrect/i)).toBeVisible({ timeout: 8000 });
  });

  test('happy path: mocked success → toast appears and form dismisses', async ({ page }) => {
    // Mock the API so we don't actually change the DB password
    await page.route('**/auth/change-password', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Password changed successfully' }),
      });
    });

    await openChangePasswordForm(page);

    const inputs = page.locator('input[type="password"]');
    await inputs.nth(0).fill('123456');
    await inputs.nth(1).fill('Admin@1234');
    await inputs.nth(2).fill('Admin@1234');

    await page.getByRole('button', { name: /change password/i, exact: false }).last().click();

    // Success toast
    await expect(
      page.getByText(/password has been changed successfully/i),
    ).toBeVisible({ timeout: 8000 });

    // Form dismissed — profile buttons reappear
    await expect(page.getByRole('button', { name: /change password/i })).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByLabel(/current password/i)).not.toBeVisible();
  });

  test('password reveal toggle makes password visible', async ({ page }) => {
    await openChangePasswordForm(page);

    const firstPasswordInput = page.locator('input[type="password"]').first();
    await firstPasswordInput.fill('TestPassword1');

    // Input starts as password type
    await expect(firstPasswordInput).toHaveAttribute('type', 'password');

    // Toggle uses onPointerDown — use dispatchEvent for reliability
    const toggleButton = page.getByLabel(/toggle password visibility/i).first();
    await toggleButton.dispatchEvent('pointerdown', { button: 0, bubbles: true });

    // After toggle: the input switches to type="text"
    await expect(page.locator('input[type="text"]').first()).toBeVisible({ timeout: 3000 });
  });
});
