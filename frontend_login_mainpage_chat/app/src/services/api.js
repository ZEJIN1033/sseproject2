const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://server.enhxbpexaqcvguev.uksouth.azurecontainer.io:8000';

const fetchJson = async (url, options = {}) => {
  const token = sessionStorage.getItem('token');

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error('Fetch Error');
      error.data = data;
      error.status = response.status;
      throw error;
    }
    return data;

  } catch (err) {
    console.error('Fetch Error:', err);
    alert(err.detail || 'Internet Error or UnAuthorized.');
    if (err.status === 401){
      window.location.href = '/login'
    }
    else {
      window.location.href = '/home'
    }
  }
};



export const createNewThread = () => fetchJson('/api/new', { method: 'POST' });

export const fetchThread = (threadId) => fetchJson(`/api/threads/${threadId}`);

export const fetchRun = (threadId, runId) => fetchJson(`/api/threads/${threadId}/runs/${runId}`);

export const postMessage = (threadId, message) => fetchJson(`/api/threads/${threadId}`, {
  method: 'POST',
  body: JSON.stringify({ content: message }),
});

export const postToolResponse = (threadId, runId, toolResponses) => fetchJson(`/api/threads/${threadId}/runs/${runId}/tool`, {
  method: 'POST',
  body: JSON.stringify(toolResponses),
});
