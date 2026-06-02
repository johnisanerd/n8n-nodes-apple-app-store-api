import type { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { FIELD_DEFS, type OpKey } from './helpers/output';

// Country stores supported by all three Actors (ISO 3166-1 alpha-2, lowercase).
const COUNTRIES: Array<{ name: string; value: string }> = [
	{ name: 'Argentina', value: 'ar' },
	{ name: 'Australia', value: 'au' },
	{ name: 'Austria', value: 'at' },
	{ name: 'Belgium', value: 'be' },
	{ name: 'Brazil', value: 'br' },
	{ name: 'Canada', value: 'ca' },
	{ name: 'Chile', value: 'cl' },
	{ name: 'China', value: 'cn' },
	{ name: 'Colombia', value: 'co' },
	{ name: 'Czech Republic', value: 'cz' },
	{ name: 'Denmark', value: 'dk' },
	{ name: 'Egypt', value: 'eg' },
	{ name: 'Finland', value: 'fi' },
	{ name: 'France', value: 'fr' },
	{ name: 'Germany', value: 'de' },
	{ name: 'Greece', value: 'gr' },
	{ name: 'Hong Kong', value: 'hk' },
	{ name: 'Hungary', value: 'hu' },
	{ name: 'India', value: 'in' },
	{ name: 'Indonesia', value: 'id' },
	{ name: 'Ireland', value: 'ie' },
	{ name: 'Israel', value: 'il' },
	{ name: 'Italy', value: 'it' },
	{ name: 'Japan', value: 'jp' },
	{ name: 'Kenya', value: 'ke' },
	{ name: 'Malaysia', value: 'my' },
	{ name: 'Mexico', value: 'mx' },
	{ name: 'Netherlands', value: 'nl' },
	{ name: 'New Zealand', value: 'nz' },
	{ name: 'Nigeria', value: 'ng' },
	{ name: 'Norway', value: 'no' },
	{ name: 'Peru', value: 'pe' },
	{ name: 'Philippines', value: 'ph' },
	{ name: 'Poland', value: 'pl' },
	{ name: 'Portugal', value: 'pt' },
	{ name: 'Romania', value: 'ro' },
	{ name: 'Russia', value: 'ru' },
	{ name: 'Saudi Arabia', value: 'sa' },
	{ name: 'Singapore', value: 'sg' },
	{ name: 'South Africa', value: 'za' },
	{ name: 'South Korea', value: 'kr' },
	{ name: 'Spain', value: 'es' },
	{ name: 'Sweden', value: 'se' },
	{ name: 'Switzerland', value: 'ch' },
	{ name: 'Taiwan', value: 'tw' },
	{ name: 'Thailand', value: 'th' },
	{ name: 'Turkey', value: 'tr' },
	{ name: 'Ukraine', value: 'ua' },
	{ name: 'United Arab Emirates', value: 'ae' },
	{ name: 'United Kingdom', value: 'gb' },
	{ name: 'United States', value: 'us' },
	{ name: 'Vietnam', value: 'vn' },
];

// Languages supported by the Search Actor (xx-yy form).
const LANGUAGES: Array<{ name: string; value: string }> = [
	{ name: 'Arabic (Saudi Arabia)', value: 'ar-sa' },
	{ name: 'Chinese (Hong Kong)', value: 'zh-hk' },
	{ name: 'Chinese (Simplified)', value: 'zh-cn' },
	{ name: 'Chinese (Traditional)', value: 'zh-tw' },
	{ name: 'Danish', value: 'da-dk' },
	{ name: 'Dutch (Belgium)', value: 'nl-be' },
	{ name: 'Dutch (Netherlands)', value: 'nl-nl' },
	{ name: 'English (Australia)', value: 'en-au' },
	{ name: 'English (Canada)', value: 'en-ca' },
	{ name: 'English (India)', value: 'en-in' },
	{ name: 'English (Ireland)', value: 'en-ie' },
	{ name: 'English (New Zealand)', value: 'en-nz' },
	{ name: 'English (Singapore)', value: 'en-sg' },
	{ name: 'English (UK)', value: 'en-gb' },
	{ name: 'English (US)', value: 'en-us' },
	{ name: 'Finnish', value: 'fi-fi' },
	{ name: 'French (Belgium)', value: 'fr-be' },
	{ name: 'French (Canada)', value: 'fr-ca' },
	{ name: 'French (France)', value: 'fr-fr' },
	{ name: 'French (Switzerland)', value: 'fr-ch' },
	{ name: 'German (Austria)', value: 'de-at' },
	{ name: 'German (Germany)', value: 'de-de' },
	{ name: 'German (Switzerland)', value: 'de-ch' },
	{ name: 'Greek', value: 'el-gr' },
	{ name: 'Hebrew', value: 'he-il' },
	{ name: 'Indonesian', value: 'id-id' },
	{ name: 'Italian', value: 'it-it' },
	{ name: 'Japanese', value: 'ja-jp' },
	{ name: 'Korean', value: 'ko-kr' },
	{ name: 'Malay', value: 'ms-my' },
	{ name: 'Norwegian', value: 'no-no' },
	{ name: 'Polish', value: 'pl-pl' },
	{ name: 'Portuguese (Brazil)', value: 'pt-br' },
	{ name: 'Portuguese (Portugal)', value: 'pt-pt' },
	{ name: 'Russian', value: 'ru-ru' },
	{ name: 'Spanish (Argentina)', value: 'es-ar' },
	{ name: 'Spanish (Chile)', value: 'es-cl' },
	{ name: 'Spanish (Colombia)', value: 'es-co' },
	{ name: 'Spanish (Mexico)', value: 'es-mx' },
	{ name: 'Spanish (Spain)', value: 'es-es' },
	{ name: 'Swedish', value: 'sv-se' },
	{ name: 'Thai', value: 'th-th' },
	{ name: 'Turkish', value: 'tr-tr' },
	{ name: 'Ukrainian', value: 'uk-ua' },
	{ name: 'Vietnamese', value: 'vi-vn' },
];

function toArray(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.map((v) => String(v).trim()).filter(Boolean);
	}
	if (typeof value === 'string' && value.trim() !== '') {
		return value
			.split(/[\n,]/)
			.map((v) => v.trim())
			.filter(Boolean);
	}
	return [];
}

