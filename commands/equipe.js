module.exports.run = async (alpha, message, args, json, Discord, database) => {
    if(args[0] === "criar") {  
        let erro = false;
        if(!args[1]) return message.reply('coloque uma sigla')
        if(args[1].length > 5 || args[1].length < 3) return message.reply('a sigla deve ser entre 3 e 5 caracteres.')
        if(!args[2]) return message.reply('coloque um nome.')
        if(args[2].length > 15 || args[2].length < 5) return message.reply('o nome deve ser entre 5 e 15 caracteres.')

        database.ref('Clans/'+message.author.id)
            .once('value').then(async function(snap) {
                if(snap.val() == null) {
                    await message.guild.members.forEach(async (a)=>{
                        await database.ref('Clans/'+a.id)
                            .once('value').then(async function(snap) {
                                if(snap.val() !== null) {
                                    if(args[1] === snap.val().tag) {
                                        erro = true
                                        return message.reply('já existe essa sigla.')
                                    }
                                    if(args[2] === snap.val().name) {
                                        erro = true
                                        return message.reply('já existe esse nome.')
                                    }
                                }
                            })
                    })
                    setTimeout(() => {if(erro === false) return message.reply('espere alguns segundos').then(msg=>{msg.delete(2500)})}, 500)
                    setTimeout(() => {
                        if (erro === true) return;
                        if (erro === false) {
                            database.ref('Clans/'+message.author.id)
                            .set({
                                name: args[2],
                                tag: args[1],
                                ownerID: message.author.id, 
                                ownerName: message.author.username,
                                points: 0
                            })
                            database.ref('Clans/'+message.author.id)
                            .once('value').then(async function(snap) {
                                message.reply('você criou seu clube.')
                                setTimeout(() => {
                                    message.member.setNickname(`${snap.val().tag} | ${snap.val().ownerName}`).catch(e=>{})
                                    message.guild.createRole({
                                        name: snap.val().name,
                                        color: '#2f3136'
                                    }).then(async (role) => {
                                        message.member.addRole(role.id)
                                        database.ref('Clans/'+message.author.id)
                                            .update({
                                                clanRole: role.id
                                            })

                                        
                                        let channel17 = message.guild.channels.find(c => c.name === snap.val().name)
                                        if(!channel17) {
                                            let channel1 = await message.guild.createChannel(snap.val().name, "voice", [{
                                                id: alpha.user.id,
                                                allowed: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "SPEAK", "USE_VAD"]
                                            }, {
                                                id: message.author.id,
                                                allowed: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT", "SPEAK", "USE_VAD"]
                                            }, {
                                                id: role.id,
                                                allowed: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT", "SPEAK", "USE_VAD"]
                                            }, {
                                                id: message.guild.defaultRole.id,
                                                denied: Discord.Permissions.ALL
                                            }])
    
                                            let channel = await message.guild.createChannel(snap.val().name, "text", [{
                                                id: alpha.user.id,
                                                allowed: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT", "SPEAK", "USE_VAD"]
                                            }, {
                                                id: message.author.id,
                                                allowed: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT", "SPEAK", "USE_VAD"]
                                            }, {
                                                id: role.id,
                                                allowed: ["VIEW_CHANNEL", "SEND_MESSAGES", "CONNECT", "SPEAK", "USE_VAD"]
                                            }, {
                                                id: message.guild.defaultRole.id,
                                                denied: Discord.Permissions.ALL
                                            }])
                                            
                                        channel.setParent('647890420956921897')
                                        channel1.setParent('647890420956921897')
                                        }
                                    })

                                }, 1500)
                            })
                        }
                    }, 5000)
            } else if(snap.val() != null) {
                return message.reply('você já está em um clube.')
            }
        })
    }

    if(args[0] === "convidar") {
        let erro;
        database.ref(`Clans/${message.author.id}`)
            .once('value').then(async function (sna_p) {
                if(sna_p.val() == null) return message.reply('você não tem um clube para convidar alguém.')
                if(sna_p.val().ownerID == null) return message.reply('você não é dono de nenhum clube.')
                if(sna_p.val() != null) {
                    let user = message.mentions.users.first()
                    if(!user) return message.reply('mencione alguém para convidar.')
                    if(user.id === message.author.id) return message.reply('você não pode se convidar. ')
                    database.ref('Clans/'+user.id)
                        .once('value').then(async function(snap) {
                            if(snap.val() != null) {
                                erro = true;
                                return message.reply('o usuário mencionado já tem um clube.')
                            }
                        })
                    if(erro === true) return;
                    message.channel.send(`${user}, você aceita entrar no clube \`${sna_p.val().name}\``).then(async (msg) => {
                        await msg.react('✅')
                        await msg.react('❌')

                        const utilities = msg.createReactionCollector((r, u) => r.emoji.name === "✅" && u.id === user.id, { time: 120000 });
                        const utilities1 = msg.createReactionCollector((r, u) => r.emoji.name === "❌" && u.id === user.id, { time: 120000 });
                        utilities.on('collect', a=> {
                            database.ref(`Clans/${user.id}`)
                                    .set({
                                        memberClan: true,
                                        clanName: sna_p.val().name,
                                        clanTag: sna_p.val().tag,
                                        userName: user.username
                                    })
                                     database.ref('Clans/'+user.id)
                                     .once('value').then(async function(snap) {
                                        message.reply(`o usuário ${user} entrou no seu clube.`) 
                                        database.ref('Clans/'+message.author.id)
                                            .once('value').then(async function(snap) {user.addRole(snap.val().clanRole)})
                                         setTimeout(() => {user.setUsername(`${snap.val().clanTag} | ${snap.val().userName}`)}, 1500)
                                     })
                        })  
                        utilities1.on('collect', b=> {
                            return message.reply('o usuário '+user+' recusou seu convite.')
                        })
                    })
                }
            })
    }

    if(args[0] === "setpoint") {
        if(!message.member.hasPermission('ADMINSTRATOR')) return message.reply('sem permissão')
        if(!args[1]) return message.reply('coloque uma sigla')
        if(!args[2]) return message.reply('coloque os pontos')

        message.guild.members.forEach(async (a)=>{
            database.ref('Clans/'+a.id)
                .once('value').then(async function(snap) {
                    if(snap.val() !== null) {
                        if(args[1] === snap.val().tag) {
                            database.ref('Clans/'+a.id)
                                .update({
                                    points: args[2]
                                })
                            message.reply('adicionado '+ args[2] + ' no clube ' + snap.val().name) 
                        }
                    }
                })
        })
    }

    if(args[0] === "rempoint") {
        if(!message.member.hasPermission('ADMINSTRATOR')) return message.reply('sem permissão')
        if(!args[1]) return message.reply('coloque uma sigla')
        if(!args[2]) return message.reply('coloque os pontos')

        message.guild.members.forEach(async (a)=>{
            database.ref('Clans/'+a.id)
                .once('value').then(async function(snap) {
                    if(snap.val() !== null) {
                        if(args[1] === snap.val().tag) {
                            database.ref('Clans/'+a.id)
                                .update({
                                    points: snap.val().points - args[2]
                                })
                            message.reply('removido '+ args[2] + ' no clube ' + snap.val().name) 
                        }
                    }
                })
        })
    }

    if(args[0] === "lista") {
        let array_name = [];
        let array_ids = [];
        let array_coins = [];
        let content = "";
        message.guild.members.forEach(async (a)=>{
            database.ref('Clans/'+a.id)
                .once('value').then(async function(snap) {
                    if(snap.val() !== null) {
                        if(snap.val().ownerID != null) {
                            array_name.push(snap.val().name)   
                            array_ids.push(a.id)
                            array_coins.push(snap.val().points)
                        }
                    }
                })
        })
        setTimeout(() => {
            for (let i = 0; i < array_name.length; i++) {
                let user = array_name[i]
        
                content += `⠀⠀⠀⠀⠀⠀⠀➫⠀⠀#${user} \n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Points: ${array_coins[i]}\n`
            }
            message.channel.send(`\`\`\`glsl\nRANKING | EVENT\n\n${content}\`\`\``)
        }, 1500)
    }

    if(args[0] === "cor") {
        if(!args[1]) return message.reply('coloque uma cor (HEX).')
        if(!args[1].startsWith('#')) return message.reply('coloque uma cor (HEX).')
        if(args[1].length < 7) return message.reply('coloque uma cor (HEX).')

        database.ref(`Clans/`+message.author.id)
            .once('value').then(async function(snap) {
                if(snap.val().memberClan == true) return message.reply('você é membro do clube. Membros não podem alterar, somente donos.')
                if(snap.val().ownerID === message.author.id) {
                        let role = message.guild.roles.find(a=>a.id===snap.val().clanRole)
                        role.setColor(args[1])
                        message.reply('alterada a cor do cargo do seu clube.')
                } else if (snap.val() != null) {
                    return message.reply('você está em nenhum clube.')
                }
            })
    }

    if(args[0] === "admin") {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('sem permissão')
        if(args[1] === "excluir") {
            if(!args[2]) return message.reply('coloque uma sigla')
            message.guild.members.forEach(async (a)=>{
                database.ref('Clans/'+a.id)
                    .once('value').then(async function(snap) {
                        if(snap.val() !== null) {
                            if(args[2] === snap.val().tag) {
                                database.ref('Clans/'+a.id)
                                    .remove()
                                        .then(async function() {
                                            message.reply('o clube foi removido com sucesso')
                                        })
                                        .catch(async function(err) {
                                            console.log(err)
                                            message.reply('deu erro.')
                                        })
                            }
                        }
                    })
            })
        }
    }
}
module.exports.help = {
    name: "clube",
    aliases: [],
    category: ""
}   