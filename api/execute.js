const LANGUAGE_ID_MAP = {
  JavaScript: 63,
  Python: 71,
  Java: 62,
  'C++': 54,
};

const JUDGE0_BASE_URL = (process.env.JUDGE0_BASE_URL || 'https://ce.judge0.com').replace(/\/$/, '');

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const toOutput = (result = {}) => {
  const output = [result.stdout, result.stderr, result.compile_output, result.message].filter(Boolean).join('');
  return output.trim() || '(no output)';
};

export default async function handler(req, res) {
  cors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { language, code, stdin } = req.body || {};
    if (!language || !code) {
      return res.status(400).json({ ok: false, error: 'language and code are required.' });
    }

    const languageId = LANGUAGE_ID_MAP[language];
    if (!languageId) {
      return res.status(400).json({ ok: false, error: 'Unsupported language.' });
    }

    const timeoutMs = Number(process.env.JUDGE0_TIMEOUT_MS || 45000);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const payload = {
      source_code: code,
      language_id: languageId,
      stdin: typeof stdin === 'string' ? stdin : '',
    };

    let response;
    try {
      response = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(502).json({ ok: false, error: data?.message || data?.error || 'Judge service failed.' });
    }

    const statusId = Number(data?.status?.id || 0);
    const isSuccess = statusId === 3;

    if (!isSuccess) {
      return res.status(400).json({ ok: false, error: toOutput(data) || 'Execution failed.' });
    }

    return res.status(200).json({ ok: true, output: toOutput(data) });
  } catch (error) {
    if (error?.name === 'AbortError') {
      return res.status(408).json({ ok: false, error: 'Execution timed out.' });
    }
    return res.status(500).json({ ok: false, error: 'Failed to execute code.' });
  }
}
