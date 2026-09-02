# 🐾 PawPal - Pet Adoption & Care Management System

A comprehensive Java OOP-based web application that connects people who want to adopt pets with shelters and individuals looking to find homes for them.

## 📋 Project Overview

PawPal is a full-stack pet adoption platform designed as a college project to demonstrate Object-Oriented Programming concepts in Java. The system manages pet listings, adoption requests, user accounts, and provides care management features.

### Key Features

🐶 **Pet Listings**
- Add pets for adoption with detailed information
- Upload pet photos
- Species, breed, age, gender tracking
- Vaccination status management
- Location and description

🔍 **Search & Filter**
- Search by animal type
- Filter by breed, age, gender, location
- View detailed pet profiles

❤️ **Adoption Requests**
- Users select pets and fill adoption forms
- Owner/Admin can approve or reject requests
- Home visit requirements
- Adoption fee processing

👤 **User Accounts**
- User registration and login (Admin, Owner, Adopter roles)
- Profile management
- Request history tracking
- Adoption statistics

📋 **Admin Dashboard**
- Manage all users and pets
- Approve/reject pet listings
- Review adoption requests
- View adoption statistics
- Generate reports

🏡 **Owner Dashboard**
- List pets for adoption
- View and respond to adoption requests
- Track adoption statistics
- Manage shelter profile
- View reviews and ratings

📊 **Adopter Dashboard**
- Browse available pets
- Save favorites
- Track adoption requests
- View adopted pets
- Pet care reminders
- Schedule vaccinations and check-ups
- Leave reviews

⭐ **Reviews**
- Adopters can leave reviews after adoption
- Rating system (1-5 stars)
- Helpful/Unhelpful tracking

📅 **Pet Care Records**
- Vaccination dates and history
- Medical records
- Feeding schedule tracking
- Reminders for upcoming appointments

## 🏗️ Project Structure

```
oops project 2/
├── src/                           # Java Backend Classes
│   ├── User.java                 # Abstract User base class
│   ├── Admin.java                # Admin user type
│   ├── Owner.java                # Pet Owner/Shelter user type
│   ├── Adopter.java              # Adopter user type
│   ├── Pet.java                  # Abstract Pet base class
│   ├── Dog.java                  # Dog pet type
│   ├── Cat.java                  # Cat pet type
│   ├── AdoptionRequest.java      # Adoption request model
│   ├── Review.java               # Review model
│   ├── VaccinationRecord.java    # Vaccination record model
│   ├── Notification.java         # Notification interface
│   ├── EmailNotification.java    # Email notification implementation
│   └── SMSNotification.java      # SMS notification implementation
│
├── database/
│   └── pawpal_schema.sql         # MySQL database schema and sample data
│
├── pages/                         # HTML Pages
│   ├── index.html                # Home page
│   ├── pets.html                 # Pet listing/search page
│   ├── pet-details.html          # Individual pet detail page
│   ├── adoption-form.html        # Adoption request form
│   ├── login.html                # User login
│   ├── register.html             # User registration
│   ├── admin-dashboard.html      # Admin dashboard
│   ├── owner-dashboard.html      # Owner/Shelter dashboard
│   ├── adopter-dashboard.html    # Adopter dashboard
│   ├── how-it-works.html         # How adoption works explanation
│   └── about.html                # About PawPal
│
├── css/
│   ├── style.css                 # Main stylesheet
│   ├── pets.css                  # Pet discovery page styles
│   └── dashboard.css             # Dashboard styles (cute pet theme)
│
├── js/
│   ├── pets.js                   # Pet listing functionality
│   ├── dashboard-admin.js        # Admin dashboard functionality
│   ├── dashboard-owner.js        # Owner dashboard functionality
│   └── dashboard-adopter.js      # Adopter dashboard functionality
│
└── README.md                      # This file
```

## 🎨 Design Theme

