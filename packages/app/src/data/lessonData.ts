interface Exercise {
  id: number;
  type: "multiple_choice" | "fill_blank" | "word_builder" | "audio_recognition";
  hasAudio?: boolean;
}

interface MultipleChoiceExercise extends Exercise {
  type: "multiple_choice";
  question: string;
  answers: string[];
  correct: number;
  hasAudio?: boolean;
}

interface FillBlankExercise extends Exercise {
  type: "fill_blank";
  sentence: string;
  correctAnswer: string;
  hasAudio?: boolean;
}

interface WordBuilderExercise extends Exercise {
  type: "word_builder";
  prompt: string;
  words: string[];
  correctOrder: number[];
  hasAudio?: boolean;
}

interface AudioRecognitionExercise extends Exercise {
  type: "audio_recognition";
  audioText: string;
  question: string;
  answers: string[];
  correct: number;
  hasAudio: boolean;
}

export type LessonExercise = MultipleChoiceExercise | FillBlankExercise | WordBuilderExercise | AudioRecognitionExercise;

export const cefrLevels: Record<string, {
  level: string;
  description: string;
  lessons: Record<string, { title: string; exercises: LessonExercise[] }>
}> = {
  // A1 - Beginner Level
  "A1": {
    level: "A1 - Beginner",
    description: "Basic User - Can understand and use familiar everyday expressions",
    lessons: {
      "1": {
        title: "Greetings & Introductions",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What is the correct greeting for the morning?",
            answers: ["Good morning", "Good evening", "Good night", "Good afternoon"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Hello, my _____ is John.",
            correctAnswer: "name",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Create a self-introduction:",
            words: ["I", "am", "from", "Canada"],
            correctOrder: [0, 1, 2, 3],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "How do you respond to 'Nice to meet you'?",
            answers: ["Nice to meet you too", "Thank you", "Goodbye", "Hello"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Nice to meet you",
            question: "What did you hear?",
            answers: [
              "Nice to meet you",
              "Nice to see you",
              "Nice to greet you",
              "Nice to know you"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "2": {
        title: "Numbers & Time",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What time is 3:30?",
            answers: ["Three thirty", "Three thirteen", "Thirty three", "Three o'three"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "I wake up at seven _____.",
            correctAnswer: "o'clock",
            hasAudio: false
          },
          {
            id: 3,
            type: "audio_recognition",
            audioText: "It's quarter past five",
            question: "What time was mentioned?",
            answers: [
              "5:15",
              "5:45",
              "4:15",
              "5:30"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 4,
            type: "word_builder",
            prompt: "Ask about the time:",
            words: ["What", "time", "is", "it"],
            correctOrder: [0, 1, 2, 3],
            hasAudio: false
          },
          {
            id: 5,
            type: "multiple_choice",
            question: "How do you say '25' in English?",
            answers: ["Twenty-five", "Two-five", "Twenty and five", "Twice five"],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "3": {
        title: "Family & Relationships",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "Your mother's sister is your:",
            answers: ["Aunt", "Uncle", "Cousin", "Niece"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "I have two _____: a boy and a girl.",
            correctAnswer: "children",
            hasAudio: false
          },
          {
            id: 3,
            type: "multiple_choice",
            question: "Who is your father's brother?",
            answers: ["Uncle", "Aunt", "Cousin", "Nephew"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 4,
            type: "word_builder",
            prompt: "Describe your family:",
            words: ["My", "family", "is", "big"],
            correctOrder: [0, 1, 2, 3],
            hasAudio: false
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "This is my brother Tom",
            question: "Who was introduced?",
            answers: [
              "Brother Tom",
              "Father Tom",
              "Friend Tom",
              "Cousin Tom"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "4": {
        title: "Colors & Descriptions",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What color is typically associated with apples?",
            answers: ["Red", "Blue", "Purple", "Orange"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The sky is _____.",
            correctAnswer: "blue",
            hasAudio: false
          },
          {
            id: 3,
            type: "multiple_choice",
            question: "What color do you get when you mix red and white?",
            answers: ["Pink", "Purple", "Orange", "Brown"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 4,
            type: "word_builder",
            prompt: "Describe an object:",
            words: ["The", "car", "is", "black"],
            correctOrder: [0, 1, 2, 3],
            hasAudio: false
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "She has long blonde hair",
            question: "What hair color was mentioned?",
            answers: [
              "Blonde",
              "Brown",
              "Black",
              "Red"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "5": {
        title: "Daily Activities",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What do you do in the morning?",
            answers: ["Wake up", "Go to sleep", "Have dinner", "Watch TV"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "I _____ breakfast at 8 AM.",
            correctAnswer: "have",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Describe your morning routine:",
            words: ["I", "brush", "my", "teeth"],
            correctOrder: [0, 1, 2, 3],
            hasAudio: false
          },
          {
            id: 4,
            type: "fill_blank",
            sentence: "At night, I _____ to bed.",
            correctAnswer: "go",
            hasAudio: false
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "I go to bed at ten o'clock",
            question: "What time does the person sleep?",
            answers: [
              "10:00",
              "9:00",
              "11:00",
              "12:00"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "6": {
        title: "Food & Drinks",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What is a common breakfast food?",
            answers: ["Eggs", "Pizza", "Steak", "Ice cream"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "I'm thirsty. I need some _____.",
            correctAnswer: "water",
            hasAudio: false
          },
          {
            id: 3,
            type: "multiple_choice",
            question: "Which is a hot drink?",
            answers: ["Coffee", "Juice", "Milk", "Soda"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 4,
            type: "word_builder",
            prompt: "Order food politely:",
            words: ["I", "would", "like", "pizza"],
            correctOrder: [0, 1, 2, 3],
            hasAudio: false
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Can I have a cup of tea please",
            question: "What drink was ordered?",
            answers: [
              "Tea",
              "Coffee",
              "Water",
              "Juice"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "7": {
        title: "Places & Directions",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "Where do you buy food?",
            answers: ["Supermarket", "Library", "Hospital", "School"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The bank is _____ the post office.",
            correctAnswer: "next to",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Ask for directions:",
            words: ["Where", "is", "the", "station"],
            correctOrder: [0, 1, 2, 3],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Where do students go to learn?",
            answers: ["School", "Restaurant", "Cinema", "Shop"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Turn left at the traffic lights",
            question: "Which direction was given?",
            answers: [
              "Turn left",
              "Turn right",
              "Go straight",
              "Turn around"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "8": {
        title: "Present Simple",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "Choose the correct form: 'She _____ to school.'",
            answers: ["goes", "go", "going", "gone"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "They _____ football every Sunday.",
            correctAnswer: "play",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Make a negative sentence:",
            words: ["I", "don't", "like", "coffee"],
            correctOrder: [0, 1, 2, 3],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which is correct?",
            answers: ["He works in a bank", "He work in a bank", "He working in a bank", "He is work in a bank"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Does she speak English",
            question: "What type of sentence is this?",
            answers: [
              "Question",
              "Statement",
              "Negative",
              "Command"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "9": {
        title: "Can/Can't - Abilities",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "Which sentence is correct?",
            answers: ["I can swim", "I can to swim", "I can swimming", "I cans swim"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "She _____ speak three languages.",
            correctAnswer: "can",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Make a sentence about inability:",
            words: ["He", "can't", "drive", "a", "car"],
            correctOrder: [0, 1, 2, 3, 4],
            hasAudio: false
          },
          {
            id: 4,
            type: "fill_blank",
            sentence: "_____ you play the piano?",
            correctAnswer: "Can",
            hasAudio: false
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Can you help me please",
            question: "What is being asked?",
            answers: [
              "For help",
              "For directions",
              "For money",
              "For food"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "10": {
        title: "There is/There are",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "_____ a book on the table.",
            answers: ["There is", "There are", "There have", "There has"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "_____ many students in the classroom.",
            correctAnswer: "There are",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Describe what's in your room:",
            words: ["There", "is", "a", "bed"],
            correctOrder: [0, 1, 2, 3],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Is there a problem?",
            answers: ["No, there isn't", "No, there aren't", "No, there haven't", "No, there hasn't"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "There are two cats in the garden",
            question: "How many cats are there?",
            answers: [
              "Two",
              "One",
              "Three",
              "Four"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      }
    }
  },

  // A2 - Elementary Level
  "A2": {
    level: "A2 - Elementary",
    description: "Basic User - Can communicate in simple and routine tasks",
    lessons: {
      "1": {
        title: "Past Simple",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What is the past form of 'go'?",
            answers: ["went", "goed", "gone", "going"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Yesterday, I _____ to the cinema.",
            correctAnswer: "went",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Make a past simple sentence:",
            words: ["She", "visited", "her", "grandmother", "last", "week"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which is the correct negative form?",
            answers: ["I didn't go", "I didn't went", "I don't went", "I not went"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Did you see the movie last night",
            question: "What tense is being used?",
            answers: [
              "Past simple",
              "Present simple",
              "Future simple",
              "Present perfect"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "2": {
        title: "Present Continuous",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What are you doing now?",
            answers: ["I am studying", "I studying", "I study", "I studies"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Look! The children _____ in the garden.",
            correctAnswer: "are playing",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Describe an action happening now:",
            words: ["He", "is", "reading", "a", "book"],
            correctOrder: [0, 1, 2, 3, 4],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which shows an action happening now?",
            answers: ["I am running", "I run", "I ran", "I will run"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "She's working from home today",
            question: "Where is she working?",
            answers: [
              "From home",
              "In the office",
              "At school",
              "In a cafe"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "3": {
        title: "Comparatives & Superlatives",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "This book is _____ than that one.",
            answers: ["better", "gooder", "more good", "best"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "She is the _____ student in class.",
            correctAnswer: "best",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Compare two things:",
            words: ["My", "car", "is", "faster", "than", "yours"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which is the superlative of 'big'?",
            answers: ["biggest", "most big", "bigger", "bigest"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "This is the most expensive restaurant in town",
            question: "What is being described?",
            answers: [
              "The most expensive restaurant",
              "A cheap restaurant",
              "An average restaurant",
              "The newest restaurant"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "4": {
        title: "Going to - Future Plans",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What are you going to do tomorrow?",
            answers: ["I'm going to study", "I going to study", "I go to study", "I will going study"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "They _____ going to travel next month.",
            correctAnswer: "are",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Make a future plan:",
            words: ["We", "are", "going", "to", "visit", "Paris"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Is he going to call you?",
            answers: ["Yes, he is", "Yes, he will", "Yes, he going", "Yes, he does"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "I'm going to start a new job next week",
            question: "When is the person starting the job?",
            answers: [
              "Next week",
              "This week",
              "Next month",
              "Tomorrow"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "5": {
        title: "Countable/Uncountable Nouns",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "How _____ water do you need?",
            answers: ["much", "many", "lot", "few"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "I don't have _____ money.",
            correctAnswer: "much",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Ask about quantity:",
            words: ["How", "many", "apples", "do", "you", "want"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which is uncountable?",
            answers: ["Rice", "Apple", "Book", "Chair"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "fill_blank",
            sentence: "There isn't _____ sugar in my coffee.",
            correctAnswer: "any",
            hasAudio: false
          }
        ]
      },
      "6": {
        title: "Modal Verbs - Should/Must",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "You _____ see a doctor if you're sick.",
            answers: ["should", "shouldn't", "shall", "shoulds"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "You _____ wear a seatbelt in the car.",
            correctAnswer: "must",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Give advice:",
            words: ["You", "should", "exercise", "more", "often"],
            correctOrder: [0, 1, 2, 3, 4],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which expresses obligation?",
            answers: ["You must stop", "You should stop", "You could stop", "You might stop"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "You shouldn't eat so much junk food",
            question: "What advice was given?",
            answers: [
              "Don't eat junk food",
              "Eat more junk food",
              "Buy junk food",
              "Cook junk food"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "7": {
        title: "Daily Routines & Habits",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "How often do you exercise?",
            answers: ["Twice a week", "Two a week", "Two times week", "Twice in week"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "I always _____ coffee in the morning.",
            correctAnswer: "drink",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Describe a daily habit:",
            words: ["She", "usually", "goes", "jogging", "before", "work"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "fill_blank",
            sentence: "He _____ brushes his teeth before bed.",
            correctAnswer: "always",
            hasAudio: false
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "I never skip breakfast",
            question: "How often does the person skip breakfast?",
            answers: [
              "Never",
              "Sometimes",
              "Always",
              "Often"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "8": {
        title: "Shopping & Money",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "How much does it _____?",
            answers: ["cost", "costing", "costs", "costed"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Can I pay by credit _____?",
            correctAnswer: "card",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Ask about price:",
            words: ["How", "much", "is", "this", "shirt"],
            correctOrder: [0, 1, 2, 3, 4],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Where is the _____? I need to pay.",
            answers: ["cashier", "kitchen", "bathroom", "entrance"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "That'll be fifteen pounds fifty please",
            question: "How much is the total?",
            answers: [
              "£15.50",
              "£50.15",
              "£15.15",
              "£50.50"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "9": {
        title: "Travel & Transport",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "The train _____ at 3:00 PM.",
            answers: ["leaves", "leave", "leaving", "left"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "I need to book a _____ to Paris.",
            correctAnswer: "flight",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Ask about transportation:",
            words: ["Which", "platform", "is", "the", "train", "on"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "fill_blank",
            sentence: "The bus is late. We've been _____ for 20 minutes.",
            correctAnswer: "waiting",
            hasAudio: false
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The next bus arrives in ten minutes",
            question: "When does the bus arrive?",
            answers: [
              "In 10 minutes",
              "In 5 minutes",
              "In 15 minutes",
              "In 20 minutes"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "10": {
        title: "Weather & Seasons",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "What's the weather like today?",
            answers: ["It's sunny", "It sunny", "Is sunny", "The sunny"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "It's _____ heavily outside.",
            correctAnswer: "raining",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Describe the weather:",
            words: ["It", "will", "be", "cloudy", "tomorrow"],
            correctOrder: [0, 1, 2, 3, 4],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which season has snow?",
            answers: ["Winter", "Summer", "Spring", "Autumn"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Take an umbrella, it might rain later",
            question: "What weather is expected?",
            answers: [
              "Rain",
              "Snow",
              "Sun",
              "Wind"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      }
    }
  },

  // B1 - Intermediate Level
  "B1": {
    level: "B1 - Intermediate",
    description: "Independent User - Can deal with most situations while travelling",
    lessons: {
      "1": {
        title: "Present Perfect",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "I _____ been to Japan twice.",
            answers: ["have", "has", "had", "having"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "She has _____ finished her homework.",
            correctAnswer: "already",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Create a present perfect sentence:",
            words: ["They", "have", "lived", "here", "for", "ten", "years"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Have you ever _____ sushi?",
            answers: ["eaten", "ate", "eat", "eating"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "I've just received your email",
            question: "When did they receive the email?",
            answers: [
              "Just now",
              "Yesterday",
              "Last week",
              "Tomorrow"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "2": {
        title: "First Conditional",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "If it rains, I _____ stay at home.",
            answers: ["will", "would", "am", "do"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "If you study hard, you _____ pass the exam.",
            correctAnswer: "will",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Make a first conditional sentence:",
            words: ["If", "you", "don't", "hurry", "you'll", "miss", "the", "bus"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What happens if you don't water plants?",
            answers: ["They will die", "They would die", "They die", "They died"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "If the weather is nice, we'll have a picnic",
            question: "What's the condition for the picnic?",
            answers: [
              "Nice weather",
              "Bad weather",
              "Free time",
              "Food available"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "3": {
        title: "Phrasal Verbs",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "Please turn _____ the lights when you leave.",
            answers: ["off", "of", "out", "on"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "I need to look _____ this word in the dictionary.",
            correctAnswer: "up",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Use a phrasal verb:",
            words: ["Can", "you", "pick", "me", "up", "at", "eight"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What does 'give up' mean?",
            answers: ["Stop trying", "Start trying", "Continue", "Begin"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "I ran into an old friend yesterday",
            question: "What happened yesterday?",
            answers: [
              "Met someone unexpectedly",
              "Had an accident",
              "Went running",
              "Lost a friend"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "4": {
        title: "Modal Verbs - Advice & Obligation",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "You _____ to see a dentist about that tooth.",
            answers: ["ought", "should", "must", "might"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Students _____ wear uniforms at this school.",
            correctAnswer: "have to",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Give strong advice:",
            words: ["You", "really", "should", "quit", "smoking"],
            correctOrder: [0, 1, 2, 3, 4],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which shows no obligation?",
            answers: ["You don't have to come", "You must come", "You have to come", "You should come"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "You'd better take an umbrella",
            question: "What's being advised?",
            answers: [
              "Take an umbrella",
              "Leave the umbrella",
              "Buy an umbrella",
              "Forget the umbrella"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "5": {
        title: "Relative Clauses",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "The man _____ lives next door is a doctor.",
            answers: ["who", "which", "where", "when"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "This is the book _____ I was telling you about.",
            correctAnswer: "that",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Join two sentences with a relative clause:",
            words: ["The", "woman", "who", "called", "you", "is", "my", "sister"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "The place _____ we met was beautiful.",
            answers: ["where", "which", "who", "when"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The car that I bought last week has broken down",
            question: "When was the car bought?",
            answers: [
              "Last week",
              "Yesterday",
              "Last month",
              "Today"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "6": {
        title: "Passive Voice",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "The letter _____ sent yesterday.",
            answers: ["was", "is", "has", "had"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "English _____ spoken all over the world.",
            correctAnswer: "is",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Change to passive voice:",
            words: ["The", "book", "was", "written", "by", "Shakespeare"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which is passive?",
            answers: ["The car was repaired", "He repaired the car", "He repairs cars", "The car needs repair"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The meeting has been cancelled",
            question: "What happened to the meeting?",
            answers: [
              "It was cancelled",
              "It was postponed",
              "It started",
              "It finished"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "7": {
        title: "Work & Career",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "I'm looking for a new _____.",
            answers: ["job", "work", "works", "jobs"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "She got a _____ last month. Now she earns more.",
            correctAnswer: "promotion",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Talk about work experience:",
            words: ["I've", "been", "working", "here", "since", "2019"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "fill_blank",
            sentence: "He was _____ from his job last week.",
            correctAnswer: "fired",
            hasAudio: false
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "I'm applying for the marketing position",
            question: "What position is mentioned?",
            answers: [
              "Marketing",
              "Sales",
              "Finance",
              "IT"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "8": {
        title: "Health & Fitness",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "You should _____ regularly to stay healthy.",
            answers: ["exercise", "exercises", "exercising", "exercised"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "I've been feeling _____ all week. I think I have the flu.",
            correctAnswer: "sick",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Give health advice:",
            words: ["You", "should", "eat", "more", "vegetables", "and", "fruits"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What do you take when you have a headache?",
            answers: ["Painkillers", "Vitamins", "Antibiotics", "Bandages"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "I've joined a gym to get in shape",
            question: "Why did they join a gym?",
            answers: [
              "To get fit",
              "To meet people",
              "To relax",
              "To work"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "9": {
        title: "Environment",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "We should _____ more to protect the environment.",
            answers: ["recycle", "throw away", "waste", "pollute"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Global _____ is causing climate change.",
            correctAnswer: "warming",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Discuss environmental issues:",
            words: ["We", "need", "to", "reduce", "plastic", "pollution"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "fill_blank",
            sentence: "Many animals are becoming _____ due to habitat loss.",
            correctAnswer: "extinct",
            hasAudio: false
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Many species are becoming extinct due to deforestation",
            question: "What's causing extinction?",
            answers: [
              "Deforestation",
              "Overpopulation",
              "Technology",
              "Education"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "10": {
        title: "Used to",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "I _____ smoke, but I quit last year.",
            answers: ["used to", "use to", "was used to", "am used to"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "She _____ to live in London before moving here.",
            correctAnswer: "used",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Talk about past habits:",
            words: ["We", "used", "to", "go", "camping", "every", "summer"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Did you use to play football?",
            answers: ["Yes, I did", "Yes, I used", "Yes, I use", "Yes, I was"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "This building used to be a factory",
            question: "What was the building before?",
            answers: [
              "A factory",
              "An office",
              "A school",
              "A hospital"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      }
    }
  },

  // B2 - Upper Intermediate Level
  "B2": {
    level: "B2 - Upper Intermediate",
    description: "Independent User - Can interact with native speakers with fluency",
    lessons: {
      "1": {
        title: "Mixed Conditionals",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "If I _____ harder at school, I would have a better job now.",
            answers: ["had studied", "studied", "have studied", "study"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "If she were more confident, she _____ have got the job.",
            correctAnswer: "would",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Create a mixed conditional:",
            words: ["If", "I", "hadn't", "missed", "the", "train", "I", "would", "be", "there", "now"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which mixes past and present?",
            answers: [
              "If I had saved money, I would be rich now",
              "If I save money, I will be rich",
              "If I saved money, I would be rich",
              "If I had saved money, I would have been rich"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "If he weren't so lazy, he would have finished the project",
            question: "Why didn't he finish?",
            answers: [
              "He's lazy",
              "No time",
              "Too difficult",
              "Not interested"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "2": {
        title: "Narrative Tenses",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "While I _____ to work, I saw an accident.",
            answers: ["was driving", "drove", "had driven", "have driven"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "After she _____ finished cooking, the guests arrived.",
            correctAnswer: "had",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Tell a story using narrative tenses:",
            words: ["I", "had", "been", "waiting", "for", "hours", "when", "she", "finally", "arrived"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which shows completed action before another past action?",
            answers: ["had left", "was leaving", "left", "has left"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The movie had already started when we got to the cinema",
            question: "What happened first?",
            answers: [
              "Movie started",
              "They arrived",
              "Cinema opened",
              "Tickets bought"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "3": {
        title: "Reported Speech",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "She said she _____ me tomorrow.",
            answers: ["would call", "will call", "calls", "is calling"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "He told me that he _____ been to Paris before.",
            correctAnswer: "had",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Report what someone said:",
            words: ["She", "asked", "me", "if", "I", "could", "help", "her"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "\"I'm tired\" becomes:",
            answers: ["He said he was tired", "He said I am tired", "He says he is tired", "He said he is tired"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "They told us they would be late",
            question: "What did they say directly?",
            answers: [
              "We will be late",
              "You will be late",
              "They are late",
              "We were late"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "4": {
        title: "Advanced Modal Verbs",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "He _____ have forgotten. He never forgets anything.",
            answers: ["can't", "mustn't", "shouldn't", "needn't"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "You _____ have told me earlier! Now it's too late.",
            correctAnswer: "should",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Express past possibility:",
            words: ["She", "might", "have", "missed", "the", "announcement"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which expresses past criticism?",
            answers: [
              "You should have studied",
              "You must study",
              "You had to study",
              "You will study"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "They must have left early to avoid traffic",
            question: "What's the speaker's conclusion?",
            answers: [
              "They left early",
              "They're in traffic",
              "They're late",
              "They didn't leave"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "5": {
        title: "Wish & If Only",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "I wish I _____ more languages.",
            answers: ["spoke", "speak", "speaking", "have spoken"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "If only I _____ listened to your advice!",
            correctAnswer: "had",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Express a regret:",
            words: ["I", "wish", "I", "hadn't", "sold", "my", "car"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which expresses regret about the past?",
            answers: [
              "I wish I had studied harder",
              "I wish I studied harder",
              "I wish I study harder",
              "I wish I will study harder"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "If only it would stop raining",
            question: "What's the current situation?",
            answers: [
              "It's raining",
              "It's sunny",
              "It's snowing",
              "It's windy"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "6": {
        title: "Business English",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "We need to _____ the deadline.",
            answers: ["meet", "make", "do", "take"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The company is planning to _____ its operations overseas.",
            correctAnswer: "expand",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Discuss business strategy:",
            words: ["We", "should", "consider", "diversifying", "our", "product", "portfolio"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What's a hostile takeover?",
            answers: [
              "Unwanted company acquisition",
              "Friendly merger",
              "Stock split",
              "Bankruptcy"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "We need to streamline our processes to increase efficiency",
            question: "What's the goal?",
            answers: [
              "Increase efficiency",
              "Hire more staff",
              "Reduce prices",
              "Close departments"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "7": {
        title: "Media & Technology",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "The latest software _____ includes several bug fixes.",
            answers: ["update", "upload", "download", "install"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Social media has _____ the way we communicate.",
            correctAnswer: "transformed",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Discuss technology impact:",
            words: ["Artificial", "intelligence", "is", "revolutionizing", "many", "industries"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "fill_blank",
            sentence: "The data is stored in the _____.",
            correctAnswer: "cloud",
            hasAudio: false
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The algorithm uses machine learning to predict user behavior",
            question: "What technology is mentioned?",
            answers: [
              "Machine learning",
              "Virtual reality",
              "Blockchain",
              "Quantum computing"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "8": {
        title: "Abstract Topics - Society",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "Income _____ is a growing concern in many countries.",
            answers: ["inequality", "equality", "equation", "equivalent"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The government is implementing policies to combat _____.",
            correctAnswer: "discrimination",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Discuss social issues:",
            words: ["Social", "mobility", "has", "decreased", "in", "recent", "decades"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What is gentrification?",
            answers: [
              "Urban area improvement displacing residents",
              "Rural development",
              "Population decline",
              "Industrial growth"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Cultural diversity enriches our society",
            question: "What enriches society?",
            answers: [
              "Cultural diversity",
              "Economic growth",
              "Technology",
              "Education"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "9": {
        title: "Advanced Passive",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "It _____ that the meeting will be postponed.",
            answers: ["is believed", "believes", "is believing", "has believed"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "She is said _____ very wealthy.",
            correctAnswer: "to be",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Use passive reporting:",
            words: ["The", "president", "is", "expected", "to", "announce", "new", "policies"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which uses passive reporting?",
            answers: [
              "He is thought to be guilty",
              "They think he is guilty",
              "He thinks about guilt",
              "Guilty thoughts occur"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The suspect is alleged to have committed fraud",
            question: "What's the accusation?",
            answers: [
              "Fraud",
              "Theft",
              "Murder",
              "Assault"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "10": {
        title: "Future Forms",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "By next year, I _____ here for ten years.",
            answers: ["will have worked", "will work", "am working", "work"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "This time tomorrow, we _____ flying to Paris.",
            correctAnswer: "will be",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Express future completion:",
            words: ["They", "will", "have", "finished", "the", "project", "by", "Friday"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which expresses ongoing future action?",
            answers: [
              "I'll be studying",
              "I'll study",
              "I'll have studied",
              "I study"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The train is due to arrive at platform three",
            question: "Where will the train arrive?",
            answers: [
              "Platform 3",
              "Platform 2",
              "Platform 4",
              "Platform 1"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      }
    }
  },

  // C1 - Advanced Level
  "C1": {
    level: "C1 - Advanced",
    description: "Proficient User - Can use language flexibly and effectively",
    lessons: {
      "1": {
        title: "Inversion",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "Never _____ such a beautiful sunset.",
            answers: ["have I seen", "I have seen", "I saw", "did I saw"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Not only _____ he arrive late, but he also forgot the documents.",
            correctAnswer: "did",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Use inversion for emphasis:",
            words: ["Rarely", "have", "we", "encountered", "such", "a", "complex", "problem"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which uses correct inversion?",
            answers: [
              "Little did she know",
              "Little she did know",
              "She did know little",
              "Did she little know"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Under no circumstances should you reveal this information",
            question: "What shouldn't you do?",
            answers: [
              "Reveal information",
              "Hide information",
              "Find information",
              "Check information"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "2": {
        title: "Cleft Sentences",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "_____ was John who broke the window.",
            answers: ["It", "That", "This", "What"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "What I really need _____ a vacation.",
            correctAnswer: "is",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Create emphasis with a cleft sentence:",
            words: ["It", "was", "the", "manager", "who", "made", "the", "decision"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "_____ I don't understand is why he left.",
            answers: ["What", "That", "Which", "It"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "It's the dedication that makes her successful",
            question: "What makes her successful?",
            answers: [
              "Dedication",
              "Luck",
              "Money",
              "Connections"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "3": {
        title: "Participle Clauses",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "_____ finished the report, she went home.",
            answers: ["Having", "Have", "Had", "Has"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "_____ in 1990, the company has grown rapidly.",
            correctAnswer: "Founded",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Use a participle clause:",
            words: ["Walking", "through", "the", "park", "I", "noticed", "the", "changes"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which is a participle clause?",
            answers: [
              "Seen from above",
              "When seen from above",
              "It is seen from above",
              "To see from above"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Not knowing what to do, he asked for help",
            question: "Why did he ask for help?",
            answers: [
              "Didn't know what to do",
              "Was told to",
              "Wanted attention",
              "Was required"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "4": {
        title: "Subjunctive",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "I suggest that he _____ more careful.",
            answers: ["be", "is", "will be", "being"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "It's vital that she _____ the meeting.",
            correctAnswer: "attend",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Use the subjunctive:",
            words: ["I", "recommend", "that", "he", "study", "harder"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "If I _____ you, I'd accept the offer.",
            answers: ["were", "was", "am", "be"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The board insisted that the policy be changed immediately",
            question: "What did the board want?",
            answers: [
              "Policy change",
              "Meeting postponed",
              "Budget increase",
              "Staff reduction"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "5": {
        title: "Academic English",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "The findings _____ previous research in this field.",
            answers: ["corroborate", "collaborate", "cooperate", "coordinate"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The hypothesis was _____ through empirical testing.",
            correctAnswer: "validated",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Write academically:",
            words: ["The", "data", "suggests", "a", "significant", "correlation", "between", "variables"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What's a literature review?",
            answers: [
              "Analysis of existing research",
              "Book summary",
              "Novel critique",
              "Poetry analysis"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The methodology employed was both rigorous and innovative",
            question: "How was the methodology described?",
            answers: [
              "Rigorous and innovative",
              "Simple and basic",
              "Complex and outdated",
              "Quick and easy"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "6": {
        title: "Complex Arguments",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "_____ the evidence suggests otherwise, the theory persists.",
            answers: ["Although", "Despite", "However", "Nevertheless"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The argument is _____ on several false assumptions.",
            correctAnswer: "predicated",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Present a counterargument:",
            words: ["While", "this", "may", "be", "true", "one", "must", "consider"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which introduces a concession?",
            answers: [
              "Granted that",
              "Because of",
              "Due to",
              "Resulting in"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Notwithstanding these limitations, the results remain significant",
            question: "What's said about the results?",
            answers: [
              "They're still significant",
              "They're limited",
              "They're insignificant",
              "They're questionable"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "7": {
        title: "Emphasis & Fronting",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "_____ did I expect such a response.",
            answers: ["Little", "Few", "Small", "Tiny"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Such _____ the demand that we sold out immediately.",
            correctAnswer: "was",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Front for emphasis:",
            words: ["Important", "though", "it", "is", "we", "cannot", "ignore", "costs"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "_____ the bell rang than students rushed out.",
            answers: ["No sooner had", "No sooner did", "No sooner was", "No sooner has"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "So complex was the problem that experts were baffled",
            question: "How was the problem?",
            answers: [
              "Very complex",
              "Quite simple",
              "Easily solved",
              "Well understood"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "8": {
        title: "Advanced Collocations",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "The company faced _____ competition.",
            answers: ["stiff", "hard", "strong", "heavy"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "She has a _____ grasp of the subject.",
            correctAnswer: "firm",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Use advanced collocations:",
            words: ["The", "proposal", "met", "with", "fierce", "opposition"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which collocation is correct?",
            answers: [
              "Heated debate",
              "Hot debate",
              "Warm debate",
              "Burning debate"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The decision sparked widespread controversy",
            question: "What did the decision cause?",
            answers: [
              "Widespread controversy",
              "General agreement",
              "Minor discussion",
              "Complete silence"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "9": {
        title: "Register & Style",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "Which is most formal?",
            answers: ["I would appreciate your assistance", "Can you help me?", "Give me a hand", "Help!"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Please find _____ the requested documents. (formal)",
            correctAnswer: "attached",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Make this formal: 'Thanks for your help'",
            words: ["I", "am", "grateful", "for", "your", "assistance"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which register is inappropriate for a job interview?",
            answers: ["What's up?", "Good morning", "How do you do?", "Pleased to meet you"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "I'm afraid I must decline your kind invitation",
            question: "What's the speaker doing?",
            answers: [
              "Refusing politely",
              "Accepting happily",
              "Asking for help",
              "Making a complaint"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "10": {
        title: "Idiomatic Expressions",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "He's always _____ the boat out when celebrating.",
            answers: ["pushing", "pulling", "driving", "taking"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Let's not beat around the _____.",
            correctAnswer: "bush",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Use an idiom about success:",
            words: ["She's", "really", "going", "places", "in", "her", "career"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What does 'break the ice' mean?",
            answers: [
              "Start a conversation",
              "Destroy something",
              "Get angry",
              "Leave quickly"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "We need to think outside the box on this one",
            question: "What should they do?",
            answers: [
              "Be creative",
              "Follow rules",
              "Work harder",
              "Give up"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      }
    }
  },

  // C2 - Mastery Level
  "C2": {
    level: "C2 - Mastery",
    description: "Proficient User - Can understand virtually everything with ease",
    lessons: {
      "1": {
        title: "Nuanced Language",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "His argument was _____ flawed.",
            answers: ["fundamentally", "basically", "mainly", "mostly"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The implications are _____ far-reaching.",
            correctAnswer: "potentially",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Express subtle disagreement:",
            words: ["While", "I", "appreciate", "your", "perspective", "I'm", "inclined", "to", "disagree"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which expresses the most doubt?",
            answers: [
              "Purportedly",
              "Apparently",
              "Clearly",
              "Obviously"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The ostensibly neutral policy had underlying biases",
            question: "How did the policy appear?",
            answers: [
              "Neutral on surface",
              "Clearly biased",
              "Completely fair",
              "Obviously unfair"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "2": {
        title: "Literary Devices",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "\"The silence was deafening\" is an example of:",
            answers: ["Oxymoron", "Metaphor", "Simile", "Alliteration"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The _____ of her prose captivated readers.",
            correctAnswer: "eloquence",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Identify the literary device: Time flies",
            words: ["This", "metaphor", "personifies", "time", "as", "moving", "quickly"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What is synecdoche?",
            answers: [
              "Part representing whole",
              "Exaggeration",
              "Understatement",
              "Word repetition"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Her voice dripped with sarcasm",
            question: "What literary device is used?",
            answers: [
              "Metaphor",
              "Simile",
              "Alliteration",
              "Hyperbole"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "3": {
        title: "Professional Discourse",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "The _____ nature of the problem requires careful analysis.",
            answers: ["multifaceted", "simple", "basic", "easy"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "We must _____ all stakeholders before proceeding.",
            correctAnswer: "consult",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Express professional concern:",
            words: ["I", "have", "reservations", "about", "the", "feasibility", "of", "this", "approach"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which term means 'working together effectively'?",
            answers: ["Synergy", "Conflict", "Competition", "Isolation"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The paradigm shift necessitates organizational restructuring",
            question: "What requires restructuring?",
            answers: [
              "Paradigm shift",
              "Budget cuts",
              "Staff shortage",
              "Market decline"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "4": {
        title: "Cultural References",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "A 'Pyrrhic victory' means:",
            answers: ["Victory at great cost", "Easy victory", "Unexpected victory", "False victory"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "He faced a real _____ dilemma.",
            correctAnswer: "Catch-22",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Use a cultural reference:",
            words: ["It", "was", "his", "Achilles'", "heel", "that", "led", "to", "failure"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What does 'crossing the Rubicon' mean?",
            answers: [
              "Point of no return",
              "River crossing",
              "Roman history",
              "Military strategy"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "She opened Pandora's box with that question",
            question: "What did her question do?",
            answers: [
              "Created many problems",
              "Solved issues",
              "Closed discussion",
              "Found treasure"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "5": {
        title: "Rhetoric & Persuasion",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "Which rhetorical device uses three parallel elements?",
            answers: ["Tricolon", "Metaphor", "Anaphora", "Chiasmus"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The _____ of his argument was undeniable.",
            correctAnswer: "cogency",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Use rhetorical repetition:",
            words: ["We", "shall", "fight", "we", "shall", "defend", "we", "shall", "never", "surrender"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What is ethos in rhetoric?",
            answers: ["Credibility appeal", "Emotional appeal", "Logical appeal", "Time appeal"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "Ask not what your country can do for you",
            question: "What rhetorical device is this?",
            answers: [
              "Chiasmus",
              "Metaphor",
              "Hyperbole",
              "Alliteration"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "6": {
        title: "Philosophical Concepts",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "The _____ nature of truth has been debated for centuries.",
            answers: ["subjective", "simple", "obvious", "clear"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The _____ implications of AI are profound.",
            correctAnswer: "ethical",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Discuss existential concepts:",
            words: ["The", "absurdity", "of", "existence", "confronts", "us", "with", "fundamental", "questions"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What is epistemology?",
            answers: ["Study of knowledge", "Study of existence", "Study of ethics", "Study of logic"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The ontological argument presupposes existence",
            question: "What does the argument presuppose?",
            answers: [
              "Existence",
              "Knowledge",
              "Morality",
              "Logic"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "7": {
        title: "Linguistic Subtleties",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "The _____ distinction between the terms is crucial.",
            answers: ["subtle", "big", "small", "obvious"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Her use of _____ conveyed displeasure without direct criticism.",
            correctAnswer: "understatement",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Show linguistic awareness:",
            words: ["The", "connotations", "differ", "significantly", "from", "the", "denotations"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What is a euphemism?",
            answers: ["Mild expression for harsh reality", "Exaggeration", "Direct statement", "Technical term"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "His circumlocution avoided the contentious issue",
            question: "What did he avoid?",
            answers: [
              "The contentious issue",
              "The easy topic",
              "The main point",
              "The conclusion"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "8": {
        title: "Critical Analysis",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "The author's _____ undermines the argument.",
            answers: ["bias", "clarity", "precision", "accuracy"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The _____ of the evidence calls the conclusion into question.",
            correctAnswer: "paucity",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Critique methodology:",
            words: ["The", "sampling", "methodology", "exhibits", "inherent", "selection", "bias"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What is a non sequitur?",
            answers: ["Illogical conclusion", "Logical argument", "Valid inference", "Sound reasoning"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The specious reasoning masks fundamental flaws",
            question: "What does the reasoning hide?",
            answers: [
              "Fundamental flaws",
              "Strong evidence",
              "Clear logic",
              "Valid points"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "9": {
        title: "Sophisticated Humor",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "His _____ wit entertained the sophisticated audience.",
            answers: ["sardonic", "simple", "basic", "obvious"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "The _____ irony of the situation wasn't lost on anyone.",
            correctAnswer: "delicious",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Create sophisticated wordplay:",
            words: ["A", "modest", "proposal", "for", "preventing", "modesty"],
            correctOrder: [0, 1, 2, 3, 4, 5],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "What is self-deprecating humor?",
            answers: ["Making fun of oneself", "Insulting others", "Slapstick comedy", "Visual humor"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "His droll observations on bureaucracy amused everyone",
            question: "How were his observations?",
            answers: [
              "Amusingly odd",
              "Seriously critical",
              "Deeply offensive",
              "Completely boring"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
      "10": {
        title: "Mastery Integration",
        exercises: [
          {
            id: 1,
            type: "multiple_choice",
            question: "The _____ of perspectives enriched the discussion.",
            answers: ["confluence", "absence", "lack", "shortage"],
            correct: 0,
            hasAudio: true
          },
          {
            id: 2,
            type: "fill_blank",
            sentence: "Her _____ command of language impressed even native speakers.",
            correctAnswer: "consummate",
            hasAudio: false
          },
          {
            id: 3,
            type: "word_builder",
            prompt: "Demonstrate language mastery:",
            words: ["The", "ineffable", "quality", "of", "her", "prose", "transcends", "mere", "technical", "proficiency"],
            correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            hasAudio: false
          },
          {
            id: 4,
            type: "multiple_choice",
            question: "Which demonstrates highest language proficiency?",
            answers: [
              "Effortless code-switching between registers",
              "Perfect grammar",
              "Large vocabulary",
              "Clear pronunciation"
            ],
            correct: 0,
            hasAudio: true
          },
          {
            id: 5,
            type: "audio_recognition",
            audioText: "The perspicacious analysis revealed hitherto unnoticed patterns",
            question: "What did the analysis reveal?",
            answers: [
              "Previously unnoticed patterns",
              "Obvious connections",
              "Simple relationships",
              "Known facts"
            ],
            correct: 0,
            hasAudio: true
          }
        ]
      },
    }
  }
}