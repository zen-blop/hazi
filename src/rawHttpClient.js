import "dotenv/config";

export class RawHttpClient {
  async sendMessage(messages, onToken) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-tyep": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 200,
        messages,
      }),
    });

    const data = await response.json();

    const text = data.content[0].text;

    return { text, streamed: false };
  }
}
