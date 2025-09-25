# Voice Integration Implementation Guide

## Current Implementation
The ChatPage now has a fully functional voice recording UI with the following features:
- Voice recording button with visual feedback
- Recording duration timer
- Processing status indicator
- Animated recording states

## Speech-to-Text Integration Options

### 1. Web Speech API (Browser Built-in)
**Pros:** Free, no API keys needed, works offline
**Cons:** Limited browser support, less accurate

```javascript
// Replace the processAudioToText function with:
const processAudioToText = async () => {
  setIsProcessingAudio(true);
  
  try {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsProcessingAudio(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsProcessingAudio(false);
      };

      recognition.start();
    }
  } catch (error) {
    console.error('Error with speech recognition:', error);
    setIsProcessingAudio(false);
  }
};
```

### 2. OpenAI Whisper API (Recommended)
**Pros:** High accuracy, supports many languages
**Cons:** Requires API key and costs money

```javascript
const processAudioToText = async (audioBlob) => {
  setIsProcessingAudio(true);
  
  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: formData
    });

    const result = await response.json();
    setInputMessage(result.text);
    
  } catch (error) {
    console.error('Error transcribing audio:', error);
    alert('Error processing voice input. Please try again.');
  } finally {
    setIsProcessingAudio(false);
  }
};
```

### 3. Google Speech-to-Text API
**Pros:** High accuracy, good language support
**Cons:** Requires Google Cloud setup and API key

```javascript
const processAudioToText = async (audioBlob) => {
  setIsProcessingAudio(true);
  
  try {
    // Convert audio to base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onload = async () => {
      const base64Audio = reader.result.split(',')[1];
      
      const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${process.env.REACT_APP_GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 16000,
            languageCode: 'en-US'
          },
          audio: {
            content: base64Audio
          }
        })
      });

      const result = await response.json();
      if (result.results && result.results[0]) {
        setInputMessage(result.results[0].alternatives[0].transcript);
      }
    };
    
  } catch (error) {
    console.error('Error transcribing audio:', error);
  } finally {
    setIsProcessingAudio(false);
  }
};
```

## Text-to-Speech (AI Response Audio)
To make the AI respond with voice:

### Using Web Speech API
```javascript
const speakResponse = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  }
};

// Call this after receiving AI response
speakResponse(aiResponse);
```

### Using OpenAI TTS API
```javascript
const speakResponse = async (text) => {
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'alloy'
      })
    });

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    
  } catch (error) {
    console.error('Error with text-to-speech:', error);
  }
};
```

## Required Environment Variables
Add to your `.env` file:
```
REACT_APP_OPENAI_API_KEY=your_openai_key_here
REACT_APP_GOOGLE_API_KEY=your_google_key_here
```

## Installation Commands
```bash
# No additional packages needed for Web Speech API

# For enhanced audio processing (optional)
npm install @types/dom-mediacapture-record
```

## Browser Permissions
Make sure your application is served over HTTPS to access the microphone API. For development, localhost is allowed.

## Testing
1. Click the microphone button
2. Allow microphone permissions
3. Speak your message
4. Click stop or the mic button again
5. The transcribed text should appear in the input field

## Current Status
✅ Voice recording UI implemented
✅ Recording state management
✅ Audio capture functionality
⏳ Speech-to-text integration (choose one of the above options)
⏳ Text-to-speech for AI responses (optional)