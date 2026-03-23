# viyv-agent-ui

AI 駆動のページビルダーライブラリ — AI エージェントがページを設計し、React でレンダリング。

[English README](./README.md)

## 概要

**viyv-agent-ui** は AI エージェント向けに設計された宣言的 UI フレームワークです。AI が **PageSpec** という JSON 構造を定義するだけで、完全にインタラクティブな React アプリケーションとしてレンダリングされます。

[shadcn/ui](https://ui.shadcn.com/) アーキテクチャを採用 — **Radix UI** プリミティブを **CVA** (class-variance-authority) と **Tailwind CSS v4** でプロジェクトのデザイントークンにラップ。

主な特徴:

- **宣言的 JSON** — ページをコードではなくデータとして定義
- **AI 操作可能** — 全コンポーネントがアクセシビリティツリー (`read_page` / `find`) を介した AI ナビゲーションに最適化
- **リアクティブデータバインディング** — 式 (`$hook`, `$state`, `$action`) がデータと UI を命令的コードなしで接続
- **テーマカスタマイズ** — CSS カスタムプロパティ + ダークモード対応、Geist Sans / Noto Sans JP タイポグラフィ
- **80+ コンポーネント** — Radix UI ベース、アクセシブル、9カテゴリの統一デザイン

## 機能

- 9カテゴリ 80+ 種のビルトインコンポーネント (レイアウト, 表示, 入力, データ, チャート, ナビゲーション, オーバーレイ, 地図, タイプハンドラー)
- Radix UI プリミティブ + shadcn/ui スタイルのラッパー (`ui/` レイヤー)
- CVA (class-variance-authority) による型安全なコンポーネントバリアント
- Lucide React アイコン統合
- CSS `prefers-color-scheme` によるダークモード対応
- Geist Sans / Geist Mono / Noto Sans JP フォントシステム
- 動的データバインディングのための式システム
- データ取得用フックシステム (REST, SQL, 派生計算)
- ユーザーインタラクション用アクションシステム (状態更新, ナビゲーション, CRUD)
- Tailwind CSS v4 `@theme` による CSS デザイントークンテーマ
- REST API によるサーバーサイドページ管理
- Claude Code 用 MCP (Model Context Protocol) 統合
- Next.js アダプター
- 10 種のユースケース別デモページ

## アーキテクチャ

```
viyv-agent-ui/
├── packages/
│   ├── schema        — TypeScript 型定義 & Zod バリデーション (PageSpec, Expression, Hook, Action)
│   ├── engine        — 式評価エンジン, フック DAG リゾルバー, 派生オペレーター
│   ├── react         — React レンダリング (PageRenderer, ElementRenderer, ThemeWrapper, プロバイダー)
│   ├── components    — 80+ UI コンポーネント + Radix UI ラッパー (ui/) + theme.css デザイントークン
│   ├── server        — REST API ハンドラー, ページストア, データソースコネクター
│   ├── mcp           — Claude Code 用 Model Context Protocol サーバー
│   └── plugin        — Claude Code プラグインラッパー
└── examples/
    └── demo-app      — Next.js 15 デモアプリケーション (10 ページ)
```

**コンポーネントレイヤー構造:**

```
packages/components/src/
├── ui/             — 25 Radix UI プリミティブラッパー (shadcn スタイル、@radix-ui/* を直接 import する唯一のレイヤー)
├── layout/         — レイアウトコンポーネント (Stack, Grid, Card, Tabs, Accordion, ...)
├── display/        — 表示コンポーネント (Text, Badge, Alert, Progress, Carousel, ...)
├── input/          — 入力コンポーネント (Button, Input, Select, Checkbox, Combobox, ...)
├── overlay/        — オーバーレイコンポーネント (Dialog, Drawer, Toast, Tooltip, ...)
├── navigation/     — ナビゲーションコンポーネント (Menu, Breadcrumbs, DropdownMenu, ...)
├── data/           — データコンポーネント (DataTable, Table, List, TreeList)
├── chart/          — チャートコンポーネント (BarChart, LineChart, PieChart, ...)
├── map/            — 地図コンポーネント (Leaflet)
├── registry.ts     — コンポーネントレジストリ (型名 → React コンポーネント)
├── catalog.ts      — コンポーネントメタデータカタログ (スキーマ, カテゴリ)
├── theme.css       — デザイントークン (Tailwind v4 @theme)
└── theme-vars.css  — デザイントークン (外部プロジェクト向け CSS :root フォールバック)
```

**依存関係フロー:**

```
schema → engine → react → components
                ↘ server
                ↘ mcp
```

## クイックスタート

### 前提条件

- Node.js >= 20
- pnpm >= 9

### インストール & ビルド

```bash
git clone https://github.com/BrainFiber/viyv-agent-ui.git
cd viyv-agent-ui
pnpm install
pnpm build
```

### デモの起動

```bash
cd examples/demo-app
pnpm dev
# → http://localhost:3100
```

### API でページを作成

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
        "props": { "title": "AI からこんにちは", "subtitle": "agent-ui で構築" }
      },
      "btn": {
        "type": "Button",
        "props": { "label": "クリック", "onClick": "$action.greet" }
      }
    },
    "state": {},
    "actions": {
      "greet": { "type": "setState", "key": "message", "value": "こんにちは！" }
    }
  }'
