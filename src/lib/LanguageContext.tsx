import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { persistenceService } from './PersistenceService';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

export const translations: Translations = {
  // Hero
  hero_title: {
    en: "Master Statistics with Precision",
    hi: "Statistics (सांख्यिकी) को आसानी से समझें और सीखें"
  },
  hero_subtitle: {
    en: "Empowering aspirants for ISS, UPSSSC ASO, and Academic Excellence with India's most trusted learning platform.",
    hi: "ISS, ASO और कॉलेज परीक्षाओं की बेहतरीन तैयारी के लिए भारत का सबसे भरोसेमंद प्लेटफॉर्म।"
  },
  cta_courses: {
    en: "Explore Courses",
    hi: "कोर्स देखें"
  },
  cta_youtube: {
    en: "Free Demo Classes",
    hi: "फ्री डेमो क्लास"
  },
  cta_live_batch: {
    en: "Join Live Batch 2026 (Daily 6 PM)",
    hi: "नया लाइव बैच 2026 (रोज शाम 6 बजे)"
  },
  hero_badge: {
    en: "India's #1 Statistics Platform",
    hi: "Statistics के लिए भारत का नंबर 1 प्लेटफॉर्म"
  },
  library_announcement: {
    en: "सम्पूर्ण (Sampoorna) Library - Access Premium Notes & Resources",
    hi: "सम्पूर्ण (Sampoorna) लाइब्रेरी - यहाँ मिलेंगे बेहतरीन नोट्स और बुक्स"
  },
  // Navbar
  nav_home: { en: "Home", hi: "होम" },
  nav_courses: { en: "Courses", hi: "कोर्स" },
  nav_about: { en: "About", hi: "हमारे बारे में" },
  nav_offline: { en: "Offline Center", hi: "ऑफलाइन सेंटर" },
  nav_contact: { en: "Contact", hi: "संपर्क करें" },
  nav_testimonials: { en: "Reviews", hi: "स्टूडेंट्स की राय" },
  download_app: { en: "Download App", hi: "ऐप डाउनलोड करें" },
  // Testimonials
  testimonials_title: {
    en: "Trusted by Thousands",
    hi: "हजारों छात्रों का भरोसा"
  },
  testimonials_subtitle: {
    en: "Hear from our students who transformed their preparation and achieved their dream goals.",
    hi: "सुनिए उन स्टूडेंट्स की बातें जिन्होंने हमारे साथ अपनी तैयारी की और सफलता पाई।"
  },
  share_review: {
    en: "Share Your Review",
    hi: "अपनी राय साझा करें"
  },
  // Contact
  contact_title: { en: "Get in Touch", hi: "हमसे जुड़ें" },
  contact_subtitle: { en: "Have questions? We're here to help you on your journey.", hi: "कोई सवाल है? आपकी मदद के लिए हम हमेशा तैयार हैं।" },
  // About
  about_title: { en: "India's Premier Statistics Learning Hub", hi: "Statistics सीखने का भारत का सबसे अच्छा सेंटर" },
  about_description: {
    en: "Founded by SG Sir, we are dedicated to making Statistics accessible, understandable, and exam-oriented for aspirants across India.",
    hi: "SG सर के मार्गदर्शन में सांख्यिकी को समझना अब हुआ बहुत आसान। हमारा लक्ष्य हर स्टूडेंट को परीक्षा में सफल बनाना है।"
  },
  // Footer
  footer_desc: {
    en: "Empowering students with top-tier statistics coaching, conceptual clarity, and exam-proven strategies since 2012.",
    hi: "2012 से हम स्टूडेंट्स को सांख्यिकी के कठिन कॉन्सेप्ट्स आसानी से समझाने और एग्जाम्स में सफल बनाने में मदद कर रहे हैं।"
  },
  footer_nav_title: { en: "Quick Navigation", hi: "जरूरी लिंक्स" },
  footer_policies_title: { en: "Policies", hi: "नियम" },
  footer_presence_title: { en: "Our Presence", hi: "हमारा पता" },
  footer_link_batches: { en: "Latest Batches", hi: "नए बैच" },
  footer_link_youtube: { en: "YouTube Classes", hi: "यूट्यूब क्लास" },
  latest_batch_heading: { en: "LATEST BATCH 2026", hi: "नया बैच 2026" },
  footer_link_about: { en: "About SG Sir", hi: "SG सर के बारे में" },
  footer_link_reviews: { en: "Student Reviews", hi: "स्टूडेंट्स के रिव्यूज" },
  footer_tos: { en: "Terms of Service", hi: "शर्तें" },
  footer_refund: { en: "Refund Policy", hi: "रिफंड नियम" },
  footer_rights: { en: "All rights reserved.", hi: "सभी अधिकार सुरक्षित।" },
  back_to_home: { en: "Back to Home", hi: "होम पर वापस जाएं" },
  footer_crafted: { en: "Crafted for excellence", hi: "बेहतरीन भविष्य के लिए" },
  // YouTube
  youtube_title: { en: "Free Learning Resources", hi: "फ्री पढ़ाई के साधन" },
  youtube_subtitle: {
    en: "Watch our latest lectures, strategy sessions, and problem-solving masterclasses directly from our official channel.",
    hi: "हमारे यूट्यूब चैनल पर फ्री लेक्चर्स, तैयारी की टिप्स और सवालों के हल देखें।"
  },
  youtube_quality_msg: {
    en: "Free but no compromise in quality",
    hi: "फ्री है, पर क्वालिटी में कोई समझौता नहीं"
  },
  youtube_visit: { en: "Visit Official YouTube Channel", hi: "यूट्यूब पर जाएं" },
  youtube_fetching: { en: "Fetching latest videos...", hi: "वीडियो लोड हो रहे हैं..." },
  library_hot: { en: "Premium Access", hi: "टॉप नोट्स" },
  library_title: { en: "सम्पूर्ण (Sampoorna) Library", hi: "सम्पूर्ण (Sampoorna) लाइब्रेरी" },
  // App Showcase
  app_title_main: { en: "Study Smarter", hi: "पढ़ाई का नया तरीका" },
  app_subtitle_main: { en: "On The Go.", hi: "कहीं भी, कभी भी।" },
  app_desc: {
    en: "Unlock the ultimate statistics companion on your smartphone. Experience seamless learning with our feature-packed official app.",
    hi: "अपने स्मार्टफोन पर आसानी से सांख्यिकी सीखें। हमारे ऐप के साथ पढ़ाई करना हुआ और भी मजेदार।"
  },
  app_rating: { en: "App Store Rating", hi: "ऐप रेटिंग" },
  app_feature_1: { en: "Daily Live Interactive Classes", hi: "रोजाना लाइव क्लास" },
  app_feature_2: { en: "Live Interactive Doubt Sessions", hi: "लाइव डाउट सॉल्विंग सेशन्स" },
  app_feature_3: { en: "Concept-wise Practice Tests", hi: "हर टॉपिक के प्रैक्टिस टेस्ट" },
  app_feature_4: { en: "Expert One-on-One Support", hi: "टीचर्स से सीधा संपर्क" },
  about_extra_desc: {
    en: "Our methodology focuses on the 'Why' behind every statistical formula, ensuring long-term retention and success in competitive exams.",
    hi: "हम रटने पर नहीं, समझने पर जोर देते हैं। हर फॉर्मूले की वजह जानकर एग्जाम्स में सफल होना आसान हो जाता है।"
  },
  about_satisfaction: { en: "Satisfaction Rate", hi: "छात्र संतुष्टि" },
  school_goal_9: { en: "Foundation Excellence (Class 9)", hi: "कक्षा 9 - मजबूत आधार की शुरुआत" },
  school_goal_10: { en: "Neev (Class 10)", hi: "नींव (कक्षा 10 - बोर्ड की तैयारी)" },
  school_goal_11: { en: "Concept Mastery (Class 11)", hi: "कक्षा 11 - गहराई से समझें" },
  school_goal_12: { en: "Board Excellence (Class 12)", hi: "कक्षा 12 - बोर्ड परीक्षा में सफलता" },
  competitive_goal: { en: "Aim High, Reach Higher", hi: "ऊँचा लक्ष्य, बड़ी सफलता" },
  university_goal: { en: "University Topper's Choice", hi: "यूनिवर्सिटी टॉपर बनने के लिए" },
  
  category_school: { en: "School Foundation & Board Exams", hi: "स्कूली शिक्षा और बोर्ड एग्जाम्स" },
  category_competitive: { en: "Competitive & Govt. Exams", hi: "कॉम्पिटिटिव और सरकारी एग्जाम्स" },
  category_university: { en: "University Exam", hi: "विश्वविद्यालय (University) परीक्षा" },
  form_topic: { en: "Topic of Inquiry", hi: "पूछताछ का विषय" },
  form_option_jam: { en: "IIT-JAM Statistics", hi: "IIT-JAM Statistics" },
  form_option_offline: { en: "Offline Batch Inquiry", hi: "ऑफलाइन बैच की जानकारी" },
  form_option_net: { en: "CSIR/UGC NET", hi: "CSIR/UGC NET" },
  form_option_grad: { en: "BSc/BA Statistics", hi: "BSc/BA Statistics" },
  form_option_aso: { en: "UPSSSC ASO/ARO", hi: "UPSSSC ASO/ARO" },
  form_option_gate: { en: "GATE Statistics", hi: "GATE Statistics" },
  form_option_iss: { en: "ISS/RBI DSIM", hi: "ISS/RBI DSIM" },
  form_option_other: { en: "Other Questions", hi: "अन्य सवाल" },
  form_subject_select: { en: "Choose Your Topic", hi: "अपना विषय चुनें" },
  offline_title: { en: "Lucknow Classroom Center", hi: "हमारा लखनऊ सेंटर" },
  offline_subtitle: { en: "Experience Classroom Learning at Nirala Nagar Center", hi: "निराला नगर में हमारे साथ आमने-सामने पढ़ें" },
  offline_desc: { 
    en: "Join our physical batches for personalized mentoring, real-time doubt solving, and a focused competitive environment.",
    hi: "सीधे क्लास में आकर तैयारी करें, जहाँ आपको मिलता है व्यक्तिगत ध्यान और तुरंत डाउट सॉल्विंग।"
  },
  offline_location_badge: { en: "Visit our Lucknow Center", hi: "लखनऊ सेंटर पर आएं" },
  offline_visit: { en: "Visit Our Classroom Website", hi: "क्लासरूम वेबसाइट देखें" },
  // Courses
  courses_title: { en: "Premium Courses", hi: "खास कोर्सेज" },
  courses_subtitle: { en: "Built for Success", hi: "सफलता की गारंटी" },
  courses_description: {
    en: "Choose your target exam and start learning with structured video lectures, premium notes, and mock tests.",
    hi: "अपनी पसंद का एग्जाम चुनें और वीडियो लेक्चर्स, नोट्स और टेस्ट्स के साथ पढ़ाई शुरू करें।"
  },
  explore_app: { en: "Explore all in App", hi: "ऐप में सब देखें" },
  view_details: { en: "View Details", hi: "जानकारी देखें" },
  coming_soon: { en: "Coming Soon", hi: "जल्द आ रहा है" },
  back: { en: "Back", hi: "पीछे" },
  ai_tutor_name: { en: "Sankhikyi", hi: "Sankhikyi (सांख्यिकी)" },
  ai_tutor_greeting: { en: "How may I help you?", hi: "मैं आपकी क्या मदद कर सकती हूँ?" },
  ai_tutor_intro_msg: { en: "Ask Sankhikyi anything!", hi: "Sankhikyi से कुछ भी पूछें!" },
  ai_tutor_welcome: { en: "Hello! I'm Sankhikyi, your AI Statistics Tutor. Ask me anything about statistics concepts, formulas, or exam strategies.", hi: "नमस्ते! मैं Sankhikyi हूँ, आपकी AI सांख्यिकी ट्यूटर। मुझसे पढ़ाई से जुड़ा कुछ भी पूछें।" },
  ai_tutor_title: { en: "Chat with Sankhikyi", hi: "Sankhikyi से बात करें" },
  starts_at: { en: "Starts at", hi: "कीमत केवल" },
  free: { en: "FREE", hi: "मुफ्त" },
  offline_available: { en: "Also available offline", hi: "ऑफलाइन भी उपलब्ध है" },
  description_aso: {
    en: "Complete statistics syllabus coverage specifically tailored for Assistant Statistical Officer.",
    hi: "सहायक सांख्यिकी अधिकारी (ASO) के लिए पूरा सांख्यिकी कोर्स।"
  },
  title_gate: { en: "GATE STATISTICS (ST)", hi: "GATE Statistics (ST)" },
  description_gate: {
    en: "Comprehensive coverage of the GATE Statistics syllabus with advanced problem solving.",
    hi: "GATE के लिए सांख्यिकी का पूरा कोर्स और कठिन सवालों का हल।"
  },
  title_iss: { en: "ISS / RBI G-B (DSIM)", hi: "ISS / RBI G-B (DSIM)" },
  description_iss: {
    en: "High-level preparation module for Indian Statistical Service and RBI Grade B (DSIM).",
    hi: "भारतीय सांख्यिकी सेवा (ISS) और RBI के लिए एडवांस तैयारी कोर्स।"
  },
  title_jam: { en: "IIT-JAM Statistics", hi: "IIT-JAM Statistics" },
  description_jam: {
    en: "Advanced concepts and previous year papers for IIT entrance exams.",
    hi: "IIT एग्जाम्स के लिए खास टॉपिक्स और पिछले सालों के प्रश्न हल।"
  },
  title_net: { en: "CSIR NET / UGC NET", hi: "CSIR NET / UGC NET" },
  description_net: {
    en: "Mathematical statistics module tailored for clearing JRF & Lectureship.",
    hi: "JRF और लेक्चर्स के लिए तैयार किया गया गणितीय सांख्यिकी कोर्स।"
  },
  title_grad: { en: "BSc / BA Statistics", hi: "BSc / BA Statistics" },
  description_grad: {
    en: "Foundation building and university exam preparation for graduation level.",
    hi: "ग्रेजुएशन के लिए कॉलेज एग्जाम्स और बेसिक्स की तैयारी।"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('en');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadLang = async () => {
      const prefs = await persistenceService.loadPreferences(user?.uid || null);
      if (prefs?.language) {
        setLanguage(prefs.language as Language);
      }
      setIsReady(true);
    };
    loadLang();
  }, [user?.uid]);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    persistenceService.savePreferences(user?.uid || null, { language: lang });
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  if (!isReady) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
