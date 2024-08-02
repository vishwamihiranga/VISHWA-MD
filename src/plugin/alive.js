import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  const runtime = (seconds) => {
    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  const cmd = (options, callback) => {
    // Implement the logic to register commands based on `options`
    // and execute `callback` when the command is triggered.
    // For the sake of this example, let's assume `Matrix` has a method `onCommand`.
    Matrix.onCommand(options.pattern, async (citel) => {
      await callback(Void, citel, options.desc);
    });
  };

  cmd({
    pattern: "alive",
    category: "general",
    filename: __filename,
    desc: "Check if the bot is alive"
  },
  async (Void, citel, desc) => {
    await Void.sendPresenceUpdate('recording', citel.chat);
    await Void.sendMessage(citel.chat, {
      audio: {
        url: 'https://github.com/Sithuwa/SITHUWA-MD/raw/main/media/Alive.mp3',
      },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: citel });

    let alivemessage = Config.ALIVE_MESSAGE || `*A bot developed by Sithum Kalhara.*`;
    const alivtxt = `
*Hello, ${citel.pushName},*
_This is ${tlang().title}._
${alivemessage}

*Version:* _1.9.2_
*Uptime:* _${runtime(process.uptime())}_
*Owner:* _${Config.ownername}_
*Branch:* _${Config.BRANCH}_

_Type ${prefix}menu for my command list._

_Powered by ${Config.ownername}_
    `;

    let aliveMessage = {
      image: {
        url: await botpic(),
      },
      caption: alivtxt,
      footer: tlang().footer,
      headerType: 4,
    };
    
    return Void.sendMessage(citel.chat, aliveMessage, { quoted: citel });
  });
};

export default alive;
