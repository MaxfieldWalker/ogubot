"use strict";

import * as phantom from "phantom";
import * as path from "path";

export async function capture(htmlContent: string, unixTimeStamp: number): Promise<string> {
    // Lambda環境ではLinux用バイナリを読み込むようにする
    const phantomPath = process.platform === "win32"
        ? "phantomjs.exe"
        : "/tmp/phantomjs-prebuilt/lib/phantom/bin/phantomjs";
    console.log("Using phantomjs at ", phantomPath);

    const instance = await (phantom as any).create([], {
        phantomPath: phantomPath
    }) as phantom.PhantomJS;
    const page = await instance.createPage();
    const userAgent = "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36";
    (page as any).setting("userAgent", userAgent);

    // コンテンツを読み込み
    await page.setContent(htmlContent, "");
    // Twitterのウィジェット描画スクリプトを読み込み
    await page.includeJs("http://platform.twitter.com/widgets.js");

    const saveDir: string = process.platform === "win32" ? "./screenshots" : "/tmp/screenshots";
    const name = `screenshot.${unixTimeStamp}.png`;
    const savePath = path.join(saveDir, name);

    // ページがレンダリングされるのを待つ
    await new Promise(resolve => setTimeout(() => resolve(), 5000));

    // スクショを保存
    await page.render(savePath);
    // PhantomJSを終了
    instance.exit();

    return savePath;
}
