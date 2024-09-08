(function() {
  let isVerticalLayout = false;
  let chatFrame = null;
  let resizeTimeout = null;

  const getChannelName = () => {
    const pathParts = window.location.pathname.split('/');
    return pathParts[1] || '' 
  };

  const createChatIframe = (channelName) => {
    if (!chatFrame) {
      chatFrame = document.createElement('iframe');
      chatFrame.id = 'popout-chat-frame';
      document.body.appendChild(chatFrame);
    }
    
    if (!chatFrame.src.includes(`popout/${channelName}/`)) {
      chatFrame.src = `https://www.twitch.tv/popout/${channelName}/chat?popout=`;
    }

    return chatFrame;
  };

  const toggleTheaterMode = (enter) => {
    const theaterButton = document.querySelector('button[data-a-target="player-theatre-mode-button"]');
    if (theaterButton && ((enter && !document.fullscreenElement) || (!enter && document.fullscreenElement === null))) {
      theaterButton.click();
    }
  };

  const applyVerticalLayout = () => {
    if (isVerticalLayout) return;
    
    isVerticalLayout = true;
    document.body.classList.add('twitch-vertical-layout');
    toggleTheaterMode(true);
    createChatIframe(getChannelName());
  };


  const removeVerticalLayout = () => {
    if (!isVerticalLayout) return;
    
    isVerticalLayout = false;
    document.body.classList.remove('twitch-vertical-layout');

    if (chatFrame) chatFrame.style.display = 'none';
  };

  const adjustLayout = () => {

    if ((window.innerWidth < window.innerHeight) && getChannelName() !== '') {
      applyVerticalLayout();
    } else {
      removeVerticalLayout();
    }
  };

  const debounceAdjustLayout = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustLayout, 250);
  };

  // Initial call and event listeners
  window.addEventListener('load', adjustLayout);
  window.addEventListener('resize', debounceAdjustLayout);


  // Reapply layout on URL change (for navigating between channels)
  new MutationObserver((mutations) => {
    if (mutations.some(mutation => mutation.type === 'childList')) {
      setTimeout(adjustLayout, 1000);
    }

  }).observe(document.body, { childList: true, subtree: true });
})();
