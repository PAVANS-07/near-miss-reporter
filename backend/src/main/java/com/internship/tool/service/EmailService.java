package com.internship.tool.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String title, String description, String status) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            String safeTitle = (title != null && !title.isEmpty()) ? title : "No title";
            String safeDesc = (description != null && !description.isEmpty()) ? description : "No description provided";
            String safeStatus = (status != null && !status.isEmpty()) ? status : "N/A";

           
            String htmlContent = """
                <div style="font-family: Arial; padding:20px;">
                    <h2 style="color:#2563eb;">🚨 New Report Created</h2>

                    <p><strong>Title:</strong> %s</p>

                    <p><strong>Description:</strong><br/>%s</p>

                    <p><strong>Status:</strong> %s</p>

                    <hr/>
                    <p style="color:gray;">Near Miss Reporter System</p>
                </div>
            """.formatted(safeTitle, safeDesc, safeStatus);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom("pavansceb@gmail.com"); 

            mailSender.send(message);

            System.out.println("✅ Email sent successfully");

        } catch (Exception e) {
            System.out.println("❌ Email failed");
            e.printStackTrace();
        }
    }
}