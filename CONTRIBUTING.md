# 🤝 Contributing to Online Clipboard

Thank you for your interest in contributing to **Online Clipboard**. This project combines a **React (Vite)** frontend with a **Spring Boot** backend, so contributions can improve the user experience, API behavior, performance, testing, and documentation. Small, focused contributions are especially welcome.

## ⚡ Quick Start

1. Fork the repo.
2. Clone your fork.
3. Run the frontend and backend locally.
4. Pick a `good first issue`.
5. Submit a PR 🚀

## 🟢 Good First Issues

If you're new to open source:

- Look for issues labeled `good first issue`
- These are beginner-friendly and well-defined
- Comment on the issue before starting

Recommended starting points:

- UI improvements
- Small bug fixes
- Documentation updates

## 📁 Project Structure

```text
online-clipboard/
├── online-clipboard-frontend/
├── online-clipboard-backend/
└── README.md
```

## 🌿 Branch Naming Convention

- `feat/feature-name`
- `fix/bug-name`
- `docs/update-name`
- `refactor/code-cleanup`

## 🚀 Getting Started

### 1. Fork the repository
Click **Fork** on the GitHub repository page to create your own copy.

### 2. Clone your fork
```bash
git clone https://github.com/<your-username>/online-clipboard.git
cd online-clipboard
```

### 3. Create a branch
Create a branch for the issue or improvement you want to work on.

```bash
git checkout -b feat/short-description
```

Good branch name examples:
- `feat/file-download-fix`
- `fix/offline-sync-retry`
- `docs/readme-improvements`

## 🎯 First Contribution Example

1. Pick issue: "Remove debug logs"
2. Create branch: `fix/remove-debug-logs`
3. Make changes
4. Commit:

```bash
git commit -m "chore: remove debug logs"
```

5. Push and create PR

## 🛠️ Project Setup

### Frontend setup
The frontend lives in `online-clipboard-frontend`.

```bash
cd online-clipboard-frontend
npm install
npm run dev
```

Useful frontend commands:

```bash
npm run build
npm run lint
npm run preview
```

### Backend setup
The backend lives in `online-clipboard-backend`.

```bash
cd online-clipboard-backend
./mvnw clean install
./mvnw spring-boot:run
```

If you are on Windows, use:

```bash
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

### Environment variables
This project uses environment variables for local development.

- The backend expects database, Redis, Cloudinary, and secret key values through environment variables referenced in `application.properties`.
- The frontend can use `VITE_API_URL` to point to the backend API.

Recommended local setup:

- Copy the example environment files if they exist.
- Keep secrets out of source control.
- Use local development values for PostgreSQL, Redis, and Cloudinary.

If you add new environment variables, update the README and any sample `.env` files so other contributors can reproduce your setup.

## 🧭 How to Contribute

### Pick an issue
- Start with issues labeled **good first issue**, **frontend**, **backend**, **bug**, or **docs**.
- Read the issue description carefully and make sure you understand the expected outcome.
- If an issue is already being worked on, leave a comment and wait for confirmation before starting a duplicate effort.

### Comment before working
Before you begin, comment on the issue with a short note such as:

- “I’d like to work on this.”
- “I’m starting this issue now.”
- “I can take this if nobody is already assigned.”

This helps avoid duplicate work and keeps maintainers informed.

### Ask when the scope is unclear
If a task touches both the frontend and backend, or if the expected behavior is unclear, comment on the issue first and ask a focused question. It is better to confirm the scope than to submit a large PR that misses the goal.

## ✍️ Coding Guidelines

### Clean code practices
- Keep code readable and easy to scan.
- Prefer small functions and components over large blocks of logic.
- Remove temporary debug logs before submitting.
- Add comments only when the code is not immediately obvious.

### Naming conventions
- Use descriptive names for variables, functions, and components.
- Keep component names in PascalCase.
- Keep functions, hooks, and variables in camelCase.
- Use clear file names that match the exported component or feature.

### Keep changes minimal and focused
- Solve one issue per pull request whenever possible.
- Avoid unrelated refactors in the same PR.
- If a change touches multiple files, make sure they all support the same goal.
- Prefer the smallest change that fully fixes the problem.

## 📬 Pull Request Process

### Commit message format
Use clear commit prefixes so history stays easy to read:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code cleanup without behavior changes
- `test:` for test-only changes
- `chore:` for tooling, dependency, or maintenance work

Examples:

```bash
git commit -m "fix: handle file download fallback names"
git commit -m "docs: improve setup instructions"
```

### Link the related issue
If your PR resolves an issue, include the issue number in the PR description or commit message.

Example:

```text
Closes #42
```

### Add screenshots for UI changes
If your change affects the UI, include before/after screenshots or a short screen recording in the pull request description. This makes review much faster.

### Before opening a PR
- Test your changes locally.
- Make sure the frontend builds and the backend starts successfully.
- Rebase or merge from the latest `main` if needed.
- Confirm the PR only contains the intended changes.

## ✅ Rules / Best Practices

- Do not break existing functionality.
- Test your changes before submitting.
- Keep pull requests small and easy to review.
- Make sure backend and frontend changes still work together.
- Update documentation when behavior or setup changes.

A good contribution should be easy for maintainers to review and easy for another contributor to understand later.

## 🧑‍⚖️ Code of Conduct

Be respectful, constructive, and collaborative. Treat other contributors with professionalism, and avoid disrespectful language or behavior. Healthy discussion and helpful feedback are expected here.

## 💬 Help / Support

If you need help:

- Open a GitHub issue for bugs, questions, or enhancement ideas.
- Comment directly on the issue you are working on if you need clarification.
- Include the steps you tried, what you expected, and what actually happened.

For project-specific questions, mention whether your issue is in the **frontend**, **backend**, or **shared setup** so maintainers can route it quickly.
