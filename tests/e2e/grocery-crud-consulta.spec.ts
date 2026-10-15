import { test, expect } from '../fixtures/groceryCrudFixtures';

test.describe('Grocery CRUD - Consulta de Dados', () => {
  test.beforeEach(async ({ groceryCrudPage }) => {
    await groceryCrudPage.goto();
  });

  test('deve carregar a tabela de clientes corretamente', async ({ groceryCrudPage }) => {
    await expect(groceryCrudPage.table).toBeVisible();
    const rowCount = await groceryCrudPage.getRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  test('deve exibir cabeçalhos da tabela esperados', async ({ groceryCrudPage }) => {
    const headers = await groceryCrudPage.getColumnHeaders();
    expect(headers.length).toBeGreaterThan(0);
    expect(headers.some(h => h.toLowerCase().includes('customer') || h.toLowerCase().includes('name'))).toBeTruthy();
  });

  test('deve realizar busca por nome de cliente', async ({ groceryCrudPage }) => {
    const initialCount = await groceryCrudPage.getRowCount();
    await groceryCrudPage.searchByName('Atelier');
    const filteredCount = await groceryCrudPage.getRowCount();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
  });

  test('deve limpar busca e restaurar todos os registros', async ({ groceryCrudPage }) => {
    await groceryCrudPage.searchByName('Atelier');
    const filteredCount = await groceryCrudPage.getRowCount();
    
    await groceryCrudPage.clearSearch();
    const allCount = await groceryCrudPage.getRowCount();
    
    expect(allCount).toBeGreaterThanOrEqual(filteredCount);
  });

  test('deve navegar entre páginas da paginação', async ({ groceryCrudPage }) => {
    const pageNumbers = await groceryCrudPage.getPaginationPageNumbers();
    if (pageNumbers.length > 1) {
      const firstPageRows = await groceryCrudPage.getAllRowsData();
      await groceryCrudPage.goToPage(parseInt(pageNumbers[1]));
      const secondPageRows = await groceryCrudPage.getAllRowsData();
      
      expect(secondPageRows.length).toBeGreaterThan(0);
      expect(secondPageRows).not.toEqual(firstPageRows);
    }
  });

  test('deve alterar quantidade de linhas por página', async ({ groceryCrudPage }) => {
    const rowsPerPage = groceryCrudPage.rowsPerPage;
    if (await rowsPerPage.isVisible()) {
      const initialCount = await groceryCrudPage.getRowCount();
      await groceryCrudPage.selectRowsPerPage(25);
      const newCount = await groceryCrudPage.getRowCount();
      
      expect(newCount).toBeLessThanOrEqual(25);
    }
  });

  test('deve validar estrutura de dados das linhas', async ({ groceryCrudPage }) => {
    const rowsData = await groceryCrudPage.getAllRowsData();
    expect(rowsData.length).toBeGreaterThan(0);
    
    for (const row of rowsData) {
      expect(row.length).toBeGreaterThan(0);
      const hasNonEmptyCell = row.some(cell => cell.trim().length > 0);
      expect(hasNonEmptyCell).toBeTruthy();
    }
  });

  test('deve verificar botões de ação disponíveis', async ({ groceryCrudPage }) => {
    await expect(groceryCrudPage.addButton).toBeVisible();
    await expect(groceryCrudPage.exportButton).toBeVisible();
    await expect(groceryCrudPage.printButton).toBeVisible();
  });
});
