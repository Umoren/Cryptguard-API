# 🛡️ CryptShield - Advanced Video Encryption API

## 🌟 Introduction

CryptShield is a video encryption API that brings Netflix-grade content protection to your applications. Built with Express.js and TypeScript, it makes use of industry-standard DRM technologies to secure your valuable video content.

## 🚀 Features

- 🔐 Widevine DRM Integration: Industry-standard content protection
- 🎥 MPEG-DASH Support: Adaptive streaming for optimal viewing experience
- 📊 Progress Tracking: Real-time encryption progress monitoring
- 🌐 CDN-Ready: Prepared for content delivery network integration
- 📚 Swagger Documentation: Interactive API docs for easy integration
- 🐳 Docker Support: Containerized for easy deployment and scaling
- 🧪 Comprehensive Testing: Ensuring reliability and performance

## 🛠️ Technology Stack

- **Server**: Express.js with TypeScript
- **Encryption**: Shaka Packager
- **Documentation**: OpenAPI/Swagger
- **Streaming Protocol**: MPEG-DASH
- **DRM System**: Widevine (test environment)
- **Build Tool**: tsx for development, tsc for production
- **Testing**: Vitest and Supertest
- **Logging**: Pino for efficient logging
- **Code Quality**: Biomejs for linting and formatting

## 💡 Key Concepts

### DRM (Digital Rights Management)
CryptShield uses Widevine DRM to protect video content. DRM ensures that only authorized users can access the content, preventing unauthorized copying or distribution.

### MPEG-DASH (Dynamic Adaptive Streaming over HTTP)
DASH is an adaptive bitrate streaming technique that enables high-quality streaming of media content over the Internet, delivered from conventional HTTP web servers.

## 🛠️ Getting Started

#### Step 1: 🚀 Initial Setup

- Clone the repository: `git clone https://github.com/Umoren/Cryptguard-API.git`
- Navigate: `cd cryptguard-api`
- Install dependencies: `npm ci`

#### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables

#### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`

#### Step 4: Access the API documentation
Open `http://localhost:8080/` in your browser.

## 🔒 API Endpoints

- `POST /encryption/encrypt`: Encrypt a video file
- Body: `{ "videoUrl": "https://example.com/video.mp4", "contentId": "unique-content-id" }`

- Response:
```json
{
    "success":true,
    "message":"Video encrypted successfully",
    "responseObject":{
        "baseUrl":"http://localhost:8080/cdn/abcdef1234567890abcdef1234567890/",
        "mpdFile":"manifest.mpd"
    },
    "statusCode":200
}
```

## 🤝 Feedback and Contributions

I'd love to hear your feedback and suggestions for further improvements. Feel free to contribute and join us in making backend development cleaner and faster!

