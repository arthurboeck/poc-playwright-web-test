import { test, expect } from '../fixtures/groceryCrudFixtures';

test.describe('Grocery CRUD - Inclusão de Customer', () => {
  test.beforeEach(async ({ groceryCrudPage }) => {
    await groceryCrudPage.goto();
  });

  test('deve incluir novo customer com dados válidos', async ({ groceryCrudPage, customerFormPage }) => {
    await groceryCrudPage.clickAddButton();
    await customerFormPage.waitForFormLoad();

    const customerData = {
      customerName: 'Test Customer Automation',
      contactLastName: 'Silva',
      contactFirstName: 'João',
      phone: '+55 11 99999-9999',
      addressLine1: 'Rua das Flores, 123',
      addressLine2: 'Apto 45',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '01234-567',
      country: 'Brazil',
      salesRepEmployeeNumber: '1102',
      creditLimit: '50000.00',
    };

    await customerFormPage.fillRequiredFields(customerData);
    await customerFormPage.clickSaveAndGoBack();

    await expect(groceryCrudPage.page).toHaveURL(/success/);
  });

  test('deve cancelar inclusão e voltar para lista', async ({ groceryCrudPage, customerFormPage }) => {
    await groceryCrudPage.clickAddButton();
    await customerFormPage.waitForFormLoad();

    await customerFormPage.fillCustomerName('Test Cancel');
    await customerFormPage.fillContactLastName('Cancel');
    await customerFormPage.fillContactFirstName('Test');
    await customerFormPage.fillPhone('+55 11 99999-9999');
    await customerFormPage.fillAddressLine1('Rua Teste');
    await customerFormPage.fillCity('São Paulo');
    await customerFormPage.fillState('SP');
    await customerFormPage.fillPostalCode('01234-567');
    await customerFormPage.fillCountry('Brazil');

    await customerFormPage.clickCancel();

    await expect(groceryCrudPage.page).toHaveURL(/bootstrap_theme_v4/);
    await groceryCrudPage.table.waitFor({ state: 'visible' });
  });

  test('deve incluir customer com campos obrigatórios do backend', async ({ groceryCrudPage, customerFormPage }) => {
    await groceryCrudPage.clickAddButton();
    await customerFormPage.waitForFormLoad();

    // O backend exige todos estes campos (incluindo dropdown Chosen e creditLimit)
    const requiredData = {
      customerName: 'Backend Required Customer',
      contactLastName: 'Backend',
      contactFirstName: 'Required',
      phone: '+55 11 77777-7777',
      addressLine1: 'Av. Obrigatória, 50',
      city: 'Belo Horizonte',
      state: 'MG',
      postalCode: '30000-000',
      country: 'Brazil',
      salesRepEmployeeNumber: '1102',
      creditLimit: '10000.00',
    };

    await customerFormPage.fillRequiredFields(requiredData);
    await customerFormPage.clickSaveAndGoBack();

    await expect(groceryCrudPage.page).toHaveURL(/success/);
  });
});
