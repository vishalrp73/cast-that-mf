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
import { controller } from "./controller.js";
export let CEASE_FIRE = false;
export const promptController = (device) => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield inquirer.prompt({
        type: "input",
        message: "wot",
        name: "u_wot",
    });
    const stringifiedAnswer = answer.u_wot.toLowerCase();
    controller(device, stringifiedAnswer);
    if (!CEASE_FIRE) {
        promptController(device);
    }
});
