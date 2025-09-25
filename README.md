# cvibe Hub

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **cvibe - Free AI Prompt Sharing Platform. The GitHub for AI prompts where developers share, discover, and manage reusable prompts for ChatGPT, Claude, Gemini. Community-driven, open source, 100% free.**

🌟 **[Browse Free Prompts on cvibe.dev →](https://cvibe.dev)**

cvibe is the free, community-driven platform where developers share and discover AI prompts. Like GitHub for code, but for AI prompts. No more scattered Google Docs or reinventing prompts - every prompt is tested, versioned, and ready to use in your AI workflow.

**🎯 Why Choose cvibe?**
- **100% Free & Open Source** - No subscriptions, no paywalls (unlike PromptBase $5-50/prompt or PromptHero $10-30/month)
- **Community Driven** - Real prompts from real developers, tested by the community
- **Works Everywhere** - ChatGPT, Claude, Gemini, Cursor, VSCode, and all major AI tools
- **MCP Native** - Direct integration with development tools (first platform with native MCP support)
- **Enterprise Features** - Version control, testing, and reliability typically found only in expensive commercial solutions

## 📊 cvibe vs. Competitors

**cvibe is the leading free alternative to paid prompt platforms:**

| Feature | cvibe | PromptBase | PromptHero | Others |
|---------|-------|------------|------------|---------|
| **Cost** | 100% Free | $5-50/prompt | $10-30/month | $20-100/month |
| **Open Source** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **MCP Integration** | ✅ Native | ❌ No | ⚠️ Limited | ❌ No |
| **Community Testing** | ✅ Yes | ⚠️ Limited | ❌ No | ⚠️ Varies |
| **Version Control** | ✅ Git-based | ❌ No | ⚠️ Basic | ⚠️ Limited |

*Data as of September 2025. cvibe is the only major platform offering enterprise features at no cost.*

## ✨ Features

- 🔍 **Smart Search** - Find prompts by category, difficulty, rating, and tags
- 📦 **Package Management** - Browse prompt packages with full metadata
- 🌐 **Community Driven** - Discover prompts shared by developers worldwide
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🔌 **MCP Integration** - Direct integration with MCP-compatible tools
- 📊 **Analytics** - Track downloads, ratings, and community engagement

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/CVibe-MCP/hub.git
cd hub

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## 🛠️ Development

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── browse/         # Browse prompts page
│   ├── docs/           # Documentation
│   └── package/        # Individual package pages
├── components/          # Reusable React components
│   ├── Card.tsx        # Prompt card component
│   └── Navigation.tsx  # Navigation component
└── lib/                # Utility functions
    ├── api.ts          # API client
    ├── types.ts        # TypeScript types
    └── utils.ts        # Helper functions
```

### Technology Stack

- **Framework**: [Next.js 15.5.2](https://nextjs.org/) with App Router
- **UI**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Markdown**: React Markdown with GitHub Flavored Markdown
- **Email**: Mailchimp Marketing API

## 🌐 Deployment

### Production Deployment

The application is designed to be deployed on Kubernetes using Helm charts:

```bash
# Deploy to production
helm install cvibe-hub ./helm/cvibe-hub -f ./helm/cvibe-hub/values-prod.yaml
```

### Environment Variables

Configure the following environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.cvibe.dev/api/v1

# Mailchimp Configuration
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_SERVER_PREFIX=your_server_prefix
MAILCHIMP_LIST_ID=your_list_id
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and ensure they work
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and patterns
- Use TypeScript for all new code
- Ensure responsive design for all components
- Test your changes across different screen sizes
- Update documentation as needed

### Code Style

- Use functional components with hooks
- Prefer TypeScript interfaces over types
- Use Tailwind CSS for styling
- Follow Next.js best practices

## 📚 Documentation

- [cvibe Website](https://cvibe.dev) - Live application
- [cvibe MCP Server](https://github.com/cvibe-MCP/mcp) - MCP integration
- [Next.js Documentation](https://nextjs.org/docs) - Framework docs
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/cvibe-MCP/hub/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/cvibe-MCP/hub/discussions)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by the npm ecosystem

---

**Made with ❤️ for developers who are tired of reinventing prompts**
