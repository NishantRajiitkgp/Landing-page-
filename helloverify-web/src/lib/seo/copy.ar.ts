/** Arabic titles and descriptions for the 28 hand-written SEO routes.
 *
 *  Annotated against `StaticSeoPath` so a new English row is a type error
 *  here, not a silent English `<title>` on `/ar`. Catalogue names, official
 *  titles and HelloVerify stay Latin.
 */
import type { PageCopy, StaticSeoPath } from "./copy";

export const STATIC_AR: Record<StaticSeoPath, PageCopy> = {
  "/": {
    title: "HelloVerify — موثَّق من المصدر، في دقائق",
    description:
      "يقرأ الذكاء الاصطناعي الوثائق. ويؤكّد فريقنا لدى الجهة المُصدِرة — الجامعة، وصاحب العمل، والسجل. الإجابة في 15 دقيقة أحياناً.",
  },
  "/business": {
    title: "التحقق من الخلفية للأعمال — HelloVerify",
    description:
      "مسار واحد لكل دور توظّفونه — من السائقين إلى المديرين. تحقق مؤسسي، وباقات SMB، وتحقق الموظفين، وKYC العملاء، والعناية الواجبة بالمورّدين.",
  },
  "/governments": {
    title: "التحقق للحكومات والسلطات — HelloVerify",
    description:
      "تحقق من المصدر الأصلي على نطاق وطني — تصاريح العمل، والشهادات الطبية، والتأشيرات، ورخص التجارة. تثق به وزارات في الهند وKSA وUAE وسنغافورة وأوروبا.",
  },
  "/individuals": {
    title: "فحوصات الخلفية للأفراد والعائلات — HelloVerify",
    description:
      "تحقّقوا من سائق أو مربية أو مستأجر أو وثائقكم لتأشيرة. أرسلوا صورة عبر WhatsApp واحصلوا على التقرير في 30 دقيقة.",
  },
  "/platform": {
    title: "منصة HelloVerify — التقنية والأمن والتغطية",
    description:
      "طبقة الإثبات: كيف يجري التحقق، وكيف تُحمى البيانات، وأين في العالم يمكن تأكيد وثيقة من مصدرها.",
  },
  "/resources": {
    title: "الموارد — HelloVerify",
    description:
      "مكتبة الفحوصات، وأدلة الدول، ومعجم مصطلحات التحقق، وكتابة عمّا يفعله التحقق فعلاً.",
  },
  "/products/bgv-enterprise": {
    title: "التحقق المؤسسي من الخلفية — HelloVerify",
    description:
      "فحوصات خلفية عالية الحجم باتفاق مستوى خدمة. يقرأ الذكاء الاصطناعي الوثائق، ويؤكّد فريقنا لدى المُصدِر، ويعود الجواب إلى ATS — من 15 دقيقة.",
  },
  "/products/bgv-smb": {
    title: "باقات فحص الخلفية للشركات الصغيرة — HelloVerify",
    description:
      "اختاروا باقة، واطّلعوا على السعر، وارفعوا الوثائق، واحصلوا على الأجوبة — بلا مكالمة مبيعات. باقات العمالة والسائقين جاهزة في 30 دقيقة.",
  },
  "/employee-verification": {
    title: "تحقق الموظفين — HelloVerify",
    description:
      "الموظفون الحاليون والمقاولون والقوى العاملة المؤقتة — عند الالتحاق، ثم عند الحاجة. تاريخ وظيفي مدعوم بـ EPFO في 60 دقيقة.",
  },
  "/products/customer-kyc": {
    title: "KYC العملاء والثقة والسلامة — HelloVerify",
    description:
      "تحقّقوا من العملاء لحظة التسجيل — الهوية في 15 دقيقة، مقابل المحاكم وقواعد البيانات العالمية، عبر API أو مسار مستضاف.",
  },
  "/products/certifier": {
    title: "العناية الواجبة بالمورّدين — Certifier by HelloVerify",
    description:
      "رخص التجارة والمديرون والائتمان والسجلات الجنائية — موثَّقة في السجل قبل التوقيع. ملفات مورّدين معتمدة في يومين.",
  },
  "/solutions/health-authorities": {
    title: "التحقق لسلطات الصحة — HelloVerify",
    description:
      "الدرجات الطبية وتسجيلات المجالس وتاريخ الممارسة مؤكَّدة لدى المؤسسة المُصدِرة — قبل أن يلمس طبيب مريضاً.",
  },
  "/solutions/immigration-authorities": {
    title: "التحقق لسلطات الهجرة — HelloVerify",
    description:
      "وثائق المتقدّمين تُفحص من المصدر، في البلد الذي أصدرها — الهوية والتعليم والعمل والسجلات، قبل قرار التأشيرة.",
  },
  "/solutions/manpower-and-education-authorities": {
    title: "التحقق لسلطات القوى العاملة والتعليم — HelloVerify",
    description:
      "وثائق العمّال الأجانب موثَّقة لقرارات تصريح العمل — المسار العامل مع Ministry of Manpower في سنغافورة.",
  },
  "/governments/manpower-education/mohesr": {
    title: "UAE Ministry of Higher Education & Scientific Research — HelloVerify",
    description:
      "HelloVerify شريك تحقق معتمد لـ MOHESR في الإمارات: الدرجات المكتسبة خارج الدولة تُؤكَّد لدى الجامعة المُصدِرة قبل الاعتراف.",
  },
  "/governments/immigration/embassy-of-latvia": {
    title: "Embassy of the Republic of Latvia — HelloVerify",
    description:
      "كيف يفحص HelloVerify متقدّمي تأشيرات الدراسة والعمل لسفارة لاتفيا: الهوية والتعليم أو العمل والسجلات المالية قبل التأشيرة.",
  },
  "/governments/immigration/embassy-of-italy": {
    title: "Embassy of Italy, New Delhi — HelloVerify",
    description:
      "تحقق وثائق الدعم لمتقدّمي التأشيرة الوطنية الإيطالية في اختصاص نيودلهي: الهوية والتعليم والعمل والمصرف والشركة.",
  },
  "/solutions/manpower-and-education-authorities/ministry-of-manpower": {
    title: "Ministry of Manpower, Singapore — HelloVerify",
    description:
      "كيف يجري تحقق وثائق تصريح العمل مع وزارة القوى العاملة في سنغافورة: المؤهلات الأجنبية مؤكَّدة لدى المؤسسة المُصدِرة، قبل الوصول.",
  },
  "/solutions/trade-authorities": {
    title: "التحقق لسلطات التجارة والأعمال — HelloVerify",
    description:
      "تسجيلات الشركات ورخص التجارة والأشخاص وراءها — موثَّقة في السجل لقرارات الترخيص والإنفاذ.",
  },
  "/products/hellov": {
    title: "تحقّقوا من أي شخص من هاتفكم — HelloV by HelloVerify",
    description:
      "أرسلوا صورة الوثيقة عبر WhatsApp واحصلوا على تقرير موثَّق في نحو 30 دقيقة. سائقون وخادمات ومستأجرون ومواعيد — الموافقة أولاً، من ₹499.",
  },
  "/products/immigration": {
    title: "فحص وثائق التأشيرة والهجرة — HelloVerify",
    description:
      "افحصوا وثائقكم قبل أن تفعل السفارة. الدرجات والعمل والسجلات تُفحص من المصدر، حتى لا تُرفض التأشيرة بسبب ورقة.",
  },
  "/individuals/home-family": {
    title: "فحوصات الخلفية للمنزل والعائلة — HelloVerify",
    description:
      "مربيات وسائقون وطبّاخون ومقدّمو رعاية ومدرّسون — الهوية والسجل الجنائي والعنوان مؤكَّدة من المصدر في نحو 30 دقيقة، بموافقتهم.",
  },
  "/ai": {
    title: "HelloVerify AI — شاهدوا كيف تعمل فحوصات الذكاء الاصطناعي",
    description:
      "اتبعوا فحص عنوان خطوة بخطوة: يشير الذكاء الاصطناعي إلى ما لا يستقيم، ويزور خبير محلي المكان، ويصبح الدليل تقريراً كاملاً.",
  },
  "/technology": {
    title: "التقنية وواجهات API — HelloVerify",
    description:
      "كيف يقرأ HelloVerify وثيقة في نحو ثانية، ويبلغ السلطة المُصدِرة، ويعيد نتيجة قابلة للدفاع عبر REST والويب هوكس.",
  },
  "/international": {
    title: "تغطية عالمية — أكثر من 120 بلداً — HelloVerify",
    description:
      "أين يمكن تأكيد وثيقة لدى السلطة التي أصدرتها، وكم يستغرق ذلك هناك، والمكاتب الستة التي تحرّك الطابور.",
  },
  "/platform/security-compliance": {
    title: "الأمن والامتثال — HelloVerify",
    description:
      "الشهادات وإقامة البيانات والمعالجون الفرعيون ومطابقة الإتاحة والمواد التي تحتاجها مراجعة أمنية — في موضع واحد.",
  },
  "/resources/blog": {
    title: "المدونة — HelloVerify",
    description: "كتابة عمّا يفعله التحقق فعلاً، ممن يُجرون الفحوصات.",
  },
  "/resources/checks": {
    title: "مكتبة الفحوصات — HelloVerify",
    description:
      "كل فحص تحقق: ماذا يجيب، ومن يؤكّده، وكم يستغرق، وما لا يستطيع أن يخبركم.",
  },
  "/resources/countries": {
    title: "أدلة الدول — HelloVerify",
    description:
      "كيف يبدو التحقق بلداً بلداً: السجلات، والجداول الزمنية، والفخ المحلي الذي يوقع الناس.",
  },
  "/resources/glossary": {
    title: "معجم مصطلحات التحقق — HelloVerify",
    description:
      "المصدر الأصلي، والتصديق، والفحص، والوسائط السلبية، وBGV — كلمات يستخدمها البائعون بليونة، وتُعرَّف بدقة.",
  },
  "/about": {
    title: "عن HelloVerify",
    description:
      "نتحقّق من الادّعاءات من مصدرها — أكثر من 20 مليون فحص منذ 2018، للمؤسسات والحكومات والعائلات في أكثر من 120 بلداً.",
  },
  "/contact": {
    title: "تحدّثوا إلى المبيعات — HelloVerify",
    description:
      "أخبرونا بما تريدون تحققه، ولمن، وبأي حجم. استفسارات المؤسسات والحكومات والأفراد، يجيب عنها شخص.",
  },
};
