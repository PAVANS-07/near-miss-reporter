package com.internship.tool.service;

import com.internship.tool.entity.Report;
import com.internship.tool.repository.ReportRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
public class ReportService {

    @Autowired
    private ReportRepository repo;

    
    public List<Report> getAllReports() {
        return repo.findAll();
    }

    
    public Page<Report> getReportsPaginated(int page, int size) {
        return repo.findAll(
                PageRequest.of(page, size, Sort.by("id").ascending())
        );
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