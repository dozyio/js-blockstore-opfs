import { type PlaywrightTestConfig, devices } from '@playwright/test'

const config: PlaywrightTestConfig = {
  projects: [
    /* Test against desktop browsers */
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Webkit disabled - https://github.com/web-platform-tests/interop/issues/172#issuecomment-1265925763
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // }
  ],
  use: {
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