```

`http://localhost:3100/pages/hello` を開いて確認。

## コアコンセプト

### PageSpec

ページ全体を JSON で定義:

```typescript
{
  id: string;
  title: string;
  hooks: Record<string, HookDef>;       // データソース
  root: string;                          // ルート要素 ID
  elements: Record<string, ElementDef>;  // コンポーネントツリー
  state: Record<string, unknown>;        // 初期状態
  actions: Record<string, ActionDef>;    // イベントハンドラー
  theme?: { colorScheme, accentColor, spacing };
}
```

### 式システム

特殊プレフィックスによる動的値:

| 式 | 説明 | 例 |
|---|---|---|
| `$hook.{id}.{path}` | フックデータへのアクセス | `$hook.users.0.name` |
| `$state.{key}` | ページ状態の読み取り | `$state.selectedTab` |
| `$bindState.{key}` | 双方向状態バインディング | `$bindState.searchQuery` |
| `$action.{id}` | アクションの参照 | `$action.handleSubmit` |
| `$item.{path}` | Repeater/Feed 内の現在のアイテム | `$item.title` |
| `$expr({code})` | インライン JS 式 | `$expr(state.count + 1)` |

### フックシステム

データ管理のための5種のフック:

| タイプ | 用途 |
|---|---|
| `useState` | 初期状態値 |
| `useDerived` | 他のフックからの計算データ (sort, filter, limit, groupBy, aggregate) |
| `useFetch` | HTTP GET/POST (リフレッシュ間隔設定可) |
| `useSqlQuery` | データベースクエリ |
| `useAgentQuery` | カスタムエンドポイントクエリ |

### アクションシステム

ユーザーインタラクション用の7種のアクション:

| タイプ | 用途 |
|---|---|
| `setState` | ページ状態の更新 |
| `refreshHook` | フックデータの再取得 |
| `navigate` | URL ナビゲーション |
| `submitForm` | POST/PUT/PATCH でフォーム送信 |
| `addItem` | 配列にアイテム追加 (CRUD) |
| `removeItem` | 配列からアイテム削除 (CRUD) |
| `updateItem` | 配列内アイテム更新 (CRUD) |

## コンポーネント

9カテゴリ 80+ 種のコンポーネント + タイプハンドラー:

### レイアウト (13)

| コンポーネント | 説明 |
|---|---|
| Box | パディング/マージン付き汎用コンテナ |
| Container | 最大幅制限付き中央寄せコンテナ |
| Spacer | スペーシング要素 |
| Stack | 縦/横方向の Flex レイアウト |
| Grid | レスポンシブ CSS グリッド |
| Card | タイトル/フッター付きボーダーコンテナ |
| Accordion | 折りたたみコンテンツパネル (Radix) |
| Tabs | タブ切り替えパネル (Radix) |
| AspectRatio | 固定アスペクト比コンテナ (Radix) |
| Collapsible | 単一折りたたみセクション (Radix) |
| ScrollArea | カスタムスクロールバーコンテナ (Radix) |
| Resizable | リサイズ可能な分割パネル |
| Sidebar | サイドバーナビゲーションパネル |

### 表示 (20)

| コンポーネント | 説明 |
|---|---|
| Header | ページ/セクションヘッダー (サブタイトル付き) |
| Text | リッチテキスト (heading, body, caption, price バリアント) |
| Stat | トレンドインジケーター付きメトリクスカード |
| Badge | カラーバリアント付きステータス/カテゴリラベル |
| Tag | 削除可能なラベル |
| Link | ハイパーリンク |
| Alert | 情報/成功/警告/エラーバナー |
| Avatar | ユーザーアバター (画像またはイニシャル) |
| Divider | 水平/垂直区切り線 |
| Progress | 進捗インジケーター (Radix) |
| Image | レスポンシブ画像 |
| Empty | 空状態プレースホルダー |
| Skeleton | ローディングプレースホルダー |
| Spinner | ローディングスピナー |
| Carousel | 画像/コンテンツスライドショー (embla-carousel) |
| Descriptions | キー・バリュー記述リスト |
| Calendar | イベント付き月間カレンダー |
| Label | フォームラベル |
| Kbd | キーボードショートカット表示 |
| Item | 汎用リストアイテム |

