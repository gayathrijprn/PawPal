-- =====================================================
-- PAWPAL - Pet Adoption & Care Management System
-- Database Schema
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS pawpal_db;
USE pawpal_db;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    user_type ENUM('ADMIN', 'OWNER', 'ADOPTER') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    profile_image_url VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    INDEX idx_registration_date (registration_date)
);

-- =====================================================
-- ADMIN TABLE
-- =====================================================
CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    admin_level ENUM('SUPER_ADMIN', 'ADMIN', 'MODERATOR') DEFAULT 'ADMIN',
    department VARCHAR(100),
    last_login_date TIMESTAMP NULL,
    total_users_managed INT DEFAULT 0,
    total_pets_managed INT DEFAULT 0,
    total_requests_processed INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =====================================================
-- OWNERS/SHELTERS TABLE
-- =====================================================
CREATE TABLE owners (
    owner_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    shelter_name VARCHAR(150),
    shelter_description TEXT,
    shelter_website VARCHAR(255),
    total_pets_listed INT DEFAULT 0,
    total_pets_adopted INT DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    verification_status ENUM('VERIFIED', 'PENDING', 'REJECTED') DEFAULT 'PENDING',
    verification_date TIMESTAMP NULL,
    verified_by INT,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_verification_status (verification_status),
    INDEX idx_rating (average_rating)
);

-- =====================================================
-- ADOPTERS TABLE
-- =====================================================
CREATE TABLE adopters (
    adopter_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    profession VARCHAR(100),
    household_type ENUM('APARTMENT', 'HOUSE', 'FARM', 'OTHER') DEFAULT 'HOUSE',
    household_size INT,
    total_adopted_pets INT DEFAULT 0,
    pet_experience_verified BOOLEAN DEFAULT FALSE,
    adoption_preferences VARCHAR(255),
    employment_verification BOOLEAN DEFAULT FALSE,
    reference_check BOOLEAN DEFAULT FALSE,
    home_visit_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_household_type (household_type),
    INDEX idx_experience_verified (pet_experience_verified)
);

-- =====================================================
-- PETS TABLE
-- =====================================================
CREATE TABLE pets (
    pet_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_name VARCHAR(100) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    age INT,
    gender ENUM('MALE', 'FEMALE', 'UNKNOWN') DEFAULT 'UNKNOWN',
    is_vaccinated BOOLEAN DEFAULT FALSE,
    vaccination_date DATE NULL,
    location VARCHAR(255),
    description TEXT,
    photo_url VARCHAR(255),
    status ENUM('AVAILABLE', 'ADOPTED', 'PENDING_APPROVAL', 'REJECTED') DEFAULT 'PENDING_APPROVAL',
    owner_id INT NOT NULL,
    listing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temperament VARCHAR(100),
    adoption_fee DECIMAL(10, 2) DEFAULT 0,
    rejection_reason TEXT,
    approved_by INT,
    approval_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON DELETE CASCADE,
    INDEX idx_species (species),
    INDEX idx_status (status),
    INDEX idx_owner_id (owner_id),
    INDEX idx_breed (breed),
    FULLTEXT INDEX ft_search (pet_name, breed, description)
);

-- =====================================================
-- DOGS TABLE (Pet Sub-type)
-- =====================================================
CREATE TABLE dogs (
    dog_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT NOT NULL UNIQUE,
    size ENUM('SMALL', 'MEDIUM', 'LARGE', 'GIANT') DEFAULT 'MEDIUM',
    weight DECIMAL(6, 2),
    is_dog_friendly BOOLEAN DEFAULT TRUE,
    is_kid_friendly BOOLEAN DEFAULT TRUE,
    is_cat_friendly BOOLEAN DEFAULT FALSE,
    training_level ENUM('UNTRAINED', 'BASIC', 'WELL_TRAINED', 'ADVANCED') DEFAULT 'BASIC',
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE
);

-- =====================================================
-- CATS TABLE (Pet Sub-type)
-- =====================================================
CREATE TABLE cats (
    cat_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT NOT NULL UNIQUE,
    coat_type ENUM('SHORT', 'MEDIUM', 'LONG') DEFAULT 'SHORT',
    weight DECIMAL(6, 2),
    is_indoor_only BOOLEAN DEFAULT TRUE,
    is_dog_friendly BOOLEAN DEFAULT FALSE,
    is_kid_friendly BOOLEAN DEFAULT TRUE,
    is_outdoor_experienced BOOLEAN DEFAULT FALSE,
    personality ENUM('PLAYFUL', 'CALM', 'INDEPENDENT', 'CUDDLY', 'SHY') DEFAULT 'INDEPENDENT',
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE
);

