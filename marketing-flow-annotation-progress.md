# Marketing Flow Visualization Progress Log

## Version Control
- v1 (marketing-flow): Original version with detailed node information and live links
- v2 (marketing-flow-v2): New version for future development and improvements

## Current Working State (IMPORTANT)
The main application should ALWAYS use:
- Main component: `MarketingFlow.tsx`
- Entry point: `App.tsx` should render MarketingFlow with proper layout
- Required assets: 
  - Lead-Gen-Ad.png
  - Content-page.png
  - SERP.png

### Version Features
#### v1 (Current)
- Detailed node information with key terms, API terms, and metrics
- Live links for Content Page and SERP
- Clean, focused interface without simple view toggle

#### v2 (In Development)
- Building upon v1's foundation
- Future improvements and features to be determined

## Project Overview
- Interactive marketing flow visualization using React Flow
- Shows user journey from Lead Gen Partner Ad through Content Page to SERP
- Includes annotation system for explaining key points

## Development Timeline

### Initial Setup & Basic Flow
- Created with React/TypeScript and Vite
- Implemented three nodes showing the user journey:
  - Lead Gen Partner Ad
  - Content Page with Keyword Block
  - SERP with Monetization
- Added animated green edges connecting nodes
- Used iPhone-style frames for mobile views

### Visual Refinements
- Improved node title styling (larger, sleeker)
- Used iPhone frame styling
- Made titles more prominent with better typography

### Annotation System Evolution
1. Initial Implementation
   - Basic point annotations working
   - Simple tooltips for SERP's "Visit Website" button

2. Box Annotation Attempts
   - First attempt: Click and drag functionality
   - Second attempt: Modified event handlers and propagation
   - Third attempt: Restructured component hierarchy
   - Fourth attempt: Two-click system for box creation

## Current State (Last Working Version)
- Basic point annotations are functional
- Mobile-first design with proper frame styling
- Clean UI with edit controls

## Issues Encountered
1. Click and drag functionality not working properly
2. Event propagation issues
3. Box creation system unreliable
4. Multiple attempts to fix led to regression in basic functionality

## Next Steps (To Be Discussed)
Options to consider:
1. Roll back to last working version with basic annotations
2. Try simpler point-and-click system without boxes
3. Explore dedicated library for region selection

## Technical Notes
- Using React Flow for visualization
- TypeScript for type safety
- Tailwind CSS for styling
- Vite for development server

## Component Structure
Main components:
- App.tsx: Main container with layout and title
- MarketingFlow.tsx: Core visualization component (MUST BE USED)
- ScreenshotNode: Custom node component with annotation functionality

## Working Features
1. Three connected nodes showing the user journey:
   - Lead Gen Partner Ad
   - Content Page with Keyword Block
   - SERP with Monetization
2. iPhone-style frames for mobile views
3. Edit mode toggle
4. Annotation creation
5. Tooltip display
6. Mobile-friendly design

## Starting the Project
1. Always use `npm run dev` to start
2. Default port is 3000, but may use next available port if occupied
3. Access via http://localhost:3000 (or the port shown in terminal)
4. Should immediately see all three nodes with proper styling

## Important Note
If the application ever shows a different component or layout, always revert to using MarketingFlow as the main component in App.tsx.

## Key Features to Maintain
1. Edit mode toggle
2. Annotation creation
3. Tooltip display
4. Mobile-friendly design
5. Clean user interface

## Future Considerations
1. Need reliable box annotation system
2. Better event handling
3. Improved user feedback during annotation creation
4. Maintain existing working features while adding new ones 