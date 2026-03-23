import { defineCatalog, type ComponentMeta } from '@viyv/agent-ui-schema';
import { z } from 'zod';

// Layout
import { boxMeta } from './layout/box.js';
import { containerMeta } from './layout/container.js';
import { spacerMeta } from './layout/spacer.js';
import { stackMeta } from './layout/stack.js';
import { gridMeta } from './layout/grid.js';
import { tabsMeta } from './layout/tabs.js';
import { cardMeta } from './layout/card.js';
import { accordionMeta } from './layout/accordion.js';
import { sidebarMeta } from './layout/sidebar.js';
import { aspectRatioMeta } from './layout/aspect-ratio.js';
import { collapsibleMeta } from './layout/collapsible.js';
import { scrollAreaMeta } from './layout/scroll-area.js';
import { resizableMeta } from './layout/resizable.js';

// Overlay
import { alertDialogMeta } from './overlay/alert-dialog.js';
import { dialogMeta } from './overlay/dialog.js';
import { drawerMeta } from './overlay/drawer.js';
import { popoverMeta } from './overlay/popover.js';
import { hoverCardMeta } from './overlay/hover-card.js';

// Display
import { headerMeta } from './display/header.js';
import { textMeta } from './display/text.js';
import { statMeta } from './display/stat.js';
import { badgeMeta } from './display/badge.js';
import { linkMeta } from './display/link.js';
import { imageMeta } from './display/image.js';
import { alertMeta } from './display/alert.js';
import { avatarMeta } from './display/avatar.js';
import { dividerMeta } from './display/divider.js';
import { progressMeta } from './display/progress.js';
import { tagMeta } from './display/tag.js';
import { emptyMeta } from './display/empty.js';
import { skeletonMeta } from './display/skeleton.js';
import { spinnerMeta } from './display/spinner.js';
import { carouselMeta } from './display/carousel.js';
import { descriptionsMeta } from './display/descriptions.js';
import { labelMeta } from './display/label.js';
import { kbdMeta } from './display/kbd.js';
import { itemMeta } from './display/item.js';

// Map
import { mapMeta } from './map/map.js';

// Data
import { dataTableMeta } from './data/data-table.js';
import { listMeta } from './data/list.js';
import { tableMeta } from './data/table.js';
import { treeListMeta } from './data/tree-list.js';

// Chart
import { barChartMeta } from './chart/bar-chart.js';
import { lineChartMeta } from './chart/line-chart.js';
import { areaChartMeta } from './chart/area-chart.js';
import { pieChartMeta } from './chart/pie-chart.js';
import { ganttChartMeta } from './chart/gantt-chart.js';

// Input
import { buttonMeta } from './input/button.js';
import { buttonGroupMeta } from './input/button-group.js';
import { inputMeta } from './input/input.js';
import { inputGroupMeta } from './input/input-group.js';
import { inputOTPMeta } from './input/input-otp.js';
import { selectMeta } from './input/select.js';
import { nativeSelectMeta } from './input/native-select.js';
import { textareaMeta } from './input/textarea.js';
import { checkboxMeta } from './input/checkbox.js';
import { radioGroupMeta } from './input/radio-group.js';
import { switchMeta } from './input/switch.js';
import { sliderMeta } from './input/slider.js';
import { toggleMeta } from './input/toggle.js';
import { toggleGroupMeta } from './input/toggle-group.js';
import { comboboxMeta } from './input/combobox.js';
import { commandPaletteMeta } from './input/command-palette.js';
import { ratingMeta } from './input/rating.js';
import { datePickerMeta } from './input/date-picker.js';
import { fieldMeta } from './input/field.js';
import { formMeta } from './input/form.js';

// Navigation
import { breadcrumbsMeta } from './navigation/breadcrumbs.js';
import { contextMenuMeta } from './navigation/context-menu.js';
import { dropdownMenuMeta } from './navigation/dropdown-menu.js';
import { menubarMeta } from './navigation/menubar.js';
import { navigationMenuMeta } from './navigation/navigation-menu.js';
import { paginationMeta } from './navigation/pagination.js';
import { stepperMeta } from './navigation/stepper.js';
import { menuMeta } from './navigation/menu.js';

