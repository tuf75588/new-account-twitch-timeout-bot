const TMIClient = require('./tmiclient');
const BotState = require('./botstate');
const fetch = require('node-fetch');
const _ = require('lodash');
require('dotenv').config();

class Main {
  constructor() {
    this.botState = new BotState();
    // console.log(BotState);
    this.users = {};
  }
  async getOrFetchCreationDate(username, userId) {
    let creationDate = this.users[username];
    if (_.isNil(creationDate)) {
      creationDate = await this.getCreationDateFromTwitch(userId);
    }
    console.log(creationDate);
    return creationDate;
  }
  async getCreationDateFromTwitch(userId) {
    // The stupid new API can't fetch creation date (code commented just below
    // this line), so we have to use the V5 API ("kraken").
    //
    // const url = `https://api.twitch.tv/helix/users?id=${userId}`;

    const url = `https://api.twitch.tv/kraken/users/${userId}`;
    const res = await fetch(url, {
      headers: {
        'Client-ID': process.env.CLIENT_ID,
        Accept: 'application/vnd.twitchtv.v5+json',
      },
    });

    const json = await res.json();
    return json.created_at;
  }

  async onChatMessage(channelName, userstate, message, self) {
    // Ignore messages from the bot.
    if (self) return;

    const username = userstate.username.toLowerCase();
    const creationDate = await this.getOrFetchCreationDate(
      username,
      userstate['user-id']
    );
  }
  async initialize() {
    const tmiClientWrapper = new TMIClient(this.botState);
    await tmiClientWrapper.connect();
    this.tmiClient = tmiClientWrapper.getClient();
    this.tmiClient.on('chat', this.onChatMessage.bind(this));
  }
}

const main = new Main();
main.initialize().then(() => {
  console.log('client has connected');
});
