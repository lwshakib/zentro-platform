# 🎬 Zentro Platform

**Automate Your YouTube Journey with AI-Powered Tools**

Zentro Platform is a comprehensive automation platform that streamlines your entire YouTube workflow from content creation to publishing. Built with Next.js 15, it leverages cutting-edge AI technologies to help content creators produce high-quality videos efficiently.

![Zentro Platform Demo](public/demo.gif)

## ✨ Features

### 🤖 AI-Powered Video Creation

- **Automated Script Generation**: Generate engaging scripts based on topics using Google Gemini AI
- **Multiple Video Styles**: Choose from 7 visual styles (Anime, GTA, Cyberpunk, Watercolor, Cartoon, Cinematic, Realistic)
- **AI Voice Synthesis**: High-quality text-to-speech with 4 professional voices (Thalia, Helena, Arcas, Zeus)
- **Smart Caption Styling**: 6 different caption styles (YOUTUBER, Supreme, NEON, GLITCH, FIRE, Futuristic)

### 🎨 Image Generation & Management

- **AI Image Generation**: Create thumbnails, logos, and banners with AI
- **ImageKit Integration**: Optimized image storage and delivery
- **Multiple Image Formats**: Support for various image types and sizes

### 📅 Smart Scheduling

- **YouTube Integration**: Direct publishing to YouTube channels
- **Smart Upload Scheduler**: Optimize posting times for maximum engagement
- **Batch Processing**: Queue multiple videos for automated publishing

### 🔧 Advanced Features

- **Remotion Integration**: Professional video rendering and composition
- **Real-time Processing**: Background job processing with Inngest
- **User Authentication**: Secure authentication with Clerk
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Radix UI** - Accessible component primitives

### Backend & Database

- **Convex** - Real-time database and backend functions
- **Clerk** - Authentication and user management
- **Inngest** - Background job processing and workflows

### AI & Media Processing

- **Google Gemini AI** - Script and content generation
- **Deepgram** - Speech recognition and audio processing
- **Remotion** - Programmatic video creation
- **ImageKit** - Image optimization and CDN
- **OpenAI** - Additional AI capabilities via Nebius

### External Integrations

- **YouTube API** - Channel management and video uploading
- **Resend** - Email notifications and communications

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Convex account
- Clerk account
- Required API keys (see Environment Variables)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/lwshakib/zentro-platform.git
   cd zentro-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Convex
   NEXT_PUBLIC_CONVEX_URL=your_convex_url

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Google Services
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_GOOGLE_AUTH_REDIRECT_URI=your_redirect_uri
   NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key

   # AI Services
   NEXT_PUBLIC_NEBIUS_API_KEY=your_nebius_api_key
   NEXT_PUBLIC_DEEPGRAM_API_KEY=your_deepgram_api_key

   # Image Management
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_endpoint

   # Email
   NEXT_PUBLIC_RESEND_API_KEY=your_resend_api_key

   # Base URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Set up Convex**

   ```bash
   npx convex dev
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   This command runs:

   - Next.js development server (with Turbopack)
   - Convex development environment
   - Inngest development server

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
zentro-platform/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/              # Sign-in page
│   │   └── sign-up/              # Sign-up page
│   ├── (main)/                   # Protected main application
│   │   ├── _components/          # Shared components
│   │   ├── dashboard/            # Main dashboard
│   │   ├── videos/               # Video management
│   │   ├── image-generation/     # AI image generation
│   │   ├── smart-upload-scheduler/ # Scheduling interface
│   │   └── billing/              # Subscription management
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── create/               # Content creation
│   │   ├── image/                # Image processing
│   │   ├── schedule/             # Scheduling logic
│   │   ├── scripts/              # Script generation
│   │   └── youtube/              # YouTube integration
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components
│   └── templates/                # Email templates
├── config/                       # Configuration and clients
├── constants/                    # Application constants
│   ├── data.ts                   # Video styles, voices, etc.
│   └── prompts.ts                # AI prompts
├── convex/                       # Database schema and functions
│   ├── schema.ts                 # Database schema
│   ├── videos.ts                 # Video operations
│   ├── images.ts                 # Image operations
│   ├── schedules.ts              # Scheduling logic
│   └── users.ts                  # User management
├── hooks/                        # Custom React hooks
├── inngest/                      # Background job functions
├── lib/                          # Utility functions
├── public/                       # Static assets
├── remotion/                     # Video composition
└── middleware.ts                 # Authentication middleware
```

## 🎯 Key Features Explained

### Video Creation Workflow

1. **Topic Selection**: Choose from 30+ suggested topics or enter custom topic
2. **Style Configuration**: Select video style, voice, and caption styling
3. **AI Script Generation**: Automated script creation based on your topic
4. **Image Generation**: AI-generated images matching your content
5. **Video Rendering**: Remotion-powered video composition
6. **YouTube Publishing**: Direct upload to your connected YouTube channel

### Smart Scheduling

- **Normal Scheduling**: Set specific date and time for uploads
- **Smart Scheduling**: AI-optimized timing based on audience engagement patterns
- **Batch Processing**: Queue multiple videos for automated publishing

### Image Generation

- **Thumbnail Creation**: AI-generated video thumbnails
- **Logo Design**: Custom logo generation for branding
- **Banner Creation**: Channel art and promotional banners

## 🔧 Configuration

### Video Styles

The platform supports 7 distinct visual styles:

- **Anime**: Japanese animation style
- **GTA**: Grand Theft Auto game aesthetic
- **Cyberpunk**: Futuristic neon aesthetic
- **Watercolor**: Artistic watercolor paintings
- **Cartoon**: Traditional cartoon style
- **Cinematic**: Movie-like realistic scenes
- **Realistic**: Photorealistic imagery

### Voice Options

4 high-quality AI voices powered by Deepgram:

- **Thalia** (Female): Clear, confident, energetic
- **Helena** (Female): Caring, natural, friendly
- **Arcas** (Male): Natural, smooth, comfortable
- **Zeus** (Male): Deep, trustworthy, smooth

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Convex** for the real-time database platform
- **Clerk** for authentication services
- **Remotion** for video generation capabilities
- **Google Gemini** for AI content generation
- **Deepgram** for voice synthesis
- **ImageKit** for image optimization

## 📞 Support

For support and questions:

- Create an issue in this repository
- Join our Discord community
- Email: support@zentro-platform.com

---

**Built with ❤️ for content creators worldwide**
