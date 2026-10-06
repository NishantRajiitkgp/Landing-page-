/** The old applicant guide's Documents Required lists, per locale, word for
 *  word from the old SPA's `immigrationApplicantGuideExtras.ts`. Keyed on the
 *  visa back office's ids: embassy, the "Applying From" office, and either the
 *  visa type or, where the type has sub-categories, the Application Category.
 *  The Hindi and Arabic lists are the old ones and are shorter than the English
 *  (Italy and Latvia-from-India only), so they cannot share one keyset in
 *  `lib/copy`; a combination with no list shows none, as before. */
import type { Locale } from "@/lib/i18n/routing";

export type Checklist = {
  embassy: number;
  country: number;
  visa?: number;
  subtype?: number;
  t: string;
  b: readonly string[];
};

export const CHECKLISTS: Record<Locale, readonly Checklist[]> = {
  en: [
    { embassy: 1399617, country: 475735, visa: 1015, t: "D-Work - Fresher/Self employed:", b: ["Valid Passport", "One identity document (PAN, Driving license, Voter ID)", "Last three months Bank statement", "Highest education document"] },
    { embassy: 1399617, country: 475735, visa: 1015, t: "D-Work - Experienced:", b: ["Valid Passport", "One identity document (PAN, Driving license, Voter ID)", "Last three months Bank statement", "Last Employment experience / service letter"] },
    { embassy: 1399617, country: 475735, visa: 1023, t: "D - Student:", b: ["Valid Passport", "Highest Education document", "One identity document (PAN, Driving license, Voter id)"] },
    { embassy: 1399617, country: 475735, visa: 1024, t: "D - General:", b: ["Valid Passport", "One identity document (PAN, Driving license, Voter id)", "Last three months Bank statement"] },
    { embassy: 1399617, country: 475735, visa: 1025, t: "D - Business:", b: ["Company details", "TIN", "CIN", "GST No", "Cancelled letter Head of company"] },
    { embassy: 1321272, country: 279135, visa: 1002, t: "Student:", b: ["Valid Passport", "Highest education details", "Income tax return acknowledgment", "Last 3 months Bank statement (soft copy)"] },
    { embassy: 1321272, country: 279135, subtype: 204, t: "D-Work (Fresher / Self-employed):", b: ["Valid Passport", "Highest education details", "Income tax return acknowledgment", "Last 3 months bank statement (soft copy)"] },
    { embassy: 1321272, country: 279135, subtype: 205, t: "D-Work (Fresher / Self-employed):", b: ["Valid Passport", "Highest education details", "Income tax return acknowledgment", "Last 3 months bank statement (soft copy)"] },
    { embassy: 1321272, country: 279135, subtype: 203, t: "D-Work (Employment):", b: ["Valid Passport", "Last employment details", "Income tax return acknowledgment", "Last 3 months Bank statement (soft copy)"] },
    { embassy: 1321272, country: 451575, visa: 1002, t: "Student:", b: ["Valid Passport", "Highest education details", "Last 3 months Bank statement (soft copy)"] },
    { embassy: 1321272, country: 451575, subtype: 221, t: "D-Work (Fresher / Self-employed):", b: ["Valid Passport", "Highest education details", "Last 3 months bank statement (soft copy)"] },
    { embassy: 1321272, country: 451575, subtype: 222, t: "D-Work (Fresher / Self-employed):", b: ["Valid Passport", "Highest education details", "Last 3 months bank statement (soft copy)"] },
    { embassy: 1321272, country: 451575, subtype: 220, t: "D-Work (Employment):", b: ["Valid Passport", "Last employment details", "Last 3 months Bank statement (soft copy)"] },
    { embassy: 1321272, country: 391475, visa: 1002, t: "Student:", b: ["Valid Passport", "Highest education details", "Last 3 months Bank statement (soft copy)"] },
    { embassy: 1321272, country: 391475, subtype: 113, t: "D-Work (Fresher / Self-employed):", b: ["Valid Passport", "Highest education details", "Last 3 months bank statement (soft copy)"] },
    { embassy: 1321272, country: 391475, subtype: 114, t: "D-Work (Fresher / Self-employed):", b: ["Valid Passport", "Highest education details", "Last 3 months bank statement (soft copy)"] },
    { embassy: 1321272, country: 391475, subtype: 115, t: "D-Work (Employment):", b: ["Valid Passport", "Last employment details", "Last 3 months Bank statement (soft copy)"] },
    { embassy: 1321272, country: 470450, visa: 1002, t: "Student:", b: ["Valid Passport", "Highest education details", "Last 3 months Bank statement (soft copy)"] },
    { embassy: 1321272, country: 470450, subtype: 225, t: "D-Work (Fresher / Self-employed):", b: ["Valid Passport", "Highest education details", "Last 3 months bank statement (soft copy)"] },
    { embassy: 1321272, country: 470450, subtype: 226, t: "D-Work (Fresher / Self-employed):", b: ["Valid Passport", "Highest education details", "Last 3 months bank statement (soft copy)"] },
    { embassy: 1321272, country: 470450, subtype: 227, t: "D-Work (Employment):", b: ["Valid Passport", "Last employment details", "Last 3 months Bank statement (soft copy)"] },
    { embassy: 1399671, country: 477245, visa: 1001, t: "Business:", b: ["Valid Passport", "Last three months Bank statement soft copy", "Invitation Letter (from Luxembourg based Entity)"] },
    { embassy: 1399671, country: 477245, visa: 1008, t: "Tourist:", b: ["Valid Passport", "Last three months Bank statement soft copy"] },
    { embassy: 1399671, country: 477245, visa: 1027, t: "D-Work - Fresher/Self employed:", b: ["Valid Passport", "Highest education details", "Latest Income Tax Return Acknowledgement receipt", "Last three months Bank statement soft copy", "One identity document (PAN/Voter/Driving License)"] },
    { embassy: 1399671, country: 477245, visa: 1027, t: "D-Work - Experienced:", b: ["Valid Passport", "Last Employment details", "Latest Income Tax Return Acknowledgement receipt", "Last three months Bank statement soft copy", "One identity document (PAN/Voter/Driving License)"] },
    { embassy: 1399671, country: 477245, visa: 1028, t: "D - Student:", b: ["Valid Passport", "Highest Education details", "Latest Income Tax Return Acknowledgement receipt", "Last three months Bank statement soft copy", "One identity document (PAN/Voter/Driving License)"] },
    { embassy: 1399671, country: 478000, visa: 1028, t: "Student:", b: ["Valid Passport", "Highest education details", "Last three months Bank statement"] },
    { embassy: 1399671, country: 478000, visa: 1027, t: "Work:", b: ["Valid Passport", "Last Employment details (Experience / service letter)", "Last three months Bank statement"] },
    { embassy: 1399671, country: 479510, visa: 1028, t: "Student:", b: ["Valid Passport", "Highest education details", "Last three months Bank statement"] },
    { embassy: 1399671, country: 479510, visa: 1027, t: "Work:", b: ["Valid Passport", "Last Employment details (Experience / service letter)", "Last three months Bank statement"] },
    { embassy: 1399671, country: 478755, visa: 1028, t: "Student:", b: ["Valid Passport", "Highest education details", "Last three months Bank statement"] },
    { embassy: 1399671, country: 478755, visa: 1027, t: "Work:", b: ["Valid Passport", "Last Employment details (Experience / service letter)", "Last three months Bank statement"] },
  ],
  hi: [
    { embassy: 1399617, country: 475735, visa: 1015, t: "D-Work - नवोदित/स्व-रोज़गार:", b: ["वैध पासपोर्ट", "एक पहचान दस्तावेज़ (PAN, ड्राइविंग लाइसेंस, मतदाता पहचान पत्र)", "पिछले तीन महीनों का बैंक विवरण", "उच्चतम शिक्षा दस्तावेज़"] },
    { embassy: 1399617, country: 475735, visa: 1015, t: "D-Work - अनुभवी:", b: ["वैध पासपोर्ट", "एक पहचान दस्तावेज़ (PAN, ड्राइविंग लाइसेंस, मतदाता पहचान पत्र)", "पिछले तीन महीनों का बैंक विवरण", "अंतिम रोज़गार अनुभव / सेवा पत्र"] },
    { embassy: 1399617, country: 475735, visa: 1023, t: "D - छात्र:", b: ["वैध पासपोर्ट", "उच्चतम शिक्षा दस्तावेज़", "एक पहचान दस्तावेज़ (PAN, ड्राइविंग लाइसेंस, मतदाता पहचान पत्र)"] },
    { embassy: 1399617, country: 475735, visa: 1024, t: "D - सामान्य:", b: ["वैध पासपोर्ट", "एक पहचान दस्तावेज़ (PAN, ड्राइविंग लाइसेंस, मतदाता पहचान पत्र)", "पिछले तीन महीनों का बैंक विवरण"] },
    { embassy: 1399617, country: 475735, visa: 1025, t: "D - व्यवसाय:", b: ["कंपनी विवरण", "TIN", "CIN", "GST नं.", "कंपनी का रद्द लेटरहेड"] },
    { embassy: 1321272, country: 279135, visa: 1002, t: "छात्र:", b: ["वैध पासपोर्ट", "उच्चतम शिक्षा विवरण", "आयकर रिटर्न पावती", "पिछले 3 महीनों का बैंक विवरण (सॉफ्ट कॉपी)"] },
    { embassy: 1321272, country: 279135, subtype: 204, t: "D-Work (नवोदित / स्व-रोज़गार):", b: ["वैध पासपोर्ट", "उच्चतम शिक्षा विवरण", "आयकर रिटर्न पावती", "पिछले 3 महीनों का बैंक विवरण (सॉफ्ट कॉपी)"] },
    { embassy: 1321272, country: 279135, subtype: 205, t: "D-Work (नवोदित / स्व-रोज़गार):", b: ["वैध पासपोर्ट", "उच्चतम शिक्षा विवरण", "आयकर रिटर्न पावती", "पिछले 3 महीनों का बैंक विवरण (सॉफ्ट कॉपी)"] },
    { embassy: 1321272, country: 279135, subtype: 203, t: "D-Work (रोज़गार):", b: ["वैध पासपोर्ट", "अंतिम रोज़गार विवरण", "आयकर रिटर्न पावती", "पिछले 3 महीनों का बैंक विवरण (सॉफ्ट कॉपी)"] },
  ],
  ar: [
    { embassy: 1399617, country: 475735, visa: 1015, t: "D-Work - مبتدئ/عمل حر:", b: ["جواز سفر ساري", "مستند هوية واحد (PAN، رخصة قيادة، بطاقة ناخب)", "كشف حساب بنكي لآخر ثلاثة أشهر", "أعلى مستند تعليمي"] },
    { embassy: 1399617, country: 475735, visa: 1015, t: "D-Work - ذو خبرة:", b: ["جواز سفر ساري", "مستند هوية واحد (PAN، رخصة قيادة، بطاقة ناخب)", "كشف حساب بنكي لآخر ثلاثة أشهر", "خطاب خبرة / خدمة من آخر عمل"] },
    { embassy: 1399617, country: 475735, visa: 1023, t: "D - طالب:", b: ["جواز سفر ساري", "أعلى مستند تعليمي", "مستند هوية واحد (PAN، رخصة قيادة، بطاقة ناخب)"] },
    { embassy: 1399617, country: 475735, visa: 1024, t: "D - عام:", b: ["جواز سفر ساري", "مستند هوية واحد (PAN، رخصة قيادة، بطاقة ناخب)", "كشف حساب بنكي لآخر ثلاثة أشهر"] },
    { embassy: 1399617, country: 475735, visa: 1025, t: "D - أعمال:", b: ["تفاصيل الشركة", "TIN", "CIN", "رقم GST", "ورقة رسمية ملغاة للشركة"] },
    { embassy: 1321272, country: 279135, visa: 1002, t: "طالب:", b: ["جواز سفر ساري", "تفاصيل أعلى تعليم", "إقرار ضريبة الدخل", "كشف حساب بنكي لآخر 3 أشهر (نسخة إلكترونية)"] },
    { embassy: 1321272, country: 279135, subtype: 204, t: "D-Work (مبتدئ / عمل حر):", b: ["جواز سفر ساري", "تفاصيل أعلى تعليم", "إقرار ضريبة الدخل", "كشف حساب بنكي لآخر 3 أشهر (نسخة إلكترونية)"] },
    { embassy: 1321272, country: 279135, subtype: 205, t: "D-Work (مبتدئ / عمل حر):", b: ["جواز سفر ساري", "تفاصيل أعلى تعليم", "إقرار ضريبة الدخل", "كشف حساب بنكي لآخر 3 أشهر (نسخة إلكترونية)"] },
    { embassy: 1321272, country: 279135, subtype: 203, t: "D-Work (توظيف):", b: ["جواز سفر ساري", "تفاصيل آخر عمل", "إقرار ضريبة الدخل", "كشف حساب بنكي لآخر 3 أشهر (نسخة إلكترونية)"] },
  ],
};
