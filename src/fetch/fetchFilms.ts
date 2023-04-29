import fetch from "node-fetch";
import { baseContentEndpoint } from "../lib/routes.js";

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

// accepted file formats: .avi | .mp4 | .mkv

const sampleFilter = (urls: string[]): string => {
  return urls.filter((url) => !url.includes("sample"))[0];
};

const acceptedFilesMap: string[] = [".avi", ".mp4", ".mkv"];

export const getContentUrl = async (url: string): Promise<string> => {
  return fetch(`${baseContentEndpoint}${url}`)
    .then((res) => res.text())
    .then((text) => {
      const data = JSON.stringify(text).replace(/\\/g, "");
      const extract = data.split("<a href=");
      const filtered: string[] = [];
      extract.forEach((ext) => {
        acceptedFilesMap.forEach((type) => {
          if (ext.includes(type)) {
            filtered.push(ext);
          }
        });
      });
      const contentElement = sampleFilter(filtered);
      const match = contentElement.match(/"(.*?)"/g);
      if (match) {
        return match[0].replace(/"/g, "");
      }
      return "invalid";
    })
    .catch((err) => {
      console.error("blyat", err);
      return "error";
    });
};
