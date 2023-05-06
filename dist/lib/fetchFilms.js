var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { baseContentEndpoint } from "./routes.js";
import fetch from "node-fetch";
const fetchFilms = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetch(baseContentEndpoint)
        .then((r) => r.text())
        .catch((err) => console.error("suka", err));
});
const sampleFilter = (urls) => {
    return urls.filter((url) => !url.includes("sample"))[0];
};
const acceptedFilesMap = [".avi", ".mp4", ".mkv"];
export const getContentUrls = (urls) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Promise.all(urls.map((data) => __awaiter(void 0, void 0, void 0, function* () {
        return yield fetch(`${baseContentEndpoint}${data}`)
            .then((r) => r.text())
            .then((d) => {
            const data = JSON.stringify(d).replace(/\\/g, "");
            const extract = data.split("<a href=");
            const filtered = [];
            extract.forEach((ext) => {
                acceptedFilesMap.forEach((type) => {
                    if (ext.includes(type)) {
                        filtered.push(ext);
                    }
                });
            });
            const contentEl = sampleFilter(filtered);
            if (contentEl === undefined)
                return;
            const match = contentEl.match(/"(.*?)"/g);
            if (match) {
                const removeQuotes = match[0].replace(/"/g, "");
                if (removeQuotes.includes("<!doctype html>"))
                    return;
                return removeQuotes.replace("content", "public");
            }
            return;
        })
            .catch((err) => console.error("suka", err));
    })));
});
export const getList = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetchFilms().then((r) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.stringify(r);
        const extract = data.split("<li>").slice(1);
        const removedBackslashes = extract.map((item) => item.replace(/\\/g, ""));
        const urls = removedBackslashes.flatMap((item) => item.match(/<a href="(.*?)"/g));
        const cleanURLs = urls.flatMap((url) => {
            if (url) {
                const match = url.match(/"(.*?)"/g);
                if (match) {
                    return match[0].replace(/"/g, "");
                }
            }
        });
        return cleanURLs;
    }));
});
