import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AnthropicClient {
  async sendMessage(messages, onToken) {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 200,
      messages: messages,
    });

    const text = response.content[0].text;

    return { text, streamed: false };
  }
}
