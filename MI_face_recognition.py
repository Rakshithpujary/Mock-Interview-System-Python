import cv2
import tkinter as tk
from PIL import Image, ImageTk
from fer import FER
import time

class FaceRecognitionApp:
    def __init__(self, window, window_title):
        self.window = window
        self.window.title(window_title)
        
        self.video_source = 0  # Primary webcam
        
        # Create a frame to display the video feed
        self.frame = tk.Frame(window)
        self.frame.pack()
        
        # Create a canvas to display the video feed
        self.canvas = tk.Canvas(self.frame, width=400, height=300)
        self.canvas.pack()
        
        # Create a label for warning message
        self.lbl_warning = tk.Label(window, text="", fg="red")
        self.lbl_warning.pack()
        
        # Create a button to start/stop recognition
        self.btn_toggle = tk.Button(window, text="Start Recognition", command=self.toggle_recognition, bg="green", fg="white")
        self.btn_toggle.pack(side=tk.LEFT, padx=5, pady=5)
        
        self.recognizing = False
        self.vid = None
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml')
        self.emotion_detector = FER()
        
        # Emotion accumulation related attributes
        self.emotion_accumulator = []
        self.start_time = time.time()
        self.summary_interval = 60  # Summary interval in seconds
        
        self.window.mainloop()

    def toggle_recognition(self):
        self.recognizing = not self.recognizing
        if self.recognizing:
            self.start_recognition()
            self.btn_toggle.config(text="Stop Recognition", bg="red")
        else:
            self.stop_recognition()
            self.btn_toggle.config(text="Start Recognition", bg="green")

    def start_recognition(self):
        self.vid = cv2.VideoCapture(self.video_source)
        self.update_frame()

    def stop_recognition(self):
        if self.vid:
            self.vid.release()
            self.canvas.delete("all")
            self.lbl_warning.config(text="")
            self.vid = None

    def update_frame(self):
        if self.vid and self.vid.isOpened():
            ret, frame = self.vid.read()
            if ret:
                face_locations = self.detect_faces(frame)
                if self.recognizing and len(face_locations) == 1:
                    frame = self.process_frame(frame)
                    photo = ImageTk.PhotoImage(image=Image.fromarray(frame))
                    self.canvas.create_image(0, 0, image=photo, anchor=tk.NW)
                    self.canvas.photo = photo
                    self.lbl_warning.config(text="")
                    self.detect_emotions(frame)
                else:
                    self.handle_multiple_faces(face_locations)
            self.window.after(10, self.update_frame)

    def detect_faces(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        return faces

    def detect_emotions(self, frame):
        emotions = self.emotion_detector.detect_emotions(frame)
        self.accumulate_emotions(emotions)

    def process_frame(self, frame):
        frame = cv2.resize(frame, (0, 0), fx=0.7, fy=0.7)
        frame = frame[:, 50:, :]
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        return frame

    def handle_multiple_faces(self, face_locations):
        if len(face_locations) > 1:
            self.lbl_warning.config(text="Warning: Only one person should be in the frame!")
        else:
            self.lbl_warning.config(text="Warning: You are not in the frame. Please come closer!")

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

# Create a window and pass it to the FaceRecognitionApp class
root = tk.Tk()
app = FaceRecognitionApp(root, "Face Recognition Application")
