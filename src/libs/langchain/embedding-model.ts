// import { OllamaEmbeddings } from '@langchain/ollama';
import { env } from '@huggingface/transformers';
import { CustomHuggingFaceTransformersEmbeddings } from './huggingface-transformers-embeddings';
// const embeddings = new OllamaEmbeddings({
//   baseUrl: 'http://19.19.20.178:11434',
//   model: 'aroxima/gte-qwen2-1.5b-instruct',
// });
env.allowRemoteModels = false;

const embeddings = new CustomHuggingFaceTransformersEmbeddings({
  // model: 'nlpai-lab/KURE-v1',
  model: process.env.EMBEDDING_MODEL_PATH,
});

export default embeddings;
