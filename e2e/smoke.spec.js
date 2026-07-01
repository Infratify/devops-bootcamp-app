import { test, expect } from '@playwright/test'

test('page boots in webgl mode with no console errors', async ({ page }) => {
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(e.message))

  await page.goto('/')
  await expect(page.locator('#stage')).toBeVisible()
  await page.waitForFunction(() => document.body.dataset.mode === 'webgl')
  await page.waitForTimeout(500)

  expect(errors, errors.join('\n')).toEqual([])
})
