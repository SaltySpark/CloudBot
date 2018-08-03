//npm packages
const Discord = require('discord.js');
const chalk = require('chalk');
const ddiff = require('return-deep-diff');
const fs = require('graceful-fs');

const sparkClient = new Discord.Client();

//JSON Files
const config = require('./config.json');

//variables to be used later
var prefix = '/';
var serverName = 'CloudPvP';
var creator = 'SaltySpark#1719';

//ready event
sparkClient.on('ready', () => {
    console.log(serverName + ' bot is now running');
})

//message event
sparkClient.on('message', async message => {
    //functions
    function sparkEmbed(response, optionalName){
        var embedTitle = optionalName;
        if(optionalName == null){
            embedTitle = sparkCommand.toUpperCase();
        }
        message.channel.send({embed: {
            title: `• ${serverName} Bot - ${embedTitle} •`,
            color: 4259801,
            description: response,
            timestamp: new Date(),
            footer: {
                icon_url: sparkClient.user.avatarURL,
                text: `${serverName} Bot • Created by ${creator}`
            }
        }});
    }
    //setting args
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const sparkCommand = args.shift().toLowerCase();
    if(message.content.startsWith(prefix)){
        //Commands for Everyone
        if(sparkCommand == 'help'){
            message.channel.send({embed: {
                title: `• ${serverName} Bot - Help •`,
                color: 4259801,
                description: `Hey! I\'m ${serverName}\'s custom bot. Here is everything in what I can help you with:`,
                fields: [{
                    name: "Commands for Everyone",
                    value: '`/help`\n`/ping`\n`/rules`\n`/membercount`'
                  },
                  {
                    name: 'Moderator Commands',
                    value: '`/kick (user you want to kick) (reason)`,\n`/ban (user you want to ban) (reason),`\n`/warn (user you want to warn) (reason)`'
                  },
                  {
                    name: 'Adminstrator Commands',
                    value: '`/status (status)`,\n`/announce (message),`\n`/addmod (user)`\n`/send (channel-name) (message) | (Embed Title)`'
                  }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: sparkClient.user.avatarURL,
                    text: `${serverName} Bot • Created by ${creator}`
                }
            }});
        }
        else if(sparkCommand == 'ping'){
            sparkEmbed(`Pong! \`${Date.now() - message.createdTimestamp} ms\` `);
        }
        else if(sparkCommand == 'rules' || sparkCommand == 'rule'){
            sparkEmbed(`• 1 - No Disrespect/Racism/Bullying/Harrassment
            • 2 - No Spamming Characters/Messages - Don't spam messages, characters, etc
            • 3 - Do not attempt to start/cause Spam - This results in a more severe punishment than just Spamming
            • 4 - Do not post in-appropriate messages
            • 5 - No Advertising Websites/Servers  - Please note that shortened URLs (i.e bit.ly) are also not allowed. (Staff Exception) 
            • 6 - No Malicious/Inappropriate URLs
            • 7 - No DDoS/Dox/Swat Threats  - Even if intended as a "Joke", they are disallowed
            • 8 - No Death Threats  - Even if intended as a "Joke", they are disallowed
            • 9 - No IRL Trading  - Any trading for out of game currencies (PayPal, Ranks, etc)
            • 10 - Do not ask for others to be unbanned/unmuted
            • 11 - Do not tag Owners - If you need them, please message staff or DM a owner.`, `Server Rules`);
        }
        else if(sparkCommand == 'membercount'){
            sparkEmbed(`Total Members • ${message.guild.memberCount}\nOnline Members • ${message.guild.members.filterArray(member => member.presence.status !== 'offline').length} `)
        }
        //Moderator Commands
        else if(sparkCommand == 'kick'){
            let kickedMember = message.mentions.members.first();
            let reason = args.slice(1).join(' ');
            if(!message.member.hasPermission('ADMINISTRATOR') && !config[message.guild.id].moderatorMembers.includes(message.member.id)){
                sparkEmbed(`You do not have permission to do this command.`);
            }
            else if(kickedMember == null || reason == null || reason == ""){
                sparkEmbed(`Please use the correct format: \n\`${prefix}kick (user) (reason)\``);
            }
            else if(message.channel.type == 'dm'){
                message.channel.send(`This command can only be performed inside a server.`);
            }
            else if(message.guild.channels.find('name', 'bot-logs') == null){
                sparkEmbed(`I can't seem to find the log channel. Please create one and try this command again.`);
            }
            else if(kickedMember.kickable == false){
                sparkEmbed('I do not have the proper permissions to kick this user.');
            }
            else{
                kickedMember.send(`You were kicked from ${serverName} because ${reason}`)
                .then(message => { 
                    kickedMember.kick();
                })
                .catch(console.error);
                sparkClient.channels.find('name', 'bot-logs').send({embed: {
                    title: `✦ ${serverName} Bot - USER KICKED ✦`,
                    color: 16549376,
                    description: `${message.author.toString()} decided to kick ${kickedMember} because ${reason}`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: sparkClient.user.avatarURL,
                        text: `${serverName} Bot • Created by ${creator}`
                    }
                }});
            }
        }
        else if(sparkCommand == 'ban'){
            let bannedMember = message.mentions.members.first();
            let reason = args.slice(1).join(' ');
            if(!message.member.hasPermission('ADMINISTRATOR') && !config[message.guild.id].moderatorMembers.includes(message.member.id)){
                sparkEmbed(`You do not have permission to do this command.`);
            }
            else if(bannedMember == null || reason == null || reason == ""){
                sparkEmbed(`Please use the correct format: \n\`${prefix}ban (user) (reason)\``);
            }
            else if(message.channel.type == 'dm'){
                message.channel.send(`This command can only be performed inside a server.`);
            }
            else if(message.guild.channels.find('name', 'bot-logs') == null){
                sparkEmbed(`I can't seem to find the log channel. Please create one and try this command again.`);
            }
            else if(bannedMember.bannable == false){
                sparkEmbed('I do not have the proper permissions to ban this user.');
            }
            else{
                bannedMember.send(`You were banned from ${serverName} because ${reason}`)
                .then(message => { 
                    bannedMember.ban();
                })
                .catch(console.error);
                sparkClient.channels.find('name', 'bot-logs').send({embed: {
                    title: `✦ ${serverName} Bot - USER BANNED ✦`,
                    color: 16729392,
                    description: `${message.author.toString()} decided to ban ${bannedMember.toString()} because ${reason}`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: sparkClient.user.avatarURL,
                        text: `${serverName} Bot • Created by ${creator}`
                    }
                }});
            }
        }
        else if(sparkCommand == 'warn'){
            let warnedMember = message.mentions.members.first();
            let reason = args.slice(1).join(' ');
            if(message.channel.type == 'dm'){
                message.channel.send(`This command can only be performed inside a server.`);
            }
            else if(!message.member.hasPermission('ADMINISTRATOR') && !config[message.guild.id].moderatorMembers.includes(message.member.id)){
                sparkEmbed(`You do not have permission to do this command.`);
            }
            else if(warnedMember == null || reason == null || reason == ""){
                sparkEmbed(`Please use the correct format: \n\`${prefix}warn (user) (reason)\``);
            }
            else if(message.guild.channels.find('name', 'bot-logs') == null){
                sparkEmbed(`I can't seem to find the log channel. Please create one and try this command again.`);
            }
            else{
                warnedMember.send({embed: {
                    title: `✦ ${serverName} Bot - USER WARNED ✦`,
                    color: 16729392,
                    description: `${message.author.toString()} decided to warn you because ${reason}`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: sparkClient.user.avatarURL,
                        text: `${serverName} Bot • Created by ${creator}`
                    }
                }})
                .then(message.channel.send({embed: {
                        title: `✦ ${serverName} Bot - USER WARNED ✦`,
                        color: 16729392,
                        description: `${message.author.toString()} decided to warn ${warnedMember.toString()} because ${reason}`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: sparkClient.user.avatarURL,
                            text: `${serverName} Bot • Created by ${creator}`
                        }
                }}))
                .then(sparkClient.channels.find('name', 'bot-logs').send({embed: {
                        title: `✦ ${serverName} Bot - USER WARNED ✦`,
                        color: 16729392,
                        description: `${message.author.toString()} decided to warn ${warnedMember.toString()} because ${reason}`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: sparkClient.user.avatarURL,
                            text: `${serverName} Bot • Created by ${creator}`
                        }
                }}))
                .catch(console.error);
            }
        }
        else if(sparkCommand == 'purge' || sparkCommand == 'clear'){
            if(!message.member.hasPermission('ADMINISTRATOR') && !config[message.guild.id].moderatorMembers.includes(message.member.id)){
                return sparkEmbed('You do not have permission to do this command');
            }
            var messageCount = parseInt(args.join(' ')) + 1;
            if(messageCount <= 100){
                message.channel.fetchMessages({ limit:messageCount })
                .then(messages => message.channel.bulkDelete(messages));
            }
            else{
                message.channel.send(`Please enter a number from 1-99`);
            }
        }
        //Adminstrator Commands
        if(sparkCommand == 'status'){
            if(message.member.hasPermission('ADMINISTRATOR') || message.author.id == '434518162138988545'){
                sparkClient.user.setActivity(args.join(' '));
                sparkEmbed(`Status has now been set to \`"playing ${args.join(' ')}"\``);
            }
            else{
                sparkEmbed(`Sorry, You do not have permission to use this command. If you think this is an error, please contact staff or my developer(SaltySpark#1719)`);
            }
        }
        else if(sparkCommand == 'announce'){
            if(args[0] == null){
                message.channel.send('Please use the command in the correct format: \`/announce (Announcement Number) (message)\`')
            }
            else if(message.member.hasPermission('ADMINISTRATOR') == false && message.author.id !== '434518162138988545'){
                message.channel.send('You do not have permission to use this command');
            }
            else{
                var argoutput = args.splice(1).join(' ');
                var announcementCounter = args[0];
                sparkClient.channels.get('472113451779489803').send({embed: {
                    title: `• CloudPvP Announcement #${announcementCounter} •`,
                    color: 4259801,
                    description: argoutput,
                    timestamp: new Date(),
                    footer: {
                        icon_url: sparkClient.user.avatarURL,
                        text: "Created by SaltySpark#1719"
                    }
                }});
                sparkClient.channels.get('472113451779489803').send(message.guild.roles.get(message.guild.id).toString())
                .then(message => message.delete());
                sparkEmbed(`Announcement Sent`);
            }
        }
        else if(sparkCommand == 'send'){
            var channel = message.mentions.channels.first();
            var smessage = args.slice(1).join(' ').split('|').shift(); 
            var sembedTitle = args.splice(1).join(' ').split('|').pop();
            if(message.channel.type == 'dm'){
                return sparkEmbed(`This command may only be used inside a server.`);
            } 
            else if(!message.member.hasPermission('ADMINISTRATOR') && message.author.id !== '434518162138988545'){
                return sparkEmbed(`You do not have permission to use this command`);
            }
            else if(channel == null || channel == ""){
                sparkEmbed(`Please enter a valid channel using the following format: \n\`/send (channel-name) (message) | (Embed Title)\``);
            }
            else if(smessage == null || smessage == ""){
                sparkEmbed(`Please enter a valid message using the following format: \n\`/send (channel-name) (message) | (Embed Title)\``);
            }
            else{
                if(sembedTitle.startsWith(' ')){
                    sembedTitle = sembedTitle.slice(1);
                }
                await channel.send({embed: {
                    title: `• ${sembedTitle} •`,
                    color: 4259801,
                    description: smessage,
                    timestamp: new Date(),
                    footer: {
                        icon_url: sparkClient.user.avatarURL,
                        text: "Created by SaltySpark#1719"
                    }
                }});
            }            
        }
        else if(sparkCommand == 'addmod'){
            if(!message.member.hasPermission('ADMINISTRATOR') && message.member.id !== '434518162138988545'){
                return sparkEmbed('You do not have permission to use this command.');
            }
            var checkMod = message.mentions.roles.first() || message.mentions.members.first();
            let configJSON = JSON.parse(fs.readFileSync("./config.json", "utf8"));
            if(!config[message.guild.id]){
                config[message.guild.id] = {
                    moderatorRole: "",
                    moderatorMembers: []
                }
            }
            if(checkMod == null){
                sparkEmbed(`**Correct usage:**\n\`${prefix}${sparkCommand} (@role/user)\``, 'Add Moderater');
            }
            else{
                if(message.mentions.members.first() !== null){
                    var newMod = message.mentions.members.first();
                    if(config[message.guild.id].moderatorMembers.includes(newMod.id)){
                        return sparkEmbed(`This user is already a Moderator. Use /removeMod (user) to demote him from a Moderator.`);
                    }
                    var modMemberArray =  config[message.guild.id].moderatorMembers;
                    modMemberArray.push(newMod.id);
                    configJSON[message.guild.id] = {
                        moderatorMembers: modMemberArray
                    }
                    fs.writeFile("./config.json", JSON.stringify(configJSON), err => {if(err) console.log(err)});
                    sparkEmbed(`${newMod.toString()} is now a Moderator.`);
                }
            }
        }
        //Only SaltySpark/dev Commands
        else if(sparkCommand == 'waffles' && message.author.id == '434518162138988545'){
            message.guild.unban('403726994748997632')
            .catch(console.error);
            sparkEmbed('alt unbanned :white_check_mark:');
        }
    }
})

sparkClient.login('');