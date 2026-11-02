import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'line',
  timeout: 60000,
  expect: { timeout: 10000 },
  use: {
    baseURL: 'https://www.grocerycrud.com/v1.x/demo/bootstrap_theme_v4',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: [
    [
      'playwright-smart-reporter',
      {
        outputFile: 'smart-report.html',
        historyFile: 'test-history.json',
        maxHistoryRuns: 10,
        enableAIRecommendations: false,
        enableCausalTimeline: true,
        forecast: {
          enable: true,
        },
      },
    ],
  ],
});
