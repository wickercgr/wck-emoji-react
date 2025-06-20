const Discord = require('discord.js-selfbot-v13');
const fs = require('fs');
const chalk = require('chalk');
const { JsonDatabase } = require("wio.db");
const db = new JsonDatabase("db");
const axios = require("axios");

const util = require('util');
const origConsoleLog = console.log;

// LICENSE CONTROL

let control = 1;

console.log = function () {
    const now = new Date();
    const options = {
        timeZone: 'Europe/Istanbul',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const formattedDate = chalk.rgb(51, 255, 153)('[' + now.toLocaleString('tr-TR', options) + ']');
    const args = Array.from(arguments);
    args.unshift(formattedDate);
    origConsoleLog.apply(console, args);
};

setTimeout(async function () {
    if (control === 1) {
        const time = Date.now();

        const buildnumber = (Math.random() + 1).toString(8).substring(13);

        console.log(chalk.red("[WCK SCRIPT] ") + chalk.rgb(230, 184, 0)("Loaded Tokens [+]:"));
        const totaltoken = fs.readFileSync('tokens.txt', 'utf-8').split('\r\n').filter(Boolean);
        totaltoken.forEach((token, index) => {
            console.log(chalk.rgb(230, 184, 0)(`[${index}]`) + chalk.green(token));
        });
        console.log(chalk.red("[WCK SCRIPT] ") + chalk.rgb(230, 184, 0)("Status [+]:"));
        console.log(chalk.red("[WCK SCRIPT] ") + chalk.rgb(230, 184, 0)("Build Number: ") + chalk.green(buildnumber));
        console.log(chalk.red("[WCK SCRIPT] ") + chalk.rgb(230, 184, 0)("MS: ") + chalk.green(Date.now() - time));
        console.log(chalk.red("[WCK SCRIPT] ") + chalk.rgb(230, 184, 0)("PROCESS TYPE: ") + chalk.green(db.get("islem")));
        console.log(chalk.red("[WCK SCRIPT] ") + chalk.rgb(230, 184, 0)("EMOTE TYPE: ") + chalk.green(db.get("emoji")));
        console.log("");

        async function loginTokens() {
            const tokens = fs.readFileSync('tokens.txt', 'utf-8').split('\r\n').filter(Boolean);
            for (let i = 0; i < tokens.length; i++) {
                const client = new Discord.Client({
                    checkUpdate: false,
                });

                client.on('ready', async () => {
                    console.log("");
                    console.log(chalk.rgb(51, 119, 255)("[TOKEN] ") + chalk.rgb(204, 51, 153)("NAME ") + chalk.rgb(230, 184, 0)(`${client.user.tag}`));
                    console.log(chalk.rgb(51, 119, 255)("[TOKEN] ") + chalk.rgb(204, 51, 153)("ID ") + chalk.rgb(230, 184, 0)(`${client.user.id}`));
                    console.log(chalk.rgb(51, 119, 255)("[TOKEN] ") + chalk.rgb(204, 51, 153)("NUMBER ") + chalk.rgb(230, 184, 0)(i));
                    console.log("");

                    /* EMOJI REACT PROCESS */
                    const kanalid = db.get("channelid");
                    const mesajid = db.get("msgid");
                    const emojiID = db.get("emojiID");
                    const islem = db.get("islem");

                    async function emojitikla(kanal, mesaj, emojiID) {
                        let transaction;
                        if (islem === "ekle") {
                            transaction = "put";
                        } else if (islem === "sil") {
                            transaction = "delete";
                        } else {
                            transaction = "put";
                        }

                        try {
                            await axios({
                                method: transaction,
                                url: `https://discord.com/api/v9/channels/${kanal}/messages/${mesaj}/reactions/${encodeURIComponent(emojiID)}/@me`,
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': '*/*',
                                    'Accept-Encoding': 'gzip, deflate, br',
                                    'Accept-Language': 'en-US',
                                    'DNT': '1',
                                    'origin': 'https://discord.com',
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                    'TE': 'Trailers',
                                    'X-Super-Properties': 'eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC45MDAxIiwib3NfdmVyc2lvbiI6IjEwLjAuMTkwNDIiLCJvc19hcmNoIjoieDY0Iiwic3lzdGVtX2xvY2FsZSI6ImVuLVVTIiwiY2xpZW50X2J1aWxkX251bWJlciI6ODMwNDAsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9',
                                    'authorization': tokens[i],
                                    'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
                                }
                            });
                            console.log("Emojiye tıklandı!");
                        } catch (error) {
                            console.log("Emojiye tıklanamadı.");
                            console.log(error);
                        }
                    }

                    await emojitikla(kanalid, mesajid, emojiID);
                    console.log(chalk.rgb(51, 119, 255)("[AI] ") + chalk.rgb(204, 51, 153)("Emoji React Process ") + chalk.green("+"));



                    try {
                        await new Promise(resolve => setTimeout(resolve, db.get("delay") * 1000)); // token delay
                        await client.login(tokens[i]);
                    } catch (err) {
                        console.log("");
                        console.log(chalk.red("[WCK SCRIPT] ") + chalk.rgb(230, 184, 0)("GET TOKEN ERROR! ") + chalk.red("[-] "));
                        console.log(chalk.green("[WCK SCRIPT] ") + chalk.rgb(230, 184, 0)("RETRY TO PROCESS! ") + chalk.green("[+] "));
                        console.log("");
                    }
                });

                await client.login(tokens[i]);
            }
        }

        loginTokens();
    }
}, 2000);

process.on('unhandledRejection', err => {
    console.log(err);
});
