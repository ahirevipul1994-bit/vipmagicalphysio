/* =========================================================
   VIP MAGICAL PHYSIO — SITE CONFIG + SERVICE CONTENT
   All clinical copy is original. No cure claims.
   ========================================================= */
window.PX_DATA = (function () {

  const SITE = {
    name: "VIP Magical Physio Clinic",
    shortName: "VIP Magical Physio",
    doctor: "Dr. Vipul Ahire",
    doctorSuffix: "(Physio)",
    experience: "approximately 6 years",
    phone: "8624860808",
    phoneDisplay: "86248 60808",
    phoneIntl: "+918624860808",
    whatsapp: "918624860808",
    email: "",                       // TO FILL
    addressLine1: "Please call for clinic directions",   // TO FILL
    addressLine2: "Shirur, Pune District, Maharashtra 412208",
    locality: "Shirur",
    region: "Maharashtra",
    country: "IN",
    postalCode: "412208",
    geo: { lat: "", lng: "" },       // TO FILL — needed for LocalBusiness schema
    hours: "By appointment — please call ahead",     // TO FILL
    domain: "https://vipmagicalphysio.netlify.app", // TO CONFIRM
    youtube: "https://youtube.com/@drvipulahireofficial",
    instagram: "https://instagram.com/dr.vipul.dardebody",
    brandDard: "Dard E Body Care",
    mapsQuery: "Shirur, Pune, Maharashtra, India",
    bookingNote: "Appointment requests are confirmed by phone after we check availability.",
    callBefore: "Please call before visiting — appointments are booked in advance."
  };

  /* ---------------- SERVICES ---------------- */
  const SERVICES = [
    {
      slug: "back-pain-physiotherapy",
      title: "Back Pain Physiotherapy",
      h1: "Back pain physiotherapy in Shirur",
      card: "Assessment-led care for persistent lower back and mid-back pain, built around movement you can actually keep doing.",
      who: "Adults with ongoing or recurring back pain, stiffness after sitting, or pain that limits bending, lifting and standing.",
      metaTitle: "Back Pain Physiotherapy in Shirur | VIP Magical Physio Clinic",
      metaDesc: "Assessment-led physiotherapy for lower back and mid-back pain in Shirur, Pune. Understand your pain, rebuild movement confidence. Call 86248 60808.",
      image: "assets/img/svc-back.jpg",
      imageAlt: "Physiotherapist assessing a seated patient's lower back in a clinic room",
      meaning: [
        "Most back pain is not a sign of serious damage. In the large majority of cases there is no single structure to blame, and imaging often shows changes that also appear in people with no pain at all. What we can work with is how your back moves, how much load it tolerates, and how confident you feel using it.",
        "Physiotherapy for back pain is therefore not about finding the one 'bad disc' and fixing it. It is about building capacity — gradually teaching your back to handle more than it currently does, and removing the fear that keeps people still."
      ],
      difficulties: [
        "Pain or stiffness that is worse in the morning or after long sitting",
        "Difficulty bending forward, putting on shoes or getting up from a low chair",
        "Reluctance to lift everyday objects such as groceries or a grandchild",
        "Sleep disturbed by pain when turning in bed",
        "Episodes that settle and then return every few months"
      ],
      whenToAssess: [
        "Pain has lasted more than a few weeks, or keeps returning",
        "You are avoiding normal activities because you are worried about damage",
        "Pain limits work, driving, housework or sleep",
        "You want to return to exercise, gym or walking without fear of a flare-up",
        "You have been told to 'rest' but are unsure how long, or how to start moving again"
      ],
      assessment: [
        "A conversation about when the pain started, what makes it better or worse, and what you have already tried",
        "Observation of how you sit, stand, walk and bend, rather than only where it hurts",
        "Movement and strength checks of the spine, hips and trunk to identify what is under-performing",
        "Where appropriate, simple neurological and nerve-tension screening",
        "A discussion of your daily demands — work, travel, caregiving — so the plan fits your real life"
      ],
      principles: [
        "Reassurance based on your actual examination, not blanket promises",
        "Graded exposure: doing slightly more each week, in a planned way",
        "Strength work for the trunk, hips and legs, because the back rarely works alone",
        "Practical education about load, posture and recovery expectations",
        "Reviewing progress against activities that matter to you, not just pain scores"
      ],
      exercises: [
        "Gentle spinal mobility in lying, performed slowly and within a comfortable range",
        "Supported hip-hinge practice to reintroduce safe bending and lifting mechanics",
        "Progressive trunk and hip strengthening, starting with body weight",
        "Short, frequent walking bouts to build tolerance to upright posture"
      ],
      safety: [
        "Stop an exercise if pain sharply increases, or if you feel numbness, weakness or dizziness",
        "Mild discomfort during movement that settles within about 24 hours is usually acceptable — discuss this with us rather than deciding alone",
        "Avoid bed rest beyond a day or two unless specifically advised",
        "Do not begin loaded strengthening without guidance if you have had recent spinal surgery"
      ],
      redFlags: [
        "Loss of bladder or bowel control, or numbness around the groin or inner thighs",
        "Progressive weakness in one or both legs, or a foot that drags",
        "Back pain following a significant fall or accident",
        "Unexplained weight loss, fever, or pain that is severe at night and unrelieved by rest",
        "A history of cancer, or long-term steroid use, with new back pain"
      ],
      faqs: [
        { q: "Do I need an MRI before starting physiotherapy?", a: "Usually not. A clinical examination is the first step, and most back pain does not require imaging to begin treatment. If your examination suggests something that needs medical or surgical review, we will tell you and refer you onward." },
        { q: "How long does it take to improve?", a: "It varies a great deal between people, and anyone promising a fixed timeline is guessing. Many people notice meaningful change over several weeks of consistent work. We review progress regularly and adjust the plan rather than sticking to a fixed number of sessions." },
        { q: "Should I rest or keep moving?", a: "Gentle, progressive movement is generally better than prolonged rest. Rest beyond a day or two tends to make backs stiffer and less tolerant. We will help you find the amount of movement that is right for your current stage." },
        { q: "Can physiotherapy help if my pain has lasted for years?", a: "Long-standing pain often responds to a combination of graded activity, strength work and education about how pain behaves. Improvement is usually gradual rather than dramatic, and the goal is function — what you can do — as much as comfort." }
      ],
      relatedArticle: "back-pain-when-to-consult-a-physiotherapist"
    },
    {
      slug: "neck-pain-physiotherapy",
      title: "Neck Pain Physiotherapy",
      h1: "Neck pain physiotherapy in Shirur",
      card: "For neck stiffness, desk-related strain and headaches that come with prolonged screen use.",
      who: "People with neck stiffness, shoulder-top tightness, desk or phone-related strain, or headaches linked to neck posture.",
      metaTitle: "Neck Pain Physiotherapy in Shirur | VIP Magical Physio Clinic",
      metaDesc: "Physiotherapy for neck pain, stiffness and posture-related headaches in Shirur, Pune. Practical, assessment-led care. Call 86248 60808.",
      image: "assets/img/svc-neck.jpg",
      imageAlt: "Person seated at a desk holding a phone, pressing the back of their neck",
      meaning: [
        "Neck pain is commonly related to sustained positions — long hours at a screen, driving, or looking down at a phone — combined with limited strength in the muscles that support the neck and upper back. The joints stiffen, the muscles work harder than they need to, and the result is ache, tightness and sometimes a headache that starts at the base of the skull.",
        "The useful question is not 'is my posture bad?' but 'can my neck tolerate what I ask of it, and for how long?' That is a question we can answer with an examination, and improve with targeted work."
      ],
      difficulties: [
        "Stiffness turning the head when reversing a car or looking over a shoulder",
        "Ache at the top of the shoulders that builds through the working day",
        "Headaches starting at the back of the head and spreading forward",
        "Difficulty finding a comfortable sleeping position",
        "Tingling or heaviness in an arm in some cases"
      ],
      whenToAssess: [
        "Neck pain has persisted for more than two to three weeks",
        "Symptoms are affecting concentration, sleep or driving",
        "You have tingling, numbness or weakness in the arm or hand",
        "Headaches are frequent and seem linked to neck position",
        "You want to set up your workstation properly and stop the cycle recurring"
      ],
      assessment: [
        "History of symptom onset, work patterns and screen hours",
        "Active and passive neck movement, noting what reproduces the pain",
        "Strength and endurance testing of the deep neck flexors and shoulder blade muscles",
        "Neural screening if arm symptoms are present",
        "A practical review of your desk, chair and phone habits where relevant"
      ],
      principles: [
        "Reduce sustained end-range positions rather than chasing a 'perfect' posture",
        "Build endurance in the neck and upper back, since endurance matters more than peak strength here",
        "Address sleep position and pillow height where it is contributing",
        "Teach self-management for flare-ups so you are not dependent on appointments",
        "Progress load gradually — necks tolerate change slowly"
      ],
      exercises: [
        "Gentle chin-nod control in lying, focusing on precision rather than effort",
        "Shoulder blade setting and rowing movements",
        "Short, frequent breaks with a simple mobility routine during screen work",
        "Progressive upper-back strengthening"
      ],
      safety: [
        "Avoid strong manual stretching of the neck into end range, particularly if you feel dizzy",
        "Stop if you experience visual disturbance, severe headache or nausea",
        "Do not use a cervical traction device without assessment and instruction"
      ],
      redFlags: [
        "Neck pain after a significant accident or fall",
        "Arm weakness that is worsening, or clumsiness in the hands",
        "Difficulty walking, or unsteadiness that is new",
        "Severe headache with fever, rash or neck rigidity",
        "Unexplained weight loss or a history of cancer with new neck pain"
      ],
      faqs: [
        { q: "Is my posture causing my neck pain?", a: "Posture contributes, but it is rarely the whole story. The same posture affects different people differently. Rather than forcing a rigid 'correct' position, we aim for variety of position, adequate strength and the endurance to hold good positions through the day." },
        { q: "Do I need a special pillow?", a: "A pillow that keeps your head roughly in line with your body when lying on your side, and supports the natural curve when on your back, is usually enough. Expensive specialist pillows help some people and disappoint others — we would rather assess first." },
        { q: "Can physiotherapy help tension headaches?", a: "Where headaches are driven by neck joints and muscles, physiotherapy often helps. Headaches with other causes need medical assessment, and we will tell you if your presentation needs that." }
      ],
      relatedArticle: "neck-pain-and-smartphone-use"
    },
    {
      slug: "knee-pain-physiotherapy",
      title: "Knee Pain Physiotherapy",
      h1: "Knee pain physiotherapy in Shirur",
      card: "For knee pain with stairs, squatting and walking — including age-related changes and post-injury recovery.",
      who: "Adults with knee pain on stairs or squatting, swelling, stiffness, or recovery after a knee injury.",
      metaTitle: "Knee Pain Physiotherapy in Shirur | VIP Magical Physio Clinic",
      metaDesc: "Physiotherapy for knee pain, stiffness and post-injury recovery in Shirur, Pune. Quadriceps strength, movement confidence and practical advice. Call 86248 60808.",
      image: "assets/img/svc-knee.jpg",
      imageAlt: "Physiotherapist supporting a patient's knee during a seated assessment",
      meaning: [
        "Knee pain is often less about the joint surface than about the muscles that control it. When the quadriceps and hip muscles are weak or slow to activate, load passes through the joint differently, and activities like stairs, squatting and standing up become painful.",
        "Age-related changes on an X-ray are common and do not map neatly onto pain. Many people with visible changes have no pain, and many with significant pain have modest findings. What we can change is strength, movement quality, weight management support and confidence with activity."
      ],
      difficulties: [
        "Pain going down stairs, or difficulty rising from a low chair",
        "Swelling after walking or standing for long periods",
        "Stiffness in the morning or after sitting",
        "Difficulty squatting, kneeling or using Indian-style toilets",
        "A feeling of instability or 'giving way'"
      ],
      whenToAssess: [
        "Pain has lasted more than two to three weeks",
        "Swelling recurs with activity",
        "You are limping or avoiding stairs",
        "You have had a knee injury and the joint still feels unreliable",
        "You have been advised surgery and want to prepare, or have had surgery and need rehabilitation"
      ],
      assessment: [
        "History of onset, injury and aggravating activities",
        "Observation of walking, sit-to-stand and step-down mechanics",
        "Joint movement, swelling and specific ligament or meniscal testing where indicated",
        "Quadriceps, hip and calf strength testing",
        "A functional goal discussion — the stairs at home, the temple steps, the market walk"
      ],
      principles: [
        "Strength first: the quadriceps and hip musculature are the main levers we have",
        "Manage load — match activity to current capacity rather than stopping activity entirely",
        "Restore confidence with stairs and uneven ground through practice, not avoidance",
        "Address swelling early, since persistent swelling inhibits muscle function",
        "Support weight management where relevant, without making it the only conversation"
      ],
      exercises: [
        "Isometric quadriceps sets, then straight-leg raises as pain allows",
        "Sit-to-stand practice from a chair of appropriate height",
        "Step-up and step-down training on a low step",
        "Progressive hip strengthening — bridging, side-lying abduction, sit-to-stand with load"
      ],
      safety: [
        "Avoid deep squats and prolonged kneeling in the early stages if they reproduce sharp pain",
        "Do not push through sharp pain or new swelling that persists beyond a day",
        "Use a rail on stairs while strength is being rebuilt",
        "Ice or elevation after activity is reasonable for swelling; discuss prolonged use with us"
      ],
      redFlags: [
        "Inability to bear weight after an injury",
        "A knee that locks, or gives way repeatedly",
        "Rapid, large swelling within hours of an injury",
        "Fever with a hot, swollen joint",
        "Calf pain and swelling in the leg, particularly after surgery or immobility"
      ],
      faqs: [
        { q: "Is it safe to exercise with knee arthritis?", a: "For most people, yes — and it is usually the most effective non-surgical option. Strengthening the thigh and hip muscles reduces load on the joint. We start at a level your knee currently tolerates and build from there." },
        { q: "Will I need surgery?", a: "That is a decision for you and an orthopaedic surgeon. Our role is to give conservative rehabilitation a proper, well-dosed attempt, and to help you prepare well if surgery does become the plan." },
        { q: "Why does my knee hurt more going downstairs?", a: "Descending stairs loads the quadriceps heavily while the knee bends under body weight. It is a demanding task for a weakened muscle group, which is why it is often the first thing to hurt and the last to settle." }
      ],
      relatedArticle: "knee-pain-understanding-movement-and-rehabilitation"
    },
    {
      slug: "shoulder-pain-physiotherapy",
      title: "Shoulder Pain Physiotherapy",
      h1: "Shoulder pain physiotherapy in Shirur",
      card: "For shoulder pain on reaching, lifting and sleeping — including frozen shoulder and rotator cuff problems.",
      who: "People with shoulder pain reaching overhead, dressing, sleeping on the affected side, or after shoulder injury.",
      metaTitle: "Shoulder Pain Physiotherapy in Shirur | VIP Magical Physio Clinic",
      metaDesc: "Physiotherapy for shoulder pain, stiffness and rotator cuff problems in Shirur, Pune. Assessment-led rehabilitation. Call 86248 60808.",
      image: "assets/img/svc-shoulder.jpg",
      imageAlt: "Physiotherapist guiding a seated patient's shoulder through rotation",
      meaning: [
        "The shoulder trades stability for range, which is why it can be both remarkably mobile and surprisingly vulnerable. Two patterns are common: pain with movement and weakness (often involving the rotator cuff tendons), and progressive stiffness with loss of rotation (often called frozen shoulder or adhesive capsulitis).",
        "These behave very differently and need different plans. A painful, stiff shoulder pushed too hard gets worse; a weak shoulder that is protected too long gets stiffer. Getting the diagnosis right changes everything that follows."
      ],
      difficulties: [
        "Pain reaching overhead, into a cupboard or onto a bus rail",
        "Difficulty fastening clothing at the back or putting on a kurta",
        "Pain lying on the affected side at night",
        "Weakness carrying bags or lifting objects away from the body",
        "Loss of rotation, making hair combing or seatbelt use difficult"
      ],
      whenToAssess: [
        "Pain has lasted more than two weeks",
        "You cannot lift the arm through a useful range",
        "Night pain is disturbing sleep",
        "There has been a fall or sudden injury with weakness",
        "Stiffness is limiting dressing and self-care"
      ],
      assessment: [
        "History, including the speed of onset — sudden stiffness and gradual stiffness mean different things",
        "Active and passive range of movement in all directions, compared with the other side",
        "Resisted testing to identify which tendons are involved",
        "Scapular and postural contribution to the problem",
        "Functional testing for the tasks that matter to you"
      ],
      principles: [
        "Match the plan to the pattern — stiffness needs controlled loading, irritability needs calming",
        "Maintain what range you have while rebuilding control",
        "Rotator cuff and scapular strengthening as the core of rehabilitation",
        "Sleep positioning advice, since night pain drives fatigue and low mood",
        "Clear expectations about the natural history of frozen shoulder, which can take many months"
      ],
      exercises: [
        "Pendulum and assisted range work in the early irritable stage",
        "Isometric rotator cuff loading, which builds strength with minimal movement",
        "Scapular setting and lower trapezius work",
        "Progressive band strengthening as pain allows"
      ],
      safety: [
        "Do not force range in a painful stiff shoulder — it tends to increase pain and reduce trust",
        "Avoid overhead loading until control is adequate",
        "Stop if you develop pins and needles or weakness in the hand"
      ],
      redFlags: [
        "Sudden weakness after an injury, or an arm that cannot be lifted at all",
        "A fall onto the shoulder with deformity",
        "Pain with breathlessness, chest tightness or sweating",
        "Unexplained weight loss or a lump",
        "Fever with a hot, swollen shoulder"
      ],
      faqs: [
        { q: "Is my shoulder frozen or is it a rotator cuff problem?", a: "The two overlap and can be confused. The key distinguishing feature is passive range: in frozen shoulder, someone else moving your arm is also restricted. We assess this directly and explain what we find." },
        { q: "How long does frozen shoulder take?", a: "It commonly runs a long course, often many months, and can be frustrating. Physiotherapy aims to keep the shoulder as functional as possible through that period rather than promising a fast resolution." },
        { q: "Should I have an injection?", a: "That is a medical decision for your doctor. Injections can settle pain enough to allow rehabilitation to progress, but they work best alongside a strengthening plan rather than instead of one." }
      ],
      relatedArticle: "understanding-physiotherapy-assessment"
    },
    {
      slug: "stroke-rehabilitation",
      title: "Stroke Rehabilitation",
      h1: "Stroke rehabilitation physiotherapy in Shirur",
      card: "Movement recovery and functional retraining after stroke, with practical support for families and caregivers.",
      who: "People recovering from stroke, and their families, dealing with weakness, balance loss or difficulty walking.",
      metaTitle: "Stroke Rehabilitation Physiotherapy in Shirur | VIP Magical Physio Clinic",
      metaDesc: "Physiotherapy after stroke in Shirur, Pune: movement recovery, balance, walking retraining and caregiver guidance. Call 86248 60808.",
      image: "assets/img/svc-stroke.jpg",
      imageAlt: "Physiotherapist supporting a patient's hip and arm during walking practice between parallel bars",
      meaning: [
        "After a stroke, the brain needs to relearn movement. Recovery is not a matter of waiting for damaged tissue to repair, but of repeatedly practising meaningful tasks so that other neural pathways take over the work. This is why rehabilitation should be active, repetitive and specific to the task.",
        "Physiotherapy after stroke focuses on what the person needs to do: sit up safely, stand, transfer to a chair, walk, use an arm for eating and dressing. Progress is measured in function, and it is often slow and uneven — but it is rarely finished."
      ],
      difficulties: [
        "Weakness or heaviness on one side of the body",
        "Difficulty sitting up, standing or transferring from bed to chair",
        "Loss of balance, with fear of falling",
        "Difficulty walking, or a tendency to drag the affected foot",
        "Neglect of the affected side, or shoulder pain on the weak side",
        "Fatigue that limits how much practice is possible"
      ],
      whenToAssess: [
        "As soon as the medical team considers the person stable — early rehabilitation is generally better",
        "After discharge home, to prevent loss of function and set up a safe home programme",
        "When family members are unsure how to assist safely",
        "When walking ability or balance has plateaued and needs re-assessment",
        "When the affected shoulder is painful or at risk of injury during handling"
      ],
      assessment: [
        "Review of the medical history and current medications with the family",
        "Assessment of sitting and standing balance, and trunk control",
        "Movement and tone in the affected arm and leg",
        "Functional tasks: bed mobility, transfers, walking, stair access at home",
        "Home environment and caregiver capacity, since these determine what is realistic"
      ],
      principles: [
        "Task-specific practice — practising the actual task, not just isolated movements",
        "Repetition and intensity appropriate to the person's fatigue and medical status",
        "Careful handling of the affected shoulder to prevent pain and subluxation",
        "Caregiver training, because carry-over happens between sessions",
        "Honest goal-setting with the family, focused on function rather than promises"
      ],
      exercises: [
        "Trunk control and sitting balance activities",
        "Sit-to-stand practice with appropriate assistance",
        "Weight-bearing through the affected leg with support",
        "Task practice for the affected arm — reaching, grasping, guiding",
        "Walking practice with whatever support is safe"
      ],
      safety: [
        "Never leave a person with significant balance loss standing unsupported",
        "Check blood pressure and fatigue levels, and stop if the person becomes dizzy or unwell",
        "Use a gait belt or firm handhold during walking practice",
        "Support the affected arm in a comfortable position to avoid shoulder strain"
      ],
      redFlags: [
        "New or worsening weakness, facial droop, or difficulty speaking — seek emergency care immediately",
        "Sudden severe headache, confusion or loss of consciousness",
        "A fall with head injury",
        "New swelling, redness or pain in the affected leg, which may suggest a clot",
        "Chest pain or breathlessness"
      ],
      faqs: [
        { q: "How soon should rehabilitation start?", a: "Early mobilisation, once the medical team confirms stability, is generally associated with better outcomes. In practice this often begins in hospital and continues at home after discharge." },
        { q: "Can recovery continue after six months?", a: "Yes. Recovery is often fastest in the first months, but improvement can continue well beyond that with consistent practice. Progress may be slower, and it needs to be measured against real tasks rather than expected timelines." },
        { q: "What can family members do between sessions?", a: "Quite a lot, and it matters. Practising transfers safely, encouraging use of the affected arm in daily tasks, and keeping a simple record of what is being done at home all help. We train caregivers in these specifics rather than leaving them to guess." }
      ],
      relatedArticle: "stroke-rehabilitation-what-families-should-know"
    },
    {
      slug: "orthopaedic-rehabilitation",
      title: "Orthopaedic Rehabilitation",
      h1: "Orthopaedic rehabilitation in Shirur",
      card: "Rehabilitation for fractures, joint injuries and musculoskeletal conditions, from first assessment to return to activity.",
      who: "People recovering from fractures, sprains, ligament injuries or joint conditions, with or without surgery.",
      metaTitle: "Orthopaedic Rehabilitation in Shirur | VIP Magical Physio Clinic",
      metaDesc: "Orthopaedic physiotherapy rehabilitation in Shirur, Pune for fractures, ligament injuries and joint conditions. Call 86248 60808.",
      image: "assets/img/svc-ortho.jpg",
      imageAlt: "Physiotherapist performing gentle joint mobilisation on a patient's knee",
      meaning: [
        "Orthopaedic rehabilitation covers the period after an injury or fracture when tissue is healing but function is not yet restored. The fracture may have united on X-ray while the leg remains weak, the joint stiff and the confidence gone. That gap is what rehabilitation fills.",
        "The work is staged: protect the healing tissue, restore movement, rebuild strength, then return to real demands. Rushing the early stages can undo healing; lingering too long in the cautious stage leaves people stiff and weak."
      ],
      difficulties: [
        "Joint stiffness after a period in a cast, brace or sling",
        "Muscle wasting and weakness on the injured side",
        "Difficulty bearing weight or walking without support",
        "Loss of confidence with stairs, uneven ground or crowds",
        "Uncertainty about what is safe to do and when"
      ],
      whenToAssess: [
        "Once the treating doctor confirms the stage of healing and any movement restrictions",
        "When stiffness is limiting daily tasks after immobilisation",
        "When you have been cleared to bear weight but feel unable",
        "Before returning to sport, manual work or physically demanding duties",
        "If pain or swelling is not settling as expected"
      ],
      assessment: [
        "Review of the injury, imaging reports and any surgical or medical restrictions",
        "Joint range, swelling and muscle bulk compared with the other side",
        "Strength and functional testing appropriate to the healing stage",
        "Gait and balance assessment",
        "Discussion of the specific activity you need to return to"
      ],
      principles: [
        "Respect healing timelines and any instructions from the treating surgeon",
        "Restore range before loading heavily through it",
        "Progressive loading — the tissue must be challenged to adapt, but gradually",
        "Movement quality, not just quantity of exercise",
        "Criteria-based progression rather than a fixed calendar"
      ],
      exercises: [
        "Assisted and active range of movement work for the affected joint",
        "Isometric strengthening in the early protected phase",
        "Progressive resistance training once cleared",
        "Balance and proprioceptive work before return to sport",
        "Functional task rehearsal specific to work or sport demands"
      ],
      safety: [
        "Follow any weight-bearing or movement restrictions given by your surgeon exactly",
        "Do not force range in a recently injured or operated joint",
        "Report increased swelling, warmth or redness rather than pushing through it"
      ],
      redFlags: [
        "A joint that becomes hot, red and very painful, particularly with fever",
        "Calf swelling and pain after immobilisation or surgery",
        "New numbness, weakness or loss of pulses in the limb",
        "Inability to bear weight after a period of improvement"
      ],
      faqs: [
        { q: "My fracture has healed — why is it still weak?", a: "Bone healing and muscle recovery are different processes. Weeks of immobilisation reduce muscle strength and joint mobility, and these need their own rehabilitation. The X-ray showing union is the starting line, not the finish." },
        { q: "When can I return to sport or heavy work?", a: "It depends on the tissue involved, the demands of the activity and how you test functionally. We use criteria — strength ratios, movement quality, confidence — rather than a fixed number of weeks." }
      ],
      relatedArticle: "physiotherapy-after-knee-replacement"
    },
    {
      slug: "post-operative-rehabilitation",
      title: "Post-operative Rehabilitation",
      h1: "Post-operative rehabilitation in Shirur",
      card: "Structured recovery after joint replacement, fracture fixation, ligament reconstruction and other orthopaedic surgery.",
      who: "Patients who have had joint replacement, ligament surgery, fracture fixation or spinal surgery and need guided recovery.",
      metaTitle: "Post-Operative Rehabilitation in Shirur | VIP Magical Physio Clinic",
      metaDesc: "Post-operative physiotherapy rehabilitation in Shirur, Pune after joint replacement, ligament and fracture surgery. Call 86248 60808.",
      image: "assets/img/svc-postop.jpg",
      imageAlt: "Physiotherapist positioning a pillow under a patient's elevated leg after surgery",
      meaning: [
        "The success of orthopaedic surgery depends heavily on what happens afterwards. The implant or repair provides the structure; rehabilitation restores the strength, movement and confidence needed to use it. Without that second half, excellent surgery can produce a disappointing result.",
        "Post-operative rehabilitation is time-sensitive in places — some movements must be avoided early, and some must be started early to prevent stiffness. We work from your surgeon's protocol, not from a generic programme."
      ],
      difficulties: [
        "Swelling and pain that limit early movement",
        "Difficulty with bed mobility, transfers and toilet access",
        "Weakness and loss of range in the operated limb",
        "Fear of damaging the repair, leading to excessive caution",
        "Sleep disruption and low mood in the early weeks",
        "Uncertainty about which movements are permitted"
      ],
      whenToAssess: [
        "Ideally before surgery, to prepare strength and understand the plan",
        "Within the first days to weeks after discharge, as advised by your surgeon",
        "When swelling or pain is limiting your exercises",
        "When you feel stuck at a plateau after the initial phase",
        "Before returning to work, driving or sport"
      ],
      assessment: [
        "Surgical details and the surgeon's protocol, including any movement or weight-bearing restrictions",
        "Wound and swelling status, within the limits of our scope",
        "Range of movement and strength of the operated limb",
        "Safety of transfers, walking aids and home layout",
        "Realistic milestones for home, work and independence"
      ],
      principles: [
        "Follow the surgeon's protocol precisely — we do not improvise around a repair",
        "Control swelling, since it blocks movement and strength",
        "Early protected movement where permitted, to prevent stiffness",
        "Progressive strengthening once tissue healing allows",
        "Frequent short sessions early on, rather than long tiring ones"
      ],
      exercises: [
        "Ankle pumps and breathing exercises to reduce clot risk in the early period",
        "Isometric quadriceps and gluteal contractions",
        "Assisted range of movement within permitted limits",
        "Gait practice with the correct aid and technique",
        "Progressive strengthening and balance work in later phases"
      ],
      safety: [
        "Follow weight-bearing restrictions exactly — they protect the repair",
        "Do not force range if the surgeon has set limits",
        "Watch for signs of infection at the wound, or of a clot in the calf",
        "Arrange help at home for the first weeks; plan this before surgery if possible"
      ],
      redFlags: [
        "Increasing wound redness, discharge, fever or spreading pain",
        "Calf pain, swelling or tenderness, or sudden breathlessness",
        "Chest pain",
        "A pop or give-way with sudden loss of function",
        "Inability to bear weight that is new or worsening"
      ],
      faqs: [
        { q: "How many sessions will I need?", a: "It varies with the surgery, your baseline strength and how you progress. Early on, more frequent contact is useful; later, sessions spread out as you take over the programme. We review and adjust rather than pre-selling a package." },
        { q: "Can you visit me at home after surgery?", a: "Yes — home visits are often the practical choice in the first weeks after joint replacement, when travel is difficult. See the home visit page for the areas we cover." },
        { q: "Is it normal to be this swollen?", a: "Some swelling is expected after surgery and usually settles gradually with elevation and appropriate activity. Swelling that increases, becomes hot, or comes with fever needs medical review — please contact your surgeon." }
      ],
      relatedArticle: "physiotherapy-after-knee-replacement"
    },
    {
      slug: "geriatric-physiotherapy",
      title: "Geriatric Physiotherapy",
      h1: "Geriatric physiotherapy in Shirur",
      card: "Strength, mobility and confidence for older adults who want to keep doing what matters to them.",
      who: "Older adults noticing slowing down, stiffness, unsteadiness, or declining confidence with daily activities.",
      metaTitle: "Geriatric Physiotherapy in Shirur | VIP Magical Physio Clinic",
      metaDesc: "Physiotherapy for older adults in Shirur, Pune: strength, mobility, balance and confidence with daily activities. Call 86248 60808.",
      image: "assets/img/svc-geriatric.jpg",
      imageAlt: "Older adult walking with a stick, supported by a physiotherapist at the elbow",
      meaning: [
        "Ageing changes muscle mass, balance and reaction time, but decline is not inevitable at the pace many people assume. Strength can be built at any age, and doing so is one of the most effective ways to preserve independence.",
        "Geriatric physiotherapy is less about a single diagnosis and more about function: getting up from a low chair, walking to the market, managing stairs, and not being afraid of falling. The work is gentle in approach but genuinely strengthening in intent."
      ],
      difficulties: [
        "Difficulty rising from a chair or a low toilet",
        "Slower walking, or needing to stop and rest on short walks",
        "Fear of falling, leading to reduced activity",
        "Stiffness in the hips, knees or ankles",
        "Difficulty with stairs, or avoiding them entirely",
        "Loss of confidence going out alone"
      ],
      whenToAssess: [
        "You have had a fall, or feel unsteady",
        "You are avoiding activities you used to manage",
        "Getting up from a chair has become difficult",
        "A family member has noticed slowing or shuffling",
        "You want to maintain independence and strength proactively"
      ],
      assessment: [
        "History of falls, current medications and any relevant medical conditions",
        "Sit-to-stand, walking speed, turning and balance testing",
        "Joint range and lower limb strength",
        "Review of the home for hazards, in the context of a home visit if needed",
        "A conversation about what the person actually wants to get back to"
      ],
      principles: [
        "Strength work is safe and valuable at any age, including well into the eighties",
        "Build confidence alongside capacity — fear is a real barrier",
        "Keep it practical: practise the tasks that matter at home",
        "Involve family where helpful, without removing independence",
        "Progress gradually and review regularly"
      ],
      exercises: [
        "Sit-to-stand practice, with arm support as needed",
        "Supported standing and weight shifting",
        "Heel raises and step practice",
        "Simple balance challenges holding a stable surface",
        "Short daily walking with a target distance"
      ],
      safety: [
        "Always have a stable support within reach during standing exercises",
        "Wear supportive, non-slip footwear",
        "Stop if you feel dizzy, breathless or unwell",
        "Have a plan for getting help if a fall does occur"
      ],
      redFlags: [
        "A fall with head injury, particularly if on blood thinners",
        "Sudden weakness, confusion or difficulty speaking",
        "New dizziness with changes in position and no clear cause",
        "Chest pain or breathlessness on minimal activity",
        "Rapidly worsening mobility over days"
      ],
      faqs: [
        { q: "Is it too late to build strength at 75?", a: "No. Muscle responds to training at every age studied. The starting point is lower and progress may be slower, but the gains in function and independence are often the most meaningful of any age group." },
        { q: "Can you come to our home?", a: "Yes. Home visits are often the best option for older adults, since we can assess the real environment, the stairs and the chair they actually use. See the home visit page for coverage." },
        { q: "Should my father use a walking stick?", a: "It depends on his balance, strength and what he needs to do. A stick is a tool, not a failure — but it should be the right one, correctly adjusted, and ideally combined with strengthening so it supports rather than substitutes for capacity." }
      ],
      relatedArticle: "safe-exercise-for-older-adults"
    },
    {
      slug: "balance-and-fall-prevention",
      title: "Balance & Fall Prevention",
      h1: "Balance and fall prevention in Shirur",
      card: "Assessment of balance and falls risk, with practical training to reduce the chance of another fall.",
      who: "Anyone who has fallen, feels unsteady, or has been told their balance is poor.",
      metaTitle: "Balance & Fall Prevention Physiotherapy in Shirur | VIP Magical Physio Clinic",
      metaDesc: "Balance assessment and fall prevention physiotherapy in Shirur, Pune. Practical training and home safety guidance. Call 86248 60808.",
      image: "assets/img/svc-balance.jpg",
      imageAlt: "Older adult practising heel-to-toe standing on a woven mat with therapist support nearby",
      meaning: [
        "Balance is a skill built from several systems working together: the inner ear, vision, sensation in the feet, and the strength to correct a wobble quickly. When one of these declines, the body compensates — until it cannot.",
        "Falls are not a normal part of ageing to be accepted. They are usually predictable, and often preventable. Assessment identifies which part of the balance system is under-performing, and training targets it directly."
      ],
      difficulties: [
        "Feeling unsteady turning around or on uneven ground",
        "Needing to hold furniture or walls when walking at home",
        "Difficulty in the dark or in unfamiliar places",
        "A near-fall or fall in the past year",
        "Avoiding going out because of worry about falling"
      ],
      whenToAssess: [
        "You have fallen once, or nearly fallen",
        "You feel unsteady on stairs, in the bathroom or outdoors",
        "You have been advised to use a walking aid and want to use it correctly",
        "Your balance has declined after illness or a hospital stay",
        "You want to reduce risk before it becomes a problem"
      ],
      assessment: [
        "Falls history — how, where, when and what happened afterwards",
        "Timed walking, turning and sit-to-stand testing",
        "Static and dynamic balance testing, with support close at hand",
        "Lower limb strength and ankle flexibility",
        "Review of footwear, home hazards and current medications where relevant"
      ],
      principles: [
        "Train balance progressively — challenge, but with safety ensured",
        "Combine balance work with strength, since they support each other",
        "Practise in the environments that matter: bathroom, stairs, outdoors",
        "Address footwear, lighting and home hazards practically",
        "Build confidence, because fear of falling itself increases risk"
      ],
      exercises: [
        "Supported single-leg standing, progressing to reduced hand support",
        "Heel-to-toe walking along a wall for safety",
        "Step-over and turning practice",
        "Sit-to-stand without using hands, once strength allows",
        "Walking with head turns to train the vestibular contribution"
      ],
      safety: [
        "Always train near a stable surface or with another person present",
        "Do not practise balance in the dark or on wet floors",
        "Start with hand support and progress only when confident and steady",
        "Keep a phone or alarm within reach"
      ],
      redFlags: [
        "Vertigo with vomiting, hearing loss or double vision",
        "Sudden onset of imbalance with weakness, slurred speech or facial droop",
        "Fainting or loss of consciousness",
        "A fall with head injury, especially on blood thinners",
        "New unsteadiness with numbness in both feet"
      ],
      faqs: [
        { q: "Can balance really be improved?", a: "Yes, with specific and progressive training. Balance responds to challenge the way muscle responds to load. It does need to be practised regularly, and it declines again if training stops." },
        { q: "My mother is afraid of falling. What helps?", a: "Fear is understandable and it genuinely increases risk by reducing activity. A graded approach — starting with well-supported practice and building up — tends to reduce both fear and falls. We also address the home environment, which gives families concrete things to change." }
      ],
      relatedArticle: "balance-training-and-fall-prevention"
    },
    {
      slug: "home-visit-physiotherapy",
      title: "Home Visit Physiotherapy",
      h1: "Home visit physiotherapy in Shirur",
      card: "Assessment and rehabilitation in your own home, for people who cannot easily travel to a clinic.",
      who: "Older adults, post-operative patients, stroke survivors and anyone for whom travelling is difficult.",
      metaTitle: "Home Visit Physiotherapy in Shirur | VIP Magical Physio Clinic",
      metaDesc: "Physiotherapy at home in Shirur, Pune. For older adults, post-operative and stroke rehabilitation when travel is difficult. Call 86248 60808.",
      image: "assets/img/svc-homevisit.jpg",
      imageAlt: "Physiotherapy equipment bag and treatment mat in a warm Indian living room",
      meaning: [
        "A home visit brings the assessment to where the difficulty actually happens. Stairs, bathroom access, the height of the bed, the chair by the window — these are the details that determine whether a rehabilitation plan will work, and they are invisible in a clinic.",
        "Home visits suit people for whom travel is a genuine barrier, and they give family members the chance to see and learn the programme first-hand. They are not a lesser version of clinic care; they are a different setting with different advantages."
      ],
      difficulties: [
        "Difficulty travelling to a clinic, or no reliable transport",
        "Pain or fatigue making a round trip impractical",
        "A home environment with stairs or bathroom access that needs assessing",
        "Caregivers who need to be taught how to assist safely",
        "Recent discharge from hospital with reduced mobility"
      ],
      whenToAssess: [
        "You cannot manage the journey to a clinic",
        "You have recently been discharged from hospital",
        "Home hazards or stairs are a concern",
        "A caregiver needs training in safe assistance",
        "You want a programme taught in the place where you will do it"
      ],
      assessment: [
        "The same clinical assessment as a clinic visit, adapted to your home",
        "Observation of how you actually move in your own space",
        "Stair, bathroom and bed access review",
        "Equipment review — walking aids, chair height, grab rails where present",
        "Caregiver involvement and training, with the patient's consent"
      ],
      principles: [
        "Assess function in the real environment",
        "Involve family and caregivers as partners, with clear instructions",
        "Keep equipment requirements minimal and practical",
        "Maintain privacy and dignity throughout, particularly in personal care areas",
        "Agree a clear plan for review and progression"
      ],
      exercises: [
        "The same programme as a clinic, taught using your own furniture and space",
        "Bed mobility and transfer practice with your actual bed",
        "Stair practice on your actual stairs, when safe and appropriate",
        "Caregiver-assisted techniques, taught and practised together"
      ],
      safety: [
        "Clear a safe working area before the session",
        "Ensure adequate lighting and a stable chair",
        "Keep pets and trip hazards out of the treatment area",
        "Have a family member present where possible"
      ],
      redFlags: [
        "Any emergency symptom — chest pain, breathlessness, sudden weakness or difficulty speaking — needs emergency services, not a home visit",
        "Suspected fracture after a fall",
        "Fever with a hot, swollen joint",
        "New confusion or drowsiness"
      ],
      faqs: [
        { q: "Which areas do you cover?", a: "Home visits are offered in Shirur and the immediately surrounding areas, subject to confirmation at the time of booking. Please call or message with your location and we will tell you honestly whether we can reach you." },
        { q: "Do I need any equipment at home?", a: "Usually very little. A sturdy chair, a clear space and a mat or towel are often enough to begin. If something specific would help — a walking aid, a rail — we will discuss it and explain the options rather than selling equipment." },
        { q: "Can a family member join the session?", a: "Yes, and it is often valuable. With the patient's consent, caregivers can learn how to assist and how to supervise exercises between visits." }
      ],
      relatedArticle: "understanding-physiotherapy-assessment"
    },
    {
      slug: "online-physiotherapy-consultation",
      title: "Online Physiotherapy Consultation",
      h1: "Online physiotherapy consultation",
      card: "Video consultation for assessment, exercise guidance and follow-up — with clear limits on what can be done remotely.",
      who: "People who cannot attend in person, need a follow-up, or want guidance before travelling.",
      metaTitle: "Online Physiotherapy Consultation | VIP Magical Physio Clinic",
      metaDesc: "Online physiotherapy consultation with Dr. Vipul Ahire. Video assessment, exercise guidance and follow-up, with clear limits on remote care. Call 86248 60808.",
      image: "assets/img/svc-online.jpg",
      imageAlt: "Laptop on a desk showing a video consultation with a resistance band alongside",
      meaning: [
        "An online consultation is a real clinical conversation, not a video call for its own sake. We take a history, watch you move, test what can be tested on camera, and build a plan you can carry out at home.",
        "Remote assessment has genuine limits. We cannot palpate, cannot test joint play, and cannot assess subtle neurological signs. When those things matter — and sometimes they do — we will say so and recommend an in-person assessment rather than working around the gap."
      ],
      difficulties: [
        "No access to a clinic, or long travel distances",
        "Difficulty arranging time away from work or caregiving",
        "Need for a follow-up review after in-person treatment",
        "Questions about an existing exercise programme",
        "Wanting guidance before deciding whether to travel for assessment"
      ],
      whenToAssess: [
        "Your problem is stable and not an emergency",
        "You can describe symptoms clearly and demonstrate movement on camera",
        "You need a follow-up, progression or form check",
        "You want advice on self-management before an in-person visit",
        "You are travelling or relocating and need continuity"
      ],
      assessment: [
        "A structured history of your symptoms and daily function",
        "Guided movement observation — you will be asked to show specific movements",
        "Strength and balance tests that can be done safely with household objects",
        "Review of any reports or imaging you have, if you share them",
        "An agreed written plan with exercises, frequency and review points"
      ],
      principles: [
        "Be explicit about what cannot be assessed remotely",
        "Keep exercises simple and dependent on equipment you already have",
        "Demonstrate and observe, rather than describe and hope",
        "Set a review point and be clear about when to switch to in-person care",
        "Maintain privacy — a private space and a stable connection matter"
      ],
      exercises: [
        "Bodyweight and household-object exercises, demonstrated live",
        "Form correction by observation from two angles where possible",
        "Short, frequent practice rather than long sessions",
        "A written summary sent after the consultation"
      ],
      safety: [
        "Have a chair and a clear space available before the call",
        "Do not perform any movement that feels unsafe while alone",
        "Stop and inform us if you feel dizzy, breathless or unwell during the session"
      ],
      redFlags: [
        "Chest pain, breathlessness or fainting — call emergency services",
        "Sudden weakness, facial droop or difficulty speaking — emergency care",
        "Severe pain after trauma, or inability to bear weight after a fall",
        "These situations require in-person emergency assessment, not a video call"
      ],
      faqs: [
        { q: "Is online consultation as good as in person?", a: "For some problems and for follow-up, it is comparable and much more convenient. For others — particularly where hands-on testing or subtle neurological assessment is needed — it is not a substitute. We will tell you which situation you are in." },
        { q: "What platform do you use?", a: "A standard video call on a platform that works for both sides, confirmed at the time of booking. You do not need to install anything unusual." },
        { q: "What should I prepare?", a: "A private space, a chair, room to move a few steps, comfortable clothing, and any reports or scans you have. A family member is welcome to join if it helps." }
      ],
      relatedArticle: "understanding-physiotherapy-assessment"
    },
    {
      slug: "posture-correction-ergonomics",
      title: "Posture & Ergonomics",
      h1: "Posture correction and ergonomic education",
      card: "Practical, evidence-informed guidance on desks, screens and daily positions — without the posture myths.",
      who: "Office workers, students, drivers and anyone with discomfort linked to sustained positions.",
      metaTitle: "Posture Correction & Ergonomics in Shirur | VIP Magical Physio Clinic",
      metaDesc: "Ergonomic assessment and posture education in Shirur, Pune. Practical advice for desk, screen and driving discomfort. Call 86248 60808.",
      image: "assets/img/svc-neck.jpg",
      imageAlt: "Person adjusting their seated position while using a phone at a desk",
      meaning: [
        "There is no single correct posture. Research has consistently failed to show that one sitting position is inherently better than another; what matters more is how long you stay in any one position, and whether your body has the capacity to tolerate the positions you need.",
        "That said, some setups genuinely create unnecessary load — a screen too low, a chair too high, a laptop used for eight hours without support. Ergonomic education is about removing avoidable strain and building tolerance, not about sitting like a soldier."
      ],
      difficulties: [
        "Aching between the shoulder blades by mid-afternoon",
        "Stiffness in the neck and lower back after long screen sessions",
        "Wrist or forearm discomfort with mouse and keyboard use",
        "Headaches that build through the working day",
        "Discomfort driving or using a laptop on a sofa"
      ],
      whenToAssess: [
        "Discomfort recurs with work and eases with rest",
        "You have changed jobs, desks or equipment recently",
        "You want a set-up review before symptoms become persistent",
        "Symptoms are settling but return whenever work intensity rises",
        "You need advice specific to your actual workspace, not generic tips"
      ],
      assessment: [
        "A review of your working day — hours, breaks, equipment and task variety",
        "Observation of your actual set-up, in person or by photographs over video",
        "Movement and strength screening for the areas that commonly complain",
        "Identification of the specific positions your work demands",
        "A short, practical action list rather than a long list of rules"
      ],
      principles: [
        "Position variety matters more than any single 'ideal' posture",
        "Build tolerance through strength and movement, not avoidance",
        "Adjust the workstation to the person, not the reverse",
        "Introduce short, frequent changes rather than one big overhaul",
        "Discard advice that creates more tension than it relieves"
      ],
      exercises: [
        "A two-minute movement break routine for desk workers",
        "Upper back and shoulder blade strengthening",
        "Hip flexor and thoracic mobility work",
        "Neck endurance exercise for sustained screen work"
      ],
      safety: [
        "Change position every 30–45 minutes where possible",
        "Do not use posture braces or correctors as a substitute for strength",
        "Avoid aggressive stretching into pain"
      ],
      redFlags: [
        "Numbness or weakness in the hands that is worsening",
        "Neck or back pain with fever, unexplained weight loss, or night pain",
        "Chest pain or breathlessness",
        "Symptoms following an accident"
      ],
      faqs: [
        { q: "Is sitting up straight actually better?", a: "Not necessarily. Studies have not shown a clear advantage of one sitting posture over another for pain. What does help is changing position regularly and having the strength and mobility to tolerate the positions your day requires." },
        { q: "Do posture correctors work?", a: "They can provide a temporary reminder, but they do not build capacity and can reduce reliance on your own muscles. Strength and movement variety do more, and cost less." },
        { q: "How should my desk be set up?", a: "Screen top roughly at eye level, feet supported, elbows near ninety degrees, and the keyboard close enough that you are not reaching. Then move every half hour. If you send photos, we can be more specific." }
      ],
      relatedArticle: "posture-myths-and-practical-advice"
    }
  ];

  return { SITE, SERVICES };
})();
