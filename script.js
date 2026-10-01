(function() {
    // ======================== ذرات پس‌زمینه ========================
    const starsContainer = document.getElementById('starsContainer');
    if (starsContainer) {
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            const s = Math.random() * 2.2 + 0.7;
            star.style.width = s + 'px';
            star.style.height = s + 'px';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.setProperty('--dur', (Math.random() * 3.5 + 2) + 's');
            star.style.setProperty('--delay', (Math.random() * 5) + 's');
            star.style.setProperty('--size', s + 'px');
            starsContainer.appendChild(star);
        }
    }

    const particlesContainer = document.getElementById('particlesContainer');
    if (particlesContainer) {
        function createParticles() {
            particlesContainer.innerHTML = '';
            for (let i = 0; i < 30; i++) {
                const p = document.createElement('div');
                p.classList.add('particle');
                p.style.left = Math.random() * 100 + '%';
                p.style.bottom = '-15px';
                p.style.setProperty('--float-dur', (Math.random() * 11 + 7) + 's');
                p.style.setProperty('--float-delay', (Math.random() * 9) + 's');
                p.style.setProperty('--drift', (Math.random() * 70 - 35) + 'px');
                const sz = Math.random() * 2.5 + 1.2;
                p.style.width = sz + 'px';
                p.style.height = sz + 'px';
                particlesContainer.appendChild(p);
            }
        }
        createParticles();
        setInterval(createParticles, 18000);
    }

    // ======================== مدیریت تم ========================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    if (themeToggle) {
        if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light-theme');
            themeToggle.textContent = '☀️';
        } else {
            themeToggle.textContent = '🌙';
        }
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark');
            themeToggle.textContent = body.classList.contains('light-theme') ? '☀️' : '🌙';
        });
    }

    // ======================== منوی همبرگری ========================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        const backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        document.body.appendChild(backdrop);

        const openMenu = () => {
            navLinks.classList.add('active');
            backdrop.classList.add('active');
            document.body.classList.add('menu-open');
            menuToggle.textContent = '✕';
        };
        const closeMenu = () => {
            navLinks.classList.remove('active');
            backdrop.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.textContent = '☰';
        };
        menuToggle.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) closeMenu();
            else openMenu();
        });
        backdrop.addEventListener('click', closeMenu);
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) closeMenu();
        });
    }

    // ======================== توابع کمکی ========================
    function rad(deg) { return deg * Math.PI / 180; }
    function deg(rad) { return rad * 180 / Math.PI; }
    function formatNum(n) {
        if (!isFinite(n)) return '-';
        const rounded = Math.round(n);
        return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // ======================== توابع تبدیل تاریخ ========================
    const shamsiMonthNames = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
    const shamsiWeekdayNames = ['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'];
    const hijriMonthNames = ['محرم','صفر','ربیع‌الاول','ربیع‌الثانی','جمادی‌الاول','جمادی‌الثانی','رجب','شعبان','رمضان','شوال','ذی‌القعده','ذی‌الحجه'];
    const hijriWeekdayNames = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
    const miladiMonthNamesFa = ['ژانویه','فوریه','مارس','آوریل','مه','ژوئن','ژوئیه','اوت','سپتامبر','اکتبر','نوامبر','دسامبر'];
    const miladiWeekdayNamesFa = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];

    function gregorianToJD(y, m, d) {
        let a = Math.floor((14 - m) / 12);
        let Y = y + 4800 - a;
        let M = m + 12 * a - 3;
        return d + Math.floor((153 * M + 2) / 5) + 365 * Y + Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045;
    }
    function jdToGregorian(jd) {
        let a = jd + 32044;
        let b = Math.floor((4 * a + 3) / 146097);
        let c = a - Math.floor((146097 * b) / 4);
        let d = Math.floor((4 * c + 3) / 1461);
        let e = c - Math.floor((1461 * d) / 4);
        let m = Math.floor((5 * e + 2) / 153);
        let day = e - Math.floor((153 * m + 2) / 5) + 1;
        let month = m + 3 - 12 * Math.floor(m / 10);
        let year = 100 * b + d - 4800 + Math.floor(m / 10);
        return { year, month, day };
    }
    function isShamsiLeap(year) {
        let a = year + 2346;
        let b = a % 2820;
        if (b === 2819) return false;
        let c = b % 128;
        if (c === 0) return true;
        if (c === 127) return false;
        let d = c % 33;
        if (d === 0) return true;
        if (d === 32) return false;
        return (d % 4) === 0;
    }
    function gregorianToShamsi(gy, gm, gd) {
        const jd = gregorianToJD(gy, gm, gd);
        const refJD = 2451625;
        const refYear = 1379;
        let days = jd - refJD;
        let y = refYear;
        if (days >= 0) {
            while (true) {
                let yd = isShamsiLeap(y) ? 366 : 365;
                if (days < yd) break;
                days -= yd;
                y++;
            }
        } else {
            while (days < 0) {
                y--;
                days += isShamsiLeap(y) ? 366 : 365;
            }
        }
        const ml = [31,31,31,31,31,31,30,30,30,30,30,29];
        if (isShamsiLeap(y)) ml[11] = 30;
        let month = 0;
        for (let i = 0; i < 12; i++) {
            if (days < ml[i]) break;
            days -= ml[i];
            month++;
        }
        return { year: y, month: month + 1, day: days + 1, jd };
    }
    function shamsiToJD(sy, sm, sd) {
        if (sy < 1379) {
            let days = 0;
            for (let y = sy; y < 1379; y++) days += isShamsiLeap(y) ? 366 : 365;
            return 2451625 - days + sd - 1;
        }
        let days = 0;
        for (let y = 1379; y < sy; y++) days += isShamsiLeap(y) ? 366 : 365;
        const ml = [31,31,31,31,31,31,30,30,30,30,30,29];
        if (isShamsiLeap(sy)) ml[11] = 30;
        for (let i = 0; i < sm - 1; i++) days += ml[i];
        return 2451625 + days + sd - 1;
    }
    const hijriEpochJD = 1948440;
    const cycleDays = 10631;
    const leapInCycle = [2,5,7,10,13,16,18,21,24,26,29];
    function gregorianToHijri(gy, gm, gd) {
        const jd = gregorianToJD(gy, gm, gd);
        let daysSince = jd - hijriEpochJD;
        let cycles = Math.floor(daysSince / cycleDays);
        let rem = daysSince % cycleDays;
        if (rem < 0) { rem += cycleDays; cycles--; }
        let yic = 0;
        for (let i = 0; i < 30; i++) {
            let yd = leapInCycle.includes(i + 1) ? 355 : 354;
            if (rem < yd) break;
            rem -= yd;
            yic++;
        }
        let hy = cycles * 30 + yic + 1;
        const ml = [30,29,30,29,30,29,30,29,30,29,30,29];
        if (leapInCycle.includes(yic + 1)) ml[11] = 30;
        let hm = 0;
        for (let i = 0; i < 12; i++) {
            if (rem < ml[i]) break;
            rem -= ml[i];
            hm++;
        }
        return { year: hy, month: hm + 1, day: rem + 1 };
    }
    function hijriToJD(hy, hm, hd) {
        let cycles = Math.floor((hy - 1) / 30);
        let yic = (hy - 1) % 30;
        let days = cycles * cycleDays;
        for (let i = 0; i < yic; i++) days += leapInCycle.includes(i + 1) ? 355 : 354;
        const ml = [30,29,30,29,30,29,30,29,30,29,30,29];
        if (leapInCycle.includes(yic + 1)) ml[11] = 30;
        for (let i = 0; i < hm - 1; i++) days += ml[i];
        return hijriEpochJD + days + hd - 1;
    }
    function getDayOfWeek(jd) { return (jd + 1) % 7; }
    function getShamsiWeekday(jd) { return (getDayOfWeek(jd) + 1) % 7; }
    function getSeason(month) { return month <= 3 ? 'بهار 🌸' : month <= 6 ? 'تابستان ☀️' : month <= 9 ? 'پاییز 🍂' : 'زمستان ❄️'; }
    function getIranDateTime() {
        const now = new Date();
        const fmt = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Tehran',
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });
        const parts = fmt.formatToParts(now);
        const obj = {};
        parts.forEach(p => { if (p.type !== 'literal') obj[p.type] = p.value; });
        return { year: +obj.year, month: +obj.month, day: +obj.day, hour: +obj.hour, minute: +obj.minute, second: +obj.second };
    }

    // ======================== بانک مناسبت‌ها ========================
    const fixedShamsiEvents = [
        [1,1,'نوروز - آغاز سال نو',true],
        [2,1,'عید نوروز',true],
        [3,1,'عید نوروز',true],
        [4,1,'عید نوروز',true],
        [12,1,'روز جمهوری اسلامی ایران',true],
        [13,1,'روز طبیعت',true],
        [6,1,'زادروز زرتشت'],
        [7,1,'روز هنرهای نمایشی'],
        [10,1,'شهادت مدرس، روز مجلس'],
        [15,1,'روز ذخایر ژنتیکی و زیستی'],
        [18,1,'روز سلامتی'],
        [20,1,'روز ملی فناوری هسته‌ای'],
        [21,1,'شهادت امیر سپهبد علی صیاد شیرازی'],
        [25,1,'روز بزرگداشت عطار نیشابوری'],
        [27,1,'روز فرهنگ پهلوانی و ورزش زورخانه‌ای'],
        [29,1,'روز ارتش جمهوری اسلامی ایران'],
        [31,1,'روز گندم و نان'],
        [1,2,'روز بزرگداشت سعدی'],
        [2,2,'روز زمین، تأسیس سپاه'],
        [3,2,'روز بزرگداشت شیخ بهایی'],
        [5,2,'شکست حمله نظامی آمریکا در طبس'],
        [7,2,'روز ایمنی حمل و نقل'],
        [10,2,'روز ملی خلیج فارس'],
        [11,2,'روز جهانی کارگر'],
        [12,2,'شهادت مطهری، روز معلم'],
        [13,2,'روز تجلیل از امامزادگان'],
        [14,2,'روز بزرگداشت احمد بن موسی (ع)'],
        [15,2,'روز بزرگداشت شیخ صدوق'],
        [18,2,'روز بیماری‌های خاص'],
        [19,2,'روز بزرگداشت شیخ کلینی'],
        [24,2,'لغو امتیاز تنباکو'],
        [25,2,'بزرگداشت فردوسی'],
        [28,2,'بزرگداشت خیام، روز موزه'],
        [30,2,'روز ملی جمعیت'],
        [31,2,'روز اهدای عضو'],
        [1,3,'روز بزرگداشت ملاصدرا'],
        [3,3,'فتح خرمشهر'],
        [4,3,'روز دزفول'],
        [14,3,'رحلت امام خمینی (ره)',true],
        [15,3,'قیام ۱۵ خرداد',true],
        [20,3,'روز صنایع دستی و فرش'],
        [27,3,'روز جهاد کشاورزی'],
        [29,3,'درگذشت دکتر شریعتی'],
        [31,3,'روز خانواده و تکریم بازنشستگان'],
        [1,4,'روز تبلیغات اسلامی'],
        [5,4,'روز تجلیل از اسرا'],
        [6,4,'بزرگداشت محتشم کاشانی'],
        [7,4,'روز قوه قضاییه'],
        [10,4,'روز صنعت و معدن'],
        [12,4,'روز افشای حقوق بشر آمریکایی'],
        [14,4,'روز قلم'],
        [18,4,'روز ادبیات کودکان'],
        [21,4,'روز عفاف و حجاب'],
        [22,4,'بزرگداشت خوارزمی'],
        [25,4,'روز بهزیستی'],
        [26,4,'تأسیس شورای نگهبان'],
        [4,5,'بزرگداشت شیخ صفی‌الدین'],
        [5,5,'عملیات مرصاد'],
        [8,5,'بزرگداشت سهروردی'],
        [9,5,'روز اهدای خون'],
        [10,5,'روز سلمان فارسی'],
        [14,5,'فرمان مشروطیت'],
        [17,5,'روز خبرنگار'],
        [18,5,'روز شهدای مدافع حرم'],
        [21,5,'حمایت از صنایع کوچک'],
        [22,5,'تشکل‌ها و مشارکت اجتماعی'],
        [26,5,'آغاز بازگشت آزادگان'],
        [28,5,'کودتای ۲۸ مرداد'],
        [30,5,'روز جهانی مسجد'],
        [1,6,'روز ابن سینا، روز پزشک'],
        [2,6,'هفته دولت'],
        [4,6,'روز کارمند'],
        [5,6,'روز داروسازی'],
        [8,6,'روز مبارزه با تروریسم'],
        [11,6,'روز صنعت چاپ'],
        [12,6,'روز مبارزه با استعمار'],
        [13,6,'بزرگداشت ابوریحان بیرونی'],
        [17,6,'قیام ۱۷ شهریور'],
        [18,6,'روز وقف'],
        [20,6,'روز سینما'],
        [27,6,'روز شعر و ادب فارسی'],
        [31,6,'آغاز هفته دفاع مقدس'],
        [1,7,'بازگشایی مدارس'],
        [4,7,'روز سرباز'],
        [5,7,'روز گردشگری'],
        [7,7,'روز آتش‌نشانی'],
        [8,7,'بزرگداشت مولوی'],
        [13,7,'روز نیروی انتظامی'],
        [16,7,'روز جهانی کودک'],
        [20,7,'بزرگداشت حافظ'],
        [26,7,'روز تربیت بدنی'],
        [1,8,'بزرگداشت بیهقی'],
        [13,8,'روز دانش‌آموز'],
        [14,8,'روز فرهنگ عمومی'],
        [24,8,'روز کتاب و کتابخوانی'],
        [5,9,'روز بسیج'],
        [7,9,'روز نیروی دریایی'],
        [9,9,'بزرگداشت شیخ مفید'],
        [16,9,'روز دانشجو'],
        [25,9,'روز پژوهش'],
        [9,10,'روز بصیرت'],
        [13,10,'شهادت سردار سلیمانی'],
        [19,10,'قیام ۱۹ دی'],
        [22,10,'بزرگداشت خواجه عبدالله انصاری'],
        [1,11,'بزرگداشت حکیم صهبا'],
        [12,11,'بازگشت امام خمینی'],
        [22,11,'پیروزی انقلاب اسلامی',true],
        [5,12,'بزرگداشت حضرت فاطمه (س)'],
        [8,12,'روز امور تربیتی'],
        [15,12,'روز درختکاری'],
        [22,12,'روز بزرگداشت شهدا'],
        [29,12,'ملی شدن صنعت نفت']
    ];

    const islamicEvents = [
        { m: 1, d: 9, title: 'تاسوعا', holiday: true },
        { m: 1, d: 10, title: 'عاشورا', holiday: true },
        { m: 1, d: 12, title: 'شهادت امام سجاد (ع)', holiday: false },
        { m: 1, d: 25, title: 'شهادت امام سجاد (ع) به روایتی', holiday: false },
        { m: 2, d: 7, title: 'شهادت امام حسن (ع) به روایتی', holiday: false },
        { m: 2, d: 20, title: 'اربعین حسینی', holiday: true },
        { m: 2, d: 28, title: 'رحلت پیامبر (ص) و شهادت امام حسن (ع)', holiday: true },
        { m: 2, d: 30, title: 'شهادت امام رضا (ع)', holiday: true },
        { m: 3, d: 8, title: 'شهادت امام حسن عسکری (ع)', holiday: true },
        { m: 3, d: 12, title: 'ولادت پیامبر (روایت اهل سنت)', holiday: false },
        { m: 3, d: 17, title: 'ولادت پیامبر (ص) و امام صادق (ع)', holiday: true },
        { m: 4, d: 8, title: 'ولادت امام حسن عسکری (ع)', holiday: false },
        { m: 4, d: 10, title: 'وفات حضرت معصومه (س)', holiday: false },
        { m: 7, d: 13, title: 'ولادت امام علی (ع) و روز پدر', holiday: true },
        { m: 7, d: 27, title: 'مبعث رسول اکرم', holiday: true },
        { m: 8, d: 15, title: 'ولادت حضرت مهدی (عج)', holiday: true },
        { m: 9, d: 21, title: 'شهادت حضرت علی (ع)', holiday: true },
        { m: 10, d: 1, title: 'عید سعید فطر', holiday: true },
        { m: 10, d: 2, title: 'عید سعید فطر', holiday: true },
        { m: 10, d: 25, title: 'شهادت امام جعفر صادق (ع)', holiday: true },
        { m: 11, d: 1, title: 'ولادت حضرت معصومه (س) و روز دختران', holiday: false },
        { m: 11, d: 11, title: 'ولادت امام رضا (ع)', holiday: false },
        { m: 11, d: 29, title: 'شهادت امام محمد تقی (ع)', holiday: false },
        { m: 12, d: 1, title: 'ازدواج امام علی (ع) و حضرت فاطمه (س)', holiday: false },
        { m: 12, d: 6, title: 'شهادت زائران خانه خدا', holiday: false },
        { m: 12, d: 7, title: 'شهادت امام محمد باقر (ع)', holiday: false },
        { m: 12, d: 10, title: 'عید سعید قربان', holiday: true },
        { m: 12, d: 15, title: 'ولادت امام هادی (ع)', holiday: false },
        { m: 12, d: 18, title: 'عید غدیر خم', holiday: true },
        { m: 12, d: 20, title: 'ولادت امام موسی کاظم (ع)', holiday: false },
        { m: 12, d: 24, title: 'روز مباهله', holiday: false }
    ];

    function getOccasionForYear(shYear) {
        const db = {};
        fixedShamsiEvents.forEach(([d, m, desc, holiday]) => {
            const key = `${d}/${m}`;
            if (!db[key]) db[key] = { events: [], holiday: false };
            db[key].events.push(desc);
            if (holiday) db[key].holiday = true;
        });
        const firstDayGreg = jdToGregorian(shamsiToJD(shYear, 1, 1));
        const firstHijriYear = gregorianToHijri(firstDayGreg.year, firstDayGreg.month, firstDayGreg.day).year;
        for (let hy = firstHijriYear; hy <= firstHijriYear + 1; hy++) {
            islamicEvents.forEach(ev => {
                const jd = hijriToJD(hy, ev.m, ev.d) - 1;
                const g = jdToGregorian(jd);
                const sh = gregorianToShamsi(g.year, g.month, g.day);
                if (sh.year === shYear) {
                    const key = `${sh.day}/${sh.month}`;
                    if (!db[key]) db[key] = { events: [], holiday: false };
                    db[key].events.push(ev.title);
                    if (ev.holiday) db[key].holiday = true;
                }
            });
        }
        return db;
    }

    // ======================== آیکون زمان ========================
    function updateTimeIcon() {
        const icon = document.getElementById('timeIcon');
        if (!icon) return;
        const iran = getIranDateTime();
        const dayOfYear = getDayOfYear(iran.year, iran.month, iran.day);
        const { sunrise, sunset } = estimateSunTimes(dayOfYear);
        const hour = iran.hour + iran.minute / 60;
        let emoji;
        if (hour >= sunrise && hour < sunrise + 0.5) emoji = '🌅';
        else if (hour >= sunrise + 0.5 && hour < sunset - 0.5) emoji = '☀️';
        else if (hour >= sunset - 0.5 && hour < sunset + 0.5) emoji = '🌇';
        else emoji = '🌙';
        icon.textContent = emoji;
    }
    function estimateSunTimes(dayOfYear) {
        const sunriseBase = 6.2;
        const sunsetBase = 18.2;
        const amplitude = 1.2;
        const dayRad = (dayOfYear - 80) * (2 * Math.PI / 365);
        return { sunrise: sunriseBase - amplitude * Math.sin(dayRad), sunset: sunsetBase + amplitude * Math.sin(dayRad) };
    }
    function getDayOfYear(year, month, day) {
        return Math.floor((new Date(year, month - 1, day) - new Date(year, 0, 0)) / 86400000);
    }
    updateTimeIcon();
    setInterval(updateTimeIcon, 60000);

    // ======================== صفحه اصلی ========================
    if (document.getElementById('homeView')) {
        const liveClock = document.getElementById('liveClock');
        function updateClock() {
            const iran = getIranDateTime();
            liveClock.innerHTML = `${String(iran.hour).padStart(2,'0')}:${String(iran.minute).padStart(2,'0')}:<span class="live-seconds">${String(iran.second).padStart(2,'0')}</span>`;
        }
        setInterval(updateClock, 1000);
        updateClock();
        let currentOffset = 0;
        function updateAllDisplays() {
            const iran = getIranDateTime();
            const targetJD = gregorianToJD(iran.year, iran.month, iran.day) + currentOffset;
            const g = jdToGregorian(targetJD);
            const sh = gregorianToShamsi(g.year, g.month, g.day);
            const hi = gregorianToHijri(g.year, g.month, g.day);
            document.getElementById('shamsiDay').textContent = sh.day;
            document.getElementById('shamsiMonth').textContent = shamsiMonthNames[sh.month-1];
            document.getElementById('shamsiYear').textContent = sh.year;
            document.getElementById('shamsiWeekday').textContent = shamsiWeekdayNames[getShamsiWeekday(targetJD)];
            document.getElementById('seasonBadge').textContent = getSeason(sh.month);
            const db = getOccasionForYear(sh.year);
            const entry = db[`${sh.day}/${sh.month}`];
            const occasionEl = document.getElementById('shamsiOccasion');
            const occasionTextEl = document.getElementById('occasionText');
            if (entry && entry.events.length > 0) {
                occasionEl.style.display = 'flex';
                occasionTextEl.innerHTML = entry.events.map(ev => `<span>${ev}</span>`).join('');
                if (entry.holiday) occasionTextEl.querySelectorAll('span').forEach(s => s.style.color = '#ff6b6b');
                else occasionTextEl.querySelectorAll('span').forEach(s => s.style.color = '');
            } else {
                occasionEl.style.display = 'none';
            }
            document.getElementById('hijriDay').textContent = hi.day;
            document.getElementById('hijriMonth').textContent = hijriMonthNames[hi.month-1];
            document.getElementById('hijriYear').textContent = hi.year + ' هـ.ق';
            document.getElementById('hijriWeekday').textContent = hijriWeekdayNames[getDayOfWeek(targetJD)];
            document.getElementById('miladiDay').textContent = g.day;
            document.getElementById('miladiMonth').textContent = miladiMonthNamesFa[g.month-1];
            document.getElementById('miladiYear').textContent = g.year + ' م';
            document.getElementById('miladiWeekday').textContent = miladiWeekdayNamesFa[getDayOfWeek(targetJD)];
            document.getElementById('footerYear').textContent = sh.year;
            document.getElementById('todayBtn').textContent = currentOffset !== 0 ? '📌 برگشت به امروز' : '📌 امروز';
        }
        document.getElementById('prevDayBtn').addEventListener('click', () => { currentOffset--; updateAllDisplays(); });
        document.getElementById('nextDayBtn').addEventListener('click', () => { currentOffset++; updateAllDisplays(); });
        document.getElementById('todayBtn').addEventListener('click', () => { currentOffset = 0; updateAllDisplays(); });
        updateAllDisplays();
    }

    // ======================== صفحه تقویم ========================
    if (document.getElementById('calendarView')) {
        let calYear, calMonth;
        function renderCalendar() {
            if (!calYear) {
                const iran = getIranDateTime();
                const sh = gregorianToShamsi(iran.year, iran.month, iran.day);
                calYear = sh.year;
                calMonth = sh.month;
            }
            document.getElementById('calMonthYear').textContent = `${shamsiMonthNames[calMonth-1]} ${calYear}`;
            const daysInMonth = calMonth <= 6 ? 31 : calMonth <= 11 ? 30 : (isShamsiLeap(calYear) ? 30 : 29);
            const jdFirst = shamsiToJD(calYear, calMonth, 1);
            const startDow = getShamsiWeekday(jdFirst);
            const today = getIranDateTime();
            const shToday = gregorianToShamsi(today.year, today.month, today.day);
            const isCurrentMonth = (calYear === shToday.year && calMonth === shToday.month);
            const db = getOccasionForYear(calYear);
            const grid = document.getElementById('daysGrid');
            grid.innerHTML = '';
            let dayCount = 1;
            for (let r = 0; r < 6; r++) {
                for (let c = 0; c < 7; c++) {
                    const cell = document.createElement('div');
                    cell.classList.add('day-cell');
                    if (r === 0 && c < startDow) cell.classList.add('empty');
                    else if (dayCount > daysInMonth) cell.classList.add('empty');
                    else {
                        const currentJD = shamsiToJD(calYear, calMonth, dayCount);
                        const gDate = jdToGregorian(currentJD);
                        const hijriDate = gregorianToHijri(gDate.year, gDate.month, gDate.day);
                        cell.innerHTML = `<span class="shamsi-num">${dayCount}</span><span class="other-nums">${gDate.day}م | ${hijriDate.day}ق</span>`;
                        const key = `${dayCount}/${calMonth}`;
                        if (db[key] && db[key].holiday) cell.classList.add('holiday');
                        if (isCurrentMonth && dayCount === shToday.day) cell.classList.add('today');
                        dayCount++;
                    }
                    grid.appendChild(cell);
                }
            }
            const eventsList = document.getElementById('eventsList');
            eventsList.innerHTML = '';
            for (let d = 1; d <= daysInMonth; d++) {
                const key = `${d}/${calMonth}`;
                if (db[key]) {
                    const div = document.createElement('div');
                    div.className = 'event-item';
                    div.textContent = `${d} ${shamsiMonthNames[calMonth-1]}: ${db[key].events.join(' • ')}`;
                    eventsList.appendChild(div);
                }
            }
        }
        document.getElementById('prevMonthBtn').addEventListener('click', () => { if (calMonth === 1) { calMonth = 12; calYear--; } else calMonth--; renderCalendar(); });
        document.getElementById('nextMonthBtn').addEventListener('click', () => { if (calMonth === 12) { calMonth = 1; calYear++; } else calMonth++; renderCalendar(); });
        renderCalendar();
    }

    // ======================== صفحه تبدیل تاریخ ========================
    if (document.getElementById('convertView')) {
        const sourceCalendar = document.getElementById('sourceCalendar');
        const inputYear = document.getElementById('inputYear');
        const inputMonth = document.getElementById('inputMonth');
        const inputDay = document.getElementById('inputDay');
        function getMonthNames(calType) { return calType === 'shamsi' ? shamsiMonthNames : calType === 'hijri' ? hijriMonthNames : miladiMonthNamesFa; }
        function getMaxDays(calType, year, month) {
            if (calType === 'shamsi') { if (month <= 6) return 31; if (month <= 11) return 30; return isShamsiLeap(year) ? 30 : 29; }
            if (calType === 'hijri') { if ([1,3,5,7,9,11].includes(month)) return 30; if (month === 12) { const yic = (year-1)%30; return leapInCycle.includes(yic+1) ? 30 : 29; } return 29; }
            const ml = [31,28,31,30,31,30,31,31,30,31,30,31];
            if (month === 2) return ((year%4===0&&year%100!==0)||year%400===0) ? 29 : 28;
            return ml[month-1];
        }
        function populateMonthDropdown() {
            const calType = sourceCalendar.value;
            inputMonth.innerHTML = '';
            getMonthNames(calType).forEach((name, idx) => {
                const opt = document.createElement('option');
                opt.value = idx+1;
                opt.textContent = name;
                inputMonth.appendChild(opt);
            });
            const iran = getIranDateTime();
            if (calType === 'shamsi') { const sh = gregorianToShamsi(iran.year, iran.month, iran.day); inputMonth.value = sh.month; inputYear.value = sh.year; }
            else if (calType === 'hijri') { const hi = gregorianToHijri(iran.year, iran.month, iran.day); inputMonth.value = hi.month; inputYear.value = hi.year; }
            else { inputMonth.value = iran.month; inputYear.value = iran.year; }
            populateDayDropdown();
        }
        function populateDayDropdown() {
            const year = parseInt(inputYear.value) || 1405;
            const month = parseInt(inputMonth.value) || 1;
            const maxDays = getMaxDays(sourceCalendar.value, year, month);
            inputDay.innerHTML = '';
            for (let d = 1; d <= maxDays; d++) {
                const opt = document.createElement('option');
                opt.value = d;
                opt.textContent = d;
                inputDay.appendChild(opt);
            }
            inputDay.value = Math.min(parseInt(inputDay.value) || 1, maxDays);
        }
        function performConversion() {
            const calType = sourceCalendar.value;
            const year = parseInt(inputYear.value);
            const month = parseInt(inputMonth.value);
            const day = parseInt(inputDay.value);
            if (!year || !month || !day) return;
            let jd, gDate;
            if (calType === 'shamsi') { jd = shamsiToJD(year, month, day); gDate = jdToGregorian(jd); }
            else if (calType === 'hijri') { jd = hijriToJD(year, month, day); gDate = jdToGregorian(jd); }
            else { jd = gregorianToJD(year, month, day); gDate = {year, month, day}; }
            const sh = gregorianToShamsi(gDate.year, gDate.month, gDate.day);
            const hi = gregorianToHijri(gDate.year, gDate.month, gDate.day);
            document.getElementById('resShamsi').textContent = `${sh.day} ${shamsiMonthNames[sh.month-1]} ${sh.year}`;
            document.getElementById('resHijri').textContent = `${hi.day} ${hijriMonthNames[hi.month-1]} ${hi.year} هـ.ق`;
            document.getElementById('resMiladi').textContent = `${gDate.day} ${miladiMonthNamesFa[gDate.month-1]} ${gDate.year} م`;
        }
        sourceCalendar.addEventListener('change', () => { populateMonthDropdown(); performConversion(); });
        inputMonth.addEventListener('change', () => { populateDayDropdown(); performConversion(); });
        inputYear.addEventListener('change', () => { populateDayDropdown(); performConversion(); });
        inputDay.addEventListener('change', performConversion);
        document.getElementById('convertBtn').addEventListener('click', performConversion);
        populateMonthDropdown();
        performConversion();
    }

    // ======================== صفحه اوقات شرعی ========================
    if (document.getElementById('prayerView')) {
        const cities = [
            { name: 'تهران', lat: 35.6892, lon: 51.3890 },
            { name: 'کرج', lat: 35.8400, lon: 50.9391 },
            { name: 'قم', lat: 34.6416, lon: 50.8746 },
            { name: 'اصفهان', lat: 32.6546, lon: 51.6680 },
            { name: 'مشهد', lat: 36.2605, lon: 59.6168 },
            { name: 'شیراز', lat: 29.5918, lon: 52.5837 },
            { name: 'تبریز', lat: 38.0667, lon: 46.3000 },
            { name: 'اهواز', lat: 31.3183, lon: 48.6706 },
            { name: 'کرمانشاه', lat: 34.3142, lon: 47.0650 },
            { name: 'ارومیه', lat: 37.5527, lon: 45.0760 },
            { name: 'رشت', lat: 37.2808, lon: 49.5832 },
            { name: 'زاهدان', lat: 29.4963, lon: 60.8629 },
            { name: 'کرمان', lat: 30.2839, lon: 57.0834 },
            { name: 'بندرعباس', lat: 27.1865, lon: 56.2808 },
            { name: 'همدان', lat: 34.7983, lon: 48.5148 },
            { name: 'اراک', lat: 34.0954, lon: 49.7013 },
            { name: 'یزد', lat: 31.8974, lon: 54.3569 },
            { name: 'اردبیل', lat: 38.2498, lon: 48.2933 },
            { name: 'زنجان', lat: 36.6831, lon: 48.5087 },
            { name: 'قزوین', lat: 36.2688, lon: 50.0041 },
            { name: 'سنندج', lat: 35.3119, lon: 46.9964 },
            { name: 'خرم‌آباد', lat: 33.4878, lon: 48.3558 },
            { name: 'بوشهر', lat: 28.9684, lon: 50.8385 },
            { name: 'ایلام', lat: 33.6374, lon: 46.4227 },
            { name: 'بیرجند', lat: 32.8649, lon: 59.2211 },
            { name: 'بجنورد', lat: 37.4750, lon: 57.3333 },
            { name: 'ساری', lat: 36.5659, lon: 53.0586 },
            { name: 'گرگان', lat: 36.8387, lon: 54.4347 },
            { name: 'سمنان', lat: 35.5769, lon: 53.3950 },
            { name: 'شهرکرد', lat: 32.3256, lon: 50.8644 },
            { name: 'یاسوج', lat: 30.6684, lon: 51.5875 },
            { name: 'کاشان', lat: 33.9833, lon: 51.4333 },
            { name: 'نجف‌آباد', lat: 32.6347, lon: 51.3667 },
            { name: 'نیشابور', lat: 36.2133, lon: 58.7958 },
            { name: 'سبزوار', lat: 36.2128, lon: 57.6814 },
            { name: 'بابل', lat: 36.5510, lon: 52.6789 },
            { name: 'آمل', lat: 36.4697, lon: 52.3507 },
            { name: 'مراغه', lat: 37.3892, lon: 46.2397 },
            { name: 'خوی', lat: 38.5503, lon: 44.9521 },
            { name: 'دزفول', lat: 32.3825, lon: 48.4020 },
            { name: 'آبادان', lat: 30.3473, lon: 48.2934 },
            { name: 'گنبد کاووس', lat: 37.2500, lon: 55.1672 },
            { name: 'چابهار', lat: 25.2919, lon: 60.6430 },
            { name: 'کیش', lat: 26.5333, lon: 53.9667 }
        ];
        let currentCity = cities[0];
        function populateCitySelect() {
            const select = document.getElementById('citySelect');
            cities.forEach(city => {
                const opt = document.createElement('option');
                opt.value = city.name;
                opt.textContent = city.name;
                select.appendChild(opt);
            });
            select.value = currentCity.name;
        }
        populateCitySelect();
        document.getElementById('citySelect').addEventListener('change', (e) => {
            const selected = cities.find(c => c.name === e.target.value);
            if (selected) { currentCity = selected; renderPrayerTimes(); }
        });
        let currentPrayerTimes = null;
        let prayerDayOffset = 0;
        function sunPosition(jd) {
            const T = (jd - 2451545.0) / 36525;
            const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;
            const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
            const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(rad(M)) + (0.019993 - 0.000101 * T) * Math.sin(2 * rad(M)) + 0.000289 * Math.sin(3 * rad(M));
            const trueLong = L0 + C;
            const omega = 125.04 - 1934.136 * T;
            const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(rad(omega));
            const eps0 = 23 + 26 / 60 + 21.448 / 3600 - 46.815 / 3600 * T - 0.00059 / 3600 * T * T + 0.001813 / 3600 * T * T * T;
            const eps = eps0 + 0.00256 * Math.cos(rad(omega));
            const delta = Math.asin(Math.sin(rad(eps)) * Math.sin(rad(lambda)));
            const RA = Math.atan2(Math.cos(rad(eps)) * Math.sin(rad(lambda)), Math.cos(rad(lambda)));
            const GMST = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000) % 360;
            const LST = GMST + currentCity.lon;
            const H = LST - deg(RA);
            return { delta: deg(delta), H };
        }
        function sunAltitude(jd) {
            const pos = sunPosition(jd);
            return deg(Math.asin(Math.sin(rad(currentCity.lat)) * Math.sin(rad(pos.delta)) + Math.cos(rad(currentCity.lat)) * Math.cos(rad(pos.delta)) * Math.cos(rad(pos.H))));
        }
        function interpolateTime(t1, t2, a1, a2, target) { return t1 + (t2 - t1) * (target - a1) / (a2 - a1); }
        function computeDayTimes(year, month, day) {
            const jd0 = gregorianToJD(year, month, day) - 0.5;
            const startJD = jd0 - 3.5 / 24;
            const step = 1 / 1440;
            const times = { fajr: null, sunrise: null, noon: null, sunset: null, maghrib: null };
            let maxAlt = -Infinity, maxAltTime = 0;
            let prevAlt = null, prevTime = null;
            for (let i = 0; i <= 1440; i++) {
                const jd = startJD + i * step;
                const alt = sunAltitude(jd);
                const localTime = i / 60;
                if (i > 0) {
                    if (prevAlt < -17.7 && alt >= -17.7 && times.fajr === null) times.fajr = interpolateTime(prevTime, localTime, prevAlt, alt, -17.7);
                    if (prevAlt < -0.833 && alt >= -0.833 && times.sunrise === null) times.sunrise = interpolateTime(prevTime, localTime, prevAlt, alt, -0.833);
                    if (prevAlt > -0.833 && alt <= -0.833 && times.sunset === null) times.sunset = interpolateTime(prevTime, localTime, prevAlt, alt, -0.833);
                    if (prevAlt > -4.5 && alt <= -4.5 && times.maghrib === null) times.maghrib = interpolateTime(prevTime, localTime, prevAlt, alt, -4.5);
                }
                if (alt > maxAlt) { maxAlt = alt; maxAltTime = localTime; }
                prevAlt = alt; prevTime = localTime;
            }
            times.noon = maxAltTime;
            return times;
        }
        function getPrayerTimes(year, month, day) {
            const today = computeDayTimes(year, month, day);
            const nextG = jdToGregorian(gregorianToJD(year, month, day) + 1);
            const tomorrow = computeDayTimes(nextG.year, nextG.month, nextG.day);
            const midnightRaw = (today.sunset + 24 + tomorrow.fajr) / 2;
            const midnight = midnightRaw >= 24 ? midnightRaw - 24 : midnightRaw;
            return { ...today, midnight };
        }
        function formatTime(hours) { const h = Math.floor(hours); const m = Math.floor((hours - h) * 60); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; }
        function formatCountdown(totalSeconds) { const h = Math.floor(totalSeconds / 3600); const m = Math.floor((totalSeconds % 3600) / 60); const s = Math.floor(totalSeconds % 60); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; }
        function renderPrayerTimes() {
            const iran = getIranDateTime();
            const targetJD = gregorianToJD(iran.year, iran.month, iran.day) + prayerDayOffset;
            const g = jdToGregorian(targetJD);
            const sh = gregorianToShamsi(g.year, g.month, g.day);
            currentPrayerTimes = getPrayerTimes(g.year, g.month, g.day);
            document.getElementById('prayerCityTitle').textContent = `🕌 اوقات شرعی ${currentCity.name}`;
            document.getElementById('prayerDate').textContent = `${shamsiWeekdayNames[getShamsiWeekday(targetJD)]} ${sh.day} ${shamsiMonthNames[sh.month-1]} ${sh.year}`;
            document.getElementById('timeFajr').textContent = formatTime(currentPrayerTimes.fajr);
            document.getElementById('timeSunrise').textContent = formatTime(currentPrayerTimes.sunrise);
            document.getElementById('timeNoon').textContent = formatTime(currentPrayerTimes.noon);
            document.getElementById('timeMaghrib').textContent = formatTime(currentPrayerTimes.maghrib);
            document.getElementById('timeMidnight').textContent = formatTime(currentPrayerTimes.midnight);
            document.getElementById('nextPrayerBox').style.display = prayerDayOffset !== 0 ? 'none' : 'block';
            if (prayerDayOffset === 0) updateCountdown();
        }
        function updateCountdown() {
            const iran = getIranDateTime();
            const nowHours = iran.hour + iran.minute/60 + iran.second/3600;
            const events = [
                { name: 'اذان صبح', time: currentPrayerTimes.fajr },
                { name: 'طلوع آفتاب', time: currentPrayerTimes.sunrise },
                { name: 'اذان ظهر', time: currentPrayerTimes.noon },
                { name: 'اذان مغرب', time: currentPrayerTimes.maghrib },
                { name: 'نیمه شب شرعی', time: currentPrayerTimes.midnight }
            ];
            let nextEvent = null;
            for (const ev of events) if (ev.time > nowHours) { nextEvent = ev; break; }
            if (!nextEvent) {
                const tomorrow = jdToGregorian(gregorianToJD(iran.year, iran.month, iran.day)+1);
                const tomorrowTimes = getPrayerTimes(tomorrow.year, tomorrow.month, tomorrow.day);
                const tomorrowFajr = tomorrowTimes.fajr;
                nextEvent = { name: 'اذان صبح فردا', time: tomorrowFajr };
                document.getElementById('nextPrayerName').textContent = nextEvent.name;
                document.getElementById('nextPrayerCountdown').textContent = formatCountdown((tomorrowFajr + 24 - nowHours)*3600);
            } else {
                document.getElementById('nextPrayerName').textContent = nextEvent.name;
                document.getElementById('nextPrayerCountdown').textContent = formatCountdown((nextEvent.time - nowHours)*3600);
            }
        }
        document.getElementById('prayerPrevDay').addEventListener('click', () => { prayerDayOffset--; renderPrayerTimes(); });
        document.getElementById('prayerNextDay').addEventListener('click', () => { prayerDayOffset++; renderPrayerTimes(); });
        document.getElementById('prayerToday').addEventListener('click', () => { prayerDayOffset = 0; renderPrayerTimes(); });
        renderPrayerTimes();
        setInterval(() => { if (prayerDayOffset === 0) updateCountdown(); }, 1000);
    }

    // ======================== صفحه ابزارها ========================
    if (document.getElementById('toolsView')) {
        const params = new URLSearchParams(window.location.search);
        const activeTool = params.get('tool');
        if (activeTool) {
            const btn = document.querySelector(`.tool-btn[data-tool="${activeTool}"]`);
            const panel = document.getElementById(`panel-${activeTool}`);
            if (btn && panel) {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                panel.classList.add('active');
            }
        }
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`panel-${btn.dataset.tool}`).classList.add('active');
            });
        });

        // ======================== ماشین حساب پیشرفته ========================
        let calcExpression = '';
        const calcDisplay = document.getElementById('calcDisplay');
        function updateCalcDisplay() { calcDisplay.textContent = calcExpression || '0'; }

        const MathFuncs = {
            sin: d => Math.sin(d * Math.PI / 180),
            cos: d => Math.cos(d * Math.PI / 180),
            tan: d => Math.tan(d * Math.PI / 180),
            log: Math.log10,
            ln: Math.log,
            sqrt: Math.sqrt,
            factorial: function factorial(n) {
                if (n < 0 || !Number.isInteger(n)) return NaN;
                if (n > 170) return Infinity;
                let f = 1;
                for (let i = 2; i <= n; i++) f *= i;
                return f;
            },
            PI: Math.PI,
            E: Math.E
        };

        function evaluateCalc() {
            try {
                let expr = calcExpression;
                if (!expr.trim()) return;

                // بستن خودکار پرانتزهای باز
                const openCount = (expr.match(/\(/g) || []).length;
                const closeCount = (expr.match(/\)/g) || []).length;
                for (let i = 0; i < openCount - closeCount; i++) expr += ')';

                // تبدیل نمادها به معادل جاوااسکریپت
                expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
                expr = expr.replace(/π/g, 'PI');
                expr = expr.replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, 'E');
                expr = expr.replace(/√/g, 'sqrt');
                expr = expr.replace(/\^/g, '**');
                expr = expr.replace(/(\d+(?:\.\d+)?)!/g, 'factorial($1)');

                const func = new Function(
                    'sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'factorial', 'PI', 'E',
                    'return (' + expr + ')'
                );
                const result = func(
                    MathFuncs.sin, MathFuncs.cos, MathFuncs.tan,
                    MathFuncs.log, MathFuncs.ln, MathFuncs.sqrt,
                    MathFuncs.factorial, MathFuncs.PI, MathFuncs.E
                );

                if (typeof result !== 'number' || !isFinite(result)) {
                    calcDisplay.textContent = 'خطا';
                    calcExpression = '';
                    return;
                }

                let finalResult = Math.abs(result) < 1e-10 ? 0 : result;

                let displayValue;
                if (Number.isInteger(finalResult)) {
                    displayValue = String(finalResult);
                } else {
                    displayValue = String(parseFloat(finalResult.toFixed(10)));
                }

                calcDisplay.textContent = displayValue;
                calcExpression = displayValue;
            } catch (err) {
                calcDisplay.textContent = 'خطا';
                calcExpression = '';
            }
        }

        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                if (action === 'clear') calcExpression = '';
                else if (action === 'back') calcExpression = calcExpression.slice(0, -1);
                else if (action === 'equals') { evaluateCalc(); updateCalcDisplay(); return; }
                else if (action === 'percent') calcExpression += '/100';
                else if (action === 'num') calcExpression += btn.dataset.value;
                else if (action === 'add') calcExpression += '+';
                else if (action === 'subtract') calcExpression += '-';
                else if (action === 'multiply') calcExpression += '*';
                else if (action === 'divide') calcExpression += '/';
                else if (action === 'sin') calcExpression += 'sin(';
                else if (action === 'cos') calcExpression += 'cos(';
                else if (action === 'tan') calcExpression += 'tan(';
                else if (action === 'log') calcExpression += 'log(';
                else if (action === 'ln') calcExpression += 'ln(';
                else if (action === 'sqrt') calcExpression += '√(';
                else if (action === 'square') calcExpression += '^2';
                else if (action === 'power') calcExpression += '^';
                else if (action === 'factorial') calcExpression += '!';
                else if (action === 'pi') calcExpression += 'π';
                else if (action === 'e') calcExpression += 'e';
                else if (action === 'openParen') calcExpression += '(';
                else if (action === 'closeParen') calcExpression += ')';
                updateCalcDisplay();
            });
        });

        window.addEventListener('keydown', (e) => {
            const calcPanel = document.getElementById('panel-calculator');
            if (!calcPanel || !calcPanel.classList.contains('active')) return;
            const key = e.key;
            if (/^[0-9]$/.test(key)) calcExpression += key;
            else if (key === '+') calcExpression += '+';
            else if (key === '-') calcExpression += '-';
            else if (key === '*') calcExpression += '*';
            else if (key === '/') calcExpression += '/';
            else if (key === '.') calcExpression += '.';
            else if (key === 'Enter') { e.preventDefault(); evaluateCalc(); updateCalcDisplay(); return; }
            else if (key === 'Backspace') calcExpression = calcExpression.slice(0, -1);
            else if (key === 'Escape') calcExpression = '';
            else if (key === '(') calcExpression += '(';
            else if (key === ')') calcExpression += ')';
            else if (key === '^') calcExpression += '^';
            else return;
            updateCalcDisplay();
        });

        // ======================== تبدیل واحد ========================
        const unitCategories = {
            length: { label: 'طول (Length)', units: {
                meter:{name:'متر (Meter)', factor:1}, kilometer:{name:'کیلومتر (Kilometer)', factor:1000}, centimeter:{name:'سانتی‌متر (Centimeter)', factor:0.01}, millimeter:{name:'میلی‌متر (Millimeter)', factor:0.001}, micrometer:{name:'میکرومتر (Micrometer)', factor:0.000001}, nanometer:{name:'نانومتر (Nanometer)', factor:0.000000001}, mile:{name:'مایل (Mile)', factor:1609.344}, yard:{name:'یارد (Yard)', factor:0.9144}, foot:{name:'فوت (Foot)', factor:0.3048}, inch:{name:'اینچ (Inch)', factor:0.0254}, nauticalmile:{name:'مایل دریایی (Nautical Mile)', factor:1852}
            }},
            weight: { label: 'وزن (Weight)', units: {
                kg:{name:'کیلوگرم (Kilogram)', factor:1}, gram:{name:'گرم (Gram)', factor:0.001}, milligram:{name:'میلی‌گرم (Milligram)', factor:0.000001}, ton:{name:'تن (Ton)', factor:1000}, pound:{name:'پوند (Pound)', factor:0.45359237}, ounce:{name:'اونس (Ounce)', factor:0.0283495231}, carat:{name:'قیراط (Carat)', factor:0.0002}
            }},
            volume: { label: 'حجم (Volume)', units: {
                liter:{name:'لیتر (Liter)', factor:1}, milliliter:{name:'میلی‌لیتر (Milliliter)', factor:0.001}, cubicmeter:{name:'متر مکعب (Cubic Meter)', factor:1000}, cubiccentimeter:{name:'سانتی‌متر مکعب (Cubic Centimeter)', factor:0.001}, gallon:{name:'گالن آمریکایی (Gallon)', factor:3.785411784}, quart:{name:'کوارت (Quart)', factor:0.946352946}, pint:{name:'پینت (Pint)', factor:0.473176473}, cup:{name:'پیمانه (Cup)', factor:0.236588236}, tablespoon:{name:'قاشق غذاخوری (Tablespoon)', factor:0.0147868}, teaspoon:{name:'قاشق چای‌خوری (Teaspoon)', factor:0.00492892}
            }},
            temperature: { label: 'دما (Temperature)', units: {
                celsius:{name:'سانتی‌گراد (Celsius)', factor:1}, fahrenheit:{name:'فارنهایت (Fahrenheit)', factor:1}, kelvin:{name:'کلوین (Kelvin)', factor:1}
            }},
            area: { label: 'مساحت (Area)', units: {
                sqmeter:{name:'متر مربع (Square Meter)', factor:1}, sqkilometer:{name:'کیلومتر مربع (Square Kilometer)', factor:1000000}, hectare:{name:'هکتار (Hectare)', factor:10000}, sqfoot:{name:'فوت مربع (Square Foot)', factor:0.09290304}, sqyard:{name:'یارد مربع (Square Yard)', factor:0.83612736}, acre:{name:'ایکر (Acre)', factor:4046.8564224}
            }},
            speed: { label: 'سرعت (Speed)', units: {
                mps:{name:'متر بر ثانیه (m/s)', factor:1}, kmph:{name:'کیلومتر بر ساعت (km/h)', factor:0.277777778}, mph:{name:'مایل بر ساعت (mph)', factor:0.44704}, knot:{name:'گره (Knot)', factor:0.514444444}
            }},
            time: { label: 'زمان (Time)', units: {
                second:{name:'ثانیه (Second)', factor:1}, minute:{name:'دقیقه (Minute)', factor:60}, hour:{name:'ساعت (Hour)', factor:3600}, day:{name:'روز (Day)', factor:86400}, week:{name:'هفته (Week)', factor:604800}, month:{name:'ماه ۳۰ روز (Month)', factor:2592000}, year:{name:'سال ۳۶۵ روز (Year)', factor:31536000}
            }},
            energy: { label: 'انرژی (Energy)', units: {
                joule:{name:'ژول (Joule)', factor:1}, kilojoule:{name:'کیلوژول (Kilojoule)', factor:1000}, calorie:{name:'کالری (Calorie)', factor:4.184}, kilocalorie:{name:'کیلوکالری (Kilocalorie)', factor:4184}, watthour:{name:'وات‌ساعت (Watt Hour)', factor:3600}, kilowatthour:{name:'کیلووات‌ساعت (kWh)', factor:3600000}
            }},
            power: { label: 'توان (Power)', units: {
                watt:{name:'وات (Watt)', factor:1}, kilowatt:{name:'کیلووات (Kilowatt)', factor:1000}, megawatt:{name:'مگاوات (Megawatt)', factor:1000000}, horsepower:{name:'اسب بخار (Horsepower)', factor:745.7}
            }},
            pressure: { label: 'فشار (Pressure)', units: {
                pascal:{name:'پاسکال (Pascal)', factor:1}, kilopascal:{name:'کیلوپاسکال (Kilopascal)', factor:1000}, bar:{name:'بار (Bar)', factor:100000}, atmosphere:{name:'اتمسفر (Atmosphere)', factor:101325}, torr:{name:'تور (Torr)', factor:133.322368}, psi:{name:'پوند بر اینچ مربع (PSI)', factor:6894.75729}
            }},
            data: { label: 'اطلاعات (Data)', units: {
                bit:{name:'بیت (Bit)', factor:1}, byte:{name:'بایت (Byte)', factor:8}, kilobyte:{name:'کیلوبایت (Kilobyte)', factor:8000}, megabyte:{name:'مگابایت (Megabyte)', factor:8000000}, gigabyte:{name:'گیگابایت (Gigabyte)', factor:8000000000}, terabyte:{name:'ترابایت (Terabyte)', factor:8000000000000}
            }},
            angle: { label: 'زاویه (Angle)', units: {
                degree:{name:'درجه (Degree)', factor:1}, radian:{name:'رادیان (Radian)', factor:57.2957795}, gradian:{name:'گراد (Gradian)', factor:0.9}, minuteangle:{name:'دقیقه (Minute)', factor:1/60}, secondangle:{name:'ثانیه (Second)', factor:1/3600}
            }},
            fuel: { label: 'مصرف سوخت (Fuel)', units: {
                kmperliter:{name:'کیلومتر بر لیتر (km/L)', factor:1}, mpg:{name:'مایل بر گالن (MPG)', factor:0.425144}, literper100km:{name:'لیتر در ۱۰۰ کیلومتر (L/100km)', factor:100}
            }}
        };
        const unitCategory = document.getElementById('unitCategory');
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');
        const unitInput = document.getElementById('unitInput');
        const unitResult = document.getElementById('unitResult');
        function populateUnitCategories() {
            for (const key in unitCategories) {
                const opt = document.createElement('option');
                opt.value = key; opt.textContent = unitCategories[key].label;
                unitCategory.appendChild(opt);
            }
            populateUnitSelects();
        }
        function populateUnitSelects() {
            const cat = unitCategory.value;
            fromUnit.innerHTML = ''; toUnit.innerHTML = '';
            for (const key in unitCategories[cat].units) {
                fromUnit.appendChild(new Option(unitCategories[cat].units[key].name, key));
                toUnit.appendChild(new Option(unitCategories[cat].units[key].name, key));
            }
            convertUnit();
        }
        function convertFuel(from, to, value) {
            if (value === 0) return 0;
            let kmpl;
            if (from === 'kmperliter') kmpl = value;
            else if (from === 'mpg') kmpl = value * 0.425144;
            else kmpl = 100 / value;
            if (to === 'kmperliter') return kmpl;
            if (to === 'mpg') return kmpl / 0.425144;
            return 100 / kmpl;
        }
        function convertUnit() {
            const cat = unitCategory.value;
            const from = fromUnit.value;
            const to = toUnit.value;
            const value = parseFloat(unitInput.value) || 0;
            let result;
            if (cat === 'temperature') {
                if (from==='celsius'&&to==='fahrenheit') result = value*9/5+32;
                else if (from==='celsius'&&to==='kelvin') result = value+273.15;
                else if (from==='fahrenheit'&&to==='celsius') result = (value-32)*5/9;
                else if (from==='fahrenheit'&&to==='kelvin') result = (value-32)*5/9+273.15;
                else if (from==='kelvin'&&to==='celsius') result = value-273.15;
                else if (from==='kelvin'&&to==='fahrenheit') result = (value-273.15)*9/5+32;
                else result = value;
            } else if (cat === 'fuel') {
                result = convertFuel(from, to, value);
            } else {
                result = value * unitCategories[cat].units[from].factor / unitCategories[cat].units[to].factor;
            }
            unitResult.textContent = `${value} ${unitCategories[cat].units[from].name} = ${result.toFixed(6)} ${unitCategories[cat].units[to].name}`;
        }
        unitCategory.addEventListener('change', populateUnitSelects);
        fromUnit.addEventListener('change', convertUnit);
        toUnit.addEventListener('change', convertUnit);
        unitInput.addEventListener('input', convertUnit);
        populateUnitCategories();

        // ======================== BMI ========================
        document.getElementById('bmiCalcBtn').addEventListener('click', () => {
            const w = parseFloat(document.getElementById('bmiWeight').value);
            const h = parseFloat(document.getElementById('bmiHeight').value)/100;
            if (!w || !h) {
                document.getElementById('bmiResult').textContent = 'لطفاً وزن و قد را وارد کنید';
                return;
            }
            const bmi = w/(h*h);
            let cat = bmi<18.5?'کمبود وزن':bmi<25?'نرمال':bmi<30?'اضافه وزن':'چاقی';
            document.getElementById('bmiResult').textContent = `BMI: ${bmi.toFixed(1)} (${cat})`;
        });

        // ======================== فاصله استان‌ها ========================
        const provinces = [
            { name: 'آذربایجان شرقی', capital: 'تبریز', lat: 38.0667, lon: 46.3000 },
            { name: 'آذربایجان غربی', capital: 'ارومیه', lat: 37.5527, lon: 45.0760 },
            { name: 'اردبیل', capital: 'اردبیل', lat: 38.2498, lon: 48.2933 },
            { name: 'اصفهان', capital: 'اصفهان', lat: 32.6546, lon: 51.6680 },
            { name: 'البرز', capital: 'کرج', lat: 35.8400, lon: 50.9391 },
            { name: 'ایلام', capital: 'ایلام', lat: 33.6374, lon: 46.4227 },
            { name: 'بوشهر', capital: 'بوشهر', lat: 28.9684, lon: 50.8385 },
            { name: 'تهران', capital: 'تهران', lat: 35.6892, lon: 51.3890 },
            { name: 'چهارمحال و بختیاری', capital: 'شهرکرد', lat: 32.3256, lon: 50.8644 },
            { name: 'خراسان جنوبی', capital: 'بیرجند', lat: 32.8649, lon: 59.2211 },
            { name: 'خراسان رضوی', capital: 'مشهد', lat: 36.2605, lon: 59.6168 },
            { name: 'خراسان شمالی', capital: 'بجنورد', lat: 37.4750, lon: 57.3333 },
            { name: 'خوزستان', capital: 'اهواز', lat: 31.3183, lon: 48.6706 },
            { name: 'زنجان', capital: 'زنجان', lat: 36.6831, lon: 48.5087 },
            { name: 'سمنان', capital: 'سمنان', lat: 35.5769, lon: 53.3950 },
            { name: 'سیستان و بلوچستان', capital: 'زاهدان', lat: 29.4963, lon: 60.8629 },
            { name: 'فارس', capital: 'شیراز', lat: 29.5918, lon: 52.5837 },
            { name: 'قزوین', capital: 'قزوین', lat: 36.2688, lon: 50.0041 },
            { name: 'قم', capital: 'قم', lat: 34.6416, lon: 50.8746 },
            { name: 'کردستان', capital: 'سنندج', lat: 35.3119, lon: 46.9964 },
            { name: 'کرمان', capital: 'کرمان', lat: 30.2839, lon: 57.0834 },
            { name: 'کرمانشاه', capital: 'کرمانشاه', lat: 34.3142, lon: 47.0650 },
            { name: 'کهگیلویه و بویراحمد', capital: 'یاسوج', lat: 30.6684, lon: 51.5875 },
            { name: 'گلستان', capital: 'گرگان', lat: 36.8387, lon: 54.4347 },
            { name: 'گیلان', capital: 'رشت', lat: 37.2808, lon: 49.5832 },
            { name: 'لرستان', capital: 'خرم‌آباد', lat: 33.4878, lon: 48.3558 },
            { name: 'مازندران', capital: 'ساری', lat: 36.5659, lon: 53.0586 },
            { name: 'مرکزی', capital: 'اراک', lat: 34.0954, lon: 49.7013 },
            { name: 'هرمزگان', capital: 'بندرعباس', lat: 27.1865, lon: 56.2808 },
            { name: 'همدان', capital: 'همدان', lat: 34.7983, lon: 48.5148 },
            { name: 'یزد', capital: 'یزد', lat: 31.8974, lon: 54.3569 }
        ];
        const provinceFrom = document.getElementById('provinceFrom');
        const provinceTo = document.getElementById('provinceTo');
        provinces.forEach(p => {
            provinceFrom.appendChild(new Option(`${p.name} - ${p.capital}`, p.name));
            provinceTo.appendChild(new Option(`${p.name} - ${p.capital}`, p.name));
        });
        document.getElementById('distanceCalcBtn').addEventListener('click', () => {
            const from = provinces.find(p=>p.name===provinceFrom.value);
            const to = provinces.find(p=>p.name===provinceTo.value);
            if(!from||!to) return;
            const R=6371, dLat=rad(to.lat-from.lat), dLon=rad(to.lon-from.lon);
            const a=Math.sin(dLat/2)**2+Math.cos(rad(from.lat))*Math.cos(rad(to.lat))*Math.sin(dLon/2)**2;
            const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
            document.getElementById('distanceResult').textContent = `فاصله مستقیم: ${(R*c).toFixed(1)} کیلومتر`;
        });

        // ======================== اقساط وام ========================
        document.getElementById('loanCalcBtn').addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('loanAmount').value);
            const rate = parseFloat(document.getElementById('loanRate').value);
            const months = parseInt(document.getElementById('loanMonths').value);
            const resultEl = document.getElementById('loanResult');

            if (!amount || isNaN(amount) || amount <= 0) {
                resultEl.textContent = 'لطفاً مبلغ وام را به درستی وارد کنید';
                return;
            }
            if (isNaN(rate) || rate < 0) {
                resultEl.textContent = 'لطفاً نرخ سود سالانه را وارد کنید (صفر مجاز است)';
                return;
            }
            if (!months || isNaN(months) || months <= 0) {
                resultEl.textContent = 'لطفاً مدت بازپرداخت را به ماه وارد کنید';
                return;
            }

            let payment, total, totalInterest;
            if (rate === 0) {
                payment = amount / months;
                total = amount;
                totalInterest = 0;
            } else {
                const mr = rate / 12 / 100;
                payment = amount * mr / (1 - Math.pow(1 + mr, -months));
                total = payment * months;
                totalInterest = total - amount;
            }

            resultEl.innerHTML =
                `💵 قسط ماهانه: <strong>${formatNum(payment)} تومان</strong><br>` +
                `📊 کل بازپرداخت: ${formatNum(total)} تومان<br>` +
                `📈 سود کل: ${formatNum(totalInterest)} تومان`;
        });

        // ======================== سود سپرده ========================
        document.getElementById('depositCalcBtn').addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('depositAmount').value);
            const rate = parseFloat(document.getElementById('depositRate').value);
            const months = parseInt(document.getElementById('depositMonths').value);
            const resultEl = document.getElementById('depositResult');

            if (!amount || isNaN(amount) || amount <= 0) {
                resultEl.textContent = 'لطفاً مبلغ سپرده را به درستی وارد کنید';
                return;
            }
            if (isNaN(rate) || rate < 0) {
                resultEl.textContent = 'لطفاً نرخ سود سالانه را وارد کنید';
                return;
            }
            if (!months || isNaN(months) || months <= 0) {
                resultEl.textContent = 'لطفاً مدت سپرده‌گذاری را به ماه وارد کنید';
                return;
            }

            const interest = amount * rate / 100 * (months / 12);
            const monthlyInterest = interest / months;
            const finalAmount = amount + interest;

            resultEl.innerHTML =
                `💰 سود کل: <strong>${formatNum(interest)} تومان</strong><br>` +
                `📅 سود ماهانه: ${formatNum(monthlyInterest)} تومان<br>` +
                `💵 مبلغ نهایی: ${formatNum(finalAmount)} تومان`;
        });

        // ======================== سن دقیق ========================
        document.getElementById('ageCalcBtn').addEventListener('click', () => {
            const by = parseInt(document.getElementById('birthShYear').value);
            const bm = parseInt(document.getElementById('birthShMonth').value);
            const bd = parseInt(document.getElementById('birthShDay').value);
            const resultEl = document.getElementById('ageResult');

            if (!by || !bm || !bd || bm < 1 || bm > 12 || bd < 1 || bd > 31) {
                resultEl.textContent = 'لطفاً تاریخ تولد شمسی را به درستی وارد کنید';
                return;
            }

            const maxDay = bm <= 6 ? 31 : bm <= 11 ? 30 : (isShamsiLeap(by) ? 30 : 29);
            if (bd > maxDay) {
                resultEl.textContent = `روز وارد شده برای این ماه نامعتبر است (حداکثر ${maxDay})`;
                return;
            }

            const birthJD = shamsiToJD(by, bm, bd);
            const iran = getIranDateTime();
            const todayJD = gregorianToJD(iran.year, iran.month, iran.day);

            if (birthJD > todayJD) {
                resultEl.textContent = 'تاریخ تولد نمی‌تواند بعد از امروز باشد';
                return;
            }

            const shBirth = { year: by, month: bm, day: bd };
            const shNow = gregorianToShamsi(iran.year, iran.month, iran.day);

            let shYears = shNow.year - shBirth.year;
            let shMonths = shNow.month - shBirth.month;
            let shDays = shNow.day - shBirth.day;

            if (shDays < 0) {
                shMonths--;
                let prevMonth = shNow.month - 1;
                let prevYear = shNow.year;
                if (prevMonth === 0) { prevMonth = 12; prevYear--; }
                const prevMonthDays = prevMonth <= 6 ? 31 : prevMonth <= 11 ? 30 : (isShamsiLeap(prevYear) ? 30 : 29);
                shDays += prevMonthDays;
            }
            if (shMonths < 0) {
                shYears--;
                shMonths += 12;
            }

            const birthGreg = jdToGregorian(birthJD);
            const nowGreg = { year: iran.year, month: iran.month, day: iran.day };

            let milYears = nowGreg.year - birthGreg.year;
            let milMonths = nowGreg.month - birthGreg.month;
            let milDays = nowGreg.day - birthGreg.day;

            if (milDays < 0) {
                milMonths--;
                let prevMonth = nowGreg.month - 1;
                let prevYear = nowGreg.year;
                if (prevMonth === 0) { prevMonth = 12; prevYear--; }
                const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();
                milDays += daysInPrevMonth;
            }
            if (milMonths < 0) {
                milYears--;
                milMonths += 12;
            }

            resultEl.innerHTML =
                `🎂 سن شمسی دقیق:<br>` +
                `<strong>${shYears} سال، ${shMonths} ماه، ${shDays} روز</strong><br>` +
                `<span style="font-size:0.95rem; opacity:0.85;">🌍 سن میلادی: ${milYears} سال، ${milMonths} ماه، ${milDays} روز</span>`;
        });
    }

    // ======================== لینک‌های فوتر و لوگو ========================
    const siteLogo = document.getElementById('siteLogo');
    if (siteLogo) {
        siteLogo.addEventListener('click', () => { location.href = 'index.html'; });
    }
    const contactLink = document.getElementById('contactLink');
    if (contactLink) {
        contactLink.addEventListener('click', (e) => { e.preventDefault(); location.href = 'contact.html'; });
    }

    // ======================== تنظیم سال فوتر ========================
    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        const iran = getIranDateTime();
        const sh = gregorianToShamsi(iran.year, iran.month, iran.day);
        footerYear.textContent = sh.year;
    }
})();