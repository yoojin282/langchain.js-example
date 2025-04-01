import { NextRequest, NextResponse } from 'next/server';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import chatModel from '@/libs/langchain/chat-model';
import { Document } from 'langchain/document';
import { vectorstore } from '@/libs/langchain/vectorstore';
import { Annotation, StateGraph } from '@langchain/langgraph';

const PROMPT_TEMPLATE = `당신은 한일네트웍스의 인사담당자입니다.
주어진 문맥에 대하여 아래 주의사항을 유의하여 사용자의 질문에 대답해주세요.
1. 문맥이 없거나 알맞은 답변을 찾기 어려우면 모른다고 대답해주세요. 
2. 가능하다면 100자 이내로 대답해주세요.
3. 답변은 한국어로 대답하세요.

Question: {question}
Context: {context}
Answer:`;

export async function POST(request: NextRequest) {
  const { message } = await request.json();

  const prompt = ChatPromptTemplate.fromTemplate(PROMPT_TEMPLATE);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const InputStateAnnotation = Annotation.Root({
    question: Annotation<string>,
  });
  const StateAnnotation = Annotation.Root({
    question: Annotation<string>,
    context: Annotation<Document[]>,
    answer: Annotation<string>,
  });

  const retrieve = async (state: typeof InputStateAnnotation.State) => {
    const docs = await vectorstore.similaritySearch(state.question, 5);
    return { context: docs };
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
    .addNode('generate', generate)
    .addEdge('__start__', 'retrieve')
    .addEdge('retrieve', 'generate')
    .addEdge('generate', '__end__')
    .compile();

  const result = await graph.invoke({ question: message });
  console.log('검색어: ', result.question);
  console.log('검색결과: ', result.context);

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
