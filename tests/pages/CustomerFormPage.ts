import { Page, Locator } from '@playwright/test';

export class CustomerFormPage {
  readonly page: Page;
  readonly form: Locator;
  readonly customerName: Locator;
  readonly contactLastName: Locator;
  readonly contactFirstName: Locator;
  readonly phone: Locator;
  readonly addressLine1: Locator;
  readonly addressLine2: Locator;
  readonly city: Locator;
  readonly state: Locator;
  readonly postalCode: Locator;
  readonly country: Locator;
  readonly salesRepEmployeeNumber: Locator;
  readonly creditLimit: Locator;
  readonly deleted: Locator;
  readonly saveButton: Locator;
  readonly saveAndGoBackButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly chosenDropdown: Locator;
  readonly chosenSearch: Locator;
  readonly chosenResults: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator('#crudForm');
    this.customerName = page.locator('#field-customerName');
    this.contactLastName = page.locator('#field-contactLastName');
    this.contactFirstName = page.locator('#field-contactFirstName');
    this.phone = page.locator('#field-phone');
    this.addressLine1 = page.locator('#field-addressLine1');
    this.addressLine2 = page.locator('#field-addressLine2');
    this.city = page.locator('#field-city');
    this.state = page.locator('#field-state');
    this.postalCode = page.locator('#field-postalCode');
    this.country = page.locator('#field-country');
    this.salesRepEmployeeNumber = page.locator('#field-salesRepEmployeeNumber');
    this.creditLimit = page.locator('#field-creditLimit');
    this.deleted = page.locator('#field-deleted');
    this.saveButton = page.locator('#form-button-save');
    this.saveAndGoBackButton = page.locator('#save-and-go-back-button');
    this.cancelButton = page.locator('#cancel-button');
    this.errorMessage = page.locator('#report-error');
    this.successMessage = page.locator('#report-success');
    this.chosenDropdown = page.locator('#field_salesRepEmployeeNumber_chosen');
    this.chosenSearch = page.locator('#field_salesRepEmployeeNumber_chosen .chosen-search input');
    this.chosenResults = page.locator('#field_salesRepEmployeeNumber_chosen .chosen-results li');
  }

  async waitForFormLoad(): Promise<void> {
    await this.customerName.waitFor({ state: 'visible', timeout: 15000 });
  }

  async fillCustomerName(value: string): Promise<void> {
    await this.customerName.fill(value);
  }

  async fillContactLastName(value: string): Promise<void> {
    await this.contactLastName.fill(value);
  }

  async fillContactFirstName(value: string): Promise<void> {
    await this.contactFirstName.fill(value);
  }

  async fillPhone(value: string): Promise<void> {
    await this.phone.fill(value);
  }

  async fillAddressLine1(value: string): Promise<void> {
    await this.addressLine1.fill(value);
  }

  async fillAddressLine2(value: string): Promise<void> {
    await this.addressLine2.fill(value);
  }

  async fillCity(value: string): Promise<void> {
    await this.city.fill(value);
  }

  async fillState(value: string): Promise<void> {
    await this.state.fill(value);
  }

  async fillPostalCode(value: string): Promise<void> {
    await this.postalCode.fill(value);
  }

  async fillCountry(value: string): Promise<void> {
    await this.country.fill(value);
  }

  async selectSalesRepEmployeeNumber(value: string): Promise<void> {
    await this.chosenDropdown.click();
    await this.chosenSearch.waitFor({ state: 'visible', timeout: 5000 });
    await this.chosenSearch.fill(value);
    await this.page.waitForTimeout(500);
    await this.chosenResults.first().click();
  }

  async fillCreditLimit(value: string): Promise<void> {
    await this.creditLimit.fill(value);
  }

  async fillDeleted(value: string): Promise<void> {
    await this.deleted.fill(value);
  }

  async fillRequiredFields(data: {
    customerName: string;
    contactLastName: string;
    contactFirstName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    salesRepEmployeeNumber?: string;
    creditLimit?: string;
  }): Promise<void> {
    await this.fillCustomerName(data.customerName);
    await this.fillContactLastName(data.contactLastName);
    await this.fillContactFirstName(data.contactFirstName);
    await this.fillPhone(data.phone);
    await this.fillAddressLine1(data.addressLine1);
    await this.fillCity(data.city);
    await this.fillState(data.state);
    await this.fillPostalCode(data.postalCode);
    await this.fillCountry(data.country);
    
    if (data.salesRepEmployeeNumber) {
      await this.selectSalesRepEmployeeNumber(data.salesRepEmployeeNumber);
    }
    
    if (data.creditLimit) {
      await this.fillCreditLimit(data.creditLimit);
    }
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickSaveAndGoBack(): Promise<void> {
    await this.saveAndGoBackButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    // Aguarda navegar para success/... ou voltar para bootstrap_theme_v4 (lista)
    await this.page.waitForURL('**/success/**', { timeout: 15000 }).catch(() => 
      this.page.waitForURL('**/bootstrap_theme_v4**', { timeout: 5000 })
    );
  }

  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForURL('**/bootstrap_theme_v4**', { timeout: 15000 });
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  async isSuccessVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() || '';
  }

  async getSuccessMessage(): Promise<string> {
    return (await this.successMessage.textContent())?.trim() || '';
  }

  async getCustomerNameValue(): Promise<string> {
    return await this.customerName.inputValue();
  }
}
