const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
  return request('/stories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getStories() {
  return request('/stories');
}

export async function analyzeLocation(lat, lng) {
  return request(`/analyze?lat=${lat}&lng=${lng}`);
}
