package com.pawpal.models;

/**
 * Cat class - Concrete implementation of Pet
 * Demonstrates Inheritance and Polymorphism
 */
public class Cat extends Pet {
    
    private String coatType; // SHORT, MEDIUM, LONG
    private double weight; // in kg
    private boolean isIndoorOnly;
    private boolean isDogFriendly;
    private boolean isKidFriendly;
    private boolean isOutdoorExperienced;
    private String personality; // PLAYFUL, CALM, INDEPENDENT, CUDDLY, SHY
    
    // Constructor
    public Cat(int petId, String petName, String breed, int age,
               String gender, String location, String coatType) {
        super(petId, petName, "Cat", breed, age, gender, location);
        this.coatType = coatType;
        this.weight = 0.0;
        this.isIndoorOnly = true;
        this.isDogFriendly = false;
        this.isKidFriendly = true;
        this.isOutdoorExperienced = false;
        this.personality = "INDEPENDENT";
    }
    
    // Implementing abstract methods (Polymorphism)
    @Override
    public String displayPetInfo() {
        return "🐱 CAT PROFILE 🐱\n" +
               "Name: " + petName +
               "\nBreed: " + breed +
               "\nAge: " + age + " years" +
               "\nGender: " + gender +
               "\nCoat Type: " + coatType +
               "\nWeight: " + weight + " kg" +
               "\nPersonality: " + personality +
               "\nLocation: " + location +
               "\nVaccinated: " + (isVaccinated ? "Yes" : "No") +
               "\nIndoor Only: " + (isIndoorOnly ? "Yes" : "Can go outdoors") +
               "\n\nFriendly with: " +
               (isDogFriendly ? "✓ Dogs " : "") +
               (isKidFriendly ? "✓ Kids " : "") +
               "\n\nDescription: " + description;
    }
    
    @Override
    public String getSpecificCare() {
        String care = "🐾 CARE REQUIREMENTS FOR " + breed.toUpperCase() + ":\n\n";
        
        care += "• Feeding: 2-3 meals per day\n";
        care += "• Fresh water: Available always\n";
        care += "• Litter box: Cleaned daily\n";
        
        if ("SHORT".equals(coatType)) {
            care += "• Grooming: Brushing 2-3 times per week\n";
        } else if ("MEDIUM".equals(coatType)) {
            care += "• Grooming: Brushing 3-4 times per week\n";
        } else if ("LONG".equals(coatType)) {
            care += "• Grooming: Daily brushing recommended\n";
        }
        
        care += "• Playtime: 20-30 minutes daily\n";
        care += "• Mental stimulation: Toys and climbing structures\n";
        care += "• Vet Checkups: Once yearly\n";
        care += "• Nail trimming: Every 2-3 weeks\n";
        
        return care;
    }
    
    @Override
    public String getIdealEnvironment() {
        return "Ideal Environment for " + petName + ":\n" +
               "• Home Type: " + (isIndoorOnly ? "Indoor apartment or house" : "Can be indoor/outdoor") +
               "\n• Climate: Any (prefers moderate temperatures)" +
               "\n• Noise Level: Prefers quiet to moderate environments" +
               "\n• Family Type: " + (isKidFriendly ? "Family-friendly (calm kids preferred)" : "Adults preferred") +
               "\n• Living with other pets: " +
               (isDogFriendly ? "Gets along with calm dogs" :
                "Prefers to be the only cat" +
                (isDogFriendly ? " or with dogs" : "")) +
               "\n• Personalty: " + personality;
    }
    
    // Cat-specific methods
    public String getCompatibilityInfo() {
        return "Dog Friendly: " + (isDogFriendly ? "Yes ✓" : "Prefers cats only") +
               "\nKid Friendly: " + (isKidFriendly ? "Yes ✓" : "No") +
               "\nIndoor/Outdoor: " + (isIndoorOnly ? "Indoor only" : "Indoor/Outdoor") +
               "\nPersonality: " + personality;
    }
    
    public boolean isGoodForApartment() {
        return isIndoorOnly && !personality.equals("PLAYFUL");
    }
    
    public boolean needsSpecialGrooming() {
        return "LONG".equals(coatType) || "MEDIUM".equals(coatType);
    }
    
    // Getters and Setters (Encapsulation)
    public String getCoatType() { return coatType; }
    public void setCoatType(String coatType) { this.coatType = coatType; }
    
    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
    
    public boolean isIndoorOnly() { return isIndoorOnly; }
    public void setIndoorOnly(boolean indoorOnly) { isIndoorOnly = indoorOnly; }
    
    public boolean isDogFriendly() { return isDogFriendly; }
    public void setDogFriendly(boolean dogFriendly) { isDogFriendly = dogFriendly; }
    
    public boolean isKidFriendly() { return isKidFriendly; }
    public void setKidFriendly(boolean kidFriendly) { isKidFriendly = kidFriendly; }
    
    public boolean isOutdoorExperienced() { return isOutdoorExperienced; }
    public void setOutdoorExperienced(boolean outdoorExperienced) { 
        isOutdoorExperienced = outdoorExperienced; 
    }
    
    public String getPersonality() { return personality; }
    public void setPersonality(String personality) { this.personality = personality; }
}
