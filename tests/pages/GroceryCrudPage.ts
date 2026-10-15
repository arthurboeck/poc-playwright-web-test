import { Page, Locator } from '@playwright/test';

export class GroceryCrudPage {
  readonly page: Page;
  readonly table: Locator;
  readonly searchInputs: Locator;
  readonly nameSearchInput: Locator;
  readonly addButton: Locator;
  readonly exportButton: Locator;
  readonly printButton: Locator;
  readonly pagination: Locator;
  readonly rowsPerPage: Locator;
  readonly columnHeaders: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.locator('table.grocery-crud-table');
    this.searchInputs = page.locator('input.searchable-input');
    this.nameSearchInput = page.locator('input[name="customerName"]');
    this.addButton = page.locator('a.add-button, a[href*="add"], button:has-text("Add")').first();
    this.exportButton = page.locator('a:has-text("Export"), button:has-text("Export")').first();
    this.printButton = page.locator('a:has-text("Print"), button:has-text("Print")').first();
    this.pagination = page.locator('.pagination');
    this.rowsPerPage = page.locator('select.per_page');
    this.columnHeaders = page.locator('table thead th');
    this.tableRows = page.locator('table tbody tr');
  }

  async goto() {
    const currentUrl = this.page.url();
    if (!currentUrl.includes('grocerycrud.com')) {
      await this.page.goto('/');
      await this.table.waitFor({ state: 'visible', timeout: 30000 });
    } else {
      await this.table.waitFor({ state: 'visible', timeout: 10000 });
    }
  }

  async searchByName(query: string) {
    await this.nameSearchInput.fill(query);
    await this.nameSearchInput.press('Enter');
    await this.table.waitFor({ state: 'visible', timeout: 10000 });
  }

  async search(query: string) {
    await this.searchByName(query);
  }

  async clearSearch() {
    await this.nameSearchInput.fill('');
    await this.nameSearchInput.press('Enter');
    await this.table.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getRowCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async getColumnHeaders(): Promise<string[]> {
    const headers = await this.columnHeaders.allTextContents();
    return headers.map(h => h.trim()).filter(h => h.length > 0);
  }

  async getRowData(rowIndex: number): Promise<string[]> {
    const row = this.tableRows.nth(rowIndex);
    const cells = row.locator('td');
    const count = await cells.count();
    const data: string[] = [];
    for (let i = 0; i < count; i++) {
      data.push((await cells.nth(i).textContent())?.trim() || '');
    }
    return data;
  }

  async getAllRowsData(): Promise<string[][]> {
    const count = await this.getRowCount();
    const rows: string[][] = [];
    for (let i = 0; i < count; i++) {
      rows.push(await this.getRowData(i));
    }
    return rows;
  }

  async clickAddButton() {
    await this.addButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.addButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForURL('**/add*', { timeout: 15000 });
  }

  async clickEditButton() {
    const editButtons = this.table.locator('a:has-text("Edit")').first();
    await editButtons.waitFor({ state: 'visible', timeout: 10000 });
    await editButtons.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForURL('**/edit/**', { timeout: 15000 });
  }

  async selectRowsPerPage(count: number) {
    await this.rowsPerPage.selectOption(String(count));
    await this.page.waitForTimeout(1000);
  }

  async goToPage(pageNumber: number) {
    const pageLink = this.pagination.locator(`a:has-text("${pageNumber}"), button:has-text("${pageNumber}")`).first();
    if (await pageLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await pageLink.click();
      await this.page.waitForTimeout(1000);
    }
  }

  async isTableVisible(): Promise<boolean> {
    return await this.table.isVisible();
  }

  async isSearchVisible(): Promise<boolean> {
    return await this.nameSearchInput.isVisible();
  }

  async getSearchValue(): Promise<string> {
    return await this.nameSearchInput.inputValue();
  }

  async getPaginationPageNumbers(): Promise<string[]> {
    const links = await this.pagination.locator('a, button').all();
    const numbers: string[] = [];
    for (const link of links) {
      const text = (await link.textContent())?.trim();
      if (text && /^\d+$/.test(text)) {
        numbers.push(text);
      }
    }
    return numbers;
  }
}
