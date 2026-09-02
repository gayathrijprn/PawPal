package com.pawpal.services;

import com.pawpal.interfaces.Notification;
import java.time.LocalDateTime;

/**
 * SMSNotification class - Implements Notification interface
 * Handles SMS notifications
 */
public class SMSNotification implements Notification {
    
    private String apiKey;
    private String smsGateway;
    private String senderNumber;
    
    public SMSNotification(String apiKey, String smsGateway, String senderNumber) {
        this.apiKey = apiKey;
        this.smsGateway = smsGateway;
        this.senderNumber = senderNumber;
    }
    
    @Override
    public boolean sendNotification(int recipientId, String message) {
        // In real implementation, would integrate with SMS gateway
        System.out.println("[SMS] Sending to User " + recipientId + ": " + message);
        logNotification(recipientId, message, "SENT");
        return true;
    }
    
    @Override
    public boolean sendNotificationWithSubject(int recipientId, String subject, String message) {
        // SMS typically doesn't have subject, just combine with message
        String fullMessage = subject + ": " + message;
        if (fullMessage.length() > 160) {
            fullMessage = fullMessage.substring(0, 157) + "...";
        }
        System.out.println("[SMS] Sending to User " + recipientId + ": " + fullMessage);
        logNotification(recipientId, fullMessage, "SENT");
        return true;
    }
    
    @Override
    public String getNotificationType() {
        return "SMS";
    }
    
    @Override
    public void logNotification(int recipientId, String message, String status) {
        System.out.println("[LOG] " + LocalDateTime.now() + " | Type: SMS | " +
                         "Recipient: " + recipientId + " | Status: " + status);
    }
    
    // Additional methods specific to SMS
    public boolean sendOTP(int recipientId, String otp) {
        String message = "Your PawPal verification code is: " + otp + 
                        ". Valid for 10 minutes.";
        return sendNotification(recipientId, message);
    }
    
    public boolean sendUrgentAlert(int recipientId, String alert) {
        String message = "URGENT: " + alert;
        return sendNotification(recipientId, message);
    }
}
