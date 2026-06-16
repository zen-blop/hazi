export class FakeClient {
  async sendMessage(messages, onToken) {
    const lastUserMessage = messages[messages.length - 1]?.content ?? "";
    const text = `Fake response to: ${lastUserMessage}`;

    let streamed = false;

    if (onToken) {
      streamed = true;
      for (const char of text) {
        onToken(char);
      }
    }

    return { text, streamed };
  }
}
