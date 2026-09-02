package com.pawpal.services;

import com.pawpal.interfaces.Notification;
import java.time.LocalDateTime;

/**
 * EmailNotification class - Implements Notification interface
 * Handles email notifications
 */
public class EmailNotification implements Notification {
    
    private String senderEmail;
    private String smtpServer;
    private int smtpPort;
    
    public EmailNotification(String senderEmail, String smtpServer, int smtpPort) {
        this.senderEmail = senderEmail;
        this.smtpServer = smtpServer;
        this.smtpPort = smtpPort;
    }
    
    @Override
    public boolean sendNotification(int recipientId, String message) {
        System.out.println("[EMAIL] Sending to User " + recipientId + ": " + message);
        logNotification(recipientId, message, "SENT");
        return true;
    }
    
    @Override
    public boolean sendNotificationWithSubject(int recipientId, String subject, String message) {
        String fullMessage = "Subject: " + subject + "\n" + message;
        System.out.println("[EMAIL] Sending to User " + recipientId + ": " + fullMessage);
        logNotification(recipientId, fullMessage, "SENT");
        return true;
    }
    
    @Override
    public String getNotificationType() {
        return "EMAIL";
    }
    
    @Override
    public void logNotification(int recipientId, String message, String status) {
        System.out.println("[LOG] " + LocalDateTime.now() + " | Type: EMAIL | " +
                         "Recipient: " + recipientId + " | Status: " + status);
    }
    
    // Additional methods specific to email
    public boolean sendBulkEmail(int[] recipientIds, String subject, String message) {
        for (int recipientId : recipientIds) {
            sendNotificationWithSubject(recipientId, subject, message);
        }
        return true;
    }
}
