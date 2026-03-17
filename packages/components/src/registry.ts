import { defineRegistry } from '@viyv/agent-ui-react';
import { AreaChart } from './chart/area-chart.js';
import { BarChart } from './chart/bar-chart.js';
import { LineChart } from './chart/line-chart.js';
import { PieChart } from './chart/pie-chart.js';
import { DataTable } from './data/data-table.js';
import { Alert } from './display/alert.js';
import { Badge } from './display/badge.js';
import { Divider } from './display/divider.js';
import { Header } from './display/header.js';
import { Image } from './display/image.js';
import { Link } from './display/link.js';
import { Stat } from './display/stat.js';
import { Text } from './display/text.js';
import { Map } from './map/map.js';
import { Button } from './input/button.js';
import { Checkbox } from './input/checkbox.js';
import { RadioGroup } from './input/radio-group.js';
import { Select } from './input/select.js';
import { Textarea } from './input/textarea.js';
import { TextInput } from './input/text-input.js';
import { Card } from './layout/card.js';
import { Grid } from './layout/grid.js';
import { Stack } from './layout/stack.js';
import { Tabs } from './layout/tabs.js';
import { Dialog } from './overlay/dialog.js';

export const defaultRegistry = defineRegistry({
	Stack: Stack as any,
	Grid: Grid as any,
	Card: Card as any,
	Tabs: Tabs as any,
	Header: Header as any,
	Text: Text as any,
	Stat: Stat as any,
	Badge: Badge as any,
	Link: Link as any,
	Alert: Alert as any,
	Divider: Divider as any,
	Image: Image as any,
	Map: Map as any,
	DataTable: DataTable as any,
	BarChart: BarChart as any,
	LineChart: LineChart as any,
	AreaChart: AreaChart as any,
	PieChart: PieChart as any,
	Button: Button as any,
	TextInput: TextInput as any,
	Select: Select as any,
	Textarea: Textarea as any,
	Checkbox: Checkbox as any,
	RadioGroup: RadioGroup as any,
	Dialog: Dialog as any,
});
