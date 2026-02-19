---
name: markdown-copy-paste
description: Ensures deliverables and structured content are presented in clear, copy-friendly Markdown code blocks for easy human consumption.
---

# Markdown Copy-Paste Communication

This skill defines the standard for presenting information to the human user in a way that is immediately usable and copy-paste friendly.

## Input
- Any deliverable intended for user reuse (code, scripts, config, docs, drafts).

## Output
- Copy-ready artifact blocks with clear boundaries and minimal surrounding text.

## Process

### Phase 1: Apply the Golden Rule
**If the user needs to use it, put it in a code block.**

Content intended for the user to copy (code, scripts, text drafts, configuration) MUST be isolated in code blocks.
Do not mix instructional text with the content the user needs to copy.

### Phase 2: Apply Formatting Standards

### 2.1 Code & Scripts
Always use a code block with the appropriate language tag.
Include the filename as a comment or header *outside* the block if necessary.

**Bad:**
Here is the python script:
def hello():
    print("world")

**Good:**
```python
# script.py
def hello():
    print("world")
```

### 2.2 Terminal Commands
Always use `bash` or `sh` blocks for commands.
Never use a prompt symbol (`$`, `>`) unless simulating a specific shell session where input/output distinction is crucial.
The user should be able to copy the entire block and run it.

**Bad:**
$ npm install
$ npm start

**Good:**
```bash
npm install
npm start
```

### 2.3 Documentation / Text Assets
If the deliverable is a text draft (email, report, message), use a `markdown` or `text` block.

**Bad:**
Hello Team, Project is Green.

**Good:**
```markdown
# Project Update
- Status: Green
- Next: Deploy
```

### Phase 3: Structure the Response

When the user asks for a specific artifact:

1.  **Brief Context:** 1-2 lines explaining what this is.
2.  **The Artifact (Code Block):** The core content.
3.  **Action:** What to do with it (optional).

### Phase 4: Reject Anti-Patterns
- **Inline Code for Long Strings:** Don't use `code` for multi-line content.
- **Ambiguous Boundaries:** Don't let the artifact blend into your commentary.
- **Unnecessary chatter:** Don't explain line-by-line unless asked. The code block is the hero.

## Rules
1. **ALWAYS** place copy-target content inside fenced code blocks.
2. **ALWAYS** use an appropriate language tag when possible.
3. **NEVER** mix artifact lines with explanatory prose in the same block.
4. **NEVER** require manual cleanup before the user can copy/run content.
