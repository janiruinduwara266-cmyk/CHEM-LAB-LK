import type {
  EquipmentItem,
  ExperimentId,
  LabSimulationParams,
  LabStep,
  LocalizedText,
} from '../types/lab';

export interface ExperimentDefinition {
  id: ExperimentId;
  number: string;
  shortTitle: LocalizedText;
  fullTitle: LocalizedText;
  subtitle: LocalizedText;
  equipment: EquipmentItem[];
  steps: LabStep[];
  notebookSummary: {
    scientist: LocalizedText;
    year: string;
    keyFindings: LocalizedText[];
    equations: string[];
  };
}

export interface ChemistryUnitTopic {
  roman: string;
  numberRange: string;
  title: LocalizedText;
  active: boolean;
}

export const ASSET_PATHS = {
  welcomeBackdrop: '/src/assets/images/welcome_chem_island_1794309624604.jpg',
  islandMap: '/src/assets/images/chem_island_map_1794309585337.jpg',
  labRoomBackdrop: '/src/assets/images/lab_room_backdrop_1794309586860.jpg',
  assistantAvatar: '/src/assets/images/lab_assistant_avatar_1794309585993.jpg',
};

export const AL_CHEMISTRY_TOPICS: ChemistryUnitTopic[] = [
  {
    roman: 'I',
    numberRange: '01-04',
    title: { si: 'පරමාණුක ව්‍යුහය (මුල් කොටස්)', en: 'Atomic Structure (Early Experiments)' },
    active: true,
  },
  {
    roman: 'II',
    numberRange: '05-08',
    title: { si: 'ව්‍යුහය හා බන්ධන', en: 'Structure & Bonding' },
    active: false,
  },
  {
    roman: 'III',
    numberRange: '09-12',
    title: { si: 'රසායනික ගණනය කිරීම්', en: 'Chemical Calculations' },
    active: false,
  },
  {
    roman: 'IV',
    numberRange: '13-16',
    title: { si: 'පදාර්ථයේ වායු අවස්ථාව', en: 'Gaseous State of Matter' },
    active: false,
  },
  {
    roman: 'V',
    numberRange: '17-20',
    title: { si: 'ශක්ති විද්‍යාව', en: 'Energetics' },
    active: false,
  },
  {
    roman: 'VI',
    numberRange: '21-24',
    title: { si: 's, p හා d ගොනු මූලද්‍රව්‍ය', en: 's, p & d Block Chemistry' },
    active: false,
  },
  {
    roman: 'VII',
    numberRange: '25-28',
    title: { si: 'කාබනික රසායනය', en: 'Organic Chemistry' },
    active: false,
  },
  {
    roman: 'VIII',
    numberRange: '29-32',
    title: { si: 'රසායනික චාලකය', en: 'Chemical Kinetics' },
    active: false,
  },
  {
    roman: 'IX',
    numberRange: '33-36',
    title: { si: 'රසායනික සමතුලිතතාවය', en: 'Chemical Equilibrium' },
    active: false,
  },
  {
    roman: 'X',
    numberRange: '37-40',
    title: { si: 'විද්‍යුත් රසායනය', en: 'Electrochemistry' },
    active: false,
  },
];

