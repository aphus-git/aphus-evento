const Discord = require('discord.js')

module.exports = async (alpha, message) => {
    if (message.author.alpha) return undefined;
    if (message.channel.type === 'dm') return;
   
    if(message.content.startsWith(`<@${alpha.user.id}>`)) {
        message.delete()
        const embed = new Discord.RichEmbed()
  
        .setTitle(`Olá ${message.author.username}, está perdido?`)
        .setDescription('Opa, se você se encontra com dúvidas do que eu posso fazer diriga-se rápidamente a um chat de comandos e digite: ' + '`/ajuda`')
        .setThumbnail(message.author.avatarURL)
        .setFooter(`AlphaCommunity © Todos os direitos reservados.`, alpha.user.avatarURL)
        .setColor("#36393e")
  
        message.channel.send(embed);
    }

}
  