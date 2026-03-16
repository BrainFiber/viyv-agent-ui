import { defineRegistry } from '@viyv/agent-ui-react';
import { DataTable } from './data/data-table.js';
import { Alert } from './display/alert.js';
import { Badge } from './display/badge.js';
import { Divider } from './display/divider.js';
import { Header } from './display/header.js';
import { Link } from './display/link.js';
import { Stat } from './display/stat.js';
import { Text } from './display/text.js';
import { Button } from './input/button.js';
import { Select } from './input/select.js';
import { TextInput } from './input/text-input.js';
import { Card } from './layout/card.js';
import { Grid } from './layout/grid.js';
import { Stack } from './layout/stack.js';

export const defaultRegistry = defineRegistry({
	Stack: Stack as any,
	Grid: Grid as any,
	Card: Card as any,
	Header: Header as any,
	Text: Text as any,
	Stat: Stat as any,
	Badge: Badge as any,
	Link: Link as any,
	Alert: Alert as any,
	Divider: Divider as any,
	DataTable: DataTable as any,
	Button: Button as any,
	TextInput: TextInput as any,
	Select: Select as any,
});
