Controls = function() {
    var power = 0;
    var strict = 0;
    var start = 0;

    this.togglePower = function() {
        if (false === this.hasPowerOn()) {
            power = 1;
            start = 0;
            strict = 0;
            return;
        }
        power = 0;
    };
    this.hasPowerOn = function() {
        return 1 === power;
    };

    this.toggleStrict = function() {
        strict = 0 === strict ? 1 : 0;
    };

    this.hasStrictOn = function() {
        return 1 === strict;
    };

    this.start = function() {
        start = 1;
    };

    this.isStarted = function() {
        return 1 === start;
    };
};
