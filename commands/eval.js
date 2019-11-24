module.exports.run = async (alpha, message, args, json, Discord, database) => {
    if (message.author.id !== '407871991945756672' && message.author.id !== '407871991945756672') return message.channel.send(""+alpha.getEmoji('error')+" | " + message.author + ", você não tem permissão!")
     let arg = args.join(" ");
     try {
         let evalz = eval(arg);
 
         if(arg === "alpha.token") return message.channel.send(`${alpha.getEmoji('error')} | ${message.author}, você não pode ver meu token.`)
         if (typeof evalz !== 'string')
             evalz = require('util').inspect(evalz, { depth: 0 });
             let embed = new Discord.RichEmbed()
             .setColor('#00FF00')
             .addField('Resultado',  `\`\`\`js\n${evalz}\`\`\``)
             .addField('Código', `\`\`\`js\n${arg}\`\`\``)
 
         message.channel.send(embed)
     } catch (e) {
         let embed_erro = new Discord.RichEmbed()
             .addField('Erro', `\`\`\`js\n${e}\`\`\``)
             .addField('Código', `\`\`\`js\n${arg}\`\`\``)
             .setColor('#990000')
         message.channel.send(embed_erro);
     }
 }
 
 module.exports.help = { 
     name: 'eval',
     aliases: []
 }