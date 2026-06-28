// src/lib/numerology/data/arrowMeanings.ts

export interface ArrowDefinition {
  name: string;
  numbers: number[];
  strength: string;
  shadow?: string;
  additional?: string;
}

export const PRIMARY_PLANES: ArrowDefinition[] = [
  {
    name: "Arrow of the Mind / Mental Plane",
    numbers: [4, 9, 2],
    strength: "The Intellectual Powerhouse: Individuals with this plane are intellectual powerhouses. They have a sharp, analytical mind, a great memory, and think in a clear, logical, and systematic way. They are excellent planners and can easily grasp complex ideas. This line represents the person's intellect, and ability to think and analyze things. They have a rational and logical approach to life.",
    shadow: "Intellectual Arrogance & Impulsivity: Lacking this plane indicates a need to develop mental discipline. One might be more impulsive than analytical, struggle with disorganization, or act without fully thinking through the consequences. They may also tend to look down on people who are not their intellectual equals.",
    additional: "This plane governs the 'World of Ideas.' When all three numbers are present, the person possesses a high IQ and the ability to process data rapidly. However, they may struggle with sleep as their minds 'never turn off.'"
  },
  {
    name: "Arrow of the Heart / Spiritual Plane",
    numbers: [3, 5, 7],
    strength: "The Intuitive Compass: This plane indicates deep emotional and spiritual sensitivity. People with this arrow are highly intuitive, compassionate, and have a natural inclination towards spiritual or philosophical topics. The second line represents the person's feelings, intuition, and instinct. They feel deeply and have a rich inner world.",
    shadow: "Emotional Vulnerability or Skepticism: An empty emotional plane can point to a person who is emotionally guarded or finds it difficult to express their feelings. They may appear aloof or overly skeptical. Too many numbers here can indicate analytical thinking is missing, leading the person to make decisions purely from the heart without logic.",
    additional: "This is the 'Soul Plane.' It bridges the gap between the mind and the body. People with this arrow are often 'Human Lie Detectors'—they can feel the energy of a room or a person instantly."
  },
  {
    name: "Arrow of Material Success / Practical Plane",
    numbers: [8, 1, 6],
    strength: "The Grounded Architect: This indicates a person who is exceptionally grounded, practical, and capable in the material world. They possess excellent organizational skills and can effectively manage finances and projects. Numbers 8, 1, and 6 are prosperity numbers, indicative of success, abundance, and fortune.",
    shadow: "Materialism & Arrogance: The absence of this plane signifies a lack of practical follow-through. One might have brilliant ideas but struggle to manifest them. If the material plane is filled but the spiritual plane is missing, it suggests a wealthy personality but an absence of feelings.",
    additional: "This governs the 'World of Objects.' It is common in the grids of successful entrepreneurs and craftsmen. It grants the ability to endure physical hardship and turn abstract ideas into tangible wealth."
  },
  {
    name: "Arrow of the Planner / Thought Plane",
    numbers: [4, 3, 8],
    strength: "The Golden Raj Yog: Due to the immense intellectual power it grants, this plane creates a brilliant thinker. These individuals have both creativity (3) and discipline (4), grounded by strong intellect (8). It reveals a person's ability to think of ideas and the fruition of those ideas.",
    shadow: "Decision Paralysis: If the thought plane is inactive, the person tends to make impulsive decisions, wasting their calibre. They may struggle to formulate long-term plans.",
    additional: "This vertical signifies the Strategy phase. People with this arrow are often three steps ahead of everyone else. They are the 'architects of destiny' who build systems that last."
  },
  {
    name: "Arrow of Determination / Will Plane",
    numbers: [9, 5, 1],
    strength: "The Unstoppable Force: People with this arrow are ambitious, strong-willed, and disciplined. They have immense patience and don't give up easily. They are able to bounce back from failures and have the patience to wait for the right time.",
    shadow: "Stubbornness: If the person does not have 4 in his grid, he can be very short-tempered and stubborn. They tend to hold on too tightly to their goals even when it's time to let go.",
    additional: "This is the 'Central Pillar' of the grid. It represents the backbone of the character. Without this arrow, even the best plans (4-3-8) or actions (2-7-6) may fail due to a lack of persistence."
  },
  {
    name: "Arrow of Execution / Action Plane",
    numbers: [2, 7, 6],
    strength: "The Doer: This indicates a person of action. They are highly organized and can easily move from thought to deed. It depicts a person's ability to put his thoughts into action, acting in a way that is both effective and considerate of others.",
    shadow: "Restlessness & Incompletion: A person lacking this plane may feel a constant sense of restlessness. They may be hesitant to take action, overthinking situations to the point of paralysis. They often leave tasks incomplete.",
    additional: "This plane governs the physical 'Doing.' It is the signature of people who get things done without making excuses. They possess 'Kinetic Intelligence'—they learn through movement and trial."
  },
  {
    name: "Arrow of Willpower / Golden Yog",
    numbers: [4, 5, 6],
    strength: "The Guardian of Success: A person with this arrow is very determined and disciplined. This is the Golden Yog or Raj Yog, bringing name, fame, and money. Only 2-3% of people are blessed with it. They are very loyal and give others a sense of security.",
    shadow: "Relentless Drive: He is stubborn, argumentative, and has strong opinions. He can be calculative and practical but not emotional, potentially hurting others in the relentless drive to reach goals.",
    additional: "This is widely considered the luckiest arrow in the grid. It balances logic (4), self (5), and responsibility (6). It is the mark of a 'Natural Born Leader.'"
  },
  {
    name: "Arrow of Emotion / Silver Yog",
    numbers: [2, 5, 8],
    strength: "The Healer’s Heart: Understanding, compassionate, and emotionally well-balanced. Known as the Property Yog, the person will have several properties. They are natural healers who can empathize with anyone’s point of view.",
    shadow: "Emotional Volatility: While successful, they will have to face extreme ups and downs. If the numbers are not balanced, they may become 'emotional sponges,' absorbing everyone else's negativity.",
    additional: "This arrow grants emotional resilience. While others break under pressure, the person with the Silver Yog can process deep pain and transform it into wisdom."
  }
];

