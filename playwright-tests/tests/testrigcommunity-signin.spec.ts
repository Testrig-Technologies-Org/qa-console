import { test, expect, type Page } from '@playwright/test';

const SIGN_IN_URL = 'https://www.testrigcommunity.com/auth/sign-in';

function signInForm(page: Page) {
  return page.locator('form').filter({ has: page.locator('#email') });
}

test.describe('TestRig Community — Sign In', () => {
  test('sign-in page loads with the expected form', async ({ page }) => {
    await test.step('open the sign-in page', async () => {
      await page.goto(SIGN_IN_URL);
      console.log(`Loaded sign-in page: ${page.url()}`);
    });

    await test.step('verify heading and copy', async () => {
      await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    });

    await test.step('verify email/password fields', async () => {
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
      console.log('Email and password fields are visible');
    });

    await test.step('verify sign-in and SSO buttons', async () => {
      await expect(signInForm(page).getByRole('button', { name: 'Sign In' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Google' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Microsoft' })).toBeVisible();
      console.log('Sign In, Google, and Microsoft buttons are visible');
    });
  });

  test('empty submission keeps required fields invalid', async ({ page }) => {
    await test.step('open the sign-in page', async () => {
      await page.goto(SIGN_IN_URL);
    });

    await test.step('submit with empty fields', async () => {
      await signInForm(page).getByRole('button', { name: 'Sign In' }).click();
      console.log('Submitted the form with no email/password filled in');
    });

    await test.step('verify browser-native validation blocks submission', async () => {
      await expect(page.locator('#email')).toHaveJSProperty('validity.valueMissing', true);
      console.log('Email field correctly reports validity.valueMissing = true');
    });
  });
});
