Qualtrics.SurveyEngine.addOnload(function () {

    /*Place your JavaScript here to run when the page loads*/

    /* PLEASE CHECK:
        TO RUN THIS SCRIPT PROPERLY, THE EMBEDDED VARIABLES 
            *** mood, mood_script_order, mood_spent_time ***
        MUST BE DEFINED.
    /*

    /* Change 1: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();

    /* Change 2: Defining and load required resources */
    // task-related variables
    var flag_debug = true;
    var time_unit = 1000; // ms
    var mood_spent_time = '';
    var script_order = '';

    // requiredResources must include all the required JS files
    var task_github = "https://kywch.github.io/Mood-Induction_jsPsych/"; // https://<your-github-username>.github.io/<your-experiment-name>
    var requiredResources = [
        task_github + "jspsych-6.1.0/jspsych.js",
        task_github + "jspsych-6.1.0/plugins/jspsych-fullscreen.js",
        task_github + "jspsych-mood-induction.js"
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

    /* Change 4: Adding resouces, scripts, and helper functions */
    var mood_music = {
        happy: task_github + 'music/Mazurka_HappyMIP.mp3', // happy
        angry: task_github + 'music/NightOnBaldMountain_AngerMIP.mp3', // angry
        fear: task_github + 'music/PsychoTheme_FearMIP.mp3', // fear
        sad: task_github + 'music/ChopinOpus28no6_SadMIP.mp3', // sad
        neutral: task_github + 'music/ChopinWaltz11_NeutralMIP.mp3' // neutral
    };
    var mood_scripts = {};

    mood_scripts['happy'] = [ // happy
        "You just got a new job, and it's even better than you expected.",
        "You wake up on a Saturday after a number of wintry-cold rainy days, and the temperature is in the high sixties.",
        "You buy a lottery ticket and you win $100.00 instantly.",
        "You and a friend go to a nice restaurant. The meal, the conversation and the atmosphere are all perfect.",
        "You get out of class or work early. It’s a beautiful day and you and some friends go out for ice cream.",
        "You spend a day in the mountains; the air is clean and sharp, the day sunny, and you take a swim in a beautiful lake.",
        "You unexpectedly run into someone you like. You go for coffee and have a great conversation. You discover you think alike, and share many of the same interests.",
        "It’s your birthday and friends throw you a terrific surprise party."
    ];

    mood_scripts['angry'] = [ // angry
        "A student stole the exam in an important course you’re taking. The teacher takes it out on everyone by making such a tough exam that you get a very low grade even though you understood the material.",
        "A friend of yours was assaulted by a convicted rapist just released on parole.",
        "Your boss decides to promote another employee who is related to him to a position he knew you wanted. He tells you that you didn’t work hard enough, even though he knows you worked much harder and better than his relative.",
        "It’s a very hot day, and you have been standing in a long, slow line at the Department of Motor Vehicles for over an hour. Kids are screaming all around you when two of the four clerks close their windows for no apparent reason.",
        "Someone put a big scratch in your car while it was parked in the lot and didn’t even bother to leave a note.",
        "The landlord doesn’t like you and has been accusing you of unsanitary conditions, even though you keep your apartment very clean. You arrive home only to see an eviction notice on your door.",
        "Somebody files false legal claim against you.",
        "You have had a long, busy day and the person you live with starts to complain about how you forgot to do something that you forgot to do."
    ]

    mood_scripts['fear'] = [ // fear
        "You are riding alone in an elevator when a man walks in and pulls out a knife. He stares at you without saying what he wants.",
        "You’re in an overcrowded carriage at the top of a ferris wheel when the mechanism malfunctions and the wheel jams. A thunder storm is developing, and the wheel sways in the wind, it’s metal creaking.",
        "Your car breaks down on a back street in a dangerous part of the city. You start to go for help when you see several teenage boys walking toward you carrying weapons.",
        "You are driving down an unfamiliar road on a stormy night when your car skids out of control.",
        "You are driving down the road when a tractor trailer in the opposite direction crosses over into your lane.",
        "You’re in your your bedroom late at night when you hear someone enter your apartment. No one else you know has a key.",
        "You’re swimming in a dark lake and something big, slimy, and prickly brushes against your leg.",
        "You’re having a nightmare about someone chasing you and you fall into a bottomless pit. You start to scream in your sleep."
    ];

    mood_scripts['sad'] = [ // sad
        "You read in the newspaper that a teacher you used to house-sit for recently passed away.",
        "You are told by a young relative that she has cancer and only six months to live.",
        "You have been dating someone and thought it looked quite promising, when the person calls you up and tells you he/she doesn’t want to see you anymore.",
        "A pet you were really fond of has died.",
        "Your best friend just got married and is moving far away from you.",
        "No one remembers your birthday.",
        "A relative of yours, with whom you’ve shared a close relationship, has been diagnosed as having cancer and has only a short time to live.",
        "A beloved pet dies of old age. You have very fond memories of your pet and are reminded of them every time you see a similar breed."
    ];

    mood_scripts['neutral'] = [ // neutral
        "You get up in the morning, get dressed and have your usual breakfast.",
        "You go to the supermarket and get a week’s worth of groceries. You unload the bags from the car and put the food away.",
        "It is the evening and you are feeling tired. You have a long bath, wash your hair, and watch some television.",
        "You decide to clean your kitchen, and spend some time wiping down the counter tops and sweeping the floor.",
        "As you are driving you notice you are low on gas. You fill up your car from a nearby gas station and buy a drink while you are there.",
        "You go to a restaurant and order a starter and a main course. You have a glass of water with your meal.",
        "Whilst going for a walk you meet someone you know. You chat about the weather and your plans for the weekend.",
        "You and some friends go to your local cinema and watch a film. After it is finished you go home."
    ];

    function generate_mood_induction(mood = 'happy') {

        if (mood_music[mood] === undefined) {
            throw 'Undefined mood was entered.';
        }

        var pages = [];
        pages.push({
            prompt: '<div id=centerbox>Please listen to the music for a minute.</div>',
            duration: 60 * time_unit
        });
        let order = jsPsych.randomization.shuffle([...Array(mood_scripts[mood].length).keys()])
        for (let ii of order) {
            pages.push({
                prompt: "<div id=centerbox>" + mood_scripts[mood][ii] + "</div>",
                duration: 30 * time_unit
            });
        }
        return {
            type: 'mood-induction',
            background_music: mood_music[mood],
            pages: pages,
            on_finish: function (data) {
                script_order = order.toString().replace(/,/g, ';');
                mood_spent_time = data.view_history.toString().replace(/,/g, ';');
                //console.log(pages);
                //console.log(script_order, mood_spent_time);
            }
        }
    }

    /* Change 5: Wrapping jsPsych.init() in a function */
    function initExp() {

        var mood = "${e://Field/mood}";

        // experimental session-defining variables
        if (flag_debug) {
            
            // WARNING: WHEN DEPLOYING THIS, BE SURE TO CHANGE flag_debug to false
            
            // if true: make the button appear faster
            time_unit = 100; // ms instead of 1000 ms
            console.log('Entered mood: ', mood);
        }

        // push all the procedures, which are defined in stop-it_main.js to the overall timeline
        var timeline = []; // this array stores the events we want to run in the experiment

        // use the full screen
        // also playing sound only works after an interaction with user, like button press
        timeline.push({
            type: 'fullscreen',
            message: '<p>Music will start to play when you press the button below.</p><br>',
            fullscreen_mode: true
        });

        timeline.push(generate_mood_induction(mood));

        timeline.push({
            type: 'fullscreen',
            fullscreen_mode: false
        });
    
        jsPsych.init({
            display_element: 'display_stage',
            timeline: timeline,

            on_finish: function () {

                /* Change 6: Adding the clean up and continue functions.*/
                
                // save the induction-related data to Qualtrics
                Qualtrics.SurveyEngine.setEmbeddedData("mood_script_order", script_order);
                Qualtrics.SurveyEngine.setEmbeddedData("mood_spent_time", mood_spent_time);
                if (flag_debug) {
                    console.log('Mood script order: ', script_order);
                    console.log('Mood spent time: ', mood_spent_time);
                }
            
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
