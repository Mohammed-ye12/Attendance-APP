# Shift Management System

A comprehensive shift management application for managing employee shifts, approvals, and reporting.

## Features

- Employee registration and approval system
- Shift registration with multiple shift types
- Manager approval workflow
- HR dashboard for monitoring shifts
- Admin dashboard for user management
- Department-specific views and permissions

## Getting Started

### Prerequisites

- Node.js 16+
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Connect to Supabase:
   - Click the "Connect to Supabase" button in the top right corner
   - Create a new Supabase project or connect to an existing one
   - Copy the environment variables to `.env`

4. Run the migrations:
   - The migrations will create the necessary tables and seed initial data
   - Check the `supabase/migrations` folder for the SQL files

5. Start the development server:
   ```
   npm run dev
   ```

## User Types and Access

### Employee
- Register with employee code and details
- Submit shift entries
- View personal roster and overtime calculations

### Manager
- Login with department-specific credentials
- Approve or reject shift entries for their department/section
- View reports for their team

### HR
- Three types of HR access:
  - Main HR: Access to all departments
  - HR-ENG: Access to Engineering department only
  - Op-Logistic: Access to Operations and Logistics departments only
- Export shift data to CSV
- View all shift entries based on access level

### Admin
- Approve or reject employee registrations
- Manage user accounts
- System-wide access

## Database Schema

The application uses the following tables:

- `profiles`: Employee information
- `shift_entries`: Shift registration entries
- `managers`: Manager credentials and departments
- `hr_users`: HR user credentials and access levels

## Testing Credentials

### HR Users
- Main HR: `Main123*`
- HR-ENG: `ENG123*`
- Op-Logistic: `OP123*`

### Admin
- Access code: `ADMIN123`

### Managers
- See the managers table for department-specific credentials