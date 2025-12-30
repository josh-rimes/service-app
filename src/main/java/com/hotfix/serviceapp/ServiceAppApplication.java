package com.hotfix.serviceapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

@SpringBootApplication
public class ServiceAppApplication {

	static void main(String[] args) {
		SpringApplication.run(ServiceAppApplication.class, args);
	}

}
