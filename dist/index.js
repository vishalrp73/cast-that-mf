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
import { subtitlesConfig } from "./lib/subs.js";
import { getList as testList, getContentUrls } from "./lib/fetchFilms.js";
import inquirer from "inquirer";
import { baseContentEndpoint } from "./lib/routes.js";
import { controls } from "./lib/controls.js";
const client = new ChromecastAPI();
let ceaseFire = false;
const prompt = (device) => {
    inquirer
        .prompt({
        type: "input",
        message: "u_wot",
        name: "u_wot",
    })
        .then((answer) => {
        const { u_wot } = answer;
        if (u_wot === "q") {
            console.log("exiting");
            ceaseFire = true;
            device.close();
            return;
        }
        controls(device, u_wot);
        if (!ceaseFire) {
            prompt(device);
        }
    });
};
client.on("device", (device) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("we really out hurr");
    console.log(device);
    if (device.friendlyName === "Vishal-CHR") {
        console.log("yo mon we found da chromecast");
        yield testList()
            .then((r) => r)
            .then((d) => {
            getContentUrls(d)
                .then((res) => {
                const filtered = res.filter((res) => res !== undefined);
                //   const trimmed = filtered.map((url) => {
                //     if (url) {
                //       const trim = url.slice(1);
                //       const match = trim.match(/\/(.*)/);
                //       if (match) return match[0];
                //       return;
                //     }
                //     return;
                //   });
                inquirer
                    .prompt({
                    // assigning `list` to `type` causes a TypeError ???
                    // @ts-expect-error
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
