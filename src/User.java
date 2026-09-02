package com.pawpal.models;

/**
 * Abstract User class - Base class for all user types
 * Demonstrates Abstraction and Inheritance
 */
public abstract class User {
    
    private int userId;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String registrationDate;
    private String userType; // ADMIN, OWNER, ADOPTER
    private boolean isActive;
    
    // Constructor
    public User(int userId, String firstName, String lastName, String email, 
                String password, String phoneNumber, String userType) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.userType = userType;
        this.isActive = true;
    }
    
    // Abstract method - to be implemented by subclasses (Polymorphism)
    public abstract String getDashboardPath();
    public abstract String getUserRole();
    
    // Getters and Setters (Encapsulation)
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getFullName() { return firstName + " " + lastName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    
    public String getZipCode() { return zipCode; }
    public void setZipCode(String zipCode) { this.zipCode = zipCode; }
    
    public String getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(String registrationDate) { 
        this.registrationDate = registrationDate; 
    }
    
    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }
    
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    
    // Common methods
    public String getFullAddress() {
        return address + ", " + city + ", " + state + " " + zipCode;
    }
    
    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", fullName='" + getFullName() + '\'' +
                ", email='" + email + '\'' +
                ", userType='" + userType + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}
