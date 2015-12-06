module.exports = function(p1, p2) {
    this.id = Math.floor(Math.random() * 1000);
    this.p1 = p1;
    this.p2 = p2;
    this.inProgress = true;
    this.winner = null;
    this.loser = null;
};