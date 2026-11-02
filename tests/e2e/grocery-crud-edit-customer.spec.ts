import { test, expect } from '../fixtures/groceryCrudFixtures';

test.describe('Grocery CRUD - Edição de Customer', () => {
  test.beforeEach(async ({ groceryCrudPage }) => {
    await groceryCrudPage.goto();
  });

  test('deve editar um customer existente com dados válidos', async ({ groceryCrudPage, customerFormPage }) => {
    await groceryCrudPage.clickEditButton();
    await customerFormPage.waitForFormLoad();

    const updatedData = {
      customerName: 'Customer Editado',
      contactLastName: 'Silva Editado',
      contactFirstName: 'João Editado',
      phone: '+55 11 88888-8888',
      addressLine1: 'Rua Editada, 456',
      city: 'Rio de Janeiro',
      state: 'RJ',
      postalCode: '20000-000',
      country: 'Brazil',
      salesRepEmployeeNumber: '1102',
      creditLimit: '75000.00',
    };

    await customerFormPage.fillRequiredFields(updatedData);
    await customerFormPage.clickSaveAndGoBack();

    await expect(groceryCrudPage.page).toHaveURL(/success/);
  });
});