-- =====================================================
-- ADOPTION REQUESTS TABLE
-- =====================================================
CREATE TABLE adoption_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    adopter_id INT NOT NULL,
    pet_id INT NOT NULL,
    owner_id INT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN') DEFAULT 'PENDING',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_date TIMESTAMP NULL,
    reason_for_adoption TEXT,
    household_info TEXT,
    experience TEXT,
    reference_contact VARCHAR(255),
    home_visit_required BOOLEAN DEFAULT FALSE,
    home_visit_completed BOOLEAN DEFAULT FALSE,
    processed_by INT,
    rejection_reason TEXT,
    notes TEXT,
    adoption_fee_charged DECIMAL(10, 2) DEFAULT 0,
    paid_fee BOOLEAN DEFAULT FALSE,
    payment_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (adopter_id) REFERENCES adopters(adopter_id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_request_date (request_date),
    INDEX idx_adopter_id (adopter_id),
    INDEX idx_pet_id (pet_id)
);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    adopter_id INT NOT NULL,
    pet_id INT NOT NULL,
    owner_id INT NOT NULL,
    rating DECIMAL(3, 1) CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(150),
    review_text TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    unhelpful_count INT DEFAULT 0,
    status ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED') DEFAULT 'PENDING_APPROVAL',
    approved_by INT,
    approval_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (adopter_id) REFERENCES adopters(adopter_id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON DELETE CASCADE,
    INDEX idx_rating (rating),
    INDEX idx_review_date (review_date),
    INDEX idx_status (status),
    FULLTEXT INDEX ft_review_search (title, review_text)
);

-- =====================================================
-- VACCINATION RECORDS TABLE
-- =====================================================
CREATE TABLE vaccination_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT NOT NULL,
    vaccine_name VARCHAR(100),
    vaccination_date DATE,
    next_due_date DATE,
    veterinarian_name VARCHAR(100),
    clinic_name VARCHAR(150),
    clinic_phone VARCHAR(20),
    completed BOOLEAN DEFAULT TRUE,
    cost DECIMAL(10, 2),
    batch_number VARCHAR(100),
    notes TEXT,
    certificate_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE,
    INDEX idx_pet_id (pet_id),
    INDEX idx_vaccination_date (vaccination_date),
    INDEX idx_next_due_date (next_due_date)
);

