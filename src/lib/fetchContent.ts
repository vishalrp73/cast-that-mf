import fetch from "node-fetch";
import { baseContentEndpoint } from "./routes.js";

const acceptedFilesMap: string[] = [".avi", ".mp4", ".mkv"];

const fetchContent = async () => {
  const content = await fetch(baseContentEndpoint);
  return content.text();
};

const sampleFilter = (urls: string[]): string => {
  return urls.filter((url) => !url.includes("sample"))[0];
};

export const getContentUrls = async (urls: (string | undefined)[]) => {
  const urlValues = await Promise.all(
    urls.map(async (data) => {
      const res = await fetch(`${baseContentEndpoint}${data}`);
      const d = await res.text();
      const regEx = JSON.stringify(d).replace(/\\/g, "");
      const extract = regEx.split("<a href=");
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
        if (removeQuotes === "<!doctype html>n<html lang=") {
          return;
        }
        const returnValue = removeQuotes.replace("content", "public");
        return returnValue;
      }
    })
  );

  return urlValues.reduce((ac: string[], el) => {
    if (el !== undefined) {
      ac.push(el);
    }
    return ac;
  }, []);
};

export const getList = async () => {
  const test = await fetchContent();
  const data = JSON.stringify(test);
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
};
