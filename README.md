# viyv-agent-ui

AI-driven page builder library — Design pages with AI agents, render with React.

[日本語版 README](./README.ja.md)

## Overview

**viyv-agent-ui** is a declarative UI framework designed for AI agents. AI creates pages by defining a JSON structure called **PageSpec**, and the framework renders them as fully interactive React applications.

Built on [shadcn/ui](https://ui.shadcn.com/) architecture — **Radix UI** primitives wrapped with project design tokens via **CVA** (class-variance-authority) and **Tailwind CSS v4**.

Key characteristics:

- **Declarative JSON** — Pages are defined as data, not code
- **AI-operable** — Every component is optimized for AI navigation via accessibility tree (`read_page` / `find`)
- **Reactive data binding** — Expressions (`$hook`, `$state`, `$action`) connect data to UI without imperative code
- **Themeable** — CSS custom properties with dark mode support, Geist Sans / Noto Sans JP typography
- **80+ components** — Radix UI powered, accessible, consistent design across 9 categories

## Features

- 80+ pre-built components across 9 categories (Layout, Display, Input, Data, Chart, Navigation, Overlay, Map, Type Handler)
- Radix UI primitives with shadcn/ui-style wrappers (`ui/` layer)
- CVA (class-variance-authority) for type-safe component variants
- Lucide React icon integration
- Dark mode support via CSS `prefers-color-scheme`
- Geist Sans / Geist Mono / Noto Sans JP font system
- Expression system for dynamic data binding
- Hook system for data fetching (REST, SQL, derived computations)
- Action system for user interactions (state updates, navigation, CRUD)
- CSS design token theming via Tailwind CSS v4 `@theme`
- Server-side page management with REST API
- MCP (Model Context Protocol) integration for Claude Code
- Next.js adapter for seamless integration
- 10 use-case-driven demo pages

## Architecture

```
viyv-agent-ui/
├── packages/
│   ├── schema        — TypeScript types & Zod validation (PageSpec, Expression, Hook, Action)
│   ├── engine        — Expression evaluator, hook DAG resolver, derived operators
│   ├── react         — React rendering (PageRenderer, ElementRenderer, ThemeWrapper, providers)
│   ├── components    — 80+ UI components + Radix UI wrappers (ui/) + theme.css design tokens
│   ├── server        — REST API handler, page store, data source connectors
│   ├── mcp           — Model Context Protocol server for Claude Code
│   └── plugin        — Claude Code plugin wrapper
└── examples/
    └── demo-app      — Next.js 15 demo application (10 pages)
```

**Component layer structure:**

```
packages/components/src/
├── ui/             — 25 Radix UI primitive wrappers (shadcn-style, only layer that imports @radix-ui/*)
├── layout/         — Layout components (Stack, Grid, Card, Tabs, Accordion, ...)
├── display/        — Display components (Text, Badge, Alert, Progress, Carousel, ...)
├── input/          — Input components (Button, Input, Select, Checkbox, Combobox, ...)
├── overlay/        — Overlay components (Dialog, Drawer, Toast, Tooltip, ...)
├── navigation/     — Navigation components (Menu, Breadcrumbs, DropdownMenu, ...)
├── data/           — Data components (DataTable, Table, List, TreeList)
├── chart/          — Chart components (BarChart, LineChart, PieChart, ...)
├── map/            — Map component (Leaflet)
├── registry.ts     — Component registry (type name → React component)
├── catalog.ts      — Component metadata catalog (schema, categories)
├── theme.css       — Design tokens (Tailwind v4 @theme)
└── theme-vars.css  — Design tokens (CSS :root fallback for external projects)
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
git clone https://github.com/BrainFiber/viyv-agent-ui.git
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

80+ components across 9 categories + type handlers:

### Layout (13)

| Component | Description |
|---|---|
| Box | Generic container with padding/margin |
| Container | Max-width centered container |
| Spacer | Spacing element |
| Stack | Vertical/horizontal flex layout |
| Grid | Responsive CSS grid |
| Card | Bordered content container with title/footer |
| Accordion | Collapsible content panels (Radix) |
| Tabs | Tabbed content panels (Radix) |
| AspectRatio | Fixed aspect ratio container (Radix) |
| Collapsible | Single collapsible section (Radix) |
| ScrollArea | Custom scrollbar container (Radix) |
| Resizable | Resizable split panels |
| Sidebar | Sidebar navigation panel |

### Display (20)

| Component | Description |
|---|---|
| Header | Page/section header with subtitle |
| Text | Rich text with variants (heading, body, caption, price) |
| Stat | Metric card with trend indicator |
| Badge | Status/category label with color variants |
| Tag | Removable label |
| Link | Hyperlink |
| Alert | Info/success/warning/error banner |
| Avatar | User avatar (image or initials) |
| Divider | Horizontal/vertical divider |
| Progress | Progress indicator (Radix) |
| Image | Responsive image |
| Empty | Empty state placeholder |
| Skeleton | Loading placeholder |
| Spinner | Loading spinner |
| Carousel | Image/content slideshow (embla-carousel) |
| Descriptions | Key-value description list |
| Calendar | Month calendar with events |
| Label | Form label |
| Kbd | Keyboard shortcut display |
| Item | Generic list item |

### Input (20)

| Component | Description |
|---|---|
| Button | Clickable button with CVA variants (primary/secondary/danger/ghost/outline) |
| ButtonGroup | Group of buttons |
| Input | Text field (text, number, date, email, tel, url) |
| InputGroup | Input with prefix/suffix addons |
| InputOTP | One-time password input |
| Select | Dropdown select (Radix) |
| NativeSelect | Native HTML select |
| Textarea | Multi-line text input |
| Checkbox | Checkbox toggle (Radix) |
| RadioGroup | Radio button group (Radix) |
| Switch | ON/OFF toggle switch (Radix) |
| Slider | Range value slider (Radix) |
| Toggle | Pressable toggle button (Radix) |
| ToggleGroup | Exclusive/multiple toggle group (Radix) |
| Combobox | Input with type-ahead suggestions (cmdk) |
| CommandPalette | Command palette search dialog (cmdk) |
| Rating | Star rating input |
| DatePicker | Date picker input |
| Field | Form field with label and error |
| Form | Form container with validation |

### Data (4)

| Component | Description |
|---|---|
| DataTable | Sortable, filterable data table with badges and pagination |
| Table | Simple table (header + body) |
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

### Navigation (8)

| Component | Description |
|---|---|
| Breadcrumbs | Path navigation |
| Stepper | Step progress indicator |
| Menu | Navigation menu with nested items |
| Pagination | Page navigation |
| DropdownMenu | Dropdown action menu (Radix) |
| ContextMenu | Right-click context menu (Radix) |
| NavigationMenu | Top-level navigation with sub-menus (Radix) |
| Menubar | Application menu bar (Radix) |

### Overlay (8)

| Component | Description |
|---|---|
| Dialog | Modal dialog (Radix) |
| AlertDialog | Confirmation dialog (Radix) |
| Drawer | Slide-in side panel (vaul) |
| Popover | Floating content panel (Radix) |
| HoverCard | Hover-triggered preview card (Radix) |
| Toast | Auto-dismiss notification (Radix) |
| ToastContainer | Toast viewport container |
| Tooltip | Hover tooltip (Radix) |

### Map (1)

| Component | Description |
|---|---|
| Map | Interactive map with markers (requires `leaflet` + `react-leaflet`) |

### Type Handlers (4)

| Component | Description |
|---|---|
| Repeater | Renders a list of elements from hook data |
| KanbanBoard | Kanban task board |
| Timeline | Chronological timeline |
| Feed | Activity feed |

## Theming

Components use CSS custom properties defined via Tailwind CSS v4's `@theme` directive. Full dark mode support via `prefers-color-scheme`.

### Typography

- **Sans-serif:** Geist Sans, Noto Sans JP (Japanese), system fallbacks
- **Monospace:** Geist Mono, SF Mono, Cascadia Code, Fira Code

### Same-project usage (Tailwind v4)

```css
/* your-app/globals.css */
@import "tailwindcss";
@import "@viyv/agent-ui-components/theme.css";

/* Override brand colors */
@theme {
  --color-primary: #e11d48;
  --color-primary-hover: #be123c;
}
```

### External project usage (non-Tailwind / webpack)

For projects where Tailwind v4's `@theme` directive is not processed (e.g. webpack CSS loader), use `theme-vars.css` which provides all tokens as standard `:root` CSS variables:

```css
@import "@viyv/agent-ui-components/theme-vars.css";
```

### Available Tokens

| Category | Tokens |
|---|---|
| Primary | `--color-primary`, `--color-primary-hover`, `--color-primary-fg`, `--color-primary-soft`, `--color-primary-soft-fg`, `--color-primary-soft-border` |
| Danger | `--color-danger`, `--color-danger-hover`, `--color-danger-fg`, `--color-danger-soft`, `--color-danger-soft-fg`, `--color-danger-soft-border` |
| Success | `--color-success`, `--color-success-fg`, `--color-success-soft`, `--color-success-soft-fg`, `--color-success-soft-border` |
| Warning | `--color-warning`, `--color-warning-fg`, `--color-warning-accent`, `--color-warning-soft`, `--color-warning-soft-fg`, `--color-warning-soft-border` |
| Surfaces | `--color-surface`, `--color-surface-alt`, `--color-muted`, `--color-muted-strong`, `--color-accent` |
| Text | `--color-fg`, `--color-fg-secondary`, `--color-fg-muted`, `--color-fg-subtle`, `--color-fg-disabled` |
| Borders | `--color-border`, `--color-border-strong`, `--color-border-input` |
| Utility | `--color-ring`, `--color-overlay`, `--color-tooltip-bg`, `--color-tooltip-fg` |
| Radius | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full` |
| Shadows | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl` |

### Runtime Theme Override

Set `accentColor` in PageSpec to override the primary color per page:

```json
{
  "theme": { "accentColor": "#7c3aed" }
}
```

## Demo Pages

The demo app includes 10 use-case-driven pages:

| Page | Description |
|---|---|
| Dashboard | KPI cards, charts, recent activity |
| Data Management | CRUD table with filters, dialogs, toast |
| Form Builder | Various input types and validation |
| E-commerce Product | Product gallery, reviews, cart |
| Settings Panel | Tabs, switches, form groups |
| Content Blog | Article layout, typography showcase |
| Navigation Showcase | Menubar, breadcrumbs, sidebar, command palette |
| Overlay & Feedback | Dialog, drawer, toast, tooltip, alert dialog |
| Kanban Project | Drag-and-drop task board |
| Timeline Activity | Chronological event feed |

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
| UI Primitives | Radix UI (25 primitives) |
| Variants | CVA (class-variance-authority) |
| Icons | Lucide React |
| Validation | Zod |
| Styling | Tailwind CSS v4 + tailwind-merge + clsx |
| Charts | Recharts (optional) |
| Maps | Leaflet + react-leaflet (optional) |
| Carousel | embla-carousel |
| Command Palette | cmdk |
| Drawer | vaul |
| Build | Turbo |
| Lint | Biome |
| Test | Vitest |
| Demo | Next.js 15 |

## License

MIT
