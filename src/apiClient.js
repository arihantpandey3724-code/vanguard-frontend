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
    let cleanMessage = 'An unexpected error occurred. Please try again.';

    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.detail && Array.isArray(errorJson.detail)) {
        cleanMessage = errorJson.detail[0].msg; 
      } 
      else if (errorJson.detail && typeof errorJson.detail === 'string') {
        cleanMessage = errorJson.detail;
      } 
      else if (errorJson.message) {
        cleanMessage = errorJson.message;
      }
    } catch (e) {
      if (errorText) cleanMessage = errorText;
    }
    throw new Error(cleanMessage);
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
  return request(`/get-stories?t=${Date.now()}`, { 
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
}

export async function analyzeLocation(lat, lng) {
  return request('/analyze-location', {
    method: 'POST',
    body: JSON.stringify({ latitude: lat, longitude: lng })
  });
}

export async function generateReport(location) {
  return request('/generate-report', {
    method: 'POST',
    body: JSON.stringify({ location: location })
  });
}