export const SECONDARY_ARROWS: ArrowDefinition[] = [
  {
    name: "Arrow of Wisdom",
    numbers: [2, 4],
    strength: "Number 4 (logic) and Number 2 (intuition) interact to produce a rather smart and resourceful mind. You seem to breeze effortlessly through anything handed over to you.",
    shadow: "Potential to exploit loopholes or become 'too smart for your own good,' leading to manipulative behavior."
  },
  {
    name: "Arrow of Compassion",
    numbers: [6, 8],
    strength: "A strong tendency to pursue risks and protect others. You care deeply about what others feel and try your best to show sincerity and win trust.",
    shadow: "High internal pressure and tension from suppressing your own feelings to keep others happy."
  },
  {
    name: "Arrow of Stability",
    numbers: [4, 8],
    strength: "A combination of perseverance and persistence. You are absolutely trusted by friends. It represents strong stabilization of inner energy.",
    shadow: "Extreme dependency on a fixed setting; any change in the environment causes internal discomfort."
  },
  {
    name: "Arrow of Harmony",
    numbers: [2, 6],
    strength: "A gentle and generous personality. You treat everyone equally and assist others easily. Approachable and kind.",
    shadow: "Feeling deeply depressed when unfairly treated or cheated, as you struggle to balance what you give vs. what you get."
  },
  {
    name: "Arrow of Peace of Mind",
    numbers: [3, 6, 9],
    strength: "These individuals possess a serene and tranquil nature. They are often satisfied with their lives and do not easily fall prey to anxiety or the 'rat race.' They have a clear conscience and a balanced approach to the past, present, and future. People with a full 3-6-9 line have an excellent capacity for memory and retention. They are often 'old souls' who find it easy to be happy with the simple things in life."
  },
  {
    name: "Arrow of Activity / Vitality",
    numbers: [7, 8, 9],
    strength: "This is the arrow of the high-energy individual. They are physically robust and usually have a high metabolism. They need to be 'on the move' to feel alive and are often found in sports, manual labor, or high-stakes travel. The presence of 7, 8, and 9 creates a person who is constantly seeking new experiences. They are not content with sitting behind a desk; they want to be where the action is."
  },
  {
    name: "Arrow of Intuition / Practical Experience",
    numbers: [1, 4, 7],
    strength: "Individuals with this arrow prefer to learn by doing rather than by reading. They have a 'street smart' intuition that allows them to read a situation physically before they analyze it mentally. They are grounded and realistic. These people are often gifted with their hands. They understand the mechanics of the world and are very sensitive to the physical environment around them."
  },
  {
    name: "Arrow of Science / Art",
    numbers: [1, 2, 3],
    strength: "This combination links the Self (1), Intuition (2), and Creativity (3). It produces an individual who can merge scientific precision with artistic flair. They are often perfectionists in their crafts. While not a straight line on the standard grid, this grouping represents the 'Artistic Soul.' These people have a deep need for beauty and symmetry in their work and surroundings."
  }
];

