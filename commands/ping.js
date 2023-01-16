import discord from 'discord.js-selfbot-v13';
const Embed = new discord.WebEmbed({
    title: 'Ping',
    description: 'Pong!',
    hidden: true,
})

export const aliases = ['pong'];
export async function run(message, args, client) {
    message.channel.send({ embeds: [Embed] });
}