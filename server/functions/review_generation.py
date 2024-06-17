import google.generativeai as genai
from flask import g
import textwrap

def to_markdown(text):
    text = text.replace('•', '  *')
    return textwrap.indent(text, '> ', predicate=lambda _: True)

def gen_review(job_role,qns,ans,emotion_analysis):
    # data = job_role + qns_ans + emotion analysis
    data = "Question & Answers:"

    for i in range(len(qns)):
        data += "\n Qtn " + str(i + 1) + ": " + qns[i] + "\n Ans: " + ans[i]

    data = data + "\nEmotion Analysis:\n" + str(emotion_analysis)

    # print("\nData = ",data)

    msg = (
        f"Context = {data} \n"
        "The above context represents the data of an interviewee. "
        "Please write a review in 250 words for him/her, including an emotion analysis and questions & answers where he/she can improve. "
        "IMPORTANT: write the review as if you are directly TALKING WITH HIM/HER. "
        "IMPORTANT: don't write anything extra, only write the review."
        "IMPORTANT: dont include any main headings such as 'review'"
    )

    # call gemini
    response = g.chat.send_message(msg)

    raw_text=response.text
    
    final_text = to_markdown(raw_text)

    return final_text