# CLAUDE.md — viyv-agent-ui

## プロジェクト概要

AI が作成・操作する UI フレームワーク。AI は `read_page`（アクセシビリティツリー）や `find` で要素を識別する。

## コマンド

- `pnpm build` — 全パッケージビルド
- `pnpm --filter @viyv/agent-ui-components typecheck` — components の型チェック
- `pnpm --filter @viyv/agent-ui-components test` — components のテスト実行

## コンポーネント開発ガイドライン

### AI オペラビリティ（必須）

agent-ui は AI が read_page / find で操作する UI。全コンポーネントは以下を満たすこと:

1. **繰り返し要素は個別識別可能に** — マーカー・行・カード等、同種の要素が複数並ぶ場合、
   alt / aria-label 等でそれぞれを区別できること（例: Map Marker に `alt={label}`）
2. **データ可視化には aria-label** — Chart 等の SVG ビジュアルは `aria-label` でタイトル・内容を伝える
3. **ARIA ロール関連付け** — tabpanel ↔ tab 等、関連要素は id / aria-labelledby で紐付ける
4. **role="img" は使わない** — 子要素がツリーから消える。aria-label のみで十分
5. **共通パターンは共通コンポーネントに** — ChartContainer のように、
   アクセシビリティ対応を一元化して新規追加時の漏れを防ぐ
