/* ──────────────────────────────────────────────────────────────────────────
   Single source of truth for the service catalogue.

   Consumed by the /services grid (card face) and by the per-service detail
   route (everything else). Content mirrors the live site at
   ayurshuddhiwellness.com/services, rewritten into the site's voice.

   `imageFit` is card-only — it is tuned for the 4:5 aperture on the grid and
   must not be reused for the detail hero, which is a wide band.
   ────────────────────────────────────────────────────────────────────────── */

export const SERVICES = [
  {
    slug: 'ayurveda',
    title: 'Ayurveda',
    image: '/images/services/ayurveda.JPG',
    alt: 'Ayurvedic herbs, roots, powders and oils arranged around a stone mortar and pestle',
    cardBody:
      'Personalised herbal formulations, diet, and daily rhythm, prescribed to your own constitution.',
    intro:
      'Ayurveda is the science of life — among the oldest systems of holistic healing still practised today. We work from its classical principles, refined over millennia, and apply them to the person in front of us rather than to a diagnosis.',
    components: [
      {
        title: 'Personalised Consultation',
        body: 'We assess your constitution and your present imbalances using the traditional diagnostic methods — pulse, tongue, and facial indicators — before anything is prescribed.',
      },
      {
        title: 'Customised Treatment Plans',
        body: 'From that assessment we build a programme around you: dietary guidance, lifestyle adjustment, herbal formulations, and therapeutic treatment where it is needed.',
      },
      {
        title: 'Specialised Therapies',
        body: 'Classical treatments including Abhyanga (oil massage), Shirodhara (a steady flow of warm oil over the forehead), and Swedana (herbal steam).',
      },
      {
        title: 'Seasonal Detoxification',
        body: 'Cleansing aligned to the turn of the seasons, clearing what has accumulated and keeping the body in step with the year.',
      },
      {
        title: 'Preventative Care',
        body: 'Daily routine (Dinacharya) and seasonal protocol (Ritucharya) — the long practice of staying well rather than treating illness.',
      },
    ],
  },
  {
    slug: 'naturopathy',
    title: 'Naturopathy',
    image: '/images/services/naturopathy.JPG',
    alt: 'Naturopathic remedies — tinctures, dried flowers and fresh herbs beside a mortar and pestle',
    // Small, wide source — `cover` scales it ~1.5x and crops the composition,
    // so this one card shows the whole frame instead. Pinned to the top so the
    // letterboxing all falls at the bottom, where the gradient already sits.
    imageFit: 'object-contain object-top',
    cardBody:
      'Healing drawn from the elements — water, earth, sunlight, and unhurried rest.',
    intro:
      'Naturopathy joins modern scientific understanding with traditional healing wisdom. The methods are gentle and non-invasive, and they work by activating the body’s own capacity to repair itself.',
    components: [
      {
        title: 'Holistic Assessment',
        body: 'We look at the whole picture — lifestyle, diet, and environment — to find the causes sitting underneath the symptoms.',
      },
      {
        title: 'Nutritional Therapy',
        body: 'Meal plans built on whole foods, with therapeutic nutrition directed at your specific condition.',
      },
      {
        title: 'Detoxification Programmes',
        body: 'Structured cleansing that clears accumulated toxins and restores digestive, liver, and kidney function.',
      },
      {
        title: 'Hydrotherapy',
        body: 'Water treatments at varying temperatures to improve circulation, reduce swelling, and help the body clear what it does not need.',
      },
      {
        title: 'Lifestyle Counselling',
        body: 'Guidance on rest, stress, movement, and the external factors quietly shaping how you feel.',
      },
      {
        title: 'Herbal Medicine',
        body: 'Plant-derived preparations to support recovery and manage conditions naturally.',
      },
    ],
  },
  {
    slug: 'panchakarma',
    title: 'Panchakarma',
    image: '/images/services/panchakarma.JPG',
    alt: "A therapist pressing warm herbal poultices along a client's back during Panchakarma",
    cardBody:
      'Classical five-fold purification that clears accumulated toxins and renews the tissues.',
    intro:
      'Panchakarma — ‘five actions’ in Sanskrit — is Ayurveda’s foremost protocol for cleansing and renewal. It reaches toxins settled deep in the tissues and restores the body’s own capacity to heal.',
    components: [
      {
        title: 'Personalised Assessment',
        body: 'Your constitutional type and present imbalances are evaluated first, and the programme is shaped around them.',
      },
      {
        title: 'Preparatory Therapies (Purvakarma)',
        body: 'Oil massage and herbal steam soften and mobilise toxins, drawing them out of the tissues so they can be cleared.',
      },
      {
        title: 'The Five Cleansing Procedures',
        body: 'Depending on what you need: therapeutic emesis, purgation, medicated enema, nasal administration, and blood purification.',
      },
      {
        title: 'Rejuvenation (Rasayana)',
        body: 'Once the body is clear, rejuvenation rebuilds immunity, restores energy, and supports longevity.',
      },
      {
        title: 'Post-Therapy Guidance',
        body: 'Diet and lifestyle direction to hold the benefit and keep the imbalance from returning.',
      },
    ],
  },
  {
    slug: 'nadi-pariksha',
    title: 'Pulse Diagnosis (Nadi Pariksha)',
    image: '/images/services/pulse_diagnosis.JPG',
    alt: "A practitioner reading a client's wrist pulse resting on an embroidered cushion",
    cardBody:
      'Reading the pulse to trace imbalance in the doshas long before symptoms surface.',
    intro:
      'Nadi Pariksha is among the most refined diagnostic methods in Ayurveda. Reading the pulse reveals imbalance in the body’s energetic systems long before it surfaces as physical illness — non-invasive, and perfected across millennia.',
    components: [
      {
        title: 'Comprehensive Assessment',
        body: 'We read the rhythm, strength, and quality of the pulse at several points on the wrist to establish the state of your doshas and the health of your organs.',
      },
      {
        title: 'Early Detection',
        body: 'Imbalance can be found weeks or months before it becomes a symptom, which is where prevention actually begins.',
      },
      {
        title: 'Mental and Emotional Insight',
        body: 'The pulse speaks to more than the body — it carries the emotional and psychological patterns feeding a physical condition.',
      },
      {
        title: 'Seasonal Evaluation',
        body: 'Readings taken through the year show how the changing climate is acting on your constitution, and what to adjust in response.',
      },
      {
        title: 'Personalised Recommendations',
        body: 'From the reading: diet, daily practice, and treatment chosen to bring the system back into balance.',
      },
    ],
  },
  {
    slug: 'tongue-diagnosis',
    title: 'Tongue Diagnosis',
    image: '/images/services/tongue_diagnosis.JPG',
    alt: 'A person with their tongue extended for Ayurvedic tongue examination',
    cardBody:
      'The tongue reveals digestion, accumulation, and the state of your inner terrain.',
    intro:
      'Jihva Pariksha — tongue diagnosis — is a visual window into the internal state of the body. Colour, coating, shape, and moisture together report on digestion and on health more broadly.',
    components: [
      {
        title: 'Comprehensive Evaluation',
        body: 'Colour, texture, coating, moisture, shape, and any markings are read together to assess the organs and systems each reflects.',
      },
      {
        title: 'Digestive Assessment',
        body: 'The tongue shows the state of your digestive fire (Agni) and the presence of undigested residue (Ama) — the imbalance underlying a great many conditions.',
      },
      {
        title: 'Organ Mapping',
        body: 'Different regions of the tongue correspond to different organ systems, which narrows attention to where it is needed.',
      },
      {
        title: 'Read Alongside Other Methods',
        body: 'Tongue examination sits with pulse reading, facial diagnosis, and a full history rather than standing on its own.',
      },
      {
        title: 'Monitoring Progress',
        body: 'Repeat examination gives visible confirmation that imbalance is resolving as treatment continues.',
      },
    ],
  },
  {
    slug: 'rakht-mokshan',
    title: 'Rakht Mokshan and Leech Therapy',
    image: '/images/services/Rakht_Mokshan.JPG',
    alt: "Suction cups placed along a client's back during cupping therapy",
    cardBody:
      'Gentle bloodletting, an age-old remedy for skin conditions and stagnant circulation.',
    intro:
      'Rakta Mokshana — therapeutic bloodletting — is one of the five principal Panchakarma procedures, used to purify the blood and clear toxins that other methods cannot reach. We practise it through medicinal leech therapy (Jalaukavacharana), with classical technique and modern hygiene.',
    conditions: [
      'Chronic skin conditions',
      'Inflammation',
      'Acne',
      'Hypertension',
      'Blood-related disorders',
    ],
    components: [
      {
        title: 'Comprehensive Assessment',
        body: 'Before anything begins, we establish whether the therapy suits your condition and your constitution.',
      },
      {
        title: 'Therapeutic Application',
        body: 'The treatment addresses skin conditions, inflammation, circulatory difficulty, and arthritic conditions tied to toxicity in the blood.',
      },
      {
        title: 'Medicinal Leech Treatment',
        body: 'Specially cultivated leeches release hirudin, a natural anticoagulant, along with anti-inflammatory and vasodilating compounds that carry much of the therapeutic effect.',
      },
      {
        title: 'A Safe, Controlled Setting',
        body: 'Treatment is administered by experienced practitioners under strict hygienic protocol.',
      },
      {
        title: 'Post-Treatment Care',
        body: 'Diet and lifestyle guidance to support the body as it continues to clear.',
      },
    ],
  },
  {
    slug: 'agni-karma',
    title: 'Agni Karma',
    image: '/images/services/agni_karma.JPG',
    alt: "A practitioner applying a heated metal probe to the sole of a client's foot",
    // 806x381 — a 2.1:1 strip, so `contain` can only ever fill ~38% of a 4:5
    // card. Covered instead, which fills it at near-native scale (1.09x) and
    // crops width only; anchored right of centre so the crop lands on the rod
    // tip, the foot and the steadying hand rather than the bare shaft.
    imageFit: 'object-cover object-[72%_center]',
    cardBody:
      'Precise thermal cautery from classical surgery, used to quiet persistent joint pain.',
    intro:
      'Agni Karma is thermal therapy — precisely controlled heat applied to specific points to treat chronic conditions, particularly those of the musculoskeletal system. The heat stimulates the vital centres and supports the repair of tissue.',
    conditions: ['Arthritis', 'Joint pain', 'Sciatica', 'Muscle stiffness'],
    components: [
      {
        title: 'Personalised Assessment',
        body: 'A full evaluation confirms the treatment is right for you and identifies exactly where it should be applied.',
      },
      {
        title: 'Therapeutic Application',
        body: 'Used for chronic joint pain, muscle stiffness, nerve pain, sports injury, and skin conditions that have resisted other approaches.',
      },
      {
        title: 'Precision Treatment',
        body: 'Heat is applied with specialised instruments to specific points for exact durations — enough to work, never enough to damage tissue.',
      },
      {
        title: 'Combined With Other Therapies',
        body: 'Agni Karma is usually given alongside herbal preparations and medicated oils, which extend and hold its effect.',
      },
      {
        title: 'Post-Treatment Protocol',
        body: 'Aftercare instruction, herbal application, and dietary guidance to support healing once the session is done.',
      },
    ],
  },
  {
    slug: 'yoga-pranayama-meditation',
    title: 'Yoga, Pranayama, and Meditation',
    image: '/images/services/Yoga_Pranayama_Meditation.JPG',
    alt: 'An illustration of four people seated cross-legged in meditation',
    cardBody:
      'Movement, breath, and stillness practised together to steady body and mind.',
    intro:
      'Three practices that work as one: posture, breath, and stillness. Taken together they support physical health, steady the emotions, and open the way to something quieter underneath.',
    components: [
      {
        title: 'Personalised Yoga Instruction',
        body: 'Traditional asana adapted to your body, your condition, and what you are working towards — with attention to alignment and conscious movement.',
      },
      {
        title: 'Pranayama',
        body: 'Breathing practice to build vital energy, improve respiratory function, settle the nervous system, and prepare the mind for meditation.',
      },
      {
        title: 'Meditation',
        body: 'Mantra, mindfulness, visualisation and other methods — taught broadly enough that you can find the one that holds.',
      },
      {
        title: 'Mind-Body Integration',
        body: 'Understanding how posture, breath, mind, and awareness act on one another is what turns three practices into one.',
      },
      {
        title: 'Daily Practice Guidance',
        body: 'Practical instruction for building a practice that survives contact with an ordinary week.',
      },
    ],
  },
  {
    slug: 'stress-management',
    title: 'Depression and Stress Management',
    image: '/images/services/Depression_Stress_Management.JPG',
    alt: 'A person pressing their temples, surrounded by words describing stress and anxiety',
    cardBody:
      'Sattvic routine, herbs, and breathwork to restore calm and lift the spirit.',
    intro:
      'Mental and emotional health are not separate from the rest of health. This programme brings classical Ayurvedic treatment together with contemporary practice to address anxiety, low mood, and the pressure that produces them.',
    components: [
      {
        title: 'Holistic Assessment',
        body: 'We look at the physical, mental, and emotional dimensions together — constitution, daily pattern, diet, and the sources of stress — before shaping a plan.',
      },
      {
        title: 'Ayurvedic Therapies',
        body: 'Shirodhara (warm oil poured steadily over the forehead), Shiro Abhyanga (head massage), and Nasya (herbal nasal therapy) to quiet the nervous system and restore emotional balance.',
      },
      {
        title: 'Nutritional Support',
        body: 'Foods, herbs, and supplements chosen to support neurotransmitter function, drawn from classical Ayurveda and from current nutritional evidence.',
      },
      {
        title: 'Mind-Body Practice',
        body: 'Asana, pranayama, and contemplative practice with demonstrated effect on worry, low mood, and resilience.',
      },
      {
        title: 'Lifestyle Counselling',
        body: 'Sustainable daily habits — sleep, stress reduction, time away from screens — that hold psychological wellbeing in place.',
      },
    ],
  },
]

export const getService = (slug) => SERVICES.find((s) => s.slug === slug)
