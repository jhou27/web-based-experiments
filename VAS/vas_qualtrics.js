Qualtrics.SurveyEngine.addOnload(function () {

    /*Place your JavaScript here to run when the page loads*/

    /* Change 1: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();

    /* Change 2: Defining and loading required resources */
    var jslib_url = "https://kywch.github.io/jsPsych/";

    // the below urls must be accessible with your browser
    // for example, https://kywch.github.io/jsPsych/jspsych.js
    var requiredResources = [
        'https://cdnjs.cloudflare.com/ajax/libs/dropbox.js/4.0.30/Dropbox-sdk.min.js', // Change 6: Loading the Dropbox API
        jslib_url + "jspsych.js",
        jslib_url + "plugins/jspsych-html-keyboard-response.js"
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

    /* Change 7: Adding necessary variables and functions for saving the results */
    // experimental session-defining variables
    var task_name = "hello-world";
    var sbj_id = "${e://Field/workerId}";

    // YOU MUST GET YOUR OWN DROPBOX ACCESS TOKEN
    var dropbox_access_token = '<PUT YOUR Dropbox ACCESS TOKEN HERE>';

    // my preference is to include the task and sbj_id in the file name
    var save_filename = '/' + task_name + '/' + task_name + '_' + sbj_id;

    function save_data_json() {
        try {
            var dbx = new Dropbox.Dropbox({
                accessToken: dropbox_access_token
            });
            dbx.filesUpload({
                    path: save_filename + '.json',
                    mode: 'overwrite',
                    mute: true,
                    contents: jsPsych.data.get().json()
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.error(error);
                });
        } catch (err) {
            console.log("Save data function failed.", err);
        }
    }

    function save_data_csv() {
        try {
            var dbx = new Dropbox.Dropbox({
                accessToken: dropbox_access_token
            });
            dbx.filesUpload({
                    path: save_filename + '.csv',
                    mode: 'overwrite',
                    mute: true,
                    contents: jsPsych.data.get().csv()
                })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.error(error);
                });
        } catch (err) {
            console.log("Save data function failed.", err);
        }        
    }

    /* Change 4: Wraping jsPsych.init() in a function */
    function initExp() {

        var hello_trial = {
            type: 'html-keyboard-response',
            stimulus: 'Hello world!'
        }

        jsPsych.init({
            timeline: [hello_trial],
            display_element: 'display_stage',

            /* Change 5: Adding the clean up and continue functions.*/
            on_finish: function (data) {

                /* Change 8: Calling the save function -- CHOOSE ONE! */
                // include the participant ID in the data
                // this must be done before saving
                jsPsych.data.get().addToLast({participant: sbj_id});

                save_data_json();
                save_data_csv();

                // clear the stage
                jQuery('display_stage').remove();
                jQuery('display_stage_background').remove();

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
