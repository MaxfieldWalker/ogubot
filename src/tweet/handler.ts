"use strict";

import { capture } from "../common/capture";
import { exec } from "child_process";

export async function handler(event, context, callback) {
    // callbackを呼ばない限り終了しないようにする
    context.callbackWaitsForEmptyEventLoop = false;
    const commands = [
        // fontconfigを/tmpにコピー
        "cp -r fontconfig /tmp",
        // fc-cacheに実行権限を与える
        "chmod +x /tmp/fontconfig/usr/bin/fc-cache",
        // phantomjsを/tmpにコピー
        "cp -r phantomjs-prebuilt/ /tmp",
        // phantomjsに実行権限を与える
        "chmod +x /tmp/phantomjs-prebuilt/lib/phantom/bin/phantomjs",
        // phantomjsのバージョン確認
        "/tmp/phantomjs-prebuilt/lib/phantom/bin/phantomjs -v",
        // fc-cacheの実行
        "/tmp/fontconfig/usr/bin/fc-cache -fs"
    ];

    exec(commands.join("; "), (err, stdout, stderr) => {
        console.log(err, stdout, stderr);

        exec("LD_LIBRARY_PATH=/tmp/fontconfig/usr/lib/ node dist/src/tweet/main.js", (err, stdout, stderr) => {
            console.log(err, stdout, stderr);

            callback(undefined, "Finished");
        });
    });
}
