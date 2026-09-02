package com.pawpal.interfaces;

/**
 * Notification interface - Demonstrates Interface implementation
 * Can be implemented by different notification types (Email, SMS, Push)
 */
public interface Notification {
    
    /**
     * Send notification to recipient
     * @param recipientId User ID to receive notification
     * @param message Message to send
     * @return true if sent successfully, false otherwise
     */
    boolean sendNotification(int recipientId, String message);
    
    /**
     * Send notification with subject
     */
    boolean sendNotificationWithSubject(int recipientId, String subject, String message);
    
    /**
     * Get notification type
     */
    String getNotificationType();
    
    /**
     * Log notification
     */
    void logNotification(int recipientId, String message, String status);
}
