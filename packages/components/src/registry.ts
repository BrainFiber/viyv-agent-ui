import { defineRegistry } from '@viyv/agent-ui-react';
import { AreaChart } from './chart/area-chart.js';
import { BarChart } from './chart/bar-chart.js';
import { GanttChart } from './chart/gantt-chart.js';
import { LineChart } from './chart/line-chart.js';
import { PieChart } from './chart/pie-chart.js';
import { DataTable } from './data/data-table.js';
import { List } from './data/list.js';
import { Table } from './data/table.js';
import { TreeList } from './data/tree-list.js';
import { Alert } from './display/alert.js';
import { Avatar } from './display/avatar.js';
import { Badge } from './display/badge.js';
import { Divider } from './display/divider.js';
import { Header } from './display/header.js';
import { Image } from './display/image.js';
import { Item } from './display/item.js';
import { Kbd } from './display/kbd.js';
import { Label } from './display/label.js';
import { Link } from './display/link.js';
import { Progress } from './display/progress.js';
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
import { ButtonGroup } from './input/button-group.js';
import { Checkbox } from './input/checkbox.js';
import { CommandPalette } from './input/command-palette.js';
import { Field } from './input/field.js';
import { Form } from './input/form.js';
import { InputGroup } from './input/input-group.js';
import { InputOTP } from './input/input-otp.js';
import { NativeSelect } from './input/native-select.js';
import { RadioGroup } from './input/radio-group.js';
import { Switch } from './input/switch.js';
import { Slider } from './input/slider.js';
import { Toggle } from './input/toggle.js';
import { ToggleGroup } from './input/toggle-group.js';
import { Combobox } from './input/combobox.js';
import { Rating } from './input/rating.js';
import { DatePicker } from './input/date-picker.js';
import { Select } from './input/select.js';
import { Textarea } from './input/textarea.js';
import { Input } from './input/input.js';
import { AspectRatio } from './layout/aspect-ratio.js';
import { Box } from './layout/box.js';
import { Card } from './layout/card.js';
import { Collapsible } from './layout/collapsible.js';
import { Container } from './layout/container.js';
import { Accordion } from './layout/accordion.js';
import { Grid } from './layout/grid.js';
import { Resizable } from './layout/resizable.js';
import { ScrollArea } from './layout/scroll-area.js';
import { Sidebar } from './layout/sidebar.js';
import { Spacer } from './layout/spacer.js';
import { Stack } from './layout/stack.js';
import { Section } from './layout/section.js';
import { Tabs } from './layout/tabs.js';
import { AlertDialog } from './overlay/alert-dialog.js';
import { Dialog } from './overlay/dialog.js';
import { Drawer } from './overlay/drawer.js';
import { HoverCard } from './overlay/hover-card.js';
import { Popover } from './overlay/popover.js';
import { Breadcrumbs } from './navigation/breadcrumbs.js';
import { ContextMenu } from './navigation/context-menu.js';
import { DropdownMenu } from './navigation/dropdown-menu.js';
import { Menubar } from './navigation/menubar.js';
import { NavigationMenu } from './navigation/navigation-menu.js';
import { Pagination } from './navigation/pagination.js';
import { Stepper } from './navigation/stepper.js';
import { Menu } from './navigation/menu.js';
import { Toast } from './overlay/toast.js';
import { ToastContainer } from './overlay/toast-container.js';
import { Tooltip } from './overlay/tooltip.js';
import { Calendar } from './display/calendar.js';

export const defaultRegistry = defineRegistry({
	Box,
	Container,
	Spacer,
	Stack,
	Grid,
	Card,
	Accordion,
	Tabs,
	AspectRatio,
	Collapsible,
	Resizable,
	ScrollArea,
	Section,
	Sidebar,
	Header,
	Text,
	Stat,
	Badge,
	Link,
	Alert,
	Avatar,
	Divider,
	Image,
	Item,
	Kbd,
	Label,
	Map,
	DataTable,
	List,
	Table,
	TreeList,
	BarChart,
	LineChart,
	AreaChart,
	PieChart,
	GanttChart,
	Progress,
	Empty,
	Skeleton,
	Spinner,
	Descriptions,
	Button,
	ButtonGroup,
	Input,
	InputGroup,
	InputOTP,
	Select,
	NativeSelect,
	Textarea,
	Checkbox,
	RadioGroup,
	Switch,
	Slider,
	Toggle,
	ToggleGroup,
	Combobox,
	CommandPalette,
	Rating,
	DatePicker,
	Field,
	Form,
	Tag,
	AlertDialog,
	Dialog,
	Drawer,
	HoverCard,
	Popover,
	Breadcrumbs,
	ContextMenu,
	DropdownMenu,
	Menubar,
	NavigationMenu,
	Stepper,
	Menu,
	Carousel,
	Toast,
	ToastContainer,
	Tooltip,
	Calendar,
	Pagination,
});
