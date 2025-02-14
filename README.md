# Podcast Downloader

Podcast Downloader is a free and open-source web application that allows users to search for and download podcasts. The project is built using Next.js, TypeScript, and Mongoose, with API support for both Apple Podcasts and Podcast Index.

## Hosted Version

You can access the live version at [podcasttomp3.com](https://podcasttomp3.com).

- **v2 (Default)**: Available at `podcasttomp3.com` (uses Podcast Index API).
- **v1 (Legacy)**: Available at `podcasttomp3.com/v1` (uses Apple Podcasts API).

## Features

- **Search for podcasts** using Apple Podcasts API (v1) or Podcast Index API (v2, default).
- **Download podcast episodes** directly from the UI.
- **MongoDB integration** using Mongoose for storing user preferences and downloads.
- **Auth enabled** to store and maintain a list of downloaded episodes and favourite podcasts.
- **Favourites functionality** foundations in place but not yet implemented - contributions welcome!
- **Minimal server costs and secure** since all fetching and downloading of episodes happens locally on the user's machine.
- Styled with [ShadCN](https://ui.shadcn.com/) components.
- Local state managed with Zustand.

## Project Structure

```
/public                  # Static assets
/src                     # Application source code
  ├── hooks              # Custom React hooks
  ├── components         # Re-usable components ("most" v1 only components are labelled clearly)
  ├── server actions     # Server-side logic for Next.js
  ├── providers          # Context providers for global state management
  ├── models             # Mongoose models for database handling
  ├── app                # Routing for Next.js app router
```

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js 18+
- MongoDB (set up your own server)
- API keys for Apple Podcasts and/or Podcast Index

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/utlandingur/podcast-downloader.git
   cd podcast-downloader
   ```
2. Install dependencies (currently requires `--force` due to React version conflicts, but this does not seem to cause issues):
   ```sh
   npm install --force
   ```
3. Set up environment variables: Create a `.env.local` file and add:
   ```env
   APPLE_PODCAST_API_KEY=your_apple_api_key
   PODCAST_INDEX_API_KEY=your_podcast_index_api_key
   PODCAST_INDEX_API_SECRET=your_podcast_index_api_secret
   MONGODB_URI=your_mongodb_connection_string
   ```
4. Run the development server:
   ```sh
   npm run dev
   ```

## Usage

- Open `http://localhost:3000` in your browser.
- Search for podcasts using the search bar.
- Download episodes directly from the interface.
- All fetching and downloading of episodes is done locally on the machine to minimize running costs.

## Contributing

This project is completely free and open-source, and contributions are highly encouraged! If you'd like to help:

1. **Fork the repository** on GitHub.
2. **Create a new branch** for your changes:
   ```sh
   git checkout -b feature-name
   ```
3. **Make your changes** and commit them:
   ```sh
   git commit -m "Added new feature"
   ```
4. **Push to your fork**:
   ```sh
   git push origin feature-name
   ```
5. **Create a pull request** on GitHub to merge your changes.

### Suggested Contributions

- Implement the **favourites** feature.
- Improve UI/UX for a better experience.
- Add support for additional podcast APIs.

## License

This project is **free and open-source**, but **commercial use is strictly prohibited**.

---

If you have any questions or ideas, feel free to open an issue or start a discussion!
