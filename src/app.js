import tmi from "tmi.js"
import {CHANNEL_NAME, OAUTH_TOKEN, BOT_USERNAME} from "./constants"

import {readDatabase, updateDatabase} from "./sheets"
import {recognizeCommand, callCommand, parseBotMessage} from "./commands"

const {google} = require('googleapis');

export const sheetsClient = new google.auth.JWT(
	process.env.CLIENT_EMAIL,
	null,
	process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
	['https://www.googleapis.com/auth/spreadsheets']
);

var fullList = [];

sheetsClient.authorize(function (err, tokens) {
	if (err) {
		console.log(err);
		return;
	}

	console.log("Connected!");
	readDatabase(sheetsClient, fullList);
});

export function addPlayerToList(data) {
	fullList.push(data);
}

export function isPlayerInList(userID) {
	for (var i = 0; i < fullList.length; i++) {
		if (fullList[i][0] === userID)
			return true;
	}
	return false;
}

const options = {
	options: { debug: true },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: BOT_USERNAME,
		password: OAUTH_TOKEN
	},
	channels: [ CHANNEL_NAME ]
}

export const client = new tmi.Client(options);

client.connect().catch(console.error);

client.on('message', (channel, user, message, self) => {
	if(self) return;

	if (user.username === 'streamelements')
		parseBotMessage(channel, message);

	if ((message.indexOf('!')) !== -1) {
		const command = recognizeCommand(message);

		if (!command) return

		callCommand(command, { channel, user, message });
	}
});