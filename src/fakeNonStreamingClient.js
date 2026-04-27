export class FakeNonStreamingClient {
  async sendMessage(messages, onToken) {
    const lastUserMessage = messages[messages.length - 1]?.content ?? "";
    const text = `Fake non stream response: ${lastUserMessage}`;

    return { text, streamed: false };
  }
}
