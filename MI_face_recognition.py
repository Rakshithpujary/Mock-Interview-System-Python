import cv2
import tkinter as tk
from PIL import Image, ImageTk
from tkinter import messagebox
from fer import FER
import time
from MI_question_generation import generate_questions
from MI_speech_recognition import Speech_recognition

   
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml')
emotion_detector = FER()
        
        # # Emotion accumulation related attributes
        # self.emotion_accumulator = []
        # self.start_time = time.time()
        # self.summary_interval = 60  # Summary interval in seconds



    

def detect_faces(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    return faces

def detect_emotions(frame):
    emotions = emotion_detector.detect_emotions(frame)
    accumulate_emotions(emotions)

def process_frame(frame):
    frame = cv2.resize(frame, (0, 0), fx=0.7, fy=0.7)
    frame = frame[:, 50:, :]
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    return frame

def handle_multiple_faces(face_locations):
    if len(face_locations) > 1:
        return "Warning: Only one person should be in the frame!"
    else:
        return "Warning: You are not in the frame. Please come closer!"

def accumulate_emotions(self, emotions):
    if emotions:
        first_emotion = emotions[0]['emotions']  # Access the first emotion dictionary
        self.emotion_accumulator.append(first_emotion)

    current_time = time.time()
    if current_time - self.start_time >= self.summary_interval:
        self.summarize_emotions()
        self.start_time = current_time

def summarize_emotions(self):
    if not self.emotion_accumulator:
        print("No emotions detected in the last minute.")
        return

    summary = {key: sum(emotion[key] for emotion in self.emotion_accumulator) / len(self.emotion_accumulator)
                for key in self.emotion_accumulator[0]}

    print("Emotion Summary:", summary)
    self.emotion_accumulator = []
    
    



