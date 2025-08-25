const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3000';

let browser;
let context;
let page;

let user = {
    email : "",
    password : "123456",
    confirmPass : "123456",
};

let recipeName = "";

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
        const random = Math.floor(Math.random() * 10000);
        user.email = `testuser${random}@test.com`;
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    describe("authentication", () => {
        test("register with valid data", async () => {
            await page.goto(host);
            await page.click('text=Register');
            await page.waitForSelector('form');

            await page.fill('#email', user.email);
            await page.fill('#password', user.password);
            await page.fill('#repeatPassword', user.confirmPass);

            await page.click('[type="submit"]');

            await expect(page.locator('nav >> text=Logout')).toBeVisible();
            expect(page.url()).toBe(host + '/');
        });

        test("login with valid data", async () => {
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            await page.fill('#email', user.email);
            await page.fill('#password', user.password);

            await page.click('[type="submit"]');

            await expect(page.locator('nav >> text=Logout')).toBeVisible();
            expect(page.url()).toBe(host + '/');
        });

        test("logout from the application", async () => {
            await page.goto(host);
            await page.click('text=Login');
            await page.fill('#email', user.email);
            await page.fill('#password', user.password);
            await page.click('[type="submit"]');

            await page.locator('nav >> text=Logout').click();

            await expect(page.locator('nav >> text=Login')).toBeVisible();
            expect(page.url()).toBe(host + '/');
        });
    });

    describe("navbar", () => {
        test("navigation for logged-in user", async () => {
            await page.goto(host);
            await page.click('text=Login');
            await page.fill('#email', user.email);
            await page.fill('#password', user.password);
            await page.click('[type="submit"]');

            await expect(page.locator('nav >> text=Home')).toBeVisible();
            await expect(page.locator('nav >> text=Discover')).toBeVisible();
            await expect(page.locator('nav >> text=Search')).toBeVisible();
            await expect(page.locator('nav >> text=Create Recipe')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeVisible();

            await expect(page.locator('nav >> text=Login')).toHaveCount(0);
            await expect(page.locator('nav >> text=Register')).toHaveCount(0);
        });

        test("navigation for guest user", async () => {
            await page.goto(host);

            await expect(page.locator('nav >> text=Home')).toBeVisible();
            await expect(page.locator('nav >> text=Discover')).toBeVisible();
            await expect(page.locator('nav >> text=Search')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeVisible();
            await expect(page.locator('nav >> text=Register')).toBeVisible();

            await expect(page.locator('nav >> text=Create Recipe')).toHaveCount(0);
            await expect(page.locator('nav >> text=Logout')).toHaveCount(0);
        });
    });

    describe("CRUD", () => {
        beforeEach(async () => {
            await page.goto(host);
            await page.click('text=Login');
            await page.fill('#email', user.email);
            await page.fill('#password', user.password);
            await page.click('[type="submit"]');
        });

        test("create a recipe", async () => {
            await page.click('text=Create Recipe');
            await page.waitForSelector('form');

            const random = Math.floor(Math.random() * 10000);
            recipeName = `Recipe ${random}`;

            await page.fill('[name="name"]', recipeName);
            await page.fill('[name="image"]', 'https://via.placeholder.com/150');
            await page.fill('[name="prepTime"]', '30 minutes');
            await page.fill('[name="sharedBy"]', 'Chef AI');
            await page.fill('[name="cuisineType"]', 'Fusion');
            await page.fill('[name="steps"]', 'Step 1: Mix ingredients. Step 2: Bake. Step 3: Serve.');

            await page.click('[type="submit"]');

            expect(page.url()).toBe(host + '/discover');
            await expect(page.locator(`text=${recipeName}`)).toBeVisible();
        });

        test("edit the recipe", async () => {
            await page.click('text=Search');
            await page.fill('input[name="search"]', recipeName);
            await page.click('text=Search');

            await page.click(`text=${recipeName}`);
            await page.click('text=Edit');

            await page.waitForSelector('form');

            recipeName += ' Updated';
            await page.fill('[name="name"]', recipeName);

            await page.click('[type="submit"]');
            await expect(page.locator('h1')).toContainText(recipeName);
        });

        test("delete the recipe", async () => {
            await page.click('text=Search');
            await page.fill('input[name="search"]', recipeName);
            await page.click('text=Search');

            await page.click(`text=${recipeName}`);
            await page.click('text=Delete');

            expect(page.url()).toBe(host + '/discover');
            await expect(page.locator(`text=${recipeName}`)).toHaveCount(0);
        });
    });
});
