# viyv-agent-ui

AI-driven page builder library — Design pages with AI agents, render with React.

[日本語版 README](./README.ja.md)

## Overview

**viyv-agent-ui** is a declarative UI framework designed for AI agents. AI creates pages by defining a JSON structure called **PageSpec**, and the framework renders them as fully interactive React applications.

Key characteristics:

- **Declarative JSON** — Pages are defined as data, not code
- **AI-operable** — Every component is optimized for AI navigation via accessibility tree (`read_page` / `find`)
- **Reactive data binding** — Expressions (`$hook`, `$state`, `$action`) connect data to UI without imperative code
- **Themeable** — CSS custom properties allow full visual customization with zero JS overhead

## Features

- 50 pre-built components across 8 categories
- Expression system for dynamic data binding
- Hook system for data fetching (REST, SQL, derived computations)
- Action system for user interactions (state updates, navigation, CRUD)
- CSS design token theming via Tailwind CSS v4 `@theme`
- Server-side page management with REST API
- MCP (Model Context Protocol) integration for Claude Code
- Next.js adapter for seamless integration

## Architecture

```
viyv-agent-ui/
├── packages/
│   ├── schema        — TypeScript types & Zod validation (PageSpec, Expression, Hook, Action)
│   ├── engine        — Expression evaluator, hook DAG resolver, derived operators
│   ├── react         — React rendering (PageRenderer, ElementRenderer, ThemeWrapper, providers)
│   ├── components    — 50 UI components + theme.css design tokens
│   ├── server        — REST API handler, page store, data source connectors
│   ├── mcp           — Model Context Protocol server for Claude Code
│   └── plugin        — Claude Code plugin wrapper
└── examples/
    └── demo-app      — Next.js 15 demo application
```

**Dependency flow:**

```
schema → engine → react → components
                ↘ server
                ↘ mcp
```

## Quick Start

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Install & Build

```bash
git clone <repository-url>
cd viyv-agent-ui
pnpm install
pnpm build
```

### Run the Demo

```bash
cd examples/demo-app
pnpm dev
# → http://localhost:3100
```

### Create a Page via API

```bash
curl -X POST http://localhost:3100/api/agent-ui/pages \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "hello",
    "title": "Hello World",
    "root": "r",
    "hooks": {},
    "elements": {
      "r": {
        "type": "Stack",
        "props": { "gap": 4 },
        "children": ["heading", "btn"]
      },
      "heading": {
        "type": "Header",
        "props": { "title": "Hello from AI", "subtitle": "Built with agent-ui" }
      },
      "btn": {
        "type": "Button",
        "props": { "label": "Click me", "onClick": "$action.greet" }
      }
    },
    "state": {},
    "actions": {
      "greet": { "type": "setState", "key": "message", "value": "Hello!" }
    }
  }'
```

Then open `http://localhost:3100/pages/hello`.

## Core Concepts

### PageSpec

A complete page definition as JSON:

```typescript
{
  id: string;
  title: string;
  hooks: Record<string, HookDef>;       // Data sources
  root: string;                          // Root element ID
  elements: Record<string, ElementDef>;  // Component tree
  state: Record<string, unknown>;        // Initial state
  actions: Record<string, ActionDef>;    // Event handlers
  theme?: { colorScheme, accentColor, spacing };
}
```

### Expression System

Dynamic values using special prefixes:

| Expression | Description | Example |
|---|---|---|
| `$hook.{id}.{path}` | Access hook data | `$hook.users.0.name` |
| `$state.{key}` | Read page state | `$state.selectedTab` |
| `$bindState.{key}` | Two-way state binding | `$bindState.searchQuery` |
| `$action.{id}` | Reference an action | `$action.handleSubmit` |
| `$item.{path}` | Current item in Repeater/Feed | `$item.title` |
| `$expr({code})` | Inline JS expression | `$expr(state.count + 1)` |

### Hook System

5 hook types for data management:

| Type | Purpose |
|---|---|
| `useState` | Initial state value |
| `useDerived` | Computed data from another hook (sort, filter, limit, groupBy, aggregate) |
| `useFetch` | HTTP GET/POST with optional refresh interval |
| `useSqlQuery` | Database queries |
| `useAgentQuery` | Custom endpoint queries |

### Action System

7 action types for user interactions:

| Type | Purpose |
|---|---|
| `setState` | Update page state |
| `refreshHook` | Re-fetch hook data |
| `navigate` | URL navigation |
| `submitForm` | POST/PUT/PATCH with form data |
| `addItem` | Add item to array (CRUD) |
| `removeItem` | Remove item from array (CRUD) |
| `updateItem` | Update item in array (CRUD) |

## Components

50 components across 8 categories:

### Layout (5)

| Component | Description |
|---|---|
| Stack | Vertical/horizontal flex layout |
| Grid | Responsive CSS grid |
| Card | Bordered content container |
| Tabs | Tabbed content panels |
| Collapse | Accordion panels |

### Input (10)

| Component | Description |
|---|---|
| Button | Clickable button (primary / secondary / danger) |
| TextInput | Text field (text, number, date, email, tel, url) |
| Textarea | Multi-line text input |
| Select | Dropdown select |
| Checkbox | Checkbox toggle |
| RadioGroup | Radio button group |
| Switch | ON/OFF toggle switch |
| Slider | Range value slider |
| Autocomplete | Input with type-ahead suggestions |
| Rating | Star rating input |

