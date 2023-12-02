var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from "inquirer";
import { baseContentEndpoint } from "./routes.js";
import { subtitlesConfig } from "./subs.js";
export const promptFilm = (choices) => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield inquirer.prompt({
        type: "list",
        message: "choose",
        choices,
        name: "chosen_film",
    });
    const { chosen_film } = answers;
    const media = {
        url: `${baseContentEndpoint}${chosen_film}`,
        subtitles_style: subtitlesConfig,
    };
    return media;
});