/**
 * Translate the visible n8n parameters into the snake_case input each Actor expects.
 * Empty optional values are omitted so the Actor's own defaults apply.
 */
export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	opKey: OpKey,
): Record<string, any> {
	if (opKey === 'reviews') {
		const appName = (context.getNodeParameter('appName', itemIndex, '') as string).trim();
		const productIds = toArray(context.getNodeParameter('productIds', itemIndex, []));
		if (!appName && productIds.length === 0) {
			throw new NodeOperationError(
				context.getNode(),
				'Provide an App Name or at least one Apple Product ID',
				{ itemIndex },
			);
		}
		const input: Record<string, any> = {
			country: context.getNodeParameter('country', itemIndex),
			sort: context.getNodeParameter('sort', itemIndex),
			max_reviews: context.getNodeParameter('maxReviews', itemIndex),
			start_page: context.getNodeParameter('startPage', itemIndex),
			include_macos: context.getNodeParameter('includeMacos', itemIndex),
			normalize_dates: context.getNodeParameter('normalizeDates', itemIndex),
			parse_helpfulness: context.getNodeParameter('parseHelpfulness', itemIndex),
		};
		if (appName) input.app_name = appName;
		if (productIds.length) input.product_ids = productIds;
		return input;
	}

	if (opKey === 'search') {
		const term = (context.getNodeParameter('term', itemIndex, '') as string).trim();
		const input: Record<string, any> = {
			term,
			country: context.getNodeParameter('country', itemIndex),
			lang: context.getNodeParameter('language', itemIndex),
			num: context.getNodeParameter('resultsPerPage', itemIndex),
			max_pages: context.getNodeParameter('maxPages', itemIndex),
			device: context.getNodeParameter('device', itemIndex),
			disallow_explicit: context.getNodeParameter('filterExplicit', itemIndex),
		};
		const scope = context.getNodeParameter('searchScope', itemIndex, '') as string;
		if (scope) input.property = scope;
		const categoryId = context.getNodeParameter('categoryId', itemIndex, 0) as number;
		if (categoryId && categoryId > 0) input.category_id = categoryId;
		return input;
	}

	// product
	const appIds = toArray(context.getNodeParameter('appIds', itemIndex, []));
	if (appIds.length === 0) {
		throw new NodeOperationError(
			context.getNode(),
			'Provide at least one App Store ID or URL',
			{ itemIndex },
		);
	}
	return {
		product_ids: appIds,
		country: context.getNodeParameter('country', itemIndex),
		include_reviews_sample: context.getNodeParameter('includeReviewsSample', itemIndex),
		include_related_apps: context.getNodeParameter('includeRelatedApps', itemIndex),
	};
}

const REVIEW_OPS = ['getReviews'];
const SEARCH_OPS = ['searchApps'];
const PRODUCT_OPS = ['getAppDetails'];
const ALL_OPS = ['getReviews', 'searchApps', 'getAppDetails'];

