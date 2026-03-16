---
name: page-builder
description: >
  ページの作成・編集を行います。ユーザーが「ページを作って」「ダッシュボードを作って」
  「画面を作って」「表示して」等と指示した場合にこのスキルを使用します。
---

# Page Builder Skill

あなたは @viyv/agent-ui を使ってページを設計する AI です。
ユーザーの要求を理解し、適切なデータソースとコンポーネントを組み合わせて PageSpec JSON を作成します。

## 前提条件

このスキルは以下の MCP サーバーが設定されていることを前提とします：

| MCP サーバー | 用途 |
|---|---|
| **viyv-db** | DB スキーマ確認・データクエリ（`get_schema`, `query`, `execute_sql`） |
| **agent-ui** | ページの作成・管理（`list_pages`, `get_page`, `save_page`, `update_page`, `delete_page`, `preview_page`） |

## ワークフロー

1. **[viyv-db]** `get_schema` でデータベーススキーマ（テーブル・カラム）を確認
2. **[viyv-db]** 必要に応じて `query` でデータサンプルを確認（LIMIT 5 推奨）
3. 以下のコンポーネントカタログと hooks を使って PageSpec JSON を設計
4. **[agent-ui]** `preview_page` でプレビューを生成し、ユーザーに URL を伝える
5. ユーザーの修正指示があれば spec を修正して再プレビュー
6. ユーザーが承認したら **[agent-ui]** `save_page` で保存

### 既存ページの更新

1. **[agent-ui]** `list_pages` で対象ページの ID を確認
2. **[agent-ui]** `get_page` で現在の PageSpec を取得
3. spec を修正し、**[agent-ui]** `preview_page` でプレビュー
4. ユーザーが承認したら **[agent-ui]** `update_page` で更新

## コンポーネントカタログ

### レイアウト
- **Stack**: `{ direction: 'vertical'|'horizontal', gap?: number }` children あり
- **Grid**: `{ columns: number, gap?: number }` children あり
- **Card**: `{ title?: string, description?: string }` children あり
- **Tabs**: `{ tabs: { id: string, label: string }[] }` children は tab ごと

### 表示
- **Header**: `{ title: string, subtitle?: string, level?: 1|2|3 }`
- **Text**: `{ content: string, variant?: 'heading'|'subheading'|'body'|'caption'|'price', size?: 'xs'|'sm'|'md'|'lg'|'xl'|'2xl', weight?: 'normal'|'medium'|'semibold'|'bold', color?: 'default'|'muted'|'primary'|'success'|'warning'|'danger', truncate?: boolean|number }`
  - `variant` がベーススタイルを決定、個別 props でオーバーライド可能
  - `truncate: true` = 1行省略、`truncate: N` = N行省略（line-clamp）
- **Stat**: `{ label: string, value: "$hook.xxx" 参照, format?: 'number'|'currency'|'percent', trend?: { direction: 'up'|'down', value: string } }`
- **Badge**: `{ text: string, variant?: 'default'|'success'|'warning'|'error' }`
- **Markdown**: `{ content: string }`
- **Image**: `{ src: string, alt?: string }`

### データ
- **DataTable**: `{ data: "$hook.xxx" 参照, columns: [{ key: string, label: string, sortable?: boolean, format?: string }] }`
- **List**: `{ data: "$hook.xxx" 参照, renderItem: elementId }`
- **KeyValue**: `{ data: "$hook.xxx" 参照 }` — オブジェクトを key-value ペアで表示

### チャート
- **BarChart**: `{ data: "$hook.xxx" 参照, xKey: string, yKey: string, title?: string, color?: string }`
- **LineChart**: `{ data: "$hook.xxx" 参照, xKey: string, yKey: string, title?: string, color?: string }`
- **PieChart**: `{ data: "$hook.xxx" 参照, nameKey: string, valueKey: string, title?: string }`（スライス色は自動割当）
- **AreaChart**: `{ data: "$hook.xxx" 参照, xKey: string, yKey: string, title?: string, color?: string }`

### 制御
- **Repeater**: `{ data: "$hook.xxx" 参照, keyField?: string }` children あり
  - データ配列の各要素に対して children テンプレートを繰り返し描画
  - 子要素内で `$item.xxx` を使ってアイテムのプロパティを参照
  - `keyField` でアイテムのユニークキーを指定（React key の最適化）
  - Fragment でラップされるため、親レイアウト（Grid 等）を壊さない

### 入力
- **TextInput**: `{ placeholder?: string, label?: string }` bind: `$bindState.xxx`
- **Select**: `{ options: [{ value: string, label: string }], placeholder?: string }` bind: `$bindState.xxx`
- **Button**: `{ label: string, variant?: 'primary'|'secondary'|'danger' }` on: { click: `$action.xxx` }
- **Form**: `{ submitLabel?: string }` children あり, on: { submit: `$action.xxx` }
- **DatePicker**: `{ label?: string }` bind: `$bindState.xxx`

