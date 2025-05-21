# Marketing Flow Visualization - Streamlit App

This is a Streamlit version of the marketing flow visualization project.

## Setup and Running Locally

1. Install the required packages:
```bash
pip install -r requirements.txt
```

2. Run the Streamlit app:
```bash
streamlit run streamlit_app.py
```

## Deploying to Streamlit Cloud

1. Create a free account at [share.streamlit.io](https://share.streamlit.io)
2. Connect your GitHub repository
3. Deploy the app with these settings:
   - Main file path: `streamlit_app.py`
   - Python version: 3.9+

## Features

- Interactive image toggles
- Responsive layout
- Direct links to consultation and search
- Mobile-friendly design

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

## Project Structure

### Key Components

- `src/components/MarketingFlow.tsx`: Main visualization component
- `src/App.tsx`: Entry point rendering MarketingFlow
- `src/assets/`: Contains required images
  - Lead-Gen-Ad.png
  - Content-page.png
  - SERP.png

### Features

1. **Interactive Flow Visualization**
   - Three connected nodes showing the user journey
   - Animated connections with green arrows
   - Mobile-friendly design with iPhone frames

2. **Key Terms System**
   - Clickable term buttons that adapt to content size
   - Nested terms for Content (Headline and First Paragraph)
   - Clean layout with terms on same line
   - Expandable descriptions

3. **Visual Design**
   - Professional styling with consistent spacing
   - Responsive button sizes
   - Clear visual hierarchy
   - Smooth animations and transitions

## Development Notes

### Dependencies

- React 18+
- TypeScript
- React Flow
- Tailwind CSS
- Vite

### Key Features

1. **Node Layout**
   - Three main nodes with consistent spacing
   - iPhone-style frames for mobile views
   - Animated green connection lines

2. **Terms Display**
   - Content-sized buttons
   - Inline layout for main terms
   - Nested terms appear in new line when parent is selected
   - Visual connection with left border for nested terms

3. **Interaction**
   - Click-outside handling for term descriptions
   - Smooth state transitions
   - Consistent button behavior

## Maintenance

When returning to this project:

1. **Key Files to Check**:
   - `MarketingFlow.tsx` contains all core functionality
   - Ensure all assets are present in `src/assets/`
   - Check `package.json` for dependencies

2. **Visual Elements**:
   - Button sizing adapts to content
   - Terms layout is maintained
   - Nested terms appear properly under Content

3. **State Management**:
   - Term selection works correctly
   - Descriptions show/hide properly
   - Click-outside behavior functions

## Contributing

1. Keep the core functionality in `MarketingFlow.tsx`
2. Maintain mobile-first design principles
3. Follow existing styling patterns
4. Test all interactive elements

## License

MIT License - Feel free to use and modify as needed. 