### 入力 (20)

| コンポーネント | 説明 |
|---|---|
| Button | CVA バリアント付きボタン (primary/secondary/danger/ghost/outline) |
| ButtonGroup | ボタングループ |
| Input | テキストフィールド (text, number, date, email, tel, url) |
| InputGroup | プレフィックス/サフィックスアドオン付き入力 |
| InputOTP | ワンタイムパスワード入力 |
| Select | ドロップダウン選択 (Radix) |
| NativeSelect | ネイティブ HTML セレクト |
| Textarea | 複数行テキスト入力 |
| Checkbox | チェックボックス (Radix) |
| RadioGroup | ラジオボタングループ (Radix) |
| Switch | ON/OFF トグルスイッチ (Radix) |
| Slider | レンジスライダー (Radix) |
| Toggle | トグルボタン (Radix) |
| ToggleGroup | 排他/複数選択トグルグループ (Radix) |
| Combobox | オートコンプリート入力 (cmdk) |
| CommandPalette | コマンドパレット検索ダイアログ (cmdk) |
| Rating | 星評価入力 |
| DatePicker | 日付選択入力 |
| Field | ラベル・エラー付きフォームフィールド |
| Form | バリデーション付きフォームコンテナ |

### データ (4)

| コンポーネント | 説明 |
|---|---|
| DataTable | ソート・フィルター・ページネーション付きデータテーブル |
| Table | シンプルなテーブル (ヘッダー + ボディ) |
| List | アバター・サブテキスト付きリスト |
| TreeList | 階層ツリービュー |

### チャート (5)

| コンポーネント | 説明 |
|---|---|
| BarChart | 棒グラフ (`recharts` 必要) |
| LineChart | 折れ線グラフ (`recharts` 必要) |
| AreaChart | エリアチャート (`recharts` 必要) |
| PieChart | 円/ドーナツグラフ (`recharts` 必要) |
| GanttChart | ガントチャート |

### ナビゲーション (8)

| コンポーネント | 説明 |
|---|---|
| Breadcrumbs | パンくずナビゲーション |
| Stepper | ステップ進捗表示 |
| Menu | ネストアイテム対応ナビメニュー |
| Pagination | ページネーション |
| DropdownMenu | ドロップダウンアクションメニュー (Radix) |
| ContextMenu | 右クリックコンテキストメニュー (Radix) |
| NavigationMenu | サブメニュー付きトップナビゲーション (Radix) |
| Menubar | アプリケーションメニューバー (Radix) |

### オーバーレイ (8)

| コンポーネント | 説明 |
|---|---|
| Dialog | モーダルダイアログ (Radix) |
| AlertDialog | 確認ダイアログ (Radix) |
| Drawer | スライドインサイドパネル (vaul) |
| Popover | フローティングコンテンツパネル (Radix) |
| HoverCard | ホバー起動プレビューカード (Radix) |
| Toast | 自動消去通知 (Radix) |
| ToastContainer | Toast ビューポートコンテナ |
| Tooltip | ホバーツールチップ (Radix) |

### 地図 (1)

| コンポーネント | 説明 |
|---|---|
| Map | マーカー付きインタラクティブ地図 (`leaflet` + `react-leaflet` 必要) |

### タイプハンドラー (4)

| コンポーネント | 説明 |
|---|---|
| Repeater | フックデータから要素リストをレンダリング |
| KanbanBoard | カンバンタスクボード |
| Timeline | 時系列タイムライン |
| Feed | アクティビティフィード |

## テーマ

コンポーネントは Tailwind CSS v4 の `@theme` ディレクティブで定義された CSS カスタムプロパティを使用。`prefers-color-scheme` によるダークモード完全対応。

### タイポグラフィ

- **サンセリフ:** Geist Sans, Noto Sans JP (日本語), システムフォールバック
- **モノスペース:** Geist Mono, SF Mono, Cascadia Code, Fira Code

### 同一プロジェクトでの使用 (Tailwind v4)

```css
/* your-app/globals.css */
@import "tailwindcss";
@import "@viyv/agent-ui-components/theme.css";

/* ブランドカラーを上書き */
@theme {
  --color-primary: #e11d48;
  --color-primary-hover: #be123c;
}
```

