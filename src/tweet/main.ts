"use strict";

import { Twitter, TweetInfo, TweetData } from "../common/twitter";
import { Line } from "../common/line";
import * as moment from "moment";
import axios from "axios";
import { capture } from "../common/capture";
import s3 = require("aws-sdk/clients/s3");
import * as path from "path";
import * as fs from "fs";
const config = require("../../../test/config.json");

export async function ogubot(): Promise<void> {
    const tweetCount = 10;
    const thresholdMinutes = 60;
    const twitterUserId = config.twitterUserId;

    const client = new Twitter(twitterUserId, {
        consumer_key: config.consumer_key,
        consumer_secret: config.consumer_secret,
        access_token: config.access_token,
        access_token_secret: config.access_token_secret
    });

    const tweets = (await client.getTweets(tweetCount)).data;

    // 最近のツイートを取り出す
    const recentTweets = tweets
        .filter(x => moment().diff(moment(new Date(x.created_at)), "minutes") <= thresholdMinutes);

    if (recentTweets.length > 0) {
        // ツイートを古い順に並び替える
        const sorted = recentTweets.sort((a, b) => moment(new Date(a.created_at)).diff(moment(new Date(b.created_at)), "seconds"))

        try {
            const getTweetScreenshotPromises = sorted.map(async (t): Promise<TweetData> => {
                // それぞれのツイートをHTMLに変換する
                const response = await axios.get("https://publish.twitter.com/oembed", {
                    params: {
                        url: `https://twitter.com/${twitterUserId}/status/${t.id_str}`,
                        lang: "ja"
                    }
                });

                // スクショを撮る
                const savePath = await capture(response.data.html as string, moment(new Date(t.created_at)).unix());
                // スクショをアップロードする
                const upload = await new s3().upload({
                    Bucket: "ogubot",
                    Key: `screenshots/${path.basename(savePath)}`,
                    Body: fs.createReadStream(savePath),
                    ACL: "public-read"
                }).promise();
                // スクショのURLを返す
                return {
                    ...t,
                    screenshotUrl: upload.Location
                };
            });

            const tweetData = await Promise.all(getTweetScreenshotPromises);
            tweetData.forEach(t => console.log(t.screenshotUrl));

            // LINEに画像を送信する
            const line = new Line({
                channelAccessToken: config.channelAccessToken,
                channelSecret: config.channelSecret
            });

            for (const tweet of tweetData) {
                const { groupId } = config;
                await line.sendText(groupId, "なおとくんがツイートしたやで " + `https://twitter.com/${twitterUserId}/status/${tweet.id_str}`);
                await line.sendImage(groupId, tweet.screenshotUrl);
            }
        } catch (error) {
            console.log(error);
            console.log("An error occurred");
        }
    } else {
        console.log("No recent tweets");
    }
}

ogubot();
