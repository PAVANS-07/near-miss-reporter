package com.internship.tool.controller;

import com.internship.tool.entity.Report;
import com.internship.tool.repository.ReportRepository;
import com.internship.tool.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ReportController {

    @Autowired
    private ReportRepository repo;

    @Autowired
    private EmailService emailService;

    
    @PostMapping("/add")
    public Report add(@RequestBody Report r) {

        Report saved = repo.save(r);

       
        emailService.sendEmail(
                "pavansceb@gmail.com",  
                "New Report Created",
                r.getTitle(),
                r.getDescription(),
                r.getStatus()
        );

        return saved;
    }

    // ✅ GET PAGINATION
    @GetMapping("/page")
    public Page<Report> getAll(@RequestParam int page, @RequestParam int size) {
        return repo.findByIsDeletedFalse(PageRequest.of(page, size));
    }

    // ✅ SEARCH
    @GetMapping("/search")
    public Page<Report> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return repo.findByTitleContainingIgnoreCaseAndIsDeletedFalseOrDescriptionContainingIgnoreCaseAndIsDeletedFalse(
                q, q, PageRequest.of(page, size)
        );
    }

    // ✅ UPDATE
    @PutMapping("/update/{id}")
    public Report update(@PathVariable Long id, @RequestBody Report r) {
        r.setId(id);
        Report updated = repo.save(r);

        emailService.sendEmail(
                "pavansceb@gmail.com",
                "Report Updated",
                updated.getTitle(),
                updated.getDescription(),
                updated.getStatus()
        );

        return updated;
    }

    // ✅ DELETE
    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        repo.findById(id).ifPresent(report -> {
            report.setDeleted(true);
            repo.save(report);

            emailService.sendEmail(
                    "pavansceb@gmail.com",
                    "Report Deleted",
                    report.getTitle(),
                    report.getDescription(),
                    "DELETED"
            );
        });
        return "Deleted";
    }
}