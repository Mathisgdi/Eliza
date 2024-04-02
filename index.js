import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from 'openai';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
});

client.on("messageCreate", async function (message) {
  if (message.author.bot) return;
    
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are a helpful assistant who responds succinctly, do not share personal information, and do not use offensive language."},
        {"role": "user", "content": message.content}
      ],
      stream: true,
    });
    let reponse_message = ''
    for await (const part of stream) {
      if (part.choices[0].delta && part.choices[0].delta['content'] ) {
        reponse_message += part.choices[0].delta['content'];
      }
    }
    console.log(reponse_message);
    return message.reply(reponse_message);
  } catch (err) {
    console.error(err);
    return message.reply("Là c'est chaud");
  }
});

client.login(process.env.BOT_TOKEN);