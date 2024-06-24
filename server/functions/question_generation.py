import time
from flask import g

def format_text(lines):
    questions = []
    question_buffer = ""

    for line in lines:
        if line.strip():  # Check if line is not empty
            if line.startswith(tuple(str(i) for i in range(1, 11))) and (line.rstrip().endswith("?") or line.rstrip().endswith(".")):
                if question_buffer:  # If there's a question in buffer, append it
                    questions.append(question_buffer.strip())
                question_buffer = line.strip() + " "  # Start new question buffer with current line
            else:
                question_buffer += line.strip() + " "  # Append line to current question buffer

    if question_buffer:  # Append the last question if there's any remaining in buffer
        questions.append(question_buffer.strip())

    return questions

def get_questions(job_title, experience_lvl, call_count):
  try:
    # print("get_questions Instance started = "+ str(call_count))

    # print("\nJob Title = ", job_title)
    # print("\nJob experience_lvl = ", experience_lvl)
    # Check if passed job title is an valid job title
    check_valid_msg = (f"Job Title : {job_title}\n\n"
                    "Please check if this is an valid or appropriate job title given for an interview or not,"
                    "\nIMPORTANT : PLEASE FOLLOW THE BELOW RULES\n"
                    "RULE : If not valid then only return 'invalid', DONT WRITE ANYTHING ELSE\n"
                    "RULE : If valid then only return 'valid', DONT WRITE ANYTHING ELSE\n"
                    "RULE : Please assume proper or appropriate spelling if any spelling mistake is present in the passed job title")

    # check_valid_response = g.chat.send_message(check_valid_msg)

    check_valid_response = g.model.generate_content([check_valid_msg])
    checkValid = check_valid_response.text.lower()
    # print("\nCheck valid = ", checkValid)

    keywords = ["invalid", "no", "not", "not valid", "inappropriate"]
    
    if any(keyword in checkValid for keyword in keywords):
        return "Please provide a valid job title."

    msg = ""
    if call_count <= 3:
        msg = (f"Job Title: {job_title}\nExperience level: {experience_lvl}\n\n"
            "Generate 5 questions that would be asked in an interview based on the job title and experience level provided."
            "\nIMPORTANT : PLEASE FOLLOW THE BELOW RULES\n"
            "RULE : Write only the questions, DONT WRITE ANYTHING ELSE\n"
            "RULE : include question numbers in the begining of each question\n"
            "RULE : DONT WRITE ANYTHING EXTRA EXCEPT THE QUESTIONS, NOT EVEN THE TITLE")

    elif 2 >= call_count <= 7:
        msg = (f"Job Title: {job_title}\nExperience level: {experience_lvl}\n\n"
            "Generate exactly 5 questions that would be asked in an interview based on the job title and experience level provided."
            "\nIMPORTANT : PLEASE FOLLOW THE BELOW RULES\n"
            "RULE : Write only the questions, DONT WRITE ANYTHING ELSE\n"
            "RULE : include question numbers in the begining of each question\n"
            "RULE : Please Do not include any additional text other than the questions.\n"
            "RULE : DONT WRITE ANYTHING EXTRA EXCEPT THE QUESTIONS, NOT EVEN THE TITLE")

    else:
        return "Something went wrong. Please try again."

    # response = g.chat.send_message(msg)

    response = g.model.generate_content([msg])
    raw_text=response.text
    # print("Raw Text = \n",raw_text)

    lines=raw_text.split("\n")

    # Remove specific text occurrences ( Need to change )
    text_to_remove = ["**Disclaimer:**","MCQs:","**MCQs:**","MCQ","Note:","Note","NOTE:","NOTE","**Note:**","**NOTE:**","**Disclaimer:**","Disclaimer:","Disclaimer",
                      "DISCLAIMER","DISCLAIMER:","These MCQs are for illustrative purposes only and should not be considered accurate or up-to-date. For the most current information, please refer to reputable news sources.",
                      "They also allow the interviewer to gauge the candidate's enthusiasm for the position and the company.",
                      "**Job Title: developer**","Job Title: developer"]

    cleaned_lines = []
    for line in lines:
        for text in text_to_remove:
            line = line.replace(text, "")
        cleaned_lines.append(line)

    return cleaned_lines
  except Exception as e:
    print(f"Error occurred: {e}")
    return "Something went wrong, Please try again."

def generate_questions(job_title, experience_lvl):

    no_questions = 0
    unformatted_qts = []
    formatted_qts = []

    call_count = 1

    # keep repeating untill u get EXACTLY 5 questions
    while no_questions != 5:

        # generate questions
        unformatted_qts=get_questions(job_title, experience_lvl, call_count)
        call_count += 1

        if not isinstance(unformatted_qts, list):
            return unformatted_qts

        # format the questions properly and store each questions in list
        formatted_qts = format_text(unformatted_qts)
        no_questions = len(formatted_qts)

        # print("Length = ",no_questions)
        if no_questions != 5:
            time.sleep(5)

    # for question in formatted_qts:
    #     print("one question = ",question)

    return formatted_qts
