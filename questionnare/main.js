var timeline = [];

var fullscreen_trial = {
    type: 'fullscreen',
    fullscreen_mode: true
  }

var instructions = {
    type: 'html-button-response',
    stimulus: '<p>This survey consists of 14 questions concerning your demongraphic, languaage and music backgrounds.</p>'+
      '<p>All information in this survey is strictly confidential and connected ONLY to your participant number.</p>'+
      '<p>No information collected from this survey will be released or published in any way that could identify you.</p>',
      //'<p>.</p><p>Press N if the letters do not form a valid word.</p>',
    choices: ['Ready to start']
  }

timeline.push(instructions);


//timeline.push(fullscreen_trial);

	var trial_1 = {
		type: 'survey-text',
    questions: [
	  {prompt: 'Please enter your year of birth.', placeholder: 'e.g. 1990', columns: 20, name: 'birthyr',required:true}
    ]
  };

 // timeline.push(trial_1);

  var trial_2 = {
    type:'survey-multi-choice',
    questions: [
      {prompt: "How would you describe your gender identity?", name: 'gender', options: ["Male", "Female","Non-binary","Other","Prefer not to say"], required:true},    
    ],
      on_finish: function(data){
        // get the data from the previous trial,
        // and check which key was pressed
        var word = JSON.parse(data.responses);
        //var data = jsPsych.data.get().last(1).values()[0];
        if(word.gender == 'Other'){
          //return data.gender;
          data.correct = true; // can add property correct by modify data object directly
          var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
             if(last_trial_correct){
                  // return "<p>Correct!</p>";
                  var other = prompt('If Other, please specify:')
                  data.other = other;
                  }
             } else {
          //return word.gender;
          data.correct = false;
         }
      }
    };
   
  //timeline.push(trial_2);

  var trial_3 = {
    type:'survey-multi-choice',
    questions: [
      {prompt: "How would you describe your race?", name: 'race', options: ["African American/Black", "Asian","Hispanic/Latino","Middle Eastern/Arab",
          "Native American/American Indian","Native Hawaiian/Pacific Islander","South Asian/Indian","White/European/Caucasian",
          "Other"], required:true},
        ],
      on_finish: function(data){
        // get the data from the previous trial,
        // and check which key was pressed
        var word = JSON.parse(data.responses);
        //var data = jsPsych.data.get().last(1).values()[0];
        if(word.race == 'Other'){
          //return data.gender;
          data.correct = true; // can add property correct by modify data object directly
          var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
             if(last_trial_correct){
                  // return "<p>Correct!</p>";
                  var other = prompt('If Other, please specify:')
                  data.other = other;
                  }
             } else {
          //return word.gender;
          data.correct = false;
         }
      }
    };
    
  //timeline.push(trial_3);
  
  var trial_4 = {
		type: 'survey-text',
    questions: [
	  {prompt: 'Where did you grow up during the first 12 years of your life?', placeholder: 'city, country', columns: 50, name: 'growupplace',required:true}
    ]
  };
  
  //timeline.push(trial_4);
  
  var trial_5 = {
		type: 'survey-text',
    questions: [
	  {prompt: 'Where do you reside currently?', placeholder: 'city, country', columns: 50, name: 'residency',required:true}
    ]
  };
    
  //timeline.push(trial_5);

  var trial_6 = {
    type: 'survey-text',
    questions: [
      {prompt: 'What is/are your native language(s)?', placeholder: 'English, Spanish etc', columns: 50, name: 'nativelang',required:true}
    ]
  };
  
  //timeline.push(trial_6);
  
  var trial_7 = {
    type:'survey-multi-choice',
    questions: [
      {prompt: "What language do you use the most now?", name: 'languse', options: ["English","Other"], required:true},
        ],
      on_finish: function(data){
        // get the data from the previous trial,
        // and check which key was pressed
        var word = JSON.parse(data.responses);
        //var data = jsPsych.data.get().last(1).values()[0];
        if(word.languse == 'Other'){
          //return data.gender;
          data.correct = true; // can add property correct by modify data object directly
          var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
             if(last_trial_correct){
                  // return "<p>Correct!</p>";
                  var other = prompt('If Other, please specify:')
                  data.other = other;
                  }
             } else {
          //return word.gender;
          data.correct = false;
         }
      }
    };

 //timeline.push(trial_7);

  var trial_8 = {
    type: 'survey-text',
    questions: [
      {prompt: 'Please list all languages that you can LISTEN to,</br>' + 
      'the level of proficiency on a scale from 1 (not proficient) to 7 (very proficient),</br>' + 
      'and the age at which you began learning the language.' 
      , placeholder: 'e.g. English, 7, from birth; Spanish, 5, age 10', columns: 50, name: 'l2listen',required:true}
    ]
  };

  //timeline.push(trial_8);

  var trial_9 = {
    type: 'survey-text',
    questions: [
      {prompt: 'Please list all languages that you can SPEAK,</br>' +
      'the level of proficiency on a scale from 1 (not proficient) to 7 (very proficient),</br>'+ 
      'and the age at which you began learning the language.' 
      , placeholder: 'e.g. English, 7, from birth; Spanish, 5, age 10', columns: 50, name: 'l2speak',required:true}
    ]
  };

 // timeline.push(trial_9);

  var trial_10 = {
    type:'survey-multi-select',
    questions: [
      {prompt: "Do you have any difficuly with the following? (select all that apply)", options: ["Talking", "Finding words","Understanding speech","Hearing",
      "Writing","Reading","None of the above"], name: 'disorder',required:true},    
    ],
  };
   
 // timeline.push(trial_10);
 
 var trial_11 = {
    type:'survey-multi-choice',
    questions: [
      {prompt: "Are you left-handed or right-handed?", name: 'handedness', options: ["Right-handed", "Left-handed","Comfortable with both"], required:true},    
    ],
 };
 
// timeline.push(trial_11);

  var trial_12 = {
    type:'survey-multi-choice',
    questions: [
      {prompt: 'Have you ever had any music lessons (e.g. private or group music lessons),</br>' + 
      'and/or do you practice an instrument on your own?', name: 'music', options: ["Yes","No"], required:true},
        ],
  };
 // timeline.push(trial_12);

  var trial_13 = {
    type: 'survey-text',
    questions:[
    {prompt:'If you answered YES to the above question,</br>'+
           'please state the instrument(s) studied.', placeholder: 'e.g. piano, violin etc', columns: 50, required: false, name: 'musicinstrument'},
    {prompt: 'Please state the year(s) you were enrolled in the lesson/practice.', placeholder: 'e.g. piano, 10 years; violin, 7 years', columns: 50, required: false, name: 'musicyears'},
    {prompt: 'Please rate your proficiency on a scale from 1 (not proficient) to 7 (extremely proficient/professional).', placeholder: 'e.g. piano, 7; violin, 5 etc', columns: 50, required: false, name: 'musicproficiency'},
    {prompt: 'Please state the age at which you started music lessons/practices.', placeholder: 'e.g. piano, age 10; violin, age 13', columns: 50, required: false, name: 'musicage'},
    ]
  };

 // timeline.push(trial_13);

  var trial_14 = {
    type:'survey-multi-choice',
    questions: [
      {prompt: 'Can you read music?', name: 'musicread', options: ["Yes","Somewhat","No"], required:true},
      ],
  };
 // timeline.push(trial_14);
 
 jsPsych.init({
    timeline: timeline,
    //show_progress_bar: true,
    
    //on_finish: function(){ jsPsych.data.displayData(); 
    //  }
	});
