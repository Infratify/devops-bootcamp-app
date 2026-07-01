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

test('scrolling to the bottom scrubs without errors and moves the whale', async ({ page }) => {
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  await page.waitForFunction(() => document.body.dataset.mode === 'webgl')
  const startX = await page.evaluate(() => window.__scene.whale.object.position.x)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(15000)
  const endX = await page.evaluate(() => window.__scene.whale.object.position.x)
  expect(endX).toBeGreaterThan(startX)
  expect(errors, errors.join('\n')).toEqual([])
})
