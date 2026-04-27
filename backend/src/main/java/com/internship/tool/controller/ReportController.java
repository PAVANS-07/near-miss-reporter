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

    // GET ALL
    @GetMapping("/all")
    public List<Report> getAllReports() {
        return service.getAllReports();
    }

    // PAGINATION + SORT (IMPORTANT FIX)
    @GetMapping("/page")
    public Page<Report> getPaginated(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(defaultValue = "asc") String sort) {

        return service.getReportsPaginated(page, size, sort);
    }

    // SEARCH
    @GetMapping("/search")
    public Page<Report> search(
            @RequestParam String keyword,
            @RequestParam int page,
            @RequestParam int size) {

        return service.searchReports(keyword, page, size);
    }

    // ADD
    @PostMapping("/add")
    public Report addReport(@RequestBody Report report) {
        return service.saveReport(report);
    }

    // UPDATE
    @PutMapping("/update/{id}")
    public Report updateReport(
            @PathVariable Long id,
            @RequestBody Report report) {

        report.setId(id);
        return service.saveReport(report);
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public void deleteReport(@PathVariable Long id) {
        service.deleteReport(id);
    }
}