-- =====================================================
-- FAVORITES TABLE
-- =====================================================
CREATE TABLE favorites (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    adopter_id INT NOT NULL,
    pet_id INT NOT NULL,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (adopter_id) REFERENCES adopters(adopter_id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (adopter_id, pet_id),
    INDEX idx_adopter_id (adopter_id)
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    recipient_id INT NOT NULL,
    sender_id INT,
    notification_type ENUM('EMAIL', 'SMS', 'PUSH', 'IN_APP') DEFAULT 'IN_APP',
    subject VARCHAR(150),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_recipient_id (recipient_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- ADOPTION STATISTICS TABLE
-- =====================================================
CREATE TABLE adoption_statistics (
    stat_id INT PRIMARY KEY AUTO_INCREMENT,
    stat_date DATE DEFAULT CURDATE(),
    total_adoptions INT DEFAULT 0,
    total_pending_requests INT DEFAULT 0,
    total_active_pets INT DEFAULT 0,
    total_users INT DEFAULT 0,
    total_reviews INT DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_date (stat_date)
);

-- =====================================================
-- CREATE SAMPLE DATA
-- =====================================================

-- Sample Admin User
INSERT INTO users (first_name, last_name, email, password, phone_number, address, city, state, zip_code, user_type)
VALUES ('Admin', 'PawPal', 'admin@pawpal.com', 'admin@123', '9876543210', '123 Admin St', 'Kochi', 'Kerala', '682001', 'ADMIN');

INSERT INTO admins (user_id, admin_level, department, total_users_managed, total_pets_managed, total_requests_processed)
VALUES (1, 'SUPER_ADMIN', 'Management', 50, 100, 80);

-- Sample Owner/Shelter User
INSERT INTO users (first_name, last_name, email, password, phone_number, address, city, state, zip_code, user_type)
VALUES ('Happy', 'Paws Shelter', 'happypaws@email.com', 'shelter@123', '9876543211', '456 Shelter Ave', 'Kochi', 'Kerala', '682002', 'OWNER');

INSERT INTO owners (user_id, shelter_name, shelter_description, shelter_website, verification_status, total_pets_listed, total_pets_adopted, average_rating)
VALUES (2, 'Happy Paws Shelter', 'A caring shelter dedicated to finding homes for abandoned pets', 'www.happypaws.com', 'VERIFIED', 15, 45, 4.7);

-- Sample Adopter User
INSERT INTO users (first_name, last_name, email, password, phone_number, address, city, state, zip_code, user_type)
VALUES ('John', 'Doe', 'john@example.com', 'john@123', '9876543212', '789 Adopter Lane', 'Thiruvananthapuram', 'Kerala', '695001', 'ADOPTER');

INSERT INTO adopters (user_id, profession, household_type, household_size, pet_experience_verified, employment_verification)
VALUES (3, 'Software Engineer', 'HOUSE', 3, TRUE, TRUE);

-- Sample Pet (Dog)
INSERT INTO pets (pet_name, species, breed, age, gender, is_vaccinated, location, description, status, owner_id, temperament, adoption_fee)
VALUES ('Buddy', 'Dog', 'Golden Retriever', 2, 'MALE', TRUE, 'Kochi, Kerala', 'A friendly and energetic Golden Retriever looking for a loving home. Great with kids and other dogs.', 'AVAILABLE', 2, 'FRIENDLY', 5000);

INSERT INTO dogs (pet_id, size, weight, is_dog_friendly, is_kid_friendly, is_cat_friendly, training_level)
VALUES (1, 'LARGE', 32.5, TRUE, TRUE, FALSE, 'WELL_TRAINED');

-- Sample Pet (Cat)
INSERT INTO pets (pet_name, species, breed, age, gender, is_vaccinated, location, description, status, owner_id, temperament, adoption_fee)
VALUES ('Luna', 'Cat', 'Persian', 1, 'FEMALE', TRUE, 'Kochi, Kerala', 'A beautiful and calm Persian cat. Prefers quiet environments. Indoor only.', 'AVAILABLE', 2, 'CALM', 2000);

INSERT INTO cats (pet_id, coat_type, weight, is_indoor_only, is_dog_friendly, is_kid_friendly, personality)
VALUES (2, 'LONG', 4.5, TRUE, FALSE, TRUE, 'CALM');

-- =====================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================

-- Additional performance indexes
CREATE INDEX idx_users_email_password ON users(email, password);
CREATE INDEX idx_pets_owner_status ON pets(owner_id, status);
CREATE INDEX idx_adoption_requests_status_date ON adoption_requests(status, request_date);
CREATE INDEX idx_reviews_owner_rating ON reviews(owner_id, rating);

-- =====================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for Available Pets
CREATE VIEW available_pets_view AS
SELECT 
    p.pet_id,
    p.pet_name,
    p.species,
    p.breed,
    p.age,
    p.gender,
    p.location,
    p.temperament,
    p.adoption_fee,
    o.shelter_name,
    o.average_rating
FROM pets p
JOIN owners o ON p.owner_id = o.owner_id
WHERE p.status = 'AVAILABLE' AND o.verification_status = 'VERIFIED'
ORDER BY p.listing_date DESC;

-- View for Adoption Success Rate
CREATE VIEW adoption_success_view AS
SELECT 
    o.owner_id,
    o.shelter_name,
    COUNT(ar.request_id) as total_requests,
    SUM(CASE WHEN ar.status = 'APPROVED' THEN 1 ELSE 0 END) as approved_requests,
    ROUND(SUM(CASE WHEN ar.status = 'APPROVED' THEN 1 ELSE 0 END) * 100.0 / COUNT(ar.request_id), 2) as approval_rate
FROM owners o
LEFT JOIN adoption_requests ar ON o.owner_id = ar.owner_id
GROUP BY o.owner_id;

-- View for Adopter History
CREATE VIEW adopter_history_view AS
SELECT 
    a.adopter_id,
    u.first_name,
    u.last_name,
    COUNT(DISTINCT ar.request_id) as total_requests,
    SUM(CASE WHEN ar.status = 'APPROVED' THEN 1 ELSE 0 END) as approved_adoptions,
    AVG(r.rating) as average_review_rating
FROM adopters a
JOIN users u ON a.user_id = u.user_id
LEFT JOIN adoption_requests ar ON a.adopter_id = ar.adopter_id
LEFT JOIN reviews r ON a.adopter_id = r.adopter_id
GROUP BY a.adopter_id;

-- =====================================================
-- DATABASE SETUP COMPLETE
-- =====================================================
