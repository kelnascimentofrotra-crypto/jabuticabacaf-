import { defineConfig, devices } from '@playwright/test';

const LOCAL = 'http://localhost:4173';
const CLOUD = 'http://localhost:4174';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  reporter: [['list']],
  use: {
    trace: 'retain-on-failure',
    permissions: ['clipboard-read', 'clipboard-write'],
    locale: 'pt-BR',
  },
  projects: [
    { name: 'desktop', testMatch: /local\..*\.spec\.ts/, use: { ...devices['Desktop Chrome'], baseURL: LOCAL, viewport: { width: 1366, height: 860 } } },
    { name: 'mobile', testMatch: /mobile\.spec\.ts/, use: { ...devices['Pixel 7'], baseURL: LOCAL } },
    { name: 'cloud', testMatch: /cloud\.spec\.ts/, use: { ...devices['Desktop Chrome'], baseURL: CLOUD } },
  ],
  webServer: [
    {
      command: 'npx vite build --outDir dist-e2e-local && npx vite preview --outDir dist-e2e-local --port 4173 --strictPort',
      url: LOCAL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' },
    },
    {
      command: 'npx vite build --outDir dist-e2e-cloud && npx vite preview --outDir dist-e2e-cloud --port 4174 --strictPort',
      url: CLOUD,
      reuseExistingServer: false,
      timeout: 120_000,
      env: { VITE_SUPABASE_URL: 'https://mock.supabase.test', VITE_SUPABASE_ANON_KEY: 'anon-key-de-teste' },
    },
  ],
});
