const Discord   = require('discord.js')
const fs        = require('fs')
const TOKEN = require("./config.json").token
const jsonfile  = require('jsonfile')
const firebase = require("firebase")
const file = 'msgs.json'
const coldown = new Set()
const secondscol = '5'

const alpha = new Discord.Client({
    autoReconnect: true,
    messageCacheMaxSize: 2024,
    fetchAllMembers: true,
    disabledEvents: ['typingStart', 'typingStop', 'guildMemberSpeaking'],
    messageCacheLifetime: 1680,
    disableEveryone: false,
    messageSweepInterval: 1680
  })

  var firebaseConfig = {
    apiKey: "AIzaSyClWr0gxFfDC0chnBa8n9DB4uCu8HVxJSY",
    authDomain: "evento-aphus.firebaseapp.com",
    databaseURL: "https://evento-aphus.firebaseio.com",
    projectId: "evento-aphus",
    storageBucket: "evento-aphus.appspot.com",
    messagingSenderId: "422682654404",
    appId: "1:422682654404:web:7320072b5dce26c0fcbb91",
    measurementId: "G-XW3R4WVRL8"
  }

firebase.initializeApp(firebaseConfig);
const database = firebase.database()

alpha.prefix = "."
alpha.commands = new Discord.Collection();
alpha.aliases = new Discord.Collection();
alpha.getEmoji = emoji => alpha.emojis.find(e => e.name === emoji);

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      alpha.on(eventName, event.bind(null, alpha));
  });
});

fs.readdir("./commands", (err, files) => {
  if (err) console.error(err);
  let jsfiles = files.filter(f => f.split(".").pop() === "js");

  if (jsfiles.length <= 0) return console.log("COMMAND ERROR >>  Não há comandos para ser carregados.");
  console.clear()
  console.log(`COMMAND HANDLER >>  Carregando ${jsfiles.length} comandos.`);
  jsfiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`COMMAND HANDLER >>  ${i + 1}: ${f} carregado!`);
    alpha.commands.set(props.help.name, props);
    props.help.aliases.forEach(alias => {
        alpha.aliases.set(alias, props.help.name);
    });
  });
});

alpha.on('message', async message => {
  let msg = message.content.toLowerCase();
  if (message.author.bot) return undefined;
  if(message.channel.type === 'dm') return;

  alpha.getAliases = (command) => {
    if(alpha.commands.get(command).help.aliases && alpha.commands.get(command).help.aliases != "") {
      return alpha.commands.get(command).help.aliases.join(' ')
    } else {
      return "Nenhuma"
    }
  }
  
/*
  let xp = await db.fetch(`xp_${user.id}`)
  let level = await db.fetch(`level_${user.id}`)
  if (xp === null) xp = 0;
  if (level === null) level = 0;

  if(!cooldown.is(user.id)) {
    cooldown.add(user.id) 
    var add = Math.floor(Math.random() * 10) + 10;
    db.add(`xp_${user.id}`, add);
    setTimeout(() => {
      cooldown.remove(user.id);
    }, 1000*60)
  }
  while (xp >= utils.need(level+1)) {
    if(xp >= utils.need(level+1)) {
      db.subtract(`xp_${user.id}`, utils.need(level+1))
      db.add(`level_${user.id}`, 1)
      xp = await db.fetch(`xp_${user.id}`)
      level = await db.fetch(`level_${user.id}`)
      await alpha.verificarLevel(user.id)
      message.channel.send(alpha.getEmoji('diamond')+" | " + user + ", você upou de nível! Seu nível atualmente é " + level + '!')
    }
  }
  */

  if (message.content.indexOf(alpha.prefix) !== 0) return;
  const args = message.content.slice(alpha.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  let cmd;

  
  if (alpha.commands.has(command)) {
    cmd = alpha.commands.get(command);
  } else {
    cmd = alpha.commands.get(alpha.aliases.get(command));
  }

  database.ref(`Comandos/${command}`)
    .once('value').then(async function(snap) {
      if(cmd) {
        if(snap.val() == null) {
          database.ref(`Comandos/${command}`)
            .set({
              manu: false
            })
            .catch(e=>{})
          return message.reply('use o comando novamente por favor (registrado na database)')
        } 
        
        if (snap.val().manu == false) {
            if (coldown.has(message.author.id)) return message.channel.send(''+alpha.getEmoji('error')+' | '+message.author+', você deve esperar 5 segundos para realizar algum comando novamente.')
            
            jsonfile.readFile(file, function (err, json) {
              if (err) console.error(err)
                cmd.run(alpha, message, args, json, Discord, database);
                if(!message.member.hasPermission('ADMINISTRATOR')) coldown.add(message.author.id)
            
                setTimeout(() => {
                  coldown.delete(message.author.id)
                }, secondscol * 1000)
          
              if (message.guild.id != "425864977996578816") {
                 message.delete().catch(O_o=>{});
              }
            })
          }
        if(snap.val().manu == true) return message.channel.send(`<:error:564922823660011530> | O comando (\`${message.content.slice(alpha.prefix.length).trim().split(/ + /g)}\`) está em manutenção`)  
      }
    })
})

alpha.login(TOKEN)
