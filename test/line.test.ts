"use strict";

import { Line } from "../src/common/line";
const config = require("../../test/config.json");


suite("line test", () => {
    test("send a message", () => {
        const client = new Line({
            channelAccessToken: config.channelAccessToken,
            channelSecret: config.channelSecret
        });
        // return client.send(config.groupId, "はろ～");
    });
});
