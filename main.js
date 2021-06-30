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

  async getOrFetchUserCreatedDate(username, userId) {
    let creationDate = this.users[username];
    console.log('creation-date-before', creationDate);
    if (_.isNil(creationDate)) {
      creationDate = await this.getCreationDateFromTwitch(userId);
      console.log('this-object', this.users);
    }
    return creationDate;
  }
  async getCreationDateFromTwitch(userId) {
    // kraken endpoint
    const url = `https://api.twitch.tv/kraken/users/${userId}`;
    const res = await fetch(url, {
      headers: {
        'Client-Id': process.env.CLIENT_ID,
        accept: 'application/vnd.twitchtv.v5+json',
      },
    });
    const json = await res.json();
    return json.created_at;
  }

  async onChatMessage(channelName, userState, message, self) {
    const userId = userState['user-id'];
    const userData = await this.getOrFetchUserCreatedDate(
      userState.username.toLowerCase(),
      userId
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
