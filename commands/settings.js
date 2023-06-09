const db = require('quick.db');
const { discord, MessageActionRow, MessageButton, Modal, TextInputComponent, MessageEmbed, Permissions, MessageSelectMenu } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { error, warn, success, info, bullet, restricted } = require('../symbols.json')
const fs = require('fs');
require('dotenv').config()

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Set or change server settings'),
    async execute(interaction, client) {
      if(!interaction.guild) return interaction.reply({ content: `${warn} ${bullet} This command can only be run in guilds`, ephemeral: true})
      if(!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return interaction.reply({ content: `${restricted} ${bullet} You do not have permission to run this command`, ephemeral: true})

      let ChangeNickRow = new MessageActionRow()
      //ChangeNickRow.addComponents(new MessageButton().setCustomId('placeholder').setLabel('Change Nickname').setStyle('SECONDARY').setDisabled(true))
      //ChangeNickRow.addComponents(new MessageButton().setCustomId('Scn0').setEmoji(error).setStyle('DANGER').setDisabled(false))
      //ChangeNickRow.addComponents(new MessageButton().setCustomId('Scn1').setEmoji(success).setStyle('SUCCESS').setDisabled(false))
		
	  let embed = new MessageEmbed()
	  .setTitle(`Hello ${interaction.user.username}!`)
	  .addFields({ name: `${interaction.guild.name}\'s Settings`, value: `Pick an option using the select menu below`})
	  .setColor("#302c34")
	  //.setTimestamp()
	  .setImage(`https://media.tenor.com/ZNi18lLfqs4AAAAC/rainbow-line-line.gif`)
	  //.setFooter(`RoAuth`)

      ChangeNickRow.addComponents(
				new MessageSelectMenu()
					.setCustomId(`menu-${interaction.user.id}`)
					.setPlaceholder('Select an Option')
					.addOptions([
						{
							label: 'Nickname Settings',
							description: 'Whether user\'s nicknames will be set as their Roblox username',
							value: 'S1',
						},
						{
							label: 'Role Settings',
							description: 'Role that will be given after linking',
							value: 'S2',
						},
						{
							label: 'Whitelist/Blacklist Settings',
							description: 'Allow or unallow a Roblox username to be linked',
							value: 'S3',
						},
					]),
			);

	const reply = await interaction.reply({ embeds: [embed], components: [ChangeNickRow]})

    const filter = (interactio) => interactio.customId === 'menu' && interactio.user.id === interaction.author.id;

    const collector = new SelectMenuCollector(client, { filter, time: 10000 });

    collector.on('collect', (i) => {
		if (i.user.id !== message.author.id) {
			i.reply({ content: `${restricted} ${bullet} Hey, you can\'t use this!`, ephemeral: true });
			return;
		  }

		  interaction.reply(`You selected: ${interaction.values}`)
    });

    collector.on('end', (collected) => {
      //console.log(`Collected ${collected.size} interactions.`);
      interaction.editReply({ content: 'Selection time has ended.', components: [] });
    });

      
    }
}