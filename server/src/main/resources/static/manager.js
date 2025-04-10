const stompClient = new StompJs.Client({
    brokerURL: 'ws://localhost:8080/ws',
    connectHeaders: {
        login: "manager",
        passcode: "manager",
    },
});

stompClient.onConnect = (frame) => {
    setConnected(true);
    console.log('Connected: ' + frame);
    stompClient.subscribe('/user/topic/manager/response', (message) => {
        showRawJSON(message.body);
    });
};

function showRawJSON(message) {
	json = JSON.parse(message);
	ridetable = json.result.rides;

	$("#greetings").empty();


	for (let i = 0; i < ridetable.length; i++) {
		$("#greetings").append("<tr>");
		$("#greetings").append("<td>" + ridetable[i].rideID + "</td>");
		$("#greetings").append("<td>" + ridetable[i].customer + "</td>");
		$("#greetings").append("<td>" + ridetable[i].driver + "</td>");
		$("#greetings").append("<td>" + ridetable[i].pickupLoc + "</td>");
		$("#greetings").append("<td>" + ridetable[i].dropoffLoc + "</td>");
		$("#greetings").append("<td>" + ridetable[i].vehicleType + "</td>");
		$("#greetings").append("<td>" + ridetable[i].isDone + "</td>");
		$("#greetings").append("<td>" + ridetable[i].timeStamp + "</td>");
		$("#greetings").append("</tr>");
	}

}

stompClient.onWebSocketError = (error) => {
    console.error('Error with websocket', error);
};

stompClient.onStompError = (frame) => {
    console.error('Broker reported error: ' + frame.headers['message']);
    console.error('Additional details: ' + frame.body);
};

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#getReports").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
    stompClient.activate();
}

function disconnect() {
    stompClient.deactivate();
    setConnected(false);
    console.log("Disconnected");
}

function sendJSON() {
    stompClient.publish({
        destination: "/app/manager/report",
        body: JSON.stringify({})
    });
}


function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', (e) => e.preventDefault());
    $( "#connect" ).click(() => connect());
    $( "#disconnect" ).click(() => disconnect());
    $( "#getReports" ).click(() => sendJSON());
});
