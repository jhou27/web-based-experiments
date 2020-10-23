var timeline = [];

var repeat_noise = false;
var welcome = {
      type: "html-button-response",
      stimulus: 'You must be wearing headphones to do this task.</br>'+
              'First, set your device volume to about 25% of maximum.</br>',
      choices: ['Continue']
    };
timeline.push(welcome);

var play_noise = {
    type:'audio-button-response',
    prompt: "<p>Press <strong>Play</strong>, then turn up the volume on your device.</br>"+
            "Play the sound as many times as you like, "+
            "until the calibration noise is at a loud but comfortable level.</br>"+
            "Press <strong>Next</strong> when you reach a comfortable sound level.",
    stimulus: 'noise_calib_stim.wav',
    choices: ['Play','Next'],
   };

var play_1 = {
    timeline:[play_noise],
    //type: 'audio-keyboard-with-replay',
    //type:'audio-button-response',
    //stimulus: 'noise_calib_stim.wav',
    //choices: ['Replay','Next'],
    loop_function: function(){
      var data = jsPsych.data.get().last(1).values()[0];
      //var response = jsPsych.data.get();
      if(data.button_pressed == 0){
        return play_noise;
      //  var stim = new Audio('noise_calib_stim.wav');
       // stimulus: 'noise_calib_stim.wav'
      // stim.play();
      } else {
        return false;
      }
    }
  }  
  
timeline.push(play_1);
  
  var test_stimuli = [
      { stimulus: "antiphase_HC_IOS.wav", data: {correct_response: 'Third' } },
      { stimulus: "antiphase_HC_ISO.wav", data: {correct_response: 'Second' } },
      { stimulus: "antiphase_HC_OIS.wav", data: {correct_response: 'Third' } },
      { stimulus: "antiphase_HC_OSI.wav", data: {correct_response: 'Second' } },
      { stimulus: "antiphase_HC_SIO.wav", data: {correct_response: 'First' } },
      { stimulus: "antiphase_HC_SOI.wav", data: {correct_response: 'First' } }
    ];
    
  var instruction = {
      type: "html-button-response",
      stimulus: '<p>In the following test, you will hear three sounds separated by silences.</br></p>'+
              '<p>Simply judge WHICH SOUND IS SOFTEST (quietest) -- First, Second, or Third?</br></p>'+
              '<p>These sounds will only be played once!</br></p>'+
              'If you are ready, please press',
      choices: ['Continue']
    };
//timeline.push(instruction);
    
  var audio_trial = {
        type: 'audio-keyboard-response',
        prompt: "<div id=centerbox>" +
                "<p>Which sound is the softest?</p>",
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: jsPsych.NO_KEYS,
        trial_ends_after_audio: true,
      };
      
  var response_trial = {
        type:'survey-multi-choice',
    questions: [
      {prompt: "Which sound is the softest?", options: ["First", "Second","Third",
          ], required:true},
        ],
        data: jsPsych.timelineVariable('data'),
        on_finish: function(data) {
            var choice = JSON.parse(data.responses).Q0;
            var acc = false;
            if (choice == data.correct_response){
                    acc = true;
                }
                data.accuracy = acc;
            }
        };
      
  var blocks = [test_stimuli];
      blocks = jsPsych.randomization.shuffle(blocks);
      
  var test_procedure = {
        timeline: [audio_trial, response_trial],
       //timeline:[audio_trial],
        timeline_variables: blocks[0],
        randomize_order: true,
        }
       
 // timeline.push(test_procedure);
  
  var repeat_prac_message = {
      type: 'html-button-response',
      stimulus: '<p>You did not make enough correct responses to continue.</br></p>'+
                '<p>You must be wearting headphones to best hear these sounds!</br></p>'+
                '<p>Now you will have a chance to repeat the instructions and go through the test again.</p>',
      choices: ['Next']
      };

  var repeat_prac_conditional = {
      timeline: [repeat_prac_message],
      conditional_function: function() {
          var last_prac_trials = jsPsych.data.get().last(test_stimuli.length);
          var n_correct = last_prac_trials.filter({accuracy: true}).count();
          var prop_corr = n_correct/test_stimuli.length;
            if (prop_corr < 0.6) {
                    repeat_prac = true;
                    return true;
                } else {
                    repeat_prac = false;
                    return false;
                }
            }
      }

  var instructions_prac_loop = {
      timeline: [instruction, test_procedure, repeat_prac_conditional],
      loop_function: function() {
          if (repeat_prac == true) {
                    return true;
                } else {
                    return false;
                }
            }
        }
  
  timeline.push(instructions_prac_loop);
    
    

  jsPsych.init({
      timeline: timeline,
      //on_finish: function() {
      //  jsPsych.data.displayData();
     // }
    });
