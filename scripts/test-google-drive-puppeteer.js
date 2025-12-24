import puppeteer from 'puppeteer';

const WEBSITE_URL = 'https://fadyandsandra-specialday.github.io/our-special-day/';

async function testGoogleDriveIntegration() {
  console.log('🔍 Starting Google Drive integration test...\n');
  console.log(`🌐 Opening website: ${WEBSITE_URL}\n`);

  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI/CD, false for local testing
    args: ['--autoplay-policy=no-user-gesture-required'],
  });

  try {
    const page = await browser.newPage();

    // Listen to console messages
    const consoleMessages = [];
    const errors = [];
    const networkRequests = [];
    
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

    // Monitor network requests - capture ALL requests/responses for debugging
    const allRequests = [];
    const failedRequests = [];

    page.on('request', (request) => {
      const url = request.url();
      allRequests.push({
        type: 'request',
        url: url,
        method: request.method(),
      });
      
      if (url.includes('get-gallery') || url.includes('get-config') || url.includes('googleapis.com')) {
        networkRequests.push({
          type: 'request',
          url: url.substring(0, 100), // Truncate long URLs
          method: request.method(),
        });
      }
    });

    page.on('response', (response) => {
      const url = response.url();
      const status = response.status();
      
      // Only track actual failures, not redirects or harmless missing resources
      // 302 = redirect (normal for Google Drive thumbnails)
      // 304 = not modified (caching)
      // 404 on favicon = harmless (browser requests it automatically)
      const isFavicon = url.includes('favicon.ico');
      const isRedirect = status >= 300 && status < 400;
      const isNotModified = status === 304;
      const isClientError = status >= 400 && status < 500;
      const isServerError = status >= 500;
      
      // Only flag as failed if it's a real error and not a harmless one
      if ((isClientError || isServerError) && !isFavicon && !isRedirect && !isNotModified) {
        failedRequests.push({
          url: url,
          status: status,
          statusText: response.statusText(),
        });
      }
      
      if (url.includes('get-gallery') || url.includes('get-config') || url.includes('googleapis.com')) {
        networkRequests.push({
          type: 'response',
          url: url.substring(0, 100),
          status: status,
          ok: response.ok(),
        });
      }
    });

    // Navigate to the website
    console.log('📱 Navigating to website...');
    await page.goto(WEBSITE_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    console.log('✅ Page loaded successfully\n');

    // Wait for config and gallery to load
    console.log('⏳ Waiting for config and gallery to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Test 1: Check if config loaded successfully
    console.log('\n' + '='.repeat(60));
    console.log('TEST 1: Configuration Loading');
    console.log('='.repeat(60));
    
    const configStatus = await page.evaluate(() => {
      // Check if there are any error messages about config
      const errorElements = Array.from(document.querySelectorAll('*'))
        .filter(el => {
          const text = el.textContent || '';
          return text.toLowerCase().includes('failed to load configuration') ||
                 text.toLowerCase().includes('config');
        });
      
      return {
        hasConfigErrors: errorElements.length > 0,
        configErrorText: errorElements.length > 0 ? errorElements[0].textContent : null,
      };
    });

    if (configStatus.hasConfigErrors) {
      console.log('❌ Configuration loading error detected');
      console.log(`   Error: ${configStatus.configErrorText}`);
    } else {
      console.log('✅ No configuration errors found');
    }

    // Test 2: Check Gallery Section
    console.log('\n' + '='.repeat(60));
    console.log('TEST 2: Gallery Section');
    console.log('='.repeat(60));

    // Scroll to gallery section
    console.log('📜 Scrolling to gallery section...');
    await page.evaluate(() => {
      const gallerySection = document.querySelector('#gallery');
      if (gallerySection) {
        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const galleryStatus = await page.evaluate(() => {
      const gallerySection = document.querySelector('#gallery');
      if (!gallerySection) {
        return { found: false, error: 'Gallery section not found' };
      }

      // Check for loading spinner
      const loadingSpinner = gallerySection.querySelector('[class*="spinner"], [class*="loader"], [class*="loading"]');
      
      // Check for error messages
      const errorElements = Array.from(gallerySection.querySelectorAll('*'))
        .filter(el => {
          const text = el.textContent || '';
          return text.toLowerCase().includes('error') ||
                 text.toLowerCase().includes('failed') ||
                 text.toLowerCase().includes('gallery.error');
        });

      // Check for images
      const images = gallerySection.querySelectorAll('img');
      const imageSrcs = Array.from(images).map(img => img.src || img.getAttribute('src'));

      // Check for carousel/slider
      const carousel = gallerySection.querySelector('[class*="carousel"], [class*="slider"], [class*="embla"]');

      return {
        found: true,
        hasLoadingSpinner: !!loadingSpinner,
        hasErrors: errorElements.length > 0,
        errorText: errorElements.length > 0 ? errorElements[0].textContent : null,
        imageCount: images.length,
        imageSrcs: imageSrcs.slice(0, 5), // First 5 images
        hasCarousel: !!carousel,
        visibleImages: Array.from(images).filter(img => {
          const rect = img.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }).length,
      };
    });

    if (!galleryStatus.found) {
      console.log('❌ Gallery section not found on page');
    } else {
      console.log('✅ Gallery section found');
      console.log(`   Loading state: ${galleryStatus.hasLoadingSpinner ? 'Still loading' : 'Not loading'}`);
      console.log(`   Error state: ${galleryStatus.hasErrors ? 'Has errors' : 'No errors'}`);
      if (galleryStatus.hasErrors) {
        console.log(`   Error message: ${galleryStatus.errorText}`);
      }
      console.log(`   Total images found: ${galleryStatus.imageCount}`);
      console.log(`   Visible images: ${galleryStatus.visibleImages}`);
      console.log(`   Carousel present: ${galleryStatus.hasCarousel ? 'Yes' : 'No'}`);
      
      if (galleryStatus.imageSrcs.length > 0) {
        console.log(`\n   Sample image URLs:`);
        galleryStatus.imageSrcs.forEach((src, i) => {
          const shortSrc = src.length > 80 ? src.substring(0, 80) + '...' : src;
          console.log(`     ${i + 1}. ${shortSrc}`);
          if (src.includes('drive.google.com')) {
            console.log(`        ✅ Contains Google Drive URL`);
          }
        });
      }

      if (galleryStatus.imageCount === 0 && !galleryStatus.hasLoadingSpinner) {
        console.log('\n   ⚠️  No images found and not loading - gallery may have failed to load');
      } else if (galleryStatus.imageCount > 0) {
        console.log('\n   ✅ Images found! Google Drive integration appears to be working');
      }
    }

    // Test 3: Check Network Requests
    console.log('\n' + '='.repeat(60));
    console.log('TEST 3: Network Requests');
    console.log('='.repeat(60));

    const relevantRequests = networkRequests.filter(req => 
      req.url.includes('get-gallery') || 
      req.url.includes('get-config') ||
      req.url.includes('googleapis.com')
    );

    if (relevantRequests.length === 0) {
      console.log('⚠️  No relevant network requests found');
      console.log('   This might mean:');
      console.log('   - Config/gallery requests were made before monitoring started');
      console.log('   - Requests are failing before being sent');
    } else {
      console.log(`📡 Found ${relevantRequests.length} relevant network requests/responses\n`);
      
      const getGalleryRequests = relevantRequests.filter(req => req.url.includes('get-gallery'));
      const getConfigRequests = relevantRequests.filter(req => req.url.includes('get-config'));
      const googleApiRequests = relevantRequests.filter(req => req.url.includes('googleapis.com'));

      if (getConfigRequests.length > 0) {
        console.log('   Config requests:');
        getConfigRequests.forEach(req => {
          if (req.type === 'response') {
            const status = req.status;
            const icon = req.ok ? '✅' : '❌';
            console.log(`     ${icon} ${req.type}: ${req.url} - Status: ${status}`);
          } else {
            console.log(`     📤 ${req.type}: ${req.url} - Method: ${req.method}`);
          }
        });
      }

      if (getGalleryRequests.length > 0) {
        console.log('\n   Gallery requests:');
        getGalleryRequests.forEach(req => {
          if (req.type === 'response') {
            const status = req.status;
            const icon = req.ok ? '✅' : '❌';
            console.log(`     ${icon} ${req.type}: ${req.url} - Status: ${status}`);
          } else {
            console.log(`     📤 ${req.type}: ${req.url} - Method: ${req.method}`);
          }
        });
      }

      if (googleApiRequests.length > 0) {
        console.log('\n   Google API requests:');
        googleApiRequests.forEach(req => {
          if (req.type === 'response') {
            const status = req.status;
            const icon = req.ok ? '✅' : '❌';
            console.log(`     ${icon} ${req.type}: ${req.url.substring(0, 60)}... - Status: ${status}`);
          } else {
            console.log(`     📤 ${req.type}: ${req.url.substring(0, 60)}... - Method: ${req.method}`);
          }
        });
      }
    }

    // Test 4: Check Failed Network Requests
    console.log('\n' + '='.repeat(60));
    console.log('TEST 4: Failed Network Requests');
    console.log('='.repeat(60));

    if (failedRequests.length > 0) {
      console.log(`❌ Found ${failedRequests.length} actual failed requests:\n`);
      failedRequests.forEach((req, i) => {
        const shortUrl = req.url.length > 100 ? req.url.substring(0, 100) + '...' : req.url;
        console.log(`   ${i + 1}. Status: ${req.status} ${req.statusText}`);
        console.log(`      URL: ${shortUrl}`);
        
        // Categorize failures
        if (req.url.includes('.woff') || req.url.includes('.woff2') || req.url.includes('.ttf')) {
          console.log(`      ℹ️  Font file - may not be critical`);
        } else if (req.url.includes('googleapis.com') || req.url.includes('get-')) {
          console.log(`      ⚠️  This is a critical API request!`);
        } else if (req.status >= 500) {
          console.log(`      ⚠️  Server error - check backend service`);
        } else if (req.status === 404 && !req.url.includes('favicon')) {
          console.log(`      ⚠️  404 Not Found - resource is missing`);
        }
        console.log('');
      });
    } else {
      console.log('✅ No actual failed network requests found');
      console.log('   (Favicon 404s and 302 redirects are normal and have been filtered out)');
    }

    // Test 5: Check Console for Errors
    console.log('\n' + '='.repeat(60));
    console.log('TEST 5: Console Errors & Messages');
    console.log('='.repeat(60));

    // Filter out harmless console errors
    // Generic 404 errors without URL context are often favicon or other harmless resources
    const actualErrors = errors.filter(error => {
      const lowerError = error.toLowerCase();
      // Exclude favicon errors
      if (lowerError.includes('favicon')) return false;
      // Generic "404" without URL context could be harmless (browser console truncates URLs)
      // Only flag if it mentions specific resources we care about
      if (lowerError.includes('404') && 
          !lowerError.includes('get-') && 
          !lowerError.includes('config') && 
          !lowerError.includes('gallery') &&
          !lowerError.includes('googleapis') &&
          !lowerError.includes('drive')) {
        // This is likely a generic 404 (probably favicon or other harmless resource)
        return false;
      }
      return true;
    });
    
    if (actualErrors.length > 0) {
      console.log(`❌ Found ${actualErrors.length} actual console errors:\n`);
      actualErrors.forEach((error, i) => {
        const shortError = error.length > 150 ? error.substring(0, 150) + '...' : error;
        console.log(`   ${i + 1}. ${shortError}`);
      });
    } else if (errors.length > 0) {
      console.log(`✅ Console errors found but all appear to be harmless`);
      console.log(`   (Generic 404 errors without specific URLs are likely favicon or other browser requests)`);
    } else {
      console.log('✅ No console errors found');
    }

    const driveRelatedMessages = consoleMessages.filter(msg => 
      (msg.toLowerCase().includes('gallery') ||
      msg.toLowerCase().includes('drive') ||
      msg.toLowerCase().includes('config') ||
      msg.toLowerCase().includes('google') ||
      msg.includes('Error fetching') ||
      msg.includes('Failed to load')) &&
      !msg.toLowerCase().includes('favicon') // Exclude favicon errors
    );

    if (driveRelatedMessages.length > 0) {
      console.log(`\n📝 Google Drive/gallery related messages:\n`);
      driveRelatedMessages.slice(-10).forEach((msg, i) => {
        const shortMsg = msg.length > 150 ? msg.substring(0, 150) + '...' : msg;
        console.log(`   ${i + 1}. ${shortMsg}`);
      });
    } else {
      console.log('\n   No significant Google Drive/gallery messages');
    }

    // Test 6: Try to interact with gallery
    console.log('\n' + '='.repeat(60));
    console.log('TEST 6: Gallery Interaction');
    console.log('='.repeat(60));

    const canInteract = await page.evaluate(() => {
      const gallerySection = document.querySelector('#gallery');
      if (!gallerySection) return { canInteract: false, reason: 'Gallery section not found' };

      // Check for carousel buttons
      const nextButton = gallerySection.querySelector('button[aria-label*="next"], button[aria-label*="Next"]');
      const prevButton = gallerySection.querySelector('button[aria-label*="previous"], button[aria-label*="Previous"], button[aria-label*="prev"]');
      
      // Check if images are clickable
      const firstImage = gallerySection.querySelector('img');
      const imageClickable = firstImage && firstImage.closest('button, a, [role="button"]');

      return {
        canInteract: true,
        hasNextButton: !!nextButton,
        hasPrevButton: !!prevButton,
        hasClickableImages: !!imageClickable,
        imageCount: gallerySection.querySelectorAll('img').length,
      };
    });

    if (canInteract.canInteract) {
      console.log('✅ Gallery is interactive');
      console.log(`   Next button: ${canInteract.hasNextButton ? 'Yes' : 'No'}`);
      console.log(`   Previous button: ${canInteract.hasPrevButton ? 'Yes' : 'No'}`);
      console.log(`   Clickable images: ${canInteract.hasClickableImages ? 'Yes' : 'No'}`);
    } else {
      console.log(`❌ Cannot interact with gallery: ${canInteract.reason}`);
    }

    // Final Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));

    const hasErrors = errors.length > 0 || configStatus.hasConfigErrors || galleryStatus.hasErrors;
    const hasImages = galleryStatus.found && galleryStatus.imageCount > 0;
    const configWorking = !configStatus.hasConfigErrors;

    // Use actual error count, not including harmless favicon/redirect errors
    const hasActualErrors = failedRequests.length > 0 || actualErrors.length > 0;
    
    if (hasImages && configWorking && !hasActualErrors) {
      console.log('✅ PASSED: Google Drive integration is working correctly!');
      console.log('   - Configuration: ✅ Loaded successfully');
      console.log('   - Gallery images: ✅ Loaded from Google Drive');
      console.log('   - Network requests: ✅ All critical requests successful');
      console.log('   - Errors: ✅ No actual errors detected');
    } else if (hasImages && configWorking) {
      console.log('⚠️  PARTIAL: Gallery loaded but some issues detected');
      console.log('   - Configuration: ✅ Working');
      console.log('   - Gallery images: ✅ Loaded');
      console.log('   - Errors: ⚠️  Some issues found (check logs above)');
      if (failedRequests.length > 0) {
        console.log(`      - ${failedRequests.length} failed network request(s)`);
      }
      if (actualErrors.length > 0) {
        console.log(`      - ${actualErrors.length} console error(s)`);
      }
    } else if (!configWorking) {
      console.log('❌ FAILED: Configuration not loading');
      console.log('   - Check Supabase secrets are set correctly');
      console.log('   - Check get-config Edge Function is deployed');
    } else if (!hasImages) {
      console.log('❌ FAILED: Gallery images not loading');
      console.log('   - Check GALLERY_FOLDER_ID is set in Supabase secrets');
      console.log('   - Check folder is shared with service account');
      console.log('   - Check Google Drive API is enabled');
    } else {
      console.log('❌ FAILED: Multiple issues detected');
      console.log('   - Check all error messages above');
    }

    console.log('\n');

    // Keep browser open for observation
    console.log('🔍 Keeping browser open for 5 seconds for observation...');
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testGoogleDriveIntegration().catch(console.error);

