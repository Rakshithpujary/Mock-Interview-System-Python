from PIL import Image, ImageTk
from tkinter import messagebox
import cv2
from fer import FER
import time
import tkinter as tk
from MI_face_recognition import detect_faces, process_frame, handle_multiple_faces

class MainFile:
    def __init__(self, window, window_title):
        self.window = window
        self.window.title(window_title)
        
        # Make the main window full-screen
        self.window.attributes('-fullscreen', True)

        self.video_source = 0  # Set this to 0 for primary webcam

         # Create a navigation bar frame with a black shadow effect
        self.nav_bar = tk.Frame(window, bd=2, relief=tk.RAISED, bg="black")
        self.nav_bar.pack(side=tk.TOP, fill=tk.X)

        # Create a close button on the right side of the navigation bar
        self.close_button = tk.Button(self.nav_bar, text="     Close     ", command=self.close_window, bg="red", fg="white")
        self.close_button.pack(side=tk.RIGHT, padx=10, pady=5)
        
        # Create a frame to display the video feed
        self.frame = tk.Frame(window)
        self.frame.pack()
        
        # Create a canvas to display the video feed
        self.canvas = tk.Canvas(self.frame, width=400, height=300)
        self.canvas.pack()
        
        # Create a label for warning message
        self.lbl_warning = tk.Label(window, text="", fg="red")
        self.lbl_warning.pack()

        # Frame to get user input for job role
        self.job_frame = tk.Frame(window)
        self.job_frame.pack(side=tk.TOP, pady=10)
        self.job_label = tk.Label(self.job_frame, text="Enter Job Role:", font=("Arial", 15))
        self.job_label.pack(side=tk.LEFT)
        self.job_entry = tk.Entry(self.job_frame, width=30, text="", font=("Arial", 15))
        self.job_entry.pack(side=tk.LEFT)

        # Frame to display questions
        self.question_frame = tk.Frame(window)
        self.question_frame.pack(side=tk.TOP, pady=10)
        self.question_label = tk.Label(self.question_frame, text="Question:", font=("Arial", 15))
        self.question_label.pack(side=tk.LEFT)
        self.question_text = tk.StringVar()
        self.question_text.set("............................?")
        self.question_display = tk.Label(self.question_frame, textvariable=self.question_text, font=("Arial", 13))

        # Frame to display answers with border
        self.answer_frame = tk.Frame(window, bd=2, relief=tk.SOLID, width=400, height=300)
        self.answer_frame.pack()

        # Label for displaying "Answer:"
        self.answer_label = tk.Label(self.answer_frame, text="Answer:")
        self.answer_label.pack(side=tk.LEFT)

        # StringVar to hold the answer text
        self.answer_text = tk.StringVar()

        # Label to display the answer text
        self.answer_display = tk.Label(self.answer_frame, textvariable=self.answer_text)

        # Create a frame for the buttons
        self.button_frame = tk.Frame(window)
        self.button_frame.pack(side=tk.BOTTOM, pady=50)

        
        # Create a button to start/stop recognition
        self.btn_toggle = tk.Button(self.button_frame, text="Start Recognition", command=self.toggle_recognition, bg="green", fg="white")
        self.btn_toggle.pack(side=tk.LEFT, padx=5, pady=5)

         # Create a button to move to the next question
        self.btn_next = tk.Button(self.button_frame, text="     Next     ", bg="green", fg="white")
        self.btn_next.pack(side=tk.LEFT, padx=10)
        self.btn_next.pack_forget()  # Initially hide the button

        # Create a button for speech recognition
        self.btn_speech_recognition = tk.Button(self.button_frame, text="  Answer Again  ", bg="blue", fg="white")
        self.btn_speech_recognition.pack(side=tk.LEFT, padx=10)
        self.btn_speech_recognition.pack_forget()  # Initially hide the button

        
        self.recognizing = False
        self.vid = None
        
        
        self.window.mainloop()
    
    def toggle_recognition(self):
        job_description = self.job_entry.get().strip()
        if not job_description:
            messagebox.showwarning("Input Error", "Please enter a job description.")
            return
        if not job_description[0].isalnum():
            messagebox.showwarning("Input Error", "Job description should not start with a special character.")
            return

        # if self.recognizing:
        #     # Ask for confirmation before stopping recognition
        #     response = messagebox.askyesno("Confirm", "Are you sure you want to end the interview?")
        #     if not response:
        #         return


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
        print("Hello")
        if self.vid and self.vid.isOpened():
            ret, frame = self.vid.read()
            if ret:
                face_locations = detect_faces(frame)
                if self.recognizing and len(face_locations) == 1:
                    frame = process_frame(frame)
                    photo = ImageTk.PhotoImage(image=Image.fromarray(frame))
                    self.canvas.create_image(0, 0, image=photo, anchor=tk.NW)
                    self.canvas.photo = photo
                    self.lbl_warning.config(text="")
                    # self.detect_emotions(frame)
                else:
                    ErrorMessage = handle_multiple_faces(face_locations)
                    if "Warning: Only one person should be in the frame!" in ErrorMessage:
                        self.lbl_warning.config(text="Warning: Only one person should be in the frame!")
                    elif "Warning: You are not in the frame. Please come closer!" in ErrorMessage:
                        self.lbl_warning.config(text="Warning: You are not in the frame. Please come closer!")
            self.window.after(10, self.update_frame)

    
    def close_window(self):
        if self.recognizing:
            # If recognition is active, ask for confirmation before closing
            response = messagebox.askyesno("Close Application", "You are currently in the interview. Are you sure you want to exit the application?")
            if response:
                self.window.destroy()
        else:
            # If recognition is not active, close the application directly
            self.window.destroy()

# Create a window and pass it to the FaceRecognitionApp class
root = tk.Tk()
app = MainFile(root, "ui")
