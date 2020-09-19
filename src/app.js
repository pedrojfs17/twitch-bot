import tmi from "tmi.js"
import {CHANNEL_NAME, OAUTH_TOKEN, BOT_USERNAME, SHEET} from "./constants"

const {google} = require('googleapis');

const sheetsClient = new google.auth.JWT(
	process.env.CLIENT_EMAIL,
	null,
	process.env.PRIVATE_KEY,
	['https://www.googleapis.com/auth/spreadsheets']
);

var fullList;

sheetsClient.authorize(function (err, tokens) {
	if (err) {
		console.log(err);
		return;
	}

	console.log("Connected!");
	readDatabase(sheetsClient);
});

async function readDatabase(cl) {
	const gsapi = google.sheets({version:'v4', auth: cl});
	const opt = {
		spreadsheetId: SHEET,
		range: 'Lista!A2:D100'
	};

	let data = await gsapi.spreadsheets.values.get(opt);
	fullList = data.data.values;
}

async function updateDatabase(cl) {
	const gsapi = google.sheets({version:'v4', auth: cl});
	const updateOpt = {
		spreadsheetId: SHEET,
		range: 'Lista!A2',
		valueInputOption: 'USER_ENTERED',
		resource: { values: fullList }
	};

	await gsapi.spreadsheets.values.update(updateOpt);
}

function addPlayerToList(data) {
	fullList.push(data);
}

async function addPlayerToDatabase(nick, messageInfo) {
	const data = [messageInfo.user['user-id'], messageInfo.user.username, nick, Date.now()];
	addPlayerToList(data);
	updateDatabase(sheetsClient);
	client.say(messageInfo.channel, `@${messageInfo.user.username}, foste agora adicionado à lista para jogar com o nick: ${nick}!`);
}

function isPlayerInDatabase(userID) {
	for (var i = 0; i < fullList.length; i++) {
		if (fullList[i][0] === userID)
			return true;
	}
	return false;
}
/*
async function gsrun(cl) {
	const gsapi = google.sheets({version:'v4', auth: cl});

	// READ FROM SHEET

	const opt = {
		spreadsheetId: SHEET,
		range: 'Lista!A2:D10'
	};

	let data = await gsapi.spreadsheets.values.get(opt);
	let values = data.data.values;

	let newData = values.map(function(row) {
		row.push(row[0]*5);
		return row;
	})

	values.push(['6','6','6','6','6','30']);
	let newData = values;

	// WRITE TO SHEET

	const updateOpt = {
		spreadsheetId: SHEET,
		range: 'Lista!A2',
		valueInputOption: 'USER_ENTERED',
		resource: { values: newData }
	};

	let res = await gsapi.spreadsheets.values.update(updateOpt);
}*/

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

const client = new tmi.Client(options);

client.connect().catch(console.error);

client.on('message', (channel, user, message, self) => {
	if(self) return;

	if ((message.indexOf('!')) !== -1) {
		const command = recognizeCommand(message);

		if (!command) return

		callCommand(command, { channel, user, message });
	}
});

let recognizeCommand = (message) => {
	const regex = /\!(.*?)$/gm;
	const fullCommand = regex.exec(message);
  
	if (fullCommand) {
	  const splittedCommand = fullCommand[1].split(' ')
	  const command = splittedCommand[0];
  
	  splittedCommand.shift() // remove command from array
  
	  return {
		command: command,
		args: splittedCommand
	  }
	}
  
	return false
}

function callCommand(command, messageInfo) {
	switch (command.command) {
	  	case 'jogar':
			playCommandHandler(command, messageInfo);
			break
	 	default:
			break
	}
}

function playCommandHandler(command, messageInfo) {
	// Add user to list with command.args[0] nickname
	if (command.args.length != 1) {
		client.say(messageInfo.channel, `@${messageInfo.user.username}, para te juntares à lista para jogar deves usar o comando da seguinte forma: !jogar <nick>`);
	}
	else if (!isPlayerInDatabase(messageInfo.user['user-id'])) {
		addPlayerToDatabase(command.args[0], messageInfo)
	}
	else {
		client.say(messageInfo.channel, `@${messageInfo.user.username}, já te encontras na lista para jogar!`);
	}
}