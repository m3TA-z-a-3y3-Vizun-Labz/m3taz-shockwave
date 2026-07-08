## Learned User Preferences

- Prefers multitask/delegation workflows — spawn background subagents when offered parallel options ("both", "all three", "Start multitasking").
- When asked to choose among paths, typically wants all actionable options executed rather than a single pick.
- Claude Code Z.AI GLM-5.2 config lives in `~/.claude/settings.json` (`ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_BASE_URL`, default model env vars).
- Claude Code MCP servers belong in `~/.claude.json` via `claude mcp add` — `mcpServers` in `settings.json` is ignored.
- Uses Cursor as the primary agentic IDE alongside Claude Code and Shockwave's built-in pi agent.
- Keeps Granola and Pieces MCP for meeting context and long-term memory rather than replacing them with self-hosted alternatives.

## Learned Workspace Facts

- Shockwave's coding agent uses `@earendil-works/pi-ai`; the pinned catalog can lag newly released models.
- GLM-5.2 is injected via `src/main/injectedModels.ts` for `zai` (`glm-5.2`) and `openrouter` (`z-ai/glm-5.2`) when absent from the pi-ai catalog.
- Shockwave vision uses `glm-5v-turbo` via the `zai` or `openrouter` provider (already in the pi-ai catalog).
- Hermes Agent MOA/vision is routed to local `omlx` at `http://127.0.0.1:8000/v1` after OpenRouter credit exhaustion (402).
- Dev machine: macOS M5 Max with 48GB unified memory — Ornith 35B via Ollama is a strong local option; Shockwave connects via `openai-compatible` at `http://localhost:11434/v1`.
- `codex-plugin-cc` is installed in Claude Code (Codex reviews alongside Z.AI GLM); requires `/reload-plugins` then `/codex:setup`.
- OmniRoute was trialed but not adopted (HTTP health hang, no providers configured); `omlx` remains the working local inference fallback.
- Z.AI is the primary paid coding path (Claude Code + Shockwave `zai` provider); OpenRouter is exhausted and used only as an optional fallback.
- Active feature branch: `cursor/github-fetch-and-electron-install` (`mainFetch` via Electron `net.fetch`, `scripts/ensure-electron.mjs`).