export const EXPERIMENTS: Record<ExperimentId, ExperimentDefinition> = {
  'cathode-tube': {
    id: 'cathode-tube',
    number: '01',
    shortTitle: {
      si: 'කැතෝඩ කිරණ නළය',
      en: 'CATHODE RAY TUBE',
    },
    fullTitle: {
      si: 'කැතෝඩ කිරණ නළය (ක්‍රක්ස්, මෝල්ටීස් කුරුස හා පැඩල් රෝදය)',
      en: 'Cathode Ray Tube (Crookes, Maltese Cross & Paddle Wheel)',
    },
    subtitle: {
      si: 'විලියම් ක්‍රක්ස් (1879) — ඉලෙක්ට්‍රෝනයේ ගුණ පරීක්ෂාව',
      en: 'William Crookes (1879) — Properties of Cathode Rays',
    },
    equipment: [
      {
        id: 'hv-coil',
        slotLabel: { si: 'විදුලි සැපයුම', en: 'HV Coil' },
        name: { si: 'අධි වෝල්ටීයතා ප්‍රේරණ දඟරය', en: 'High-Voltage Induction Coil' },
        description: {
          si: 'නළය තුළ වායු විසර්ජනය ඇති කිරීමට 2–20 kV DC විභව අන්තරයක් සපයයි.',
          en: 'Supplies 2–20 kV DC across cathode and anode to initiate gas discharge.',
        },
        iconType: 'coil',
        benchSlot: { x: -1.45, z: -0.25 },
      },
      {
        id: 'crookes-tube',
        slotLabel: { si: 'ක්‍රක්ස් නළය', en: 'Crookes Tube' },
        name: { si: 'වීදුරු විසර්ජන නළය (ZnS තිරය)', en: 'Crookes Glass Discharge Tube' },
        description: {
          si: 'අග්‍රයේ ZnS ප්‍රතිදීප්ත ආලේපනයක් සහිත රික්ත කළ හැකි බෝරෝසිලිකේට් වීදුරු නළය.',
          en: 'Borosilicate glass discharge tube coated with fluorescent ZnS at the end bell.',
        },
        iconType: 'tube',
        benchSlot: { x: 0, z: 0 },
      },
      {
        id: 'vacuum-pump',
        slotLabel: { si: 'රික්ත පොම්පය', en: 'Vacuum Pump' },
        name: { si: 'රික්ත පොම්පය හා පීඩන මානය', en: 'Vacuum Pump & Pressure Gauge' },
        description: {
          si: 'නළය තුළ පීඩනය 760 mmHg සිට 0.001 mmHg දක්වා අඩු කරයි.',
          en: 'Evacuates internal gas pressure from 760 mmHg down to 0.001 mmHg.',
        },
        iconType: 'pump',
        benchSlot: { x: -0.9, z: 0.55 },
      },
      {
        id: 'cross-wheel',
        slotLabel: { si: 'මෝල්ටීස් කුරුසය', en: 'Cross & Wheel' },
        name: { si: 'මෝල්ටීස් කුරුසය හා මයිකා පැඩල් රෝදය', en: 'Maltese Cross & Mica Paddle Wheel' },
        description: {
          si: 'සරල රේඛීය ගමන (සෙවනැල්ල) හා ගම්‍යතාවය (රෝදය කැරකීම) පෙන්වයි.',
          en: 'Demonstrates straight-line shadow projection and particle momentum.',
        },
        iconType: 'cross',
        benchSlot: { x: 0.35, z: 0.45 },
      },
      {
        id: 'bar-magnet',
        slotLabel: { si: 'ලාඩම් චුම්බකය', en: 'Horseshoe Magnet' },
        name: { si: 'ලාඩම් හැඩැති චුම්බකය', en: 'Horseshoe Deflection Magnet' },
        description: {
          si: 'කැතෝඩ කිරණ චුම්බක ක්ෂේත්‍රයකදී අපගමනය වී සෘණ ආරෝපිත බව තහවුරු කරයි.',
          en: 'Deflects cathode rays via Lorentz force, proving negative charge.',
        },
        iconType: 'magnet',
        benchSlot: { x: 1.25, z: 0.35 },
      },
    ],
    steps: [
      {
        id: 'ct-1',
        title: { si: 'උපකරණ පෙට්ටියෙන් ගන්න', en: 'Assemble Workbench Apparatus' },
        taskTitle: { si: 'සියලුම කොටස් වැඩ මේසය මත තබන්න', en: 'Place all 5 components onto the 3D bench' },
        instruction: {
          si: 'වම් පස උපකරණ පෙට්ටියේ ඇති ප්‍රේරණ දඟරය, ක්‍රක්ස් නළය, රික්ත පොම්පය, මෝල්ටීස් කුරුසය සහ චුම්බකය මේසය මතට ගන්න.',
          en: 'Click or drag each of the 5 apparatus items from the left Toolbox onto the glowing slots on the wooden workbench.',
        },
        whyText: {
          si: 'විද්‍යුත් විසර්ජනය සිදු කිරීමට අඩු පීඩනයක් (රික්ත පොම්පය) සහ අධි වෝල්ටීයතාවයක් (ප්‍රේරණ දඟරය) අත්‍යවශ්‍ය වේ. සාමාන්‍ය වායුගෝලීය පීඩනයේදී වාතය විද්‍යුත් පරිවාරකයකි.',
          en: 'At atmospheric pressure (760 mmHg), air is an electrical insulator. You need a sealed discharge tube, vacuum pump, and high-voltage supply before any cathode rays can form.',
        },
        assistantHint: {
          si: 'පෙට්ටියේ කාඩ්පත් මත ක්ලික් කිරීමෙන් හෝ මේසයට ඇද දැමීමෙන් උපකරණ සවි කරන්න.',
          en: 'Click any item card in the left Toolbox—or drag it onto the bench—to assemble your 3D discharge setup.',
        },
        validationType: 'assemble',
      },
      {
        id: 'ct-2',
        title: { si: 'පීඩනය අඩු කර විසර්ජනය නිරීක්ෂණය', en: 'Evacuate Pressure & Ignite Tube' },
        taskTitle: { si: 'පීඩනය 0.01 mmHg ට අඩු කර HV ක්‍රියාත්මක කරන්න', en: 'Turn HV ON and lower pressure below 0.01 mmHg' },
        instruction: {
          si: 'පහළ පාලක පුවරුවෙන් High Voltage (HV) ON කර, පීඩන slider එක 760 mmHg සිට 0.005 mmHg දක්වා අඩු කරමින් නළයේ වර්ණ වෙනස් වීම බලන්න. (Darkroom ON කිරීමෙන් කොළ පැහැ ප්‍රතිදීප්තිය පැහැදිලිව පෙනේ!)',
          en: 'Switch High Voltage ON, then slowly slide Pressure from 760 mmHg down below 0.01 mmHg. Watch plasma glow fade as green ZnS glass fluorescence lights up. Toggle Darkroom for maximum glow!',
        },
        whyText: {
          si: 'පීඩනය 10 mmHg විට දම් පැහැ විදුලි කෙටීම් ද, ~1 mmHg විට ඉරි (Striations) ද, 0.01 mmHg ට අඩු විට ක්‍රක්ස් අඳුරු අවකාශය මුළු නළය පුරා පැතිරී කැතෝඩ කිරණ ZnS තිරයේ කොළ පැහැ ප්‍රතිදීප්තියක් ඇති කරයි.',
          en: 'Below 0.01 mmHg, gas molecules are sparse enough that electrons travel uninterrupted from the cathode to the glass/ZnS screen, causing vivid green fluorescence.',
        },
        assistantHint: {
          si: 'HV ස්විචය ON කර පීඩනය 0.01 mmHg ට වඩා අඩු කරන්න.',
          en: 'Switch HV Power ON and pump pressure down below 0.01 mmHg.',
        },
        validationType: 'evacuate-pressure',
      },
      {
        id: 'ct-3',
        title: { si: 'මෝල්ටීස් කුරුස පරීක්ෂාව', en: 'Maltese Cross Shadow Test' },
        taskTitle: { si: 'මෝල්ටීස් කුරුසය ඉහළට ඔසවා සෙවනැල්ල බලන්න', en: 'Raise the Maltese Cross into the beam path' },
        instruction: {
          si: '"මෝල්ටීස් කුරුසය (Maltese Cross)" බොත්තම ON කරන්න (හෝ 3D නළය තුළ ඇති කුරුසය මත ක්ලික් කරන්න). නළයේ අග්‍රයේ ZnS තිරයේ තියුණු කුරුස සෙවනැල්ලක් දිස්වේ.',
          en: 'Toggle the Maltese Cross UP (or click it directly inside the 3D tube) and inspect the sharp cross shadow cast onto the green ZnS end screen.',
        },
        whyText: {
          si: 'ලෝහ කුරුසය මගින් කැතෝඩ කිරණ අවහිර කර තිරයේ තියුණු සෙවනැල්ලක් ඇති කිරීමෙන් කැතෝඩ කිරණ සරල රේඛීයව ගමන් කරන බව ඔප්පු වේ.',
          en: 'Because the metal cross blocks electrons and casts a crisp shadow directly behind it, cathode rays must travel in straight lines from the cathode.',
        },
        assistantHint: {
          si: 'දැන් මෝල්ටීස් කුරුසය ඉහළට ඔසවා ඉහළ විශාලන කවුළුවෙන් තිරය බලන්න!',
          en: 'Flip the Maltese Cross UP and check the magnified ZnS end-screen view at top center!',
        },
        validationType: 'maltese-shadow',
      },
      {
        id: 'ct-4',
        title: { si: 'මයිකා පැඩල් රෝද පරීක්ෂාව', en: 'Mica Paddle Wheel Test' },
        taskTitle: { si: 'පැඩල් රෝදය නළය තුළට යොදන්න', en: 'Engage the Mica Paddle Wheel on glass rails' },
        instruction: {
          si: '"පැඩල් රෝදය (Paddle Wheel)" ON කරන්න. කැතෝඩ කිරණ පැඩල් තලවල ගැටීමෙන් රෝදය කැරකෙමින් ඇනෝඩය දෙසට පෙරළෙන ආකාරය බලන්න.',
          en: 'Activate the Mica Paddle Wheel. Observe the lightweight mica vanes spinning and rolling along the glass rails toward the anode.',
        },
        whyText: {
          si: 'පැඩල් රෝදය චලනය වීමෙන් කැතෝඩ කිරණවලට ස්කන්ධයක් (mass), චාලක ශක්තියක් සහ ගම්‍යතාවයක් (momentum) ඇති අංශුමය ස්වභාවයක් ඇති බව තහවුරු වේ.',
          en: 'Spinning and pushing the physical mica wheel proves cathode rays consist of particles carrying mass and momentum, not pure massless light.',
        },
        assistantHint: {
          si: 'පැඩල් රෝදය කැතෝඩයේ සිට ඇනෝඩය දෙසට පෙරළෙනවා නේද? එය ගම්‍යතාවයේ සාක්ෂියකි!',
          en: 'Watch the paddle wheel roll away from the cathode toward the anode—proof of particle momentum!',
        },
        validationType: 'paddle-wheel',
      },
      {
        id: 'ct-5',
        title: { si: 'චුම්බක ක්ෂේත්‍ර අපගමනය හා ප්‍රශ්නය', en: 'Magnetic Deflection & Concept Check' },
        taskTitle: { si: 'ලාඩම් චුම්බකය ළං කර කිරණ නැමෙන දිශාව පරීක්ෂා කරන්න', en: 'Bring Horseshoe Magnet close & answer the concept check' },
        instruction: {
          si: '"චුම්බකය (Magnet)" ON කර ධ්‍රැව මාරු කරමින් කැතෝඩ කිරණ කදම්බය ඉහළට හෝ පහළට නැමෙන ආකාරය බලන්න. ඉන්පසු පහත ප්‍රශ්නයට පිළිතුරු දෙන්න.',
          en: 'Toggle the Horseshoe Magnet ON and flip N/S polarity to watch the beam bend via Fleming’s Left-Hand Rule, then complete the concept check below.',
        },
        whyText: {
          si: 'චුම්බක ක්ෂේත්‍රයේදී කදම්බය සෘණ ආරෝපිත අංශුවලට අදාළ දිශාවට (ෆ්ලෙමින්ගේ වමත් නියමයට අනුව) අපගමනය වීමෙන් කැතෝඩ කිරණ සෘණ ආරෝපිත බව තහවුරු වේ.',
          en: 'Deflection perpendicular to the magnetic field matching negative charge confirms cathode rays are streams of negatively charged particles (electrons).',
        },
        assistantHint: {
          si: 'චුම්බකය ON කර අපගමනය බලා පහත ප්‍රශ්නයට නිවැරදි පිළිතුර තෝරන්න.',
          en: 'Activate the magnet to bend the cathode beam, then answer the verification question below.',
        },
        validationType: 'magnet-deflection',
        quizQuestion: {
          prompt: {
            si: 'පැඩල් රෝදය කැරකීම මගින් කැතෝඩ කිරණ පිළිබඳව ඔප්පු වන ප්‍රධාන කරුණ කුමක්ද?',
            en: 'What fundamental property of cathode rays is proven by the spinning mica paddle wheel?',
          },
          options: [
            { si: 'ඒවාට ස්කන්ධයක් හා ගම්‍යතාවයක් ඇත', en: 'They consist of particles with mass and momentum' },
            { si: 'ඒවා ධන ආරෝපිත අංශු වේ', en: 'They carry a positive electric charge' },
            { si: 'ඒවා නළයේ වායුව මත රඳා පවතී', en: 'They depend on the residual gas inside the tube' },
          ],
          correctIndex: 0,
          explanation: {
            si: 'නිවැරදියි! යාන්ත්‍රික කාර්යයක් කර පැඩල් රෝදය පෙරළීමට ස්කන්ධය හා ගම්‍යතාවය තිබිය යුතුය.',
            en: 'Correct! Performing mechanical work to spin and propel the wheel requires mass and linear momentum.',
          },
        },
      },
    ],
    notebookSummary: {
      scientist: { si: 'ශ්‍රීමත් විලියම් ක්‍රක්ස් (Sir William Crookes)', en: 'Sir William Crookes' },
      year: '1879',
      keyFindings: [
        {
          si: 'කැතෝඩ කිරණ කැතෝඩයේ සිට සරල රේඛීයව ගමන් කරයි (මෝල්ටීස් කුරුසයේ තියුණු සෙවනැල්ල).',
          en: 'Travel in straight lines perpendicular to the cathode surface (sharp Maltese Cross shadow).',
        },
        {
          si: 'ස්කන්ධයක් හා චාලක ශක්තියක් ඇති අංශු වේ (මයිකා පැඩල් රෝදය කරකවයි).',
          en: 'Possess mass and kinetic energy (rotate and propel a lightweight mica paddle wheel).',
        },
        {
          si: 'විද්‍යුත් හා චුම්බක ක්ෂේත්‍ර මගින් අපගමනය වන අතර සෘණ ආරෝපිත වේ.',
          en: 'Deflected by electric and magnetic fields as negatively charged particles.',
        },
        {
          si: 'ZnS ප්‍රතිදීප්ත තිරය මත කොළ පැහැ ප්‍රතිදීප්තියක් ඇති කරයි.',
          en: 'Produce green fluorescence on ZnS screens and glass walls.',
        },
      ],
      equations: ['p < 0.01 mmHg  →  Crookes Dark Space + Cathode Ray Fluorescence'],
    },
  },

  'thomson-canal': {
    id: 'thomson-canal',
    number: '02',
    shortTitle: {
      si: 'තොම්සන් e/m සහ කැනල් කිරණ',
      en: 'THOMSON e/m & CANAL RAYS',
    },
    fullTitle: {
      si: 'J.J. තොම්සන්ගේ e/m අපගමනය සහ ගෝල්ඩ්ස්ටයින් කැනල් කිරණ (ධන කිරණ)',
      en: 'J.J. Thomson e/m Deflection & Goldstein Canal (Positive) Rays',
    },
    subtitle: {
      si: 'J.J. තොම්සන් (1897) සහ E. ගෝල්ඩ්ස්ටයින් (1886) — ඉලෙක්ට්‍රෝනය හා ප්‍රෝටෝනය',
      en: 'J.J. Thomson (1897) & E. Goldstein (1886) — Electron e/m & Proton Discovery',
    },
    equipment: [
      {
        id: 'thomson-tube',
        slotLabel: { si: 'තොම්සන් නළය', en: 'Thomson CRT' },
        name: { si: 'තොම්සන් අපගමන නළය', en: 'Thomson Glass Deflection Tube' },
        description: {
          si: 'සිදුරු සහිත ඇනෝඩ විවරයක් සහ පරිමාණිත ZnS තිරයක් සහිත නළය.',
          en: 'Evacuated glass tube with collimating slit and graduated fluorescent screen.',
        },
        iconType: 'tube',
        benchSlot: { x: 0, z: 0 },
      },
      {
        id: 'e-plates',
        slotLabel: { si: 'විද්‍යුත් තහඩු', en: 'E-Field Plates' },
        name: { si: 'සමාන්තර තඹ විද්‍යුත් තහඩු', en: 'Parallel Electrostatic Plates' },
        description: {
          si: 'නළය තුළ සිරස් විද්‍යුත් ක්ෂේත්‍රයක් (E) ජනනය කරයි.',
          en: 'Applies adjustable vertical electric field E across the beam path.',
        },
        iconType: 'plates',
        benchSlot: { x: 0.25, z: 0.45 },
      },
      {
        id: 'helmholtz-coils',
        slotLabel: { si: 'හෙල්ම්හෝල්ට්ස් දඟර', en: 'Helmholtz Coils' },
        name: { si: 'චුම්බක හෙල්ම්හෝල්ට්ස් දඟර යුගල', en: 'Helmholtz Magnetic Field Coils' },
        description: {
          si: 'විද්‍යුත් ක්ෂේත්‍රයට ලම්බක ඒකාකාර චුම්බක ක්ෂේත්‍රයක් (B) සපයයි.',
          en: 'Produces a uniform horizontal magnetic field B perpendicular to E.',
        },
        iconType: 'coils',
        benchSlot: { x: -0.9, z: 0.45 },
      },
      {
        id: 'hv-supply-2',
        slotLabel: { si: 'HV සැපයුම', en: 'HV Supply' },
        name: { si: 'අධි වෝල්ටීයතා සැපයුම', en: 'High-Voltage Power Supply' },
        description: {
          si: 'ඉලෙක්ට්‍රෝන කදම්බය ත්වරණය කිරීමට වෝල්ටීයතාවය සපයයි.',
          en: 'Accelerates cathode or canal rays through the discharge tube.',
        },
        iconType: 'coil',
        benchSlot: { x: -1.45, z: -0.25 },
      },
      {
        id: 'gas-manifold',
        slotLabel: { si: 'වායු සිලින්ඩර', en: 'Gas Cylinders' },
        name: { si: 'වායු හා කැතෝඩ ලෝහ මාරු ඒකකය', en: 'Gas & Cathode Metal Selector' },
        description: {
          si: 'H₂, He/Ne, Ar, වාතය සහ Cu, Al, Pt කැතෝඩ මාරු කිරීමට.',
          en: 'Swaps residual gases (H₂, Ne, Ar, Air) and cathode metals (Cu, Al, Pt).',
        },
        iconType: 'gas',
        benchSlot: { x: 1.35, z: 0.35 },
      },
    ],
    steps: [
      {
        id: 'tc-1',
        title: { si: 'තොම්සන් උපකරණ සවි කිරීම', en: 'Assemble Thomson & Canal Apparatus' },
        taskTitle: { si: 'වැඩ මේසය මත කොටස් 5 ස්ථාපනය කරන්න', en: 'Place all 5 components onto the workbench' },
        instruction: {
          si: 'තොම්සන් නළය, විද්‍යුත් තහඩු, හෙල්ම්හෝල්ට්ස් චුම්බක දඟර, HV සැපයුම සහ වායු ඒකකය මේසය මතට ගන්න.',
          en: 'Place the Thomson tube, electric plates, Helmholtz coils, HV supply, and gas selector onto the bench.',
        },
        whyText: {
          si: 'ඉලෙක්ට්‍රෝනයේ ආරෝපණ-ස්කන්ධ අනුපාතය (e/m) මැනීමට එකිනෙකට ලම්බක විද්‍යුත් (E) හා චුම්බක (B) ක්ෂේත්‍ර දෙකම අවශ්‍ය වේ.',
          en: 'Measuring the charge-to-mass ratio e/m requires crossed perpendicular electric (E) and magnetic (B) fields along the same beam region.',
        },
        assistantHint: {
          si: 'උපකරණ පෙට්ටියෙන් සියලු කොටස් මේසයට ගෙන පටන් ගනිමු!',
          en: 'Place all 5 apparatus components from the left Toolbox onto the bench.',
        },
        validationType: 'assemble',
      },
      {
        id: 'tc-2',
        title: { si: 'විද්‍යුත් ක්ෂේත්‍ර අපගමනය', en: 'Electrostatic Deflection Test' },
        taskTitle: { si: 'විද්‍යුත් තහඩු වෝල්ටීයතාවය +160 V ට වැඩි කරන්න', en: 'Apply Electric Plate Voltage ≥ +160 V' },
        instruction: {
          si: 'HV ON කර, E-Field තහඩු වෝල්ටීයතාවය +160 V හෝ ඊට වැඩි අගයකට සකසන්න. ඉලෙක්ට්‍රෝන කදම්බය ධන (+) තහඩුව දෙසට ඉහළට නැමෙන හැටි බලන්න.',
          en: 'Ensure HV is ON, then slide E-Field Plate Voltage to +160 V or higher. Watch the cathode beam bend upward toward the positive plate!',
        },
        whyText: {
          si: 'සෘණ ආරෝපිත ඉලෙක්ට්‍රෝන විද්‍යුත් ක්ෂේත්‍රයකදී ධන (+) ආරෝපිත තහඩුව දෙසට ආකර්ෂණය වේ.',
          en: 'Negatively charged electrons experience upward electrostatic force F = eE toward the positively charged upper plate.',
        },
        assistantHint: {
          si: 'E-Plate වෝල්ටීයතාවය +160 V ට වඩා වැඩි කර ZnS තිරයේ අපගමනය බලන්න.',
          en: 'Raise E-Plate voltage to at least +160 V and inspect the green spot rising on the scale.',
        },
        validationType: 'electric-deflection',
      },
      {
        id: 'tc-3',
        title: { si: 'eE = evB තුලිතතාවය ලබා ගැනීම', en: 'Balance Electric & Magnetic Forces (eE = evB)' },
        taskTitle: { si: 'චුම්බක ක්ෂේත්‍රය (B) යොදා කදම්බය නැවත 0 mm වෙත ගෙන එන්න', en: 'Adjust B-Field (mT) until beam returns to 0 mm center' },
        instruction: {
          si: 'දැන් B-Field (mT) slider එක සීරුමාරු කර විද්‍යුත් බලය හා චුම්බක බලය සමාන වී ඉහළ ZnS පරිමාණයේ අපගමනය 0 mm ආසන්නයට (|d| ≤ 1.8 mm) ගෙන එන්න!',
          en: 'Keep the E-field active and adjust Magnetic Field B (mT) until the downward magnetic force exactly balances the upward electric force (screen deflection within ±1.8 mm)!',
        },
        whyText: {
          si: 'කදම්බය නොනැමී කෙළින්ම ගමන් කරන විට eE = evB නිසා ඉලෙක්ට්‍රෝන ප්‍රවේගය v = E/B ලෙස සොයාගත හැකි අතර එයින් e/m = 1.7588 × 10¹¹ C kg⁻¹ ගණනය කෙරේ.',
          en: 'When undeflected, F_E = F_B gives electron speed v = E/B, allowing Thomson to compute e/m = 1.7588 × 10¹¹ C kg⁻¹.',
        },
        assistantHint: {
          si: 'E = +160 V සිට +220 V විට B ≈ +1.1 සිට +1.5 mT අතරදී තිරයේ ලක්ෂ්‍යය 0 mm ට සමතුලිත වේ!',
          en: 'With E around +160..+220 V, dial B around +1.1..+1.5 mT until the spot centers at 0 mm!',
        },
        validationType: 'magnetic-balance',
      },
      {
        id: 'tc-4',
        title: { si: 'වායුව හා කැතෝඩ ලෝහය වෙනස් කිරීම', en: 'Gas & Cathode Material Independence' },
        taskTitle: { si: 'හයිඩ්‍රජන් හෝ නියෝන් වායුව හා වෙනත් කැතෝඩ ලෝහයක් තෝරන්න', en: 'Switch Gas and Cathode Metal to verify universal e/m' },
        instruction: {
          si: 'වායු වර්ගය Air වෙනුවට Hydrogen හෝ Neon ලෙසත්, කැතෝඩ ලෝහය Aluminum හෝ Platinum ලෙසත් මාරු කර කැතෝඩ කිරණවල අපගමනය වෙනස් වේදැයි බලන්න.',
          en: 'Switch the Gas away from Air (e.g. Hydrogen or Neon) and change Cathode Metal (Aluminum or Platinum). Notice the beam deflection d and e/m remain identical!',
        },
        whyText: {
          si: 'කුමන වායුවක් හෝ කැතෝඩ ලෝහයක් භාවිත කළත් e/m අගය නියතව පැවතීමෙන් ඉලෙක්ට්‍රෝනය සියලු පදාර්ථවල පවතින මූලික උප-පරමාණුක අංශුවක් බව තහවුරු විය.',
          en: 'Because e/m is identical regardless of residual gas or cathode electrode metal, electrons must be a universal constituent of all matter.',
        },
        assistantHint: {
          si: 'වායුව හා කැතෝඩ ලෝහය යන දෙකම වෙනස් කර බලන්න — ඉලෙක්ට්‍රෝන අපගමනය වෙනස් නොවේ!',
          en: 'Change both the Gas and the Cathode Metal—the cathode ray deflection stays completely unchanged!',
        },
        validationType: 'gas-independence',
      },
      {
        id: 'tc-5',
        title: { si: 'ගෝල්ඩ්ස්ටයින් කැනල් කිරණ (ධන කිරණ)', en: 'Goldstein Canal Rays (Positive Ions)' },
        taskTitle: { si: 'Canal Rays ප්‍රකාරය ON කර H₂ වායුව සමග පරීක්ෂා කරන්න', en: 'Switch to Canal Rays mode with Hydrogen gas & answer check' },
        instruction: {
          si: '"Canal Rays (සිදුරු සහිත කැතෝඩය)" ප්‍රකාරය තෝරා වායුව Hydrogen (H₂) බවට පත් කරන්න. කැතෝඩ සිදුරු තුළින් පිටුපසට ගමන් කරන ධන කිරණ කැතෝඩ කිරණවලට ප්‍රතිවිරුද්ධ දිශාවට නැමෙන හැටි බලන්න!',
          en: 'Switch tube mode to Canal Rays (Perforated Cathode) and select Hydrogen (H₂). Observe positive ions streaming backward through the cathode holes and deflecting opposite to electrons!',
        },
        whyText: {
          si: 'කැනල් කිරණ යනු නළයේ වායුව අයනීකරණය වීමෙන් සෑදෙන ධන අයන වේ. එහි q/m අනුපාතය වායුව මත රඳා පවතින අතර හයිඩ්‍රජන් (H⁺) සඳහා උපරිම q/m ලැබීමෙන් ප්‍රෝටෝනය සොයා ගැනුණි.',
          en: 'Canal rays are positively charged gas ions. Unlike electrons, their q/m depends on the gas used, reaching a maximum for H⁺ (leading to the discovery of the proton).',
        },
        assistantHint: {
          si: 'Canal Rays ප්‍රකාරය + Hydrogen වායුව තෝරා පහත ප්‍රශ්නයට පිළිතුරු දෙන්න.',
          en: 'Select Canal Rays mode with Hydrogen gas, observe the opposite deflection, and answer the check below.',
        },
        validationType: 'canal-rays',
        quizQuestion: {
          prompt: {
            si: 'කැනල් කිරණ (ධන කිරණ) සඳහා විශාලතම q/m අගය ලැබෙන්නේ කුමන වායුව භාවිත කළ විටද?',
            en: 'Which residual gas yields the highest positive charge-to-mass ratio (q/m) for Canal Rays?',
          },
          options: [
            { si: 'හයිඩ්‍රජන් (H₂ → H⁺ ප්‍රෝටෝනය)', en: 'Hydrogen (H₂ → H⁺ Proton)' },
            { si: 'නියෝන් (Ne → Ne⁺)', en: 'Neon (Ne → Ne⁺)' },
            { si: 'ආගන් (Ar → Ar⁺)', en: 'Argon (Ar → Ar⁺)' },
          ],
          correctIndex: 0,
          explanation: {
            si: 'නිවැරදියි! හයිඩ්‍රජන් අයනයේ (H⁺) ස්කන්ධය අවම බැවින් උපරිම q/m අගය ලැබේ.',
            en: 'Correct! H⁺ has the smallest ionic mass of any element, giving it the maximum q/m ratio (the proton).',
          },
        },
      },
    ],
    notebookSummary: {
      scientist: { si: 'J.J. තොම්සන් & ඔයිගන් ගෝල්ඩ්ස්ටයින්', en: 'J.J. Thomson & Eugen Goldstein' },
      year: '1886 / 1897',
      keyFindings: [
        {
          si: 'ඉලෙක්ට්‍රෝනයේ e/m = 1.7588 × 10¹¹ C kg⁻¹ වන අතර එය වායුව හෝ කැතෝඩ ලෝහය මත රඳා නොපවතී.',
          en: 'Electron e/m = 1.7588 × 10¹¹ C kg⁻¹, universal across all gases and electrode metals.',
        },
        {
          si: 'විද්‍යුත් හා චුම්බක බල තුලිත විට eE = evB ⇒ v = E/B.',
          en: 'Velocity selector balance condition: eE = evB so v = E/B.',
        },
        {
          si: 'කැනල් කිරණ සිදුරු සහිත කැතෝඩය හරහා පිටුපසට ගමන් කරන ධන අයන වන අතර ඒවායේ q/m වායුව මත රඳා පවතී (උපරිමය H⁺ සඳහා).',
          en: 'Canal rays are positive ions passing behind a perforated cathode; q/m varies with gas and peaks for H⁺ (proton).',
        },
      ],
      equations: [
        'e / m = 1.7588 × 10¹¹ C kg⁻¹',
        'F_E = F_B  ⇒  eE = evB  ⇒  v = E / B',
      ],
    },
  },

  millikan: {
    id: 'millikan',
    number: '03',
    shortTitle: {
      si: 'මිලිකන් තෙල් බිංදු',
      en: 'MILLIKAN OIL DROP',
    },
    fullTitle: {
      si: 'රොබට් මිලිකන්ගේ තෙල් බිංදු පරීක්ෂණය (ඉලෙක්ට්‍රෝනයේ ආරෝපණය e)',
      en: "Robert Millikan's Oil Drop Experiment (Charge of an Electron)",
    },
    subtitle: {
      si: 'රොබට් මිලිකන් (1909) — ආරෝපණය ක්වොන්ටීකරණය හා e නිර්ණය',
      en: 'Robert Millikan (1909) — Quantization of Charge & Value of e',
    },
    equipment: [
      {
        id: 'brass-chamber',
        slotLabel: { si: 'පිත්තල කුටීරය', en: 'Brass Chamber' },
        name: { si: 'සමාන්තර තහඩු සහිත පිත්තල කුටීරය', en: 'Brass Condenser Chamber' },
        description: {
          si: 'මිලිමීටර 8 ක පරතරයකින් යුත් ඉහළ (+) හා පහළ (-) ලෝහ තහඩු සහිත කුටීරය.',
          en: 'Cylindrical brass housing containing horizontal upper (+) and lower (-) plates.',
        },
        iconType: 'chamber',
        benchSlot: { x: 0, z: 0 },
      },
      {
        id: 'oil-atomizer',
        slotLabel: { si: 'තෙල් විසිරකය', en: 'Oil Atomizer' },
        name: { si: 'තෙල් බිංදු ඉසින පොම්පය', en: 'Squeeze-Bulb Oil Atomizer' },
        description: {
          si: 'ඉතා කුඩා තෙල් බිංදු මීදුමක් ඉහළ කුටීරයට ඉසියි.',
          en: 'Sprays a fine mist of microscopic non-volatile oil droplets into the top chamber.',
        },
        iconType: 'atomizer',
        benchSlot: { x: -1.1, z: -0.2 },
      },
      {
        id: 'xray-source',
        slotLabel: { si: 'X-කිරණ ප්‍රභවය', en: 'X-Ray Ionizer' },
        name: { si: 'X-කිරණ අයනීකරණ ප්‍රභවය', en: 'X-Ray Ionization Tube' },
        description: {
          si: 'වාතය අයනීකරණය කර තෙල් බිංදුවලට සෘණ ආරෝපණ (ne) ලබා දෙයි.',
          en: 'Ionizes air inside the chamber so droplets capture n elementary electrons.',
        },
        iconType: 'xray',
        benchSlot: { x: -1.3, z: 0.45 },
      },
      {
        id: 'view-microscope',
        slotLabel: { si: 'අන්වීක්ෂය', en: 'Microscope' },
        name: { si: 'මයික්‍රොමීටර අන්වීක්ෂය', en: 'Reticle Viewing Microscope' },
        description: {
          si: 'තෙල් බිංදුවේ වැටීමේ හා ස්ථායී වීමේ ප්‍රවේගය නිරීක්ෂණය කරයි.',
          en: 'Observes glowing oil droplets against calibrated crosshair divisions.',
        },
        iconType: 'microscope',
        benchSlot: { x: 1.25, z: 0.35 },
      },
    ],
    steps: [
      {
        id: 'mk-1',
        title: { si: 'මිලිකන් උපකරණ සවි කිරීම', en: 'Assemble Oil Drop Apparatus' },
        taskTitle: { si: 'කොටස් 4 මේසය මතට ගන්න', en: 'Place all 4 apparatus items onto the bench' },
        instruction: {
          si: 'පිත්තල කුටීරය, තෙල් විසිරකය, X-කිරණ ප්‍රභවය සහ අන්වීක්ෂය මේසය මතට ගන්න.',
          en: 'Place the Brass Chamber, Oil Atomizer, X-Ray Source, and Viewing Microscope onto the workbench.',
        },
        whyText: {
          si: 'ගුරුත්වාකර්ෂණ බලයට (mg) ප්‍රතිවිරුද්ධව ඉහළට විද්‍යුත් බලයක් (qE) යොදා තනි තෙල් බිංදුවක් අවකාශයේ රඳවා ගැනීමට මෙම සැකැස්ම අවශ්‍ය වේ.',
          en: 'Suspending a single microscopic droplet against gravity requires a parallel-plate electric field, ionizing beam, and precision microscope.',
        },
        assistantHint: {
          si: 'උපකරණ පෙට්ටියෙන් කොටස් 4 ම මේසයට ගන්න.',
          en: 'Click or drag all 4 items from the left Toolbox onto the bench.',
        },
        validationType: 'assemble',
      },
      {
        id: 'mk-2',
        title: { si: 'තෙල් බිංදු ඉසීම හා X-කිරණ යෙදීම', en: 'Spray Droplets & Ionize Chamber' },
        taskTitle: { si: 'තෙල් බිංදු ඉස X-කිරණ අයනීකරණය ON කරන්න', en: 'Spray Oil Droplets and turn X-Ray Ionizer ON' },
        instruction: {
          si: '"Spray Oil Droplets" බොත්තම ඔබා X-Ray Ionizer ON කරන්න. ඉහළ අන්වීක්ෂ කවුළුවේ දිලිසෙන තෙල් බිංදු ගුරුත්වය යටතේ පහළට වැටෙන හැටි බලන්න.',
          en: 'Press Spray Oil Droplets and switch X-Ray Ionizer ON. Watch illuminated golden droplets drift downward under gravity in the magnified reticle view.',
        },
        whyText: {
          si: 'X-කිරණ මගින් කුටීරය තුළ වායු අණුවලින් ඉලෙක්ට්‍රෝන මුදා හැරෙන අතර එමගින් තෙල් බිංදුව මත q = n·e ආරෝපණයක් ඇති වේ.',
          en: 'X-rays knock electrons from air molecules, charging droplets with integer multiples q = n·e.',
        },
        assistantHint: {
          si: 'Spray බොත්තම ඔබා X-Ray ස්විචය ON කර ඉහළ අන්වීක්ෂ කවුළුව බලන්න!',
          en: 'Click Spray Oil Droplets and enable the X-Ray Ionizer, then watch the eyepiece reticle!',
        },
        validationType: 'spray-ionize',
      },
      {
        id: 'mk-3',
        title: { si: 'තෙල් බිංදුව සමතුලිත කිරීම (mg = qE)', en: 'Suspend Droplet in Mid-Air (mg = qE)' },
        taskTitle: { si: 'Plate Voltage සකසා ප්‍රවේගය 0.00 mm/s ට ආසන්න කරන්න', en: 'Tune Plate Voltage until droplet velocity reaches ~0.00 mm/s' },
        instruction: {
          si: 'DC Plate Voltage (V) slider එක සෙමෙන් වෙනස් කරමින් ඉහළ අන්වීක්ෂ කවුළුවේ දිලිසෙන ඉලක්ක තෙල් බිංදුව චලනය නොවී නතර වන (SUSPENDED) වෝල්ටීයතාවය සොයා ගන්න!',
          en: 'Carefully adjust DC Plate Voltage (V) until the target oil droplet hovers completely still on the horizontal crosshair (SUSPENDED: |v| < 0.045 mm/s).',
        },
        whyText: {
          si: 'බිංදුව නිශ්චල විට mg = qE = q(V/d) වේ. විවිධ බිංදු සඳහා සෙවූ q අගයන් සියල්ල 1.602 × 10⁻¹⁹ C හි පූර්ණ සංඛ්‍යා ගුණාකාර (q = ne) බව මිලිකන් සොයා ගත්තේය.',
          en: 'At suspension, downward weight mg equals upward electric force qV/d. Every measured q was an integer multiple of e = 1.602 × 10⁻¹⁹ C.',
        },
        assistantHint: {
          si: 'ඉහළ අන්වීක්ෂ කවුළුවේ පෙන්වන Target Balance Voltage අගය දෙස බලා වෝල්ටීයතාවය සීරුමාරු කරන්න!',
          en: 'Watch the droplet velocity in the Magnified Microscope Eyepiece and fine-tune Voltage until it hovers still!',
        },
        validationType: 'balance-droplet',
        quizQuestion: {
          prompt: {
            si: 'මිලිකන්ගේ e = 1.602 × 10⁻¹⁹ C සහ තොම්සන්ගේ e/m = 1.759 × 10¹¹ C kg⁻¹ අගයන්ගෙන් ගණනය කළ ඉලෙක්ට්‍රෝනයේ ස්කන්ධය කොපමණද?',
            en: 'Combining Millikan’s e and Thomson’s e/m gives what mass for one electron?',
          },
          options: [
            { si: '9.109 × 10⁻³¹ kg', en: '9.109 × 10⁻³¹ kg' },
            { si: '1.673 × 10⁻²⁷ kg', en: '1.673 × 10⁻²⁷ kg' },
            { si: '6.022 × 10²³ kg', en: '6.022 × 10²³ kg' },
          ],
          correctIndex: 0,
          explanation: {
            si: 'නිවැරදියි! m_e = e / (e/m) = (1.602 × 10⁻¹⁹) / (1.759 × 10¹¹) ≈ 9.109 × 10⁻³¹ kg.',
            en: 'Correct! m_e = e / (e/m) = 9.109 × 10⁻³¹ kg (about 1/1836 the mass of a hydrogen atom).',
          },
        },
      },
    ],
    notebookSummary: {
      scientist: { si: 'රොබට් ඒ. මිලිකන් (Robert A. Millikan)', en: 'Robert A. Millikan' },
      year: '1909',
      keyFindings: [
        {
          si: 'තෙල් බිංදුව සමතුලිත විට: mg = qE = q(V / d).',
          en: 'At electrostatic suspension: mg = qE = q(V / d).',
        },
        {
          si: 'විද්‍යුත් ආරෝපණය ක්වොන්ටීකරණය වී ඇත: q = n · e (n = 1, 2, 3, ...).',
          en: 'Electric charge is quantized in integer units of e: q = n · e.',
        },
        {
          si: 'ඉලෙක්ට්‍රෝනයක ආරෝපණය e = 1.602 × 10⁻¹⁹ C හා ස්කන්ධය m_e = 9.109 × 10⁻³¹ kg.',
          en: 'Electron charge e = 1.602 × 10⁻¹⁹ C and mass m_e = 9.109 × 10⁻³¹ kg.',
        },
      ],
      equations: [
        'qE = mg  ⇒  q = m g d / V',
        'e = 1.602 × 10⁻¹⁹ C,   m_e = 9.109 × 10⁻³¹ kg',
      ],
    },
  },

  rutherford: {
    id: 'rutherford',
    number: '04',
    shortTitle: {
      si: 'රදර්ෆර්ඩ් රන් පත්‍ර',
      en: 'RUTHERFORD GOLD FOIL',
    },
    fullTitle: {
      si: 'අර්නස්ට් රදර්ෆර්ඩ්ගේ රන් පත්‍ර α-අංශු විසිරණ පරීක්ෂණය',
      en: "Ernest Rutherford's Gold Foil Alpha-Scattering Experiment",
    },
    subtitle: {
      si: 'ගයිගර්, මාස්ඩන් & රදර්ෆර්ඩ් (1911) — පරමාණුක න්‍යෂ්ටිය සොයා ගැනීම',
      en: 'Geiger, Marsden & Rutherford (1911) — Discovery of the Atomic Nucleus',
    },
    equipment: [
      {
        id: 'alpha-source',
        slotLabel: { si: 'α-ප්‍රභවය', en: 'α-Source Block' },
        name: { si: 'ඊයම් කුට්ටිය තුළ රේඩියම් α-ප්‍රභවය', en: 'Lead-Shielded Radium α-Source' },
        description: {
          si: 'ධන ආරෝපිත He²⁺ (α-අංශු) සිහින් කදම්බයක් නිකුත් කරයි.',
          en: 'Emits a narrow collimated beam of high-energy positive He²⁺ alpha particles.',
        },
        iconType: 'source',
        benchSlot: { x: -1.35, z: 0 },
      },
      {
        id: 'gold-foil',
        slotLabel: { si: 'රන් පත්‍රය', en: 'Gold Foil' },
        name: { si: 'අතිශය තුනී රන් පත්‍රය (~400 nm)', en: 'Ultra-Thin Gold Foil Target' },
        description: {
          si: 'පරමාණු ස්ථර කිහිපයක ඝනකමින් යුත් Au (Z=79) පත්‍රය.',
          en: 'Foil only ~1000 atoms thick; can also compare with Aluminum (Z=13).',
        },
        iconType: 'foil',
        benchSlot: { x: 0, z: 0 },
      },
      {
        id: 'zns-ring',
        slotLabel: { si: 'ZnS අනාවරක වළල්ල', en: 'ZnS Ring & Scale' },
        name: { si: '360° පරිමාණය හා භ්‍රමණය වන ZnS තිරය', en: 'Rotatable ZnS Scintillation Screen' },
        description: {
          si: 'α-අංශු ගැටෙන විට ක්ෂණික ආලෝක පුපුරු (scintillations) ඇති කරයි.',
          en: 'Flashes tiny light bursts upon alpha impact across angles 0° to 180°.',
        },
        iconType: 'screen',
        benchSlot: { x: 0.75, z: 0.45 },
      },
      {
        id: 'ruth-microscope',
        slotLabel: { si: 'චල අන්වීක්ෂය', en: 'Detector Scope' },
        name: { si: 'භ්‍රමණය කළ හැකි අනාවරක අන්වීක්ෂය', en: 'Travelling Detection Microscope' },
        description: {
          si: '0° සිට 180° දක්වා ඕනෑම කෝණයක ඇති ආලෝක පුපුරු ගණන් කරයි.',
          en: 'Sweeps around the foil from 0° to 180° to count alpha scintillations.',
        },
        iconType: 'microscope',
        benchSlot: { x: 1.3, z: -0.35 },
      },
    ],
    steps: [
      {
        id: 'rf-1',
        title: { si: 'රන් පත්‍ර උපකරණ සවි කිරීම', en: 'Assemble Alpha Scattering Bench' },
        taskTitle: { si: 'කොටස් 4 වැඩ මේසය මතට ගන්න', en: 'Place all 4 apparatus items onto the bench' },
        instruction: {
          si: 'α-ප්‍රභවය, රන් පත්‍රය, ZnS අනාවරක වළල්ල සහ චල අන්වීක්ෂය මේසය මත සවි කරන්න.',
          en: 'Place the Lead α-Source, Gold Foil, Rotatable ZnS Ring, and Travelling Microscope onto the workbench.',
        },
        whyText: {
          si: 'තොම්සන්ගේ "ප්ලම් පුඩිං" ආකෘතිය නිවැරදි නම්, සියලුම අධි-ශක්ති α-අංශු ඉතා සුළු අපගමනයකින් රන් පත්‍රය විනිවිද යා යුතුය.',
          en: 'If Thomson’s diffuse Plum Pudding atom were right, heavy 5 MeV alpha particles would blow straight through with almost zero deflection.',
        },
        assistantHint: {
          si: 'වම් පෙට්ටියෙන් උපකරණ 4 මේසයට ගෙන පරීක්ෂණය අරඹමු.',
          en: 'Place all 4 items from the Toolbox onto the bench slots.',
        },
        validationType: 'assemble',
      },
      {
        id: 'rf-2',
        title: { si: '0° කෝණයේ නිරීක්ෂණය', en: 'Observe Direct Forward Beam (0°)' },
        taskTitle: { si: 'α-කිරණ ON කර 0°–15° අතර නිරීක්ෂණය කරන්න', en: 'Turn α-Beam ON and inspect Detector Angle 0°–15°' },
        instruction: {
          si: '"α-Beam ON" කර Detector Angle slider එක 0° ලෙස තබන්න. 99.9% කට අධික α-අංශු ප්‍රමාණයක් කිසිදු බාධාවකින් තොරව කෙළින්ම රන් පත්‍රය හරහා ගමන් කරන ආකාරය බලන්න!',
          en: 'Enable the α-Particle Beam and keep Detector Angle near 0°. Observe in the 3D view and Magnified ZnS Scope that over 99.9% of alpha particles pass straight through!',
        },
        whyText: {
          si: 'අති බහුතරයක් α-අංශු කෙළින්ම ගමන් කිරීමෙන් පරමාණුවේ පරිමාවෙන් වැඩි කොටසක් හිස් අවකාශයක් (empty space) බව ඔප්පු විය.',
          en: 'Because almost every alpha particle passes straight through undeflected, most of an atom’s volume must be empty space.',
        },
        assistantHint: {
          si: 'α-කදම්බය ON කර Darkroom යොදා 0° ZnS තිරයේ ආලෝක පුපුරු බලන්න.',
          en: 'Switch α-Beam ON (try Darkroom mode!) and observe intense scintillations at 0°.',
        },
        validationType: 'rutherford-forward',
      },
      {
        id: 'rf-3',
        title: { si: 'පසුපසට විසිරීම (120°–180°) හා නිගමනය', en: 'Detect Rare Backscattering (>120°) & Concept Check' },
        taskTitle: { si: 'අනාවරකය 120°–180° දක්වා කරකවා පසු-විසිරීම බලන්න', en: 'Rotate detector past 120° to witness nuclear rebound' },
        instruction: {
          si: 'Detector Angle slider එක 120° සිට 180° අතර අගයකට කරකවන්න! ඉතා කුඩා ප්‍රමාණයක් (~20,000 න් 1 ක්) ධන ආරෝපිත න්‍යෂ්ටියේ ගැටී ආපසු හැරෙන හැටි නිරීක්ෂණය කර පහත ප්‍රශ්නයට පිළිතුරු දෙන්න.',
          en: 'Sweep Detector Angle past 120° toward 180°. Witness ~1 in 20,000 alpha particles violently rebounding off the dense positive nucleus, then answer the check below.',
        },
        whyText: {
          si: 'අධි-ශක්ති ධන α-අංශු ආපසු හැරවීමට නම් පරමාණුවේ සියලුම ධන ආරෝපණය හා ස්කන්ධය අතිශය කුඩා, ඝන කේන්ද්‍රයක (න්‍යෂ්ටියක) සංකේන්ද්‍රණය වී තිබිය යුතුය.',
          en: 'Only a tiny, ultra-dense, positively charged central core (the nucleus) can exert enough Coulomb repulsion to bounce an alpha particle backward.',
        },
        assistantHint: {
          si: 'කෝණය 120° ට වඩා වැඩි කර රන් (Au) හා ඇලුමිනියම් (Al) පත්‍ර මාරු කර වෙනස බලන්න!',
          en: 'Sweep angle > 120° and try comparing Gold (Z=79) vs Aluminum (Z=13) before answering!',
        },
        validationType: 'rutherford-backscatter',
        quizQuestion: {
          prompt: {
            si: 'α-අංශු 20,000 කින් 1 ක් පමණ 90° ට වඩා වැඩි කෝණයකින් ආපසු හැරීමෙන් රදර්ෆර්ඩ් කළ නිගමනය කුමක්ද?',
            en: 'What did Rutherford conclude from ~1 in 20,000 alpha particles rebounding beyond 90°?',
          },
          options: [
            {
              si: 'පරමාණුවේ මුළු ධන ආරෝපණය හා ස්කන්ධය ඉතා කුඩා න්‍යෂ්ටියක පවතී',
              en: 'Positive charge & nearly all mass reside in a tiny dense nucleus',
            },
            {
              si: 'පරමාණුව ඒකාකාර ධන ආරෝපිත ගෝලයකි',
              en: 'The atom is a uniform sphere of positive pudding',
            },
            {
              si: 'ඉලෙක්ට්‍රෝන කැතෝඩයේ සිට ගමන් කරයි',
              en: 'Electrons travel from the cathode toward the foil',
            },
          ],
          correctIndex: 0,
          explanation: {
            si: 'නිවැරදියි! ඊට අමතරව 1932 දී ජේම්ස් චැඩ්වික් විසින් α-අංශු Be මත ගැටීමෙන් ආරෝපණ රහිත නියුට්‍රෝනය ද සොයා ගත්තේය.',
            en: 'Correct! Later in 1932, James Chadwick bombarded Beryllium with α-particles to discover the neutral neutron inside the nucleus.',
          },
        },
      },
    ],
    notebookSummary: {
      scientist: { si: 'අර්නස්ට් රදර්ෆර්ඩ් (Ernest Rutherford) · ගයිගර් & මාස්ඩන්', en: 'Ernest Rutherford, Geiger & Marsden' },
      year: '1911 (1932 Neutron: Chadwick)',
      keyFindings: [
        {
          si: 'අති බහුතරයක් α-අංශු කෙළින්ම ගමන් කරයි ⇒ පරමාණුවෙන් වැඩි කොටස හිස් අවකාශයකි.',
          en: 'Over 99.9% pass straight through ⇒ most of the atom is empty space.',
        },
        {
          si: 'සුළු ප්‍රමාණයක් සුළු කෝණවලින් විසිරේ ⇒ කේන්ද්‍රයේ ධන ආරෝපණයක් ඇත.',
          en: 'Small fraction deflects at small angles ⇒ central positive electrostatic repulsion.',
        },
        {
          si: '~20,000 න් 1 ක් 90°–180° ආපසු හැරේ ⇒ පරමාණුවේ මුළු ස්කන්ධයම පාහේ ඉතා කුඩා ඝන න්‍යෂ්ටියක පවතී.',
          en: '~1 in 20,000 rebounds > 90° ⇒ nearly all mass concentrates in a tiny dense nucleus.',
        },
        {
          si: 'චැඩ්වික් (1932): ⁴₂He + ⁹₄Be → ¹²₆C + ¹₀n (නියුට්‍රෝනය සොයා ගැනීම).',
          en: 'Chadwick (1932): ⁴₂He + ⁹₄Be → ¹²₆C + ¹₀n (discovery of the neutron).',
        },
      ],
      equations: [
        'N(θ) ∝ Z² · t / sin⁴(θ / 2)',
        '⁴₂He + ⁹₄Be → ¹²₆C + ¹₀n  (Chadwick, 1932)',
      ],
    },
  },
};

