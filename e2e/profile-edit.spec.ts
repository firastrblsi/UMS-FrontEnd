import { test, expect, type Page } from '@playwright/test';

// ── Helpers ───────────────────────────────────────────────────────────────────

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.getByLabel(/email/i).fill(email);
  // Use input[type="password"] to avoid matching the toggle button
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  // Wait for redirect away from login
  await page.waitForURL((url) => !url.pathname.includes('/auth/login'), { timeout: 10000 });
}

async function navigateToProfile(page: Page) {
  await page.goto('/profile');
  await page.waitForLoadState('networkidle');
}

// ── Admin Tests ───────────────────────────────────────────────────────────────

test.describe('UMS-24 — Admin Profile Self-Edit', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin@ums.com', '123456');
  });

  test('profile page renders for admin with Edit Profile button', async ({ page }) => {
    await navigateToProfile(page);
    await expect(page.getByRole('button', { name: /edit profile/i })).toBeVisible();
  });

  test('clicking Edit Profile shows the edit form', async ({ page }) => {
    await navigateToProfile(page);
    await page.getByRole('button', { name: /edit profile/i }).click();
    // The form should appear
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
  });

  test('can update firstName and save — PATCH returns 200 and form dismisses', async ({ page }) => {
    await navigateToProfile(page);
    await page.getByRole('button', { name: /edit profile/i }).click();

    const firstNameInput = page.getByLabel(/first name/i);
    await firstNameInput.clear();
    await firstNameInput.fill('AdminTest');

    // Wait for PATCH /users/me to complete alongside the click
    const [response] = await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes('/users/me') && resp.request().method() === 'PATCH',
        { timeout: 10000 },
      ),
      page.getByRole('button', { name: /save changes/i }).click(),
    ]);

    // Network call succeeded
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstName).toBe('AdminTest');

    // Form dismisses and UI reflects the updated name
    await expect(page.getByRole('button', { name: /edit profile/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('AdminTest', { exact: false })).toBeVisible();
  });

  test('Cancel button returns to view mode without form', async ({ page }) => {
    await navigateToProfile(page);
    await page.getByRole('button', { name: /edit profile/i }).click();
    await expect(page.getByLabel(/first name/i)).toBeVisible();

    await page.getByRole('button', { name: /cancel/i }).click();

    // Form should be gone
    await expect(page.getByLabel(/first name/i)).not.toBeVisible();
    // Edit button should reappear
    await expect(page.getByRole('button', { name: /edit profile/i })).toBeVisible();
  });

  test('form does not expose role or isActive fields', async ({ page }) => {
    await navigateToProfile(page);
    await page.getByRole('button', { name: /edit profile/i }).click();

    // These fields should NOT exist in the self-edit form
    await expect(page.getByLabel(/^role$/i)).not.toBeVisible();
    await expect(page.getByLabel(/is active/i)).not.toBeVisible();
    await expect(page.getByLabel(/password/i)).not.toBeVisible();
  });

  test('restored original name after reverting update', async ({ page }) => {
    await navigateToProfile(page);
    await page.getByRole('button', { name: /edit profile/i }).click();

    const firstNameInput = page.getByLabel(/first name/i);
    await firstNameInput.clear();
    await firstNameInput.fill('Admin');

    await Promise.all([
      page.waitForResponse(
        (resp) => resp.url().includes('/users/me') && resp.request().method() === 'PATCH',
        { timeout: 10000 },
      ),
      page.getByRole('button', { name: /save changes/i }).click(),
    ]);
  });
});

// ── Student Tests (skipped if no active student user available) ───────────────

test.describe('UMS-24 — Student Profile Self-Edit', () => {
  // These tests require a seeded active student user.
  // Set STUDENT_EMAIL and STUDENT_PASSWORD env vars to enable.
  const studentEmail = process.env.STUDENT_EMAIL ?? '';
  const studentPassword = process.env.STUDENT_PASSWORD ?? '123456';

  test.skip(!studentEmail, 'STUDENT_EMAIL not set — skipping student tests');

  test.beforeEach(async ({ page }) => {
    await loginAs(page, studentEmail, studentPassword);
  });

  test('student profile page has Edit Profile button', async ({ page }) => {
    await navigateToProfile(page);
    await expect(page.getByRole('button', { name: /edit profile/i })).toBeVisible();
  });

  test('student edit form has Personal Info, Guardian Info, Medical tabs', async ({ page }) => {
    await navigateToProfile(page);
    await page.getByRole('button', { name: /edit profile/i }).click();

    await expect(page.getByRole('tab', { name: /personal info/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /guardian info/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /medical/i })).toBeVisible();
  });

  test('student cannot see status or programId fields', async ({ page }) => {
    await navigateToProfile(page);
    await page.getByRole('button', { name: /edit profile/i }).click();

    await expect(page.getByLabel(/^status$/i)).not.toBeVisible();
    await expect(page.getByLabel(/program/i)).not.toBeVisible();
  });

  test('student can update guardian info', async ({ page }) => {
    await navigateToProfile(page);
    await page.getByRole('button', { name: /edit profile/i }).click();

    await page.getByRole('tab', { name: /guardian info/i }).click();
    const guardianNameInput = page.getByLabel(/guardian name/i);
    await guardianNameInput.clear();
    await guardianNameInput.fill('Test Guardian');

    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible({ timeout: 8000 });
  });
});

// ── Teacher Tests (skipped if no active teacher user available) ───────────────

test.describe('UMS-24 — Teacher Profile Self-Edit', () => {
  const teacherEmail = process.env.TEACHER_EMAIL ?? '';
  const teacherPassword = process.env.TEACHER_PASSWORD ?? '123456';

  test.skip(!teacherEmail, 'TEACHER_EMAIL not set — skipping teacher tests');

  test.beforeEach(async ({ page }) => {
    await loginAs(page, teacherEmail, teacherPassword);
  });

  test('teacher profile page has Edit Profile button', async ({ page }) => {
    await navigateToProfile(page);
    await expect(page.getByRole('button', { name: /edit profile/i })).toBeVisible();
  });

  test('teacher edit form has Personal Info, Professional, Education tabs', async ({ page }) => {
    await navigateToProfile(page);
    await page.getByRole('button', { name: /edit profile/i }).click();

    await expect(page.getByRole('tab', { name: /personal info/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /professional/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /education/i })).toBeVisible();
  });

  test('teacher cannot see departmentId or contractType fields', async ({ page }) => {
    await navigateToProfile(page);
    await page.getByRole('button', { name: /edit profile/i }).click();

    await expect(page.getByLabel(/department/i)).not.toBeVisible();
    await expect(page.getByLabel(/contract type/i)).not.toBeVisible();
  });

  test('teacher can update bio and see success toast', async ({ page }) => {
    await navigateToProfile(page);
    await page.getByRole('button', { name: /edit profile/i }).click();

    await page.getByRole('tab', { name: /professional/i }).click();
    const bioTextarea = page.getByLabel(/bio/i);
    await bioTextarea.clear();
    await bioTextarea.fill('Updated bio via Playwright test.');

    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible({ timeout: 8000 });
  });
});
