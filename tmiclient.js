const irc = require('tmi.js');

class TMIClient {
  constructor(botState) {
    this.client = null;
    this.botState = botState;
  }

  getClient() {
    return this.client;
  }

  connect() {
    const options = {
      options: {
        debug: true,
        clientId: this.botState.clientId,
      },
      channels: ['#' + this.botState.channelName],
      identity: {
        username: this.botState.username,
        password: this.botState.password,
      },
      connection: {
        reconnect: true,
      },
    };

    this.client = new irc.client(options);

    this.client.on('disconnected', (reason) => {
      console.log('Client has disconnected for: ' + reason);
    });
    return this.client.connect();
  }
}

module.exports = TMIClient;