export const EXPERIMENT_ORDER: ExperimentId[] = [
  'cathode-tube',
  'thomson-canal',
  'millikan',
  'rutherford',
];

export function evaluateStepCompletion(
  step: LabStep,
  placedIds: Set<string>,
  requiredIds: string[],
  params: LabSimulationParams,
  isBalancedThomson: boolean,
  isSuspendedMillikan: boolean,
  quizAnsweredCorrectly: boolean,
  visitedGasChange: boolean,
  visitedMetalChange: boolean
): boolean {
  switch (step.validationType) {
    case 'assemble':
      return requiredIds.every((id) => placedIds.has(id));
    case 'evacuate-pressure':
      return params.hvEnabled && params.pressureMmHg <= 0.015;
    case 'maltese-shadow':
      return params.hvEnabled && params.pressureMmHg <= 0.02 && params.malteseCrossUp;
    case 'paddle-wheel':
      return params.hvEnabled && params.pressureMmHg <= 0.02 && params.paddleWheelEngaged;
    case 'magnet-deflection':
      return params.hvEnabled && params.magnetActive && quizAnsweredCorrectly;
    case 'electric-deflection':
      return params.hvEnabled && Math.abs(params.electricVoltageV) >= 150;
    case 'magnetic-balance':
      return params.hvEnabled && isBalancedThomson;
    case 'gas-independence':
      return visitedGasChange && visitedMetalChange;
    case 'canal-rays':
      return (
        params.hvEnabled &&
        params.thomsonMode === 'canal-rays' &&
        params.gas === 'hydrogen' &&
        quizAnsweredCorrectly
      );
    case 'spray-ionize':
      return params.sprayPulse >= 1 && params.xrayActive;
    case 'balance-droplet':
      return isSuspendedMillikan && quizAnsweredCorrectly;
    case 'rutherford-forward':
      return params.alphaBeamEnabled && params.detectorAngleDeg <= 15;
    case 'rutherford-backscatter':
      return (
        params.alphaBeamEnabled &&
        params.detectorAngleDeg >= 120 &&
        quizAnsweredCorrectly
      );
    default:
      return false;
  }
}
