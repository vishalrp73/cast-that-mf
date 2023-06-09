var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from "node-fetch";
import { baseContentEndpoint } from "../lib/routes.js";
export const fetchFilms = () => __awaiter(void 0, void 0, void 0, function* () {
    return fetch(baseContentEndpoint)
        .then((res) => {
        return res.text();
    })
        .catch((err) => console.log("fuck", err));
});
export const getList = () => __awaiter(void 0, void 0, void 0, function* () {
    return fetchFilms().then((r) => {
        const data = JSON.stringify(r);
        const extract = data.split("<li>").slice(1);
        const removedBackslashes = extract.map((item) => item.replace(/\\/g, ""));
        const urls = removedBackslashes.flatMap((item) => item.match(/<a href="(.*?)"/g));
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
});
// accepted file formats: .avi | .mp4 | .mkv
const sampleFilter = (urls) => {
    return urls.filter((url) => !url.includes("sample"))[0];
};
const acceptedFilesMap = [".avi", ".mp4", ".mkv"];
export const getContentUrl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    return fetch(`${baseContentEndpoint}${url}`)
        .then((res) => res.text())
        .then((text) => {
        const data = JSON.stringify(text).replace(/\\/g, "");
        const extract = data.split("<a href=");
        const filtered = [];
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
});
