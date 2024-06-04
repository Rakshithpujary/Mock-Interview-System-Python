import google.generativeai as genai
import time

#API KEY
GOOGLE_API_KEY='AIzaSyB2DpQylxNaQLbwW0hkxSwTXi1M3OrOJyo'
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize the GenerativeModel and start a chat session
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

def gen_review(job_role,qns,ans,emotion_analysis):
  try:
    # data = job_role + qns_ans + emotion analysis
    data = "Question & Answers"

    for i in range(len(qns)):
        data += "\n Qtn " + str(i + 1) + ": " + qns[i] + "\n Ans: " + ans[i]


    data = data + "\nEmotion Analysis\n" + str(emotion_analysis)

    print("Data = ",data)

    msg = ""

    msg = f"Context = {data} \nThe above context represents the data of an interviewee.Please generate a review based on it, including an emotion analysis and qtns & ans where he/she can improve (generate the review as if you are directly addressing him/her) ( dont give best of luck or anything, only generate review)"


    # call gemini
    response = chat.send_message(msg)

    raw_text=response.text
    print("Raw Text = \n",raw_text)

    lines=raw_text.split("\n")

    # Remove specific text occurrences ( Need to change )
    text_to_remove = ["**Disclaimer:**","Note:","Note","NOTE:","NOTE","**Note:**","**NOTE:**","**Disclaimer:**","Disclaimer:","Disclaimer","DISCLAIMER","DISCLAIMER:","**Review**","*Review*","Review"]

    cleaned_lines = []
    for line in lines:
        for text in text_to_remove:
            line = line.replace(text, "")
        cleaned_lines.append(line)

    return cleaned_lines

  except Exception as e:
    print(f"Error occurred: {e}")
    return ["get_review error occured"]