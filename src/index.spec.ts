import fs from 'fs'
import path from 'path'

import tempFiles from '.'

describe('tempFiles utility', () => {
  let basePath: string
  let cleanUpFunc: () => void

  afterEach(() => {
    cleanUpFunc()
  })

  test('creates files and directories correctly', () => {
    const fileMap = {
      'dir1/file1.txt': 'Hello, World!',
      'dir1/dir2/file2.txt': 'Another file content',
    }

    ;[basePath, cleanUpFunc] = tempFiles(fileMap, { maxRetries: 5 })

    // Check that directories and files exist
    expect(fs.existsSync(basePath)).toBe(true)
    expect(fs.existsSync(path.join(basePath, 'dir1'))).toBe(true)
    expect(fs.existsSync(path.join(basePath, 'dir1/dir2'))).toBe(true)
    expect(fs.readFileSync(path.join(basePath, 'dir1/file1.txt'), 'utf8')).toBe('Hello, World!')
    expect(fs.readFileSync(path.join(basePath, 'dir1/dir2/file2.txt'), 'utf8')).toBe('Another file content')
  })

  test('handles cleanup correctly', () => {
    const fileMap = {
      'file.txt': 'Sample content',
    }

    const [basePath, cleanUpFunc] = tempFiles(fileMap, { maxRetries: 5 })

    expect(fs.existsSync(path.join(basePath, 'file.txt'))).toBe(true)

    cleanUpFunc()

    // Check that the directory has been cleaned up
    expect(fs.existsSync(basePath)).toBe(false)
  })

  test('throws error if unable to generate unique path after retries', () => {
    // Mock fs.existsSync to always return true
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    const fileMap = {
      'file.txt': 'Content',
    }

    expect(() => {
      tempFiles(fileMap, { maxRetries: 3 })
    }).toThrow('Failed to generate a unique base path after several attempts')

    // Restore original implementation
    jest.restoreAllMocks()
  })
})
