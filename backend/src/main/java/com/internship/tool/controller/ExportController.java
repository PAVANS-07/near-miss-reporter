package com.internship.tool.controller;

import com.internship.tool.entity.Report;
import com.internship.tool.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ExportController {

    @Autowired
    private ReportRepository repo;

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCsv() {
        List<Report> reports = repo.findAll();
        
        StringBuilder csvBuilder = new StringBuilder();
        csvBuilder.append("ID,Title,Description,Status,Severity,Location,Created_At,Updated_At,Is_Deleted\n");
        
        for (Report r : reports) {
            csvBuilder.append(r.getId()).append(",")
                      .append("\"").append(r.getTitle() != null ? r.getTitle().replace("\"", "\"\"") : "").append("\",")
                      .append("\"").append(r.getDescription() != null ? r.getDescription().replace("\"", "\"\"") : "").append("\",")
                      .append(r.getStatus()).append(",")
                      .append(r.getSeverity()).append(",")
                      .append("\"").append(r.getLocation() != null ? r.getLocation().replace("\"", "\"\"") : "").append("\",")
                      .append(r.getCreatedAt()).append(",")
                      .append(r.getUpdatedAt()).append(",")
                      .append(r.isDeleted())
                      .append("\n");
        }

        byte[] csvBytes = csvBuilder.toString().getBytes();
        
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=reports.csv");
        headers.setContentType(MediaType.parseMediaType("text/csv"));

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }
}
