import inquirer from "inquirer";
import { baseContentEndpoint } from "./routes.js";
import { MediaResource } from "chromecast-api/lib/device";
import { subtitlesConfig } from "./subs.js";

export const promptFilm = async (choices: string[]) => {
  const answers = await inquirer.prompt({
    type: "list",
    message: "choose",
    choices,
    name: "chosen_film",
  });

  const { chosen_film } = answers;
  const media: MediaResource = {
    url: `${baseContentEndpoint}${chosen_film}`,
    subtitles_style: subtitlesConfig,
  };

  return media;
};
