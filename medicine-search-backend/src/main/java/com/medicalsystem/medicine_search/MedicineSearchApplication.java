package com.medicalsystem.medicine_search;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MedicineSearchApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedicineSearchApplication.class, args);

		System.out.println("DB HOST: " + System.getenv("MYSQLHOST"));
	}

}
