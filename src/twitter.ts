"use strict";

const Twit = require("twit");

export class Twitter {
    private _client;

    constructor(public readonly userId: string, credentials: TwitterAPICredentials) {
        this._client = new Twit(credentials);
    }

    public getTweets(count: number): Promise<{ data: TweetInfo[] }> {
        return this._client.get("statuses/user_timeline",
            {
                user_id: this.userId,
                trim_user: true,          // ユーザー情報を除く
                exclude_replies: true,    // リプライを除く
                count: count
            });
    }
}

interface TwitterAPICredentials {
    consumer_key: string;
    consumer_secret: string;
    access_token: string;
    access_token_secret: string;
}

export type UserTimelineResponse = TweetInfo[];

export interface TweetInfo {
    /**
     * ツイート日時
     */
    created_at: string;

    /**
     * ツイート本文
     */
    text: string;

    /**
     * リツイート数
     */
    retweet_count: number;

    /**
     * いいね数
     */
    favorite_count: number;
}
