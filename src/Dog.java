package com.pawpal.models;

/**
 * Dog class - Concrete implementation of Pet
 * Demonstrates Inheritance and Polymorphism
 */
public class Dog extends Pet {
    
    private String size; // SMALL, MEDIUM, LARGE, GIANT
    private double weight; // in kg
    private boolean isDogFriendly;
    private boolean isKidFriendly;
    private boolean isCatFriendly;
    private String trainingLevel; // UNTRAINED, BASIC, WELL_TRAINED, ADVANCED
    
    // Constructor
    public Dog(int petId, String petName, String breed, int age,
               String gender, String location, String size) {
        super(petId, petName, "Dog", breed, age, gender, location);
        this.size = size;
        this.weight = 0.0;
        this.isDogFriendly = true;
        this.isKidFriendly = true;
        this.isCatFriendly = false;
        this.trainingLevel = "BASIC";
    }
    
    // Implementing abstract methods (Polymorphism)
    @Override
    public String displayPetInfo() {
        return "🐶 DOG PROFILE 🐶\n" +
               "Name: " + petName +
               "\nBreed: " + breed +
               "\nAge: " + age + " years" +
               "\nGender: " + gender +
               "\nSize: " + size +
               "\nWeight: " + weight + " kg" +
               "\nTemperament: " + temperament +
               "\nLocation: " + location +
               "\nVaccinated: " + (isVaccinated ? "Yes" : "No") +
               "\nTraining Level: " + trainingLevel +
               "\n\nFriendly with: " +
               (isDogFriendly ? "✓ Dogs " : "") +
               (isKidFriendly ? "✓ Kids " : "") +
               (isCatFriendly ? "✓ Cats " : "") +
               "\n\nDescription: " + description;
    }
    
    @Override
    public String getSpecificCare() {
        String care = "🐾 CARE REQUIREMENTS FOR " + breed.toUpperCase() + ":\n\n";
        
        if ("SMALL".equals(size)) {
            care += "• Daily walks: 20-30 minutes\n";
            care += "• Exercise: Moderate\n";
            care += "• Space: Can adapt to apartments\n";
        } else if ("MEDIUM".equals(size)) {
            care += "• Daily walks: 30-60 minutes\n";
            care += "• Exercise: Moderate to High\n";
            care += "• Space: Needs regular space\n";
        } else if ("LARGE".equals(size)) {
            care += "• Daily walks: 60+ minutes\n";
            care += "• Exercise: High\n";
            care += "• Space: Needs yard and open space\n";
        }
        
        care += "• Grooming: Regular brushing\n";
        care += "• Training: Professional recommended\n";
        care += "• Vet Checkups: Twice yearly\n";
        care += "• Nutrition: High-quality dog food\n";
        
        return care;
    }
    
    @Override
    public String getIdealEnvironment() {
        return "Ideal Environment for " + petName + ":\n" +
               "• Home Type: " + (size.equals("SMALL") ? "Apartment or House" : 
                                  size.equals("MEDIUM") ? "House with small yard" : 
                                  "House with large yard/farm") +
               "\n• Climate: " + (size.equals("SMALL") ? "Any" : "Moderate, not too hot") +
               "\n• Family Type: " + (isKidFriendly ? "Family-friendly" : "Adults preferred") +
               "\n• Living with other pets: " +
               (isDogFriendly && isCatFriendly ? "Yes, any pets" :
                isDogFriendly ? "Only dogs" :
                isCatFriendly ? "Only cats" : "Prefers to be alone");
    }
    
    // Dog-specific methods
    public String getCompatibilityInfo() {
        return "Dog Friendly: " + (isDogFriendly ? "Yes ✓" : "No") +
               "\nKid Friendly: " + (isKidFriendly ? "Yes ✓" : "No") +
               "\nCat Friendly: " + (isCatFriendly ? "Yes ✓" : "No") +
               "\nTraining Level: " + trainingLevel;
    }
    
    public boolean isGoodForFamily() {
        return isKidFriendly && isVaccinated && trainingLevel.equals("WELL_TRAINED");
    }
    
    // Getters and Setters (Encapsulation)
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    
    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }
    
    public boolean isDogFriendly() { return isDogFriendly; }
    public void setDogFriendly(boolean dogFriendly) { isDogFriendly = dogFriendly; }
    
    public boolean isKidFriendly() { return isKidFriendly; }
    public void setKidFriendly(boolean kidFriendly) { isKidFriendly = kidFriendly; }
    
    public boolean isCatFriendly() { return isCatFriendly; }
    public void setCatFriendly(boolean catFriendly) { isCatFriendly = catFriendly; }
    
    public String getTrainingLevel() { return trainingLevel; }
    public void setTrainingLevel(String trainingLevel) { this.trainingLevel = trainingLevel; }
}
