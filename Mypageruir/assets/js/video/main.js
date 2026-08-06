// main.js
import { initLiveManager } from './live-manager.js';

document.addEventListener('DOMContentLoaded', function() {
    // فقط مدیریت لایو (کلاس‌های زنده) فعال می‌مونه
    initLiveManager();
    // video-player و controls-hide حذف شدند چون Plyr جایگزین شده
});