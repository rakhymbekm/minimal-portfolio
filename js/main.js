(
  function () {
    var navAppearance = function (type='onload') {
      
      var navList = document.querySelector('.main-menu ul'),
          hamburger = document.querySelector('.navbars');

      var styleOfNav = window.getComputedStyle(navList);
      
      if (type === 'load') {
          hamburger.addEventListener('click', function () {
            if (styleOfNav.display === 'none') {
              navList.style.display = 'block';
            }
            else if (styleOfNav.display === 'block') {
              navList.style.display = 'none';
            }
          }, false);
        }
        else if (type === 'resize') {
          if (window.innerWidth <= 1080) {
            navList.style.display = 'none';
            hamburger.style.display = 'block';
          }
          else {
            navList.style.display = 'block';
            hamburger.style.display = 'none';
          }         
        }

        

    };

    var getClassOfTargetSection = function (hash) {
      return '.' + hash.slice(1, hash.length);
    };

    var scrollToTargetSection = function (targetTop) {
      jQuery('html, body').animate({
        scrollTop: targetTop
      }, 1300);
    };

    var backToTop = function () {
      scrollToTargetSection(0);
    };

    var navHandle = function () {
      document.querySelectorAll('.main-menu ul li').forEach(function (item) {
        
        item.addEventListener('click', function (e) {
          e.preventDefault();
          
          var classOfTargetSection = getClassOfTargetSection(item.querySelector('a').hash);

          if (classOfTargetSection === '.main-header') {
            backToTop();
          }
          else {            
            var targetEl = jQuery(classOfTargetSection);

            // надо закончить вычисление промежутка между секциями
            // вычисления padding-top: (targetEl.innerHeight() - targetEl.height()) / 2 )
            // теперь надо вычислить padding предыдущего элемента, в случае, если padding текущего элемента равен нулю
            // также нужно вычислить margin-top текущего элемента, 
            // и margin-top предыдущего элемента, в случае если margin-top текущего равен нулю
            
            if (classOfTargetSection === '.my-vision') {
              scrollToTargetSection(targetEl.offset().top);
            }
            else {
              scrollToTargetSection(targetEl.offset().top - 40);
            }
          }
        }, false);
      });
    };

    var backToTopBtnHandle = function () {
      var button = document.querySelector('.back-to-top'),
          heightOfMainHeader = parseFloat(window.getComputedStyle(document.querySelector('.main-header')).height);

      button.addEventListener('click', backToTop, false);

      window.addEventListener('scroll', function () {
        if (window.pageYOffset > heightOfMainHeader) {
          button.style.display = 'block';
        }
        
        if (window.pageYOffset <= heightOfMainHeader) {
          button.style.display = 'none';
        }
      }, false);
      
    };

    var escapeHtml = function (unsafe) {
      return unsafe
           .replace(/&/g, "&amp;")
           .replace(/</g, "&lt;")
           .replace(/>/g, "&gt;")
           .replace(/"/g, "&quot;")
           .replace(/'/g, "&#039;");
   }

    var formValidate = function (typedName, typedEmail, typedMsg) {
      
      if ((typedName.length < 2 || typedName.length > 50) &&
          (typedEmail.length < 5 || typedEmail.length > 62) && // sample: s@s.s
          (typedEmail.indexOf('@') === (-1) || (typedEmail.match(/@/g) || []).length >= 2) && // only one occurence of '@' is allowed
          typedEmail.indexOf('.') === (-1) &&
          typedMsg.length == 0) {
            // there is an error
            return false;
      }
      else if (typedEmail.lastIndexOf('.') < typedEmail.indexOf('@')) { // second level domain name is required
        // there is an error
        return false;
      }

      return true;
    };

    var submitForm = function () {
      var contactForm = document.querySelector('.contact form');
      
      var url = contactForm.getAttribute('action');
      
      // var nameInput = contactForm.querySelector('input[type="text"]');
      // var nameLabel = nameInput.getAttribute('name');
      // var nameValue = nameInput.value;
      
      // var emailInput = contactForm.querySelector('input[type="email"]');
      // var emailLabel = emailInput.getAttribute('name');
      // var emailValue = emailInput.value;

      // var messageInput = contactForm.querySelector('textarea');
      // var messageLabel = messageInput.getAttribute('name');
      // var messageValue = messageInput.value;
      
      var data = $('.contact form').serialize();
     
      $.ajax({
        url: url,
        type: 'POST',
        cashe: false,
        data: data,
        dataType: 'json',
        success: function () {
          // show successful message
        },
        error: function () {
          // show error message
        }
      });

      return false; // to prevent unplanned submits
    };

    var formHandle = function () {

      var sendingForm = document.querySelector('.contact form'),
          name = document.querySelector('.contact input[type="text"]'),
          email = document.querySelector('.contact input[type="email"]'),
          msg = document.querySelector('.contact textarea');

      sendingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var typedName = name.value,
            typedEmail = email.value,
            typedMsg = msg.value;

        if (formValidate(typedName, typedEmail, typedMsg)) {
          escapeHtml(typedMsg);
          // send the form
          console.log('good');
        }
        else {
          // show an error msg
          console.log('error');
        }
      }, false);
    };
    
    var mainHandler = function (e) {
      navAppearance(e.type);
      if (e.type === 'load') {
        navHandle();
        backToTopBtnHandle();
        formHandle();
      }
    };

    window.addEventListener('load', mainHandler, false);
    window.addEventListener('resize', mainHandler, false);
  }
)()
