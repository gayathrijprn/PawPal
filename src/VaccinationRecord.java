package com.pawpal.models;

/**
 * VaccinationRecord class - Tracks pet vaccination history
 */
public class VaccinationRecord {
    
    private int recordId;
    private int petId;
    private String vaccineName;
    private String vaccinationDate;
    private String nextDueDate;
    private String veterinarianName;
    private String clinicName;
    private String clinicPhone;
    private boolean completed;
    private double cost;
    private String batchNumber;
    private String notes;
    private String certificateUrl;
    
    // Constructor
    public VaccinationRecord(int recordId, int petId, String vaccineName, 
                            String vaccinationDate, String veterinarianName) {
        this.recordId = recordId;
        this.petId = petId;
        this.vaccineName = vaccineName;
        this.vaccinationDate = vaccinationDate;
        this.veterinarianName = veterinarianName;
        this.completed = true;
    }
    
    // Methods
    public boolean isExpired() {
        // This would need a proper date comparison in real implementation
        return false;
    }
    
    public boolean isUpcoming() {
        // Check if next due date is within 30 days
        return false;
    }
    
    public String getVaccineInfo() {
        return "Vaccine: " + vaccineName +
               "\nVaccinated: " + vaccinationDate +
               "\nNext Due: " + nextDueDate +
               "\nVeterinarian: " + veterinarianName +
               "\nClinic: " + clinicName +
               "\nStatus: " + (completed ? "Completed" : "Pending");
    }
    
    public String getReminder() {
        return "Vaccination reminder for pet ID " + petId + 
               ": " + vaccineName + " is due on " + nextDueDate;
    }
    
    // Getters and Setters (Encapsulation)
    public int getRecordId() { return recordId; }
    public void setRecordId(int recordId) { this.recordId = recordId; }
    
    public int getPetId() { return petId; }
    public void setPetId(int petId) { this.petId = petId; }
    
    public String getVaccineName() { return vaccineName; }
    public void setVaccineName(String vaccineName) { this.vaccineName = vaccineName; }
    
    public String getVaccinationDate() { return vaccinationDate; }
    public void setVaccinationDate(String vaccinationDate) { 
        this.vaccinationDate = vaccinationDate; 
    }
    
    public String getNextDueDate() { return nextDueDate; }
    public void setNextDueDate(String nextDueDate) { this.nextDueDate = nextDueDate; }
    
    public String getVeterinarianName() { return veterinarianName; }
    public void setVeterinarianName(String veterinarianName) { 
        this.veterinarianName = veterinarianName; 
    }
    
    public String getClinicName() { return clinicName; }
    public void setClinicName(String clinicName) { this.clinicName = clinicName; }
    
    public String getClinicPhone() { return clinicPhone; }
    public void setClinicPhone(String clinicPhone) { this.clinicPhone = clinicPhone; }
    
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    
    public double getCost() { return cost; }
    public void setCost(double cost) { this.cost = cost; }
    
    public String getBatchNumber() { return batchNumber; }
    public void setBatchNumber(String batchNumber) { this.batchNumber = batchNumber; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getCertificateUrl() { return certificateUrl; }
    public void setCertificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; }
}
