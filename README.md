# n8n-nodes-apple-app-store-api

Apple App Store reviews for n8n. Any app, any country, JSON output, pay-per-review.

**The only n8n node that works on apps you don't own.** It wraps three Apify-backed APIs behind one node and one credential, so you can pull reviews, search the store, and fetch full app details without an App Store Connect account.

- **Get Reviews** for any iOS or macOS app, by name or by Apple ID.
- **Search Apps** by keyword across 50+ country stores and 45 languages.
- **Get App Details** (full product page: developer, pricing, ratings, screenshots, version history, and more).

iOS and macOS. 50+ country stores. Sort by recent, helpful, favorable, or critical. Auto-resolve apps by name, so your agent doesn't need to know the Apple ID. Cleanest review JSON in n8n: ISO-normalized dates and parsed helpfulness counts out of the box.

Built for AI agent workflows. Pass an app name, get clean reviews back, hand to Claude.

---

## Installation

1. In n8n, open **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-apple-app-store-api` and confirm.

n8n Cloud installs verified community nodes the same way. The node also works as an **AI Agent tool**.

## Credentials

The node calls the Apify API, so you need a free [Apify](https://apify.com?fpr=9n7kx3) account and an API token.

1. Sign in to Apify and open **Settings > Integrations** to copy your **API token**.
2. In n8n, create a new **Apify API** credential and paste the token.
3. n8n Cloud users can connect with **Apify OAuth2** instead of a token.

You are not connecting to App Store Connect. This node reads public App Store data through Apify and never touches your developer account.

## Operations

### Review: Get Many

Retrieve reviews for one or more apps.

- **App Name**: a free-form name (for example `spotify`) that auto-resolves to the top match. Convenient for agents.
- **Apple Product IDs**: one or more numeric App Store IDs for exact targeting. Each ID appears in the App Store URL.
- **Country Store**, **Sort Order** (most recent, most helpful, most favorable, most critical), **Maximum Reviews per App**, **Start Page**, **Include macOS Apps**, **Normalize Review Dates to ISO**, **Parse Helpfulness Counts**.

Provide an App Name or at least one Product ID. Sort applies to iOS only; macOS always returns most recent.

### App: Search

Search the App Store by keyword.

- **Search Term** (required), **Country Store**, **Language**, **Results Per Page** (1 to 200), **Maximum Pages**, **Device Class**, **Search Scope** (app name or developer name), **Category ID**, **Filter Explicit Apps**.

### App: Get

Fetch the full product page for one or more apps.

- **App Store IDs or URLs** (required): numeric IDs or full App Store URLs (the ID is parsed automatically).
- **Country Store**, **Include Sample Reviews**, **Include Related App Lists**.

## Output modes

Every operation has an **Output** option with three modes:

- **Simplified** (default): a compact, AI-friendly subset of the most useful fields. The default when the node is used as an AI tool, to keep an agent's context small.
- **Raw**: every field the API returns.
- **Selected Fields**: pick exactly which fields to return. For reviews, `product_id` and `review_date_iso` are always included as dedupe keys; for search and app details, `app_id` is always included.

### Simplified review fields

| Field | Description |
|---|---|
| `rating` | Star rating, 1 to 5 |
| `title` | Review title |
| `text` | Review body |
| `author` | Reviewer name |
| `version` | App version reviewed |
| `review_date_iso` | Review date, ISO 8601 |
| `country` | Country store |
| `product_id` | Apple product ID |

Raw reviews add helpfulness counts, author ID, platform, page numbers, and timestamps. Search and app-details results return the full app metadata documented on each Apify Actor page (linked below).

## Example workflows

**Triage low-star reviews to Slack.** Schedule Trigger, then **Apple App Store > Review > Get Many** (your app, sort Most Critical), then an IF node on `rating <= 2`, then Slack. This is an on-demand fetcher, not a push stream, so pair it with the Schedule Trigger for monitoring.

**Competitor research for an agent.** **App > Search** for a keyword, then **App > Get** on the top result's `app_id`, then **Review > Get Many** for the same app, then hand the JSON to a Claude or OpenAI node. Use Simplified output to keep the context small.

**Draft review replies in your brand voice.** **Review > Get Many**, then a Claude node that drafts a personalized reply per review, then a human-approval step before posting. Sentiment and reply drafting happen in your downstream AI nodes; this node returns raw reviews only.

## Pricing

Pay only for what you fetch. No subscription.

| Operation | Setup fee per run | Per result |
|---|---|---|
| Get Reviews | $0.02 | $0.0015 per review |
| Search Apps | $0.02 | $0.0015 per app |
| Get App Details | $0.02 | $0.02 per app |

**$0.0015 per review. About $1.50 per 1,000 reviews. No subscription.** One $0.02 setup fee per run, plus $0.0015 per review.

AppFigures starts at $79/month. AppFollow Pro starts at about $300/month. This node costs about $1.50 per 1,000 reviews with no minimums.

## Notes

- This node returns raw reviews and app data. It does not classify sentiment; run sentiment analysis downstream (Claude, GPT, or classical NLP).
- It is an on-demand fetcher, not a webhook stream. For monitoring, pair it with the Schedule Trigger.
- You decide your own use of the data. This project makes no legal or terms-of-service claims.

## Backed by these Apify APIs

- [Apple App Store Reviews API](https://apify.com/johnvc/apple-app-store-reviews-api?fpr=9n7kx3)
- [Apple App Store Search](https://apify.com/johnvc/apple-app-store-search?fpr=9n7kx3)
- [Apple App Store Product API](https://apify.com/johnvc/apple-app-store-product-api?fpr=9n7kx3)

## Resources

- [npm package](https://www.npmjs.com/package/n8n-nodes-apple-app-store-api)
- [GitHub repository](https://github.com/johnisanerd/n8n-nodes-apple-app-store-api)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Apify](https://apify.com?fpr=9n7kx3)

Want to try the AI workflows above? New to Claude? You can start a free trial with this referral: https://claude.ai/referral/uIlpa7nPLg

## License

[MIT](LICENSE.md)
