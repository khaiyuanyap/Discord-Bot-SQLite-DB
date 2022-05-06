const { SlashCommandBuilder } = require("@discordjs/builders");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coins")
    .setDescription("Replies with your current amount of coins."),
  async execute(interaction) {
    if (
      !(await prisma.user.findUnique({ where: { id: interaction.user.id } }))
    ) {
      await prisma.user.create({
        data: {
          id: interaction.user.id,
        },
      });
      return interaction.reply("You have 0 coins.");
    }

    const userData = await prisma.user.findUnique({
      where: { id: interaction.user.id },
    });
    console.log(userData);
    return interaction.reply(
      `${interaction.user.username} has ${userData.coins} coins.`
    );
  },
};