### Display (16)

| Component | Description |
|---|---|
| Header | Page/section header with subtitle |
| Text | Rich text with variants (heading, body, caption, price) |
| Stat | Metric card with trend indicator |
| Badge | Status/category label |
| Tag | Removable label |
| Link | Hyperlink |
| Alert | Info/success/warning/error banner |
| Avatar | User avatar (image or initials) |
| Divider | Horizontal/vertical divider |
| ProgressBar | Progress indicator |
| Image | Responsive image |
| Empty | Empty state placeholder |
| Skeleton | Loading placeholder |
| Spinner | Loading spinner |
| Carousel | Image slideshow |
| Descriptions | Key-value description list |
| Calendar | Month calendar with events |

### Data (3)

| Component | Description |
|---|---|
| DataTable | Sortable, filterable data table with badges and row highlights |
| List | Simple list with avatars and secondary text |
| TreeList | Hierarchical tree view |

### Chart (5)

| Component | Description |
|---|---|
| BarChart | Bar chart (requires `recharts`) |
| LineChart | Line chart (requires `recharts`) |
| AreaChart | Area chart (requires `recharts`) |
| PieChart | Pie/donut chart (requires `recharts`) |
| GanttChart | Gantt schedule chart |

### Navigation (4)

| Component | Description |
|---|---|
| Breadcrumbs | Path navigation |
| Stepper | Step progress indicator |
| Menu | Navigation menu with nested items |
| Pagination | Page navigation |

### Overlay (4)

| Component | Description |
|---|---|
| Dialog | Modal dialog |
| Drawer | Slide-in side panel |
| Toast | Auto-dismiss notification |
| Tooltip | Hover popup |

### Type Handlers (4)

| Component | Description |
|---|---|
| Repeater | Renders a list of elements from hook data |
| KanbanBoard | Kanban task board |
| Timeline | Chronological timeline |
| Feed | Activity feed |

## Theming

Components use CSS custom properties defined via Tailwind CSS v4's `@theme` directive. Override them in your CSS to customize the design:

```css
/* your-app/globals.css */
@import "tailwindcss";
@import "@viyv/agent-ui-components/theme.css";

/* Override brand colors */
@theme {
  --color-primary: #e11d48;
  --color-primary-hover: #be123c;
  --color-primary-fg: #ffffff;
  --color-primary-soft: #fff1f2;
  --color-primary-soft-fg: #9f1239;
  --color-primary-soft-border: #fecdd3;
}
```

### Available Tokens

| Category | Tokens |
|---|---|
| Primary | `--color-primary`, `--color-primary-hover`, `--color-primary-fg`, `--color-primary-soft`, `--color-primary-soft-fg`, `--color-primary-soft-border` |
| Danger | `--color-danger`, `--color-danger-hover`, `--color-danger-fg`, `--color-danger-soft`, `--color-danger-soft-fg`, `--color-danger-soft-border` |
| Success | `--color-success`, `--color-success-fg`, `--color-success-soft`, `--color-success-soft-fg`, `--color-success-soft-border` |
| Warning | `--color-warning`, `--color-warning-fg`, `--color-warning-accent`, `--color-warning-soft`, `--color-warning-soft-fg`, `--color-warning-soft-border` |
| Surfaces | `--color-surface`, `--color-surface-alt`, `--color-muted`, `--color-muted-strong` |
| Text | `--color-fg`, `--color-fg-secondary`, `--color-fg-muted`, `--color-fg-subtle`, `--color-fg-disabled` |
| Borders | `--color-border`, `--color-border-strong` |
| Utility | `--color-ring`, `--color-overlay`, `--color-tooltip-bg`, `--color-tooltip-fg` |

### Runtime Theme Override

Set `accentColor` in PageSpec to override the primary color per page:

```json
{
  "theme": { "accentColor": "#7c3aed" }
}
```

## Server API

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/pages` | List all pages |
| `GET` | `/pages/:id` | Get page spec |
| `POST` | `/pages` | Create page |
| `PUT` | `/pages/:id` | Update page |
| `DELETE` | `/pages/:id` | Delete page |
| `POST` | `/pages/preview` | Create preview (30min TTL) |
| `GET` | `/pages/preview/:id` | Get preview |
| `POST` | `/hooks/:hookId/execute` | Execute a data hook |

### Next.js Integration

```typescript
// app/api/agent-ui/[...path]/route.ts
import { createHandler } from '@viyv/agent-ui-server/next';
import { MemoryPageStore } from '@viyv/agent-ui-server';

const handler = createHandler({
  pageStore: new MemoryPageStore(),
  basePath: '/api/agent-ui',
});

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
```

## Development

```bash
pnpm build                # Build all packages
pnpm typecheck            # TypeScript type checking
pnpm test                 # Run tests (Vitest)
pnpm lint                 # Lint with Biome
pnpm lint:fix             # Auto-fix lint issues

# Package-specific
pnpm --filter @viyv/agent-ui-components typecheck
pnpm --filter @viyv/agent-ui-components test
```

### Tech Stack

| Category | Technology |
|---|---|
| Language | TypeScript 5.7 |
| UI | React 18/19 |
| Validation | Zod |
| Styling | Tailwind CSS 4 |
| Charts | Recharts (optional) |
| Maps | Leaflet + react-leaflet (optional) |
| Build | Turbo |
| Lint | Biome |
| Test | Vitest |
| Demo | Next.js 15 |

## License

MIT
