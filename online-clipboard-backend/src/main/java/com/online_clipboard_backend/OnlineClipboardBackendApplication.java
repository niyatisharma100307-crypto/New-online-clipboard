package com.online_clipboard_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OnlineClipboardBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(OnlineClipboardBackendApplication.class, args);
	}

}
