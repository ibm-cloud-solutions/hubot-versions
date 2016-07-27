'use strict';

const expect = require('chai').expect;

const dependencies = require('../src/lib/dependencies');
const path = require('path');
const fs = require('fs');

describe('Library for finding dependencies', function() {

	beforeEach(function() {
		const structure = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'fs.json'), {encoding: 'utf8'}));
		let dir = path.resolve(__dirname, '.tmp');

		function build(structure) {
			try {
				fs.statSync(dir);
			}
			catch (e) {
				fs.mkdirSync(dir);
			}

			Object.keys(structure).forEach((key) => {
				if (typeof structure[key] === 'string') {
					fs.writeFileSync(path.resolve(dir, key), structure[key]);
				}
				else {
					dir = path.resolve(dir, key);
					build(structure[key]);
					dir = path.resolve(dir, '..');
				}
			});
		}
		build(structure);
	});

	after(function() {
		require('rimraf').sync(path.resolve(__dirname, '.tmp'));
	});

	it('should create a dependencies object from the provided path', function(done) {
		dependencies.find(path.resolve(__dirname, '.tmp', 'node_modules', 'hubot-versions'), function(err, deps) {
			expect(err).to.not.be.defined;
			expect(deps.name).to.equal('bot-test');
			expect(deps.version).to.equal('1.1.1');
			expect(deps.dependencies).to.exist;
			expect(deps.dependencies['hubot-help']).to.equal('0.9.0');
			expect(deps.dependencies['hubot-thing']).to.equal('9.9.9');
			done();
		});
	});

	it('should not have anything if an external-scripts.json is not found', function(done) {
		dependencies.find(path.resolve(__dirname, '..'), function(err, metadata) {
			expect(err).to.be.defined;
			expect(metadata).to.be.undefined;
			done();
		});
	});

	it('should not have anything if package.json is not found', function(done) {
		fs.unlinkSync(path.resolve(__dirname, '.tmp', 'package.json'));
		dependencies.find(path.resolve(__dirname, '.tmp', 'node_modules', 'hubot-versions'), function(err, deps) {
			expect(err).to.be.defined;
			expect(deps).to.be.undefined;
			done();
		});
	});

	it('should not have anything if package.json is not found', function(done) {
		fs.writeFileSync(path.resolve(__dirname, '.tmp', 'external-scripts.json'), 'not an array');
		dependencies.find(path.resolve(__dirname, '.tmp', 'node_modules', 'hubot-versions'), function(err, deps) {
			expect(err).to.be.defined;
			expect(deps).to.be.undefined;
			done();
		});
	});

	it('should handle missing external scripts', function(done) {
		fs.unlinkSync(path.resolve(__dirname, '.tmp', 'node_modules', 'hubot-help', 'package.json'));
		dependencies.find(path.resolve(__dirname, '.tmp', 'node_modules', 'hubot-versions'), function(err, deps) {
			expect(err).to.not.exist;
			expect(deps.name).to.equal('bot-test');
			expect(deps.version).to.equal('1.1.1');
			expect(deps.dependencies).to.exist;
			expect(deps.dependencies['hubot-thing']).to.equal('9.9.9');
			expect(deps.dependencies).to.not.have.property('hubot-help');
			done();
		});
	});
});
