import ChromecastAPI from "chromecast-api";
import inquirer from "inquirer";
import Device, { MediaResource } from "chromecast-api/lib/device";
import { subtitlesConfig } from "./lib/subs.js";
import { films_db } from "./lib/films.js";
import { fetchFilms, getContentUrl, getList } from "./fetch/fetchFilms.js";

const client = new ChromecastAPI();
const ffTime = 30;
const revTime = 30;
let ceaseFire: boolean = false;

const filmInScope = films_db.americanPsycho;

const media: MediaResource = {
  url: filmInScope,
  //   subtitles: [
  //     {
  //       language: "en-US",
  //       url: "",
  //       name: "English",
  //     },
  //   ],
  subtitles_style: subtitlesConfig,
};

type Answers =
  | "q" /* quit */
  | "p" /* play */
  | "o" /* resume */
  | "k" /* stop  */
  | "m" /*  */
  | "n" /*  */
  | "c" /* captions on */
  | "x"; /* captions off */

const exitCode = (device: Device) => {
  console.log("exiting");
  ceaseFire = true;
  device.close();
};

const prompt = (device: Device) => {
  inquirer
    .prompt({
      type: "input",
      message: "u wot",
      name: "u_wot",
    })
    .then((answer) => {
      const { u_wot } = answer;
      switchBoard(device, u_wot);

      if (!ceaseFire) {
        prompt(device);
      }
    })
    .catch((err) => console.log("suka", err));
};

const switchBoard = (device: Device, answer: Answers) => {
  switch (answer) {
    case "q": {
      exitCode(device);
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

const films = Promise.resolve(getList());

const getFilmUrl = (href: string) => {
  console.log(href);
  // ping page and get file href
  const url = getContentUrl(href);
};

const chooseFilm = (films: any) => {
  inquirer
    .prompt({
      type: "list",
      message: "choose",
      choices: films,
      name: "chosen_film",
    })
    .then((answer) => {
      const { chosen_film } = answer;
      console.log(chosen_film);
      const contentUrl = getFilmUrl(chosen_film);
      console.log(contentUrl);
    })
    .catch((err) => console.error("nah g", err));
};

films.then((films) => {
  if (films === undefined || films.length === 0) {
    console.error("no connection, or no films found");
    return;
  }

  chooseFilm(films);

  //   client.on("device", (device) => {
  //     if (device.friendlyName === "Vishal-CHR") {
  //       console.log("yo mon we found da caster");
  //       console.log(films);
  //       device.play(media, function (err) {
  //         if (!err) console.log("Playing on da chromecast");
  //         if (!ceaseFire) {
  //           prompt(device);
  //         }
  //       });
  //     }
  //   });
});
