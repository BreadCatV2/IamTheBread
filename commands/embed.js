import discord from 'discord.js-selfbot-v13';
const Embed = new discord.WebEmbed()

export const aliases = [];
export async function run(message, args, client) {  
    //args are in the format key:value
    //we can change title, description, and color of the embed. If a image is attached OR a url is provided, it will be used as the image
    //look for the key and set the value
    //thee can be multiword values, so we need to join the args
    let keyValuePairs = {}
    let lastKey = null
    for (let i = 0; i < args.length; i++) {
        const [key, value] = args[i].split(':');
        if (!value) {
            keyValuePairs[lastKey] += ` ${key}`;
        } else {
            keyValuePairs[key] = value;
            lastKey = key;
        }
    }
    if (keyValuePairs.title) {
        Embed.setTitle(keyValuePairs.title);
    }
    if (keyValuePairs.description) {
        Embed.setDescription(keyValuePairs.description);
    }
    if (keyValuePairs.color) {
        Embed.setColor(keyValuePairs.color);
    }
    if (keyValuePairs.url) {
        Embed.setImage(keyValuePairs.url);
    } else if (message.attachments.size > 0) {
        Embed.setImage(message.attachments.first().url);
    }

    message.channel.send({ embeds: [Embed] });
}