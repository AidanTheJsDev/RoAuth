function createCode(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


const gamelink = "https://roblox.com/game/testworks"
const db = require('quick.db');
const { error, warn, success, info, bullet, restricted } = require('./symbols.json')


//WHERE EXPRESS STARTS

const express = require("express");
const app = express();
const PORT = 9003

app.get("/", (req, res) => {
res.send("hello")
});

app.post("/github", (req, res) => {
  res.send("Done")
  res.status(200);
  process.exit();
})

app.get(`/robloxapi?code=test`, (req, res) => {
  res.send("Done")
  res.status(200);
  //process.exit();
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

//WHERE EXPRESS END

const { Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()){
    let i = interaction
    
    if(i.customId === "link"){
      const link = new MessageActionRow().addComponents(new MessageButton().setURL("https://roblox.com/").setLabel('Join Roblox Game').setStyle('LINK')).addComponents(new MessageButton().setURL("https://discord.com/").setLabel('Support Server').setStyle('LINK'))
      let session = db.get(`session-${i.guild.id}-${i.user.id}`)
      let sessioncode = db.get(`sessioncode-${i.guild.id}-${i.user.id}`)
      let created = String(session).split("-")[0]
      let expires = String(session).split("-")[1]

      if(Date.now() >= expires){
        db.delete(`session-${i.guild.id}-${i.user.id}`)
        db.delete(`sessioncode-${i.guild.id}-${i.user.id}`)
        session = null
        sessioncode = null
      }
      
      if(session !== null && sessioncode !== null){
        let sessionExpiresTimestamp = Math.floor(expires / 1000)
        let embed2 = new MessageEmbed()
      .setTitle("How to link your Roblox Account")
      .setColor("ORANGE")
      .addFields({ name: "Your authentication code", value: `\`${sessioncode}\` (Expires <t:${sessionExpiresTimestamp}:R>)`})
      .setDescription(`
Here are the steps to link your Roblox Account

1 ${bullet} Join the Roblox game using the button below
2 ${bullet} Once in the game, enter in your authentication code
3 ${bullet} Verify that everything is entered correctly and submit
4 ${bullet} Your Roblox account is now linked
      
If you need help or have a problem, join our Support Server.`)
      .setTimestamp();

        
        return interaction.reply({ content: `${warn} ${bullet} You already have a session.`, embeds: [embed2], components: [link], ephemeral: true })
      }

      // Session
      let vcode = createCode(8)
      let times = Math.floor(Date.now() / 1000)
      times = times + 600

      let timestampExpire = Math.floor(Date.now() + 600000)

      db.set(`session-${i.guild.id}-${i.user.id}`, `${Date.now()}-${timestampExpire}`)
      db.set(`sessioncode-${i.guild.id}-${i.user.id}`, vcode)
      
      let embed1 = new MessageEmbed()
      .setTitle("How to link your Roblox Account")
      .setColor("ORANGE")
      .addFields({ name: "Your authentication code", value: `\`${vcode}\` (Expires <t:${times}:R>)`})
      .setDescription(`
Here are the steps to link your Roblox Account

1 ${bullet} Join the Roblox game using the button below
2 ${bullet} Once in the game, enter in your authentication code
3 ${bullet} Verify that everything is entered correctly and submit
4 ${bullet} Your Roblox account is now linked
      
If you need help or have a problem, join our Support Server.`)
      .setTimestamp();
		  await i.reply({ embeds: [embed1], components: [link], ephemeral: true });
    }
  }
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: `${error} | An error occurred while executing the command. Please report this to our support server`, ephemeral: true });
  }
});

client.on('ready', async () => {
  console.clear()
  console.log(`${success} ${bullet} ${client.user.tag} is online!`)
})

// Create a collection to store the slash commands
client.commands = new Collection();

// Read the contents of the /commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Dynamically register slash commands
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Bot token and client ID
const token = process.env.BOT_TOKEN
const clientId = '1106842998345568306'

// Create a REST client for registering slash commands


  const commands = [];

  // Place your client and guild ids here

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

  (async () => {
    try {
      console.log(`${info} ${bullet} Started refreshing application (/) commands.`);

      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log(`${success} ${bullet} Successfully reloaded application (/) commands.`);
    } catch (error) {
      console.error(error);
    }

  })();

client.login(process.env.BOT_TOKEN);
