# AI Workplace Productivity Assistant

A single, responsive web application that helps professionals automate everyday workplace tasks using AI. Built with a clean, modern SaaS aesthetic and a teal-themed design system.

## Features

### Smart Email Generator
- Generate professional emails in multiple tones: formal, casual, persuasive, and more.
- Add CC and BCC recipients dynamically.
- Edit the AI draft directly before copying or sending.

### AI Task Planner
- Plan your month by selecting the target month and year.
- Add tasks, meetings, and deadlines in a structured table with a dedicated Day column.
- View the generated schedule as an editable monthly calendar grid.

### AI Research Assistant
- Summarise topics and articles on demand.
- Receive insights and actionable recommendations.
- Edit and regenerate results easily.

## Design

- Modern dashboard UI with a collapsible sidebar navigation.
- Responsive layout that works across desktop and mobile devices.
- Teal colour theme: primary `#0f9692` with lighter teal accents.
- Editable AI outputs with copy, export, and regenerate options.
- Responsible AI disclaimer included.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) – full-stack React framework.
- [React 19](https://react.dev) – UI library.
- [Tailwind CSS v4](https://tailwindcss.com) – utility-first styling.
- [Lovable Cloud](https://docs.lovable.dev/features/cloud) – backend, auth, and AI gateway.
- [shadcn/ui](https://ui.shadcn.com) – accessible UI components.

## Project Structure

```text
src/
  components/app/       # App-specific layout and output components
  components/ui/        # Reusable shadcn/ui components
  lib/                  # AI prompts, server functions, and utilities
  routes/               # TanStack file-based routes
  styles.css            # Global design tokens and Tailwind theme
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or bun

### Install and run locally

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

The dev server will start at `http://localhost:8080`.

## Environment Variables

This project uses Lovable Cloud for AI features and backend services. Required environment variables are managed automatically when Lovable Cloud is enabled. For local development, copy `.env.example` to `.env` and fill in the values provided by your Lovable project dashboard.

## Responsible AI

AI-generated outputs are suggestions only. Always review, verify names, dates, figures, and commitments before sending emails or acting on generated plans. Avoid pasting confidential or personal data into prompts.

## Deployment

This project is developed in [Lovable](https://lovable.dev). Changes made in the Lovable editor are committed to the connected GitHub repository automatically when GitHub sync is enabled.

To push updates manually from a local clone, commit and push to the connected repository's default branch. Lovable's two-way sync will reflect those changes in the editor.

## License

This project is built and owned by its creator. See the repository for any project-specific license terms.

---

This project was built with [Lovable](https://lovable.dev).
