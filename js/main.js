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

    var formValidate = function (name, email, msg) {

      var validateEmail = function (typedEmail) {        
  
        if (typedEmail.length < 5 || typedEmail.length > 62) { // sample: s@s.s
           return 'email has an invalid length';
        }
  
        if ( typedEmail.indexOf('@') === (-1) ) {
          return 'there is no an "at" symbol';
        }
        
        if ( (typedEmail.match(/@/g) || []).length >= 2 ) {
          return 'only one "at" symbol allowed';
        }
  
        if ( typedEmail.indexOf('.') === (-1) ) {
          return 'there should be at least one dot in an email';
        }
  
        if ( !( typedEmail.lastIndexOf('.') > typedEmail.indexOf('@') ) ) {
          return 'second level domain name is required';
        }

        if ( typedEmail.lastIndexOf('.') == typedEmail.length - 1 ) {
          return 'dot shouldn\'t be last in the line';
        }

        return '';
      };

      var typedName = name.value,
      typedEmail = email.value,
      typedMsg = msg.value;
      
      var errors = {
        name: { msg: [], el: name },
        email: { msg: [], el: email },
        message: { msg: [], el: msg }
      };

      if (typedName.length < 2 || typedName.length > 50) {
        errors.name.msg.push('name is invalid');
      }

      var emailErrorMsg = validateEmail(typedEmail);

      if (emailErrorMsg.length != 0) {
        errors.email.msg.push(emailErrorMsg);
      }

      if (typedMsg.length == 0) {
        errors.message.msg.push('message shouldn\'t be empty');
      }
      if ( errors.name.msg.length != 0 ||
           errors.email.msg.length != 0 ||
           errors.message.msg.length != 0 ) {
        return errors;
      }

      return false;
    };

    var showErrorMsg = function (err) { // err = { type: 'validation / ajax', data: errors / errMsg }
      
      var contentHTML = '';

      var addErrMsg = function (msg) {
        if (contentHTML.length != 0) {
          msg = '<br>' + msg;
        }
        contentHTML += msg; // it's closure, so contentHTML is available here
      };

      var updateMsgBox = function (contentHTML) {
        var msgBox = document.querySelector('.contact .msg');
        // if (msgBox.innerHTML.length != 0) {
        //   contentHTML = '<br>' + contentHTML;
        // }
        msgBox.innerHTML = contentHTML;
        msgBox.style.display = 'block';
      };
      
      var generateMsg = function (arrayOfMsgs) {
        var concatenated = '';

        arrayOfMsgs.forEach(function (singleMsg) {
          concatenated += singleMsg + '<br>';
        });

        return concatenated;
      };
      
      switch (err.type) {
        case 'validation':
          if (err.data.name.msg.length != 0) {            
            err.data.name.el.classList.add('err');            
            addErrMsg( generateMsg(err.data.name.msg) );
          }
          else if (err.data.name.el.classList.contains('err')) {
            err.data.name.el.classList.remove('err');
          }
          if (err.data.email.msg.length != 0) {       
            err.data.email.el.classList.add('err');            
            addErrMsg( generateMsg(err.data.email.msg) );
          }
          else if (err.data.email.el.classList.contains('err')) {
            err.data.email.el.classList.remove('err');
          }
          if (err.data.message.msg.length != 0) {       
            err.data.message.el.classList.add('err');            
            addErrMsg( generateMsg(err.data.message.msg) );
          }
          else if (err.data.message.el.classList.contains('err')) {
            err.data.message.el.classList.remove('err');
          }
          break;
        case 'ajax':

          break;
      }

      if (contentHTML.length != 0) {
        updateMsgBox(contentHTML);
      }
    }
    var submitForm = function () {
      var contactForm = document.querySelector('.contact form');
      
      var url = contactForm.getAttribute('action');
      
      var data = $('.contact form').serialize();
     
      $.ajax({
        url: url,
        type: 'POST',
        cashe: false,
        data: data,
        dataType: 'json',
        success: function () {
          // show successful message
          console.log('successful');
        },
        error: function () {
          // show error message
          console.log('failed');
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

        var errors = formValidate(name, email, msg);

        if (errors) {
          showErrorMsg({
            type: 'validation',
            data: errors
          });
        }
        
        // if () {
          
        //   // send the form
        //   console.log('good');
        // }
        // else {
        //   // show an error msg
        //   console.log('error');
        // }
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