# hubot-versions

A Hubot Script for identifying the current versions of the bot and all dependency scripts.

## Getting Started
* [Installation](#installation)
* [Dependencies](#dependencies)
* [License](#license)
* [Contribute](#contribute)

## Installation <a id="installation"></a>
```
npm install -S hubot-versions
```

Then add `"hubot-versions"` to your bot's `external-scripts.json`.

## Dependencies <a id="dependencies"></a>

This script emits the version results as the event `ibmcloud.formatter`, which is a listener from `hubot-ibmcloud-formatter`.

## License <a id="license"></a>

See [LICENSE.txt](./LICENSE.txt) for license information.

## Contribute <a id="contribute"></a>

Please check out our [Contribution Guidelines](./CONTRIBUTING.md) for detailed information on how you can lend a hand.
