import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    // Use the Chromium browser
    browserName: 'chromium',
    // Headless mode for faster execution; set to false if you need to see the browser
    headless: true,
    // Permissions needed for OPFS
    // permissions: ['storage-access'],
  },
  webServer: {
    command: 'npx vite',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
};

export default config;
