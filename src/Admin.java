package com.pawpal.models;

/**
 * Admin class - Inherits from User
 * Manages users, pets, and adoption requests
 * Demonstrates Inheritance and Polymorphism
 */
public class Admin extends User {
    
    private String adminLevel; // SUPER_ADMIN, ADMIN, MODERATOR
    private String department;
    private String lastLoginDate;
    private int totalUsersManaged;
    private int totalPetsManaged;
    private int totalRequestsProcessed;
    
    // Constructor
    public Admin(int userId, String firstName, String lastName, String email,
                 String password, String phoneNumber, String adminLevel) {
        super(userId, firstName, lastName, email, password, phoneNumber, "ADMIN");
        this.adminLevel = adminLevel;
        this.totalUsersManaged = 0;
        this.totalPetsManaged = 0;
        this.totalRequestsProcessed = 0;
    }
    
    // Implementing abstract methods (Polymorphism)
    @Override
    public String getDashboardPath() {
        return "pages/admin-dashboard.html";
    }
    
    @Override
    public String getUserRole() {
        return "Administrator (" + adminLevel + ")";
    }
    
    // Admin-specific methods
    public boolean approvePetListing(Pet pet) {
        if (pet != null) {
            pet.setStatus("APPROVED");
            this.totalPetsManaged++;
            return true;
        }
        return false;
    }
    
    public boolean rejectPetListing(Pet pet, String reason) {
        if (pet != null) {
            pet.setStatus("REJECTED");
            pet.setRejectionReason(reason);
            return true;
        }
        return false;
    }
    
    public boolean approveAdoptionRequest(AdoptionRequest request) {
        if (request != null) {
            request.setStatus("APPROVED");
            this.totalRequestsProcessed++;
            return true;
        }
        return false;
    }
    
    public boolean rejectAdoptionRequest(AdoptionRequest request, String reason) {
        if (request != null) {
            request.setStatus("REJECTED");
            request.setRejectionReason(reason);
            this.totalRequestsProcessed++;
            return true;
        }
        return false;
    }
    
    public String generateAdoptionStatistics() {
        return "Total Users: " + totalUsersManaged + 
               ", Total Pets: " + totalPetsManaged + 
               ", Requests Processed: " + totalRequestsProcessed;
    }
    
    public boolean deactivateUser(User user) {
        if (user != null) {
            user.setActive(false);
            return true;
        }
        return false;
    }
    
    // Getters and Setters (Encapsulation)
    public String getAdminLevel() { return adminLevel; }
    public void setAdminLevel(String adminLevel) { this.adminLevel = adminLevel; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getLastLoginDate() { return lastLoginDate; }
    public void setLastLoginDate(String lastLoginDate) { this.lastLoginDate = lastLoginDate; }
    
    public int getTotalUsersManaged() { return totalUsersManaged; }
    public void setTotalUsersManaged(int totalUsersManaged) { 
        this.totalUsersManaged = totalUsersManaged; 
    }
    
    public int getTotalPetsManaged() { return totalPetsManaged; }
    public void setTotalPetsManaged(int totalPetsManaged) { 
        this.totalPetsManaged = totalPetsManaged; 
    }
    
    public int getTotalRequestsProcessed() { return totalRequestsProcessed; }
    public void setTotalRequestsProcessed(int totalRequestsProcessed) { 
        this.totalRequestsProcessed = totalRequestsProcessed; 
    }
}
