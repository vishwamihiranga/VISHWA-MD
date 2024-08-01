import pkg, { prepareWAMessageMedia } from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

const alive = async (Void, m, Matrix) => {
  const uptimeSeconds = process.uptime();
  const days = Math.floor(uptimeSeconds / (24 * 3600));
  const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  
  const prefix = /^[\\/!#.]/gi.test(m.body) ? m.body.match(/^[\\/!#.]/gi)[0] : '/';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).toLowerCase() : '';
  await Void.sendMessage(citel.chat, { audio: {url : 'https://github.com/Sithuwa/SITHUWA-MD/raw/main/media/Alive.mp3',}, mimetype: 'audio/mpeg', ptt: true }, { quoted: citel, });
    if (['alive', 'uptime', 'runtime'].includes(cmd)) {

  const uptimeMessage = `
*Hello, ${citel.pushName},*
_This is  ${tlang().title}._
${alivemessage}

*Version:-* _1.9.2_
*Uptime:-* _${runtime(process.uptime())}_
*Owner:-* _VISHWA MIHIRANGA_
*Branch:-* _${Config.BRANCH}_

_Type ${prefix}menu for my command list._

_ᴘᴏᴡᴇʀᴅ ʙʏ ᴠɪꜱʜᴡᴀ-ᴍᴅ_
`;

  const buttons = [
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "MENU",
            id: `.menu`
          })
        },
        {
          "name": "quick_reply",
          "buttonParamsJson": JSON.stringify({
            display_text: "Follow us",
            id: `https://whatsapp.com/channel/0029VaSaZd5CBtxGawmSph1k`
          })
        }
        ];

  const msg = generateWAMessageFromContent(m.from, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: uptimeMessage
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "©ᴘᴏᴡᴇʀᴅ ʙʏ ᴠɪꜱʜᴡᴀ-ᴍᴅ"
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "",
            gifPlayback: true,
            subtitle: "",
            hasMediaAttachment: false 
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons
          }),
          contextInfo: {
                  mentionedJid: [m.sender], 
                  forwardingScore: 999,
                  isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363249960769123@newsletter',
                  newsletterName: "VISHWA-MD",
                  serverMessageId: 143
                }
              }
        }),
      },
    },
  }, {});

  await Matrix.relayMessage(msg.key.remoteJid, msg.message, {
    messageId: msg.key.id
  });
    }
};

export default alive;
