import google.generativeai as genai
import time

# API KEY
GOOGLE_API_KEY = 'AIzaSyB2DpQylxNaQLbwW0hkxSwTXi1M3OrOJyo'
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the GenerativeModel and start a chat session
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

def format_text(self, lines):
    questions = []
    question_buffer = ""

    for line in lines:
        line = line.strip()  # Remove leading/trailing whitespace

        # Check for non-empty lines
        if line:
            # Check for question format (starts with number 1-10, ends with "?")
            if line.startswith(tuple(str(i) for i in range(1, 11))) and line.rstrip().endswith("?"):
                # Append previous question if any
                if question_buffer:
                    questions.append(question_buffer.strip())
                # Start new question buffer with current line
                question_buffer = line + " "
            else:
                # Append line to current question buffer
                question_buffer += line + " "

    # Append the last question if remaining in buffer
    if question_buffer:
        questions.append(question_buffer.strip())

    return questions

def get_questions(self, context_text, call_count):
    try:
        print(f"get_questions Instance started = {call_count}")

        message = ""

        # Up to 5 calls, request 5 interview questions
        if call_count <= 5:
            message = f"Context = {context_text} \n\n Generate 5 interview questions based on the above context. (Don't write ANYTHING EXTRA OTHER THAN THE QUESTIONS) ADD question mark at the end of every question please."
        # Calls between 6 and 15, request 5 interview questions with specific instructions
        elif 5 < call_count <= 15:
            message = f"Context = {context_text} \n\n Generate exactly 5 interview questions based on the above context. (Don't write ANYTHING EXTRA OTHER THAN THE QUESTIONS) ADD question mark at the end of every question please (PLEASE ONLY WRITE THE QUESTIONS AND DON'T WRITE ANYTHING ELSE)"
        # More than 15 calls, indicate context issue to the user
        else:
            return ["Taking too long"]

        # Send message to GenerativeAI model
        response = self.chat.send_message(message)

        raw_text = response.text
        lines = raw_text.split("\n")

        # Remove specific text occurrences
        text_to_remove = [
                "**Disclaimer:**","MCQs:","**MCQs:**","MCQ",
                "Note:","Note","NOTE:","NOTE","**Note:**",
                "**NOTE:**","**Disclaimer:**","Disclaimer:",
                "Disclaimer","DISCLAIMER","DISCLAIMER:",
        ]

        cleaned_lines = [line.replace(text, "") for line in lines for text in text_to_remove]

        # Format the questions
        formatted_questions = self.format_text(cleaned_lines)

        # Print the generated questions
        for question in formatted_questions:
            print("Question:", question)

        return formatted_questions

    except Exception as e:
        print(f"Error occurred: {e}")
        return ["get_questions error occurred"]
    

def generate_questions(context_text):
    # Context for the question generation
    no_questions = 0
    unformatted_qts = []
    formatted_qts = []

    call_count = 1

    # Keep repeating until you get EXACTLY 10 questions
    while no_questions != 10:
        # Generate questions
        unformatted_qts = get_questions(context_text, call_count)
        call_count += 1

        # If list contains error messages, then break
        if "Taking too long" in unformatted_qts:
            return ["Please provide with proper keywords for context"]
            
        if "get_questions error occurred" in unformatted_qts:
            return ["An error occurred while generating questions. Please try again later."]
            

        # Format the questions properly and store each question in a list
        formatted_qts = format_text(unformatted_qts)
        no_questions = len(formatted_qts)

        if no_questions != 10:
            time.sleep(5)

    return formatted_qts
