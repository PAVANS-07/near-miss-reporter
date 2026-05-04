package com.internship.tool.config;

import com.internship.tool.entity.Report;
import com.internship.tool.repository.ReportRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(ReportRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                for (int i = 1; i <= 15; i++) {
                    Report report = new Report();
                    report.setTitle("Demo Near Miss " + i);
                    report.setDescription("This is a realistic demo description for near miss report number " + i);
                    report.setLocation("Location " + (i % 5 + 1));
                    report.setSeverity(i % 3 == 0 ? "High" : (i % 2 == 0 ? "Medium" : "Low"));
                    report.setStatus(i % 4 == 0 ? "CLOSED" : "OPEN");
                    repository.save(report);
                }
                System.out.println("Inserted 15 demo records into the database.");
            }
        };
    }
}
