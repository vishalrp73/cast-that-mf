import inquirer, { Answers } from "inquirer";
import { controller } from "./controller.js";
import Device from "chromecast-api/lib/device";

export let CEASE_FIRE: boolean = false;

export const promptController = async (device: Device) => {
  const answer: Answers = await inquirer.prompt({
    type: "input",
    message: "wot",
    name: "u_wot",
  });

  const stringifiedAnswer: string = answer.u_wot.toLowerCase();

  controller(device, stringifiedAnswer);

  if (!CEASE_FIRE) {
    promptController(device);
  }
};
