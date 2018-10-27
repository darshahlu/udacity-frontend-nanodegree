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
    return $('body').hasClass('menu-hidden') === hidden;
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
        expect(feed.url.length).not.toBeLessThan(0);
      });
    });

    it('feed items have names', function() {
      allFeeds.forEach(function(feed) {
        expect(feed.name).toBeDefined();
        expect(feed.name).not.toBeNull();
        expect(feed.name.length).not.toBeLessThan(0);
      });
    });

  });

  describe('The menu', function() {
    it('is hidden by default', function() {
      expect(isMenuState(hidden = true)).toBe(true);
    });

    it('changes visibility when clicked', function() {
      $('.menu-icon-link').click();
      expect(isMenuState(hidden = false)).toBe(true);
      $('.menu-icon-link').click();
      expect(isMenuState(hidden = true)).toBe(true);
    });

  });

  describe('Initial Entries', function() {

    beforeEach(function(done) {
      loadFeed(0, function() {
        done();
      });
    });

    it('should have at least one .entry within the .feed container', function(done) {
      expect($('.feed .entry').length).not.toBeLessThan(1);
      done();
    });
  });

  describe('New Feed Selection', function() {

    let feed_1_data;
    let feed_2_data;

    beforeEach(function(done) {
      loadFeed(0, function() {
        feed_1_data = $('.feed').html();
        loadFeed(1, function() {
          feed_2_data = $('.feed').html();
          done();
        });
      });
    });

    it('has content which changes', function(done) {
      expect(feed_1_data).not.toEqual(feed_2_data);
      done();
    })
  });

}());
