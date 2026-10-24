# Google Polish audio proxy

The deployed Cloudflare Worker proxies Google Translate Polish MP3 audio for the GitHub Pages site. The web page uses the Worker first and falls back to the device's Polish speech engine if Google audio is unavailable.

Worker endpoint: `https://polish-google-tts.hwc1429070845.workers.dev/tts`

The Worker uses Google's web TTS endpoint, which is unofficial and may be rate limited; this does not provide an uptime guarantee. It accepts only requests from `https://hwc1429070845-netizen.github.io`, fixes the language to Polish, limits text to 200 characters, and requires no API key.