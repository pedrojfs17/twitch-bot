const {google} = require('googleapis');
import {SHEET} from "./constants"
import {addPlayerToList, sheetsClient} from "./app"

async function readNumberOfEntries(cl) {
	const gsapi = google.sheets({version:'v4', auth: cl});
	const opt = {
		spreadsheetId: SHEET,
		range: 'Lista!E1'
	};

	let data = await gsapi.spreadsheets.values.get(opt);
	console.log("Numero de entradas: " + data.data.values);
	return data.data.values;
}

export async function readDatabase(cl, fullList) {
	const nEntries = readNumberOfEntries(cl);
	const gsapi = google.sheets({version:'v4', auth: cl});
	const opt = {
		spreadsheetId: SHEET,
		range: 'Lista!A2:D' + (await nEntries + 1).toString()
	};

	let data = await gsapi.spreadsheets.values.get(opt);
	fullList = data.data.values;
	console.log(fullList);
}

export async function updateDatabase(cl) {
	const gsapi = google.sheets({version:'v4', auth: cl});
	const updateOpt = {
		spreadsheetId: SHEET,
		range: 'Lista!A2',
		valueInputOption: 'USER_ENTERED',
		resource: { values: fullList }
	};

	await gsapi.spreadsheets.values.update(updateOpt);
}

export async function addPlayerToDatabase(data) {
	//const data = [messageInfo.user['user-id'], messageInfo.user.username, nick, '=TIMESTAMP()'];
	addPlayerToList(data);

	const gsapi = google.sheets({version:'v4', auth: sheetsClient});

	const updateOpt = {
		spreadsheetId: SHEET,
		range: 'Lista!A2',
		valueInputOption: 'USER_ENTERED',
		resource: { values: [data] }
	};

	await gsapi.spreadsheets.values.append(updateOpt);
}