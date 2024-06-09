import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown'

const Testing = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(`> Overall, you have a solid foundation in Java programming and object-oriented principles. Your experience with frameworks and libraries is also commendable. However, there are a few areas where you can potentially improve:\n> \n> * **Emotional Intelligence:** Your responses could benefit from a more positive and enthusiastic tone. Try to convey your passion for Java development and highlight your strengths with greater confidence.\n> \n> * **Succinctness:** Some of your answers are slightly verbose. Work on concisely conveying your expertise and experience while ensuring completeness.\n> \n> * **Q&A Improvement:** While your answers demonstrate your technical knowledge, they could be expanded to include more specific examples of projects or challenges you've faced. This would provide a better understanding of your practical application of Java concepts.\n> \n> * **Quantifying Accomplishments:** Consider incorporating quantifiable metrics into your answers whenever possible. This would add credibility and provide a clearer picture of the impact of your work.\n> \n> * **Career Goals:** It would be helpful to have a better understanding of your career aspirations and how your Java skills align with them. This could be addressed in future conversations.`);
  }, []);

  return (
    <div>
        <Markdown>{content}</Markdown>
    </div>
  );
};

export default Testing;