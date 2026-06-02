// Output shaping for the Apple App Store node.
// Field keys come straight from each Actor's .actor/dataset_schema.json (do not guess).

export type OpKey = 'reviews' | 'search' | 'product';

/** Every dataset field per operation, with its human label (drives the Selected Fields picker). */
export const FIELD_DEFS: Record<OpKey, Array<{ key: string; label: string }>> = {
	reviews: [
		{ key: 'position_global', label: 'Global Position' },
		{ key: 'position_on_page', label: 'Position on Page' },
		{ key: 'review_id', label: 'Review ID' },
		{ key: 'review_title', label: 'Review Title' },
		{ key: 'review_text', label: 'Review Text' },
		{ key: 'rating', label: 'Star Rating (1 to 5)' },
		{ key: 'review_date', label: 'Review Date (as returned)' },
		{ key: 'review_date_iso', label: 'Review Date (ISO 8601)' },
		{ key: 'reviewed_version', label: 'App Version Reviewed' },
		{ key: 'helpfulness_text', label: 'Helpfulness (Prose)' },
		{ key: 'helpful_count', label: 'Helpful Votes' },
		{ key: 'total_helpful_count', label: 'Total Helpfulness Votes' },
		{ key: 'author_name', label: 'Author Name' },
		{ key: 'author_id', label: 'Author ID' },
		{ key: 'product_id', label: 'Apple Product ID' },
		{ key: 'app_platform', label: 'App Platform (iOS / macOS)' },
		{ key: 'app_country', label: 'Country Store' },
		{ key: 'sort_order', label: 'Sort Order Applied' },
		{ key: 'page_number', label: 'Source Page Number' },
		{ key: 'total_page_count', label: 'Total Pages Available' },
		{ key: 'reviews_for_current_version', label: 'Reviews for Current Version (macOS)' },
		{ key: 'fetch_timestamp', label: 'Fetch Timestamp' },
	],
	search: [
		{ key: 'position', label: 'Position on Page' },
		{ key: 'app_id', label: 'App Store ID' },
		{ key: 'title', label: 'App Title' },
		{ key: 'bundle_id', label: 'Bundle ID' },
		{ key: 'developer_name', label: 'Developer Name' },
		{ key: 'developer_id', label: 'Developer ID' },
		{ key: 'developer_link', label: 'Developer Page URL' },
		{ key: 'version', label: 'Version' },
		{ key: 'age_rating', label: 'Age Rating' },
		{ key: 'release_date', label: 'Release Date' },
		{ key: 'latest_version_release_date', label: 'Latest Version Release Date' },
		{ key: 'price_type', label: 'Price Type' },
		{ key: 'price_amount', label: 'Price Amount' },
		{ key: 'price_currency', label: 'Price Currency' },
		{ key: 'price_symbol', label: 'Price Symbol' },
		{ key: 'rating_average', label: 'Rating (Average)' },
		{ key: 'rating_count', label: 'Rating Count' },
		{ key: 'genres', label: 'Genres' },
		{ key: 'size_in_bytes', label: 'Size in Bytes' },
		{ key: 'minimum_os_version', label: 'Minimum OS Version' },
		{ key: 'description_text', label: 'Description' },
		{ key: 'release_notes', label: 'Release Notes' },
		{ key: 'screenshots', label: 'Screenshots' },
		{ key: 'logos', label: 'Logos' },
		{ key: 'supported_languages', label: 'Supported Languages' },
		{ key: 'supported_devices', label: 'Supported Devices' },
		{ key: 'features', label: 'Features' },
		{ key: 'advisories', label: 'Advisories' },
		{ key: 'link', label: 'App Store Link' },
		{ key: 'game_center_enabled', label: 'Game Center Enabled' },
		{ key: 'vpp_license', label: 'VPP License' },
		{ key: 'search_term', label: 'Search Term' },
		{ key: 'search_country', label: 'Search Country' },
		{ key: 'search_lang', label: 'Search Language' },
		{ key: 'search_page', label: 'Search Page Number' },
		{ key: 'search_position_global', label: 'Global Position Across Pages' },
		{ key: 'search_timestamp', label: 'Search Timestamp' },
	],
	product: [
		{ key: 'app_id', label: 'App Store ID' },
		{ key: 'title', label: 'App Title' },
		{ key: 'snippet', label: 'Tagline' },
		{ key: 'developer_name', label: 'Developer Name' },
		{ key: 'developer_link', label: 'Developer Page URL' },
		{ key: 'age_rating', label: 'Age Rating' },
		{ key: 'rating_average', label: 'Rating Average' },
		{ key: 'rating_count', label: 'Rating Count' },
		{ key: 'price_text', label: 'Price' },
		{ key: 'in_app_purchases_available', label: 'In-App Purchases Available' },
		{ key: 'logo', label: 'Logo URL' },
		{ key: 'description_text', label: 'Description' },
		{ key: 'iphone_screenshots', label: 'iPhone Screenshots' },
		{ key: 'ipad_screenshots', label: 'iPad Screenshots' },
		{ key: 'version_history', label: 'Version History' },
		{ key: 'rating_distribution', label: 'Rating Distribution' },
		{ key: 'review_examples', label: 'Sample Reviews' },
		{ key: 'privacy_description', label: 'Privacy Description' },
		{ key: 'privacy_policy_link', label: 'Privacy Policy URL' },
		{ key: 'privacy_cards', label: 'Privacy Cards' },
		{ key: 'seller', label: 'Seller' },
		{ key: 'size_text', label: 'Size' },
		{ key: 'category', label: 'Category' },
		{ key: 'compatibility', label: 'Device Compatibility' },
		{ key: 'supported_languages_text', label: 'Supported Languages' },
		{ key: 'in_app_purchases', label: 'In-App Purchases' },
		{ key: 'copyright', label: 'Copyright' },
		{ key: 'supports', label: 'Supported Features' },
		{ key: 'featured_in', label: 'Featured In' },
		{ key: 'you_may_also_like', label: 'You May Also Like' },
		{ key: 'more_by_this_developer', label: 'More By This Developer' },
		{ key: 'link', label: 'App Store URL' },
		{ key: 'lookup_country', label: 'Lookup Country' },
		{ key: 'lookup_timestamp', label: 'Lookup Timestamp' },
	],
};

