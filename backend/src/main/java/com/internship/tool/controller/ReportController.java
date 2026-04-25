package com.internship.tool.controller;

import com.internship.tool.entity.Report;
import com.internship.tool.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}