# Grocery CRUD Automation - Playwright E2E Tests

Automação de testes end-to-end para o [Grocery CRUD Demo](https://www.grocerycrud.com/v1.x/demo/bootstrap_theme_v4) usando Playwright.

## Pré-requisitos

- Node.js 24
- npm

## Instalação

```bash
npm install
npx playwright install chromium
```

## Executando os Testes

```bash
# Todos os testes
npm test

# Apenas consulta
npm run test:consulta

# Apenas inclusão de customer
npm run test:add-customer

# Modo com interface visual
npm run test:headed

# Interface interativa do Playwright
npm run test:ui

# Execução CI (reporter line)
npm run test:ci

# Abrir relatório HTML da última execução
npm run test:report
```

## Relatórios Gerados

Após a execução, os seguintes arquivos são gerados:

- `tests/smart-report.html` — Relatório detalhado com histórico
- `tests/test-history.json` — Histórico de execuções
- `test-results/` — Screenshots, vídeos e traces de falhas

## Dependências

- `@playwright/test` — Framework de testes E2E
- `playwright-smart-reporter` — Relatório detalhado com histórico
- `@types/node` — Tipagens TypeScript para Node.js
- `typescript` — Compilador TypeScript
- `ts-node` — Execução de TypeScript direto no Node
- `prettier` — Formatador de código

## Estrutura de Pacotes

- `tests/e2e/` — Casos de teste (specs)
- `tests/pages/` — Page Objects (modelo POM)
- `tests/fixtures/` — Fixtures de injeção de dependência
- `test-results/` — Screenshots, vídeos e traces de falhas
- `.github/workflows/` — Pipelines CI/CD (GitHub Actions)

## CI/CD (GitHub Actions)

Os testes rodam automaticamente em push e pull request. Os artefatos (relatórios e resultados) são anexados como artifacts do GitHub Actions.
