/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {

  const isMenuState = function(hidden) {
    const body_coll = document.getElementsByTagName('body');
    if (hidden === true) {
      return body_coll[0].className === 'menu-hidden';
    } else {
      return body_coll[0].className === '';
    }
  }

  describe('RSS Feeds', function() {
    it('are defined', function() {
      expect(allFeeds).toBeDefined();
      expect(allFeeds.length).not.toBe(0);
    });

    it('feed items have urls', function() {
      allFeeds.forEach(function(feed) {
        expect(feed.url).toBeDefined();
        expect(feed.url).not.toBeNull();
      });
    });

    it('feed items have names', function() {
      allFeeds.forEach(function(feed) {
        expect(feed.name).toBeDefined();
        expect(feed.name).not.toBeNull();
      });
    });

  });

  describe('The menu', function() {
    it('is hidden by default', function() {
      expect(isMenuState(hidden = true)).toBe(true);
    });

    it('changes visibility when clicked', function() {
      const menu_coll = document.getElementsByClassName('menu-icon-link');
      expect(menu_coll.length).toBe(1);

      expect(isMenuState(hidden = true)).toBe(true);
      menu_coll[0].click();
      expect(isMenuState(hidden = false)).toBe(true);
      menu_coll[0].click();
      expect(isMenuState(hidden = true)).toBe(true);
    });

  });

  describe('Initial Entries', function() {
    /* TODO: Write a test that ensures when the loadFeed
     * function is called and completes its work, there is at least
     * a single .entry element within the .feed container.
     * Remember, loadFeed() is asynchronous so this test will require
     * the use of Jasmine's beforeEach and asynchronous done() function.
     */
  });

  describe('New Feed Selection', function() {
    /* TODO: Write a test that ensures when a new feed is loaded
     * by the loadFeed function that the content actually changes.
     * Remember, loadFeed() is asynchronous.
     */
  });

}());