const resourceAndOperations: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'App', value: 'app' },
			{ name: 'Review', value: 'review' },
		],
		default: 'review',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['review'] } },
		options: [
			{
				name: 'Get Many',
				value: 'getReviews',
				action: 'Get many reviews for an app',
				description: 'Retrieve reviews for one or more apps across 50+ country stores',
			},
		],
		default: 'getReviews',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['app'] } },
		options: [
			{
				name: 'Search',
				value: 'searchApps',
				action: 'Search for apps',
				description: 'Search the App Store for apps by keyword',
			},
			{
				name: 'Get',
				value: 'getAppDetails',
				action: 'Get details for an app',
				description: 'Fetch full product details for one or more apps by ID or URL',
			},
		],
		default: 'searchApps',
	},
];

const primaryInputs: INodeProperties[] = [
	{
		displayName: 'Search Term',
		name: 'term',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. coffee',
		description: 'Keyword to search the App Store for',
		displayOptions: { show: { operation: SEARCH_OPS } },
	},
	{
		displayName: 'App Name',
		name: 'appName',
		type: 'string',
		default: '',
		placeholder: 'e.g. spotify',
		description:
			'Free-form app name to auto-resolve to the top match. Used only when no Product IDs are given.',
		displayOptions: { show: { operation: REVIEW_OPS } },
	},
	{
		displayName: 'Apple Product IDs',
		name: 'productIds',
		type: 'string',
		typeOptions: { multipleValues: true, multipleValueButtonText: 'Add Product ID' },
		default: [],
		placeholder: 'e.g. 324684580',
		description: 'Numeric Apple App Store IDs to fetch reviews for. Each ID appears in the App Store URL.',
		displayOptions: { show: { operation: REVIEW_OPS } },
	},
	{
		displayName: 'App Store IDs or URLs',
		name: 'appIds',
		type: 'string',
		typeOptions: { multipleValues: true, multipleValueButtonText: 'Add ID or URL' },
		required: true,
		default: [],
		placeholder: 'e.g. 324684580 or https://apps.apple.com/us/app/spotify/id324684580',
		description: 'Numeric App Store IDs or full App Store URLs to fetch details for',
		displayOptions: { show: { operation: PRODUCT_OPS } },
	},
	{
		displayName: 'Country Store',
		name: 'country',
		type: 'options',
		options: COUNTRIES,
		default: 'us',
		description: 'App Store country whose storefront and locale to use',
		displayOptions: { show: { operation: ALL_OPS } },
	},
];

const reviewInputs: INodeProperties[] = [
	{
		displayName: 'Sort Order',
		name: 'sort',
		type: 'options',
		options: [
			{ name: 'Most Critical', value: 'mostcritical' },
			{ name: 'Most Favorable', value: 'mostfavorable' },
			{ name: 'Most Helpful', value: 'mosthelpful' },
			{ name: 'Most Recent', value: 'mostrecent' },
		],
		default: 'mostrecent',
		description: 'Order reviews by recency, helpfulness, or rating polarity (iOS only; macOS is always most recent)',
		displayOptions: { show: { operation: REVIEW_OPS } },
	},
	{
		displayName: 'Maximum Reviews per App',
		name: 'maxReviews',
		type: 'number',
		typeOptions: { minValue: 0, maxValue: 10000 },
		default: 100,
		description: 'Maximum reviews returned per app. Set 0 for unlimited (about 1250 on iOS, 500 on macOS).',
		displayOptions: { show: { operation: REVIEW_OPS } },
	},
	{
		displayName: 'Start Page',
		name: 'startPage',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 500 },
		default: 1,
		description: 'Page number to start paginating from (1-based)',
		displayOptions: { show: { operation: REVIEW_OPS } },
	},
	{
		displayName: 'Include macOS Apps',
		name: 'includeMacos',
		type: 'boolean',
		default: true,
		description: 'Whether to include macOS apps in the results',
		displayOptions: { show: { operation: REVIEW_OPS } },
	},
	{
		displayName: 'Normalize Review Dates to ISO',
		name: 'normalizeDates',
		type: 'boolean',
		default: true,
		description: 'Whether to add an ISO 8601 date field alongside the locale-formatted review date',
		displayOptions: { show: { operation: REVIEW_OPS } },
	},
	{
		displayName: 'Parse Helpfulness Counts',
		name: 'parseHelpfulness',
		type: 'boolean',
		default: true,
		description: 'Whether to parse numeric helpful and total counts from the helpfulness text',
		displayOptions: { show: { operation: REVIEW_OPS } },
	},
];

