'use strict';

const async = require('async');
const fs = require('fs');
const path = require('path');
const findup = require('findup');

const EXT_SCRIPTS = 'external-scripts.json';
const PKG = 'package.json';

/**
 * Finds the location of the external-scripts.json that loads this
 * script.
 * @param {String} root the path to look for the external-scripts.json
 * @param {Function} cb(err, metadata) the callback function that is invoked with an error (if any) and the dependency metadata
 */
function find(root, cb) {
	findup(root, EXT_SCRIPTS, (err, dir) => {
		if (err) {
			cb(err);
		}
		else {
			// In parallel, read the external-scripts.json and package.json
			async.parallel([
				fs.readFile.bind(null, path.resolve(dir, EXT_SCRIPTS), {encoding: 'utf8'}),
				fs.readFile.bind(null, path.resolve(dir, PKG), {encoding: 'utf8'})],
				(err, files) => {
					if (err) {
						cb(err);
					}
					// If there are no errors, parse the contents to find out the versino of our bot
					const pkgContents = JSON.parse(files[1]);
					const metadata = {name: pkgContents.name, version: pkgContents.version, dependencies: {}};

					try {
						const scripts = JSON.parse(files[0]);

						// Find all of the external scripts under node_modules
						async.map(scripts, (file, complete) => fs.readFile(path.resolve(dir, 'node_modules', file, PKG), {encoding: 'utf8'}, (err, content) => complete(null, !err ? content : undefined)), (e, files) => {
							// errors correspond with undefined items in the array and the error argument should always be null
							files.forEach(file => {
								if (file) {
									const pkgContents = JSON.parse(file);
									metadata.dependencies[pkgContents.name] = pkgContents.version;
								}
							});
							cb(null, metadata);
						});
					}
					catch (e) {
						cb(new Error('Contents of external-scripts.json is not an array.'));
					}
				});
		}
	});
}

module.exports = {
	find
};