### 外部プロジェクトでの使用 (非 Tailwind / webpack)

Tailwind v4 の `@theme` ディレクティブが処理されない環境 (webpack CSS loader 等) では、全トークンを標準 `:root` CSS 変数として提供する `theme-vars.css` を使用:

```css
@import "@viyv/agent-ui-components/theme-vars.css";
```

### 利用可能なトークン

| カテゴリ | トークン |
|---|---|
| Primary | `--color-primary`, `--color-primary-hover`, `--color-primary-fg`, `--color-primary-soft`, `--color-primary-soft-fg`, `--color-primary-soft-border` |
| Danger | `--color-danger`, `--color-danger-hover`, `--color-danger-fg`, `--color-danger-soft`, `--color-danger-soft-fg`, `--color-danger-soft-border` |
| Success | `--color-success`, `--color-success-fg`, `--color-success-soft`, `--color-success-soft-fg`, `--color-success-soft-border` |
| Warning | `--color-warning`, `--color-warning-fg`, `--color-warning-accent`, `--color-warning-soft`, `--color-warning-soft-fg`, `--color-warning-soft-border` |
| サーフェス | `--color-surface`, `--color-surface-alt`, `--color-muted`, `--color-muted-strong`, `--color-accent` |
| テキスト | `--color-fg`, `--color-fg-secondary`, `--color-fg-muted`, `--color-fg-subtle`, `--color-fg-disabled` |
| ボーダー | `--color-border`, `--color-border-strong`, `--color-border-input` |
| ユーティリティ | `--color-ring`, `--color-overlay`, `--color-tooltip-bg`, `--color-tooltip-fg` |
| 角丸 | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full` |
| シャドウ | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl` |

### ランタイムテーマオーバーライド

PageSpec で `accentColor` を設定すると、ページ単位で primary カラーを上書き可能:

```json
{
  "theme": { "accentColor": "#7c3aed" }
}
```

## デモページ

デモアプリには 10 種のユースケース別ページが含まれます:

| ページ | 説明 |
|---|---|
| Dashboard | KPI カード、チャート、最近のアクティビティ |
| Data Management | フィルター、ダイアログ、Toast 付き CRUD テーブル |
| Form Builder | 各種入力タイプとバリデーション |
| E-commerce Product | 商品ギャラリー、レビュー、カート |
| Settings Panel | タブ、スイッチ、フォームグループ |
| Content Blog | 記事レイアウト、タイポグラフィショーケース |
| Navigation Showcase | メニューバー、パンくず、サイドバー、コマンドパレット |
| Overlay & Feedback | ダイアログ、ドロワー、Toast、ツールチップ、確認ダイアログ |
| Kanban Project | ドラッグ&ドロップタスクボード |
| Timeline Activity | 時系列イベントフィード |

## サーバー API

| メソッド | エンドポイント | 説明 |
|---|---|---|
| `GET` | `/pages` | ページ一覧 |
| `GET` | `/pages/:id` | ページスペック取得 |
| `POST` | `/pages` | ページ作成 |
| `PUT` | `/pages/:id` | ページ更新 |
| `DELETE` | `/pages/:id` | ページ削除 |
| `POST` | `/pages/preview` | プレビュー作成 (30分 TTL) |
| `GET` | `/pages/preview/:id` | プレビュー取得 |
| `POST` | `/hooks/:hookId/execute` | データフック実行 |

### Next.js との統合

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

## 開発

```bash
pnpm build                # 全パッケージビルド
pnpm typecheck            # TypeScript 型チェック
pnpm test                 # テスト実行 (Vitest)
pnpm lint                 # Biome による lint
pnpm lint:fix             # lint 自動修正

# パッケージ指定
pnpm --filter @viyv/agent-ui-components typecheck
pnpm --filter @viyv/agent-ui-components test
```

### 技術スタック

| カテゴリ | 技術 |
|---|---|
| 言語 | TypeScript 5.7 |
| UI | React 18/19 |
| UI プリミティブ | Radix UI (25 プリミティブ) |
| バリアント | CVA (class-variance-authority) |
| アイコン | Lucide React |
| バリデーション | Zod |
| スタイリング | Tailwind CSS v4 + tailwind-merge + clsx |
| チャート | Recharts (オプション) |
| 地図 | Leaflet + react-leaflet (オプション) |
| カルーセル | embla-carousel |
| コマンドパレット | cmdk |
| ドロワー | vaul |
| ビルド | Turbo |
| Lint | Biome |
| テスト | Vitest |
| デモ | Next.js 15 |

## ライセンス

MIT
