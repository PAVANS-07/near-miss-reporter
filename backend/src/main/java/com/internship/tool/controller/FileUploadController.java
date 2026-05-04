package com.internship.tool.controller;

import com.internship.tool.entity.Report;
import com.internship.tool.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class FileUploadController {

    @Autowired
    private ReportRepository repo;

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png", "application/pdf", "text/csv");

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please select a file to upload.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File size exceeds the 5MB limit.");
        }

        String filename = file.getOriginalFilename();
        boolean isCsv = (filename != null && filename.toLowerCase().endsWith(".csv")) || 
                        "text/csv".equals(file.getContentType()) || 
                        "application/vnd.ms-excel".equals(file.getContentType());

        if (!isCsv && !ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file type. Only JPEG, PNG, PDF, and CSV are allowed.");
        }

        if (isCsv) {
            return importCsv(file);
        }

        // In a real scenario, we would save other files to S3, a local directory, etc.
        return ResponseEntity.ok("File uploaded successfully: " + file.getOriginalFilename());
    }

    private ResponseEntity<String> importCsv(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            List<Report> reportsToSave = new ArrayList<>();

            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header
                }
                
                String[] data = line.split(",");
                if (data.length >= 2) {
                    Report report = new Report();
                    // Fallback to simple parsing (assuming Title,Description,Status,Severity,Location format)
                    report.setTitle(data[0].replace("\"", ""));
                    report.setDescription(data[1].replace("\"", ""));
                    
                    if (data.length > 2) report.setStatus(data[2]);
                    if (data.length > 3) report.setSeverity(data[3]);
                    if (data.length > 4) report.setLocation(data[4].replace("\"", ""));
                    
                    reportsToSave.add(report);
                }
            }
            repo.saveAll(reportsToSave);
            return ResponseEntity.ok("CSV Imported successfully. Added " + reportsToSave.size() + " reports.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error parsing CSV file: " + e.getMessage());
        }
    }
}
