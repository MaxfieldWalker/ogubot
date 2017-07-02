"use strict";

import * as line from "@line/bot-sdk";

export class Line {
    private _client: line.Client;

    constructor(credentials: LineAPICredentials) {
        this._client = new line.Client(credentials);
        line.middleware(credentials);
    }

    public send(to: string, message: string): Promise<void> {
        return this._client.pushMessage(to, {
            type: "text",
            text: message
        });
    }
}

export interface LineAPICredentials {
    channelAccessToken: string;
    channelSecret: string;
}
