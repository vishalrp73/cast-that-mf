/**
 * @deprecated DO NOT USE
 */
const ffTime = 30;
const revTime = 30;
export const controls = (device, answer) => {
    device.on("status", (s) => console.log(s));
    console.log(device.getReceiverStatus());
    console.log(device.getStatus());
    switch (answer) {
        case "s": {
            console.log("status");
            const playerStatus = device.getStatus((s) => console.log(s));
            console.log(playerStatus);
            const receiverStatus = device.getReceiverStatus((s) => console.log(s));
            console.log(receiverStatus);
            break;
        }
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
