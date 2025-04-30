# GitTrace 🔍

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen?style=for-the-badge)](https://your-deployment-link.com)
[![Vue](https://img.shields.io/badge/Vue-3.x-4fc08d?logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![GitHub API](https://img.shields.io/badge/GitHub_API-v3-181717?logo=github)](https://docs.github.com/en/rest)

A lightweight GitHub profile explorer built with Vue 3 and TypeScript. Search users, view profiles, and discover repositories with real-time API integration.

## Features ✨

- **Instant GitHub search** with debounced input
- **Profile overview** with key metrics
- **Top repositories** display
- **Search history** (last 5 queries)
- **Mobile-responsive** UI
- **Error handling** for API limits

## Tech Stack 🛠️

| Category       | Technologies                          |
|----------------|---------------------------------------|
| Core Framework | Vue 3 (Composition API)               |
| Language       | TypeScript                            |
| Styling        | Tailwind CSS                          |
| API            | GitHub REST API                       |
| Build Tool     | Vite                                  |

## Key Implementation Details

```typescript
// Type-safe API response handling
interface GitHubUser {
  login: string;
  public_repos: number;
  // ...15+ other fields with strict typing
}

// Debounced search (500ms delay)
const searchUser = useDebounceFn(() => {
  // API call logic
}, 500);