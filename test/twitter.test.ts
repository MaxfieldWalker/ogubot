"use strict";

import { Twitter } from "../src/common/twitter";
const config = require("../../test/config.json");

suite("twitter test", () => {
    test("get user tweets", () => {
        const client = new Twitter("ishidanaoto_kun", {
            consumer_key: config.consumer_key,
            consumer_secret: config.consumer_secret,
            access_token: config.access_token,
            access_token_secret: config.access_token_secret
        });
        return client.getTweets(10)
            .then(result => {
                const tweets = result.data;
                const texts = tweets;
                console.log(texts);
            });
    });
});
