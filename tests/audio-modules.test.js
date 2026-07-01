import { describe, it, expect } from 'vitest'
import { createAudioContext } from '../src/audio/context.js'
import { createBed } from '../src/audio/bed.js'
import { createSfx } from '../src/audio/sfx.js'

describe('audio modules (import smoke)', () => {
  it('context exports a factory', () => {
    expect(typeof createAudioContext).toBe('function')
  })

  it('bed exports a factory', () => {
    expect(typeof createBed).toBe('function')
  })

  it('sfx exports a factory', () => {
    expect(typeof createSfx).toBe('function')
  })
})
