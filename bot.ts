import { Bot, type Context } from "grammy";
import "dotenv/config";

const token = process.env.TG_TOKEN;
if (!token) {
  console.log("TG_TOKEN is not set");
  process.exit(1);
}

interface GameParameters {
  answer: number;
  upper: number;
  lower: number;
  count: number;
}
const memory = new Map<number, GameParameters>();

const bot = new Bot(token);

bot.command("start", (ctx) => {
  memory.set(ctx.chat.id, {
    answer: Math.floor(Math.random() * 100) + 1,
    upper: 100,
    lower: 1,
    count: 0,
  });
  ctx.reply(
    "Welcome to demo guessing game. \nYou have to guess a number between 1 and 100. \n\nSend a number to guess.",
  );
  return;
});

bot.on("message", (ctx) => {
  const game = memory.get(ctx.chat.id);
  if (!game) {
    ctx.reply("Use /start to start the game");
    return;
  }
  if (!ctx.message.text) {
    ctx.reply("Invalid input. You have to enter a number");
    return;
  }

  const num = parseInt((ctx.message.text as string).trim());
  if (isNaN(num)) {
    ctx.reply("Invalid input. You have to enter a number");
    return;
  }

  if (num === game.answer) {
    ctx.reply(
      `Congrats!🎉🎉 You guessed the correct number within ${game.count + 1} guesses. \n\n Use /start to play again.`,
    );
    memory.delete(ctx.chat.id);
    return;
  }

  if (num <= game.lower || num >= game.upper) {
    ctx.reply(
      "Invalid input. You have to enter a number between " +
        game.lower +
        " and " +
        game.upper,
    );
    return;
  }

  if (num > game.answer) {
    game.upper = num;
  } else if (num < game.answer) {
    game.lower = num;
  }
  game.count++;
  ctx.reply(
    `You have guessed ${num} but it is not the answer.\n The answer is between ${game.lower} and ${game.upper}`,
  );
  return;
});

bot.start();
