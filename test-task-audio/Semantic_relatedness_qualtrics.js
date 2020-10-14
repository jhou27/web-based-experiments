Qualtrics.SurveyEngine.addOnload(function () {

    /*Place your JavaScript here to run when the page loads*/

    /* Change 1: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();

    /* Change 2: Defining and load required resources */
    // https://cdn.jsdelivr.net/gh/<github-username>/<repository-name>/<experiment-folder>
    var task_github = "http://jhou27.github.io/web-based-experiments/test-task-audio/";

    // requiredResources must include all the JS files that demo-simple-rt-task-transformed.html uses.
    var requiredResources = [
        task_github + "jspsych-6.1.0/jspsych.js",
        task_github + "jspsych-6.1.0/plugins/jspsych-html-keyboard-response.js",
        task_github + "jspsych-6.1.0/plugins/jspsych-html-button-response.js",
        task_github + "jspsych-6.1.0/plugins/jspsych-audio-keyboard-response.js",
        task_github + "jspsych-6.1.0/plugins/jspsych-instructions.js",
        task_github + "js/practice_trial_info.js"
        task_github + "js/amb_trial_info_v1.js"
        task_github + "js/amb_trial_info_v2.js"
        task_github + "filler_trial_info.js"
        task_github + "Semantic_relatedness_main.js"
    ];

    function loadScript(idx) {
        console.log("Loading ", requiredResources[idx]);
        jQuery.getScript(requiredResources[idx], function () {
            if ((idx + 1) < requiredResources.length) {
                loadScript(idx + 1);
            } else {
                initExp();
            }
        });
    }

    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }
    
    /* Change 3: Appending the display_stage Div using jQuery */
    // jQuery is loaded in Qualtrics by default
    jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
    jQuery("<div id = 'display_stage'></div>").appendTo('body');

    /* Change 4: Wrapping jsPsych.init() in a function */
    function initExp() {
    
    jsPsych.init({
            timeline: timeline,
            display_element: 'display_stage',
            on_finish: function (data) {
                /* Change 5: Summarizing and save the results to Qualtrics */
                // summarize the results
                var data_subset = jsPsych.data.get().filter({trial_part: 'probe', condition: condition});
                var mean_rt = data_subset.select('rt').mean();
                var acc = data_subset.filter({accuracy: true}).count() / data_subset.count();
                
                // save to qualtrics embedded data
                Qualtrics.SurveyEngine.setEmbeddedData("acc", accuracy);
                Qualtrics.SurveyEngine.setEmbeddedData("mean_rt", rt);
                

                /* Change 6: Adding the clean up and continue functions.*/
                // clear the stage
                jQuery('#display_stage').remove();
                jQuery('#display_stage_background').remove();

                // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
                qthis.clickNextButton();
            }
        });
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});
