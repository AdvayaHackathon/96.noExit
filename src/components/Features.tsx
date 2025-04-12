import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, Wifi, Users, Compass, Brain, BookText, X, Volume2, Download, CheckCircle, FileText, Youtube, ChevronUp, ChevronDown } from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface Feature {
  icon: React.ElementType;
  key: keyof typeof featureTranslations;
  action: () => void;
  isActive?: boolean;
}

interface DownloadableContent {
  id: string;
  title: string;
  description: string; 
  pdfUrl: string;
  isDownloaded: boolean;
  size: string;
  type: 'pdf' | 'video';
}

interface CareerInfo {
  name: string;
  description: string;
  skills: string[];
  salary: string;
  growth: string;
  videoLinks: { title: string; url: string }[];
  dayToDay: string[];
}

interface AdaptiveQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: number;
  completed: boolean;
  explanation: string;
  category: string;
}

interface PeerProfile {
  id: string;
  name: string;
  subject: string;
  bio: string;
  rating: number;
  availability: string;
  contactInfo: string;
  expertise: string[];
}

const featureTranslations = {
  voiceLearning: 'features.voiceLearning',
  offlineAccess: 'features.offlineAccess',
  peerTutoring: 'features.peerTutoring',
  careerGuidance: 'features.careerGuidance',
  adaptiveLearning: 'features.adaptiveLearning',
  gkQuiz: 'features.gkQuiz',
} as const;

// Supported languages for voice learning
const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'kn', name: 'Kannada' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ur', name: 'Urdu' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'as', name: 'Assamese' },
  { code: 'kok', name: 'Konkani' },
  { code: 'tcy', name: 'Tulu' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ml', name: 'Malayalam' }
];

