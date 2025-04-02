# Time Budget & Schedule App

A web application that helps users budget their 24 hours and schedule their activities. This app addresses the core problem of time management by providing an intuitive interface for allocating time and planning daily schedules.

## Implemented Features

### Time Budget Feature
- Date-based structure for budget entries, supporting past, present, and future dates
- Visual breakdown of 24-hour time allocation with a pie chart
- Create, edit, and delete time categories with custom colors
- Track allocated vs. remaining time
- Dynamic date navigation (Today, Tomorrow, Day After Tomorrow, and additional dates)
- Horizontal scrolling interface for date selection
- Archive view for accessing past budget entries
- Copy budget from one date to another
- Daily reset time with automatic date transitions
- Persistent storage with localStorage

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/simple-time-budget-schedule.git
cd simple-time-budget-schedule
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Create a `.env` file based on `.env.example`
```bash
cp .env.example .env
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Project Structure

- `/src/features/time-budget` - Time Budget feature implementation
  - `/components` - Reusable UI components for time budget
  - `/contexts` - React context for state management
  - `/services` - Logic for data operations
  - `/utils` - Utility functions for time calculations
  - `TimeBudgetPage.jsx` - Main page component

## Current Implementation Notes

For the MVP version, the time budget data is stored in the browser's localStorage. In a future implementation, this data will be synchronized with a backend database.

## Next Steps

- Implement the Schedule feature
- Add database persistence
- Add user preferences management
- Implement mobile-responsive design improvements
- Add data visualization enhancements

## License

MIT