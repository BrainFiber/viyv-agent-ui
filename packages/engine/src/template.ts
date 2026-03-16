/**
 * Interpolate `{{key}}` placeholders in a URL template with values from data.
 * Values are URI-encoded. Missing keys produce empty strings.
 */
export function interpolateUrl(template: string, data: Record<string, unknown>): string {
	return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
		const val = data[key];
		return val != null ? encodeURIComponent(String(val)) : '';
	});
}
