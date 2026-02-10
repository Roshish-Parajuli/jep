# Website

A beautiful, romantic web platform for creating personalized digital gift pages. Each page is unique, private, and filled with love.

## Features

### Page Sections

1. **Hero/Landing Section**
   - Romantic headline with recipient's name
   - Animated floating hearts
   - Smooth call-to-action

2. **Photo Gallery**
   - Beautiful image gallery with captions
   - Lightbox view with navigation
   - Mobile-friendly swipe support

3. **Secret Message**
   - Hidden message revealed by interaction
   - Optional secret code protection
   - Typewriter animation effect

4. **Timeline / Memory Lane**
   - Chronological journey of your relationship
   - Special moments and milestones
   - Beautiful alternating layout

5. **Love Letter**
   - Handwritten-style presentation
   - Elegant serif typography
   - Paper-like texture background

6. **Music Player**
   - Optional background music
   - Floating play/pause controls
   - Loop functionality

7. **Promises Section**
   - List of commitments and vows
   - Animated card layout
   - Hover effects

8. **Final Surprise**
   - Closing message with confetti animation
   - Heart burst effect
   - Grand "I Love You" ending

## How to Use

### Creating a New Valentine Page

1. Visit the home page (root URL)
2. Fill out the form with all the romantic details:
   - Recipient's name
   - Hero headline and subtext
   - Gallery photos with captions
   - Secret message (and optional code)
   - Timeline events
   - Love letter
   - Promises
   - Final message
   - Background music URL (optional)
3. Click "Create Valentine Page"
4. Get your unique URL to share!

### Viewing a Valentine Page

Simply visit: `/valentine/{unique-slug}`

Example: `/valentine/demo2024` (Demo page with sample content)

### Demo Page

A demo Valentine page is available at `/valentine/demo2024` with the secret code: `0214`

## Technical Details

### Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Supabase for database
- Lucide React for icons

### Database Schema

**valentine_pages table:**
- Stores main page content
- Unique slug for each page
- All text content and configuration

**valentine_photos table:**
- Stores gallery images
- Linked to valentine_pages
- Ordered display

### Security Features

- Row Level Security (RLS) enabled
- Public read access only
- No client-side write access
- Non-indexed pages (robots.txt)
- Random, non-sequential slugs

### Page Privacy

- Pages are NOT listed anywhere
- No browse/discovery functionality
- URLs must be shared directly
- Non-indexed by search engines

## Development

### Setup

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Environment Variables

Required variables are in `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Design Philosophy

The platform is designed to be:
- **Intimate**: Each page feels personal and private
- **Romantic**: Beautiful animations and color schemes
- **Accessible**: Works perfectly on all devices
- **Simple**: No technical knowledge required
- **Magical**: Delightful interactions throughout

## Color Palette

- Rose tones (rose-50 to rose-600)
- Pink accents (pink-50 to pink-500)
- Red highlights (red-100 to red-500)
- Warm neutrals (amber, cream tones)

## Animations

- Floating hearts
- Fade-in effects
- Smooth scrolling
- Confetti burst
- Typewriter text
- Hover transitions
- Scale transformations

## Mobile Optimization

- Mobile-first responsive design
- Touch-friendly buttons
- Swipe gestures for gallery
- Optimized font sizes
- Perfect viewport adaptation

## Future Enhancements

Potential features to add:
- Video support
- Audio messages
- Custom color themes
- Download as PDF
- Share to social media
- QR code generation
- Email delivery

## License

This is a Valentine's Day gift platform. Use it with love!
