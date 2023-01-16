import discord from 'discord.js-selfbot-v13';
import { readdirSync } from 'fs';
import {} from 'dotenv/config';
const token = process.env.DISCORD_TOKEN;
const prefix = process.env.PREFIX;

const client = new discord.Client({
    checkUpdate: false,
    patchVoice: true
});

/* 
    * Import all commands from the commands folder and set up a collection of commands
    * The command name is just the file name
*/
const commandFiles = readdirSync('./commands').filter((file) => file.endsWith('.js'));
const commands = new discord.Collection();
client.commands = commands;

for (const file of commandFiles) {
    import (`./commands/${file}`).then((command) => {
        const commandName = file.split('.')[0];
        commands.set(commandName, command);
    });
}

/*
    * Set up the Command Handler
    * Commands can have multiple aliases
    * Commands have to export a function called run that runs with the message, args and the client
    * Commands can export a aliases array that contains all aliases of the command
*/

client.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    if (message.author.id !== client.user.id) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const command = commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    try {
        message.delete();
        command.run(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
        new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
            message.delete();
        })
    }
});

/*
    * Import all events from the events folder and set up the event listeners.
    * The event name is just the file name
    * Events have to export a boolean called once that decides if its a one time event or not
    * Events have to export a function called run that runs with the event args and the client
*/

const events = new discord.Collection();
client.events = events;

const eventFiles = readdirSync('./events').filter((file) => file.endsWith('.js'));
for (const file of eventFiles) {
    import (`./events/${file}`).then((event) => {
        const eventName = file.split('.')[0];
        events.set(eventName, event);
        if (event.once) {
            client.once(eventName, (...args) => event.run(...args, client));
        } else {
            client.on(eventName, (...args) => event.run(...args, client));
        }
    });
}

client.login(token);