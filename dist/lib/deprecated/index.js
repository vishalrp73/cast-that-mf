/**
 * @deprecated DO NOT USE
 */
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
import { subtitlesConfig } from "../subs.js";
import { getList as testList, getContentUrls } from "./fetchFilms.js";
import inquirer from "inquirer";
import { baseContentEndpoint } from "../routes.js";
import { controls } from "./controls.js";
const client = new ChromecastAPI();
let ceaseFire = false;
const prompt = (device) => {
    // device.on("status", (s) => console.log(s));
    inquirer
        .prompt({
        type: "input",
        message: "u_wot",
        name: "u_wot",
    })
        .then((answer) => {
        // device.on("status", (s) => console.log(s));
        const { u_wot } = answer;
        // if (u_wot === "q") {
        //   console.log("exiting");
        //   ceaseFire = true;
        //   device.close();
        //   process.exit();
        // }
        controls(device, u_wot);
        if (!ceaseFire) {
            prompt(device);
        }
    });
};
client.on("device", (device) => __awaiter(void 0, void 0, void 0, function* () {
    if (device.friendlyName === "Vishal-CHR") {
        console.log("yo mon we found da chromecast");
        yield testList()
            .then((r) => r)
            .then((d) => {
            getContentUrls(d)
                .then((res) => {
                const filtered = res.reduce((ac, el) => {
                    if (el !== undefined) {
                        ac.push(el);
                    }
                    return ac;
                }, []);
                inquirer
                    .prompt({
                    // assigning `list` to `type` causes a TypeError ???
                    type: "list",
                    message: "choose",
                    choices: filtered,
                    name: "chosen_film",
                })
                    .then((answer) => {
                    const { chosen_film } = answer;
                    console.log(`${baseContentEndpoint}${chosen_film}`);
                    const media = {
                        url: `${baseContentEndpoint}${chosen_film}`,
                        subtitles_style: subtitlesConfig,
                    };
                    device.play(media, (err) => {
                        if (err)
                            return console.error("suka", err);
                        console.log("we streaming da ting bruv");
                        // device.on("status", (s) => console.log(s));
                        if (!ceaseFire)
                            prompt(device);
                    });
                })
                    .catch((err) => console.error("fuck", err));
            })
                .catch((err) => console.error("suka", err));
        })
            .catch((err) => console.error("blyat", err));
    }
}));
