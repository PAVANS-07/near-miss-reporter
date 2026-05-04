package com.internship.tool.service;

import com.internship.tool.entity.AuditLog;
import com.internship.tool.entity.Report;
import com.internship.tool.repository.AuditLogRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditLoggingAspect {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @AfterReturning(pointcut = "execution(* com.internship.tool.repository.ReportRepository.save(..))", returning = "result")
    public void logSaveReport(JoinPoint joinPoint, Object result) {
        if (result instanceof Report) {
            Report report = (Report) result;
            AuditLog log = new AuditLog();
            log.setActionType(report.isDeleted() ? "DELETE" : (report.getCreatedAt() != null && report.getCreatedAt().equals(report.getUpdatedAt()) ? "CREATE" : "UPDATE"));
            log.setEntityName("Report");
            log.setEntityId(report.getId());
            log.setActionDetails(report.isDeleted() ? "Report soft deleted" : "Report saved with status: " + report.getStatus());
            log.setPerformedBy("SystemUser"); // Would be fetched from AuthContext in a real scenario
            
            auditLogRepository.save(log);
        }
    }
}
