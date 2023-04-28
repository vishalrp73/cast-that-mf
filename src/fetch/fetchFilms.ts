import fetch from "node-fetch";
const baseContentEndpoint = "http://192.168.1.109:3000";

export const fetchFilms = async () => {
  return fetch(baseContentEndpoint)
    .then((res) => {
      return res.text();
    })
    .catch((err) => console.log("fuck", err));
};

export const getList = async () => {
  return fetchFilms().then((r) => {
    const data = JSON.stringify(r);
    const extract = data.split("<li>").slice(1);
    const removedBackslashes = extract.map((item) => item.replace(/\\/g, ""));
    const urls = removedBackslashes.flatMap((item) =>
      item.match(/<a href="(.*?)"/g)
    );
    const cleanUrls = urls.flatMap((url) => {
      if (url) {
        const match = url.match(/"(.*?)"/g);
        if (match) {
          return match[0].replace(/"/g, "");
        }
      }
    });
    return cleanUrls;
  });
};

export const getContentUrl = async (url: string) => {
  fetch(`${baseContentEndpoint}${url}`)
    .then((res) => res.text())
    .then((text) => console.log(text))
    .catch((err) => console.error("blyat", err));
};
