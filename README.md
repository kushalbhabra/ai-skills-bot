# AI Skills Bot

A standalone Next.js chatbot using [Vercel AI SDK](https://sdk.vercel.ai) + [just-bash](https://github.com/vercel-labs/just-bash) InMemoryFs + [bash-tool](https://github.com/vercel-labs/bash-tool) skills.

Each chat message spins up a fresh isolated `just-bash` InMemoryFs sandbox. No Docker, no VMs, no external services.

## How it works

```
User message
    ↓
POST /api/chat
    ↓
createSkillTool({ skillsDirectory: "./skills" })
  → reads SKILL.md files, collects shell scripts
    ↓
createBashTool({ files })
  → creates fresh just-bash InMemoryFs sandbox
  → pre-loads skill scripts into /workspace/skills/
    ↓
streamText({ tools: { skill, bash }, maxSteps: 20 })
  → AI calls skill("csv") to get instructions
  → AI calls bash("bash ./skills/csv/scripts/analyze.sh data.csv")
  → result streamed back to user
```

## Quickstart

```bash
git clone https://github.com/kushalbhabra/ai-skills-bot.git
cd ai-skills-bot
npm install
cp .env.example .env.local
# edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
```

Open http://localhost:3000.

## Skills

| Skill | Description | Scripts |
|-------|-------------|---------|
| csv | Analyze and transform CSV data | analyze, filter, select, sort |
| text | Analyze and search text files | stats, search, extract, wordfreq |

## Adding a skill

1. Create `skills/my-skill/SKILL.md` with YAML frontmatter:
   ```yaml
   ---
   name: my-skill
   description: What this skill does
   ---
   # Instructions for the AI...
   ```
2. Add bash scripts to `skills/my-skill/scripts/`
3. Restart the dev server — skills are auto-discovered

## Key design decisions

- **InMemoryFs per request**: Each POST creates a completely fresh sandbox. No state leaks between users or messages.
- **No external sandbox**: `just-bash` runs entirely in-process. Zero infra cost, works on Vercel.
- **Skills as files**: Shell scripts are loaded into the virtual FS at startup. The AI uses the `skill` tool to discover instructions, then `bash` to run scripts.
- **`stopWhen: stepCountIs(20)`**: Allows the AI to chain multiple tool calls (load skill → write file → run script → run another script).