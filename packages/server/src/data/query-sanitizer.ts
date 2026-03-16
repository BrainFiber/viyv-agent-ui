export interface SanitizeResult {
	safe: boolean;
	errors: string[];
}

const DANGEROUS_KEYWORDS = [
	'INSERT',
	'UPDATE',
	'DELETE',
	'DROP',
	'ALTER',
	'CREATE',
	'TRUNCATE',
	'EXEC',
	'EXECUTE',
	'GRANT',
	'REVOKE',
	'UNION',
	'INTO',
];

const DANGEROUS_PATTERNS = [
	/;\s*\S/, // Multiple statements
	/--/, // Line comments
	/\/\*/, // Block comments
	/\bxp_\w+/i, // SQL Server extended procedures
	/\bsp_\w+/i, // SQL Server stored procedures
];

export function sanitizeQuery(query: string): SanitizeResult {
	const errors: string[] = [];
	const trimmed = query.trim();

	// Must start with SELECT
	if (!trimmed.toUpperCase().startsWith('SELECT')) {
		errors.push('Query must start with SELECT');
	}

	// Check for dangerous keywords
	const upper = trimmed.toUpperCase();
	for (const keyword of DANGEROUS_KEYWORDS) {
		// Match keyword as a word boundary
		const regex = new RegExp(`\\b${keyword}\\b`, 'i');
		if (regex.test(upper)) {
			errors.push(`Forbidden keyword: ${keyword}`);
		}
	}

	// Check for dangerous patterns
	for (const pattern of DANGEROUS_PATTERNS) {
		if (pattern.test(trimmed)) {
			errors.push(`Dangerous pattern detected: ${pattern.source}`);
		}
	}

	return { safe: errors.length === 0, errors };
}
