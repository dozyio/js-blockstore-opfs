import { type PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  use: {
    // Use the Chromium browser
    browserName: 'chromium',
    // Headless mode for faster execution; set to false if you need to see the browser
    headless: true
  },
  webServer: {
    command: 'npx vite',
    port: 3000,
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    reuseExistingServer: !process.env.CI
  }
}

export default config
