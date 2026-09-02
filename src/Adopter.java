package com.pawpal.models;

import java.util.ArrayList;
import java.util.List;

/**
 * Adopter class - Represents users looking to adopt pets
 * Inherits from User
 * Demonstrates Inheritance and Polymorphism
 */
public class Adopter extends User {
    
    private String profession;
    private String householdType; // APARTMENT, HOUSE, FARM, etc.
    private int householdSize;
    private List<Pet> favoritePets;
    private List<AdoptionRequest> submittedRequests;
    private List<Pet> adoptedPets;
    private int totalAdoptedPets;
    private boolean petExperienceVerified;
    private String adoptionPreferences; // Dog-only, Cat-only, Multiple, etc.
    
    // Constructor
    public Adopter(int userId, String firstName, String lastName, String email,
                   String password, String phoneNumber) {
        super(userId, firstName, lastName, email, password, phoneNumber, "ADOPTER");
        this.totalAdoptedPets = 0;
        this.petExperienceVerified = false;
        this.favoritePets = new ArrayList<>();
        this.submittedRequests = new ArrayList<>();
        this.adoptedPets = new ArrayList<>();
    }
    
    // Implementing abstract methods (Polymorphism)
    @Override
    public String getDashboardPath() {
        return "pages/adopter-dashboard.html";
    }
    
    @Override
    public String getUserRole() {
        return "Pet Adopter";
    }
    
    // Adopter-specific methods
    public void addFavoritePet(Pet pet) {
        if (pet != null && !favoritePets.contains(pet)) {
            favoritePets.add(pet);
        }
    }
    
    public void removeFavoritePet(Pet pet) {
        if (pet != null) {
            favoritePets.remove(pet);
        }
    }
    
    public boolean isFavorite(Pet pet) {
        return pet != null && favoritePets.contains(pet);
    }
    
    public boolean submitAdoptionRequest(AdoptionRequest request) {
        if (request != null) {
            submittedRequests.add(request);
            return true;
        }
        return false;
    }
    
    public List<AdoptionRequest> getMyRequests() {
        return new ArrayList<>(submittedRequests);
    }
    
    public List<AdoptionRequest> getApprovedRequests() {
        List<AdoptionRequest> approvedRequests = new ArrayList<>();
        for (AdoptionRequest request : submittedRequests) {
            if ("APPROVED".equals(request.getStatus())) {
                approvedRequests.add(request);
            }
        }
        return approvedRequests;
    }
    
    public List<AdoptionRequest> getRejectedRequests() {
        List<AdoptionRequest> rejectedRequests = new ArrayList<>();
        for (AdoptionRequest request : submittedRequests) {
            if ("REJECTED".equals(request.getStatus())) {
                rejectedRequests.add(request);
            }
        }
        return rejectedRequests;
    }
    
    public void completedAdoption(Pet pet) {
        if (pet != null) {
            adoptedPets.add(pet);
            totalAdoptedPets++;
            removeFavoritePet(pet);
        }
    }
    
    public String getAdopterProfile() {
        return "Adopter: " + this.getFullName() +
               "\nHousehold: " + householdType +
               "\nHousehold Size: " + householdSize +
               "\nPets Adopted: " + totalAdoptedPets +
               "\nExperience Verified: " + petExperienceVerified +
               "\nPreferences: " + adoptionPreferences;
    }
    
    // Getters and Setters (Encapsulation)
    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }
    
    public String getHouseholdType() { return householdType; }
    public void setHouseholdType(String householdType) { this.householdType = householdType; }
    
    public int getHouseholdSize() { return householdSize; }
    public void setHouseholdSize(int householdSize) { this.householdSize = householdSize; }
    
    public List<Pet> getFavoritePets() { return new ArrayList<>(favoritePets); }
    
    public int getTotalAdoptedPets() { return totalAdoptedPets; }
    public void setTotalAdoptedPets(int totalAdoptedPets) { this.totalAdoptedPets = totalAdoptedPets; }
    
    public boolean isPetExperienceVerified() { return petExperienceVerified; }
    public void setPetExperienceVerified(boolean verified) { this.petExperienceVerified = verified; }
    
    public String getAdoptionPreferences() { return adoptionPreferences; }
    public void setAdoptionPreferences(String preferences) { this.adoptionPreferences = preferences; }
    
    public List<Pet> getAdoptedPets() { return new ArrayList<>(adoptedPets); }
}
