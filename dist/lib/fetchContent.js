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
import { baseContentEndpoint } from "./routes.js";
const acceptedFilesMap = [".avi", ".mp4", ".mkv"];
const fetchContent = () => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield fetch(baseContentEndpoint);
    return content.text();
});
const sampleFilter = (urls) => {
    return urls.filter((url) => !url.includes("sample"))[0];
};
export const getContentUrls = (urls) => __awaiter(void 0, void 0, void 0, function* () {
    const urlValues = yield Promise.all(urls.map((data) => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield fetch(`${baseContentEndpoint}${data}`);
        const d = yield res.text();
        const regEx = JSON.stringify(d).replace(/\\/g, "");
        const extract = regEx.split("<a href=");
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
            if (removeQuotes === "<!doctype html>n<html lang=") {
                return;
            }
            const returnValue = removeQuotes.replace("content", "public");
            return returnValue;
        }
    })));
    return urlValues.reduce((ac, el) => {
        if (el !== undefined) {
            ac.push(el);
        }
        return ac;
    }, []);
});
export const getList = () => __awaiter(void 0, void 0, void 0, function* () {
    const test = yield fetchContent();
    const data = JSON.stringify(test);
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
});
