import { ChatOllama } from '@langchain/ollama';
const chatModel = new ChatOllama({
  baseUrl: 'http://19.19.20.178:11434',
  model: 'gemma3:4b',
  temperature: 0.7,
});

export default chatModel;
