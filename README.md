# temp-files

The `temp-files` utility simplifies the creation of temporary files and directories for testing purposes. It is ideal for setting up a specific file structure for tests and ensures automatic cleanup after the tests are complete.

## Features

- **Create Temporary Files**: Easily create temporary files and directories based on a given file map.
- **Automatic Cleanup**: Provides a cleanup function to remove temporary files and directories after use.
- **Unique Temporary Paths**: Ensures the temporary directory path is unique to avoid conflicts.

## Installation

You can install `temp-files` via npm:

```bash
npm install @ronpark/temp-files --save-dev
```

## Usage

Here's a quick example of how to use `temp-files` in a Jest test:

```typescript
import fs from 'fs';
import path from 'path';
import { afterEach, describe, expect, it } from '@jest/globals';
import tempFiles from 'temp-files';

describe('Example test with tempFiles', () => {
  let basePath: string;
  let cleanUpFunc: (() => void) | null = null;

  afterEach(() => {
    cleanUpFunc?.();
  });

  it('should create and read temporary files correctly', () => {
    [basePath, cleanUpFunc] = tempFiles({
      'test.txt': 'Hello, world!',
    });

    const filePath = path.join(basePath, 'test.txt');
    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath, 'utf8')).toBe('Hello, world!');
  });
});
```

## API

### `tempFiles(fileMap: Record<string, string>, options?: { maxRetries?: number }): [string, () => void]`

- **`fileMap`**: An object where keys are file paths and values are file contents.
- **`options`** (optional): Configuration object with a `maxRetries` property to specify the number of retries for generating a unique path (default is 10).
- **Returns**: A tuple containing:
  - `basePath`: The path to the temporary directory.
  - `cleanUpFunc`: A function to clean up the temporary files.

## License

MIT License. 
