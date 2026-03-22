import type { Variants } from 'motion/react';

export const backdropVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.15 } },
	exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const dialogVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95, y: 8 },
	visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
	exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15, ease: 'easeIn' } },
};

export const drawerVariants = {
	right: {
		hidden: { x: '100%' },
		visible: { x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
		exit: { x: '100%', transition: { duration: 0.2, ease: 'easeIn' } },
	},
	left: {
		hidden: { x: '-100%' },
		visible: { x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
		exit: { x: '-100%', transition: { duration: 0.2, ease: 'easeIn' } },
	},
} as const;

export const toastVariants: Variants = {
	hidden: { opacity: 0, y: -8, scale: 0.95 },
	visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
	exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } },
};

export const tooltipVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.1 } },
	exit: { opacity: 0, transition: { duration: 0.075 } },
};

export const collapseVariants: Variants = {
	hidden: { height: 0, opacity: 0 },
	visible: { height: 'auto', opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
	exit: { height: 0, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

export const dropdownVariants: Variants = {
	hidden: { opacity: 0, y: -4 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.15, ease: 'easeOut' } },
	exit: { opacity: 0, y: -4, transition: { duration: 0.1, ease: 'easeIn' } },
};

export const fadeVariants: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.15 } },
	exit: { opacity: 0, transition: { duration: 0.1 } },
};
