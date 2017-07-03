"use strict";

import { Twitter } from "./twitter";
import { Line } from "./line";
import * as moment from "moment";

export function ogubot(event, context, callback) {
    // callbackを呼ばない限り終了しないようにする
    context.callbackWaitsForEmptyEventLoop = false;
    const tweetCount = 30;
    const thresholdMinutes = 120;
    const topTweetLikesThreshold = 3;

    const client = new Twitter(process.env.twitterUserId!, {
        consumer_key: process.env.consumer_key!,
        consumer_secret: process.env.consumer_secret!,
        access_token: process.env.access_token!,
        access_token_secret: process.env.access_token_secret!
    });

    client.getTweets(tweetCount)
        .then(result => {
            const tweets = result.data;
            const recentTweets = tweets
                .filter(x => moment().diff(moment(new Date(x.created_at)), "minutes") <= thresholdMinutes);
            if (recentTweets.length > 0) {
                const topTweet = recentTweets.sort((a, b) => b.favorite_count - a.favorite_count)[0];
                if (topTweet.favorite_count >= topTweetLikesThreshold) {
                    const line = new Line({
                        channelAccessToken: process.env.channelAccessToken!,
                        channelSecret: process.env.channelSecret!
                    });

                    const to = process.env.groupId!;
                    line.send(to, `おぐおぐの最新ツイートやで\n\n${topTweet.text}`)
                        .then(() => callback(undefined, createTopTweetExistsResponse(topTweet.text, topTweet.favorite_count)))
                        .catch(() => callback(undefined, failedToSendMessage()));
                } else {
                    callback(undefined, createTopTweetDoesNotExistResponse());
                }
            } else {
                callback(undefined, createTopTweetDoesNotExistResponse());
            }
        }).catch(err => {
            callback(undefined, "An error occurred: " + err.toString());
        });
}

function createTopTweetExistsResponse(tweetText: string, likes: number) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Top tweet exists:",
            tweetText,
            likes
        }),
    };
}

function createTopTweetDoesNotExistResponse() {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Top tweet doesn't exist.",
        }),
    };
}

function failedToSendMessage() {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Failed to send message.",
        }),
    };
}
