import React from 'react';
import '../css/InterviewPage.css';

function InterviewPage() {

  return (
    <div className='interview-div'>
        <div className='videoDisplay-div'>
            video...........
        </div>
        <div className='questionDisplay-div'>
            Question...........
        </div>
        
        <div className='answerDisplay-div'>
            Answer............
        </div>
        <div className='buttonDisplay-div'>
            <button className='AnsawerNowButton'>Record now</button>
            <button className='ReRecordButton'>Re-record</button>
            <button className='SkipNextButton'>Skip / Next</button>
            <button className='SubmitButton'>Submit</button>
        </div>
    
    </div>
  );
}

export default InterviewPage;
