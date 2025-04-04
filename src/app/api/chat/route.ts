import { NextRequest, NextResponse } from 'next/server';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import chatModel from '@/libs/langchain/chat-model';
import { Document } from 'langchain/document';
import { vectorstore } from '@/libs/langchain/vectorstore';
import { Annotation, StateGraph } from '@langchain/langgraph';
import { CommaSeparatedListOutputParser } from '@langchain/core/output_parsers';

const RERANK_TEMPLATE = `아래 문맥은 질문에 대한 임의의 답변들이다. 
질문에 부합하는 답변 순으로 정렬해서 콤마로 구분하여 답하세요. 

질문: {question}
예상답변:
{context}

`;

const PROMPT_TEMPLATE = `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences maximum and keep the answer as concise as possible.
Always say "thanks for asking!" at the end of the answer in Korean.


{context}

Question: {question}

Helpful Answer:`;

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  const result = await graph.invoke({ question: message });
  console.log('검색어: ', result.question);
  // console.log('검색결과: ', result.context);

  return NextResponse.json({
    answer: result.answer,
  });

  // const stream = await chain.stream({
  //   message,
  // });

  // return new NextResponse(stream, {
  //   headers: {
  //     'Content-Type': 'text/event-stream',
  //     'Cache-Control': 'no-cache',
  //   },
  // });
}

const prompt = ChatPromptTemplate.fromTemplate(PROMPT_TEMPLATE);
const rerankPrompt = ChatPromptTemplate.fromTemplate(RERANK_TEMPLATE);
// const prompt = ChatPromptTemplate.fromMessages([
//   ['system', SYSTEM_TEMPLATE],
//   ['human', '{question}'],
// ]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InputStateAnnotation = Annotation.Root({
  question: Annotation<string>,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RerankStateAnnotation = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<Document[]>,
});

const StateAnnotation = Annotation.Root({
  question: Annotation<string>,
  context: Annotation<Document[]>,
  answer: Annotation<string>,
});

const retrieve = async (state: typeof InputStateAnnotation.State) => {
  const docs = await vectorstore.maxMarginalRelevanceSearch(state.question, {
    k: 5,
    lambda: 0.6,
  });
  return {
    context: docs.map((doc) => ({
      ...doc,
      pageContent: doc.pageContent
        .replaceAll('  ', ' ')
        .replaceAll(
          `
`,
          ' ',
        )
        .replaceAll('\n', ' ')
        .replaceAll('\r', ' ')
        .replaceAll('\r\n', ' '),
    })),
  };
};

const rerank = async (state: typeof RerankStateAnnotation.State) => {
  const chain = rerankPrompt.pipe(chatModel).pipe(new CommaSeparatedListOutputParser());
  const result = await chain.invoke({
    question: state.question,
    context: state.context.map((doc) => doc.pageContent).join('\n'),
  });
  console.log('Rerank 결과: ', result);
  const sortedDocs = result.map((index) => state.context[Number(index)]);
  console.log('Rerank 결과: ', sortedDocs);
  return { context: sortedDocs };
};

const generate = async (state: typeof StateAnnotation.State) => {
  const contents = state.context.map((doc) => doc.pageContent).join('\n');
  const messages = await prompt.invoke({
    question: state.question,
    context: contents,
  });
  const response = await chatModel.invoke(messages);
  return { answer: response.content };
};

const graph = new StateGraph(StateAnnotation)
  .addNode('retrieve', retrieve)
  .addNode('rerank', rerank)
  .addNode('generate', generate)
  .addEdge('__start__', 'retrieve')
  .addEdge('retrieve', 'rerank')
  .addEdge('rerank', 'generate')
  .addEdge('generate', '__end__')
  .compile();
