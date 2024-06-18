from flask import g
import textwrap

def to_markdown(text):
    text = text.replace('•', '  *')
    return textwrap.indent(text, '> ', predicate=lambda _: True)

def gen_review(job_role,qns,ans,emotion_analysis):
    # data = job_role + qns_ans + emotion analysis

    data = "Job Role: " + job_role
    # data += "Experience level: " + experience_lvl
    data += "Question & Answers:"

    for i in range(len(qns)):
        data += "\n Qtn " + str(i + 1) + ": " + qns[i] + "\n Ans: " + ans[i]

    data = data + "\nEmotion Analysis:\n" + str(emotion_analysis)

    print("\nData = ",data)

    msg = (
        f"Context = {data} \n"
        "The above context represents the data of an interviewee. "
        "Please write a review in 250 words for him/her, including an emotion analysis and questions & answers where he/she can improve."
        "\nIMPORTANT : PLEASE FOLLOW THE BELOW RULES\n"
        "RULE 1: write the review as if you are directly TALKING WITH HIM/HER."
        "RULE 2: don't write anything extra, only write the review."
        "RULE 3: dont include any main headings such as 'review' etc"
    )

    # response = g.chat.send_message(msg)

    # call gemini
    response = g.model.generate_content([msg])
    raw_text=response.text

    final_text = to_markdown(raw_text)

    return final_text