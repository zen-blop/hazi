import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class AnthropicClient {
  async sendMessage(messages, onToken) {
    const stream = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 200,
      messages,
      stream: true,
    });

    let text = "";

    for await (const event of stream) {
      if (event.type === "content_block_delta") {
        const deltaText = event.delta.text ?? "";

        text += deltaText;

        if (onToken) {
          onToken(deltaText);
        }
      }
    }

    return { text, streamed: true };
  }
}
