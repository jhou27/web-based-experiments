/**
 * jspsych-mood-induction
 * Kyoung Whan Choe (https://github.com/kywch/)
 * 
 * This plugin displays text (including HTML formatted strings) during the experiment,
 * while playing the input audio. Its main purpose is mood induction.
 * 
 * Modified jspsych-instrucions.js by Josh de Leeuw
 * 
 */

jsPsych.plugins['mood-induction'] = (function () {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('mood-induction', 'background_music', 'audio');

  plugin.info = {
    name: 'mood-induction',
    description: '',
    parameters: {
      pages: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        pretty_name: 'Pages',
        default: undefined,
        array: true,
        description: 'Each element of the array is the content for a single page.',
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.HTML_STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompt for the subject to imagine'
          },
          duration: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Duration',
            default: 0,
            description: 'Minimum duration for the prompt'
          }
        }
      },
      background_music: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Background music',
        default: null,
        description: 'The music to be played in background.'
      },
      show_page_number: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Show page number',
        default: true,
        description: 'If true, and clickable navigation is enabled, then Page x/y will be shown between the nav buttons.'
      },
      button_label_next: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label next',
        default: 'Next',
        description: 'The text that appears on the button to go forwards.'
      }
    }
  }

  plugin.trial = function (display_element, trial) {

    var current_page = 0;

    var view_history = [];

    var start_time = performance.now();

    var last_page_update_time = start_time;

    // setup the music
    var context = jsPsych.pluginAPI.audioContext();
    if (context !== null) {
      var source = context.createBufferSource();
      source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.background_music);
      source.connect(context.destination);
    } else {
      var audio = jsPsych.pluginAPI.getAudioBuffer(trial.background_music);
    }

    function btnListener(evt) {
      evt.target.removeEventListener('click', btnListener);
      if (this.id === 'jspsych-instructions-next') {
        next();
      }
    }

    function show_current_page() {
      var html = trial.pages[current_page].prompt;

      var pagenum_display = "";
      if (trial.show_page_number) {
        pagenum_display = "<span style='margin: 0 1em;' class='" +
          "jspsych-instructions-pagenum'>Page " + (current_page + 1) + "/" + trial.pages.length + "</span>";
      }

      var nav_html = "<div id='jspsych-instructions-nav' style='padding: 10px 0px;positon: relative;'>";
      if (trial.pages.length > 1 && trial.show_page_number) {
        nav_html += pagenum_display;
      }
      nav_html += "</div>"

      html += nav_html;
      display_element.innerHTML = html;

      // add the Next button after required viewing time
      jsPsych.pluginAPI.setTimeout(function () {
        document.querySelector("#jspsych-instructions-nav").insertAdjacentHTML('beforeend',
          "<button id='jspsych-instructions-next' class='jspsych-btn'" +
          "style='margin-left: 5px;'>" + trial.button_label_next + " &gt;</button>");
        display_element.querySelector('#jspsych-instructions-next').addEventListener('click', btnListener);
      }, trial.pages[current_page].duration);
    }

    function next() {

      add_current_page_to_view_history()

      current_page++;

      // if done, finish up...
      if (current_page >= trial.pages.length) {
        endTrial();
      } else {
        show_current_page();
      }

    }

    function add_current_page_to_view_history() {

      var current_time = performance.now();

      var page_view_time = Math.round(current_time - last_page_update_time);

      view_history.push(page_view_time);

      last_page_update_time = current_time;
    }

    function endTrial() {

      // stop the audio file if it is playing
      // remove end event listeners if they exist
      if (context !== null) {
        source.stop();
      } else {
        audio.pause();
      }

      display_element.innerHTML = '';

      var trial_data = {
        "view_history": view_history,
        "rt": Math.round(performance.now() - start_time)
      };

      jsPsych.finishTrial(trial_data);
    }

    // start audio
    if (context !== null) {
      startTime = context.currentTime;
      source.start(startTime);
    } else {
      audio.play();
    }

    show_current_page();

  };

  return plugin;
})();
