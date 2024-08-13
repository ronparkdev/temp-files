import fs from 'fs'
import os from 'os'
import path from 'path'

import { v4 as uuidv4 } from 'uuid'

type FileMap = Record<string, string>
type Options = {
  maxRetries?: number
}

// Function to generate a unique base path
const generateUniqueTempPath = (maxRetries: number): string => {
  const tmpDir = fs.realpathSync(os.tmpdir())

  let retries = 0
  let basePath: string
  do {
    basePath = path.join(tmpDir, uuidv4())
    retries += 1
  } while (fs.existsSync(basePath) && retries < maxRetries)
  if (fs.existsSync(basePath)) {
    throw new Error('Failed to generate a unique base path after several attempts')
  }
  return basePath
}

const tempFiles = (fileMap: FileMap, options: Options = {}): [string, () => void] => {
  const { maxRetries = 10 } = options

  const basePath = generateUniqueTempPath(maxRetries)

  // Create directories and write files
  Object.keys(fileMap).forEach(filePath => {
    const folderPath = path.join(basePath, path.dirname(filePath))

    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
      }

      fs.writeFileSync(path.join(basePath, filePath), fileMap[filePath])
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error)
    }
  })

  // Cleanup function
  const cleanUpFunc = () => {
    try {
      fs.rmSync(basePath, { recursive: true, force: true })
    } catch (error) {
      console.error('Error cleaning up temporary files:', error)
    }
  }

  return [basePath, cleanUpFunc]
}

export default tempFiles
