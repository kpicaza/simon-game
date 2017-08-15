
ToneMaker = function(frequencies) {
    var audioContext;
    var tones;
    var gains;
    var ramp = 0.05;
    var vol = 0.8;
    var construct = function(aFrequencies) {
        audioContext = new AudioContext();
        tones = aFrequencies.map(function(freq) {
            var tone = audioContext.createOscillator();
            tone.frequency.value = freq;
            tone.start(0.0);

            return tone;
        });
        gains = tones.map(function(tone) {
            var gain = audioContext.createGain();
            tone.connect(gain);
            gain.connect(audioContext.destination);
            gain.gain.value = 0;
            return gain;
        });
    };
    construct(frequencies);

    this.play = function(index) {
        gains[index].gain.linearRampToValueAtTime(
            vol,
            audioContext.currentTime + ramp
        );
    };

    this.pause = function(index) {
        gains[index].gain.linearRampToValueAtTime(
            0,
            audioContext.currentTime + ramp
        );
    };

    return this;
};
