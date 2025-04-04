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
You will need to provide Basic HTTP Authentication to use the APIs listed below


### /ws
End point to establish websocket STOMP connection

### /customer/info
Endpoint to request (current) customer details. Subscribe to `/user/topic/info` to get the response

## Websocket feeds
### /user/topic/info
Feed to receive user info. Response to request in `/customer/info`. Only the requester can see it. Has the following schema:
```
{
    "username": string,
    "name": string,
    "age": int,
    "sex": string,
    "phone": string,
}
```


