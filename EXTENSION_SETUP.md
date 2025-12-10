# Chrome Extension Setup Guide

## Overview

This guide explains how to install and use the "Ежедневник Триллионера" Chrome extension that replaces your new tab page.

## Building the Extension

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Extension

```bash
npm run build:extension
```

This will create a `dist/` folder with all the extension files.

## Installing the Extension in Chrome

### Step 1: Open Chrome Extensions Page

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Or click the three dots menu → More Tools → Extensions

### Step 2: Enable Developer Mode

1. Toggle the "Developer mode" switch in the top-right corner
2. This will reveal additional options

### Step 3: Load the Extension

1. Click "Load unpacked" button
2. Navigate to your project folder
3. Select the `dist/` folder
4. Click "Select Folder"

### Step 4: Verify Installation

1. The extension should now appear in your extensions list
2. Make sure it's enabled (toggle should be blue)
3. Open a new tab (Ctrl+T or Cmd+T)
4. You should see the Ежедневник Триллионера app!

## Features

### Storage

The extension uses `chrome.storage.local` for data persistence, which provides:

- **Unlimited storage** (with the `unlimitedStorage` permission)
- **Better reliability** than localStorage
- **Automatic sync** across Chrome sessions
- **No quota limits** for your productivity data

### Offline Support

The extension works completely offline - no internet connection required after installation.

## Development

### Development Mode

For development, you can use:

```bash
npm run dev
```

Then manually reload the extension in Chrome:
1. Go to `chrome://extensions/`
2. Click the reload icon on your extension card

### Making Changes

After making code changes:

1. Run `npm run build:extension`
2. Go to `chrome://extensions/`
3. Click the reload button on the extension
4. Open a new tab to see your changes

## Troubleshooting

### Extension Not Loading

- Make sure you selected the `dist/` folder, not the project root
- Check that the build completed successfully
- Look for errors in the Chrome Extensions page

### Data Not Persisting

- Check the Chrome DevTools console for errors
- Verify the extension has the `storage` permission
- Try clearing the extension data and starting fresh

### New Tab Not Showing the App

- Make sure the extension is enabled
- Check if another extension is also overriding the new tab
- Only one extension can override the new tab at a time

## Uninstalling

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "Ежедневник Триллионера"
3. Click "Remove"
4. Confirm the removal

**Note**: This will delete all your data stored in the extension. Export your data first if you want to keep it!

## Exporting Your Data

Before uninstalling, make sure to export your data:

1. Open the extension (new tab)
2. Go to Settings
3. Click "Export Data"
4. Save the JSON file to a safe location

You can later import this data if you reinstall the extension.

## Privacy

- ✅ **No tracking** - The extension doesn't collect any data
- ✅ **No analytics** - No usage statistics are sent anywhere
- ✅ **Fully offline** - Works without internet connection
- ✅ **Local storage only** - All data stays on your computer

## Permissions Explained

The extension requires these permissions:

- **storage**: To save your productivity data locally
- **unlimitedStorage**: To avoid storage quota limits
- **chrome_url_overrides.newtab**: To replace the new tab page

## Support

For issues or questions, please create an issue in the repository.
