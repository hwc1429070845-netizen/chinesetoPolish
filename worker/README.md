# Google Polish audio proxy

This Cloudflare Worker fetches Polish MP3 audio from Google Translate and returns it to the GitHub Pages site. It keeps the browser from contacting Google's audio endpoint directly. It uses Google's web TTS endpoint, which is unofficial and may be rate limited; this does not provide an uptime guarantee.

## Deploy

1. In Cloudflare, open **Workers & Pages** and create a Worker named `polish-google-tts`.
2. Open the Worker editor and replace its starter code with [`index.js`](index.js), then deploy it.
3. Copy the Worker URL, for example `https://polish-google-tts.<your-account-subdomain>.workers.dev`.
4. In both `index.html` and `每日波兰语.html`, set `TTS_PROXY_URL` to the URL plus `/tts`, such as `https://polish-google-tts.<your-account-subdomain>.workers.dev/tts`.
5. Commit and push those two HTML files to GitHub Pages.

The Worker accepts only requests from `https://hwc1429070845-netizen.github.io`, fixes the language to Polish, and limits text to 200 characters. It requires no API key. The web page keeps device speech as a fallback if Google or the Worker is unreachable.
