const ffTime = 30;
const revTime = 30;
export const controls = (device, answer) => {
    switch (answer) {
        case "p": {
            console.log("pausing");
            device.pause();
            break;
        }
        case "o": {
            console.log("resuming");
            device.resume();
            break;
        }
        case "k": {
            console.log("stopping");
            device.stop();
            break;
        }
        case "m": {
            console.log(`fast-forward: ${ffTime}secs`);
            device.seek(ffTime);
            break;
        }
        case "n": {
            // to do: fix the reverse functionality
            console.log("this don't work brah");
            //   console.log(`reversing: ${revTime}`);
            break;
        }
        case "c": {
            // to do: figure this shit out
            console.log("need to figure this out brah");
            //   console.log("captions on");
            break;
        }
        case "x": {
            console.log("captions off");
            device.subtitlesOff();
            break;
        }
        default: {
            console.log("invalid answer");
            break;
        }
    }
};
