import { createOpenAI } from '@ai-sdk/openai';
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  type ModelMessage,
  type UIMessage,
} from 'ai';
import { model } from './lib';

export const POST = async (req: Request) : Promise<Response> => {
    const body = await req.json()

    const messages: UIMessage = body.messages

    const modelMessages: ModelMessage[] = await convertToModelMessages(messages);

    const streamTextResult = streamText({
        model,
        messages: modelMessages
    })

    // Token Usage
    console.log((await streamTextResult.usage).totalTokens)

    const stream = streamTextResult.toUIMessageStream();

    return createUIMessageStreamResponse({
        stream,
    }) 
}