export const DEFICIENCY_ARROWS = [
  { name: "Arrow of Frustration", numbers: [4, 5, 6], desc: "Regular disappointment and depression. Hidden aggression when things don't go as planned." },
  { name: "Arrow of Indecision", numbers: [1, 5, 9], desc: "Lacks the 'killer instinct.' Tasks are left halfway. High potential for procrastination." },
  { name: "Arrow of Scepticism", numbers: [3, 5, 7], desc: "Deep lack of trust. Only accepts proven facts. Often cynical about the motives of others." },
  { name: "Arrow of Poor Memory", numbers: [3, 6, 9], desc: "Forgetful nature that worsens over time. Struggles to retain complex information." },
  { name: "Arrow of Sensitivity", numbers: [2, 5, 8], desc: "Easily hurt and very shy. May develop an inferiority complex to hide deep sensitivity." },
  { name: "Arrow of Impracticality", numbers: [1, 4, 7], desc: "Lives in a dream world. Too much logic or emotion without 'common sense.' Highly idealistic." },
  { name: "Arrow of Inactivity", numbers: [7, 8, 9], desc: "Lacks motivation. High 'talk' but very little 'walk.' Often fails to plan for the future." },
  { name: "Arrow of Loneliness / Resignation", numbers: [3, 5, 7], desc: "Beyond mere skepticism, the absence of the spiritual plane (3-5-7) creates an 'Island Personality.' These people often feel like they are fighting the world alone. They may become stoic to the point of coldness, resigning themselves to a life without deep emotional connection. They often suffer in silence, believing that no one can truly understand their inner depth, leading to a self-fulfilling prophecy of isolation." },
  { name: "Arrow of Loss / Theft", numbers: [2, 4, 6], desc: "In some specialized psychomatrix interpretations, the lack of 2, 4, and 6 suggests a person who is prone to 'leaks' in their life—be it financial loss, stolen ideas, or misplaced trust. They must be exceptionally careful with their legal and personal boundaries. They often find that despite their hard work, something 'slips through their fingers' at the last moment." },
  { name: "Arrow of Dishonesty / Delusion", numbers: [8, 5, 2], desc: "When the 8-5-2 diagonal is empty, the person may struggle to distinguish between their fantasies and reality. In extreme cases, this can lead to a 'con-artist' mentality or, more commonly, a tendency to lie to oneself to avoid emotional pain. They lack the emotional 'anchor' provided by the 5, leading them to drift into whatever narrative feels most convenient at the time." }
];

export const MINOR_ARROWS = [
  { name: "Arrow of Courage", numbers: [5, 9], desc: "Bravery in the face of physical danger." },
  { name: "Arrow of Detail", numbers: [1, 2], desc: "Intense focus on small facts and data." },
  { name: "Arrow of Curiosity", numbers: [3, 9], desc: "A mind that never stops asking 'Why?'" },
  { name: "Arrow of Passion", numbers: [2, 7], desc: "Intense, sometimes volatile, emotional drives." }
];
