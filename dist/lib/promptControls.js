var Answers;
(function (Answers) {
    Answers["PlayPause"] = " ";
    Answers["Stop"] = "s";
    Answers["CaptionsToggle"] = "c";
    Answers["Mute"] = "m";
    Answers["Exit"] = "q";
    Answers["Forward"] = "l";
    Answers["Back"] = "k";
})(Answers || (Answers = {}));
export const controller = (device, answer) => {
    switch (answer) {
        case Answers.PlayPause: {
            device.getStatus((err, status) => {
                if (err || status === undefined)
                    return console.error("err", err);
                const { playerState } = status;
                if (playerState === "BUFFERING")
                    return;
                if (playerState === "PLAYING")
                    return device.pause();
                if (playerState === "PAUSED")
                    return device.resume();
            });
            break;
        }
        case Answers.Stop: {
            console.log("stopping...");
            device.stop();
            break;
        }
        case Answers.Mute: {
            device.getVolume((err, volume) => {
                if (err || volume === undefined)
                    return console.error("err", err);
                if (volume.muted) {
                    device.setVolumeMuted(false);
                    return;
                }
                device.setVolumeMuted(true);
            });
            break;
        }
        case Answers.Exit: {
            device.close();
            /**
             * so the exit doesn't immediately
             * fire and disrupt the disconnect
             */
            setTimeout(() => {
                process.exit();
            }, 5000);
        }
        default: {
            console.log("input invalid");
            break;
        }
    }
};
