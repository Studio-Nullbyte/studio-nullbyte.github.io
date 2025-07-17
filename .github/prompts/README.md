# GitHub Copilot Prompts

This directory contains GitHub Copilot prompt files that enhance your development workflow. These prompts are sourced from the [awesome-copilot repository](https://github.com/github/awesome-copilot) and are specifically selected for React + TypeScript + Tailwind CSS development.

## Available Prompts

### 🚀 High Priority (Essential for Development)

| Prompt | Description | Usage |
|--------|-------------|-------|
| **create-readme.prompt.md** | Create comprehensive README.md files for projects | `/create-readme` |
| **javascript-typescript-jest.prompt.md** | Best practices for JavaScript/TypeScript testing with Jest/Vitest | `/javascript-typescript-jest` |
| **review-and-refactor.prompt.md** | Review and refactor code according to defined standards | `/review-and-refactor` |

### 📝 Documentation & Architecture

| Prompt | Description | Usage |
|--------|-------------|-------|
| **create-llms.prompt.md** | Create llms.txt files for better AI understanding of repositories | `/create-llms` |
| **update-llms.prompt.md** | Update existing llms.txt files with new changes | `/update-llms` |
| **create-oo-component-documentation.prompt.md** | Generate documentation for React components | `/create-oo-component-documentation` |
| **create-specification.prompt.md** | Create technical specifications for features | `/create-specification` |

### 🛠️ Development Tools

| Prompt | Description | Usage |
|--------|-------------|-------|
| **create-implementation-plan.prompt.md** | Create detailed implementation plans for features | `/create-implementation-plan` |
| **multi-stage-dockerfile.prompt.md** | Generate optimized Docker configurations | `/multi-stage-dockerfile` |

### 📋 Project Management

| Prompt | Description | Usage |
|--------|-------------|-------|
| **my-issues.prompt.md** | List and analyze your GitHub issues | `/my-issues` |
| **my-pull-requests.prompt.md** | List and review your pull requests | `/my-pull-requests` |

## How to Use

### Method 1: Slash Commands
In VS Code chat, type `/` followed by the prompt name:
```
/create-readme
/review-and-refactor
/javascript-typescript-jest
```

### Method 2: Chat Commands
1. Open VS Code
2. Use `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Chat: Run Prompt"
4. Select the prompt you want to use

### Method 3: Direct Execution
1. Open any `.prompt.md` file
2. Click the "Run Prompt" button in the editor
3. The prompt will execute in the chat panel

## Customization

These prompts are designed to work well with your Studio Nullbyte project structure:
- React 18 + TypeScript
- Tailwind CSS design system
- Vite build system
- Vitest testing framework
- Supabase backend

You can modify any prompt file to better suit your specific needs. The prompts follow the GitHub Copilot prompt specification with YAML frontmatter.

## Contributing

To add new prompts:
1. Browse [awesome-copilot prompts](https://github.com/github/awesome-copilot/tree/main/prompts)
2. Download relevant prompts to this directory
3. Test them with your project
4. Update this README with the new additions

## Support

For prompt-related issues:
- Check the [awesome-copilot repository](https://github.com/github/awesome-copilot)
- Review VS Code Copilot documentation
- Test prompts in isolation to debug issues

---

*Last updated: July 2025*
