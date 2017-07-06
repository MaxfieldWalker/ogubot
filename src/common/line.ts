"use strict";

import * as line from "@line/bot-sdk";

export class Line {
    private _client: line.Client;

    constructor(credentials: LineAPICredentials) {
        this._client = new line.Client(credentials);
        line.middleware(credentials);
    }

    public sendText(to: string, message: string): Promise<void> {
        return this._client.pushMessage(to, {
            type: "text",
            text: message
        });
    }

    public sendImage(to: string, imageUrl: string): Promise<void> {
        return this._client.pushMessage(to, {
            type: "image",
            originalContentUrl: imageUrl,
            previewImageUrl: imageUrl
        });
    }

    public sendImages(to: string, imageUrls: string[]): Promise<void> {
        const messages: ImageMessage[] = imageUrls.map(url => ({
            type: "image",
            originalContentUrl: url,
            previewImageUrl: url
        }) as ImageMessage);

        return this._client.pushMessage(to, messages);
    }
}

export interface LineAPICredentials {
    channelAccessToken: string;
    channelSecret: string;
}

interface ImageMessage {
    type: "image";
    originalContentUrl: string;
    previewImageUrl: string;
}
