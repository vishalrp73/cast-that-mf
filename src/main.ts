import ChromecastAPI from "chromecast-api";
import {
  getContentUrls,
  getList,
  promptFilm,
  CEASE_FIRE,
  promptController,
} from "./lib/index.js";

const TARGET_CHROMECAST = "Vishal-CHR";

const main = async () => {
  const client = new ChromecastAPI();

  client.on("device", async (device) => {
    if (device.friendlyName === TARGET_CHROMECAST) {
      const list = await getList();
      const contentURLs = await getContentUrls(list);
      const media = await promptFilm(contentURLs);

      device.play(media, (err) => {
        if (err) return console.error("suka", err);

        if (!CEASE_FIRE) promptController(device);
      });
    }
  });
};

main();
