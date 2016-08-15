// Description:
//	Displays the version of the bot and all of its external scripts
//
// Configuration:
//
// Commands:
//   hubot version - Shows the version of the bot and all of its external scripts
//
// Author:
//	nsandona
//
/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2016. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */
'use strict';

const dependencies = require('../lib/dependencies');

const SHOW_VERSION = /version(.*)/i;

module.exports = robot => {

	let deps;
	dependencies.find(__dirname, (e, metadata) => {
		deps = metadata;
	});

	robot.respond(SHOW_VERSION, (res) => {
		let matchString = '';
		if (res.match.length > 1) {
			matchString = res.match[1].trim();
		}

		const attachment = {
			pretext: `Your bot is at version ${deps.version}.`,
			fields: [],
			color: '#555'
		};
		attachment.fields = Object.keys(deps.dependencies).map(dep => {
			if (matchString) {
				if (dep.indexOf(matchString) > -1) {
					return {title: dep, value: deps.dependencies[dep], short: true};
				}
			}
			else {
				return {title: dep, value: deps.dependencies[dep], short: true};
			}
		});
		robot.emit('ibmcloud.formatter', {response: res, attachments: [attachment]});
	});

};
