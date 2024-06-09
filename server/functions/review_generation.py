import google.generativeai as genai
from flask import g

def gen_review(job_role,qns,ans,emotion_analysis):
    # data = job_role + qns_ans + emotion analysis
    data = "Question & Answers:"

    for i in range(len(qns)):
        data += "\n Qtn " + str(i + 1) + ": " + qns[i] + "\n Ans: " + ans[i]


    data = data + "\nEmotion Analysis:\n" + str(emotion_analysis)

    print("\nData = ",data)

    msg = ""

    msg = f"Context = {data} \nThe above context represents the data of an interviewee.Please write a review for him/her,", 
    "including an emotion analysis and qtns & ans where he/she can improve",
    "IMPORTANT: write the review as if you are directly TALKING WITH HIM/HER",
    "IMPORTANT: dont write anything extra, only write the review"

    # call gemini
    response = g.chat.send_message(msg)

    raw_text=response.text
    print("\nRaw Text = \n",raw_text)

    lines=raw_text.split("\n")

    # Remove specific text occurrences ( Need to change )
    text_to_remove = ["*","**:**","**Disclaimer:**","Note:","Note","NOTE:","NOTE","**Note:**","**NOTE:**","**Disclaimer:**","Disclaimer:","Disclaimer","DISCLAIMER","DISCLAIMER:"]

    cleaned_lines = []
    for line in lines:
        for text in text_to_remove:
            line = line.replace(text, "")
        cleaned_lines.append(line)

    # Join all the cleaned lines into a single string
    final_text = " ".join(cleaned_lines)

    return final_text