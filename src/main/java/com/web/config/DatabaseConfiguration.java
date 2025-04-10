package com.web.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

//Bật toàn bộ JPA cho package repository

@Configuration
@EnableJpaRepositories(basePackages = {"com.web.repository"})
@EnableTransactionManagement
public class DatabaseConfiguration {
}

