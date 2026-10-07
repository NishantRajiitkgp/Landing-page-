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
    title: "فحص مدعوم بالذكاء الاصطناعي تثق به أكبر المؤسسات في الهند. أوقف التوظيف الخاطئ قبل أن يبدأ. — HelloVerify",
    description:
      "يجمع مزيجنا من الذكاء الاصطناعي وخبراء التحقق الداخليين على ردع الاحتيال مع تجربة سلسة للمستخدمين الحقيقيين.",
  },
  "/products/bgv-smb": {
    title: "عمليات تحقق خلفية للشركات الصغيرة والمتوسطة — HelloVerify",
    description:
      "توفر تقنيتنا المملوكة والمدعومة بالذكاء الاصطناعي وتعلم الآلة حلاً شاملاً للفحص للشركات الناشئة والشركات الصغيرة والمتوسطة.",
  },
  "/employee-verification": {
    title: "تحقق خلفية شامل لكل فئة من القوى العاملة. — HelloVerify",
    description:
      "بصفتنا مزودًا عالميًا لحلول فحص الخلفيات، نساعد المؤسسات بمختلف أحجامها على توظيف الأشخاص المناسبين للفرص المناسبة. انضم إلينا لتحديث طريقة التوظيف والتوسع.",
  },
  "/products/customer-kyc": {
    title: "منصة KYC — HelloVerify",
    description:
      "قم بضم العملاء أسرع. اكتشف الاحتيال مبكرًا. يجمع حل KYC الشامل لدينا كل خطوة من خطوات الانضمام الرقمي في تجربة سلسة تُبقي المحتالين خارجًا وتُبقي العملاء الحقيقيين في مسارهم للأمام.",
  },
  "/products/certifier": {
    title: "Certifier — HelloVerify",
    description:
      "نعيد تعريف التحقق من الطرف الثالث للشركات B2B عبر تقديم مصادقة سريعة وموثوقة للهويات والمستندات التي تتطلبها المؤسسات الحديثة.",
  },
  "/solutions/health-authorities": {
    title: "التحقق من المصدر الأساسي للقوى العاملة الصحية — HelloVerify",
    description:
      "ضمن دقة الاعتمادات والامتثال التنظيمي عبر التحقق من الأطباء والممرضين والكوادر المساندة مباشرةً من الجهات المُصدِرة.",
  },
  "/solutions/immigration-authorities": {
    title: "حلول الهجرة للهيئات — HelloVerify",
    description:
      "تحقق مدعوم بالذكاء الاصطناعي لقرارات هجرة أسرع وأكثر أمانًا. مكّن فحصًا آمنًا ومتوافقًا للمتقدمين عبر كشف احتيال متقدم والتحقق الفوري.",
  },
  "/solutions/manpower-and-education-authorities": {
    title: "فحوصات معادلة التعليم والمؤهلات المدعومة بالذكاء الاصطناعي — HelloVerify",
    description:
      "واحد من كل 8 متقدمين يسيء تمثيل مؤهلاته الأكاديمية—وهو خطر قد يقوض نزاهة المؤسسة بصمت. تكشف منصة HelloVerify للتحقق المدعومة بالذكاء الاصطناعي هذه الفروقات مبكرًا لتمكين قرارات أسرع وأذكى وأكثر موثوقية.",
  },
  "/solutions/manpower-and-education-authorities/mohesr": {
    title: "Ministry of Higher Education and Scientific Research (MOHESR) — HelloVerify",
    description:
      "HelloVerify شريك التحقق لوزارة التعليم العالي والبحث العلمي في الإمارات. التحقق من الدرجة 350 درهماً، والتسليم القياسي خلال 18 يوماً تقويمياً.",
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
    title: "تحقق من مؤهلاتك احصل على تصريح العمل — HelloVerify",
    description:
      "HelloVerify معتمدة رسمياً من وزارة القوى العاملة في سنغافورة للتحقق من المصدر الأساسي للمؤهلات التعليمية ضمن إطار COMPASS.",
  },
  "/solutions/trade-authorities": {
    title: "هيئات الأعمال والتجارة — HelloVerify",
    description:
      "تمكين هيئات الأعمال والتجارة بحلول تحقق شاملة تضمن الامتثال للتأشيرات عبر التحقق الدقيق من الهوية والتعليم والخبرة الوظيفية والسجلات الجنائية — لتقليل الاحتيال والمخاطر التشغيلية.",
  },
  "/products/hellov": {
    title: "تأكد من أنك وعائلتك بأمان! — HelloVerify",
    description:
      "التحقق أصبح سهلًا على WhatsApp بواسطة HelloVerify.",
  },
  "/products/immigration": {
    title: "الفحص المسبق للمتقدم — HelloVerify",
    description:
      "نساعد على جعل عملية طلب التأشيرة كاملة سلسة وآمنة وخالية من التأخير",
  },
  "/individuals/home-family": {
    title: "تأكد أنك وعائلتك في أمان — HelloV by HelloVerify",
    description:
      "باقات الأسرة من HelloV على WhatsApp: سائق ₹499، عاملو المنزل ₹599، مربية ومستأجر ₹549. فحوصات مفردة من ₹199، والموافقة أولاً.",
  },
  "/ai": {
    title: "HelloVerify AI — شاهدوا كيف تعمل فحوصات الذكاء الاصطناعي",
    description:
      "اتبعوا فحص عنوان خطوة بخطوة: يشير الذكاء الاصطناعي إلى ما لا يستقيم، ويزور خبير محلي المكان، ويصبح الدليل تقريراً كاملاً.",
  },
  "/technology": {
    title: "منصة تقنية الثقة — HelloVerify",
    description:
      "تقوم منصة تقنية الثقة من HelloVerify بإجراءراء التحقق من المصدر الأساسي مباشرة من المصادر المعتمدة، وتنسيق سير العمل المعقد عبر الدول والمؤسسات والأنظمة التنظيمية. مدعومة بالذكاء الاصطناعي ومدرَّبة على ملايين عمليات التحقق.",
  },
  "/international": {
    title: "التحقق الدولي من الخلفية — HelloVerify",
    description:
      "توفر فحوصات HelloVerify الدولية للخلفية تحققًا دقيقًا وفي الوقت المناسب في أكثر من 124 دولة وإقليم.",
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
      "الثقة أصبحت البنية التحتية الرقمية الحيوية القادمة في العالم. HelloVerify تبني المنصة التي ستتحرك الثقة من خلالها.",
  },
  "/contact": {
    title: "لنبني الأعمال معًا — HelloVerify",
    description:
      "اكتشف كيف تساعد HelloVerify عملك. جدولة عرض توضيحي مع خبير فحص الخلفيات لدينا.",
  },
};
