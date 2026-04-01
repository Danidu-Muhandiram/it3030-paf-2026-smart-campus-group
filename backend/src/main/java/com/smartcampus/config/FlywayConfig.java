package com.smartcampus.config;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class FlywayConfig {

    @Bean
    public Flyway flyway(DataSource dataSource) {
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .baselineOnMigrate(true)
                .locations("classpath:db/migration")
                .load();
        
        System.out.println("====== EXECUTING FLYWAY MIGRATIONS SYNCHRONOUSLY ======");
        flyway.migrate();
        System.out.println("====== FLYWAY MIGRATIONS COMPLETED ======");
        
        return flyway;
    }
}
