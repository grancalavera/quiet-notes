import { expect, test } from "@playwright/test";
import { v4 as uuid } from "uuid";

test("selects main editor when last closed was additional", async ({
  page,
}) => {
  const email = `${uuid()}@quiet.works`;

  const signUp = async (withEmail: string, andPage: string | RegExp) => {
    await expect(page).toHaveURL(/.*login/);
    const authPrompt = page.waitForEvent("popup");
    await page.getByRole("button", { name: "Sign In with Google" }).click();
    const authPage = await authPrompt;
    await authPage.getByRole("button", { name: "Add new account" }).click();
    await authPage.locator("#email-input").click();
    await authPage.locator("#email-input").fill(withEmail);
    await authPage.locator("#email-input").press("Enter");
    await expect(page).toHaveURL(andPage);
  };

  const signIn = async (withEmail: string, andPage: string | RegExp) => {
    await expect(page).toHaveURL(/.*login/);
    const authPrompt = page.waitForEvent("popup");
    await page.getByRole("button", { name: "Sign In with Google" }).click();
    const authPage = await authPrompt;
    await authPage.getByText(withEmail).click();
    await expect(page).toHaveURL(andPage);
  };

  const signOut = async () => {
    await page.getByTestId("user-profile-button").click();
    await page.getByTestId("sign-out-button").click();
    await expect(page).toHaveURL(/.*login/);
  };

  await page.goto("http://localhost:3000/");

  await signUp(email, /.*lobby/);
  await signOut();

  await signIn("admin@example.com", /.*admin/);
  await page
    .getByTestId("toggle-role-author-" + email)
    .getByLabel("Toggle author role")
    .check();
  await signOut();

  await signIn(email, /.*notebook/);

  await page.getByLabel("create note").click();
  await page.getByTestId("note-editor-main").fill("1");
  await expect(page.getByTestId("note-editor-main")).toHaveText("1");

  await page.getByLabel("create note").click();
  await page.getByTestId("note-editor-main").click();
  await page.getByTestId("note-editor-main").fill("2");
  await expect(page.getByTestId("note-editor-main")).toHaveText("2");

  await page.getByLabel("Send to additional editor").click();
  await expect(page.getByTestId("note-editor-additional")).toHaveText("2");

  await page.getByTestId("note-editor-main").click();
  await page.getByTestId("notes-list-item-1").click();
  await expect(page.getByTestId("note-editor-main")).toHaveText("1");

  await page.getByTestId("note-editor-additional").click();
  await page.getByLabel("delete note").first().click();
  await page.getByTestId("notes-list-item-1").click();

  await expect(page.getByLabel("a quiet note")).toHaveCount(1);
});
