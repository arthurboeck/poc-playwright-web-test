import { test as base, Page } from '@playwright/test';
import { GroceryCrudPage } from '../pages/GroceryCrudPage';
import { CustomerFormPage } from '../pages/CustomerFormPage';

type GroceryCrudFixtures = {
  groceryCrudPage: GroceryCrudPage;
  customerFormPage: CustomerFormPage;
};

export const test = base.extend<GroceryCrudFixtures>({
  groceryCrudPage: async ({ page }, use) => {
    const groceryCrudPage = new GroceryCrudPage(page);
    
    await page.goto('https://www.grocerycrud.com/v1.x/demo/bootstrap_theme_v4');
    await page.waitForTimeout(3000);
    await use(groceryCrudPage);
  },
  
  customerFormPage: async ({ page }, use) => {
    const customerFormPage = new CustomerFormPage(page);
    await use(customerFormPage);
  },
});

export { expect } from '@playwright/test';
