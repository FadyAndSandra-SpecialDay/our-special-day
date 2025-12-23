import puppeteer from 'puppeteer';

const WEBSITE_URL = 'https://fadyandsandra-specialday.github.io/our-special-day/';

async function testAudioPlayback() {
  console.log('🎵 Starting audio playback test...\n');
  console.log(`🌐 Opening website: ${WEBSITE_URL}\n`);

  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD, false for local testing
    args: ['--autoplay-policy=no-user-gesture-required'], // Allow autoplay
  });

  try {
    const page = await browser.newPage();

    // Listen to console messages
    const consoleMessages = [];
    const errors = [];
    
    page.on('console', (msg) => {
      const text = msg.text();
      consoleMessages.push(text);
      if (msg.type() === 'error') {
        errors.push(text);
      }
    });

    // Listen to page errors
    page.on('pageerror', (error) => {
      errors.push(`Page Error: ${error.message}`);
    });

    // Navigate to the website
    console.log('📱 Navigating to website...');
    await page.goto(WEBSITE_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    console.log('✅ Page loaded successfully\n');

    // Wait a bit for audio to initialize (longer wait for GitHub Pages)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Check if audio elements exist
    console.log('🔍 Checking for audio elements...');
    const audioElements = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      if (!audio) return null;

      return {
        exists: true,
        src: audio.src || 'No src attribute',
        currentSrc: audio.currentSrc || 'No currentSrc',
        readyState: audio.readyState,
        networkState: audio.networkState,
        error: audio.error ? {
          code: audio.error.code,
          message: audio.error.message,
        } : null,
        paused: audio.paused,
        playing: !audio.paused,
        currentTime: audio.currentTime,
        autoplay: audio.autoplay,
        preload: audio.preload,
        sources: Array.from(audio.querySelectorAll('source')).map(src => ({
          src: src.src,
          type: src.type,
        })),
      };
    });

    if (!audioElements) {
      console.log('❌ No audio element found on the page');
      return;
    }

    console.log('✅ Audio element found!\n');
    console.log('📊 Audio Element Details:');
    console.log(`   Current Source: ${audioElements.currentSrc}`);
    console.log(`   Ready State: ${audioElements.readyState} (0=nothing, 1=metadata, 2=current data, 3=future data, 4=enough data)`);
    console.log(`   Network State: ${audioElements.networkState} (0=empty, 1=idle, 2=loading, 3=no source)`);
    console.log(`   Paused: ${audioElements.paused}`);
    console.log(`   Playing: ${audioElements.playing}`);
    console.log(`   Current Time: ${audioElements.currentTime?.toFixed(2) || 0}s`);
    console.log(`   Preload: ${audioElements.preload}`);
    
    if (audioElements.sources.length > 0) {
      console.log(`\n   Source Elements:`);
      audioElements.sources.forEach((src, i) => {
        console.log(`     ${i + 1}. ${src.src} (type: ${src.type})`);
      });
    }

    if (audioElements.error) {
      console.log(`\n❌ Audio Error Detected:`);
      console.log(`   Code: ${audioElements.error.code}`);
      console.log(`   Message: ${audioElements.error.message}`);
      console.log('\n   Error Codes:');
      console.log('   1 = MEDIA_ERR_ABORTED');
      console.log('   2 = MEDIA_ERR_NETWORK');
      console.log('   3 = MEDIA_ERR_DECODE');
      console.log('   4 = MEDIA_ERR_SRC_NOT_SUPPORTED (Format error)');
    } else {
      console.log('\n✅ No audio errors detected');
    }

    // Try to get audio duration
    const audioInfo = await page.evaluate(() => {
      const audio = document.querySelector('audio');
      if (!audio) return null;
      return {
        duration: audio.duration || 0,
        durationIsValid: !isNaN(audio.duration) && isFinite(audio.duration),
      };
    });

    if (audioInfo && audioInfo.durationIsValid) {
      console.log(`\n🎵 Audio Duration: ${audioInfo.duration.toFixed(2)} seconds`);
    } else {
      console.log(`\n⚠️  Audio duration not available (file may not be loaded yet)`);
    }

    // Check console messages for audio-related logs
    console.log('\n📝 Console Messages (last 20):');
    const audioRelatedMessages = consoleMessages
      .filter(msg => 
        msg.toLowerCase().includes('audio') || 
        msg.toLowerCase().includes('music') || 
        msg.toLowerCase().includes('loading') ||
        msg.toLowerCase().includes('error') ||
        msg.includes('🎵') ||
        msg.includes('❌') ||
        msg.includes('✅')
      )
      .slice(-20);
    
    if (audioRelatedMessages.length > 0) {
      audioRelatedMessages.forEach(msg => {
        console.log(`   ${msg}`);
      });
    } else {
      console.log('   No audio-related console messages found');
    }

    // Check for errors
    if (errors.length > 0) {
      console.log('\n⚠️  Errors found in console:');
      errors.forEach(error => {
        console.log(`   ${error}`);
      });
    }

    // Check if music controls are visible
    console.log('\n🎮 Checking music controls...');
    const controls = await page.evaluate(() => {
      const playButton = document.querySelector('button[aria-label*="play"], button[aria-label*="Play"], button[aria-label*="music"]');
      const muteButton = document.querySelector('button[aria-label*="mute"], button[aria-label*="Mute"]');
      return {
        playButton: playButton ? playButton.getAttribute('aria-label') : null,
        muteButton: muteButton ? muteButton.getAttribute('aria-label') : null,
      };
    });

    if (controls.playButton || controls.muteButton) {
      console.log('✅ Music controls found');
      if (controls.playButton) console.log(`   Play button: ${controls.playButton}`);
      if (controls.muteButton) console.log(`   Mute button: ${controls.muteButton}`);
    } else {
      console.log('⚠️  Music controls not found (may be hidden or use different selectors)');
    }

    // Final summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    
    if (audioElements.error) {
      if (audioElements.error.code === 4) {
        console.log('❌ FAILED: Format error - Audio file format not supported');
        console.log('   The browser cannot decode the audio file.');
        console.log('   Possible causes:');
        console.log('   - Wrong file format or codec');
        console.log('   - Corrupted file');
        console.log('   - Browser doesn\'t support the codec');
      } else {
        console.log(`❌ FAILED: Audio error (Code: ${audioElements.error.code})`);
      }
    } else if (audioElements.readyState >= 2) {
      console.log('✅ PASSED: Audio file is loading/loaded successfully');
      console.log(`   Ready state: ${audioElements.readyState} (file has data)`);
    } else if (audioElements.readyState === 1) {
      console.log('⚠️  PARTIAL: Audio metadata loaded but data not yet available');
      console.log('   This may be normal if the file is still loading');
    } else {
      console.log('⚠️  UNKNOWN: Audio element exists but state is unclear');
      console.log(`   Ready state: ${audioElements.readyState}`);
    }

    console.log('\n');

    // Keep browser open for a bit to observe
    await new Promise(resolve => setTimeout(resolve, 2000));

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testAudioPlayback().catch(console.error);

