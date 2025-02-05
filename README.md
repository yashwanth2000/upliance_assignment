# React Counter & User Management Application

A React-based web application featuring a counter, user data management, and rich text editing capabilities.

## Live Demo
[View Application](https://upliance-assignment-blond.vercel.app/login)

## Features

### 1. Counter Component

- Interactive counter with increment, decrement, and reset functionality
- Dynamic background color that changes with counter value using bezier curve animation
- Persistent count state across page refreshes

### 2. User Data Management

- User data form with fields for:
  - Name
  - Address
  - Email
  - Phone
- Auto-generated unique user IDs
- Unsaved changes detection with warning popup

### 3. Rich Text Editor

- Visualization of user data in rich text format
- Text formatting options including:
  - Bold
  - Italic
  - Underline
  - Lists
- Data persistence across sessions

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/yashwanth2000/upliance_assignment.git
cd upliance_assignment
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Authentication

For testing purposes, you can use these credentials:

```javascript
// Test Account 1
email: 'test@test.com'
password: 'password123'

// Test Account 2
email: 'test2@test.com'
password: 'password123'
```
Alternatively, you can sign in using Google Authentication.

## Technical Stack

- React with TypeScript
- Chakra UI
- React Spring for animations
- React Router for navigation
- React Charts for data visualization
- React Context API for preserve auth state
