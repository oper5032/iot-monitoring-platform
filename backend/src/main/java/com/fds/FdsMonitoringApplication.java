package com.fds;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.fds.dashboard.repository")
public class FdsMonitoringApplication {

	public static void main(String[] args) {
		SpringApplication.run(FdsMonitoringApplication.class, args);
	}

}
