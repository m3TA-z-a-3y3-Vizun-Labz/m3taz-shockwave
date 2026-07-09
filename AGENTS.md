## Learned User Preferences

- Prefers multitask/delegation workflows — spawn background subagents when offered parallel options ("both", "all three", "Start multitasking").
- When asked to choose among paths, typically wants all actionable options executed rather than a single pick.
- Prefers executing commit-and-push via Cursor's diff tab rather than asking the agent to draft manual git commands.
- Claude Code Z.AI GLM-5.2 config lives in `~/.claude/settings.json` (`ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_BASE_URL`, default model env vars); placeholder or expired token causes 401. Shockwave agent keys are separate — configure provider `zai` + API key in Settings → Agent (not via Claude env); fresh installs default to `anthropic`/`claude-sonnet-4-5` with empty `apiKey` until changed.
- Claude Code MCP servers belong in `~/.claude.json` via `claude mcp add` — `mcpServers` in `settings.json` is ignored.
- Uses Cursor as the primary agentic IDE alongside Claude Code and Shockwave's built-in pi agent.
- Keeps Granola and Pieces MCP for meeting context and long-term memory rather than replacing them with self-hosted alternatives.

## Learned Workspace Facts

- Shockwave's coding agent uses `@earendil-works/pi-ai` (catalog can lag); GLM-5.2 is injected via `src/main/injectedModels.ts` for `zai`/`openrouter` when absent; vision uses `glm-5v-turbo`.
- Dify Cloud is used for team/customer RAG prototyping; Shockwave Docs Helper app and upload bundle live at `docs/dify-knowledge-bundle/`.
- Hermes Agent MOA/vision routes to local `omlx` at `http://127.0.0.1:8000/v1` after OpenRouter credit exhaustion (402); `omlx launch claude` does not override Claude Code's Z.AI env from `~/.claude/settings.json` — use `CLAUDECODE=0` or clear those env vars for local-only runs.
- Shockwave user settings persist at `~/Library/Application Support/shockwave/settings.json` (`codingAgent`, workspaces, `agentSecrets`); active workspace is the iCloud Drive root — large scope slows the pi agent.
- Dev machine: macOS M5 Max with 48GB unified memory — Ornith 35B via Ollama is a strong local option; Shockwave connects via `openai-compatible` at `http://localhost:11434/v1`.
- `codex-plugin-cc` is installed in Claude Code (Codex reviews alongside Z.AI GLM); requires `/reload-plugins` then `/codex:setup`.
- Z.AI is the primary paid coding path (Claude Code + Shockwave `zai` provider); OpenRouter is exhausted and used only as an optional fallback.
- GitHub fork is `EagleEyeVisionLabz/m3taz-shockwave`; [PR #1](https://github.com/EagleEyeVisionLabz/m3taz-shockwave/pull/1) on `cursor/github-fetch-and-electron-install` (mainFetch, ensure-electron, GLM-5.2, Dify bundle). Local dev is ready; fork has no releases — upstream `stephengpope/shockwave` ships desktop builds (v1.0.8).
- Main-process outbound HTTP uses `src/main/mainFetch.ts` (Electron `net.fetch` with Node `fetch` fallback) for GitHub Sync verify/API, update checks, voice tokens, and agent connection validation.
- `npm run dev` runs `scripts/ensure-electron.mjs` first; npm `allow-scripts` skipping electron postinstall causes "Electron uninstall" — fix with `npm approve-scripts electron && npm rebuild electron`.
- `.cursor/hooks/state/` (continual-learning index) is machine-local with absolute transcript paths — keep untracked; add to `.gitignore` if not already ignored.
- Command-center ecosystem: OpenKnowledge on `MetaHu3manOS` is the live agent knowledge hub; Qu3bii codebase exists but is not wired into Hermes MCP; Lyf3-0s has no on-disk project; Obsidian vault is the full `m3taz-wURLd` iCloud tree.
