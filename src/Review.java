package com.pawpal.models;

/**
 * Review class - Tracks reviews from adopters after adoption
 */
public class Review {
    
    private int reviewId;
    private int adopterId;
    private int petId;
    private int ownerId;
    private double rating; // 1-5 stars
    private String title;
    private String reviewText;
    private String reviewDate;
    private boolean isVerifiedPurchase; // Has the adoption been completed?
    private int helpfulCount;
    private int unhelpfulCount;
    private String status; // PENDING_APPROVAL, APPROVED, REJECTED
    
    // Constructor
    public Review(int reviewId, int adopterId, int petId, int ownerId, 
                  double rating, String title, String reviewText) {
        this.reviewId = reviewId;
        this.adopterId = adopterId;
        this.petId = petId;
        this.ownerId = ownerId;
        this.rating = rating;
        this.title = title;
        this.reviewText = reviewText;
        this.isVerifiedPurchase = false;
        this.helpfulCount = 0;
        this.unhelpfulCount = 0;
        this.status = "PENDING_APPROVAL";
    }
    
    // Methods
    public boolean isValidRating() {
        return rating >= 1 && rating <= 5;
    }
    
    public String getRatingDisplay() {
        return "★".repeat((int) rating) + "☆".repeat((int)(5 - rating));
    }
    
    public void markAsHelpful() {
        this.helpfulCount++;
    }
    
    public void markAsUnhelpful() {
        this.unhelpfulCount++;
    }
    
    public double getHelpfulnessScore() {
        int total = helpfulCount + unhelpfulCount;
        if (total == 0) return 0;
        return (double) helpfulCount / total;
    }
    
    public String getReviewSummary() {
        return "Review ID: " + reviewId +
               "\nRating: " + getRatingDisplay() + " (" + rating + "/5)" +
               "\nTitle: " + title +
               "\nPet ID: " + petId +
               "\nDate: " + reviewDate +
               "\nVerified: " + (isVerifiedPurchase ? "Yes" : "No") +
               "\nStatus: " + status;
    }
    
    // Getters and Setters (Encapsulation)
    public int getReviewId() { return reviewId; }
    public void setReviewId(int reviewId) { this.reviewId = reviewId; }
    
    public int getAdopterId() { return adopterId; }
    public void setAdopterId(int adopterId) { this.adopterId = adopterId; }
    
    public int getPetId() { return petId; }
    public void setPetId(int petId) { this.petId = petId; }
    
    public int getOwnerId() { return ownerId; }
    public void setOwnerId(int ownerId) { this.ownerId = ownerId; }
    
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getReviewText() { return reviewText; }
    public void setReviewText(String reviewText) { this.reviewText = reviewText; }
    
    public String getReviewDate() { return reviewDate; }
    public void setReviewDate(String reviewDate) { this.reviewDate = reviewDate; }
    
    public boolean isVerifiedPurchase() { return isVerifiedPurchase; }
    public void setVerifiedPurchase(boolean verifiedPurchase) { 
        isVerifiedPurchase = verifiedPurchase; 
    }
    
    public int getHelpfulCount() { return helpfulCount; }
    public void setHelpfulCount(int helpfulCount) { this.helpfulCount = helpfulCount; }
    
    public int getUnhelpfulCount() { return unhelpfulCount; }
    public void setUnhelpfulCount(int unhelpfulCount) { this.unhelpfulCount = unhelpfulCount; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
