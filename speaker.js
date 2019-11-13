(() => {
  var notesValue = document.querySelector('.speaker-controls-notes .value');
  var slideCurrentNumber = document.querySelector('.slide-current-number');
  var currentState;
  var currentSlide;
  var upcomingSlide;
  var pendingCalls = {};
  var lastRevealApiCallId = 0;
  var connected = false;

  callRevealApi('getTotalSlides', [], (total) => {
    document.querySelector('.slide-total-number').textContent = total;
  });

  callRevealApi('getIndices', [], ({ h }) => {
    document.querySelector('.slide-current-number').textContent = h;
  });

  document.querySelector('#prev').addEventListener('click', () => {
    callRevealApi('prev');
  });
  document.querySelector('#next').addEventListener('click', () => {
    callRevealApi('next');
  });

  window.opener.addEventListener('beforeunload', () => {
    window.close();
  });

  window.addEventListener('message', function (event) {
    var data = JSON.parse(event.data);

    // The overview mode is only useful to the reveal.js instance
    // where navigation occurs so we don't sync it
    if (data.state) delete data.state.overview;

    // Messages sent by the notes plugin inside of the main window
    if (data && data.namespace === 'reveal-notes') {
      if (data.type === 'connect') {
        handleConnectMessage(data);
      } else if (data.type === 'state') {
        handleStateMessage(data);
      } else if (data.type === 'return') {
        pendingCalls[data.callId](data.result);
        // delete pendingCalls[data.callId];
      }
    // Messages sent by the reveal.js inside of the current slide preview
    } else if (data && data.namespace === 'reveal') {
      if (/ready/.test(data.eventName)) {
        // Send a message back to notify that the handshake is complete
        window.opener.postMessage(JSON.stringify({ namespace: 'reveal-notes', type: 'connected' }), '*');
      } else if (/slidechanged|fragmentshown|fragmenthidden|paused|resumed/.test(data.eventName) && currentState !== JSON.stringify(data.state)) {
        window.opener.postMessage(JSON.stringify({ method: 'setState', args: [data.state] }), '*');
      }
    }
  });

  /**
   * Asynchronously calls the Reveal.js API of the main frame.
   */
  function callRevealApi (methodName, methodArguments, callback) {
    var callId = ++lastRevealApiCallId;
    pendingCalls[callId] = callback;
    window.opener.postMessage(JSON.stringify({
      namespace: 'reveal-notes',
      type: 'call',
      callId: callId,
      methodName: methodName,
      arguments: methodArguments
    }), '*');
  }

  /**
   * Called when the main window is trying to establish a
   * connection.
   */
  function handleConnectMessage (data) {
    if (connected === false) {
      connected = true;

      setupIframes(data);
      setupKeyboard();
      setupTimer();
    }
  }

  /**
   * Called when the main window sends an updated state.
   */
  const handleStateMessage = debounce((data) => {
    // Store the most recently set state to avoid circular loops
    // applying the same state
    currentState = JSON.stringify(data.state);
    slideCurrentNumber.textContent = data.state.indexh + 1;

    // No need for updating the notes in case of fragment changes
    if (data.notes) {
      notesValue.style.whiteSpace = 'pre-wrap';
      notesValue.innerHTML = data.notes;
    } else {
      notesValue.innerHTML = '';
    }

    // Update the note slides
    currentSlide.contentWindow.postMessage(JSON.stringify({ method: 'setState', args: [data.state] }), '*');
    upcomingSlide.contentWindow.postMessage(JSON.stringify({ method: 'setState', args: [data.state] }), '*');
    upcomingSlide.contentWindow.postMessage(JSON.stringify({ method: 'next' }), '*');
  }, 200);

  /**
   * Forward keyboard events to the current slide window.
   * This enables keyboard events to work even if focus
   * isn't set on the current slide iframe.
   *
   * Block F5 default handling, it reloads and disconnects
   * the speaker notes window.
   */
  function setupKeyboard () {
    document.addEventListener('keydown', function (event) {
      if (event.keyCode === 116 || (event.metaKey && event.keyCode === 82)) {
        event.preventDefault();
        return false;
      }
      currentSlide.contentWindow.postMessage(JSON.stringify({ method: 'triggerKey', args: [event.keyCode] }), '*');
    });
  }

  function setupIframes (data) {
    var params = [
      'receiver',
      'progress=false',
      'history=false',
      'transition=none',
      'autoSlide=0',
      'backgroundTransition=none'
    ].join('&');

    var urlSeparator = /\?/.test(data.url) ? '&' : '?';
    var hash = '#/' + data.state.indexh + '/' + data.state.indexv;
    var currentURL = data.url + urlSeparator + params + '&postMessageEvents=true' + hash;
    var upcomingURL = data.url + urlSeparator + params + '&controls=false' + hash;

    currentSlide = document.createElement('iframe');
    currentSlide.setAttribute('width', 1280);
    currentSlide.setAttribute('height', 1024);
    currentSlide.setAttribute('src', currentURL);
    document.querySelector('#current-slide').appendChild(currentSlide);

    upcomingSlide = document.createElement('iframe');
    upcomingSlide.setAttribute('width', 1280);
    upcomingSlide.setAttribute('height', 1024);
    upcomingSlide.setAttribute('src', upcomingURL);
    document.querySelector('#upcoming-slide').appendChild(upcomingSlide);
  }

  function setupTimer () {
    var start = new Date();
    var timeEl = document.querySelector('.speaker-controls-time');
    var clockEl = timeEl.querySelector('.clock-value');
    var hoursEl = timeEl.querySelector('.hours-value');
    var minutesEl = timeEl.querySelector('.minutes-value');
    var secondsEl = timeEl.querySelector('.seconds-value');

    _updateTimer();
    setInterval(_updateTimer, 1000);

    timeEl.addEventListener('click', function () {
      start = new Date();
      _updateTimer();
      return false;
    });

    function _displayTime (hrEl, minEl, secEl, time) {
      var sign = Math.sign(time) === -1 ? '-' : '';
      time = Math.abs(Math.round(time / 1000));
      var seconds = time % 60;
      var minutes = Math.floor(time / 60) % 60;
      var hours = Math.floor(time / (60 * 60));
      hrEl.innerHTML = sign + zeroPadInteger(hours);
      if (hours === 0) {
        hrEl.classList.add('mute');
      } else {
        hrEl.classList.remove('mute');
      }
      minEl.innerHTML = ':' + zeroPadInteger(minutes);
      if (hours === 0 && minutes === 0) {
        minEl.classList.add('mute');
      } else {
        minEl.classList.remove('mute');
      }
      secEl.innerHTML = ':' + zeroPadInteger(seconds);
    }

    function _updateTimer () {
      var diff;
      var now = new Date();

      diff = now.getTime() - start.getTime();

      clockEl.innerHTML = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });
      _displayTime(hoursEl, minutesEl, secondsEl, diff);
    }
  }

  function zeroPadInteger (num) {
    var str = '00' + parseInt(num);
    return str.substring(str.length - 2);
  }

  function debounce (fn, ms) {
    var lastTime = 0;
    var timeout;

    return function () {
      var args = arguments;
      var context = this;

      clearTimeout(timeout);

      var timeSinceLastCall = Date.now() - lastTime;
      if (timeSinceLastCall > ms) {
        fn.apply(context, args);
        lastTime = Date.now();
      } else {
        timeout = setTimeout(function () {
          fn.apply(context, args);
          lastTime = Date.now();
        }, ms - timeSinceLastCall);
      }
    };
  }
})();
