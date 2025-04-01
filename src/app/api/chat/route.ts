import { NextRequest, NextResponse } from 'next/server';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import chatModel from '@/libs/langchain/chat-model';
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables';
import { Document } from 'langchain/document';
import { vectorstore } from '@/libs/langchain/vectorstore';

const SYSTEM_TEMPLATE = `당신은 한일네트웍스의 인사담당자입니다.
아래 주어진 문맥에 대하여 사용자의 질문에 한국어로 대답해주세요.
문맥이 없거나 알맞은 답변을 찾기 어려우면 모른다고 대답해주세요. 
가능하다면 200자 이내로 대답해주세요.
------
{context}
------`;

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  const retriever = vectorstore.asRetriever({
    k: 5,
    verbose: true,
  });
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', SYSTEM_TEMPLATE],
    ['human', '{message}'],
  ]);

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      message: new RunnablePassthrough(),
    },
    prompt,
    chatModel,
    new StringOutputParser(),
  ]);

  const result = await chain.invoke(message);

  return NextResponse.json({
    answer: result,
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

const formatDocumentsAsString = (documents: Document[]) => {
  return documents.map((document) => document.pageContent).join('\n\n');
};
