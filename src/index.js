import dotenv from 'dotenv';
dotenv.config();

import {
    makeWASocket,
    Browsers,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeInMemoryStore
} from '@whiskeysockets/baileys';
import { Handler, Callupdate, GroupUpdate } from './event/index.js';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import axios from 'axios';
import NodeCache from 'node-cache';
import { writeFile } from 'fs/promises';
import config from '../config.cjs';
import pkg from '../lib/autoreact.cjs';
const { emojis, doReact } = pkg;

const sessionName = "session";
const app = express();
const PORT = process.env.PORT || 3000;

const MAIN_LOGGER = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
});
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();
const store = makeInMemoryStore({
    logger: pino().child({ level: 'silent' })
});

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
}

async function downloadSessionData() {
    if (!config.SESSION_ID) {
        console.error('Please add your session to SESSION_ID env !!');
        process.exit(1);
    }
    const sessdata = config.SESSION_ID.split("Ethix-MD&")[1];
    const url = `https://pastebin.com/raw/${sessdata}`;
    try {
        const response = await axios.get(url);
        const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        await fs.promises.writeFile(credsPath, data);
        console.log("🔒 Session Successfully Loaded !!");
    } catch (error) {
        console.error('Failed to download session data:', error);
        process.exit(1);
    }
}

if (!fs.existsSync(credsPath)) {
    await downloadSessionData();
}

async function start() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`🤖 Vishwa-MD using WA v${version.join('.')}, isLatest: ${isLatest}`);

        const Matrix = makeWASocket({
            version,
            logger: pino({ level: 'error' }), // Reduced log level
            printQRInTerminal: true,
            browser: ["Vishwa-MD", "safari", "3.3"],
            auth: state,
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id);
                    return msg.message || undefined;
                }
                return { conversation: "Ethix-MD Nonstop Testing" };
            }
        });

        Matrix.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                    start(); // Reconnect
                }
            } else if (connection === 'open') {
                console.log(chalk.green("Connected ✅"));
                Matrix.sendMessage(Matrix.user.id, { text: `Connected ✅` });
            }
        });

        Matrix.ev.on('creds.update', saveCreds);

        Matrix.ev.on('messages.upsert', async (chatUpdate) => {
            try {
                const messages = chatUpdate.messages;
                if (!messages.length) return;

                // Batch processing
                const promises = messages.map(async (mek) => {
                    if (!mek.key.fromMe && config.AUTO_REACT) {
                        if (mek.message) {
                            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                            await doReact(randomEmoji, mek, Matrix);
                        }
                    }
                });

                // Wait for all promises to resolve
                await Promise.all(promises);
                await Handler(chatUpdate, Matrix, logger);
            } catch (err) {
                console.error('Error processing messages:', err);
            }
        });

        Matrix.ev.on("call", async (json) => await Callupdate(json, Matrix));
        Matrix.ev.on("group-participants.update", async (messag) => await GroupUpdate(Matrix, messag));

        if (config.MODE === "public") {
            Matrix.public = true;
        } else if (config.MODE === "private") {
            Matrix.public = false;
        }

    } catch (error) {
        console.error('Critical Error:', error);
        process.exit(1);
    }
}

start();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
