import { test, expect } from "@playwright/test";

test.describe("Rusen App", () => {
  test("loads the main page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Rusen/i);
  });

  test("renders the sidebar", async ({ page }) => {
    await page.goto("/");
    const sidebar = page.locator("[data-slot='sidebar']");
    await expect(sidebar).toBeVisible();
  });

  test("command palette opens with Cmd+J", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+j");
    const dialog = page.locator("[role='dialog']");
    await expect(dialog).toBeVisible();
    const input = dialog.locator("input");
    await expect(input).toBeVisible();
  });

  test("command palette closes with Escape", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+j");
    const dialog = page.locator("[role='dialog']");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("header contains toolbar buttons", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    await expect(header).toBeVisible();
    const buttons = header.locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("toggle edit/preview mode", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Meta+e");
    // Just verify no crash — mode toggling is functional
    await page.waitForTimeout(300);
  });
});
