function handler(event) {
    var request = event.request;
    var headers = request.headers;

    if (headers.host && headers.host.value === 'app.acceleratedteamproductivity.shop') {
        return request;
    }

    return {
        statusCode: 403,
        statusDescription: 'Forbidden',
        headers: {
            'content-type': { value: 'text/plain' },
            'cache-control': { value: 'no-cache' }
        },
        body: 'Access denied'
    };
}
