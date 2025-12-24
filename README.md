<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10yr6Cxw6J1lqrIA1m8I36lQxgxsq9UII

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run with Docker

**Prerequisites:** Docker and Docker Compose

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` file and set your `GEMINI_API_KEY` and desired `PORT`
3. Start the application:
   ```bash
   docker-compose up
   ```
4. Access the app at `http://localhost:PORT` (default: http://localhost:3000)

To stop the application:
```bash
docker-compose down
```

# mod-fashiona-voice