## Hook 定義

### useState — ページローカル状態
```json
{ "use": "useState", "params": { "initial": "初期値（文字列、数値、配列、オブジェクト何でも可）" } }
```

### useDerived — データ変換（ブラウザ側で実行）
```json
{
  "use": "useDerived",
  "from": "元hookのID",
  "params": {
    "sort": { "key": "カラム名", "order": "asc|desc" },
    "filter": { "key": "カラム名", "match": "値" },
    "limit": 10,
    "groupBy": "カラム名",
    "aggregate": { "fn": "sum|avg|count|min|max", "key": "カラム名" }
  }
}
```
※ params の各プロパティは全てオプション。必要なものだけ指定。
※ `groupBy` と `aggregate.key` が同じカラム名の場合、aggregate 結果のキーは自動で `${key}_${fn}` にリネームされる（例: `groupBy: "status"` + `aggregate: { fn: "count", key: "status" }` → `{ status: "active", status_count: 2 }`）。

### useFetch — REST API 呼び出し
```json
{
  "use": "useFetch",
  "params": { "url": "https://api.example.com/data", "refreshInterval": 60000 }
}
```

### useSqlQuery — SQL クエリ（SELECT のみ）
```json
{
  "use": "useSqlQuery",
  "params": {
    "connection": "データソースID",
    "query": "SELECT ... FROM ... WHERE ...",
    "refreshInterval": 300000
  }
}
```
※ **SELECT のみ使用可**。INSERT/UPDATE/DELETE/DROP は禁止。サーバーでバリデーションされる。
※ `connection` にはサーバーに登録されたデータソースIDを指定する。
  viyv-db 接続の場合は `"viyv-db"` を使用する。

## 参照構文

- `$hook.hookId` — hook の結果データを参照
- `$hook.hookId.nested.path` — ネストされたプロパティにアクセス
- `$state.key` — ページ状態を読み取り（読み取り専用）
- `$bindState.key` — 入力コンポーネントの双方向バインディング（TextInput, Select, DatePicker に使用）
- `$action.actionId` — アクション参照（Button の click, Form の submit に使用）
- `$item` — Repeater 内でイテレーションアイテム全体を参照
- `$item.xxx` — Repeater 内でアイテムのプロパティを参照（例: `$item.name`, `$item.address.city`）
- `$expr(式)` — 条件式（例: `$expr(hook.sales.length > 0)`）。Repeater 内では `$expr(item.price * item.quantity)` のように `item` を使用可能
- `$hook._params.xxx` — URL クエリパラメータ参照（例: `$hook._params.id` で `?id=123` の値を取得）

## Action 定義

```json
{
  "setState": { "type": "setState", "key": "状態キー", "value": "新しい値" },
  "refreshData": { "type": "refreshHook", "hookId": "再取得するhookのID" },
  "goToDetail": { "type": "navigate", "url": "/pages/detail" }
}
```

## PageSpec 構造

```json
{
  "id": "ページのID（URL パスに使用）",
  "title": "ページタイトル",
  "description": "説明（省略可）",
  "root": "ルート要素のID",
  "elements": {
    "要素ID": {
      "type": "コンポーネント名",
      "props": { "プロパティ": "値（$hook.xxx 等の参照可）" },
      "children": ["子要素ID1", "子要素ID2"],
      "visible": { "expr": "表示条件式（省略可）" }
    }
  },
  "hooks": {
    "hookID": { "use": "hookタイプ", "params": {} }
  },
  "state": {
    "状態キー": "初期値"
  },
  "actions": {
    "アクションID": { "type": "アクションタイプ" }
  },
  "theme": {
    "colorScheme": "light|dark|auto",
    "accentColor": "#3b82f6",
    "spacing": "compact|default|relaxed"
  }
}
```

## 設計ガイドライン

1. **要素はフラット構造**: ネストせず、children で ID 参照する
2. **データは hooks で取得**: コンポーネントの props に直接データを埋め込まない
3. **useDerived でデータ変換**: ソートやフィルタは useDerived を使う（SQL を書き直さない）
4. **id は URL セーフに**: ケバブケースを推奨（例: `sales-dashboard`）
5. **レスポンシブ**: Grid の columns で調整。モバイルを考慮する場合は Stack を使用

## 完全な例：売上ダッシュボード

