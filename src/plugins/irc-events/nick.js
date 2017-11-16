"use strict";

const Msg = require("../../models/msg");

module.exports = function(irc, network) {
	const client = this;

	irc.on("nick", function(data) {
		let msg;
		const self = data.nick === irc.user.nick;

		if (self) {
			network.setNick(data.new_nick);

			const lobby = network.channels[0];
			msg = new Msg({
				text: `You're now known as ${data.new_nick}`,
			});
			lobby.pushMessage(client, msg, true);

			client.save();
			client.emit("nick", {
				network: network.id,
				nick: data.new_nick,
			});
		}

		network.channels.forEach((chan) => {
			const user = chan.findUser(data.nick);

			if (typeof user === "undefined") {
				return;
			}

			chan.removeUser(user);
			user.nick = data.new_nick;
			chan.setUser(user);

			msg = new Msg({
				time: data.time,
				from: user,
				type: Msg.Type.NICK,
				new_nick: data.new_nick,
				self: self,
			});
			chan.pushMessage(client, msg);

			user.nick = data.new_nick;

			client.emit("users", {
				chan: chan.id,
			});
		});
	});
};
