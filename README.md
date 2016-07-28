
[![npm](https://img.shields.io/npm/v/hubot-versions.svg?maxAge=2592000)](https://www.npmjs.com/package/hubot-versions)
# hubot-versions

A Hubot Script for identifying the current versions of the bot and all dependency scripts.

## Getting Started
* [Installation](#installation)
* [Dependencies](#dependencies)
* [License](#license)
* [Contribute](#contribute)

## Installation
```
npm install -S hubot-versions
```

Then add `"hubot-versions"` to your bot's `external-scripts.json`.

## Dependencies

This script emits the version results as the event `ibmcloud.formatter`, which is a listener from `hubot-ibmcloud-formatter`.

## License

See [LICENSE.txt](https://github.com/ibm-cloud-solutions/hubot-versions/blob/master/LICENSE.txt) for license information.

## Contribute

Please check out our [Contribution Guidelines](https://github.com/ibm-cloud-solutions/hubot-versions/blob/master/CONTRIBUTING.md) for detailed information on how you can lend a hand.
