import { defineRegistry } from '@viyv/agent-ui-react';
import { AreaChart } from './chart/area-chart.js';
import { BarChart } from './chart/bar-chart.js';
import { GanttChart } from './chart/gantt-chart.js';
import { LineChart } from './chart/line-chart.js';
import { PieChart } from './chart/pie-chart.js';
import { DataTable } from './data/data-table.js';
import { List } from './data/list.js';
import { TreeList } from './data/tree-list.js';
import { Alert } from './display/alert.js';
import { Avatar } from './display/avatar.js';
import { Badge } from './display/badge.js';
import { Divider } from './display/divider.js';
import { Header } from './display/header.js';
import { Image } from './display/image.js';
import { Link } from './display/link.js';
import { ProgressBar } from './display/progress-bar.js';
import { Stat } from './display/stat.js';
import { Empty } from './display/empty.js';
import { Skeleton } from './display/skeleton.js';
import { Spinner } from './display/spinner.js';
import { Carousel } from './display/carousel.js';
import { Descriptions } from './display/descriptions.js';
import { Tag } from './display/tag.js';
import { Text } from './display/text.js';
import { Map } from './map/map.js';
import { Button } from './input/button.js';
import { Checkbox } from './input/checkbox.js';
import { RadioGroup } from './input/radio-group.js';
import { Switch } from './input/switch.js';
import { Slider } from './input/slider.js';
import { Autocomplete } from './input/autocomplete.js';
import { Rating } from './input/rating.js';
import { DatePicker } from './input/date-picker.js';
import { Select } from './input/select.js';
import { Textarea } from './input/textarea.js';
import { TextInput } from './input/text-input.js';
import { Box } from './layout/box.js';
import { Card } from './layout/card.js';
import { Container } from './layout/container.js';
import { Collapse } from './layout/collapse.js';
import { Grid } from './layout/grid.js';
import { Spacer } from './layout/spacer.js';
import { Stack } from './layout/stack.js';
import { Tabs } from './layout/tabs.js';
import { Dialog } from './overlay/dialog.js';
import { Drawer } from './overlay/drawer.js';
import { Breadcrumbs } from './navigation/breadcrumbs.js';
import { Stepper } from './navigation/stepper.js';
import { Menu } from './navigation/menu.js';
import { Toast } from './overlay/toast.js';
import { ToastContainer } from './overlay/toast-container.js';
import { Tooltip } from './overlay/tooltip.js';
import { Calendar } from './display/calendar.js';

export const defaultRegistry = defineRegistry({
	Box: Box as any,
	Container: Container as any,
	Spacer: Spacer as any,
	Stack: Stack as any,
	Grid: Grid as any,
	Card: Card as any,
	Collapse: Collapse as any,
	Tabs: Tabs as any,
	Header: Header as any,
	Text: Text as any,
	Stat: Stat as any,
	Badge: Badge as any,
	Link: Link as any,
	Alert: Alert as any,
	Avatar: Avatar as any,
	Divider: Divider as any,
	Image: Image as any,
	Map: Map as any,
	DataTable: DataTable as any,
	List: List as any,
	TreeList: TreeList as any,
	BarChart: BarChart as any,
	LineChart: LineChart as any,
	AreaChart: AreaChart as any,
	PieChart: PieChart as any,
	GanttChart: GanttChart as any,
	ProgressBar: ProgressBar as any,
	Empty: Empty as any,
	Skeleton: Skeleton as any,
	Spinner: Spinner as any,
	Descriptions: Descriptions as any,
	Button: Button as any,
	TextInput: TextInput as any,
	Select: Select as any,
	Textarea: Textarea as any,
	Checkbox: Checkbox as any,
	RadioGroup: RadioGroup as any,
	Switch: Switch as any,
	Slider: Slider as any,
	Autocomplete: Autocomplete as any,
	Rating: Rating as any,
	DatePicker: DatePicker as any,
	Tag: Tag as any,
	Dialog: Dialog as any,
	Drawer: Drawer as any,
	Breadcrumbs: Breadcrumbs as any,
	Stepper: Stepper as any,
	Menu: Menu as any,
	Carousel: Carousel as any,
	Toast: Toast as any,
	ToastContainer: ToastContainer as any,
	Tooltip: Tooltip as any,
	Calendar: Calendar as any,
});
