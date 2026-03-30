/**
 * Lazy-loads `marked` and provides a sanitized Markdown → HTML renderer.
 * Follows the same module-level caching pattern as `use-leaflet.ts`.
 */

import { useEffect, useState } from 'react';

interface MarkdownRenderer {
	render: (md: string) => string;
}

let cached: MarkdownRenderer | null = null;
let loadFailed = false;
let loading: Promise<MarkdownRenderer | null> | null = null;

// ── HTML sanitizer (DOMParser-based, no extra dependency) ──

const ALLOWED_TAGS = new Set([
	'p', 'br', 'strong', 'em', 'code', 'pre', 'ul', 'ol', 'li',
	'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote',
	'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'del', 'span',
]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
	a: new Set(['href', 'target', 'rel']),
	code: new Set(['class']),
	span: new Set(['class']),
	pre: new Set(['class']),
};

function sanitizeNode(node: Node): void {
	const children = Array.from(node.childNodes);
	for (const child of children) {
		if (child.nodeType === 1) {
			const el = child as Element;
			const tag = el.tagName.toLowerCase();

			if (!ALLOWED_TAGS.has(tag)) {
				// Replace disallowed tag with its text content
				const text = document.createTextNode(el.textContent ?? '');
				node.replaceChild(text, el);
				continue;
			}

			// Remove disallowed attributes
			const allowed = ALLOWED_ATTRS[tag];
			for (const attr of Array.from(el.attributes)) {
				if (!allowed?.has(attr.name)) {
					el.removeAttribute(attr.name);
				}
			}

			// Force links to open in new tab safely
			if (tag === 'a') {
				el.setAttribute('target', '_blank');
				el.setAttribute('rel', 'noopener noreferrer');
			}

			sanitizeNode(el);
		}
	}
}

function sanitizeHtml(html: string): string {
	if (typeof DOMParser === 'undefined') return fallbackRender(html);
	const doc = new DOMParser().parseFromString(html, 'text/html');
	sanitizeNode(doc.body);
	return doc.body.innerHTML;
}

async function load(): Promise<MarkdownRenderer | null> {
	try {
		const { marked } = await import('marked');
		marked.setOptions({ breaks: true, gfm: true });
		return {
			render: (md: string) => {
				const raw = marked.parse(md, { async: false }) as string;
				return sanitizeHtml(raw);
			},
		};
	} catch {
		loadFailed = true;
		return null;
	}
}

export interface UseMarkdownResult {
	render: (md: string) => string;
	ready: boolean;
}

/**
 * Dynamically loads `marked` and returns a sanitized Markdown renderer.
 * Returns `{ ready: false }` while loading — `render()` returns escaped text as fallback.
 */
export function useMarkdown(): UseMarkdownResult {
	const [renderer, setRenderer] = useState<MarkdownRenderer | null>(cached);

	useEffect(() => {
		if (cached) {
			setRenderer(cached);
			return;
		}
		if (loadFailed) return;
		if (!loading) {
			loading = load();
		}
		let cancelled = false;
		loading.then((m) => {
			if (m) cached = m;
			if (!cancelled) setRenderer(m);
		});
		return () => {
			cancelled = true;
		};
	}, []);

	return {
		render: renderer?.render ?? fallbackRender,
		ready: renderer != null,
	};
}

function fallbackRender(md: string): string {
	// Escape HTML for safety when marked is not yet loaded
	return md
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\n/g, '<br>');
}
