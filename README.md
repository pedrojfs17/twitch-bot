# Twitch Bot


I made this bot to help a friend of mine, [TVMarvin](https://www.twitch.tv/tvmarvin), which had some problems when everyone on his stream was trying to play with him so I came up with this solution.
Basically this bot connects to twitch chat and recognizes the command ```!jogar <nick>``` which let the viewers enter the list to play with the streamer by sending their in-game nickname.

## APIs 

- [TwitchAPI](https://dev.twitch.tv/docs/api/)
- [SheetsAPI](https://developers.google.com/sheets/api)

## Hosting

This project is hosted on [Heroku](https://heroku.com) because it needs a good internet connection to ensure the communication between Twitch and the bot itself.

## Requirements

The bot uses Node.js and Yarn as a package manager.

## Usage

The bot runs along with [StreamElements](https://streamelements.com) so it can check ig the user who entered the command in chat is able to play with the streamer. The bot is configured to check if the viewer as at least 4 hours of watchtime on the channel.

![ComandoMalUsado](https://github.com/pedrojfs17/twitch-bot/tree/master/images/commandUsage.JPG)

![ComandoUsado](https://github.com/pedrojfs17/twitch-bot/tree/master/images/botUsage.JPG)

The bot updates a public Google Sheets' sheet which has the list of the players who are going to play next.

📜 [Sheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vQkhZuM1U-wRbq7ox8E3cDvACkzPYX0jplAGx1y8pvE6wuhwVQPASuQjfpHHxtWoF0qhX9MPdYAeGux/pubhtml)
