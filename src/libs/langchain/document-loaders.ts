import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Document } from 'langchain/document';
import { TextSplitter } from 'langchain/text_splitter';

const loadPdf = async (
  filePath: string | string[],
  { textSplitter }: { textSplitter?: TextSplitter },
): Promise<Document[]> => {
  if (Array.isArray(filePath)) {
    const loaders = filePath.map((path) => new PDFLoader(path, { splitPages: true }));
    const docs = await Promise.all(
      loaders.map(async (loader) => {
        const doc = await loader.load();
        if (textSplitter) {
          const docs = doc;
          return await textSplitter.splitDocuments(docs);
        }
        return doc;
      }),
    );
    return docs.flat();
  } else {
    const loader = new PDFLoader(filePath, {
      splitPages: true,
    });
    if (textSplitter) {
      const docs = await loader.load();
      return await textSplitter.splitDocuments(docs);
    }
    return await loader.load();
  }
};

export { loadPdf };
