'use strict';

const DEPS = {
	name: 'bot-test',
	version: '1.2.3',
	dependencies: {
		'hubot-help': '0.9.0',
		'hubot-thing': '9.9.9'
	}
};

const chai = require('chai');
const expect = chai.expect;
const dependencies = require('../src/lib/dependencies');

let version;

describe('Should respond to version requests', function() {

	let oldFind;

	before(function() {
		oldFind = dependencies.find;
		dependencies.find = function(dir, cb) {
			cb(null, DEPS);
		};
		version = require('../src/scripts/version');
	});

	after(function() {
		dependencies.find = oldFind;
	});

	it('should create a dependencies object from the provided path', function() {
		let handler, eventType, eventAttachment;
		const robot = {
			respond: (pattern, cb) => {
				handler = cb;
			}
		};
		robot.emit = (type, attachment) => {
			eventType = type;
			eventAttachment = attachment;
		};
		version(robot);
		handler();
		expect(eventType).to.equal('ibmcloud.formatter');
		expect(eventAttachment).to.have.deep.property('attachments[0].pretext', `Your bot is at version ${DEPS.version}.`);
		expect(eventAttachment).to.have.deep.property('attachments[0].fields').to.be.length(2);
		expect(eventAttachment).to.have.deep.property('attachments[0].fields[0].title').to.equal('hubot-help');
		expect(eventAttachment).to.have.deep.property('attachments[0].fields[0].value').to.equal(DEPS.dependencies['hubot-help']);
		expect(eventAttachment).to.have.deep.property('attachments[0].fields[1].title').to.equal('hubot-thing');
		expect(eventAttachment).to.have.deep.property('attachments[0].fields[1].value').to.equal(DEPS.dependencies['hubot-thing']);
	});

});
