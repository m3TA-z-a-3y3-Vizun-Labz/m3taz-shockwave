# Shockwave Docs Helper — Dify Knowledge Bundle

Ready-to-upload markdown corpus for the first Dify Cloud app **Shockwave Docs Helper**.

## Purpose

This folder is a frozen snapshot of Shockwave's contributor documentation:

| File | Source | Covers |
|---|---|---|
| `shockwave-root-architecture.md` | `CLAUDE.md` | Commands, architecture, terminology, link-index invariants |
| `shockwave-main-process.md` | `src/main/CLAUDE.md` | Watcher, IPC, settings, coding agent, GitHub sync |
| `shockwave-renderer.md` | `src/renderer/CLAUDE.md` | React state, editor, chat sidebar, sync UI |
| `shockwave-agent-preferences.md` | `AGENTS.md` | Learned preferences and workspace facts (no secrets) |

Upload all four `.md` files to a Dify knowledge base so the chatbot can answer questions about Shockwave's codebase, conventions, and architecture.

## Upload to Dify Cloud (Economical indexing)

1. Open [cloud.dify.ai](https://cloud.dify.ai/) → **Knowledge** → **Create Knowledge**
2. **Import from file** → select all four `shockwave-*.md` files in this folder (do **not** upload `README.md` or `UPLOAD.txt`)
3. **Chunk settings:** defaults are fine; if chunks feel too large, use **Custom** separator `##`
4. **Index method:** **Economical** (keyword/inverted index — no embedding API needed; Z.AI has no embeddings endpoint)
5. **Retrieval:** Inverted index, TopK **3–5**
6. **Save and Process** → wait until status is **Completed**
7. **Retrieval Testing:** try sample questions (see checklist below)

Then attach the knowledge base to your **Shockwave Docs Helper** chatbot: **Studio** → open app → **Context** → **Add** → select this knowledge base. Use your Z.AI custom model (not a Dify system model) to avoid burning Sandbox credits.

## Onboarding checklist

```
□ Log in to cloud.dify.ai
□ Skim Explore templates (optional; uses credits if system models)
□ Create Z.AI key at z.ai/manage-apikey (label: dify-prototype)
□ curl smoke-test general + coding endpoints
□ Integrations → Model Provider → Install OpenAI-API-compatible
□ Add LLM model (glm-5.2 @ https://api.z.ai/api/paas/v4)
□ Knowledge → Create → upload Shockwave docs (this bundle)
□ Index: Economical | Retrieval: inverted index, TopK 3
□ Wait for indexing → run Retrieval Testing
□ Studio → Chatbot → attach knowledge base
□ Select Z.AI model (not system model)
□ Enable citations | test in Debug and Preview
□ Publish
□ API Access → create key → curl /chat-messages
□ (Later) Embed widget or wire n8n
```

### Sample test questions

- "What's the save-debounce window and why does mtime matter?"
- "How do I add a persisted settings field?"
- "What's the difference between a file and a wiki-link basename?"

## Refreshing this bundle

Re-copy from repo sources when docs change:

```bash
cp CLAUDE.md docs/dify-knowledge-bundle/shockwave-root-architecture.md
cp src/main/CLAUDE.md docs/dify-knowledge-bundle/shockwave-main-process.md
cp src/renderer/CLAUDE.md docs/dify-knowledge-bundle/shockwave-renderer.md
cp AGENTS.md docs/dify-knowledge-bundle/shockwave-agent-preferences.md
```

Re-upload changed files in Dify (or replace the knowledge base document set).
