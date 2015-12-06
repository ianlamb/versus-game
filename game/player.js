var Character = require('./character');

module.exports = function(name) {
    this.id = Math.floor(Math.random() * 1000);
    this.name = name;
    this.characters = [new Character('Uther')];
};