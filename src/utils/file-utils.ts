import { readdir } from 'fs/promises';
import path from 'path';

const getFileNames = async (dirPath: string): Promise<string[]> => {
  try {
    const files = await readdir(dirPath);
    const pdfFiles = files
      .filter((file) => path.extname(file).toLowerCase() === '.pdf')
      .map((file) => path.join(dirPath, file));

    console.debug('Found PDF files:', pdfFiles);
    return pdfFiles;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error('Error reading data directory: ', dirPath);
    return [];
  }
};

export { getFileNames };
