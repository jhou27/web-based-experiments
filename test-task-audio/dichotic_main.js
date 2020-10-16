var welcome_screen = {
        type: 'html-button-response',
        stimulus: '<p>Please put headphones on and make sure that the correct side is in each ear.</p>'+
          '<p>Your task is to listen to the audio and write down any words that you hear.</p>',
        choices: ['Continue']
    } 


    var audio_url = 'https://jhou27.github.io/web-based-experiments/test-task-audio/audiotest/';
    
    var timeline_variables_block_1 = [
        { sound: audio_url + "c.mp3", left: ["fall"], right: ["cat"] },
        { sound: audio_url + "d.mp3", left: ["win"], right: ["dog"] }
    ];

    var timeline_variables_block_2 = [
        { sound: audio_url + "g.mp3", right: ["cat"], left: ["fall"] },
        { sound: audio_url + "k.mp3", right: ["dog"], left: ["win"] }
    ];
    
    var audio_trial = {
        type: 'audio-keyboard-response',
        stimulus: jsPsych.timelineVariable('sound'),
        choices: jsPsych.NO_KEYS,
        trial_ends_after_audio: true
      }
     
    var response_trial = {
        type: 'survey-text',
        questions: [
          {prompt: 'Please write down any words that you heard. If you heard more than one word please separate each word with a comma.'}
        ],
        data: {
          sound: jsPsych.timelineVariable('sound'),
          phase: 'response'
        },
        on_finish: function(data){
          var subject_response = JSON.parse(data.responses).Q0;
          var lower_case_response = subject_response.toLowerCase();
          var subject_response_words = lower_case_response.split(",");
          var right_word = false;
          var left_word = false;
          for(var i=0; i<subject_response_words.length; i++){
            var word = subject_response_words[i].trim();
            if(jsPsych.timelineVariable('right', true).includes(word)){
              right_word = true;
            }
            if(jsPsych.timelineVariable('left', true).includes(word)){
              left_word = true;
            }
          }
          data.left_word_correct = left_word;
          data.right_word_correct = right_word;
        }
    }
  
      var blocks = [timeline_variables_block_1, timeline_variables_block_2];
      blocks = jsPsych.randomization.shuffle(blocks);
    
      var test_procedure_first_half = {
        timeline: [audio_trial, response_trial],
        timeline_variables: blocks[0],
        randomize_order: true
      }

      var test_procedure_second_half = {
        timeline: [audio_trial, response_trial],
        timeline_variables: blocks[1],
        randomize_order: true
      }

      var end_screen = {
        type: 'html-keyboard-response',
        stimulus: '<p>You are done!</p>',
        choices: jsPsych.NO_KEYS
      }
      
      

   

        var timeline = [];
        
        timeline.push(welcome_screen);
        timeline.push(test_procedure_first_half);
        timeline.push(test_procedure_first_half);
        timeline.push(end_screen);
