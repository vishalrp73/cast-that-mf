import Device from "chromecast-api/lib/device";

enum Answers {
  PauseResume = " ", // space key
  Stop = "s",
  CaptionsToggle = "c",
  Mute = "m",
  Exit = "q",
  Forward = "l",
  Back = "k",
}

const ffTime = 30;
const revTime = 30;

export const controller = (device: Device, answer: string) => {
  switch (answer) {
    /* Pause and Resume (" ") */
    case Answers.PauseResume: {
      device.getStatus((err, status) => {
        if (err || status === undefined) return console.error("err", err);

        const { playerState } = status;
        if (playerState === "BUFFERING") return;
        if (playerState === "PLAYING") return device.pause();
        if (playerState === "PAUSED") return device.resume();
      });
      break;
    }
    /* Stop ("s") */
    case Answers.Stop: {
      console.log("stopping...");
      device.stop();
      break;
    }
    /* Mute ("m") */
    case Answers.Mute: {
      device.getVolume((err, volume) => {
        if (err || volume === undefined) return console.error("err", err);

        if (volume.muted) {
          device.setVolumeMuted(false);
          return;
        }

        device.setVolumeMuted(true);
      });
      break;
    }
    /* Fast-Forward ("l") */
    case Answers.Forward: {
      device.seek(ffTime);
      break;
    }
    /* Rewind ("k") */
    case Answers.Back: {
      device.getCurrentTime((err, time) => {
        if (err || time === undefined) return console.error("err", err);
        const seekTo = time - revTime;
        device.seekTo(seekTo);
      });
      break;
    }
    /* Disconnect and quit program ("q") */
    case Answers.Exit: {
      device.close();
      /**
       * so the exit doesn't immediately
       * fire and disrupt the disconnect
       */
      setTimeout(() => {
        process.exit();
      }, 5000);
      break;
    }
    /* User input invalid */
    default: {
      console.log("input invalid");
      break;
    }
  }
};
