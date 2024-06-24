from flask import g
import textwrap

def to_markdown(text):
    text = text.replace('•', '  *')
    return textwrap.indent(text, '> ', predicate=lambda _: True)

def gen_review(job_role, qns, ans, emotion_analysis, suspiciousCount):
    # data = job_role + qns_ans + emotion analysis

    data = "Job Role: " + job_role
    # data += "Experience level: " + experience_lvl
    data += "Question & Answers:"

    for i in range(len(qns)):
        data += "\n Qtn " + str(i + 1) + ": " + qns[i] + "\n Ans: " + ans[i]

    data += "\nEmotion Analysis:\n" + str(emotion_analysis)
    data += "\nSuspicious Activity detected " + str(suspiciousCount) + " times while giving online mock interview."

    # print("\nData = ",data)

    msg = (
        f"Context = {data} \n"
        "The above context represents the data of an interviewee. "
        "Please write a 500-700 word review neatly for him/her, providing suggestions for areas of improvement based on the above context."
        "\nIMPORTANT : PLEASE FOLLOW THE BELOW RULES\n"
        "RULE 1: Write the review as if you are directly TALKING WITH HIM/HER."
        # "RULE 2: Be polite, but DONT use fake data or assumptions for review generation."
        "RULE 2: Don't write anything extra, only write the review."
        "RULE 3: Dont include any main headings such as 'review', use side-headings for explaining."
        "RULE 4: If emotion analysis data is present then USE that for review also."
        "RULE 5: This review is for an interview given in an website where anyone take mock interviews,"
        "so write review based on that, but dont tell hi,thank u and all."
        "RULE 6: Dont use/assume or write fake data which is not in context for review."
        "RULE 7: If suspicious activiyt is detected more than 3 times, "
        "then also tell how to ensure things such as cameras are working proper and not to change tabs in online interviews "
        "and also tell that the interviewers might assume it as malpractice"
    )

    # response = g.chat.send_message(msg)

    # call gemini
    response = g.model.generate_content([msg])
    raw_text=response.text

    final_text = to_markdown(raw_text)

    return final_text