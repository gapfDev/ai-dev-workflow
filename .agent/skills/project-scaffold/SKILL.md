---
description: How to initialize a project repository with proper structure and configuration
---

# Project Scaffold

Skill for creating a project repository with the correct folder structure, configuration, and base files for the chosen tech stack.

## Input
- Defined tech stack (platform, language, frameworks)
- Project name

## Output
- Initialized repository with folder structure, README.md, and .gitignore

## Process

### Phase 1: Identify Stack
1. Read the tech stack definition
2. Identify: Platform, Language, UI Framework, DB

### Phase 2: Create Repo
```bash
# 1. Initialize repository
git init [project-name]

# 2. Create base structure
mkdir -p src/main src/test docs

# 3. Create base files
touch README.md .gitignore
```

### Phase 3: Structure by Platform

**Android (Kotlin):**
```
app/
├── src/
│   ├── main/
│   │   ├── java/com/[package]/
│   │   │   ├── data/          # Repositories, DAOs
│   │   │   ├── domain/        # Use cases, models
│   │   │   ├── ui/            # Screens, ViewModels
│   │   │   └── di/            # Dependency injection
│   │   └── res/
│   └── test/
├── build.gradle.kts
└── gradle/
```

**Web (Vite/React):**
```
src/
├── components/    # Reusable components
├── pages/         # Pages/Routes
├── hooks/         # Custom hooks
├── services/      # API calls
├── utils/         # Utilities
└── styles/        # CSS/Styled
```

**General (any project):**
```
project-root/
├── docs/             # Project documentation
├── src/              # Source code
├── tests/            # Tests
├── README.md
└── .gitignore
```

### Phase 4: README.md
The README must contain at minimum:
1. Project name
2. Brief description
3. Tech stack
4. How to run the project
5. Folder structure

## Completeness Checklist
- □ Repo initialized with git?
- □ Folder structure matches the stack?
- □ .gitignore appropriate for the stack?
- □ Project compiles/runs without errors?
- □ README has the minimum sections?

## Rules
1. **ALWAYS** create a `.gitignore` appropriate for the stack
2. **ALWAYS** verify the project compiles/runs before finishing
3. **NEVER** add business logic — structure and configuration only
