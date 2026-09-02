package com.pawpal.models;

/**
 * AdoptionRequest class - Tracks adoption requests from adopters
 */
public class AdoptionRequest {
    
    private int requestId;
    private int adopterId;
    private int petId;
    private int ownerId;
    private String status; // PENDING, APPROVED, REJECTED
    private String requestDate;
    private String processedDate;
    private String reasonForAdoption;
    private String householdInfo;
    private String experience;
    private String referenceContact;
    private boolean homeVisitRequired;
    private boolean homeVisitCompleted;
    private String processedBy; // Admin who processed the request
    private String rejectionReason;
    private String notes;
    private double adoptionFeeCharged;
    private boolean paidFee;
    
    // Constructor
    public AdoptionRequest(int requestId, int adopterId, int petId, int ownerId) {
        this.requestId = requestId;
        this.adopterId = adopterId;
        this.petId = petId;
        this.ownerId = ownerId;
        this.status = "PENDING";
        this.homeVisitRequired = false;
        this.homeVisitCompleted = false;
        this.paidFee = false;
    }
    
    // Methods
    public String getRequestSummary() {
        return "Request ID: " + requestId +
               "\nAdopter ID: " + adopterId +
               "\nPet ID: " + petId +
               "\nStatus: " + status +
               "\nSubmitted: " + requestDate +
               "\nProcessed: " + processedDate;
    }
    
    public boolean isApproved() {
        return "APPROVED".equals(status);
    }
    
    public boolean isPending() {
        return "PENDING".equals(status);
    }
    
    public boolean isRejected() {
        return "REJECTED".equals(status);
    }
    
    public boolean canBeApproved() {
        return isPending() && (homeVisitRequired ? homeVisitCompleted : true);
    }
    
    // Getters and Setters (Encapsulation)
    public int getRequestId() { return requestId; }
    public void setRequestId(int requestId) { this.requestId = requestId; }
    
    public int getAdopterId() { return adopterId; }
    public void setAdopterId(int adopterId) { this.adopterId = adopterId; }
    
    public int getPetId() { return petId; }
    public void setPetId(int petId) { this.petId = petId; }
    
    public int getOwnerId() { return ownerId; }
    public void setOwnerId(int ownerId) { this.ownerId = ownerId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getRequestDate() { return requestDate; }
    public void setRequestDate(String requestDate) { this.requestDate = requestDate; }
    
    public String getProcessedDate() { return processedDate; }
    public void setProcessedDate(String processedDate) { this.processedDate = processedDate; }
    
    public String getReasonForAdoption() { return reasonForAdoption; }
    public void setReasonForAdoption(String reasonForAdoption) { 
        this.reasonForAdoption = reasonForAdoption; 
    }
    
    public String getHouseholdInfo() { return householdInfo; }
    public void setHouseholdInfo(String householdInfo) { this.householdInfo = householdInfo; }
    
    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
    
    public String getReferenceContact() { return referenceContact; }
    public void setReferenceContact(String referenceContact) { 
        this.referenceContact = referenceContact; 
    }
    
    public boolean isHomeVisitRequired() { return homeVisitRequired; }
    public void setHomeVisitRequired(boolean homeVisitRequired) { 
        this.homeVisitRequired = homeVisitRequired; 
    }
    
    public boolean isHomeVisitCompleted() { return homeVisitCompleted; }
    public void setHomeVisitCompleted(boolean homeVisitCompleted) { 
        this.homeVisitCompleted = homeVisitCompleted; 
    }
    
    public String getProcessedBy() { return processedBy; }
    public void setProcessedBy(String processedBy) { this.processedBy = processedBy; }
    
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { 
        this.rejectionReason = rejectionReason; 
    }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public double getAdoptionFeeCharged() { return adoptionFeeCharged; }
    public void setAdoptionFeeCharged(double adoptionFeeCharged) { 
        this.adoptionFeeCharged = adoptionFeeCharged; 
    }
    
    public boolean isPaidFee() { return paidFee; }
    public void setPaidFee(boolean paidFee) { this.paidFee = paidFee; }
}
