# Competition Leaderboard

A real-time leaderboard application that displays competition results across 10 parts and 3 categories, with individual and total rankings. The application fetches data directly from Google Sheets.

## Features

- Display of individual part times and corresponding ranks
- Calculation and display of total times and final rankings
- Category filtering to view results by competition category
- Responsive design optimized for all devices
- Sorting functionality by rank, name, or specific part times
- Visual indicators for top performers
- Search functionality to quickly find specific competitors

## Google Sheets Integration

The application is designed to fetch data from a Google Sheets document with the following structure:

| ID | Name | Category | Part1 | Part2 | Part3 | Part4 | Part5 | Part6 | Part7 | Part8 | Part9 | Part10 |
|----|------|----------|-------|-------|-------|-------|-------|-------|-------|-------|-------|--------|
| p1 | John Smith | beginners | 120.5 | 85.2 | ... | ... | ... | ... | ... | ... | ... | ... |
| p2 | Emma Wilson | intermediate | 110.8 | 79.6 | ... | ... | ... | ... | ... | ... | ... | ... |

## Setup Instructions

1. Create a Google Sheet with the structure shown above and populate it with your competition data
2. Get your Google Sheets API key
3. Replace the placeholder values in `src/services/googleSheetsService.ts`:
   - `API_KEY`: Your Google Sheets API key
   - `SHEET_ID`: Your Google Sheet ID (found in the URL of your sheet)
4. Install dependencies: `npm install`
5. Run the development server: `npm run dev`

## Building for Production

```
npm run build
```

This will create a production-ready build in the `dist` directory.

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Google Sheets API
- Vite