// Feedback
import { toastMeta } from './overlay/toast.js';
import { toastContainerMeta } from './overlay/toast-container.js';
import { tooltipMeta } from './overlay/tooltip.js';
import { calendarMeta } from './display/calendar.js';

const allMeta: ComponentMeta[] = [
	// Layout
	boxMeta,
	containerMeta,
	spacerMeta,
	stackMeta,
	gridMeta,
	tabsMeta,
	cardMeta,
	accordionMeta,
	sidebarMeta,
	aspectRatioMeta,
	collapsibleMeta,
	scrollAreaMeta,
	resizableMeta,

	// Overlay
	alertDialogMeta,
	dialogMeta,
	drawerMeta,
	popoverMeta,
	hoverCardMeta,

	// Display
	headerMeta,
	textMeta,
	statMeta,
	badgeMeta,
	linkMeta,
	imageMeta,
	alertMeta,
	avatarMeta,
	dividerMeta,
	progressMeta,
	tagMeta,
	emptyMeta,
	skeletonMeta,
	spinnerMeta,
	carouselMeta,
	descriptionsMeta,
	labelMeta,
	kbdMeta,
	itemMeta,
	mapMeta,

	// Data
	dataTableMeta,
	listMeta,
	tableMeta,
	treeListMeta,

	// Chart
	barChartMeta,
	lineChartMeta,
	areaChartMeta,
	pieChartMeta,
	ganttChartMeta,

	// Input
	buttonMeta,
	buttonGroupMeta,
	inputMeta,
	inputGroupMeta,
	inputOTPMeta,
	selectMeta,
	nativeSelectMeta,
	textareaMeta,
	checkboxMeta,
	radioGroupMeta,
	switchMeta,
	sliderMeta,
	toggleMeta,
	toggleGroupMeta,
	comboboxMeta,
	commandPaletteMeta,
	ratingMeta,
	datePickerMeta,
	fieldMeta,
	formMeta,

	// Navigation
	breadcrumbsMeta,
	contextMenuMeta,
	dropdownMenuMeta,
	menubarMeta,
	navigationMenuMeta,
	paginationMeta,
	stepperMeta,
	menuMeta,

	// Feedback
	toastMeta,
	toastContainerMeta,
	tooltipMeta,

	// Display (calendar)
	calendarMeta,

	// Type-handler components (no component file — meta defined inline)
	{
		type: 'KanbanBoard',
		label: 'Kanban Board',
		description: 'Column-based board that groups data by a field. Each item rendered via child template. Use $item.xxx in children.',
		category: 'data',
		propsSchema: z.object({
			data: z.unknown(),
			groupKey: z.string(),
			columns: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
			keyField: z.string().optional(),
			emptyMessage: z.string().optional(),
		}),
		acceptsChildren: true,
	},
	{
		type: 'Timeline',
		label: 'Timeline',
		description: 'Vertical timeline with connecting line and event dots. Each event rendered via child template. Use $item.xxx in children.',
		category: 'data',
		propsSchema: z.object({
			data: z.unknown(),
			keyField: z.string().optional(),
			labelKey: z.string().optional(),
			timestampKey: z.string().optional(),
			emptyMessage: z.string().optional(),
		}),
		acceptsChildren: true,
	},
	{
		type: 'Feed',
		label: 'Feed',
		description:
			'Data-driven feed with article semantics. Like Repeater but with role="feed", article wrappers, auto dividers, and empty state. Use $item.xxx in children.',
		category: 'data',
		propsSchema: z.object({
			data: z.unknown(),
			keyField: z.string().optional(),
			labelKey: z.string().optional(),
			pageSize: z.number().int().positive().optional(),
			emptyMessage: z.string().optional(),
			divider: z.boolean().optional(),
		}),
		acceptsChildren: true,
	},
	{
		type: 'Repeater',
		label: 'Repeater',
		description: 'Iterates over data array, renders child template for each item. Use $item.xxx in children.',
		category: 'control',
		propsSchema: z.object({
			data: z.unknown(),
			keyField: z.string().optional(),
			pageSize: z.number().int().positive().optional(),
		}),
		acceptsChildren: true,
	},
];

export const defaultCatalog = defineCatalog(allMeta);

/** Set of component type names that use `open` prop for visibility (overlay components) */
export const defaultOverlayTypes = new Set(
	allMeta.filter((m) => m.overlay).map((m) => m.type),
);
