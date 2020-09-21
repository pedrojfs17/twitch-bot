import {isPlayerInList, client} from "./app"

let playersToPlay = [];

export function recognizeCommand(message) {
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

export function callCommand(command, messageInfo) {
	switch (command.command) {
	  	case 'jogar':
			playCommandHandler(command, messageInfo);
			break
	 	default:
			break
	}
}

function playCommandHandler(command, messageInfo) {
	if (command.args.length != 1) {
		client.say(messageInfo.channel, `@${messageInfo.user.username}, para te juntares à lista para jogar deves usar o comando da seguinte forma: !jogar <nick>`);
	}
	else if (!isPlayerInList(messageInfo.user['user-id'])) {	
		const data = [messageInfo.user['user-id'], messageInfo.user.username, command.args[0], '=TIMESTAMP()'];
		client.say(messageInfo.channel, `!watchtime @${messageInfo.user.username}`);
		addPlayerToCheckList(messageInfo.user.username, data);
	}
	else {
		client.say(messageInfo.channel, `@${messageInfo.user.username}, já te encontras na lista para jogar!`);
	}
}

function addPlayerToCheckList(twitchUsername, data) {
	let info = [twitchUsername, data];
	playersToPlay.push(info);
	console.log('Added player');
	console.log(playersToPlay);
}

export function parseBotMessage(channel, message) {
	const words = message.split(' ');
	if (words[1] !== 'gastou') return;

	for (var i = 0; i < playersToPlay.length; i++) {
		if (playersToPlay[i][0] === words[0]) {
			console.log('Found Player in List');
			if (words[3] === 'days' || (Number(words[2]) >= 4 && words[3] === 'hours')) {
				console.log('Player able to play');
				addPlayerToDatabase(playersToPlay[i][1]);
				client.say(channel, `@${playersToPlay[i][1]}, foste agora adicionado à lista para jogar com o nick: ${playersToPlay[i][2]}!`);
			}
			else
				client.say(channel, `@${playersToPlay[i][0]}, necessitas de pelo menos 4 horas para estares apto para jogar!`);
			playersToPlay.splice(i, 1);
		}
	}
	console.log('Updated list: ');
	console.log(playersToPlay);
}