// Simplified view for Reviews is locked by the positioning brief: 8 clean fields,
// aliased from the raw dataset keys ([outputKey, sourceKey]).
const REVIEWS_SIMPLIFIED: Array<[string, string]> = [
	['rating', 'rating'],
	['title', 'review_title'],
	['text', 'review_text'],
	['author', 'author_name'],
	['version', 'reviewed_version'],
	['review_date_iso', 'review_date_iso'],
	['country', 'app_country'],
	['product_id', 'product_id'],
];

const SEARCH_SIMPLIFIED = [
	'app_id',
	'title',
	'developer_name',
	'rating_average',
	'rating_count',
	'price_amount',
	'price_currency',
	'link',
];

const PRODUCT_SIMPLIFIED = [
	'app_id',
	'title',
	'developer_name',
	'category',
	'price_text',
	'rating_average',
	'rating_count',
	'link',
];

/** Dedupe keys always returned in Selected Fields mode, even if the user clears them. */
export const ALWAYS_INCLUDE: Record<OpKey, string[]> = {
	reviews: ['product_id', 'review_date_iso'],
	search: ['app_id'],
	product: ['app_id'],
};

function pick(source: Record<string, any>, keys: string[]): Record<string, any> {
	const out: Record<string, any> = {};
	for (const key of keys) {
		out[key] = key in source ? source[key] : null;
	}
	return out;
}

/**
 * Shape each dataset row according to the chosen output mode.
 * - raw: every field untouched
 * - simplified: a compact, AI-friendly subset (Reviews keys are aliased)
 * - selected: the user's chosen fields, plus the dedupe keys
 */
export function applyOutput(
	opKey: OpKey,
	mode: string,
	selected: string[],
	items: any[],
): any[] {
	const rows = Array.isArray(items) ? items : [];

	if (mode === 'raw') {
		return rows;
	}

	if (mode === 'selected') {
		const keys = Array.from(new Set([...(selected ?? []), ...ALWAYS_INCLUDE[opKey]]));
		return rows.map((row) => pick(row ?? {}, keys));
	}

	// simplified (default)
	if (opKey === 'reviews') {
		return rows.map((row) => {
			const source = row ?? {};
			const out: Record<string, any> = {};
			for (const [outKey, srcKey] of REVIEWS_SIMPLIFIED) {
				out[outKey] = srcKey in source ? source[srcKey] : null;
			}
			return out;
		});
	}

	const keys = opKey === 'search' ? SEARCH_SIMPLIFIED : PRODUCT_SIMPLIFIED;
	return rows.map((row) => pick(row ?? {}, keys));
}
