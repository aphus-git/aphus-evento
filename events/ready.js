module.exports = async alpha => {
    let status = [
        {name: 'fui criado por </Césinha>#0653', type: 'PLAYING'},
        {name: `com o ibluz!`, type: 'STREAMING', url: 'https://twitch.tv/zcesinhaaaah_'},
        {name: `com os membros da AlphaStudiios!`, type: 'PLAYING'}
       ];

  
    function setMsgAuto() {
        var frases = [`*FRASE SLA MLK* `,`*FRASE SLA*`,`*FRASE POPOPO*`,`*FRASE PIPIPI*`]
        alpha.channels.get("601571970278227998").send(frases[Math.floor(Math.random() * frases.length)])
    }

      //setMsgAuto();
      //setInterval(() => setMsgAuto(), 5000);
      console.log("BOT >> Iniciado com sucesso com " + alpha.users.size + " usuários e em " + alpha.guilds.size + " servidores.")
      console.log('SUCCESS >> Status carregado!'); 
  }
  