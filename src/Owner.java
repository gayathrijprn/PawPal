package com.pawpal.models;

import java.util.ArrayList;
import java.util.List;

/**
 * Owner class - Represents Pet Shelters/Owners who list pets for adoption
 * Inherits from User
 * Demonstrates Inheritance and Polymorphism
 */
public class Owner extends User {
    
    private String shelterName;
    private String shelterDescription;
    private String shelterWebsite;
    private int totalPetsListed;
    private int totalPetsAdopted;
    private double averageRating;
    private String verificationStatus; // VERIFIED, PENDING, REJECTED
    private List<Pet> listedPets;
    private List<AdoptionRequest> adoptionRequests;
    
    // Constructor
    public Owner(int userId, String firstName, String lastName, String email,
                 String password, String phoneNumber, String shelterName) {
        super(userId, firstName, lastName, email, password, phoneNumber, "OWNER");
        this.shelterName = shelterName;
        this.totalPetsListed = 0;
        this.totalPetsAdopted = 0;
        this.averageRating = 0.0;
        this.verificationStatus = "PENDING";
        this.listedPets = new ArrayList<>();
        this.adoptionRequests = new ArrayList<>();
    }
    
    // Implementing abstract methods (Polymorphism)
    @Override
    public String getDashboardPath() {
        return "pages/owner-dashboard.html";
    }
    
    @Override
    public String getUserRole() {
        return "Pet Owner/Shelter";
    }
    
    // Owner-specific methods
    public boolean listPet(Pet pet) {
        if (pet != null) {
            pet.setOwnerId(this.getUserId());
            listedPets.add(pet);
            totalPetsListed++;
            return true;
        }
        return false;
    }
    
    public boolean removePetListing(Pet pet) {
        if (pet != null && listedPets.contains(pet)) {
            listedPets.remove(pet);
            return true;
        }
        return false;
    }
    
    public void addAdoptionRequest(AdoptionRequest request) {
        if (request != null) {
            adoptionRequests.add(request);
        }
    }
    
    public List<AdoptionRequest> getPendingRequests() {
        List<AdoptionRequest> pendingRequests = new ArrayList<>();
        for (AdoptionRequest request : adoptionRequests) {
            if ("PENDING".equals(request.getStatus())) {
                pendingRequests.add(request);
            }
        }
        return pendingRequests;
    }
    
    public boolean updateRating(double newRating) {
        if (newRating >= 0 && newRating <= 5) {
            this.averageRating = newRating;
            return true;
        }
        return false;
    }
    
    public String getShelterInfo() {
        return "Shelter: " + shelterName + 
               "\nPets Listed: " + totalPetsListed + 
               "\nPets Adopted: " + totalPetsAdopted + 
               "\nRating: " + averageRating + "/5" +
               "\nVerification: " + verificationStatus;
    }
    
    // Getters and Setters (Encapsulation)
    public String getShelterName() { return shelterName; }
    public void setShelterName(String shelterName) { this.shelterName = shelterName; }
    
    public String getShelterDescription() { return shelterDescription; }
    public void setShelterDescription(String shelterDescription) { 
        this.shelterDescription = shelterDescription; 
    }
    
    public String getShelterWebsite() { return shelterWebsite; }
    public void setShelterWebsite(String shelterWebsite) { this.shelterWebsite = shelterWebsite; }
    
    public int getTotalPetsListed() { return totalPetsListed; }
    public void setTotalPetsListed(int totalPetsListed) { this.totalPetsListed = totalPetsListed; }
    
    public int getTotalPetsAdopted() { return totalPetsAdopted; }
    public void setTotalPetsAdopted(int totalPetsAdopted) { this.totalPetsAdopted = totalPetsAdopted; }
    
    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }
    
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { 
        this.verificationStatus = verificationStatus; 
    }
    
    public List<Pet> getListedPets() { return new ArrayList<>(listedPets); }
    
    public List<AdoptionRequest> getAdoptionRequests() { 
        return new ArrayList<>(adoptionRequests); 
    }
}
