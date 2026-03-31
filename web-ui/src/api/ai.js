import axios from "axios";

const API_URL = "https://todoapp-api-x6bx.onrender.com/api/ai";
// const API_URL = "http://localhost:3000/api/ai";

export const getTasksSummary = async (token, tasks) => {
  const response = await axios.post(
    `${API_URL}/combined-summary`,
    { tasks },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data.summary;
};

export const getTasksSummaryStream = (token, tasks, onChunk, onComplete, onError) => {
  // Create a POST request manually since EventSource only supports GET
  fetch(`${API_URL}/combined-summary-stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ tasks })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const processStream = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          onComplete();
          return;
        }

        // Decode the chunk
        buffer += decoder.decode(value, { stream: true });
        
        // Split by newlines to get individual SSE messages
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line in buffer

        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                onError(new Error(data.chunk));
                return;
              }
              
              if (data.done) {
                onComplete();
              } else if (data.chunk) {
                onChunk(data.chunk);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        });

        processStream();
      }).catch(onError);
    };

    processStream();
  })
  .catch(onError);
};