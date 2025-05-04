# SkillHub

SkillHub is a platform designed to connect freelancers and employers, enabling the seamless posting of jobs, bidding on projects, and providing reviews for services rendered. The application aims to facilitate collaboration and create opportunities for individuals in various fields.

## Features

- **User Authentication:** Secure login and registration system for both freelancers and employers
- **Job Marketplace:** Employers can post job listings and freelancers can browse available projects
- **Bidding System:** Freelancers can place bids on jobs, allowing employers to choose the best candidate for their projects
- **Review System:** Users can provide feedback on their experiences, fostering a community of trust and quality service
- **Real-time Notifications:** Stay updated with instant notifications for new bids, messages, and project updates
- **Profile Management:** Comprehensive profile system for showcasing skills, experience, and portfolio
- **Search & Filter:** Advanced search functionality to find relevant jobs and talents
- **Performance Optimized:** Utilizes Redis caching and MongoDB indexing for fast response times
- **Real-time Analytics:** Admin dashboard with real-time platform statistics and visualizations
- **Secure Payments:** Integrated wallet system with secure transaction handling

## Technology Stack

### Frontend

- React.js with Vite for fast development
- Material-UI & TailwindCSS for styling
- Redux Toolkit for state management
- Socket.io for real-time features
- Recharts for data visualization

### Backend

- Node.js
- Express.js
- MongoDB with optimized indexing
- Redis for caching
- JWT for authentication
- Socket.io for real-time communication
- Swagger for API documentation

### DevOps & Testing

- Jest for unit testing
- Performance testing suite
- Docker support
- Continuous monitoring
- Automated cache management

## Performance Features

- Redis caching for frequently accessed data
- Optimized MongoDB indexing
- Rate limiting for API protection
- Response compression
- Static asset optimization
- Lazy loading components

## Group 06

| Name         | Roll No.     |
| ------------ | ------------ |
| Mithun U     | S20220010139 |
| Varshitha B  | S20220010028 |
| Shrishti     | S20220010202 |
| Trinay Mitra | S20220010194 |
| Vikas        | S20220010185 |

# Getting Started

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis (v3.1.2)
- npm or yarn package manager

## Installation Guide

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/codegasms/SkillHub.git
   cd skillhub
   ```

2. **Environment Setup:**
   Create `.env` files in both client and server directories:

   Server `.env`:

   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   REDIS_URL=your_redis_url
   ```

   Client `.env`:

   ```
   VITE_API_URL=http://localhost:5000
   ```

3. **Install Dependencies:**

   Install root dependencies:

   ```bash
   npm install
   ```

   Server setup:

   ```bash
   cd server
   npm install
   ```

   Client setup:

   ```bash
   cd ../client
   npm install
   ```

4. **Database Setup:**

   - Ensure MongoDB is running on your system
   - Start Redis server
   - The server will automatically create the required collections and indexes

5. **Running the Application:**

   Development mode:

   ```bash
   # From the root directory
   npm run dev     # Runs both client and server concurrently
   ```

   Or run separately:

   ```bash
   # Run server (from server directory)
   npm start      # Regular mode
   npm run dev    # Development mode with nodemon

   # Run client (from client directory)
   npm run dev    # Vite dev server
   ```

   The client will run on `http://localhost:5173` and the server on `http://localhost:5000`

6. **Running Tests:**
   ```bash
   # From server directory
   npm test                # Run all tests
   npm run test:coverage   # Run tests with coverage report
   npm run test:performance # Run performance tests
   ```

## Usage Guide

1. **Registration/Login:**

   - Create a new account or login with existing credentials
   - Choose between Freelancer or Employer account type
   - Complete your profile with skills and portfolio

2. **For Employers:**

   - Post new jobs with detailed descriptions and requirements
   - Review and accept bids from freelancers
   - Manage ongoing projects through the dashboard
   - Release payments and provide detailed reviews
   - Track project progress and communication

3. **For Freelancers:**

   - Browse available projects with advanced filters
   - Submit competitive bids on interesting projects
   - Manage ongoing work through the dashboard
   - Receive secure payments
   - Build reputation through client feedback
   - Showcase portfolio and skills

4. **For Administrators:**
   - Access admin dashboard for platform overview
   - Monitor user activities and transactions
   - View real-time analytics and reports
   - Manage user accounts and permissions
   - Configure system settings

## API Documentation

Access the API documentation at `http://localhost:5000/api-docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape SkillHub
- Special thanks to our mentors and advisors
