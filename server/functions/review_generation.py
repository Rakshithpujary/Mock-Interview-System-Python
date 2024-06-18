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
        "RULE 1: Write the review as if you are directly TALKING WITH HIM/HER."
        "RULE 2: Be Polite even if his/her performance is not good, tell him/her where to improve."
        "RULE 3: Even if the performance is good, tell him/her where to improve."
        "RULE 4: Don't write anything extra, only write the review."
        "RULE 5: Dont include any main headings such as 'review' etc"
        "RULE 6: If emotion analysis data is present then use that for review also."
        "RULE 7: This review is for an interview given in an website where anyone take mock interviews,"
        "so write review based on that, but dont tell hi,thank u and all."
        "RULE 8: Dont use/assume or write fake data which is not in context for review."
    )

    # response = g.chat.send_message(msg)

    # call gemini
    response = g.model.generate_content([msg])
    raw_text=response.text

    final_text = to_markdown(raw_text)

    return final_text