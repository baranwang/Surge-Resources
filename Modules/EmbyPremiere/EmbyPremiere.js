if (
    $request.url.includes(
        'mb3admin.com/admin/service/registration/validateDevice'
    )
) {
    $done({
        status: 200,
        headers: $response.headers,
        body: JSON.stringify({
            cacheExpirationDays: 3650,
            message: 'Device Valid',
            resultCode: 'GOOD',
        }),
    });
}

if ($request.url.includes('mb3admin.com/admin/service/registration/validate')) {
    $done({
        status: 200,
        headers: $response.headers,
        body: JSON.stringify({
            featId: '',
            registered: true,
            expDate: '2099-01-01',
            key: '',
        }),
    });
}

if (
    $request.url.includes('mb3admin.com/admin/service/registration/getStatus')
) {
    $done({
        status: 200,
        headers: $response.headers,
        body: JSON.stringify({
            deviceStatus: '',
            planType: 'Lifetime',
            subscriptions: {},
        }),
    });
}