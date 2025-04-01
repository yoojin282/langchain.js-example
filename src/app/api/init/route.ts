import { VECTORSTORE_COLLECTION_NAME } from '@/constant';
import { loadPdf } from '@/libs/langchain/document-loaders';
import { qdrantClient, vectorstore } from '@/libs/langchain/vectorstore';
import { NextResponse } from 'next/server';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { getFileNames } from '@/utils/file-utils';

export async function POST() {
  const { exists: collectionExists } = await qdrantClient.collectionExists(
    VECTORSTORE_COLLECTION_NAME,
  );

  if (collectionExists) {
    console.warn('벡터가 존재합니다. 데이터를 로드하지 않습니다.');
    return new NextResponse('벡터가 존재합니다. 데이터를 로드하지 않습니다.', { status: 200 });
  }
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 20,
  });
  // Get PDF files from the specified directory
  const fileNames = await getFileNames(process.env.PDF_DATA_PATH || '');
  for (const fileName of fileNames) {
    const docs = await loadPdf(fileName, { textSplitter });
    console.log(`파일경로: ${fileName}, Document 갯수: ${docs.length}`);

    await vectorstore.addDocuments(docs);
  }

  console.log('벡터 저장 완료');

  return new NextResponse('벡터스토어에 저장되었습니다.', { status: 200 });
}

export async function GET() {
  const { exists } = await qdrantClient.collectionExists(VECTORSTORE_COLLECTION_NAME);
  return NextResponse.json({ exists: exists });
}
