package com.orsp.smartride.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	
	@Autowired
	AuthenticationManager authenticationManager;
	

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/topic");
		config.setApplicationDestinationPrefixes("/app");
	}
	
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws");
		registry.addEndpoint("/ws").withSockJS(); // SocketJS endpoint
	}

	// Custom Authentication scheme to deal with browsers bullshit Websocket support
	// If anyone reading this they should send all their hatred towards Google and
	// Controlled-Opposition (Mozilla) for funding virtue signalling "operations" 
	// instead of fixing their shitty web browsers.
	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) throws AuthenticationException {
		registration.interceptors(new ChannelInterceptor() {
			@Override
			public Message<?> preSend(Message<?> message, MessageChannel channel) {
				StompHeaderAccessor accessor = MessageHeaderAccessor.
					getAccessor(message, StompHeaderAccessor.class);
				if (StompCommand.CONNECT.equals(accessor.getCommand())) {
					// Access authentication header(s) 
					String login = accessor.getLogin();
					String passcode = accessor.getPasscode();

					// Authenticate the given headers
					try {
						Authentication authentication = authenticationManager
							.authenticate(new UsernamePasswordAuthenticationToken(login, passcode));						
						
						// Set the user accordingly
						accessor.setUser(authentication);
					}
					catch (Exception e) {
						System.out.println("Client done goofed up the credentials. Tried logging in as: " + login);
						System.out.println("Error:" + e);
						
						// set user to DUMMY account
						login = "DUMMY";
						passcode = "DUMMY";

						Authentication authentication = authenticationManager
							.authenticate(new UsernamePasswordAuthenticationToken(login, passcode));

						// Set the user accordingly
						accessor.setUser(authentication);
					}
				}
				return message;
			}
		});
	}
}
