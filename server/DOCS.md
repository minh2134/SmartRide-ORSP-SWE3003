# API Documentation
## REST endpoints
### GET /rest/fare
Return the fare rate. Schema:
```
{
    fare: float // 2-decimal rounded
}
```

## Websocket endpoint
*Note on authentication*
You will need to provide `login` and `passcode` headers in your **STOMP CONNECT frame** to use the APIs listed below. Subscribe to `/user/topic/customer/response` to get the response if applicable. Check out the schema in the `Websocket feeds` section.

If user is unauthenticated, or unauthorized, they will still connect to the websocket, however every APIs that needs authentication will response as below:
```
{
    status: 401,
    method: "the endpoint",
    result: { "content": "Wrong credentials" }
}
```

### Error response
If the status code is not 200. The result schema will be as follow:
```
{
    "content": string   /* Error explanation */
}
```

### /ws
End point to establish websocket STOMP connection.

### /customer/info
Endpoint to request (current) customer details. . Result schema is:
```
{
    "username": string,
    "name": string,
    "sex": string,
    "age": int,
    "phone", string
}
```

### /customer/makeride
Endpoint to request ride making.

Request schema:
```
{
    "pickupLoc": string,    /* Pickup location */
    "dropoffLoc": string    /* Dropoff location */
}
```

## Websocket feeds
### /user/topic/{usertype}/response
Feed to receive user info. Replace `{usertype}` with either customer/driver.

General response schema:
```
{
    "status": int,      /* HTTP response code */
    "method": string,   /* API endpoint */
    "result": {}        /* result JSON, depends on API */
}
```
