import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'

const Testing = () => {

  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(`> You have a solid understanding of Java programming and its principles. Your experience in core Java concepts, advanced features, and object-oriented programming principles is commendable. Your approach to designing and implementing a Java application is well-structured, and your proficiency in Java frameworks and libraries is impressive. You have successfully overcome technical obstacles and delivered successful solutions in challenging Java development projects.\n> \n> **Emotion Analysis:**\n> \n> Your responses exhibit a balanced emotional state. While you express some frustration and disappointment in certain situations, you quickly recover and maintain a positive outlook. Your ability to regulate your emotions is a valuable asset in a fast-paced and demanding work environment. \n> \n> **Questions & Answers for Improvement:**\n> \n> * **Q:** How do you stay updated with the latest advancements and best practices in Java programming?\n> * **A:** Besides attending conferences and workshops, I subscribe to technical blogs and forums and actively participate in online communities to stay abreast of the latest trends and best practices in Java programming.\n> \n> * **Q:** How do you handle working on multiple projects simultaneously, and how do you prioritize tasks effectively?\n> * **A:** I use project management tools and techniques to organize my work and track my progress. I also collaborate closely with my team to ensure that tasks are prioritized and completed efficiently.\n> \n> * **Q:** How do you implement code reviews and testing in your development process, and how do you ensure code quality?\n> * **A:** I follow a rigorous code review process involving peer reviews and automated testing. I utilize unit testing, integration testing, and performance testing to ensure the quality and reliability of my code.\n> \n> * **Q:** How do you approach debugging and troubleshooting complex Java applications?\n> * **A:** I use a combination of logging, debugging tools, and code analysis to identify and resolve issues in complex Java applications. I also leverage the support of my team and the Java community to seek assistance when needed.\n> \n> * **Q:** How do you stay motivated and engaged in your work, especially during challenging times?\n> * **A:** I maintain a positive attitude and focus on the impact of my work. I actively seek out opportunities for growth and learning, and I am supported by a great team and mentors who provide guidance and encouragement.`);
  }, []);

  return (
    <div>
        <Markdown>{content}</Markdown>
    </div>
  );
};

export default Testing;
