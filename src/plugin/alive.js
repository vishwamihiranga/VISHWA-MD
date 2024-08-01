import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (Void, m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);

  // Ensure m.body is a string before applying string methods
  const body = m.body || '';
  const prefixMatch = body.match(/^[\\/!#.]/);
  const prefix = prefixMatch ? prefixMatch[0] : '/';
  const cmd = body.startsWith(prefix) ? body.slice(prefix.length).toLowerCase() : '';

  // Send audio message
  await Void.sendMessage(m.chat, {
    audio: { url: 'https://github.com/Sithuwa/SITHUWA-MD/raw/main/media/Alive.mp3' },
    mimetype: 'audio/mpeg',
    ptt: true
  }, { quoted: m });

  if (['alive', 'uptime', 'runtime'].includes(cmd)) {
    // Define uptime message
    const uptimeMessage = `
*Hello, ${m.pushName},*
_This is ${'Your Bot Name'}._
${'Your alive message content here'}

*Version:-* _1.9.2_
*Uptime:-* _${days}d ${hours}h ${minutes}m ${seconds}s_
*Owner:-* _VISHWA MIHIRANGA_
*Branch:-* _${config.BRANCH}_

_Type ${prefix}menu for my command list._

_ᴘᴏᴡᴇʀᴅ ʙʏ ᴠɪꜱʜᴡᴀ-ᴍᴅ_
`;

    // Define buttons
    const buttons = [
      {
        buttonId: '.menu',
        buttonText: { displayText: 'MENU' },
        type: 1
      },
      {
        buttonId: 'https://whatsapp.com/channel/0029VaSaZd5CBtxGawmSph1k',
        buttonText: { displayText: 'Follow us' },
        type: 1
      }
    ];

    // Prepare the interactive message
    const buttonMessage = {
      text: uptimeMessage,
      footer: "©ᴘᴏᴡᴇʀᴅ ʙʏ ᴠɪꜱʜᴡᴀ-ᴍᴅ",
      buttons: buttons,
      headerType: 1
    };

    // Send the message
    await Void.sendMessage(m.chat, buttonMessage, { quoted: m });
  }
};

export default alive;
