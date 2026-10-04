/** Arabic contact copy, annotated, not in registry, Part 9b.6.
 *
 *  `export const ar: ContactCopy` — recipe step 1b in `./index`. Not in
 *  `CONTACT`; `routing.locales` is `["en"]`. Both sides move in Part 9b.7.
 *
 *  Form field labels stay in ContactForm (unmigrated). Go-cues stay inside
 *  `ways.rows.*.link` text; the glyph is `←` because Unicode does not
 *  mirror `→` (After 9b).
 */
import type { ContactCopy } from "./contact";

export const ar: ContactCopy = {
  crumb: "التواصل",
  closing: {
    heading: (
      <>
        تفضّلون أن <em>تروه يعمل؟</em>
      </>
    ),
    sub: "اطلبوا جولة بوثائقكم النموذجية.",
    ctaLabel: "اطلبوا جولة",
  },
  hero: {
    kicker: "التواصل",
    h1: (
      <>
        تحدّثوا إلى شخص <em>يشغّل الفحوصات.</em>
      </>
    ),
    sub:
      "ليست طابوراً. أخبرونا بما تريدون التحقق منه، ولمن، وبكم تقريباً — ستحصلون " +
      "على جواب حقيقي، بما فيه حين يكون الجواب الصادق أن الأمر يستغرق أياماً.",
  },
  tabs: {
    aria: "خيارات التواصل",
    enquiry: "استفسار",
    track: "تتبّع طلبك",
  },
  track: {
    title: "اختر طريقة التتبّع",
    or: "أو",
    phoneEmail: "رقم الهاتف / البريد",
    passport: "رقم جواز السفر",
    reference: "الرقم المرجعي",
    phoneHeading: "أدخلوا رقم هاتفكم أو بريدكم",
    passportHeading: "أدخلوا بياناتكم",
    passportNote: "سيُرسل رمز إلى بريدكم أو هاتفكم المسجّل.",
    referenceHeading: "أدخلوا مرجعكم",
    countryCode: "رمز البلد",
    countryPlaceholder: "+91",
    phone: "رقم الهاتف",
    phonePlaceholder: "رقم الهاتف",
    email: "البريد الإلكتروني",
    emailPlaceholder: "أدخلوا بريدكم",
    passportNumber: "رقم جواز السفر",
    passportPlaceholder: "رقم جواز السفر",
    referenceNumber: "الرقم المرجعي",
    referencePlaceholder: "أدخلوا الرقم المرجعي",
    referenceExample: "أدخلوا الرقم المرجعي (مثل HV2024001234)",
    sendOtp: "إرسال الرمز",
    result:
      "لا يمكن لهذه الصفحة البحث عن قضية حيّة. إن طلبتم هنا فافتحوا طلباتي. مقدّمو الطلبات لدى الجهات يستخدمون بوابة برنامجهم. أو أرسلوا استفساراً وسنبحث.",
    orders: "طلباتي",
    enquiryInstead: "أرسلوا استفساراً",
  },
  side: {
    h: (
      <>
        كل رحلة عظيمة تستحق بداية <em>موثَّقة</em>.
      </>
    ),
    p: "اتخذوا الخطوة الأولى. ونتولّى الباقي.",
  },
  ways: {
    kicker: "طرق أخرى",
    heading: <>بحسب<br />من أنتم.</>,
    lede:
      "المبيعات والدعم ومراجعات الأمن والمشتريات الفردية تذهب إلى مواضع مختلفة — " +
      "وهذا أيّها أيّ.",
    rows: {
      individual: {
        t: "شراء فحص واحد كفرد",
        p: "لستم بحاجة إلينا أصلاً — يعمل HelloV على WhatsApp ويبدأ في نحو دقيقة.",
        link: "HelloV ←",
      },
      smb: {
        t: "شركة صغيرة، جاهزة للشراء",
        p: "الأسعار علنية ويمكنكم البدء دون التحدّث إلى أحد.",
        link: "باقات SMB ←",
      },
      security: {
        t: "مراجعة أمنية أو DPA أو استبيان",
        p: "المواد مدرجة مع حالتها؛ ومعظمها يُرسل خلال يومي عمل.",
        link: "حزمة الامتثال ←",
      },
      support: {
        t: "عميل قائم يحتاج دعماً",
        p: "استخدموا النموذج أعلاه واختاروا خدمتكم — تُوجَّه استفسارات الدعم، لا تُصفَّ خلف المبيعات.",
        link: "في يوم العمل نفسه",
      },
    },
  },
  offices: {
    kicker: "المكاتب",
    heading: <>ستة منها،<br />تفصل بينها اثنتا عشرة ساعة.</>,
    lede:
      "شخص على المكتب 21 ساعة من كل 24، لذلك يُجاب عادة طلبٌ قُدِّم ليلاً " +
      "بحلول الصباح في مكان ما.",
    list: {
      noida: { city: "نويدا", hours: <>الهند · 09–18 IST<br />المقر</> },
      manila: { city: "مانيلا", hours: "الفلبين · 09–18 PHT" },
      singapore: { city: "سنغافورة", hours: "سنغافورة · 09–18 SGT" },
      dubai: { city: "دبي", hours: "الإمارات · 09–18 GST" },
      cairo: { city: "القاهرة", hours: "مصر · 09–18 EET" },
      newYork: { city: "نيويورك", hours: "الولايات المتحدة · 09–18 ET" },
    },
  },
};
