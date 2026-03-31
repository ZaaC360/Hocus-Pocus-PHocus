# phocus

A Chrome extension that blocks distracting websites during focus sessions using the Pomodoro technique.

## Features

- ⏱️ **25-minute Pomodoro Timer** - Stay focused with automatic countdowns
- 🚫 **Smart Website Blocking** - Add sites to blocklist and they're blocked when timer runs
- 🎯 **Full-page Overlay** - Motivational blocking screen prevents all interactions
- 💾 **Persistent Storage** - Blocklist and timer state saved across sessions
- 🔄 **Real-time Updates** - Timer updates instantly on blocking screen
- 🖼️ **Favicon Validation** - See site icons as you type (validates your entries)

## Installation

### Option 1: Load Unpacked (the only option as of now)
1. Clone this repo: `git clone https://github.com/yourusername/phocus.git`
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `phocus` folder
6. Done! ✅

## How It Works

1. **Start Timer** - Click "Start Phocus" in the extension popup
2. **Add Sites** - Type domain names (e.g., facebook.com) you want to block
3. **Get Blocked** - Visit any blocked site during focus mode → see blocking screen
4. **Stay Focused** - Can't interact with the site until timer ends

## Project Structure
```
phocus/
├── manifest.json       # Extension configuration
├── popup.html         # UI popup interface
├── popup.js           # Popup logic & interactions
├── popup.css          # Popup styling
├── background.js      # Timer & blocking logic
├── content.js         # Blocking screen injection
├── content.css        # Blocking screen styling
└── icons/             # Extension icons
```

## Technical Details

- **Architecture:** Message-passing between popup, background worker, and content scripts
- **Storage:** Chrome Storage API for persistent blocklist
- **Tab Detection:** Chrome Tabs API for monitoring visited sites
- **Domain Matching:** Handles www/non-www normalization

## Known Issues

- Delete button in real-time needs refactor (works after popup refresh)

## Future Features

- Customizable timer duration
- Productivity stats dashboard
- Session history & streaks
- Dark mode toggle
- Notifications when timer ends


---

**Made for staying focused. 🚀**
