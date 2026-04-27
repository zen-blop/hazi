import "dotenv/config";

export class RawHttpStreamingClient {
  async sendMessage(messages, onToken) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 200,
        messages,
        stream: true,
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let text = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");

      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const json = line.replace("data: ", "").trim();

          if (!json) continue;

          const event = JSON.parse(json);

          if (event.type === "content_block_delta") {
            const deltaText = event.delta.text ?? "";

            text += deltaText;

            if (onToken) {
              onToken(deltaText);
            }
          }
        }
      }
    }

    return { text, streamed: true };
  }
}
