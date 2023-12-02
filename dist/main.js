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
import { getContentUrls, getList, promptFilm, } from "./lib/index.js";
import { CEASE_FIRE, promptController } from "./lib/promptController.js";
const TARGET_CHROMECAST = "Vishal-CHR";
// let CEASE_FIRE: boolean = false;
// const promptController = async (device: Device) => {
//   const answer: Answers = await inquirer.prompt({
//     type: "input",
//     message: "wot",
//     name: "u_wot",
//   });
//   const stringifiedAnswer: string = answer.u_wot.toLowerCase();
//   controller(device, stringifiedAnswer);
//   if (!CEASE_FIRE) {
//     promptController(device);
//   }
// };
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new ChromecastAPI();
    client.on("device", (device) => __awaiter(void 0, void 0, void 0, function* () {
        if (device.friendlyName === TARGET_CHROMECAST) {
            const list = yield getList();
            const contentURLs = yield getContentUrls(list);
            const media = yield promptFilm(contentURLs);
            device.play(media, (err) => {
                if (err)
                    return console.error("suka", err);
                if (!CEASE_FIRE)
                    promptController(device);
            });
        }
    }));
});
main();
