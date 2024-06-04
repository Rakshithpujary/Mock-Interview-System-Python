import speech_recognition as sr

# Initialize the recognizer
recognizer = sr.Recognizer()

def Speech_recognition():
    
    with sr.Microphone() as source:
        
        recognizer.adjust_for_ambient_noise(source)  # Adjust for ambient noise
        audio = recognizer.listen(source)  # Listen for audio input

    try:
        # Recognize speech using Google Speech Recognition
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        return "Sorry, I couldn't understand what you said."
    except sr.RequestError as e:
        return "Speech Recognition error occurred"