export default function Features() {
  const { t, i18n } = useTranslation();
  const [selectedFeature, setSelectedFeature] = useState<keyof typeof featureTranslations | null>(null);
  const [speechResult, setSpeechResult] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [peers, setPeers] = useState<string[]>([]);
  const [careerPath, setCareerPath] = useState<string>('');
  const [learningLevel, setLearningLevel] = useState(1);
  const [activePeers, setActivePeers] = useState<PeerProfile[]>([]);
  const [selectedPeer, setSelectedPeer] = useState<PeerProfile | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [selectedQuestion, setSelectedQuestion] = useState<AdaptiveQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [dialogScrollPosition, setDialogScrollPosition] = useState(0);
  const [dialogContentRef, setDialogContentRef] = useState<HTMLDivElement | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [gkQuestions, setGkQuestions] = useState<AdaptiveQuestion[]>([]);
  const [selectedGkQuestion, setSelectedGkQuestion] = useState<AdaptiveQuestion | null>(null);
  const [selectedGkAnswer, setSelectedGkAnswer] = useState<number | null>(null);
  const [showGkExplanation, setShowGkExplanation] = useState(false);
  const [gkScore, setGkScore] = useState(0);
  const [totalGkAnswered, setTotalGkAnswered] = useState(0);

  const [downloadableContent, setDownloadableContent] = useState<DownloadableContent[]>([
    {
      id: '1',
      title: 'Mathematics Fundamentals',
      description: 'Comprehensive guide to algebra, geometry, and calculus basics',
      pdfUrl: 'https://www.isibang.ac.in/~library/onlinerz/resources/mt-v1.pdf',
      isDownloaded: false,
      size: '5.2 MB',
      type: 'pdf'
    },
    {
      id: '2',
      title: 'World History Overview',
      description: 'From ancient civilizations to modern history',
      pdfUrl: 'https://lup.nl/wp-content/uploads/World-history-for-international-Studies-Introduction.pdf',
      isDownloaded: false,
      size: '4.8 MB',
      type: 'pdf'
    },
    {
      id: '3',
      title: 'Science Comprehensive Guide',
      description: 'Physics, Chemistry, and Biology fundamentals',
      pdfUrl: 'https://www.nesinternational.org/school_policies/sciences_guide.pdf',
      isDownloaded: false,
      size: '6.1 MB',
      type: 'pdf'
    },
    {
      id: '4',
      title: 'Language Arts Mastery',
      description: 'Grammar, composition, and literature analysis',
      pdfUrl: 'https://core-docs.s3.amazonaws.com/documents/asset/uploaded_file/1876783/CCEE_ENGLISH_LANGUAGE_ARTS_MASTERY_STATEMENTS.pdf',
      isDownloaded: false,
      size: '4.5 MB',
      type: 'pdf'
    }
  ]);

  const [adaptiveQuestions, setAdaptiveQuestions] = useState<AdaptiveQuestion[]>([
    {
      id: 1,
      question: "What is the primary purpose of a variable in programming?",
      options: [
        "To store and manage data",
        "To create visual effects",
        "To connect to the internet",
        "To print text on screen"
      ],
      correctAnswer: 0,
      difficulty: 1,
      completed: false,
      explanation: "Variables are fundamental containers for storing and managing data in programming.",
      category: "Programming Basics"
    },
    {
      id: 2,
      question: "Which of these is a correct way to declare a variable in JavaScript?",
      options: [
        "var myVar = 10;",
        "variable myVar = 10;",
        "myVar := 10;",
        "new var myVar = 10;"
      ],
      correctAnswer: 0,
      difficulty: 1,
      completed: false,
      explanation: "The correct syntax in JavaScript is 'var myVar = 10;'. Other options are not valid JavaScript syntax.",
      category: "JavaScript Basics"
    },
    {
      id: 3,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyperlinks and Text Markup Language",
        "Home Tool Markup Language"
      ],
      correctAnswer: 0,
      difficulty: 1,
      completed: false,
      explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.",
      category: "Web Development"
    },
    {
      id: 4,
      question: "Which data structure is best suited for implementing a LIFO pattern?",
      options: [
        "Queue",
        "Stack",
        "Array",
        "Tree"
      ],
      correctAnswer: 1,
      difficulty: 2,
      completed: false,
      explanation: "A stack follows Last-In-First-Out (LIFO) principle, making it perfect for such operations.",
      category: "Data Structures"
    },
    {
      id: 5,
      question: "What is the purpose of dependency injection?",
      options: [
        "To reduce code coupling",
        "To increase application size",
        "To make code more complex",
        "To slow down execution"
      ],
      correctAnswer: 0,
      difficulty: 2,
      completed: false,
      explanation: "Dependency injection helps reduce coupling between components and makes code more maintainable and testable.",
      category: "Software Design"
    },
    {
      id: 6,
      question: "Which HTTP method is idempotent?",
      options: [
        "POST",
        "GET",
        "PATCH",
        "DELETE"
      ],
      correctAnswer: 1,
      difficulty: 2,
      completed: false,
      explanation: "GET requests are idempotent, meaning multiple identical requests should have the same effect as a single request.",
      category: "Web Development"
    },
    {
      id: 7,
      question: "What is the time complexity of binary search?",
      options: [
        "O(n)",
        "O(n²)",
        "O(log n)",
        "O(1)"
      ],
      correctAnswer: 2,
      difficulty: 3,
      completed: false,
      explanation: "Binary search has a logarithmic time complexity as it halves the search space in each step.",
      category: "Algorithms"
    },
    {
      id: 8,
      question: "What is the purpose of the virtual DOM in React?",
      options: [
        "To improve performance by minimizing direct DOM manipulation",
        "To create virtual reality applications",
        "To replace the need for state management",
        "To enable server-side rendering"
      ],
      correctAnswer: 0,
      difficulty: 3,
      completed: false,
      explanation: "The virtual DOM allows React to minimize direct DOM manipulation by comparing virtual DOM trees and only updating what changed.",
      category: "React"
    },
    {
      id: 9,
      question: "In OOP, what is the difference between abstraction and encapsulation?",
      options: [
        "Abstraction hides complexity while encapsulation hides implementation",
        "They are the same concept with different names",
        "Abstraction is about inheritance while encapsulation is about polymorphism",
        "Encapsulation hides complexity while abstraction hides implementation"
      ],
      correctAnswer: 0,
      difficulty: 3,
      completed: false,
      explanation: "Abstraction focuses on hiding complexity by showing only essential features, while encapsulation hides the implementation details by bundling data and methods.",
      category: "Object-Oriented Programming"
    },
    {
      id: 10,
      question: "What is the CAP theorem in distributed systems?",
      options: [
        "A system can only guarantee two of Consistency, Availability, and Partition Tolerance",
        "A system can guarantee all three of Consistency, Availability, and Partition Tolerance",
        "A theorem about CPU architecture performance",
        "A principle about cache optimization"
      ],
      correctAnswer: 0,
      difficulty: 4,
      completed: false,
      explanation: "The CAP theorem states that a distributed system can only simultaneously provide two out of three guarantees: Consistency, Availability, and Partition tolerance.",
      category: "Distributed Systems"
    },
    {
      id: 11,
      question: "What is the difference between a monolith and microservices architecture?",
      options: [
        "Monolith is a single unified service while microservices are independently deployable services",
        "Microservices are simpler to develop than monoliths",
        "Monoliths are always better for large-scale applications",
        "There is no significant difference between them"
      ],
      correctAnswer: 0,
      difficulty: 4,
      completed: false,
      explanation: "A monolith is a single, unified codebase while microservices architecture consists of multiple small, independently deployable services that communicate over a network.",
      category: "Software Architecture"
    },
    {
      id: 12,
      question: "What is the time complexity of Dijkstra's algorithm with a Fibonacci heap?",
      options: [
        "O(V log V + E)",
        "O(V²)",
        "O(V + E)",
        "O(V E)"
      ],
      correctAnswer: 0,
      difficulty: 5,
      completed: false,
      explanation: "With a Fibonacci heap, Dijkstra's algorithm achieves O(V log V + E) time complexity, which is better than the O(V²) complexity with a simple array implementation.",
      category: "Algorithms"
    }
  ]);

  const careers: CareerInfo[] = [
    {
      name: 'Software Developer',
      description: 'Design, build, and maintain software systems.',
      skills: ['Programming', 'Problem Solving', 'Version Control', 'Agile Methodologies'],
      salary: '$70,000 - $150,000',
      growth: '22% (Much faster than average)',
      videoLinks: [
        { 
          title: 'Day in the Life of a Software Developer',
          url: 'https://youtu.be/xDVxesPP25I?feature=shared'
        },
        {
          title: 'How to Become a Software Developer in 2025',
          url: 'https://youtu.be/avdDEZCcluo?feature=shared'
        }
      ],
      dayToDay: [
        'Writing and reviewing code',
        'Collaborating with team members',
        'Attending stand-up meetings',
        'Debugging and troubleshooting',
        'Learning new technologies'
      ]
    },
    {
      name: 'Data Scientist',
      description: 'Analyze complex data sets to help guide business decisions.',
      skills: ['Python/R', 'Machine Learning', 'Statistics', 'Data Visualization'],
      salary: '$85,000 - $165,000',
      growth: '36% (Much faster than average)',
      videoLinks: [
        {
          title: 'What Does a Data Scientist Actually Do?',
          url: 'https://youtu.be/GhFgnkLPZj4?feature=shared'
        },
        {
          title: 'Data Science Project Walkthrough',
          url: 'https://youtu.be/Qz7erR3zVUc?feature=shared'
        }
      ],
      dayToDay: [
        'Analyzing large datasets',
        'Building predictive models',
        'Creating data visualizations',
        'Presenting findings to stakeholders',
        'Implementing machine learning solutions'
      ]
    },
    {
      name: 'Cloud Architect',
      description: 'Design and oversee cloud computing infrastructure.',
      skills: ['AWS/Azure/GCP', 'Network Security', 'System Design', 'DevOps'],
      salary: '$100,000 - $200,000',
      growth: '19% (Much faster than average)',
      videoLinks: [
        {
          title: 'Cloud Architecture Explained',
          url: 'https://youtu.be/pGe4VZbSmTw?feature=shared'
        },
        {
          title: 'Building Scalable Cloud Solutions',
          url: 'https://youtu.be/szBgZuLKa0Q?feature=shared'
        }
      ],
      dayToDay: [
        'Designing cloud infrastructure',
        'Implementing security measures',
        'Optimizing cloud costs',
        'Managing cloud migrations',
        'Monitoring system performance'
      ]
    }
  ];

  useEffect(() => {
    // Load voices when component mounts
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Try to find a voice that matches the selected language
      if (voices.length > 0) {
        const defaultVoice = voices.find(v => v.lang.startsWith(selectedLanguage)) || voices[0];
        setSelectedVoice(defaultVoice);
      }
    };

    // Initialize GK questions
    const initializeGkQuestions = () => {
      const questions: AdaptiveQuestion[] = [
        {
          id: 1,
          question: "What is the capital of India?",
          options: [
            "Mumbai",
            "New Delhi",
            "Kolkata",
            "Chennai"
          ],
          correctAnswer: 1,
          difficulty: 1,
          completed: false,
          explanation: "New Delhi is the capital of India, while Mumbai, Kolkata, and Chennai are major metropolitan cities.",
          category: "India GK"
        },
        {
          id: 2,
          question: "Which of these is the official language of Karnataka?",
          options: [
            "Telugu",
            "Tamil",
            "Kannada",
            "Malayalam"
          ],
          correctAnswer: 2,
          difficulty: 1,
          completed: false,
          explanation: "Kannada is the official language of Karnataka. The other options are official languages of neighboring states.",
          category: "Karnataka GK"
        },
        {
          id: 3,
          question: "Which city is known as the 'Silicon Valley of India'?",
          options: [
            "Hyderabad",
            "Pune",
            "Bengaluru",
            "Chennai"
          ],
          correctAnswer: 2,
          difficulty: 1,
          completed: false,
          explanation: "Bengaluru (Bangalore) is known as the Silicon Valley of India due to its prominence as a major IT hub.",
          category: "India GK"
        },
        {
          id: 4,
          question: "Which dynasty built the Hampi monuments?",
          options: [
            "Chola Dynasty",
            "Vijayanagara Empire",
            "Maurya Empire",
            "Mughal Empire"
          ],
          correctAnswer: 1,
          difficulty: 2,
          completed: false,
          explanation: "The Vijayanagara Empire built the monuments at Hampi, which is now a UNESCO World Heritage Site in Karnataka.",
          category: "Karnataka GK"
        },
        {
          id: 5,
          question: "What is the state animal of Karnataka?",
          options: [
            "Bengal Tiger",
            "Indian Elephant",
            "Indian Bison",
            "Leopard"
          ],
          correctAnswer: 1,
          difficulty: 1,
          completed: false,
          explanation: "The Indian Elephant is the state animal of Karnataka, while the Bengal Tiger is the national animal of India.",
          category: "Karnataka GK"
        },
        {
          id: 6,
          question: "Which river is known as the 'Ganga of the South'?",
          options: [
            "Godavari",
            "Krishna",
            "Kaveri",
            "Tungabhadra"
          ],
          correctAnswer: 2,
          difficulty: 2,
          completed: false,
          explanation: "The Kaveri river is often called the 'Ganga of the South' due to its cultural and religious significance in South India.",
          category: "India GK"
        },
        {
          id: 7,
          question: "Which of these festivals is famously celebrated in Mysuru?",
          options: [
            "Onam",
            "Pongal",
            "Dasara",
            "Bihu"
          ],
          correctAnswer: 2,
          difficulty: 1,
          completed: false,
          explanation: "Mysuru Dasara is a famous 10-day festival celebrated with great pomp in the city of Mysuru, Karnataka.",
          category: "Karnataka GK"
        },
        {
          id: 8,
          question: "Which is the highest peak in Karnataka?",
          options: [
            "Kudremukh",
            "Nandi Hills",
            "Mullayanagiri",
            "Savandurga"
          ],
          correctAnswer: 2,
          difficulty: 2,
          completed: false,
          explanation: "Mullayanagiri in the Chandra Dhrona Hill Ranges is the highest peak in Karnataka at 1,925 meters.",
          category: "Karnataka GK"
        },
        {
          id: 9,
          question: "Which of these is a famous silk saree from Karnataka?",
          options: [
            "Kanchipuram",
            "Banarasi",
            "Mysuru Silk",
            "Paithani"
          ],
          correctAnswer: 2,
          difficulty: 1,
          completed: false,
          explanation: "Mysuru Silk sarees are famous products of Karnataka, known for their quality and craftsmanship.",
          category: "Karnataka GK"
        },
        {
          id: 10,
          question: "Which of these UNESCO World Heritage Sites is located in Karnataka?",
          options: [
            "Hampi",
            "Khajuraho",
            "Konark Sun Temple",
            "Sanchi Stupa"
          ],
          correctAnswer: 0,
          difficulty: 2,
          completed: false,
          explanation: "Hampi, the ruins of the Vijayanagara Empire, is a UNESCO World Heritage Site located in Karnataka.",
          category: "Karnataka GK"
        },
        {
          id: 11,
          question: "What is the traditional folk theater form of Karnataka?",
          options: [
            "Kathakali",
            "Yakshagana",
            "Bharatanatyam",
            "Kuchipudi"
          ],
          correctAnswer: 1,
          difficulty: 2,
          completed: false,
          explanation: "Yakshagana is the traditional folk theater form of Karnataka, combining dance, music, dialogue, and elaborate costumes.",
          category: "Karnataka GK"
        },
        {
          id: 12,
          question: "Which of these national parks is located in Karnataka?",
          options: [
            "Bandipur National Park",
            "Kaziranga National Park",
            "Sunderbans National Park",
            "Gir National Park"
          ],
          correctAnswer: 0,
          difficulty: 2,
          completed: false,
          explanation: "Bandipur National Park is located in Karnataka and is part of the Nilgiri Biosphere Reserve.",
          category: "Karnataka GK"
        }
      ];
      setGkQuestions(questions);
    };

    loadVoices();
    initializeGkQuestions();
    
    // Some browsers need this event to load voices
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedLanguage]);

  const handleDialogScroll = (direction: 'up' | 'down') => {
    if (!dialogContentRef) return;
    
    const scrollAmount = 200;
    if (direction === 'up') {
      dialogContentRef.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    } else {
      dialogContentRef.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window && selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-speech not supported in this browser or no voice selected');
    }
  };

  const toggleDownload = (contentId: string) => {
    setDownloadableContent(prevContent =>
      prevContent.map(content =>
        content.id === contentId
          ? { ...content, isDownloaded: !content.isDownloaded }
          : content
      )
    );
  };

  const handleQuestionSubmit = () => {
    if (selectedQuestion && selectedAnswer !== null) {
      setShowExplanation(true);
      if (selectedAnswer === selectedQuestion.correctAnswer) {
        setAdaptiveQuestions(prev =>
          prev.map(q =>
            q.id === selectedQuestion.id
              ? { ...q, completed: true }
              : q
          )
        );
        
        const completedQuestions = adaptiveQuestions.filter(q => q.completed).length;
        const questionsNeededToLevelUp = learningLevel * 2;
        
        if (completedQuestions >= questionsNeededToLevelUp) {
          setLearningLevel(prev => Math.min(prev + 1, 5));
        }
      }
    }
  };

  const handleGkQuestionSubmit = () => {
    if (selectedGkQuestion && selectedGkAnswer !== null) {
      setShowGkExplanation(true);
      setTotalGkAnswered(prev => prev + 1);
      
      if (selectedGkAnswer === selectedGkQuestion.correctAnswer) {
        setGkScore(prev => prev + 1);
        setGkQuestions(prev =>
          prev.map(q =>
            q.id === selectedGkQuestion.id
              ? { ...q, completed: true }
              : q
          )
        );
      }
    }
  };

  const toggleOfflineAccess = () => {
    setIsOffline(!isOffline);
  };

  const initializePeerTutoring = () => {
    const mockPeers: PeerProfile[] = [
      { 
        id: '1', 
        name: 'Sarah Johnson', 
        subject: 'Mathematics',
        bio: 'Mathematics graduate with 5 years of tutoring experience. Specialized in algebra and calculus.',
        rating: 4.9,
        availability: 'Mon-Fri, 9am-5pm',
        contactInfo: 'sarah.j@example.com',
        expertise: ['Algebra', 'Calculus', 'Geometry', 'Trigonometry']
      },
      { 
        id: '2', 
        name: 'Michael Chen', 
        subject: 'Physics',
        bio: 'Physics PhD candidate with a passion for teaching fundamental concepts in an engaging way.',
        rating: 4.7,
        availability: 'Tue-Thu, 2pm-8pm',
        contactInfo: 'michael.c@example.com',
        expertise: ['Mechanics', 'Electromagnetism', 'Thermodynamics', 'Quantum Physics']
      },
      { 
        id: '3', 
        name: 'Emma Davis', 
        subject: 'Chemistry',
        bio: 'High school chemistry teacher with 8 years of experience making chemistry fun and accessible.',
        rating: 4.8,
        availability: 'Mon-Wed-Fri, 4pm-9pm',
        contactInfo: 'emma.d@example.com',
        expertise: ['Organic Chemistry', 'Biochemistry', 'Analytical Chemistry', 'Physical Chemistry']
      },
      { 
        id: '4', 
        name: 'Alex Kumar', 
        subject: 'Computer Science',
        bio: 'Software engineer who loves teaching programming concepts to beginners and advanced students alike.',
        rating: 4.9,
        availability: 'Weekends, 10am-6pm',
        contactInfo: 'alex.k@example.com',
        expertise: ['Python', 'JavaScript', 'Data Structures', 'Algorithms']
      },
      { 
        id: '5', 
        name: 'Ravi Kumar', 
        subject: 'Data Science',
        bio: 'Data scientist with industry experience who enjoys mentoring aspiring data professionals.',
        rating: 4.6,
        availability: 'Mon-Fri, 6pm-10pm',
        contactInfo: 'ravi.k@example.com',
        expertise: ['Machine Learning', 'Data Analysis', 'SQL', 'Data Visualization']
      },
      { 
        id: '6', 
        name: 'Sunitha Ramachandra', 
        subject: 'Java',
        bio: 'Senior Java developer with 10+ years of experience in enterprise applications.',
        rating: 4.8,
        availability: 'Sat-Sun, 9am-5pm',
        contactInfo: 'sunitha.r@example.com',
        expertise: ['Java', 'Spring Framework', 'Microservices', 'JVM']
      },
      { 
        id: '7', 
        name: 'Emma David', 
        subject: 'Biology',
        bio: 'Biology researcher specializing in molecular biology and genetics.',
        rating: 4.5,
        availability: 'Mon-Thu, 3pm-7pm',
        contactInfo: 'emma.david@example.com',
        expertise: ['Genetics', 'Cell Biology', 'Microbiology', 'Evolution']
      },
      { 
        id: '8', 
        name: 'Mark Alex', 
        subject: 'Business Analytics',
        bio: 'Business analyst with expertise in data-driven decision making and visualization.',
        rating: 4.7,
        availability: 'Flexible hours',
        contactInfo: 'mark.a@example.com',
        expertise: ['Excel', 'Tableau', 'Power BI', 'Statistics']
      },
    ];
    setActivePeers(mockPeers);
  };

  const connectWithPeer = (peer: PeerProfile) => {
    setIsConnecting(true);
    setSelectedPeer(peer);
    setConnectionStatus(`Connecting with ${peer.name}...`);
    
    setTimeout(() => {
      setConnectionStatus(`Connection established with ${peer.name}!`);
      speak(`You are now connected with ${peer.name}, expert in ${peer.subject}`);
    }, 2000);
  };

  const closePeerConnection = () => {
    setIsConnecting(false);
    setSelectedPeer(null);
    setConnectionStatus('');
  };

  const handleSpeechToText = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Speech Recognition API is not supported by this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Set language based on selected language
    const languageMap: Record<string, string> = {
      en: 'en-US',
      kn: 'kn-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      ur: 'ur-PK',
      pa: 'pa-IN',
      as: 'as-IN',
      kok: 'kok-IN',
      tcy: 'tcy-IN',
      sa: 'sa-IN',
      gu: 'gu-IN',
      ml: 'ml-IN'
    };

    recognition.lang = languageMap[selectedLanguage] || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpeechResult(transcript);
      setIsListening(false);
      speak(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const getCareerGuidanceContent = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {careers.map((career, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{career.name}</h3>
              <p className="text-gray-600 mb-4">{career.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Salary Range</h4>
                  <p className="text-blue-700">{career.salary}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">Growth Rate</h4>
                  <p className="text-green-700">{career.growth}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Day-to-Day Activities</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {career.dayToDay.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 mb-2">Related Videos</h4>
                {career.videoLinks.map((video, i) => (
                  <a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                  >
                    <Youtube className="h-5 w-5" />
                    {video.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getLevelDescription = (level: number) => {
    const levelDescriptions = [
      "Beginner: Learning the fundamentals",
      "Intermediate: Building on core concepts",
      "Advanced: Tackling complex problems",
      "Expert: Mastering specialized topics",
      "Master: Challenging cutting-edge concepts"
    ];
    return levelDescriptions[level - 1] || "";
  };

  const getFilteredQuestions = () => {
    return adaptiveQuestions.filter(q => q.difficulty <= learningLevel);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    
    // Try to find a voice that matches the new language
    if (availableVoices.length > 0) {
      const matchingVoice = availableVoices.find(v => v.lang.startsWith(newLanguage));
      if (matchingVoice) {
        setSelectedVoice(matchingVoice);
      }
    }
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceName = e.target.value;
    const voice = availableVoices.find(v => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);
    }
  };

  const getGkQuizContent = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-medium mb-4">India-Karnataka GK Quiz</h3>
          
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Your Score</h4>
                <p className="text-2xl font-bold">
                  {gkScore} / {totalGkAnswered}
                  {totalGkAnswered > 0 ? ` (${Math.round((gkScore / totalGkAnswered) * 100)}%)` : ''}
                </p>
              </div>
              <div className="text-right">
                <h4 className="font-medium">Questions</h4>
                <p className="text-lg">{gkQuestions.length} available</p>
              </div>
            </div>
          </div>
          
          {!selectedGkQuestion ? (
            <div className="grid grid-cols-1 gap-4">
              {gkQuestions.map((question) => (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    question.completed
                      ? 'bg-green-100 hover:bg-green-200'
                      : 'bg-white hover:bg-gray-50'
                  } shadow`}
                  onClick={() => {
                    setSelectedGkQuestion(question);
                    setSelectedGkAnswer(null);
                    setShowGkExplanation(false);
                    speak(question.question);
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">Question {question.id}</h4>
                      <p className="text-sm text-gray-600">
                        {question.category}
                      </p>
                    </div>
                    {question.completed && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-yellow-600">
                  {selectedGkQuestion.category}
                </span>
                <span className="text-sm text-gray-500">
                  Question {selectedGkQuestion.id}
                </span>
              </div>
              <h4 className="text-lg font-medium mb-4">{selectedGkQuestion.question}</h4>
              <div className="space-y-3">
                {selectedGkQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full p-3 text-left rounded-md transition-colors ${
                      selectedGkAnswer === index
                        ? showGkExplanation
                          ? index === selectedGkQuestion.correctAnswer
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSelectedGkAnswer(index);
                      speak(option);
                    }}
                    disabled={showGkExplanation}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {selectedGkAnswer !== null && !showGkExplanation && (
                <button
                  className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  onClick={() => {
                    handleGkQuestionSubmit();
                    speak(
                      selectedGkAnswer === selectedGkQuestion.correctAnswer
                        ? "Correct! " + selectedGkQuestion.explanation
                        : "Incorrect. " + selectedGkQuestion.explanation
                    );
                  }}
                >
                  Submit Answer
                </button>
              )}
              
              {showGkExplanation && (
                <div className={`mt-4 p-4 rounded-md ${
                  selectedGkAnswer === selectedGkQuestion.correctAnswer
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  <h5 className="font-medium mb-2">
                    {selectedGkAnswer === selectedGkQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                  </h5>
                  <p>{selectedGkQuestion.explanation}</p>
                  <button
                    className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    onClick={() => setSelectedGkQuestion(null)}
                  >
                    Back to Questions
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getFeatureContent = (key: keyof typeof featureTranslations) => {
    switch (key) {
      case 'voiceLearning':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Language
                </label>
                <select
                  id="language-select"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="voice-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Voice
                </label>
                <select
                  id="voice-select"
                  value={selectedVoice?.name || ''}
                  onChange={handleVoiceChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={availableVoices.length === 0}
                >
                  {availableVoices.length === 0 ? (
                    <option>Loading voices...</option>
                  ) : (
                    availableVoices
                      .filter(voice => voice.lang.startsWith(selectedLanguage))
                      .map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleSpeechToText}
                disabled={isListening}
                className={`px-4 py-2 rounded-md ${
                  isListening ? 'bg-gray-600 text-white' : 'bg-green-600 text-white'
                }`}
              >
                {isListening ? 'Listening...' : 'Start Speech-to-Text'}
              </button>
              
              <button
                onClick={() => speak("Hello, this is a test of the text-to-speech functionality.")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Test Text-to-Speech
              </button>
              
              {speechResult && (
                <div className="bg-green-50 p-4 rounded-md mt-4">
                  <h3 className="text-lg font-medium mb-2">Transcription Result:</h3>
                  <p className="text-green-700">{speechResult}</p>
                  <button
                    onClick={() => speak(speechResult)}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <Volume2 className="h-4 w-4" />
                    Read Aloud
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'offlineAccess':
        return (
          <div className="space-y-4">
            <button
              onClick={toggleOfflineAccess}
              className={`px-4 py-2 rounded-md ${
                isOffline ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {isOffline ? 'Disable Offline Mode' : 'Enable Offline Mode'}
            </button>
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Available Content:</h3>
              <div className="space-y-3">
                {downloadableContent.map((content) => (
                  <div key={content.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          {content.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{content.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Size: {content.size}</p>
                      </div>
                      <button
                        onClick={() => toggleDownload(content.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                          content.isDownloaded
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {content.isDownloaded ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Downloaded
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            Download PDF
                          </>
                        )}
                      </button>
                    </div>
                    {content.isDownloaded && (
                      <a
                        href={content.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-blue-600 hover:text-blue-800 flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        Open PDF
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'peerTutoring':
        return (
          <div className="space-y-4">
            {isConnecting && selectedPeer ? (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Connected with {selectedPeer.name}</h3>
                  <button 
                    onClick={closePeerConnection}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className={`p-3 rounded-md mb-4 ${
                    connectionStatus.includes('established') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {connectionStatus}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Peer Profile</h4>
                      <div className="space-y-2 text-gray-600">
                        <p><span className="font-medium">Subject:</span> {selectedPeer.subject}</p>
                        <p><span className="font-medium">Rating:</span> {selectedPeer.rating}/5</p>
                        <p><span className="font-medium">Availability:</span> {selectedPeer.availability}</p>
                        <p><span className="font-medium">Contact:</span> {selectedPeer.contactInfo}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPeer.expertise.map((skill, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Bio</h4>
                    <p className="text-gray-600">{selectedPeer.bio}</p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Start Video Call
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Send Message
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={initializePeerTutoring}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Find Available Tutors
                </button>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {activePeers.map((peer) => (
                    <div key={peer.id} className="p-4 bg-white shadow rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-6 w-6 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{peer.name}</h4>
                          <p className="text-sm text-gray-500">{peer.subject}</p>
                          <p className="text-sm text-yellow-600">★ {peer.rating}</p>
                        </div>
                      </div>
                      <button 
                        className="mt-3 w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                        onClick={() => connectWithPeer(peer)}
                      >
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );

      case 'careerGuidance':
        return getCareerGuidanceContent();

      case 'adaptiveLearning':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium">Current Level: {learningLevel}</h3>
              <p className="text-sm text-purple-600">{getLevelDescription(learningLevel)}</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${(learningLevel / 5) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.floor((learningLevel / 5) * 100)}% to mastery
              </p>
            </div>
            
            {!selectedQuestion ? (
              <div className="grid grid-cols-1 gap-4">
                {getFilteredQuestions().map((question) => (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      question.completed
                        ? 'bg-green-100 hover:bg-green-200'
                        : 'bg-white hover:bg-gray-50'
                    } shadow`}
                    onClick={() => {
                      setSelectedQuestion(question);
                      setSelectedAnswer(null);
                      setShowExplanation(false);
                      speak(question.question);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Question {question.id}</h4>
                        <p className="text-sm text-gray-600">
                          Difficulty: {question.difficulty}/5 • {question.category}
                        </p>
                      </div>
                      {question.completed && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-purple-600">
                    Level {selectedQuestion.difficulty} • {selectedQuestion.category}
                  </span>
                  <span className="text-sm text-gray-500">
                    Question {selectedQuestion.id}
                  </span>
                </div>
                <h4 className="text-lg font-medium mb-4">{selectedQuestion.question}</h4>
                <div className="space-y-3">
                  {selectedQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      className={`w-full p-3 text-left rounded-md transition-colors ${
                        selectedAnswer === index
                          ? showExplanation
                            ? index === selectedQuestion.correctAnswer
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        setSelectedAnswer(index);
                        speak(option);
                      }}
                      disabled={showExplanation}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {selectedAnswer !== null && !showExplanation && (
                  <button
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    onClick={() => {
                      handleQuestionSubmit();
                      speak(
                        selectedAnswer === selectedQuestion.correctAnswer
                          ? "Correct! " + selectedQuestion.explanation
                          : "Incorrect. " + selectedQuestion.explanation
                      );
                    }}
                  >
                    Submit Answer
                  </button>
                )}
                
                {showExplanation && (
                  <div className={`mt-4 p-4 rounded-md ${
                    selectedAnswer === selectedQuestion.correctAnswer
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    <h5 className="font-medium mb-2">
                      {selectedAnswer === selectedQuestion.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </h5>
                    <p>{selectedQuestion.explanation}</p>
                    <button
                      className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      onClick={() => setSelectedQuestion(null)}
                    >
                      Back to Questions
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'gkQuiz':
        return getGkQuizContent();

      default:
        return <p>No feature content available.</p>;
    }
  };

  const features: Feature[] = [
    {
      icon: Mic,
      key: 'voiceLearning',
      action: () => setSelectedFeature('voiceLearning'),
      isActive: isVoiceActive,
    },
    {
      icon: Wifi,
      key: 'offlineAccess',
      action: () => setSelectedFeature('offlineAccess'),
      isActive: isOffline,
    },
    {
      icon: Users,
      key: 'peerTutoring',
      action: () => setSelectedFeature('peerTutoring'),
    },
    {
      icon: Compass,
      key: 'careerGuidance',
      action: () => setSelectedFeature('careerGuidance'),
    },
    {
      icon: Brain,
      key: 'adaptiveLearning',
      action: () => setSelectedFeature('adaptiveLearning'),
    },
    {
      icon: BookText,
      key: 'gkQuiz',
      action: () => setSelectedFeature('gkQuiz'),
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.key}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer"
              onClick={() => feature.action()}
            >
              <feature.icon
                className={`h-10 w-10 ${
                  feature.isActive ? 'text-green-600' : 'text-indigo-600'
                } mb-4`}
              />
              <h3 className="text-lg font-medium text-gray-900">
                {t(`${featureTranslations[feature.key]}.title`)}
              </h3>
              <p className="text-gray-600">
                {t(`${featureTranslations[feature.key]}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={selectedFeature !== null}
        onClose={() => setSelectedFeature(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="max-w-lg mx-auto bg-white rounded-lg shadow relative">
            <div className="flex justify-between items-start p-6">
              <Dialog.Title className="text-2xl font-medium text-gray-900">
                {selectedFeature && t(`${featureTranslations[selectedFeature]}.title`)}
              </Dialog.Title>
              <button
                onClick={() => setSelectedFeature(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <button
              onClick={() => handleDialogScroll('up')}
              className="absolute top-20 right-6 z-10 p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200 transition"
            >
              <ChevronUp className="h-5 w-5 text-gray-700" />
            </button>
            
            <div 
              ref={setDialogContentRef}
              className="px-6 pb-6 max-h-[70vh] overflow-y-auto"
            >
              {selectedFeature && getFeatureContent(selectedFeature)}
            </div>
            
            <button
              onClick={() => handleDialogScroll('down')}
              className="absolute bottom-16 right-6 z-10 p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200 transition"
            >
              <ChevronDown className="h-5 w-5 text-gray-700" />
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </section>
  );
}