export function ogubot(event, context, callback) {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: "This is Ogubot.",
            input: event,
        }),
    };

    callback(undefined, response);
}
