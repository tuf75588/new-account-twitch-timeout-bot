# twitch-bot-timeout-new-accounts

This is a single channel twitch bot that times out accounts that have been created too recently.
For example, if you only want accounts older than 7 days to be able to chat and a 3-day old account types something, it will be timed out for 4 days.

In addition to this functionality, some additional features that might be useful in the future could be:

- Allow a whitelist of users so that the bot doesn't just keep timing them out
- Allow this to work in multiple channels at the same time (e.g. Nightbot)
- Persist the cache to disk so that returning chatters don't trigger additional Twitch API calls.
- Allow for dynamic configuration via chat commands.
