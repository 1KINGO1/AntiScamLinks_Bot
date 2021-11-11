<h1>AntiScamLinks_Bot</h1>
The bot does not provide full protection against scam links. The bot is able to detect scam links by itself according to two criteria, which can be changed in the config.

<h1>Features | 🐵</h1>
<h3>• 5 ways of protection with the possibility of configuration</h3>
<h3>• Easy to set up handlers </h3>

<h1>Setup | 🌱</h1>
<h4>First, run the command:</h4>

```
npm install
```

<h4>For the bot to work correctly, you need to specify your token in the config.</h4>

<img src="https://media.discordapp.net/attachments/866965472582828042/908431440251867146/unknown.png" alt="image"/>

<h4>There are only 5 ways to check a link:</h4>
<h5>• cssChecker  -  `boolean`</h5>
<h5>• websiteIconChecker  -  `boolean`</h5>
<h5>• inSiteBlackWordsList  -  `boolean or array`</h5>
<h5>• inSiteTitleBlackWordsList  -  `boolean or array`</h5>
<h5>• blackListWords  -  `boolean or array`</h5>

<h4>You can run the bot with a command:</h4>

```
node src/main
```

<h1>Setting up | 🛠</h1>

<h4>You can change the bot's behavior when a bad link is detected. To do this, you can change /middleware/basicMiddle or add new.</h4>
<img src="https://media.discordapp.net/attachments/895015757350596628/907187272603021352/Screenshot_11.png" alt="image"/>
<h4>The Middleware handler can take the message object as an argument and interact with it.</h4>
<h4>If you add your own handler, don't forget to leave a link to it in the config</h4>
<img src="https://cdn.discordapp.com/attachments/895015757350596628/907187898267344896/Screenshot_12.png" alt="image"/>