# Grocery CRUD Automation - Playwright E2E Tests

Automação de testes end-to-end para o [Grocery CRUD Demo](https://www.grocerycrud.com/v1.x/demo/bootstrap_theme_v4) usando Playwright.

## Estrutura do Projeto

```
.
├── package.json              # Dependências e scripts npm
├── package-lock.json         # Lockfile de dependências
├── tsconfig.json             # Configuração TypeScript
├── playwright.config.ts      # Configuração Playwright (browsers, timeouts, reporters)
├── .github/workflows/        # Pipelines CI/CD GitHub Actions
│   └── playwright.yml        # Workflow de execução de testes E2E
├── tests/                    # Suíte de testes
│   ├── e2e/                  # Testes end-to-end (specs)
│   │   ├── grocery-crud-consulta.spec.ts      # 8 testes de consulta de dados
│   │   └── grocery-crud-add-customer.spec.ts  # 3 testes de inclusão de customer
│   ├── fixtures/             # Fixtures Playwright (injeção de Page Objects)
│   │   └── groceryCrudFixtures.ts             # Fixtures groceryCrudPage + customerFormPage
│   └── pages/                # Page Objects (modelo POM)
│       ├── GroceryCrudPage.ts                 # Page Object - Lista de customers (tabela, busca, paginação)
│       └── CustomerFormPage.ts                # Page Object - Formulário add/edit (13 campos, dropdown Chosen)
├── test-results/             # Resultados de execução (screenshots, videos, traces) - gerado automaticamente
└── playwright-report/        # Relatório HTML do Playwright - gerado automaticamente
```

### Responsabilidade de Cada Pacote/Pasta

| Caminho | Responsabilidade |
|---------|------------------|
| `package.json` | Gerencia dependências (@playwright/test, typescript), scripts de execução (test, test:consulta, test:add-customer, test:ci) e metadados do projeto |
| `tsconfig.json` | Configuração TypeScript (target ES2020, module commonjs, strict mode, paths para imports)
| `playwright.config.ts` | Configuração global Playwright: baseURL, browsers (chromium), timeouts, retries, workers, reporters, artifacts (trace/screenshot/video on failure) |
| `.github/workflows/playwright.yml` | Pipeline CI/CD: executa em push/PR para main/develop, instala Node 20 + Chromium, roda testes, publica HTML report e artefatos de falha |
| `tests/e2e/` | Casos de teste organizados por funcionalidade (consulta vs inclusão), usam fixtures para receber Page Objects prontos |
| `tests/fixtures/groceryCrudFixtures.ts` | Extende `test` do Playwright provendo `groceryCrudPage` e `customerFormPage` já instanciados; faz navegação inicial para URL base |
| `tests/pages/GroceryCrudPage.ts` | **Page Object da lista**: encapsula seletores da tabela, busca, paginação, botões Add/Export/Print; expõe métodos de navegação (`goto`, `clickAddButton`), consulta (`searchByName`, `getAllRowsData`) e validação |
| `tests/pages/CustomerFormPage.ts` | **Page Object do formulário**: mapeia 13 campos (incluindo dropdown Chosen `salesRepEmployeeNumber`); expõe `fillRequiredFields` para preenchimento em lote, ações (`clickSaveAndGoBack`, `clickCancel`) e validação via URL |
| `test-results/` | **Artefato gerado**: screenshots, videos, traces de falhas + JSON de resultados; usado para debug e CI artifacts |
| `playwright-report/` | **Artefato gerado**: relatório HTML interativo com timeline, erros, screenshots; aberto via `npm run test:report` |

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Instalação

```bash
npm install
npx playwright install chromium
```

## Executando os Testes

```bash
# Todos os testes (11 testes)
npm test

# Apenas testes de consulta (8 testes)
npm run test:consulta

# Apenas testes de inclusão de customer (3 testes)
npm run test:add-customer

# Com interface visual (headed mode)
npm run test:headed

# Com UI do Playwright (modo interativo)
npm run test:ui

# Ver relatório HTML da última execução
npm run test:report

# Simula execução CI (reporter line)
npm run test:ci
```

## Testes Implementados

### Consulta de Dados (`tests/e2e/grocery-crud-consulta.spec.ts` - 8 testes)

1. **deve carregar a tabela de clientes corretamente** - Verifica se a tabela carrega e tem linhas
2. **deve exibir cabeçalhos da tabela esperados** - Valida cabeçalhos da tabela
3. **deve realizar busca por nome de cliente** - Testa busca funcionando
4. **deve limpar busca e restaurar todos os registros** - Verifica limpeza de busca
5. **deve navegar entre páginas da paginação** - Testa paginação
6. **deve alterar quantidade de linhas por página** - Testa seletor de linhas por página
7. **deve validar estrutura de dados das linhas** - Valida estrutura dos dados
8. **deve verificar botões de ação disponíveis** - Verifica botões Add, Export, Print

### Inclusão de Customer (`tests/e2e/grocery-crud-add-customer.spec.ts` - 3 testes)

1. **deve incluir novo customer com dados válidos** - Preenche todos os campos (incluindo dropdown Chosen) e valida sucesso via URL `/success`
2. **deve cancelar inclusão e voltar para lista** - Preenche formulário, cancela e valida retorno à lista
3. **deve incluir customer com campos mínimos obrigatórios** - Preenche apenas campos obrigatórios e valida sucesso

## Page Object Model

### `GroceryCrudPage` - Lista de Customers (`tests/pages/GroceryCrudPage.ts`)
- Seletores da tabela, busca, paginação, botões de ação
- Métodos: `goto()`, `clickAddButton()`, `searchByName()`, `getRowCount()`, `getAllRowsData()`, paginação

### `CustomerFormPage` - Formulário Add/Edit (`tests/pages/CustomerFormPage.ts`)
- Mapeia todos os 13 campos do formulário
- Tratamento especial para dropdown Chosen (`salesRepEmployeeNumber`)
- Método `fillRequiredFields()` para preenchimento em lote
- Métodos de ação: `clickSaveAndGoBack()`, `clickCancel()`, `clickSave()`
- Validações via URL de navegação

## Configuração do Playwright

- **Base URL**: https://www.grocerycrud.com/v1.x/demo/bootstrap_theme_v4
- **Browser**: Chromium (Desktop Chrome)
- **Workers**: 1 (sequencial para estabilidade)
- **Retries**: 2 em CI, 0 localmente
- **Timeouts**: 60s global, 10s expect, 30s navigation, 15s action
- **Artifacts**: Trace, screenshot e video apenas em falhas

## CI/CD (GitHub Actions)

Os testes rodam automaticamente em:
- Push para `main` e `develop`
- Pull Requests para `main`
- Execução manual via `workflow_dispatch`

### Artefatos em CI:
- Playwright HTML Report (sempre, 30 dias)
- Traces, screenshots e videos (apenas em falhas, 30 dias)
- Todos test-results (sempre, 30 dias)

### Execução local do CI:
```bash
# Simula execução CI localmente
npm run test:ci
```

## Boas Práticas Aplicadas

✅ **Page Object Model** - Separação clara entre páginas  
✅ **DRY** - Métodos reutilizáveis (`fillRequiredFields`)  
✅ **Clean Code** - Nomes descritivos, sem comentários desnecessários  
✅ **SOLID** - Responsabilidade única por classe  
✅ **Seletores Estáveis** - IDs, data-attributes, sem XPath frágil  
✅ **Fixtures** - Injeção de dependência via `test.extend`  
✅ **Waits Inteligentes** - `waitForURL`, `waitFor` state visible, sem `waitForTimeout` excessivo  
✅ **Anti-Flake** - Timeouts adequados, waits explícitos, validação por URL de navegação
