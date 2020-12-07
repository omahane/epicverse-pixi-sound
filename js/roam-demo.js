var manifest = {
    roam1: "../media/01-roam-00-closer-than-before.mp3",
    roam2: "../media/02-mountain.mp3",
    roam3: "../media/03-four-legs-good-two-legs-bad.mp3",
    roam4: "../media/04-found.mp3",
    roam5: "../media/05-roam-epilogue.mp3",
    
};

for (var name in manifest) {
    PIXI.Loader.shared.add(name, manifest[name]);
}

PIXI.Loader.shared.load(function(loader, resources) {
    var plays = document.querySelectorAll("button[data-sound]");
    for (var i = 0; i < plays.length; i++) {
        var button = plays[i];
        var alias = button.getAttribute("data-sound");
        var sound = resources[alias].sound;
        if ("ontouchstart" in window) {
            button.addEventListener("touchstart", play, false);
        }
        else {
            button.addEventListener("mousedown", play, false);
        }
    }
});

function play() {
    var button = this;
    var sound = PIXI.Loader.shared.resources[button.getAttribute("data-sound")].sound;
    var loop = !!button.getAttribute("data-loop");
    var playing = !parseInt(button.getAttribute("data-playing"), 10);
    if (loop) {
        togglePlaying(button);
        sound.stop();
        progressBar(button, 0);
    }
    if (playing) {
        var instance = sound.play({
            loop: loop,
            singleInstance: loop,
        });
        instance.on("progress", function(progress, duration) {
            progressBar(button, progress);
        });
        instance.on("end", function() {
            progressBar(button, 0);
        });
    }
}

function togglePlaying(button) {
    var playing = !parseInt(button.getAttribute("data-playing"), 10);
    button.className = button.className.replace(/ (play|stop) btn\-(info|default)/, "");
    button.className += playing ? " stop btn-info" : " play btn-default";
    button.setAttribute("data-playing", playing ? 1 : 0);
}

function progressBar(button, progress) {
    var bar = button.querySelector(".progress-bar");
    bar.style.width = (progress * 100) + "%";
}

document.querySelector("#volume").addEventListener("input", function() {
    PIXI.sound.volumeAll = Math.max(0,
        Math.min(1, parseFloat(this.value)),
    );
});
// TODO: get volume by clip working (because these are not)
document.querySelector("#volume-roam1").addEventListener("input", function() {
    console.log("trying to change the volume on roam1");
    PIXI.sound.volume(roam1) = Math.max(0,
        Math.min(1, parseFloat(this.value)),
    );
});
// TODO: get volume by clip working (because these are not)
document.querySelector("#volume-roam2").addEventListener("input", function() {
    PIXI.sound.volume("#roam2") = Math.max(0,
        Math.min(1, parseFloat(this.value)),
    );
});


document.querySelector("#speed").addEventListener("input", function() {
    PIXI.sound.speedAll = Math.max(0,
        Math.min(1, parseFloat(this.value)),
    );
});

document.querySelector("#stop").addEventListener("click", function() {
    PIXI.sound.stopAll();
    var plays = document.querySelectorAll("button[data-sound]");
    for (var i = 0; i < plays.length; i++) {
        var button = plays[i];
        if (button.getAttribute("data-playing") === "1") {
            togglePlaying(button);
        }
        progressBar(button, 0);
    }
});

document.querySelector("#paused").addEventListener("click", function() {
    var paused = PIXI.sound.togglePauseAll();
    this.className = this.className.replace(/\b(on|off)/g, "");
    this.className += paused ? "on" : "off";
});

document.querySelector("#muted").addEventListener("click", function() {
    var muted = PIXI.sound.toggleMuteAll();
    this.className = this.className.replace(/ (on|off)/g, " ");
    this.className += muted ? "on" : "off";
});

hljs.initHighlightingOnLoad();
