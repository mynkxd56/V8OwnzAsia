import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Send custom DM to Team members')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option.setName('message').setDescription('Message to send').setRequired(true)),

    async execute(interaction, config, client) {
        await interaction.deferReply({ flags: 64 }); // Ephemeral flag
        const messageText = interaction.options.getString('message');
        
        const role = interaction.guild.roles.cache.find(r => r.name === '[+] TeamV8');
        if (!role) {
            return interaction.editReply("❌ Error: '[+] TeamV8' role was not found in this server!");
        }

        // Server ke saare members ko fetch karein taaki Team V8 role wale sabhi members tak DM pahunch sake
        await interaction.guild.members.fetch();

        let sentCount = 0;
        let failedCount = 0;

        for (const member of role.members.values()) {
            if (!member.user.bot) {
                try {
                    await member.send(messageText);
                    sentCount++;
                } catch {
                    failedCount++;
                }
            }
        }

        await interaction.editReply(`✅ **DMs Processed!**\n📩 Delivered: ${sentCount}\n❌ Failed: ${failedCount}`);
    }
};
