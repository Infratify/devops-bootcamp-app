import { describe, it, expect } from 'vitest'
import { createAudioContext } from '../src/audio/context.js'

describe('audio modules (import smoke)', () => {
  it('context exports a factory', () => {
    expect(typeof createAudioContext).toBe('function')
  })
})
