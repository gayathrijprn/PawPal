package com.pawpal.models;

/**
 * Abstract Pet class - Base class for all pet types
 * Demonstrates Abstraction and Inheritance
 */
public abstract class Pet {
    
    protected int petId;
    protected String petName;
    protected String species; // Dog, Cat, Rabbit, Bird, etc.
    protected String breed;
    protected int age; // in years
    protected String gender; // MALE, FEMALE
    protected boolean isVaccinated;
    protected String vaccinationDate;
    protected String location;
    protected String description;
    protected String photoUrl;
    protected String status; // AVAILABLE, ADOPTED, PENDING_APPROVAL
    protected int ownerId;
    protected String listingDate;
    protected String temperament; // FRIENDLY, SHY, ENERGETIC, etc.
    protected double adoptionFee;
    protected String rejectionReason;
    
    // Constructor
    public Pet(int petId, String petName, String species, String breed,
               int age, String gender, String location) {
        this.petId = petId;
        this.petName = petName;
        this.species = species;
        this.breed = breed;
        this.age = age;
        this.gender = gender;
        this.location = location;
        this.status = "PENDING_APPROVAL";
        this.isVaccinated = false;
    }
    
    // Abstract methods - to be implemented by subclasses (Polymorphism)
    public abstract String displayPetInfo();
    public abstract String getSpecificCare();
    public abstract String getIdealEnvironment();
    
    // Common methods
    public String getBasicInfo() {
        return "Name: " + petName +
               "\nBreed: " + breed +
               "\nAge: " + age + " years" +
               "\nGender: " + gender +
               "\nLocation: " + location;
    }
    
    public boolean updateVaccinationStatus(String vaccinationDate) {
        this.isVaccinated = true;
        this.vaccinationDate = vaccinationDate;
        return true;
    }
    
    // Getters and Setters (Encapsulation)
    public int getPetId() { return petId; }
    public void setPetId(int petId) { this.petId = petId; }
    
    public String getPetName() { return petName; }
    public void setPetName(String petName) { this.petName = petName; }
    
    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }
    
    public String getBreed() { return breed; }
    public void setBreed(String breed) { this.breed = breed; }
    
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public boolean isVaccinated() { return isVaccinated; }
    public void setVaccinated(boolean vaccinated) { isVaccinated = vaccinated; }
    
    public String getVaccinationDate() { return vaccinationDate; }
    public void setVaccinationDate(String vaccinationDate) { 
        this.vaccinationDate = vaccinationDate; 
    }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public int getOwnerId() { return ownerId; }
    public void setOwnerId(int ownerId) { this.ownerId = ownerId; }
    
    public String getListingDate() { return listingDate; }
    public void setListingDate(String listingDate) { this.listingDate = listingDate; }
    
    public String getTemperament() { return temperament; }
    public void setTemperament(String temperament) { this.temperament = temperament; }
    
    public double getAdoptionFee() { return adoptionFee; }
    public void setAdoptionFee(double adoptionFee) { this.adoptionFee = adoptionFee; }
    
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { 
        this.rejectionReason = rejectionReason; 
    }
    
    @Override
    public String toString() {
        return "Pet{" +
                "petId=" + petId +
                ", petName='" + petName + '\'' +
                ", species='" + species + '\'' +
                ", breed='" + breed + '\'' +
                ", age=" + age +
                ", status='" + status + '\'' +
                '}';
    }
}
