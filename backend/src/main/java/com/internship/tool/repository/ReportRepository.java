package com.internship.tool.repository;

import com.internship.tool.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReportRepository extends JpaRepository<Report, Long> {

    Page<Report> findByIsDeletedFalse(Pageable pageable);

    Page<Report> findByTitleContainingIgnoreCaseAndIsDeletedFalseOrDescriptionContainingIgnoreCaseAndIsDeletedFalse(
            String title,
            String description,
            Pageable pageable
    );
}