const searchInputs: INodeProperties[] = [
	{
		displayName: 'Language',
		name: 'language',
		type: 'options',
		options: LANGUAGES,
		default: 'en-us',
		description: 'Language for localized result text',
		displayOptions: { show: { operation: SEARCH_OPS } },
	},
	{
		displayName: 'Results Per Page',
		name: 'resultsPerPage',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 200 },
		default: 10,
		description: 'Number of apps to request per page (1 to 200)',
		displayOptions: { show: { operation: SEARCH_OPS } },
	},
	{
		displayName: 'Maximum Pages',
		name: 'maxPages',
		type: 'number',
		typeOptions: { minValue: 0, maxValue: 100 },
		default: 1,
		description: 'Maximum pages to fetch. Set 0 to fetch all available pages.',
		displayOptions: { show: { operation: SEARCH_OPS } },
	},
	{
		displayName: 'Device Class',
		name: 'device',
		type: 'options',
		options: [
			{ name: 'Desktop', value: 'desktop' },
			{ name: 'Mobile', value: 'mobile' },
			{ name: 'Tablet', value: 'tablet' },
		],
		default: 'desktop',
		description: 'Device class to emulate when requesting results',
		displayOptions: { show: { operation: SEARCH_OPS } },
	},
	{
		displayName: 'Search Scope',
		name: 'searchScope',
		type: 'options',
		options: [
			{ name: 'App Name', value: '' },
			{ name: 'Developer Name', value: 'developer' },
		],
		default: '',
		description: 'Whether to match the term against app names or developer names',
		displayOptions: { show: { operation: SEARCH_OPS } },
	},
	{
		displayName: 'Category ID',
		name: 'categoryId',
		type: 'number',
		typeOptions: { minValue: 0 },
		default: 0,
		description: 'Filter by App Store category ID (for example 6014 Games, 6017 Education). Leave 0 for no filter.',
		displayOptions: { show: { operation: SEARCH_OPS } },
	},
	{
		displayName: 'Filter Explicit Apps',
		name: 'filterExplicit',
		type: 'boolean',
		default: false,
		description: 'Whether to exclude apps flagged as explicit',
		displayOptions: { show: { operation: SEARCH_OPS } },
	},
];

const productInputs: INodeProperties[] = [
	{
		displayName: 'Include Sample Reviews',
		name: 'includeReviewsSample',
		type: 'boolean',
		default: true,
		description: 'Whether to include the sample reviews shown on each product page',
		displayOptions: { show: { operation: PRODUCT_OPS } },
	},
	{
		displayName: 'Include Related App Lists',
		name: 'includeRelatedApps',
		type: 'boolean',
		default: false,
		description: 'Whether to include the You May Also Like and More By This Developer lists',
		displayOptions: { show: { operation: PRODUCT_OPS } },
	},
];

const outputProperties: INodeProperties[] = [
	{
		displayName: 'Output',
		name: 'output',
		type: 'options',
		options: [
			{
				name: 'Simplified',
				value: 'simplified',
				description: 'A compact, AI-friendly subset of the most useful fields',
			},
			{
				name: 'Raw',
				value: 'raw',
				description: 'Every field returned by the API',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose exactly which fields to return',
			},
		],
		default: 'simplified',
		description: 'How much of each result to return',
		displayOptions: { show: { operation: ALL_OPS } },
	},
	{
		displayName: 'Fields to Include',
		name: 'reviewFields',
		type: 'multiOptions',
		options: FIELD_DEFS.reviews.map((f) => ({ name: f.label, value: f.key })),
		default: [
			'rating',
			'review_title',
			'review_text',
			'author_name',
			'reviewed_version',
			'review_date_iso',
			'app_country',
			'product_id',
		],
		description: 'Fields to return. The dedupe keys product_id and review_date_iso are always included.',
		displayOptions: { show: { operation: REVIEW_OPS, output: ['selected'] } },
	},
	{
		displayName: 'Fields to Include',
		name: 'searchFields',
		type: 'multiOptions',
		options: FIELD_DEFS.search.map((f) => ({ name: f.label, value: f.key })),
		default: [
			'app_id',
			'title',
			'developer_name',
			'rating_average',
			'rating_count',
			'price_amount',
			'price_currency',
			'link',
		],
		description: 'Fields to return. The key app_id is always included.',
		displayOptions: { show: { operation: SEARCH_OPS, output: ['selected'] } },
	},
	{
		displayName: 'Fields to Include',
		name: 'productFields',
		type: 'multiOptions',
		options: FIELD_DEFS.product.map((f) => ({ name: f.label, value: f.key })),
		default: [
			'app_id',
			'title',
			'developer_name',
			'category',
			'price_text',
			'rating_average',
			'rating_count',
			'link',
		],
		description: 'Fields to return. The key app_id is always included.',
		displayOptions: { show: { operation: PRODUCT_OPS, output: ['selected'] } },
	},
];

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{ name: 'API Key', value: 'apifyApi' },
			{ name: 'OAuth2', value: 'apifyOAuth2Api' },
		],
		default: 'apifyApi',
		description: 'Which Apify authentication method to use',
	},
];

export const properties: INodeProperties[] = [
	...resourceAndOperations,
	...primaryInputs,
	...reviewInputs,
	...searchInputs,
	...productInputs,
	...outputProperties,
	...authenticationProperties,
];
