package com.internship.tool.controller;

import com.internship.tool.entity.Report;
import com.internship.tool.service.ReportService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.data.domain.Page;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ReportController {

    @Autowired
    private ReportService service;

    
    @GetMapping("/all")
    public List<Report> getAllReports() {
        return service.getAllReports();
    }

    
    @GetMapping("/page")
    public Page<Report> getPaginated(
            @RequestParam int page,
            @RequestParam int size) {

        return service.getReportsPaginated(page, size);
    }

    @PostMapping("/add")
    public Report addReport(@RequestBody Report report) {
        return service.saveReport(report);
    }

    @PutMapping("/update/{id}")
    public Report updateReport(@PathVariable Long id, @RequestBody Report report) {
        report.setId(id);
        return service.saveReport(report);
    }

    
    @DeleteMapping("/delete/{id}")
    public void deleteReport(@PathVariable Long id) {
        service.deleteReport(id);
    }
}