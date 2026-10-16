// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'library-mayhem',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'Library Mayhem',            // the name players will see
  team: 'Team 12 (3-2)',            // your group's name and section, for example Bookworms (3-1)
  developer: 'janaisahda-cmd',       // YOUR GitHub username: this build is yours
  description: 'Players move around the library, complete tasks by answering questions, earn Stars, and try to lower the Chaos Meter.',     // one sentence about how the game is played
  min_players: 2,               // change to the limits your game is designed for
  max_players: 15,
  version: pkg.version,         // read from package.json, do not edit here
};
