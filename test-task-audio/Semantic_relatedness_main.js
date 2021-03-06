  // Use JSDELIVR to get the files from a GitHub repository
  // https://cdn.jsdelivr.net/gh/<github-username>/<repository-name>/
  // var repo_site = "https://jhou27.github.io/web-based-experiments/test-task-audio/";

   
   /* experiment parameters */

        var timeline = [];
        var repeat_prac = false;

        // randomly choose a version: 1 or 2
        var version = jsPsych.randomization.sampleWithoutReplacement([1,2],1)[0];

        // get the trial info for this version
        var amb_trial_info;
        if (version == 1) {
            amb_trial_info = amb_trial_info_v1;
        } else {
            amb_trial_info = amb_trial_info_v2;
        }
        
        // combine ambiguous and filler trial info arrays into a single array to use for timeline variables
        var main_trial_info = amb_trial_info.concat(filler_trial_info);
        console.log(main_trial_info);

        // create list of all audio files for preloading
        var all_audio = [];
        for (var i=0; i<practice_trial_info.length; i++) {
            all_audio.push(practice_trial_info[i].target_audio);
        }
        for (var i=0; i<main_trial_info.length; i++) {
            all_audio.push(main_trial_info[i].target_audio);
        }

        var instructions = {
            type: 'instructions',
            pages: [
                '<p>In this task, you will hear a spoken word, and then see a written word.</p>'+
                '<p>You should press the <strong>j</strong> key if the meanings of the two words are <strong>related</strong>.</p>'+
                '<p>You should press the <strong>f</strong> key if the meanings of the two words are <strong>unrelated</strong>.</p>'+
                '<p>Click the "Next" button for more instructions.</p>',
                '<p>Here are some examples of words with <strong>related</strong> meanings:</p>'+
                '<p>WATER - SWIM</p><p>PETAL - FLOWER</p>'+
                '<p>In these examples, you would press the <strong>j</strong> key.</p>'+
                '<p>Here are some examples of words with <strong>unrelated</strong> meanings:'+
                '<p>APPLE - FANCY</p><p>JUMP - GARAGE</p>'+
                '<p>In these examples, you would press the <strong>f</strong> key.</p>'+
                '<p>Click the "Next" button to start.</p>'
            ],
            show_clickable_nav: true,
            post_trial_gap: 1000
        };

        var fixation = {
            type: 'html-keyboard-response',
            stimulus: '<span style="font-size:40px;">+</span>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 500,
            data: {
                trial_part: 'fixation', 
                task_part: jsPsych.timelineVariable('task_part')
            }
        };

        var target = {
            type: 'audio-keyboard-response',
            stimulus: jsPsych.timelineVariable('target_audio'),
            prompt: '<span style="font-size:40px;">+</span>',
            choices: jsPsych.NO_KEYS,
            trial_ends_after_audio: true,
            data: {
                target: jsPsych.timelineVariable('target'),
                probe: jsPsych.timelineVariable('probe'),
                condition: jsPsych.timelineVariable('condition'),
                correct_response: jsPsych.timelineVariable('correct_response'),
                trial_part: 'target',
                task_part: jsPsych.timelineVariable('task_part')
            }
        }; 

        var probe = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<span style="font-size:40px;">' + jsPsych.timelineVariable('probe', true) + '</span>';
            },
            choices: ['f','j'],
            post_trial_gap: 500,
            data: {
                target: jsPsych.timelineVariable('target'),
                probe: jsPsych.timelineVariable('probe'),
                condition: jsPsych.timelineVariable('condition'),
                correct_response: jsPsych.timelineVariable('correct_response'),
                trial_part: 'probe',
                task_part: jsPsych.timelineVariable('task_part')
            }, 
            on_finish: function(data) {
                var acc = false;
                if (data.correct_response == jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(data.key_press)) {
                    acc = true;
                }
                data.accuracy = acc;
            }
        };

        var feedback = {
            type: 'html-keyboard-response',
            stimulus: function() {
                var feedback_text = '<span style="color:red;font-size:30px;">Incorrect.</span>';
                var last_resp_acc = jsPsych.data.getLastTrialData().values()[0].accuracy;
                if (last_resp_acc == true) {
                    feedback_text = '<span style="color:green;font-size:30px;">Correct!</span>'
                }
                return feedback_text;
            },
            choices: jsPsych.NO_KEYS,
            trial_duration: 2000
        };

        var prac_procedure = {
            timeline: [fixation, target, probe, feedback],
            timeline_variables: practice_trial_info,
            randomize_order: true
        };

        var repeat_prac_message = {
            type: 'html-button-response',
            stimulus: '<p>You did not make enough correct responses to continue.</p>'+
                      '<p>Now you will have a chance to repeat the instructions and practice trials again.</p>',
            choices: ['Next']
        };

        var repeat_prac_conditional = {
            timeline: [repeat_prac_message],
            conditional_function: function() {
                var last_prac_trials = jsPsych.data.get().filter({trial_part:'probe'}).last(practice_trial_info.length);
                var n_correct = last_prac_trials.filter({accuracy: true}).count();
                var prop_corr = n_correct/practice_trial_info.length;
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
            timeline: [instructions, prac_procedure, repeat_prac_conditional],
            loop_function: function() {
                if (repeat_prac == true) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        timeline.push(instructions_prac_loop);

        var start_task = {
            type: 'html-button-response',
            stimulus: "<p>Great, you're ready to start the main task.</p>"+
                "<p>You will no longer see feedback about your responses.</p><p>Click the 'Next' button to start.</p>",
            choices: ['Next'],
            post_trial_gap: 1000
        };
        timeline.push(start_task);

        var main_procedure = {
            timeline: [fixation, target, probe],
            timeline_variables: main_trial_info,
            randomize_order: true
        };
        timeline.push(main_procedure);

        // helper function for getting the mean RT and accuracy from different condtions
        // and generating the feedback text
        function generate_feedback_string(condition, condition_title) {
            var data_subset = jsPsych.data.get().filter({trial_part: 'probe', condition: condition});
            var mean_rt = data_subset.select('rt').mean();
            var acc = data_subset.filter({accuracy: true}).count() / data_subset.count();
            return '<p><u>' + condition_title + '</u><br>Accuracy: ' + Math.round(acc*100) + '%<br>Mean RT: ' + Math.round(mean_rt) + ' ms</p>';
        }

        var performance_summary = {
            type: 'html-keyboard-response',
            stimulus: function() {
                var feedback_string = "<p>Great! You're done with that task.</p>";
                feedback_string += generate_feedback_string('dom', 'Dominant-Related Word Pairs');
                feedback_string += generate_feedback_string('sub', 'Subordinate-Related Word Pairs');
                feedback_string += generate_feedback_string('fil', 'Unrelated Word Pairs');
                feedback_string += '<p>Press the space bar to finish.</p>'
                return feedback_string;
            }, 
            choices: ['space']
        };
        timeline.push(performance_summary);

        
