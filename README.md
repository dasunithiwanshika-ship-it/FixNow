# FixNow

FixNow is a comprehensive local service booking platform that connects customers with skilled workers (plumbers, electricians, repair workers, etc.) in their area. Built as a production-level mobile application, it streamlines the process of finding, hiring, and managing local services.

## Tech Stack

- **Frontend**: React Native (Expo preferred)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT + bcrypt
- **Image Upload**: Multer or Cloudinary
- **Payment**: Stripe or PayHere
- **Deployment**: Render or Railway

## Main Features

- **User Roles**: Customer and Worker (Service Provider)
- **Authentication**: Secure user registration and login with JWT tokens
- **Service Requests**: Customers can create detailed job requests
- **Job Management**: Workers can view, accept, and manage jobs
- **Task Progress Tracking**: Status updates from Posted → Accepted → In Progress → Completed → Paid → Reviewed
- **Auto-Budget Suggestion**: AI-based or rule-based budget estimation based on service type and location
- **Payment Integration**: Secure payments after job completion
- **Worker Portfolio**: Showcase completed jobs and ratings
- **Ratings & Reviews**: Customer feedback system
- **Filtering**: Search workers by location, budget, rating, and category
- **Image Upload**: Support for job photos and worker profiles

## Database Collections

1. **Users**: Stores customer and worker profiles
2. **ServiceRequests**: Job postings and task details
3. **Reviews**: Customer ratings and feedback

## Project Structure

```
FixNow/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   └── services/
│   ├── App.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Service Requests
- `GET /api/services` - List all services
- `POST /api/services` - Create new service request
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id/status` - Update task status

### Payments
- `POST /api/payments/create-intent` - Create payment intent

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- React Native development environment
- Expo CLI (if using Expo)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FixNow
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm installstart
   # Set up environment variables in .env
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # For Expo: npx expo start --clear
   # For React Native CLI: npx react-native run-android or run-ios
   ```

### Environment Variables

Create a `.env` file in the backend directory:

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
PORT=5000
```

## Deployment

- **Backend**: Deploy to Render, Railway, or Heroku
- **Database**: MongoDB Atlas
- **Frontend**: Build and submit to App Store and Google Play

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## cutomer lisa@gmail.com   lisa
## worker jone@gmail.com   jone


