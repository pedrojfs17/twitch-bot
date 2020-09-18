import tmi from "tmi.js"
import {CHANNEL_NAME, OAUTH_TOKEN, BOT_USERNAME} from "./constants"

const Datastore = require('nedb');
const database = new Datastore("usersToPlay.db");
database.loadDatabase();
database.ensureIndex({ fieldName: 'TwitchUserID', unique: true });

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
	else {
		addPlayerToDatabase(command.args[0], messageInfo)
		client.say(messageInfo.channel, `@${messageInfo.user.username}, foste agora adicionado à lista para jogar! Nick: ${command.args[0]}! (Caso o nick não esteja correto contacta-me por favor)`);
	}
}

function addPlayerToDatabase(nick, messageInfo) {
	const data = {TwitchUserID: messageInfo.user['user-id'], TwitchUsername: messageInfo.user.username, FortniteNick: nick, Timestamp: Date.now()}
	database.insert(data, function (err) {
		client.say(messageInfo.channel, `@${messageInfo.user.username}, já estás na lista para jogar! Nick: ${command.args[0]}! (Caso o nick não esteja correto contacta-me por favor)`);
	});
}