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
    title: "एंटरप्राइज़ पृष्ठभूमि सत्यापन — HelloVerify",
    description:
      "SLA के साथ उच्च-मात्रा पृष्ठभूमि जाँच। AI दस्तावेज़ पढ़ता है, हमारी टीम जारीकर्ता से पुष्टि करती है, आपके ATS को उत्तर मिलता है — 15 मिनट से।",
  },
  "/products/bgv-smb": {
    title: "छोटे व्यवसाय के लिए पृष्ठभूमि जाँच पैकेज — HelloVerify",
    description:
      "पैकेज चुनें, कीमत देखें, दस्तावेज़ अपलोड करें, उत्तर पाएँ — कोई सेल्स कॉल नहीं। ब्लू-कॉलर और ड्राइवर पैकेज 30 मिनट में तैयार।",
  },
  "/employee-verification": {
    title: "कर्मचारी सत्यापन — HelloVerify",
    description:
      "मौजूदा स्टाफ़, ठेकेदार और गिग वर्कफ़ोर्स — शामिल होते समय सत्यापित, और जब ज़रूरत हो तब फिर से। EPFO-समर्थित रोज़गार इतिहास 60 मिनट में।",
  },
  "/products/customer-kyc": {
    title: "ग्राहक KYC और ट्रस्ट एंड सेफ़्टी — HelloVerify",
    description:
      "ग्राहक साइन-अप करते ही सत्यापित करें — 15 मिनट में पहचान, अदालतों और वैश्विक डेटाबेस के विरुद्ध जाँच, API या होस्टेड फ़्लो पर।",
  },
  "/products/certifier": {
    title: "विक्रेता उचित परिश्रम — Certifier by HelloVerify",
    description:
      "व्यापार लाइसेंस, निदेशक, क्रेडिट और आपराधिक रिकॉर्ड — अनुबंध से पहले रजिस्ट्री पर सत्यापित। प्रमाणित विक्रेता प्रोफ़ाइल 2 दिन में।",
  },
  "/solutions/health-authorities": {
    title: "स्वास्थ्य प्राधिकरणों के लिए सत्यापन — HelloVerify",
    description:
      "चिकित्सा डिग्री, काउंसिल पंजीकरण और अभ्यास इतिहास जारीकर्ता संस्थान से पुष्ट — किसी चिकित्सक के मरीज़ के पास जाने से पहले।",
  },
  "/solutions/immigration-authorities": {
    title: "आप्रवास प्राधिकरणों के लिए सत्यापन — HelloVerify",
    description:
      "आवेदक दस्तावेज़ स्रोत पर जाँचे जाते हैं, उसी देश में जिसने उन्हें जारी किया — पहचान, शिक्षा, रोज़गार और रिकॉर्ड, वीज़ा निर्णय से पहले।",
  },
  "/solutions/manpower-and-education-authorities": {
    title: "मैनपावर और शिक्षा प्राधिकरणों के लिए सत्यापन — HelloVerify",
    description:
      "वर्क-पास निर्णयों के लिए विदेशी-कर्मचारी प्रमाण सत्यापित — सिंगापुर के Ministry of Manpower के साथ प्रोडक्शन में चल रहा वर्कफ़्लो।",
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
    title: "Ministry of Manpower, Singapore — HelloVerify",
    description:
      "सिंगापुर के Ministry of Manpower के साथ वर्क-पास प्रमाण सत्यापन कैसे चलता है: विदेशी योग्यताएँ जारीकर्ता संस्थान से पुष्ट, आगमन से पहले।",
  },
  "/solutions/trade-authorities": {
    title: "व्यापार और व्यवसाय प्राधिकरणों के लिए सत्यापन — HelloVerify",
    description:
      "कंपनी पंजीकरण, व्यापार लाइसेंस और उनके पीछे के लोग — लाइसेंसिंग और प्रवर्तन निर्णयों के लिए रजिस्ट्री पर सत्यापित।",
  },
  "/products/hellov": {
    title: "फ़ोन से किसी को भी सत्यापित करें — HelloV by HelloVerify",
    description:
      "WhatsApp पर दस्तावेज़ की फ़ोटो भेजें और लगभग 30 मिनट में सत्यापित रिपोर्ट पाएँ। ड्राइवर, नौकर, किरायेदार, डेट — सहमति पहले, ₹499 से।",
  },
  "/products/immigration": {
    title: "वीज़ा और आप्रवास दस्तावेज़ स्क्रीनिंग — HelloVerify",
    description:
      "दूतावास से पहले अपने दस्तावेज़ जाँचें। डिग्री, रोज़गार और रिकॉर्ड स्रोत पर जाँचे जाते हैं, ताकि कागज़ की समस्या पर वीज़ा न रुक जाए।",
  },
  "/individuals/home-family": {
    title: "घर और परिवार की पृष्ठभूमि जाँच — HelloVerify",
    description:
      "नानी, ड्राइवर, रसोइया, देखभालकर्ता और शिक्षक — पहचान, आपराधिक रिकॉर्ड और पता स्रोत पर लगभग 30 मिनट में, उनकी सहमति से।",
  },
  "/ai": {
    title: "HelloVerify AI — देखें हमारी AI जाँच कैसे काम करती है",
    description:
      "एक पता-जाँच कदम दर कदम: हमारा AI पकड़ता है जो मेल नहीं खाता, एक स्थानीय विशेषज्ञ स्वयं जाता है, और साक्ष्य पूरी रिपोर्ट बन जाता है।",
  },
  "/technology": {
    title: "तकनीक और API — HelloVerify",
    description:
      "HelloVerify लगभग एक सेकंड में दस्तावेज़ कैसे पढ़ता है, जारीकर्ता प्राधिकरण तक कैसे पहुँचता है, और REST व वेबहुक पर एक बचावयोग्य परिणाम कैसे लौटाता है।",
  },
  "/international": {
    title: "वैश्विक कवरेज — 120+ देश — HelloVerify",
    description:
      "कहाँ कोई दस्तावेज़ उसे जारी करने वाले प्राधिकरण से पुष्ट हो सकता है, वहाँ कितना समय लगता है, और छह कार्यालय कतार को कैसे चलाते हैं।",
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
      "हम दावों को उनके स्रोत पर सत्यापित करते हैं — 2018 से 20M+ जाँच, 120+ देशों में उद्यमों, सरकारों और परिवारों के लिए।",
  },
  "/contact": {
    title: "सेल्स से बात करें — HelloVerify",
    description:
      "बताएँ क्या सत्यापित चाहिए, किसके लिए, और कितनी मात्रा में। उद्यम, सरकार और व्यक्तिगत पूछताछ — किसी व्यक्ति द्वारा उत्तर।",
  },
};
