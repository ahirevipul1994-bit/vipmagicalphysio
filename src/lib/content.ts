// Authored fallback content (English). Owner edits via content_pages override title/body per slug+language.
export interface Article { slug: string; title: string; summary: string; body: string[] }

export const serviceDetails: Record<string, { forWhom: string[]; approach: string[]; note: string }> = {
  'orthopaedic-physiotherapy': {
    forWhom: ['Knee, hip, shoulder or back discomfort that affects daily tasks', 'Stiffness after a period of reduced activity', 'People wanting to understand how to move with less worry'],
    approach: ['A conversation about what matters to you day to day', 'A physical assessment of movement, strength and comfort', 'A plan explained in plain language, adjusted as you go'],
    note: 'Some symptoms need medical review first. If anything in your assessment suggests that, we will tell you and suggest who to see.',
  },
  'neurological-rehabilitation': {
    forWhom: ['People living with changes to movement after a neurological condition', 'Families wanting guidance on safe everyday practice', 'Anyone working on balance, walking or transfers'],
    approach: ['Goals chosen together, such as walking to the gate or getting up from a chair', 'Practice of real everyday movements', 'Clear guidance for caregivers on how to help safely'],
    note: 'Rehabilitation works alongside your medical team. It does not replace their care or advice.',
  },
  'post-operative-rehabilitation': {
    forWhom: ['People recovering after joint or other surgery', 'Those unsure what movement is safe after leaving hospital'],
    approach: ['We follow the guidance given by your surgical team', 'Gradual, measured progression of activity', 'Regular review of how you are feeling and moving'],
    note: 'Please bring or share your discharge advice in person, not through the website form.',
  },
  'geriatric-physiotherapy': {
    forWhom: ['Older adults wanting to stay strong and steady', 'People worried about falls or losing confidence outdoors', 'Caregivers looking for safe ways to support activity'],
    approach: ['Gentle assessment of strength, balance and walking', 'Simple exercises that fit into ordinary routines', 'Practical home suggestions to reduce trip hazards'],
    note: 'Progress looks different for everyone. We do not promise specific outcomes; we work honestly towards your goals.',
  },
  'home-visit-physiotherapy': {
    forWhom: ['People for whom travel is difficult or tiring', 'Families who want guidance in the real home setting'],
    approach: ['Request a visit with your locality and a preferred date', 'Availability and timing are confirmed personally', 'Sessions focus on movement within your own home'],
    note: 'Home visits depend on location and availability. Submitting a request does not confirm a visit.',
  },
  'online-consultation': {
    forWhom: ['People seeking initial guidance before an in-person visit', 'Family members living away who want to understand options'],
    approach: ['A video or phone conversation about goals and concerns', 'General guidance where it is clinically appropriate', 'A recommendation for in-person care where that is safer'],
    note: 'Some things cannot be assessed remotely. We will tell you honestly if an in-person assessment is needed.',
  },
};

export const education: Record<string, Article> = {
  pain: { slug: 'pain', title: 'Understanding pain', summary: 'Pain is real, and it is also complicated. A gentle introduction to how it works.', body: [
    'Pain is the body\u2019s protective alarm. It is always real, but how much it hurts does not always match how much damage there is. Sleep, worry, stress and past experiences can all turn the volume up or down.',
    'For long-lasting aches, complete rest is not always the safest choice. Gentle, regular movement often helps the body feel safer. A physiotherapist can help you find a level that feels manageable.',
    'Seek urgent medical help for sudden severe pain, chest pain, new weakness or numbness, loss of bladder or bowel control, a fall with injury, or pain with fever. This page is general information, not personal advice.',
  ] },
  exercise: { slug: 'exercise', title: 'Exercise basics', summary: 'Small, steady and regular usually beats big and occasional.', body: [
    'Start small. A few minutes of movement, repeated through the day, can be easier to keep up than one long session.',
    'Hold onto something steady, like a kitchen counter, when practising standing exercises. Wear supportive footwear and keep the floor clear.',
    'Mild effort and slight muscle tiredness are normal. Sharp pain, dizziness, breathlessness or chest discomfort are signs to stop and seek advice.',
    'Exercises suited to one person may not suit another. An individual assessment helps choose what is right for you.',
  ] },
  'healthy-ageing': { slug: 'healthy-ageing', title: 'Healthy ageing', summary: 'Strength, balance and confidence can be practised at any age.', body: [
    'Muscle strength and balance respond to practice throughout life. Getting up from a chair, climbing a step and walking outdoors are all skills worth keeping.',
    'Reduce trip hazards at home: good lighting at night, a clear path to the bathroom, and secure rugs or no rugs at all.',
    'Stay connected. Walking with a friend, attending the temple or market, and staying socially active all support movement.',
    'Caregivers matter too. Learning safe ways to help someone stand or walk protects both of you.',
  ] },
};

export const articles: Article[] = [
  { slug: 'getting-up-from-a-chair', title: 'Getting up from a chair with less effort', summary: 'A few general principles that many people find helpful.', body: [
    'Shuffle forward to the edge of the seat. Place feet slightly behind the knees. Lean forward, "nose over toes", then push through the legs.',
    'Use chair arms if available. A firmer, higher chair is often easier than a low sofa.', 'If you feel dizzy when standing, pause and seek advice.'] },
  { slug: 'caring-for-a-parent', title: 'For caregivers: helping without lifting', summary: 'Supporting a family member safely, for both of you.', body: [
    'Encourage the person to do as much as they safely can. Guide rather than lift.', 'Protect your own back: stand close, bend your knees, avoid twisting.',
    'Ask a physiotherapist to show you techniques suited to your family member.'] },
  { slug: 'walking-outdoors', title: 'Walking outdoors with confidence', summary: 'Preparing for uneven ground, steps and busy roads.', body: [
    'Choose familiar routes first and walk at quieter times.', 'Supportive footwear and a correctly sized walking aid, if recommended, make a difference.',
    'Build distance gradually and plan places to rest.'] },
];

export const ebooks = [
  { title: 'Steady at Home', blurb: 'A plain-language guide to moving safely around the home.' },
  { title: 'A Caregiver\u2019s Companion', blurb: 'Practical, everyday support for family caregivers.' },
  { title: 'Strong After Sixty', blurb: 'Gentle, general strength and balance ideas.' },
];

export const faqs = [
  { q: 'Do I need a doctor\u2019s referral?', a: 'Not always. If something in your assessment suggests medical review is needed, we will tell you.' },
  { q: 'Is submitting a form the same as booking?', a: 'No. Every form on this site is a request. Your appointment is confirmed only when we contact you personally.' },
  { q: 'Do you offer home visits?', a: 'Home visits can be requested in and around Shirur. Availability depends on location and timing and is confirmed personally.' },
  { q: 'What are the fees?', a: 'Fees have not been published on this website yet. Please ask when we contact you about your request.' },
  { q: 'Can a family member make the request?', a: 'Yes. Caregivers are welcome to request and attend with the person they care for, with that person\u2019s agreement.' },
  { q: 'What should I bring?', a: 'Comfortable clothing and any reports or discharge advice you already have. Please share medical documents in person, not through the website.' },
  { q: 'Is online consultation suitable for everyone?', a: 'No. Some concerns need hands-on assessment. We will recommend an in-person visit when that is safer.' },
];