The application uses a cute, pet-associated theme with:
- **Light Pastel Color Palette:**
  - Peach (#f5b39e) - Primary accent
  - Coral (#e98268) - Highlights
  - Sage Green (#9eaf91) - Secondary accent
  - Lavender (#ddd6e8) - Soft accents
  - Cream (#fbf7ef) - Background

- **Visual Elements:**
  - 🐾 Paw print watermarks throughout
  - Cute emoji icons for different pet types
  - Rounded corners and soft shadows
  - Smooth transitions and animations
  - Pet-themed UI components

## 🔐 OOP Concepts Implemented

### 1. **Inheritance**
- `User` (abstract) → `Admin`, `Owner`, `Adopter`
- `Pet` (abstract) → `Dog`, `Cat`

### 2. **Encapsulation**
- Private fields with public getters and setters
- Data protection and controlled access

### 3. **Polymorphism**
- Abstract methods implemented differently in subclasses:
  - `displayPetInfo()` - Different for dogs and cats
  - `getSpecificCare()` - Species-specific care requirements
  - `getDashboardPath()` - Different dashboard for each user type

### 4. **Abstraction**
- Abstract classes: `User`, `Pet`
- Abstract methods: `displayPetInfo()`, `getIdealEnvironment()`, etc.
- Interface: `Notification`

### 5. **Interfaces**
- `Notification` interface with implementations:
  - `EmailNotification`
  - `SMSNotification`

## 📊 Database Schema

### Tables
- **users** - All user accounts
- **admins** - Admin-specific data
- **owners** - Shelter/owner-specific data
- **adopters** - Adopter-specific data
- **pets** - All pet listings
- **dogs** - Dog-specific attributes
- **cats** - Cat-specific attributes
- **adoption_requests** - Adoption request tracking
- **reviews** - User reviews and ratings
- **vaccination_records** - Pet medical records
- **favorites** - Saved favorite pets
- **notifications** - Notification history
- **adoption_statistics** - Analytics data

### Views
- `available_pets_view` - Verified, available pets
- `adoption_success_view` - Adoption success rates
- `adopter_history_view` - Adopter adoption history

## 🚀 How to Use

### Setup Instructions

1. **Import Database Schema**
   ```sql
   mysql -u root -p pawpal_db < database/pawpal_schema.sql
   ```

2. **Compile Java Classes**
   ```bash
   javac src/*.java
   ```

3. **Configure Backend Connection**
   - Update database credentials in Java backend
   - Set up MySQL connection pool

4. **Deploy Web Application**
   - Place HTML, CSS, JS files on web server
   - Configure API endpoints in JavaScript files

### User Workflows

#### Admin Workflow
1. Login with admin credentials
2. Access admin dashboard
3. Review pending pet listings
4. Approve/reject adoptions
5. Manage user accounts
6. View adoption statistics

#### Owner/Shelter Workflow
1. Register as pet owner/shelter
2. Complete shelter verification
3. List pets with details
4. Review adoption requests
5. Approve/reject applicants
6. Manage ratings and reviews

#### Adopter Workflow
1. Register as adopter
2. Complete adoption profile
3. Browse available pets
4. Save favorites
5. Submit adoption request
6. Track request status
7. Complete adoption
8. Leave review
9. Manage pet care records

## 📱 Responsive Design

The application is fully responsive across:
- **Desktop** (1920px and above)
- **Tablet** (768px - 1024px)
- **Mobile** (320px - 767px)

## 🔄 State Management

- Session-based user authentication
- Local storage for preferences
- Real-time status updates for adoption requests
- Dashboard auto-refresh functionality

## 🌐 API Endpoints (Proposed)

```
GET    /api/pets                    # Get all available pets
GET    /api/pets/:id               # Get pet details
POST   /api/pets                   # Create new pet (Owner)
PUT    /api/pets/:id               # Update pet (Owner)
DELETE /api/pets/:id               # Delete pet (Owner/Admin)

GET    /api/adoption-requests      # Get adoption requests
POST   /api/adoption-requests      # Submit adoption request
PUT    /api/adoption-requests/:id  # Update request status (Admin/Owner)

GET    /api/reviews                # Get reviews
POST   /api/reviews                # Submit review (Adopter)

GET    /api/user/profile           # Get user profile
PUT    /api/user/profile           # Update user profile

GET    /api/admin/statistics       # Get adoption statistics
GET    /api/admin/reports          # Generate reports
```

## 🎯 Sample Data

The database includes sample data:
- 1 Admin user
- 1 Shelter (Owner)
- 1 Adopter
- 2 Sample pets (Dog & Cat)
- Vaccination records
- Sample adoption statistics

## 🔒 Security Features

- Password hashing for user accounts
- User role-based access control (RBAC)
- Session management
- Input validation on forms
- Protected API endpoints

## 🌟 Additional Features

- **Email & SMS Notifications** - Notify users of important events
- **Pet Care Reminders** - Vaccination and check-up reminders
- **Rating System** - Shelter ratings from adopters
- **Analytics Dashboard** - Adoption statistics and trends
- **Report Generation** - PDF/CSV export functionality
- **Advanced Search** - Full-text search and filters
- **Favorites System** - Save pets for later viewing

## 💡 Future Enhancements

- Mobile app version
- Video tour of pets
- Virtual adoption consultation
- Pet insurance integration
- Microchip registration system
- Social sharing features
- Pet training resources
- Veterinary directory integration
- Payment gateway integration

## 🐛 Known Limitations

- JavaScript functions are placeholder implementations
- Backend API calls need to be connected to actual server
- Image upload functionality needs server setup
- Email/SMS requires service provider configuration
- Database credentials need to be configured

## 📚 Technologies Used

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with animations
- **JavaScript** - Interactivity and DOM manipulation
- **Google Fonts** - Typography

### Backend
- **Java 8+** - OOP implementation
- **MySQL** - Database

### Design Principles
- Responsive Web Design
- Mobile-First Approach
- Accessibility (WCAG 2.1)
- Semantic HTML

## 👨‍💻 Learning Outcomes

This project demonstrates:
- ✅ Object-Oriented Programming principles in Java
- ✅ Database design and SQL
- ✅ Full-stack web development
- ✅ User role management
- ✅ CRUD operations
- ✅ Authentication & Authorization
- ✅ Responsive UI/UX design
- ✅ Real-world application architecture

## 📄 License

This project is created for educational purposes.

## 👥 Authors

Created as a comprehensive college project demonstrating OOP concepts and full-stack web development.

## 📞 Support

For questions or issues, please refer to the documentation or contact the development team.

---

## 🐾 PawPal - Making Adoption Happen! ❤️

*Every pet deserves a loving home, and every home deserves a loyal companion.*
