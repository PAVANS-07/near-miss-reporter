package com.internship.tool.service;

import com.internship.tool.entity.Report;
import com.internship.tool.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    @Autowired
    private ReportRepository repo;

    
    public List<Report> getAllReports() {
        return repo.findAll();
    }

    
    public Report saveReport(Report report) {

       
        if (report.getStatus() == null || report.getStatus().isEmpty()) {
            report.setStatus("OPEN");
        }

        return repo.save(report);
    }

    public void deleteReport(Long id) {
        repo.deleteById(id);
    }
}