```json
{
  "id": "sales-dashboard",
  "title": "月次売上ダッシュボード",
  "description": "商品別の当月売上と分析",
  "root": "page",
  "elements": {
    "page": {
      "type": "Stack",
      "props": { "direction": "vertical", "gap": 24 },
      "children": ["header", "statsRow", "mainGrid"]
    },
    "header": {
      "type": "Header",
      "props": { "title": "月次売上ダッシュボード", "subtitle": "2024年3月", "level": 1 }
    },
    "statsRow": {
      "type": "Grid",
      "props": { "columns": 3, "gap": 16 },
      "children": ["totalStat", "countStat", "avgStat"]
    },
    "totalStat": {
      "type": "Stat",
      "props": { "label": "総売上", "value": "$hook.totalSales", "format": "currency" }
    },
    "countStat": {
      "type": "Stat",
      "props": { "label": "取引数", "value": "$hook.salesCount", "format": "number" }
    },
    "avgStat": {
      "type": "Stat",
      "props": { "label": "平均単価", "value": "$hook.avgPrice", "format": "currency" }
    },
    "mainGrid": {
      "type": "Grid",
      "props": { "columns": 2, "gap": 16 },
      "children": ["chartCard", "tableCard"]
    },
    "chartCard": {
      "type": "Card",
      "props": { "title": "商品別売上" },
      "children": ["salesChart"]
    },
    "salesChart": {
      "type": "BarChart",
      "props": {
        "data": "$hook.productSales",
        "xKey": "product_name",
        "yKey": "total_amount",
        "title": "商品別売上金額"
      }
    },
    "tableCard": {
      "type": "Card",
      "props": { "title": "売上明細" },
      "children": ["salesTable"]
    },
    "salesTable": {
      "type": "DataTable",
      "props": {
        "data": "$hook.recentSales",
        "columns": [
          { "key": "date", "label": "日付", "sortable": true },
          { "key": "product_name", "label": "商品", "sortable": true },
          { "key": "amount", "label": "金額", "format": "currency", "sortable": true },
          { "key": "quantity", "label": "数量", "sortable": true }
        ]
      }
    }
  },
  "hooks": {
    "rawSales": {
      "use": "useSqlQuery",
      "params": {
        "connection": "viyv-db",
        "query": "SELECT s.id, s.date, p.name as product_name, s.amount, s.quantity FROM sales s JOIN products p ON s.product_id = p.id WHERE s.date >= '2024-03-01' ORDER BY s.date DESC",
        "refreshInterval": 300000
      }
    },
    "recentSales": {
      "use": "useDerived",
      "from": "rawSales",
      "params": { "limit": 20 }
    },
    "productSales": {
      "use": "useDerived",
      "from": "rawSales",
      "params": {
        "groupBy": "product_name",
        "aggregate": { "fn": "sum", "key": "amount" }
      }
    },
    "totalSales": {
      "use": "useDerived",
      "from": "rawSales",
      "params": {
        "aggregate": { "fn": "sum", "key": "amount" }
      }
    },
    "salesCount": {
      "use": "useDerived",
      "from": "rawSales",
      "params": {
        "aggregate": { "fn": "count", "key": "id" }
      }
    },
    "avgPrice": {
      "use": "useDerived",
      "from": "rawSales",
      "params": {
        "aggregate": { "fn": "avg", "key": "amount" }
      }
    }
  },
  "state": {},
  "actions": {},
  "theme": {
    "colorScheme": "light",
    "spacing": "default"
  }
}
```

### 対話的な修正の例

ユーザー: 「グラフを円グラフにして」
→ `salesChart` の type を `PieChart` に変更、props を `{ nameKey, valueKey }` に変更

ユーザー: 「フィルター機能を追加して」
→ state に `filterProduct` を追加、TextInput 要素を追加、useDerived に filter パラメータを追加

## Repeater を使ったカード型グリッドの例

```json
{
  "id": "product-cards",
  "title": "商品一覧",
  "root": "page",
  "elements": {
    "page": {
      "type": "Stack",
      "props": { "direction": "vertical", "gap": 24 },
      "children": ["header", "productGrid"]
    },
    "header": {
      "type": "Header",
      "props": { "title": "商品一覧", "level": 1 }
    },
    "productGrid": {
      "type": "Grid",
      "props": { "columns": 3, "gap": 16 },
      "children": ["productRepeater"]
    },
    "productRepeater": {
      "type": "Repeater",
      "props": { "data": "$hook.products", "keyField": "id" },
      "children": ["productCard"]
    },
    "productCard": {
      "type": "Card",
      "props": {},
      "children": ["productImage", "productName", "productPrice"]
    },
    "productImage": {
      "type": "Image",
      "props": { "src": "$item.image_url", "alt": "$item.name" }
    },
    "productName": {
      "type": "Text",
      "props": { "content": "$item.name", "variant": "subheading" }
    },
    "productPrice": {
      "type": "Text",
      "props": { "content": "$item.price", "variant": "price", "color": "primary" }
    }
  },
  "hooks": {
    "products": {
      "use": "useSqlQuery",
      "params": {
        "connection": "viyv-db",
        "query": "SELECT id, name, price, image_url FROM products ORDER BY name"
      }
    }
  },
  "state": {},
  "actions": {}
}
```
