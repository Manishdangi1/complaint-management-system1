# Complaint Management System

A full-stack web application built with Next.js, TypeScript, MongoDB, and Nodemailer that allows users to submit complaints and administrators to manage them efficiently.

## Features

### 🔐 Authentication System
- JWT-based user authentication
- User registration and login
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt

### 📝 Complaint Management
- **User Interface:**
  - Submit complaints with title, description, category, and priority
  - View personal complaint history
  - Track complaint status updates

- **Admin Interface:**
  - View all complaints in a comprehensive table
  - Update complaint status (Pending, In Progress, Resolved)
  - Delete complaints
  - Filter complaints by status, priority, and category

### 📧 Email Notifications
- Automatic email notifications for new complaints
- Status update confirmations
- Welcome emails for new users
- Configurable SMTP settings

### 🎨 Modern UI/UX
- Responsive design for mobile and desktop
- Clean, intuitive interface
- Real-time status updates
- Color-coded priority and status indicators

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer
- **Password Hashing:** bcryptjs
- **Styling:** Tailwind CSS v4

## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- MongoDB instance running (local or cloud)
- SMTP email service credentials (Gmail, SendGrid, etc.)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd complaint-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/complaint-management
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # Email Configuration (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # Admin Configuration
   ADMIN_EMAIL=admin@example.com
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `complaint-management`
   - The application will automatically create the required collections

5. **Configure Email Service**
   - For Gmail: Enable 2-factor authentication and generate an app password
   - For other services: Use their SMTP credentials

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## Usage

### First Time Setup

1. **Register an Admin User**
   - Start the application
   - Register a new account
   - Manually update the user role to 'admin' in MongoDB:
     ```javascript
     db.users.updateOne(
       { email: "your-email@example.com" },
       { $set: { role: "admin" } }
     )
     ```

2. **Regular Users**
   - Register new accounts (default role: 'user')
   - Submit complaints
   - Track complaint progress

### User Workflow

1. **Login/Register** with email and password
2. **Submit Complaint** with:
   - Title (required, max 100 characters)
   - Description (required, max 1000 characters)
   - Category (Product, Service, Support, Technical, Other)
   - Priority (Low, Medium, High)
3. **Track Status** of submitted complaints
4. **View History** of all personal complaints

### Admin Workflow

1. **Login** with admin credentials
2. **View Dashboard** with all complaints
3. **Filter Complaints** by status, priority, or category
4. **Update Status** of complaints (Pending → In Progress → Resolved)
5. **Delete Complaints** when necessary
6. **Receive Email Notifications** for new complaints and status updates

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Complaints
- `POST /api/complaints` - Create new complaint (requires auth)
- `GET /api/complaints` - Get all complaints (requires admin)
- `PATCH /api/complaints/[id]` - Update complaint status (requires admin)
- `DELETE /api/complaints/[id]` - Delete complaint (requires admin)

### User Complaints
- `GET /api/users/complaints` - Get user's own complaints (requires auth)

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (enum: 'user', 'admin'),
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String (enum: 'Product', 'Service', 'Support', 'Technical', 'Other'),
  priority: String (enum: 'Low', 'Medium', 'High'),
  status: String (enum: 'Pending', 'In Progress', 'Resolved'),
  dateSubmitted: Date,
  userId: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

## Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password in `SMTP_PASS`

### Other SMTP Services
Update the SMTP configuration in `.env.local`:
```env
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Secure HTTP headers

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Heroku:** Add MongoDB addon and set environment variables
- **AWS:** Use Elastic Beanstalk or EC2 with MongoDB Atlas
- **Docker:** Build and run with Docker Compose

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `SMTP_HOST` | SMTP server hostname | Yes | smtp.gmail.com |
| `SMTP_PORT` | SMTP server port | Yes | 587 |
| `SMTP_USER` | SMTP username/email | Yes | - |
| `SMTP_PASS` | SMTP password/app password | Yes | - |
| `ADMIN_EMAIL` | Admin notification email | No | admin@example.com |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code examples

## Screenshots

*Add screenshots of your running application here*

## Live Demo

*Add your deployed application URL here*

---

**Note:** This is a production-ready application with proper security measures. Make sure to change default secrets and configure your environment properly before deploying to production.
