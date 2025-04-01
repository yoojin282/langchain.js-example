import { QdrantVectorStore } from '@langchain/qdrant';
import embeddings from './embedding-model';
import { QdrantClient } from '@qdrant/js-client-rest';
import { VECTORSTORE_COLLECTION_NAME } from '@/constant';

const qdrantClient = new QdrantClient({
  url: 'http://19.19.20.147:6333',
});
const vectorstore = new QdrantVectorStore(embeddings, {
  client: qdrantClient,
  collectionName: VECTORSTORE_COLLECTION_NAME,
});

export { vectorstore, qdrantClient };
