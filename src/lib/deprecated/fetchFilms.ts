/**
 * @deprecated DO NOT USE
 */

import { baseContentEndpoint } from "../routes.js";
import fetch from "node-fetch";

const fetchFilms = async () => {
  return await fetch(baseContentEndpoint)
    .then((r) => r.text())
    .catch((err) => console.error("suka", err));
};

const sampleFilter = (urls: string[]): string => {
  return urls.filter((url) => !url.includes("sample"))[0];
};

const acceptedFilesMap: string[] = [".avi", ".mp4", ".mkv"];

export const getContentUrls = async (urls: (string | undefined)[]) => {
  return await Promise.all(
    urls.map(async (data) => {
      return await fetch(`${baseContentEndpoint}${data}`)
        .then((r) => r.text())
        .then((d) => {
          const data = JSON.stringify(d).replace(/\\/g, "");
          const extract = data.split("<a href=");
          const filtered: string[] = [];
          extract.forEach((ext) => {
            acceptedFilesMap.forEach((type) => {
              if (ext.includes(type)) {
                filtered.push(ext);
              }
            });
          });
          const contentEl = sampleFilter(filtered);
          if (contentEl === undefined) return;
          const match = contentEl.match(/"(.*?)"/g);
          if (match) {
            const removeQuotes = match[0].replace(/"/g, "");
            if (removeQuotes.includes("<!doctype html>")) return;
            return removeQuotes.replace("content", "public");
          }
          return;
        })
        .catch((err) => console.error("suka", err));
    })
  );
};

export const getList = async () => {
  return await fetchFilms().then(async (r) => {
    const data = JSON.stringify(r);
    const extract = data.split("<li>").slice(1);
    const removedBackslashes = extract.map((item) => item.replace(/\\/g, ""));
    const urls = removedBackslashes.flatMap((item) =>
      item.match(/<a href="(.*?)"/g)
    );
    const cleanURLs = urls.flatMap((url) => {
      if (url) {
        const match = url.match(/"(.*?)"/g);
        if (match) {
          return match[0].replace(/"/g, "");
        }
      }
    });
    return cleanURLs;
  });
};
