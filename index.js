const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
  // If user don't exist in the database, create it
  if (!(await prisma.user.findUnique({ where: { id: interaction.user.id } }))) {
    await prisma.user.create({
      data: {
        id: interaction.user.id,
        tag: interaction.user.tag,
      },
    });
  } else {
    const userData = await prisma.user.findUnique({
      where: { id: interaction.user.id },
    });
    console.log(userData);

    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === "ping") {
      await interaction.reply("Pong!");
    } else if (commandName === "server") {
      await interaction.reply(
        `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
      );
    } else if (commandName === "user") {
      await interaction.reply(
        `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`
      );
    } else if (commandName === "coins") {
      await interaction.reply(`You have ${userData.coins} coins.`);
    }
  }
});

// Login to Discord with your client's token
client.login(token);
