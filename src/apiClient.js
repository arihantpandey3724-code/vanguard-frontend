const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  return response.status === 204 ? null : response.json();
}

export async function submitStory(data) {
  return request('/submit-story', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getStories() {
  return request('/get-stories');
}

export async function analyzeLocation(lat, lng) {
  return request('/analyze-location', {
    method: 'POST',
    body: JSON.stringify({ latitude: lat, longitude: lng })
  });
}


export async function sendChatMessage(query, context) {
  return request('/chat', {
    method: 'POST',
    body: JSON.stringify({ user_query: query, local_context: context })
  });
}