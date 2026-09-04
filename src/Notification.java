/**
 * Notification interface - Defines the contract for notification services
 * Can be implemented by different notification types (email, SMS, or push).
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
     * Send notification with a subject.
     *
     * @param recipientId User ID to receive notification
     * @param subject Subject of the notification
     * @param message Message to send
     * @return true if sent successfully, false otherwise
     */
    boolean sendNotificationWithSubject(int recipientId, String subject, String message);
    
    /**
     * Get notification type.
     *
     * @return the notification type
     */
    String getNotificationType();
    
    /**
     * Log notification.
     *
     * @param recipientId User ID that received the notification
     * @param message Message that was sent
     * @param status Delivery status
     */
    void logNotification(int recipientId, String message, String status);
}
