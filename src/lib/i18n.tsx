import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Language } from '@/lib/business';

const dict = {
  en: {
    videos: 'Videos', home: 'Home', about: 'About', services: 'Services', education: 'Learn', blog: 'Articles', ebooks: 'eBooks', faqs: 'FAQs', contact: 'Contact', book: 'Request a visit',
    pain: 'Understanding pain', exercise: 'Exercise basics', ageing: 'Healthy ageing',
    heroKicker: 'Physiotherapy in Shirur, Pune District',
    heroTitle: 'Move through your day with steadier steps.',
    heroBody: 'Patient, honest physiotherapy for older adults and the families who care for them. At the clinic, at home, or online, where appropriate.',
    heroCta: 'Request an appointment', heroSecondary: 'See how we help',
    waysTitle: 'Three ways to begin', clinic: 'Clinic visit', homeVisit: 'Home visit', online: 'Online consultation', general: 'General question',
    clinicBody: 'Come in for an individual assessment, by appointment.', homeBody: 'Ask for a visit at home in and around Shirur. Availability is confirmed personally.', onlineBody: 'Talk through goals and guidance remotely, where clinically appropriate.',
    promiseTitle: 'What you can expect', p1: 'We listen first', p1b: 'Your goals, your pace, your words.', p2: 'We explain plainly', p2b: 'No jargon, no pressure, no promises we cannot keep.', p3: 'We include family', p3b: 'Caregivers are welcome in every conversation.', p4: 'We refer when needed', p4b: 'If physiotherapy is not right for you, we will say so.',
    learnTitle: 'Read before you visit', allServices: 'All services', readMore: 'Read more',
    name: 'Your name', phone: 'Phone number', email: 'Email (optional)', kind: 'Type of request', service: 'Service', date: 'Preferred date (optional)', locality: 'Locality / area (optional)', message: 'Short message (optional)',
    noClinical: 'Please do not share medical reports or detailed health information here. We will discuss that privately.',
    consent: 'I agree that VIP MAGICAL PHYSIO may contact me about this request, as described in the Privacy Policy.',
    submit: 'Send request', sending: 'Sending...', requestNote: 'This is a request, not a confirmed appointment. We will contact you to confirm.',
    successTitle: 'Request received', successBody: 'Your reference is below. Your appointment is not confirmed until we contact you.',
    unavailable: 'Online requests are not available yet', unavailableBody: 'The owner has not finished connecting the online request system. Nothing will be submitted from this form until it is configured.',
    callUnavailable: 'Phone and WhatsApp details have not been published yet.', call: 'Call', whatsapp: 'WhatsApp',
    language: 'Language', owner: 'Owner sign in', privacy: 'Privacy', terms: 'Terms', refund: 'Refunds',
    required: 'Required', chooseService: 'Choose a service', notSure: 'Not sure yet',
  },
  hi: {
    videos: 'वीडियो',
    home: 'होम', about: 'परिचय', services: 'सेवाएँ', education: 'जानकारी', blog: 'लेख', ebooks: 'ई-बुक्स', faqs: 'सामान्य प्रश्न', contact: 'संपर्क', book: 'मुलाक़ात का अनुरोध',
    pain: 'दर्द को समझें', exercise: 'व्यायाम की मूल बातें', ageing: 'स्वस्थ बढ़ती उम्र',
    heroKicker: 'शिरूर, पुणे ज़िले में फिज़ियोथेरेपी',
    heroTitle: 'हर दिन, ज़्यादा भरोसे के साथ चलें।',
    heroBody: 'बुज़ुर्गों और उनकी देखभाल करने वाले परिवारों के लिए धैर्यपूर्ण, ईमानदार फिज़ियोथेरेपी। क्लिनिक में, घर पर, या उपयुक्त होने पर ऑनलाइन।',
    heroCta: 'अपॉइंटमेंट का अनुरोध करें', heroSecondary: 'हम कैसे मदद करते हैं',
    waysTitle: 'शुरुआत के तीन तरीके', clinic: 'क्लिनिक विज़िट', homeVisit: 'घर पर विज़िट', online: 'ऑनलाइन परामर्श', general: 'सामान्य प्रश्न',
    clinicBody: 'अपॉइंटमेंट द्वारा व्यक्तिगत आकलन के लिए आएँ।', homeBody: 'शिरूर और आसपास घर पर विज़िट का अनुरोध करें। उपलब्धता व्यक्तिगत रूप से पुष्टि की जाती है।', onlineBody: 'उपयुक्त होने पर दूर से लक्ष्य और मार्गदर्शन पर बात करें।',
    promiseTitle: 'आप क्या उम्मीद कर सकते हैं', p1: 'पहले हम सुनते हैं', p1b: 'आपके लक्ष्य, आपकी गति।', p2: 'हम सरल भाषा में समझाते हैं', p2b: 'कोई दबाव नहीं, कोई झूठा वादा नहीं।', p3: 'परिवार को शामिल करते हैं', p3b: 'देखभाल करने वाले हर बातचीत में स्वागत योग्य हैं।', p4: 'ज़रूरत हो तो रेफ़र करते हैं', p4b: 'अगर फिज़ियोथेरेपी सही नहीं है, तो हम बताएँगे।',
    learnTitle: 'आने से पहले पढ़ें', allServices: 'सभी सेवाएँ', readMore: 'और पढ़ें',
    name: 'आपका नाम', phone: 'फ़ोन नंबर', email: 'ईमेल (वैकल्पिक)', kind: 'अनुरोध का प्रकार', service: 'सेवा', date: 'पसंदीदा तारीख़ (वैकल्पिक)', locality: 'इलाका (वैकल्पिक)', message: 'छोटा संदेश (वैकल्पिक)',
    noClinical: 'कृपया यहाँ मेडिकल रिपोर्ट या विस्तृत स्वास्थ्य जानकारी साझा न करें। हम उस पर निजी रूप से बात करेंगे।',
    consent: 'मैं सहमत हूँ कि VIP MAGICAL PHYSIO इस अनुरोध के बारे में गोपनीयता नीति के अनुसार मुझसे संपर्क कर सकता है।',
    submit: 'अनुरोध भेजें', sending: 'भेजा जा रहा है...', requestNote: 'यह एक अनुरोध है, पुष्टि की गई अपॉइंटमेंट नहीं। पुष्टि के लिए हम आपसे संपर्क करेंगे।',
    successTitle: 'अनुरोध मिल गया', successBody: 'आपका संदर्भ नंबर नीचे है। हमारे संपर्क करने तक अपॉइंटमेंट पक्की नहीं है।',
    unavailable: 'ऑनलाइन अनुरोध अभी उपलब्ध नहीं हैं', unavailableBody: 'मालिक ने अभी ऑनलाइन अनुरोध प्रणाली कनेक्ट नहीं की है। कॉन्फ़िगर होने तक इस फ़ॉर्म से कुछ भी नहीं भेजा जाएगा।',
    callUnavailable: 'फ़ोन और WhatsApp विवरण अभी प्रकाशित नहीं हुए हैं।', call: 'कॉल करें', whatsapp: 'WhatsApp',
    language: 'भाषा', owner: 'मालिक लॉगिन', privacy: 'गोपनीयता', terms: 'शर्तें', refund: 'रिफ़ंड',
    required: 'आवश्यक', chooseService: 'सेवा चुनें', notSure: 'अभी पक्का नहीं',
  },
  mr: {
    videos: 'व्हिडिओ',
    home: 'मुख्यपृष्ठ', about: 'ओळख', services: 'सेवा', education: 'माहिती', blog: 'लेख', ebooks: 'ई-पुस्तके', faqs: 'प्रश्नोत्तरे', contact: 'संपर्क', book: 'भेटीची विनंती',
    pain: 'वेदना समजून घ्या', exercise: 'व्यायामाची मूलतत्त्वे', ageing: 'निरोगी वृद्धत्व',
    heroKicker: 'शिरूर, पुणे जिल्ह्यात फिजिओथेरपी',
    heroTitle: 'रोजचा दिवस, अधिक स्थिर पावलांनी.',
    heroBody: 'ज्येष्ठ नागरिक आणि त्यांची काळजी घेणाऱ्या कुटुंबांसाठी संयमी, प्रामाणिक फिजिओथेरपी. क्लिनिकमध्ये, घरी किंवा योग्य असल्यास ऑनलाइन.',
    heroCta: 'अपॉइंटमेंटची विनंती करा', heroSecondary: 'आम्ही कशी मदत करतो',
    waysTitle: 'सुरुवात करण्याचे तीन मार्ग', clinic: 'क्लिनिक भेट', homeVisit: 'घरी भेट', online: 'ऑनलाइन सल्ला', general: 'सामान्य प्रश्न',
    clinicBody: 'अपॉइंटमेंटने वैयक्तिक तपासणीसाठी या.', homeBody: 'शिरूर व परिसरात घरी भेटीची विनंती करा. उपलब्धता वैयक्तिकरित्या निश्चित केली जाते.', onlineBody: 'योग्य असल्यास दूरूनच उद्दिष्टे व मार्गदर्शनावर बोला.',
    promiseTitle: 'तुम्ही काय अपेक्षा करू शकता', p1: 'आधी आम्ही ऐकतो', p1b: 'तुमची उद्दिष्टे, तुमचा वेग.', p2: 'सोप्या भाषेत समजावतो', p2b: 'दबाव नाही, खोटी आश्वासने नाहीत.', p3: 'कुटुंबाला सामील करतो', p3b: 'काळजीवाहकांचे प्रत्येक चर्चेत स्वागत.', p4: 'गरज असल्यास संदर्भ देतो', p4b: 'फिजिओथेरपी योग्य नसेल तर आम्ही स्पष्ट सांगू.',
    learnTitle: 'भेटीपूर्वी वाचा', allServices: 'सर्व सेवा', readMore: 'अधिक वाचा',
    name: 'तुमचे नाव', phone: 'फोन नंबर', email: 'ईमेल (ऐच्छिक)', kind: 'विनंतीचा प्रकार', service: 'सेवा', date: 'पसंतीची तारीख (ऐच्छिक)', locality: 'परिसर (ऐच्छिक)', message: 'छोटा संदेश (ऐच्छिक)',
    noClinical: 'कृपया येथे वैद्यकीय अहवाल किंवा सविस्तर आरोग्य माहिती देऊ नका. आपण ते खाजगीत बोलू.',
    consent: 'गोपनीयता धोरणानुसार VIP MAGICAL PHYSIO या विनंतीबाबत माझ्याशी संपर्क करू शकते, याला माझी संमती आहे.',
    submit: 'विनंती पाठवा', sending: 'पाठवत आहे...', requestNote: 'ही एक विनंती आहे, निश्चित अपॉइंटमेंट नाही. निश्चितीसाठी आम्ही संपर्क करू.',
    successTitle: 'विनंती मिळाली', successBody: 'तुमचा संदर्भ क्रमांक खाली आहे. आम्ही संपर्क करेपर्यंत अपॉइंटमेंट निश्चित नाही.',
    unavailable: 'ऑनलाइन विनंत्या अद्याप उपलब्ध नाहीत', unavailableBody: 'मालकाने अद्याप ऑनलाइन विनंती प्रणाली जोडलेली नाही. ती सुरू होईपर्यंत या फॉर्ममधून काहीही पाठवले जाणार नाही.',
    callUnavailable: 'फोन आणि WhatsApp तपशील अद्याप प्रसिद्ध केलेले नाहीत.', call: 'कॉल करा', whatsapp: 'WhatsApp',
    language: 'भाषा', owner: 'मालक लॉगिन', privacy: 'गोपनीयता', terms: 'अटी', refund: 'परतावा',
    required: 'आवश्यक', chooseService: 'सेवा निवडा', notSure: 'अजून नक्की नाही',
  },
} as const;

export type TKey = keyof typeof dict.en;
const Ctx = createContext<{ lang: Language; setLang: (l: Language) => void; t: (k: TKey) => string }>({ lang: 'en', setLang: () => {}, t: k => dict.en[k] });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const requested = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('lang') : null;
    if (requested === 'en' || requested === 'hi' || requested === 'mr') return requested;
    const s = typeof localStorage !== 'undefined' ? localStorage.getItem('vmp-lang') : null;
    return s === 'hi' || s === 'mr' ? s : 'en';
  });
  useEffect(() => {
    localStorage.setItem('vmp-lang', lang);
    document.documentElement.lang = lang;
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang',lang);
      window.history.replaceState(window.history.state,'',url);
    }
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang, t: k => dict[lang][k] }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
