var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ChromecastAPI from "chromecast-api";
import inquirer from "inquirer";
import { subtitlesConfig } from "./lib/subs.js";
import { getContentUrl, getList } from "./fetch/fetchFilms.js";
import { baseContentEndpoint } from "./lib/routes.js";
const client = new ChromecastAPI();
const ffTime = 30;
const revTime = 30;
let ceaseFire = false;
const exitCode = (device) => {
    console.log("exiting");
    ceaseFire = true;
    device.close();
};
const prompt = (device) => {
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
const switchBoard = (device, answer) => {
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
films.then((films) => {
    if (films === undefined || films.length === 0) {
        console.error("no connection, or no films found");
        return;
    }
    inquirer
        .prompt({
        // assigning `'list` to `type` causes TypeError ???
        // @ts-expect-error
        type: "list",
        message: "choose",
        choices: films,
        name: "chosen_film",
    })
        .then((answer) => __awaiter(void 0, void 0, void 0, function* () {
        const { chosen_film } = answer;
        const contentUrl = yield getContentUrl(chosen_film);
        if (contentUrl === "invalid" || contentUrl === "error") {
            console.log("error occurred");
            return;
        }
        client.on("device", (device) => {
            console.log(device);
            if (device.friendlyName === "Vishal-CHR") {
                console.log("yo mon we found da caster");
                console.log(contentUrl);
                const media = {
                    url: `${baseContentEndpoint}${contentUrl}`,
                    //   subtitles: [
                    //     {
                    //       language: "en-US",
                    //       url: "",
                    //       name: "English",
                    //     },
                    //   ],
                    subtitles_style: subtitlesConfig,
                };
                console.log(media.url);
                device.play(media, function (err) {
                    if (err) {
                        console.error("blyat", err);
                        return;
                    }
                    if (!err)
                        console.log("Playing on da chromecast");
                    if (!ceaseFire) {
                        prompt(device);
                    }
                });
            }
        });
    }))
        .catch((err) => console.error("nah g", err));
});
