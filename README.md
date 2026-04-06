# AI Skills Bot

A standalone Next.js chatbot using [Vercel AI SDK](https://sdk.vercel.ai) + [just-bash](https://github.com/vercel-labs/just-bash) InMemoryFs + [bash-tool](https://github.com/vercel-labs/bash-tool) skills.

Each chat session gets a persistent `just-bash` InMemoryFs sandbox — files written in one turn are available in the next. No Docker, no VMs, no external services.

## How it works

```
User message
    ↓
POST /api/chat  (body includes chatId from useChat)
    ↓
getSkillTools()         ← cached after first request (static files)
    ↓
getSessionBashTools(chatId)
  → first turn:  createBashTool() → new InMemoryFs sandbox stored by chatId
  → later turns: reuse same sandbox (files persist across messages)
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
cp .env.example .env
# add your model credentials to .env (see Model configuration below)
npm run dev
```

Open http://localhost:3000.

## Model configuration

Provider is selected by priority. Set credentials for exactly one option in `.env`.

| Priority | Provider | Required env vars |
|----------|----------|-------------------|
| 1 | **GitHub Models** | `GITHUB_TOKEN`, `GITHUB_MODEL` |
| 2 | **Azure OpenAI** | `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT` |
| 3 | **Anthropic** | `ANTHROPIC_API_KEY` |

GitHub Models is the recommended option — create a token at https://github.com/settings/tokens and browse models at https://github.com/marketplace/models.

If the Azure endpoint contains `models.github.ai`, the OpenAI-compatible `/v1` path is used automatically.

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

- **Session-scoped sandbox**: Each chat session gets one persistent `just-bash` InMemoryFs sandbox keyed by `chatId`. Files written in turn 1 survive into turn 2+, enabling multi-step workflows like upload → analyze → filter.
- **Skill cache**: Skill SKILL.md files are read from disk once per server lifetime and reused across all requests.
- **No external sandbox**: `just-bash` runs entirely in-process. Zero infra cost, works on Vercel.
- **Skills as files**: Shell scripts are loaded into the virtual FS at sandbox creation. The AI uses the `skill` tool to discover instructions, then `bash` to run scripts.
- **`stopWhen: stepCountIs(20)`**: Allows the AI to chain multiple tool calls (load skill → write file → run script → run another script).