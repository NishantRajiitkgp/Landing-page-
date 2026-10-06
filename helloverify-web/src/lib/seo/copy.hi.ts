/** Hindi titles and descriptions for the 28 hand-written SEO routes.
 *
 *  Annotated against `StaticSeoPath` so a new English row is a type error
 *  here, not a silent English `<title>` on `/hi`. Catalogue names, official
 *  titles and HelloVerify stay Latin.
 */
import type { PageCopy, StaticSeoPath } from "./copy";

export const STATIC_HI: Record<StaticSeoPath, PageCopy> = {
  "/": {
    title: "HelloVerify — स्रोत पर सत्यापित, मिनटों में",
    description:
      "AI दस्तावेज़ पढ़ता है। हमारी टीम जारीकर्ता से पुष्टि करती है — विश्वविद्यालय, नियोक्ता, रजिस्ट्री। उत्तर 15 मिनट जितने कम समय में।",
  },
  "/business": {
    title: "व्यवसाय के लिए पृष्ठभूमि सत्यापन — HelloVerify",
    description:
      "हर भूमिका के लिए एक पाइपलाइन — राइडर से निदेशक तक। एंटरप्राइज़ BGV, SMB पैकेज, कर्मचारी सत्यापन, ग्राहक KYC और विक्रेता उचित परिश्रम।",
  },
  "/governments": {
    title: "सरकारों और प्राधिकरणों के लिए सत्यापन — HelloVerify",
    description:
      "राष्ट्रीय पैमाने पर प्राथमिक-स्रोत सत्यापन — वर्क पास, चिकित्सा प्रमाण, वीज़ा और व्यापार लाइसेंस। भारत, KSA, UAE, सिंगापुर और यूरोप के मंत्रालयों द्वारा विश्वसनीय।",
  },
  "/individuals": {
    title: "व्यक्तियों और परिवारों के लिए पृष्ठभूमि जाँच — HelloVerify",
    description:
      "ड्राइवर, नानी, किरायेदार या वीज़ा के लिए अपने दस्तावेज़ सत्यापित करें। WhatsApp पर फ़ोटो भेजें, 30 मिनट में रिपोर्ट पाएँ।",
  },
  "/platform": {
    title: "HelloVerify प्लेटफ़ॉर्म — तकनीक, सुरक्षा, कवरेज",
    description:
      "प्रूफ़ परत: सत्यापन कैसे चलता है, डेटा कैसे सुरक्षित रहता है, और दुनिया में कहाँ कोई दस्तावेज़ उसके स्रोत पर पुष्ट हो सकता है।",
  },
  "/resources": {
    title: "संसाधन — HelloVerify",
    description:
      "जाँच लाइब्रेरी, देश गाइड, सत्यापन शब्दों का शब्दकोश, और इस बारे में लेख कि सत्यापन वास्तव में कैसे काम करता है।",
  },
  "/products/bgv-enterprise": {
    title: "भारत की सबसे बड़ी एंटरप्राइज़ द्वारा भरोसेमंद AI-संचालित स्क्रीनिंग। गलत हायरिंग शुरू होने से पहले रोकें। — HelloVerify",
    description:
      "AI और समर्पित इन-हाउस वेरिफिकेशन विशेषज्ञों का संयोजन धोखाधड़ी को रोकता है और वास्तविक उपयोगकर्ताओं के लिए सहज अनुभव सुनिश्चित करता है।",
  },
  "/products/bgv-smb": {
    title: "छोटे और मध्यम व्यवसायों के लिए बैकग्राउंड चेक — HelloVerify",
    description:
      "हमारी AI और ML सक्षम स्वामित्व वाली तकनीक स्टार्टअप्स और छोटे व मध्यम व्यवसायों के लिए वन‑स्टॉप स्क्रीनिंग समाधान प्रदान करती है।",
  },
  "/employee-verification": {
    title: "हर वर्कफोर्स सेगमेंट के लिए ऑल‑इन‑वन बैकग्राउंड वेरिफिकेशन। — HelloVerify",
    description:
      "बैकग्राउंड स्क्रीनिंग समाधान के वैश्विक प्रदाता के रूप में, हम सभी आकार की संस्थाओं को सही अवसरों के लिए सही लोगों को नियुक्त करने में मदद करते हैं। हमारे साथ जुड़ें और हायरिंग को मॉडर्नाइज़ करें।",
  },
  "/products/customer-kyc": {
    title: "KYC प्लेटफ़ॉर्म — HelloVerify",
    description:
      "तेज़ी से ऑनबोर्ड करें। पहले ही फ्रॉड पहचानें। हमारा समग्र KYC समाधान डिजिटल ऑनबोर्डिंग की हर स्टेप को एक साथ लाकर एक सहज अनुभव बनाता है, जिससे धोखेबाज़ बाहर रहते हैं और वास्तविक ग्राहक आगे बढ़ते हैं।",
  },
  "/products/certifier": {
    title: "Certifier — HelloVerify",
    description:
      "हम B2B व्यवसायों के लिए थर्ड‑पार्टी वेरिफिकेशन को नए सिरे से परिभाषित कर रहे हैं — आधुनिक एंटरप्राइज़ की ज़रूरत के अनुसार पहचान और दस्तावेज़ों का तेज़, भरोसेमंद प्रमाणीकरण।",
  },
  "/solutions/health-authorities": {
    title: "हेल्थकेयर वर्कफोर्स के लिए प्राइमरी सोर्स वेरिफिकेशन — HelloVerify",
    description:
      "जारी करने वाली संस्थाओं से सीधे डॉक्टरों, नर्सों और संबद्ध पेशेवरों का सत्यापन कर क्रेडेंशियल की सटीकता और नियामक अनुपालन सुनिश्चित करें।",
  },
  "/solutions/immigration-authorities": {
    title: "प्राधिकरणों के लिए इमिग्रेशन समाधान — HelloVerify",
    description:
      "तेज़ और सुरक्षित इमिग्रेशन निर्णयों के लिए AI‑पावर्ड वेरिफिकेशन। एडवांस्ड फ्रॉड डिटेक्शन और रियल‑टाइम वेरिफिकेशन के साथ सुरक्षित और कम्प्लायंट स्क्रीनिंग सक्षम करें।",
  },
  "/solutions/manpower-and-education-authorities": {
    title: "AI‑Powered Education Equivalency & Qualification Checks — HelloVerify",
    description:
      "हर 8 में से 1 आवेदक अपनी शैक्षणिक योग्यता गलत प्रस्तुत करता है—यह जोखिम संगठन की विश्वसनीयता को प्रभावित कर सकता है। HelloVerify का AI‑ड्रिवन वेरिफिकेशन प्लेटफ़ॉर्म इन असंगतियों को जल्दी पहचानकर तेज़, स्मार्ट और भरोसेमंद निर्णय लेने में मदद करता है।",
  },
  "/governments/manpower-education/mohesr": {
    title: "UAE Ministry of Higher Education & Scientific Research — HelloVerify",
    description:
      "HelloVerify UAE के MOHESR का अधिकृत सत्यापन भागीदार है: UAE के बाहर प्राप्त डिग्री, मान्यता से पहले जारीकर्ता विश्वविद्यालय से पुष्ट।",
  },
  "/governments/immigration/embassy-of-latvia": {
    title: "Embassy of the Republic of Latvia — HelloVerify",
    description:
      "लातविया दूतावास के लिए HelloVerify छात्र और वर्क वीज़ा आवेदकों की जाँच कैसे करता है: पहचान, शिक्षा या रोज़गार और वित्तीय रिकॉर्ड, वीज़ा से पहले।",
  },
  "/governments/immigration/embassy-of-italy": {
    title: "Embassy of Italy, New Delhi — HelloVerify",
    description:
      "नई दिल्ली क्षेत्राधिकार में इतालवी National Visa आवेदकों के लिए सहायक दस्तावेज़ सत्यापन: पहचान, शिक्षा, रोज़गार, बैंक और कंपनी रिकॉर्ड।",
  },
  "/solutions/manpower-and-education-authorities/ministry-of-manpower": {
    title: "अपनी योग्यता सत्यापित करें वर्क पास प्राप्त करें — HelloVerify",
    description:
      "HelloVerify सिंगापुर के Ministry of Manpower द्वारा COMPASS ढांचे के तहत शैक्षणिक योग्यताओं के प्राथमिक स्रोत सत्यापन के लिए आधिकारिक रूप से पैनल में शामिल है।",
  },
  "/solutions/trade-authorities": {
    title: "व्यवसाय और व्यापार प्राधिकरण — HelloVerify",
    description:
      "पहचान, शिक्षा, रोजगार और आपराधिक रिकॉर्ड के सटीक सत्यापन के माध्यम से वीज़ा अनुपालन सुनिश्चित करने वाली व्यापक वेरिफिकेशन समाधानों के साथ व्यवसाय एवं व्यापार प्राधिकरणों को सशक्त बनाना — धोखाधड़ी और परिचालन जोखिम को कम करना।",
  },
  "/products/hellov": {
    title: "सुनिश्चित करें कि आप और आपका परिवार सुरक्षित हैं! — HelloVerify",
    description:
      "HelloVerify द्वारा WhatsApp पर आसान वेरिफिकेशन।",
  },
  "/products/immigration": {
    title: "आवेदक की प्री‑स्क्रीनिंग — HelloVerify",
    description:
      "हम आपकी पूरी वीज़ा आवेदन प्रक्रिया को सहज, सुरक्षित और बिना देरी के बनाने में मदद करते हैं।",
  },
  "/individuals/home-family": {
    title: "सुनिश्चित करें कि आप और आपका परिवार सुरक्षित हैं — HelloV by HelloVerify",
    description:
      "WhatsApp पर HelloV घरेलू पैकेज: ड्राइवर ₹499, घरेलू स्टाफ़ ₹599, नानी और किरायेदार ₹549। एकल जाँच ₹199 से, पहले सहमति।",
  },
  "/ai": {
    title: "HelloVerify AI — देखें हमारी AI जाँच कैसे काम करती है",
    description:
      "एक पता-जाँच कदम दर कदम: हमारा AI पकड़ता है जो मेल नहीं खाता, एक स्थानीय विशेषज्ञ स्वयं जाता है, और साक्ष्य पूरी रिपोर्ट बन जाता है।",
  },
  "/technology": {
    title: "ट्रस्ट टेक्नोलॉजी प्लेटफ़ॉर्म — HelloVerify",
    description:
      "HelloVerify का ट्रस्ट टेक्नोलॉजी प्लेटफ़ॉर्म अधिकृत स्रोतों से सीधे Primary Source Verification करता है, और देशों, संस्थानों तथा नियामक पारिस्थितिक तंत्रों में जटिल वर्कफ़्लो को संचालित करता है। यह AI पर आधारित है और लाखों सत्यापनों पर प्रशिक्षित है।",
  },
  "/international": {
    title: "अंतर्राष्ट्रीय बैकग्राउंड वेरिफिकेशन — HelloVerify",
    description:
      "HelloVerify अंतर्राष्ट्रीय बैकग्राउंड चेक 124+ देशों और क्षेत्रों में सटीक और समय पर सत्यापन प्रदान करते हैं।",
  },
  "/platform/security-compliance": {
    title: "सुरक्षा और अनुपालन — HelloVerify",
    description:
      "प्रमाणपत्र, डेटा रेज़िडेंसी, सब-प्रोसेसर, एक्सेसिबिलिटी अनुरूपता और सुरक्षा समीक्षा के लिए आवश्यक आर्टिफ़ैक्ट — एक जगह।",
  },
  "/resources/blog": {
    title: "ब्लॉग — HelloVerify",
    description: "सत्यापन वास्तव में कैसे काम करता है, उन लोगों द्वारा लिखा गया जो जाँच चलाते हैं।",
  },
  "/resources/checks": {
    title: "जाँच लाइब्रेरी — HelloVerify",
    description:
      "हर सत्यापन जाँच: वह क्या उत्तर देती है, कौन पुष्टि करता है, कितना समय लगता है, और वह क्या नहीं बता सकती।",
  },
  "/resources/countries": {
    title: "देश गाइड — HelloVerify",
    description:
      "देश-दर-देश सत्यापन वास्तव में कैसा है: रजिस्ट्रियाँ, समय-सीमाएँ, और वह स्थानीय जाल जिसमें लोग फँसते हैं।",
  },
  "/resources/glossary": {
    title: "सत्यापन शब्दों का शब्दकोश — HelloVerify",
    description:
      "प्राथमिक स्रोत, अनुप्रमाणन, स्क्रीनिंग, प्रतिकूल मीडिया, BGV — विक्रेता जिन शब्दों को एक-सा इस्तेमाल करते हैं, सटीक परिभाषा।",
  },
  "/about": {
    title: "HelloVerify के बारे में",
    description:
      "ट्रस्ट दुनिया का अगला महत्वपूर्ण डिजिटल इन्फ्रास्ट्रक्चर बनता जा रहा है। HelloVerify वह प्लेटफ़ॉर्म बना रहा है जिसके माध्यम से ट्रस्ट आगे बढ़ेगा।",
  },
  "/contact": {
    title: "आइए मिलकर व्यवसाय को आगे बढ़ाएं — HelloVerify",
    description:
      "देखें HelloVerify आपके व्यवसाय की कैसे मदद करता है। हमारे पृष्ठभूमि सत्यापन विशेषज्ञ के साथ एक डेमो शेड्यूल करें।",
  },
};
