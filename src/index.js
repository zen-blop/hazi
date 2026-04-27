import readline from "node:readline";
import { AnthropicClient } from "./anthropicClient.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new AnthropicClient();

const messages = [];

function onToken(char) {
  process.stdout.write(char);
}

function ask() {
  rl.question("You: ", async (answer) => {
    if (answer.trim().toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    messages.push({
      role: "user",
      content: answer,
    });

    const result = await client.sendMessage(messages, onToken);

    // If it streamed, just add a newline; otherwise print full text
    if (result.streamed) {
      console.log();
    } else {
      console.log(result.text);
    }

    messages.push({
      role: "assistant",
      content: result.text,
    });

    ask();
  });
}

ask();
