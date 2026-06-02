import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { properties } from './AppleAppStore.properties';
import { runActor } from './helpers/executeActor';

export const PACKAGE_NAME = 'n8n-nodes-apple-app-store-api';
export const CLASS_NAME = 'AppleAppStore';
export const ClassNameCamel = CLASS_NAME.charAt(0).toLowerCase() + CLASS_NAME.slice(1);

export const X_PLATFORM_HEADER_ID = 'n8n';
export const X_PLATFORM_APP_HEADER_ID = 'apple-app-store';

// Apify Actor handles (username~actor-name form used in Apify API paths), one per operation.
export const ACTOR_IDS = {
	reviews: 'johnvc~apple-app-store-reviews-api',
	search: 'johnvc~apple-app-store-search',
	product: 'johnvc~apple-app-store-product-api',
} as const;

export const DISPLAY_NAME = 'Apple App Store';
export const DESCRIPTION =
	'Get Apple App Store reviews, search results, and app details as JSON across 50+ country stores';

export class AppleAppStore implements INodeType {
	description: INodeTypeDescription = {
		displayName: DISPLAY_NAME,
		name: ClassNameCamel,
		icon: 'file:logo.svg',
		group: ['transform'],
		version: [1],
		defaultVersion: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: DESCRIPTION,
		defaults: {
			name: DISPLAY_NAME,
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				displayName: 'Apify API key connection',
				name: 'apifyApi',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apifyApi'],
					},
				},
			},
			{
				displayName: 'Apify OAuth2 connection',
				name: 'apifyOAuth2Api',
				required: false,
				displayOptions: {
					show: {
						authentication: ['apifyOAuth2Api'],
					},
				},
			},
		],
		properties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const data = await runActor.call(this, i);
				for (const item of data) {
					returnData.push({ ...item, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : String(error);
					returnData.push({ json: { error: message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
