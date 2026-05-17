/**
 * God Mode — Slack bot server (scaffold).
 *
 * Run: npm run dev
 * Env: SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, ANTHROPIC_API_KEY, GOD_MODE_HOME
 *
 * This is a minimal scaffold. v1.4 ships the routing and threading basics; v1.5 will
 * add the full CEO loop, verifier integration, and external-actions approval flow.
 */

const { App, ExpressReceiver } = require('@slack/bolt');

const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver
});

// /god-mode <goal>
app.command('/god-mode', async ({ ack, command, respond }) => {
  await ack();
  const goal = command.text?.trim();
  if (!goal) {
    await respond({ response_type: 'ephemeral', text: 'Usage: `/god-mode <your goal>`' });
    return;
  }
  // Post a thread-starter
  const result = await app.client.chat.postMessage({
    channel: command.channel_id,
    text: `:rocket: *God Mode activated* — goal:\n> ${goal}\n\n_Building roadmap..._`
  });
  // v1.4 scaffold: real CEO invocation happens here
  // For now, post a placeholder follow-up in-thread
  await app.client.chat.postMessage({
    channel: command.channel_id,
    thread_ts: result.ts,
    text: 'Scaffold: in v1.5 the CEO runs the full loop here. For now, this is the threading + auth proof.'
  });
});

// /roadmap <goal>
app.command('/roadmap', async ({ ack, command, respond }) => {
  await ack();
  const goal = command.text?.trim();
  if (!goal) {
    await respond({ response_type: 'ephemeral', text: 'Usage: `/roadmap <your goal>`' });
    return;
  }
  await respond({
    response_type: 'in_channel',
    text: `:clipboard: *Roadmap for:* ${goal}\n\n_Scaffold — full roadmap-builder integration in v1.5._`
  });
});

// /status
app.command('/status', async ({ ack, respond }) => {
  await ack();
  await respond({
    response_type: 'ephemeral',
    text: 'No active session. Use `/god-mode <goal>` to start one.'
  });
});

// /handoff
app.command('/handoff', async ({ ack, respond }) => {
  await ack();
  await respond({
    response_type: 'ephemeral',
    text: 'Scaffold: in v1.5 this generates a paste-ready handoff brief from the current thread.'
  });
});

// @mention handler
app.event('app_mention', async ({ event, client }) => {
  await client.chat.postMessage({
    channel: event.channel,
    thread_ts: event.thread_ts || event.ts,
    text: 'God Mode here. Try `/god-mode <goal>` to start a session, or describe a multi-step goal in plain English.'
  });
});

// DM handler
app.event('message', async ({ event, client }) => {
  if (event.channel_type !== 'im' || event.bot_id) return;
  await client.chat.postMessage({
    channel: event.channel,
    text: 'Scaffold DM handler. In v1.5 DMs become long-running session contexts.'
  });
});

const port = process.env.PORT || 3000;
receiver.app.listen(port, () => {
  console.log(`God Mode Slack bot listening on :${port}`);
});
