import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { apiRequest, getResults, isUsedAsAiTool, pollRunStatus } from './genericFunctions';
import { ACTOR_IDS } from '../AppleAppStore.node';
import { buildActorInput } from '../AppleAppStore.properties';
import { applyOutput, type OpKey } from './output';

const OPERATION_TO_KEY: Record<string, OpKey> = {
	getReviews: 'reviews',
	searchApps: 'search',
	getAppDetails: 'product',
};

const SELECTED_FIELDS_PARAM: Record<OpKey, string> = {
	reviews: 'reviewFields',
	search: 'searchFields',
	product: 'productFields',
};

/**
 * Run the right Apify Actor for the selected operation, then shape the dataset
 * into one clean n8n item per result according to the chosen Output mode.
 */
export async function runActor(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', i) as string;
	const opKey = OPERATION_TO_KEY[operation];
	if (!opKey) {
		throw new NodeApiError(this.getNode(), { message: `Unknown operation: ${operation}` });
	}

	const actorId = ACTOR_IDS[opKey];
	const input = buildActorInput(this, i, opKey);

	const run = await apiRequest.call(this, {
		method: 'POST',
		uri: `/v2/acts/${actorId}/runs`,
		body: input,
		qs: { waitForFinish: 0 },
	});

	if (!run?.data?.id) {
		throw new NodeApiError(this.getNode(), {
			message: 'Run ID not found after starting the Actor',
		});
	}

	const runId = run.data.id as string;
	const datasetId = run.data.defaultDatasetId as string;

	const lastRun = await pollRunStatus.call(this, runId);
	if (lastRun?.status && lastRun.status !== 'SUCCEEDED') {
		throw new NodeApiError(this.getNode(), {
			message: `Actor run ${runId} did not succeed (status: ${lastRun.status})`,
		});
	}

	const items = await getResults.call(this, datasetId);

	const mode = isUsedAsAiTool(this.getNode().type)
		? 'simplified'
		: (this.getNodeParameter('output', i, 'simplified') as string);

	let selected: string[] = [];
	if (mode === 'selected') {
		selected = this.getNodeParameter(SELECTED_FIELDS_PARAM[opKey], i, []) as string[];
	}

	const mapped = applyOutput(opKey, mode, selected, items);
	return this.helpers.returnJsonArray(mapped);
}
