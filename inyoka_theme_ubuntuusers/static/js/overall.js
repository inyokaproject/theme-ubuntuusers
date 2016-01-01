/**
 * js.overall
 * ~~~~~~~~~~
 *
 * Some general scripts for the whole portal (requires jQuery).
 *
 * :copyright: (c) 2007-2016 by the Inyoka Team, see AUTHORS for more details.
 * :license: BSD, see LICENSE for more details.
 */

$(document).ready(function () {
  var loginForm = null;

  // preload images
  (function () {
    var container = $('<div>').appendTo('body').css({
      height: 0,
      overflow: 'hidden'
    });
    $.each([], function () {
      $('<img />').attr('src', $STATIC_URL + this).appendTo(container);
    });
  })();

  // add a hide message link to all flash messages
  $.each($('div.message'), function (i, elm) {
    $(elm).prepend($('<a href="#" class="hide" />').click(function () {
      if ($(this).parent().hasClass('global')) {
        $.post('/?__service__=portal.hide_global_message', {});
      }
      $(this).parent().slideUp('slow');
      return false;
    }));
  });

  // hide search words on click
  $('a.hide_searchwords').click(function () {
    $(this).parent().slideUp('slow');
    $('span.highlight').removeClass('highlight');
    return false;
  });

  // Make TOC links expandable.
  (function () {
    //Execute this function only when if there are tocs.
    if (!$('.toc').length) return;
    if (navigator.userAgent.match(/konqueror/i)) return;
    if (document.location.href.indexOf('/full/') >= 0) return;

    // create a link to hide a toc
    $('.toc .head').append(
    $('<a> [-]</a>').toggle(function () {
      $(this).text(' [+]').parent().next().slideUp('fast');
    }, function () {
      $(this).text(' [-]').parent().next().slideDown('fast');
    }));

    $('.toc').each(function () {
      toc = $(this);
      // find out depth of old toc, so we can make ours look the same in the beginning
      var _classes = this.className.split(/\s+/);
      for (var i = 0; i < _classes.length; i++) {
        if (_classes[i].match(/^toc-depth-(\d+)$/)) {
          tocDepth = parseInt(_classes[i].slice(10), 10);
          break;
        }
      }
      if (typeof tocDepth === 'undefined') return;

      style = toc.find('ol').first().attr('class');
      // mark old toc for later deletion
      toc.find('ol').addClass('originaltoc');

      var ol = function(level) {
        return $('<ol class="toc-item-depth-' + level + '"></ol>');
      };
      var li = $('<li></li>');
      var li_no_number = $('<li style="list-style: none"></li>');
      // will finally hold the whole tocTree
      var tocTree = [];
      tocTree.push(ol(1));
      var last_level = 1;
      // Iterate over all <a> tags in headlines
      $('.headerlink').each(function(index) {
        var level_class = $(this).parent().parent().attr("class");
        var match = level_class.match(/^section_(\d+)$/);
        if (match === null) { // not a section_* class
          return true; // continue
        }
        var level = parseInt(match[1], 10);

        if (level > last_level) {
          // if the headline is indented compared to the previous one
          // we need to check for the difference between those levels
          limit = level - last_level;
          for (var i = 1; i < limit; i++) {
            tocTree.push(ol(last_level + i));
            tocTree[tocTree.length - 1].append(li_no_number.clone());
          }
          tocTree.push(ol(level));
        } else if (level < last_level) {
          // we are unindenting the headline level. All lists have to be
          // popped from the stack up to the current level
          limit = last_level - level;
          for (var i = 0; i < limit; i++) {
            var node = tocTree.pop();
            var children = tocTree[tocTree.length - 1].children();
            if (children.length > 0) {
              children.last().append(node);
            } else {
              tocTree[tocTree.length - 1].append(li_no_number.clone().append(node));
            }
          }
        }

        var ml = 42 - (level - 1) * 2; // max text length of toc entry
        var link = $(this).parent().attr("id");
        var linkText = $(this).parent().text();
        linkText = linkText.substr(0, linkText.length-1).substr(0, ml);
        tocTree[tocTree.length - 1].append(li.clone().append($('<a href="#' + link + '" class="crosslink">' + linkText + '</a>')));

        last_level = level;
      });
      var limit = last_level - 1;
      for (var i = 0; i < limit; i++) {
        var node = tocTree.pop();
        var children = tocTree[tocTree.length - 1].children();
        if (children.length > 0) {
          children.last().append(node);
        } else {
          tocTree[tocTree.length - 1].append(li_no_number.clone().append(node));
        }
      }
      newtoc = tocTree[0].insertAfter(toc.find('.head'));
      toc.find('.originaltoc').remove();
      //we have to hide all sublevels, create [+/-], and the click-event
      var folder = $('<a class="toctoggle"> [-] </a>');
      toc.find('ol ol').each(function () {
        var f = folder.clone();
        f.insertBefore($(this)).toggle(
          function () {
            $(this).text(' [+] ').next().slideUp('fast');
          }, function () {
            $(this).text(' [-] ').next().slideDown('fast');
          }
        );
        var classes = $(this).attr('class').split(/\s+/);
        if (parseInt(classes[classes.length - 1].slice(15), 10) >= tocDepth) {
          f.click();
        }
      });
    });
  }());

  // searchintegration for startpage
  // only temporarily, done fast and thus a bit hacky!
  (function () {
    // object that lists, in which locations the user can search
    // schema: { internalID : displayedTextToUser }
    var searchAreas = {"portal": "Überall", "forum": "Forum", "ikhaya": "Ikhaya",
                       "planet": "Planet", "wiki": "Wiki"};

    // search area in which the user wants find something; defaults to active app
    var selectedArea = $("form.search").attr("data-active-app");

    // via the popup a differnt searcharea is selected
    var popup = $('<ul class="search_area" />');
    var popupBuild = false;

    // init the values of searchField with default values
    var searchField = $('.search_query')
    searchField.addClass('area_' + selectedArea);
    searchField.attr('placeholder', searchAreas[selectedArea]);

    /* as the user wants to start the search, the search is limited to the
     * selected subdomain. The last information is added by prefixing the
     * searchwords with `site:example.org` in a hidden field.
     * The search engine will only recognize the value of the hidden input.
     */
    document.getElementsByClassName("search")[0].onsubmit = (function() {
      $('form.search input[name=query]').val( function() {
        var searchWords = searchField.val();

        switch(selectedArea) {
          case "forum":
            return "site:forum.ubuntuusers.de " + searchWords;
          case "ikhaya":
            return "site:ikhaya.ubuntuusers.de " + searchWords;
          case "planet":
            return "site:planet.ubuntuusers.de " + searchWords;
          case "wiki":
            return "site:wiki.ubuntuusers.de " + searchWords;
          default: // equals "portal"
            return "site:ubuntuusers.de " + searchWords;
        }
      });

      $('form.search input[name=host]').remove(); // remove to prevent two site:-parameters
    });

    var expander = $('<div class="search_expander" />');
    expander.click(function () {
      if (!popupBuild) {
        popupBuild = true;

        // build popup
        // for each area the user can search, insert a li to the ul/popup
        $.each(searchAreas, function (key, value) {
          var listItemArea = key;

          var item = $('<li />').text(value);
          item.addClass('area_' + key);
          item.click(function() {
            // update classes of searchField → change icon of area
            searchField.removeClass('area_' + selectedArea);
            selectedArea = listItemArea;
            searchField.addClass('area_' + selectedArea);

            // update .active-class in the popup list
            // → current selected item will be displayed bold
            $('li.active', popup).removeClass('active');
            $(this).addClass('active');

            searchField.attr('placeholder', value);
            searchField.focus();

            popup.toggle();
          }).appendTo(popup);

          if (listItemArea === selectedArea) item.addClass('active');
        });

        popup.prependTo('form.search');
      } else { // popupBuild = true
         popup.toggle();
      }
    });
    $('form.search').append(expander);

    $(document).click(function (e) {
      if(e.target.className != "search_expander") {
        popup.hide();
      }
    });

    /* quickfix for Firefox
     * otherwise the searchbutton will stay disabled, if you go back one page
     * see https://bugzilla.mozilla.org/show_bug.cgi?id=443289#c6
     */
    window.addEventListener('pageshow', PageShowHandler, false);
    window.addEventListener('unload', UnloadHandler, false);

    function PageShowHandler() {
        window.addEventListener('unload', UnloadHandler, false);
    }

    function UnloadHandler() {
        window.removeEventListener('unload', UnloadHandler, false);
    }
  })();

  // add a sidebar toggler if there is an sidebar
  (function () {
    var sidebar = $('.navi_sidebar');
    if (!sidebar.length) return;
    var togglebutton =
    $('<button class="navi_toggle_up" title="Navigation ausblenden" />').click(function () {
      $('.content').toggleClass('content_sidebar');
      sidebar.toggle();
      togglebutton.toggleClass('navi_toggle_up').toggleClass('navi_toggle_down');
      if ($IS_LOGGED_IN) $.get('/?__service__=portal.toggle_sidebar', {
        hide: !sidebar.is(':visible'),
        component: window.location.hostname.split('.')[0]
      });
      return false;
    }).insertAfter('form.search');
    if ($SIDEBAR_HIDDEN) togglebutton.click();
  })();

  // use javascript to deactivate the submit button on click
  // we don't make the elements really disabled because then
  // the button won't appear in the form data transmitted
  (function () {
    var submitted = false;
    $('form').submit(function () {
      if ($(this).hasClass('nosubmitprotect')) return true;
      if (submitted) return false;
      $('input[type="submit"]').addClass('disabled');
      submitted = true;
    });
  })();

  // add links to the "package" macro
  $('.package-list-apturl, .package-list').each(function (i, elm) {
    var tmp = $('.bash', elm);
    var apt = tmp[0];
    var aptitude = tmp[1];
    $(aptitude).hide();
    $($('p', elm)[0]).append(
      $('<a>apt-get</a>').click(function () {
        $(this).parent().children().css('font-weight', '');
        $(this).css('font-weight', 'bold');
        $(apt).show();
        $(aptitude).hide();
      }).click(),
      ' ',
      $('<a>aptitude</a>').click(function () {
        $(this).parent().children().css('font-weight', '');
        $(this).css('font-weight', 'bold');
        $(aptitude).show();
        $(apt).hide();
     })
    );
    if ($(elm).hasClass('package-list-apturl')) {
      $($('p', elm)[0]).append(
        ' ',
        $('<a>apturl</a>').attr('href', 'apt://' + $.trim($(apt).text()).split(' ').slice(3).join(','))
      );
    }
  });

  $('div.code').add('pre.notranslate').each(function () {
    if (this.clientHeight < this.scrollHeight) {
      $(this).before('<div class="codeblock_resizer">vergrößern</div>')
             .css('height', '15em').css('max-height', 'none')
             .data('original_height', this.clientHeight);
    }
  });

  (function () {
    if (navigator.appName.toLowerCase() == 'konqueror') return;
    $('.codeblock_resizer').click(function () {
      $codeblock = $(this).next();
      if (!$codeblock.hasClass('codeblock_expanded')) {
        $codeblock.addClass('codeblock_expanded');
        $codeblock.animate({
          'height': $codeblock[0].scrollHeight
        }, 500);
        $(this).text('verkleinern');
      } else {
        $codeblock.removeClass('codeblock_expanded');
        $codeblock.animate({
          'height': $codeblock.data('original_height')
        }, 500);
        $(this).text('vergrößern');
      }
    });
  })();

  // Add a version switcher to the `PPA` template.
  (function () {
    var SHORT_NOTATION_VERSIONS = ['karmic', 'lucid', 'maverick'];

    var set_version = function (dom) {
      var link = $(dom);
      group = link.parent().parent();
      version = link.text().toLowerCase();
      group.find('.ppa-code').remove();
      sel = group.find('.selector');

      link.addClass('active').siblings('a').removeClass('active');

      sel.after('<pre class="ppa-code">' + group.data('long_notation_text').replace(/VERSION/, version) + '</div></pre>');
      if ($.inArray(version, SHORT_NOTATION_VERSIONS) > -1) {
        sel.after('<p class="ppa-code">Für die <strong>sources.list</strong>:</p>');
        sel.after('<p class="ppa-code">' + group.data('short_notation_text') + '</p>');
      }
      return false;
    };

    $('.ppa-list-outer').each(function () {
      $this = $(this);
      var versions = [],
          version;
      classes = this.className.split(/\s+/);
      for (var i = 0; i < classes.length; i++) {
        if (classes[i].match(/^ppa-version-/)) {
          version = classes[i].slice(12);
          versions.push(version);
        }
      }

      $this.data('short_notation_text', $this.find('.ppa-list-short-code .contents p').html());
      $this.data('long_notation_text', $this.find('.ppa-list-long-code .contents pre').html());

      $this.children('.contents').remove();
      sel = $('<p class="selector">').appendTo($this);
      sel.prepend('<strong>Version: </strong>');
      var set_version_callback = function () {
        return set_version(this);
      };
      for (var i = 0; i < versions.length; i++) {
        version = versions[i];
        latest_link = $('<a href="#">').text(version.substr(0, 1).toUpperCase() + version.substr(1))
                                       .click(set_version_callback).appendTo(sel).after('<span class="linklist"> | </span>');
      }
      latest_link.next('.linklist').remove(); // remove last |
      set_version(latest_link[0]);
    });
  })();

  // Add a version switcher to the `Fremdquelle` template.
  (function () {
    var set_version = function (link) {
      version = $(link).text().toLowerCase();
      $(link).addClass('active').siblings('a').removeClass('active');
      sel = $(link).parent();
      sel.siblings('pre').text(sel.data('deb-url-orig').replace(/VERSION/, version));
      return false;
    };

    $('.thirdpartyrepo-outer').each(function () {
      var versions = [],
          set_version_callback = function () {
          return set_version(this);
          },
          last_link;
      classes = this.className.split(/\s+/);
      for (var i = 0; i < classes.length; i++) {
        if (classes[i].match(/^thirdpartyrepo-version-/)) {
          version = classes[i].slice(23);
          versions.push(version);
        }
      }
      sel = $('<div class="selector">').insertBefore($(this).find('.contents pre'));
      sel.prepend('<strong>Version: </strong>').data('deb-url-orig', $(this).find('.contents pre').text());
      for (var i = 0; i < versions.length; i++) {
        last_link = $('<a href="#">').text(versions[i].substr(0, 1).toUpperCase() + versions[i].substr(1))
                                      .click(set_version_callback).appendTo(sel).after('<span class="linklist"> | </span>');
      }
      last_link.next().remove(); // remove last |
      set_version(last_link[0]);
      return true;
    });
  })();

  // the following lines add the JavaScript administration layer. Therefor we first remove
  // css legacy support (hover tags and icons will be visible) and add each element a JS class.
  // Later, each click on `#admin_layer_button` will iterate through all tags with `admin_link_js`
  // class and toggle their visibility.
  // alert(document.cookie);
  var result = /admin_menu\=([01])/.exec(document.cookie);
  var menu_status = (result != null) ? result[1] : 1;
  if (menu_status == 1) {
    $('.admin_link').removeClass('admin_link').addClass('admin_link_js').show();
    $('#admin_layer_button').addClass('highlight');
  } else {
    $('.admin_link').removeClass('admin_link').addClass('admin_link_js').hide();
  }
  $('.admin_link_hover').removeClass('admin_link_hover');
  $('#admin_layer_button').click(function () {
    $('.admin_link_js').each(function() {
      if ($(this).css('display') != 'none') {
        $(this).fadeOut("fast", function () {$(this).hide();});
      } else {
        $(this).fadeIn("fast", function () {$(this).show();});
      }
    });
    menu_status = (menu_status == 0) ? 1 : 0;
    if (menu_status == 1) {
      $('#admin_layer_button').addClass('highlight');
    } else {
      $('#admin_layer_button').removeClass('highlight');
    }
    var admin_cookie = new Date();
    var admin_cookie_expires = admin_cookie.getTime() + (365 * 24 * 60 * 60 * 1000);
    admin_cookie.setTime(admin_cookie_expires);
    var exp = "expires=" + admin_cookie.toGMTString();
    var dom;
    if ($BASE_DOMAIN_NAME.indexOf(":") > 0) {
      dom = "domain=." + $BASE_DOMAIN_NAME.substring(0, $BASE_DOMAIN_NAME.indexOf(":"));
    } else {
      dom = "domain=." + $BASE_DOMAIN_NAME;
    }
    document.cookie = "admin_menu=" + menu_status + "; " + exp + "; " + dom + "; path=/";
  });
});

String.prototype.htmlEscape = function () {
  return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/, "&quot;");
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
