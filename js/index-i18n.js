(function () {
  var STORAGE_KEY = "naturmilk-index-lang";

  var copy = {
    en: {
      "nav.shop": "Shop",
      "nav.about": "About Us",
      "nav.blog": "Blog",
      "nav.allProducts": "All Products",
      "nav.buyOnline": "Order Online",

      "aria.openMenu": "Open menu",
      "aria.siteMenu": "Site menu",
      "aria.mobileMenu": "Mobile menu",
      "aria.mainMenu": "Main menu",
      "aria.scrollDown": "Scroll down",
      "aria.scrollTop": "Back to top",
      "aria.social": "Social media",
      "aria.switchEn": "Switch to English",
      "aria.switchKa": "Switch to Georgian",

      "hero.title": "Natural<br />Dairy Products",
      "hero.cta": "View Products",

      "intro.lead":
        "A family farm where every product is made with clean, fresh ingredients and everyday care.",

      "shop.title": "Our<br />Products",
      "product.buy": "Buy",
      "product.new": "New",
      "product.burrata": "Burrata",
      "product.imeruli": "Imeruli",
      "product.marble": "Marble Cheese",
      "shop.allProducts": "All Products",

      "scroller.cheese": "Cheese",
      "scroller.yogurt": "Yogurt",
      "scroller.matsoni": "Matsoni",
      "scroller.butter": "Butter",

      "categories.title": "Shop by Category",
      "categories.freshCheese": "Fresh Cheese",
      "categories.milkMatsoni": "Milk & Matsoni",
      "categories.desserts": "Desserts",

      "feature.title": "Natural Breakfast Set",
      "feature.desc":
        "Choose Natur Milk\u2019s special set \u2014 handmade cheese, creamy yogurt, and butter that make the perfect Georgian breakfast. Everything is made on our own farm, with no additives or palm oil.",
      "feature.point1": "100% milk from our farm",
      "feature.point2": "No preservatives",
      "feature.cta": "Order the Set Now",

      "visit.title": "Visit Us In Person",
      "visit.caption": "8 D. Guramishvili St",

      "reviews.title": "What Our Customers Say",
      "review.0.text":
        "Your yogurt is amazing \u2014 my kids love it. It\u2019s real milk, not powder. Really good.",
      "review.0.name": "Nino, Tbilisi",
      "review.1.text":
        "The sulguni tastes exactly like the one my grandmother made when I was a child. Delicious!",
      "review.1.name": "Maka, Tbilisi",
      "review.2.text":
        "I ordered the set for the first time and our guests loved it \u2014 they immediately asked where everything was from. Highly recommend!",
      "review.2.name": "Mariam, Tbilisi",
      "review.3.text":
        "Fast delivery, good packaging, and most importantly nothing tastes artificial. I recommend it.",
      "review.3.name": "Nutia, Tbilisi",
      "review.4.text":
        "The cheese really tastes natural. I order every week and it\u2019s consistently great.",
      "review.4.name": "Tamari, Tbilisi",
      "review.5.text":
        "What matters most to us is natural products. Thank you for the quality.",
      "review.5.name": "Lela, Kutaisi",

      "blog.title": "How We Make Our Products",
      "blog.0.label": "A Top Pick for Fine Restaurants",
      "blog.1.label": "Why Farm-Fresh Milk Makes All the Difference",
      "blog.2.label": "Health Comes First in Everything We Make",

      "news.dome": "New<br />Products",
      "news.season": "Spring 2026",
      "news.title": "Stay in Touch",
      "news.copy":
        "Get new products,<br />farm stories, and inspiration straight to your inbox.",
      "news.placeholder": "Enter your email",
      "news.submit": "Send",

      "bts.title": "Follow Us on Facebook",

      "footer.subscribe": "Subscribe and join the Natur Milk community",
      "footer.home": "Home",
      "footer.shop": "Shop",
      "footer.blog": "Blog",
      "footer.contact": "Contact",
      "footer.about": "About Us",
      "footer.terms": "Terms & Conditions",
      "footer.privacy": "Privacy Policy",
      "footer.credit": "\u00a9 2026 Natur Milk. All rights reserved.",

      "alt.logo": "Natur Milk logo",
      "alt.burrata": "Sulguni cheese",
      "alt.imeruli": "Imeruli cheese",
      "alt.marble": "Yogurt product",
      "alt.catCheese": "Fresh cheese category",
      "alt.catMilk": "Yogurt and matsoni category",
      "alt.catDessert": "Dairy desserts category",
      "alt.feature": "Natur Milk farm churn",
      "alt.sign": "Natur Milk sign \u2014 8 D. Guramishvili St",
      "alt.blog0": "Article about fresh cheese",
      "alt.blog1": "Article about farm milk",
      "alt.blog2": "Article about the Natur Milk family",
      "alt.bts0": "Farm photo 1",
      "alt.bts1": "Farm photo 2",
      "alt.bts2": "Farm photo 3",
      "alt.bts3": "Farm photo 4",
      "alt.bts4": "Farm photo 5",
    },
  };

  var ka = {
    "nav.shop": "მაღაზია",
    "nav.about": "ჩვენს შესახებ",
    "nav.blog": "ბლოგი",
    "nav.allProducts": "ყველა პროდუქტი",
    "nav.buyOnline": "შეიძინე ონლაინ",

    "aria.openMenu": "მენიუს გახსნა",
    "aria.siteMenu": "საიტის მენიუ",
    "aria.mobileMenu": "მობილური მენიუ",
    "aria.mainMenu": "ძირითადი მენიუ",
    "aria.scrollDown": "დაწიე ქვემოთ",
    "aria.scrollTop": "მაღლა",
    "aria.social": "სოციალური გვერდები",
    "aria.switchEn": "Switch to English",
    "aria.switchKa": "ქართულზე გადართვა",

    "hero.title": "ნატურალური<br />რძის პროდუქტები",
    "hero.cta": "პროდუქტების ნახვა",

    "intro.lead":
      "ოჯახური ფერმა, სადაც თითოეული პროდუქტი მზადდება სუფთა ნედლეულით და ყოველდღიური ზრუნვით.",

    "shop.title": "ჩვენი<br />პროდუქტები",
    "product.buy": "ყიდვა",
    "product.new": "სიახლე",
    "product.burrata": "ბურატა",
    "product.imeruli": "იმერული",
    "product.marble": "მარმარილოს ყველი",
    "shop.allProducts": "ყველა პროდუქტი",

    "scroller.cheese": "ყველი",
    "scroller.yogurt": "იოგურტი",
    "scroller.matsoni": "მაწონი",
    "scroller.butter": "კარაქი",

    "categories.title": "შეიძინე კატეგორიების მიხედვით",
    "categories.freshCheese": "ახალი ყველი",
    "categories.milkMatsoni": "რძე და მაწონი",
    "categories.desserts": "დესერტები",

    "feature.title": "ნატურალური საუზმის ნაკრები",
    "feature.desc":
      "აირჩიე Natur Milk–ის სპეციალური ნაკრები — ხელით დამზადებული ყველი, ნაღებიანი იოგურტი და კარაქი, რომლებიც სრულყოფილ ქართულ საუზმეს გიმზადებს. ყველაფერი მზადდება ჩვენსავე ფერმაში, დამატკბობების და პალმის ცხიმის გარეშე.",
    "feature.point1": "100% ჩვენი ფერმის რძე",
    "feature.point2": "არანაირი კონსერვანტი",
    "feature.cta": "შეუკვეთე ნაკრები ახლა",

    "visit.title": "გვესტუმრეთ ადგილზე",
    "visit.caption": "დ. გურამიშვილის N 8",

    "reviews.title": "რას ამბობენ მომხმარებლები",
    "review.0.text":
      "იოგურტი გაქვთ საოცრება, შვილებს უყვართ. ნამდვილი რძეა და არა ფხვნილი, ძალიან კარგია.",
    "review.0.name": "ნინო, თბილისი",
    "review.1.text":
      "სულგუნს ზუსტად ისეთი გემო აქვს, როგორსაც ბავშვობაში ბებიაჩემი მიკეთებდა. უგემრიელესი!!",
    "review.1.name": "მაკა, თბილისი",
    "review.2.text":
      "პირველად შევუკვეთე ნაკრები და სტუმრებს ძალიან მოეწონათ, ეგრევე გამომკითხეს ყველაფერი. რეკომენდაცია ჩემგანაც!",
    "review.2.name": "მარიამი, თბილისი",
    "review.3.text":
      "მიწოდება სწრაფია, შეფუთვაც კაია და მთავარი არაფერი აქვს ხელოვნური გემო. გირჩევთ",
    "review.3.name": "ნათია, თბილისი",
    "review.4.text":
      "ყველის გემო ნამდვილად ნატურალურია. ყოველ კვირას ვუკვეთავ და სტაბილურად სასიამოვნო.",
    "review.4.name": "თამარი, თბილისი",
    "review.5.text":
      "რაც ჩვენთვის ყველაზე მთავარია ნატურალური პროდუქტები. გმადლობთ ხარისხისთვის.",
    "review.5.name": "ლელა, ქუთაისი",

    "blog.title": "როგორ ვამზადებთ ჩვენს პროდუქტებს",
    "blog.0.label": "საუკეთესო რესტორნების არჩევანი",
    "blog.1.label": "რატომ არის ფერმის რძე განსაკუთრებული",
    "blog.2.label": "ჯანმრთელობა პირველია ჩვენს პროდუქტში",

    "news.dome": "ახალი <br /> პროდუქცია",
    "news.season": "გაზაფხული 2026",
    "news.title": "დარჩი ჩვენთან",
    "news.copy":
      "მიიღე ახალი პროდუქტები,<br />ფერმის ამბები და შთაგონება პირდაპირ ელფოსტაზე.",
    "news.placeholder": "შეიყვანე შენი ელფოსტა",
    "news.submit": "გაგზავნა",

    "bts.title": "გამოგყვევი Facebook-ზე",

    "footer.subscribe": "გამოიწერე და გახდი ნატურმილქის წევრი",
    "footer.home": "მთავარი",
    "footer.shop": "მაღაზია",
    "footer.blog": "ბლოგი",
    "footer.contact": "კონტაქტი",
    "footer.about": "ჩვენს შესახებ",
    "footer.terms": "წესები და პირობები",
    "footer.privacy": "კონფიდენციალურობის პოლიტიკა",
    "footer.credit": "© 2026 Natur Milk. ყველა უფლება დაცულია.",

    "alt.logo": "Natur Milk ლოგო",
    "alt.burrata": "სულგუნის ყველი",
    "alt.imeruli": "იმერული ყველი",
    "alt.marble": "იოგურტის პროდუქტი",
    "alt.catCheese": "ახალი ყველის კატეგორია",
    "alt.catMilk": "იოგურტისა და მაწვნის კატეგორია",
    "alt.catDessert": "რძის ნაწარმის კატეგორია",
    "alt.feature": "Natur Milk ფერმის ძროხა",
    "alt.sign": "Natur Milk საინგი — დ. გურამიშვილის N 8",
    "alt.blog0": "სტატია ახალ ყველზე",
    "alt.blog1": "სტატია ფერმის რძეზე",
    "alt.blog2": "სტატია Natur Milk-ის ოჯახზე",
    "alt.bts0": "ფერმის კადრი 1",
    "alt.bts1": "ფერმის კადრი 2",
    "alt.bts2": "ფერმის კადრი 3",
    "alt.bts3": "ფერმის კადრი 4",
    "alt.bts4": "ფერმის კადრი 5",
  };

  function getStrings(lang) {
    return lang === "en" ? copy.en : ka;
  }

  function applyLang(lang) {
    var strings = getStrings(lang);
    var isEn = lang === "en";

    document.documentElement.lang = isEn ? "en" : "ka";
    document.body.classList.toggle("lang-en", isEn);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var value = strings[key];
      if (!value) return;
      if (el.hasAttribute("data-i18n-html")) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      var value = strings[key];
      if (value) el.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var value = strings[key];
      if (value) el.setAttribute("placeholder", value);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      var value = strings[key];
      if (value) el.setAttribute("alt", value);
    });

    var switchBtn = document.querySelector(".lang-switch");
    if (switchBtn) {
      switchBtn.textContent = isEn ? "KA" : "EN";
      switchBtn.setAttribute("aria-label", strings[isEn ? "aria.switchKa" : "aria.switchEn"]);
      switchBtn.setAttribute("aria-pressed", isEn ? "true" : "false");
    }

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function getInitialLang() {
    try {
      var params = new URLSearchParams(window.location.search);
      var queryLang = params.get("lang");
      if (queryLang === "en" || queryLang === "ka") return queryLang;
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "ka") return saved;
    } catch (e) {}
    return "ka";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var switchBtn = document.querySelector(".lang-switch");
    if (!switchBtn) return;

    var currentLang = getInitialLang();
    applyLang(currentLang);

    switchBtn.addEventListener("click", function () {
      currentLang = currentLang === "en" ? "ka" : "en";
      applyLang(currentLang);
    });
  });
})();
