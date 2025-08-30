# Complaint Management System

A full-stack web application built with Next.js, TypeScript, MongoDB, and Nodemailer that allows users to submit complaints and administrators to manage them efficiently.

## 🌐 Live Demo

**Live Application:** [https://complaint-management-system.vercel.app](https://complaint-management-system.vercel.app)

**GitHub Repository:** [https://github.com/Manishdangi1/complaint-management-system1](https://github.com/Manishdangi1/complaint-management-system1)

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
  - Modern, responsive dashboard with enhanced UI

### 📧 Email Notifications
- Automatic email notifications for new complaints
- Status update confirmations
- Welcome emails for new users
- Configurable SMTP settings

### 🎨 Modern UI/UX
- Responsive design for mobile and desktop
- Clean, intuitive interface with Tailwind CSS
- Real-time status updates
- Color-coded priority and status indicators
- Enhanced admin dashboard with gradient backgrounds and smooth transitions

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Node.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer
- **Password Hashing:** bcryptjs
- **Styling:** Tailwind CSS v4
- **Deployment:** Vercel

## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- MongoDB instance running (local or cloud)
- SMTP email service credentials (Gmail, SendGrid, etc.)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Manishdangi1/complaint-management-system1.git
   cd complaint-management-system1
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

## 🚀 Deployment

### Vercel Deployment (Recommended)

This application is optimized for Vercel deployment. Follow these steps:

1. **Push your code to GitHub** (already done)
2. **Go to [vercel.com](https://vercel.com)** and sign up/login with GitHub
3. **Click "New Project"** and import your repository
4. **Configure project settings:**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
5. **Add Environment Variables** in Vercel dashboard:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/
   JWT_SECRET=your-jwt-secret-key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ADMIN_EMAIL=admin@example.com
   ```
6. **Click "Deploy"** - Vercel will build and deploy automatically

### Other Deployment Options
- **Heroku:** Add MongoDB addon and set environment variables
- **AWS:** Use Elastic Beanstalk or EC2 with MongoDB Atlas
- **Docker:** Build and run with Docker Compose

## 👑 Admin Access

### Option 1: Use Pre-seeded Admin Account
The application comes with a pre-configured admin account:

**Email:** `manishdangi272004@gmail.com`  
**Password:** `Admin@2024#Secure`

### Option 2: Create Your Own Admin Account
1. **Register a new account** through the application
2. **Run the seed script** to create an admin user:
   ```bash
   npm run seed-admin
   ```
3. **Or manually update** the user role in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### Admin Dashboard Features
- **Comprehensive Complaint Table** with filtering and sorting
- **Status Management** - Update complaint statuses
- **Advanced Filtering** by status, priority, and category
- **Bulk Operations** for efficient complaint management
- **Real-time Updates** with smooth transitions
- **Responsive Design** for all device sizes

## Usage

### First Time Setup

1. **Start the application** (`npm run dev`)
2. **Login as admin** using the credentials above
3. **Access admin dashboard** to manage complaints
4. **Register regular users** or let them register themselves

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
- Environment variable protection

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

## 📸 Screenshots

*Screenshots will be added here showing the admin dashboard, user interface, and complaint management features*

## 🔗 Links

- **Live Demo:** [https://complaint-management-system.vercel.app](https://complaint-management-system.vercel.app)
- **GitHub Repository:** [https://github.com/Manishdangi1/complaint-management-system1](https://github.com/Manishdangi1/complaint-management-system1)
- **Admin Access:** Use the pre-configured admin account or create your own

---

**Note:** This is a production-ready application with proper security measures. The application is currently deployed on Vercel and fully functional. Make sure to change default secrets and configure your environment properly before deploying to production.
