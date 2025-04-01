import { OllamaEmbeddings } from '@langchain/ollama';

const embeddings = new OllamaEmbeddings({
  baseUrl: 'http://19.19.20.178:11434',
  model: 'aroxima/gte-qwen2-1.5b-instruct',
});

export default embeddings;
