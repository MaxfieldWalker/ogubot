"use strict";

import { Twitter } from "./twitter";
import * as moment from "moment";

export function ogubot(event, context, callback) {
    const client = new Twitter("ARUGO_WM", {
        consumer_key: process.env.consumer_key!,
        consumer_secret: process.env.consumer_secret!,
        access_token: process.env.access_token!,
        access_token_secret: process.env.access_token_secret!
    });

    const tweetCount = 10;
    const thresholdMinutes = 120;
    const topTweetLikesThreshold = 3;

    client.getTweets(tweetCount)
        .then(result => {
            const tweets = result.data;
            if (tweets.length > 0) {
                const topTweet = tweets
                    .filter(x => moment().diff(moment(new Date(x.created_at)), "minutes") <= thresholdMinutes)
                    .sort((a, b) => b.favorite_count - a.favorite_count)[0];
                if (topTweet.favorite_count >= topTweetLikesThreshold) {
                    // LINEで発言する
                    callback(undefined, createTopTweetExistsResponse(topTweet.text, topTweet.favorite_count));
                } else {
                    callback(undefined, createTopTweetDoesNotExistResponse());
                }
            } else {
                callback(undefined, createTopTweetDoesNotExistResponse());
            }
        }).catch(err => {
            callback(undefined, err);
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
