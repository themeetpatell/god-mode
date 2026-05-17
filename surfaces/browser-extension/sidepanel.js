/**
 * God Mode browser extension — sidepanel script (scaffold).
 * In v1.5 this calls the local God Mode server / API to run the full CEO loop.
 */
document.getElementById('run').addEventListener('click', async () => {
  const goal = document.getElementById('goal').value.trim();
  const out = document.getElementById('out');
  if (!goal) { out.textContent = 'Please enter a goal.'; return; }

  // Get the active tab's text content
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  out.textContent = `Goal: ${goal}\nActive tab: ${tab.url}\n\nScaffold: in v1.5 this calls the local God Mode HTTP API at http://localhost:9876/v1/run with the page context.`;
});
