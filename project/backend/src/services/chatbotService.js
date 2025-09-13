const dialogflow = require('@google-cloud/dialogflow');

class ChatbotService {
  constructor() {
    this.sessionClient = null;
    this.projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'pm-internship-bot';
    this.isInitialized = false;
    
    // Role-specific intents and responses
    this.roleResponses = {
      applicant: {
        greeting: "Hello! I'm here to help you with your internship journey. I can assist with applications, profile completion, mentor connections, and career guidance.",
        apply: "To apply for internships: 1) Complete your profile with skills and documents 2) Browse recommended opportunities 3) Click 'Apply' on matching positions. The AI will show you the best matches!",
        profile: "Complete your profile by: 1) Adding skills and qualifications 2) Uploading required documents (marks memo, PAN, Aadhaar) 3) Setting location preferences. A complete profile gets 10x more matches!",
        mentor: "Connect with mentors by: 1) Going to 'Mentors' tab 2) Browse matched industry experts 3) Send connection requests. Mentors can guide your career path and interview preparation!",
        documents: "Required documents: 1) Marks Memo/Transcript (PDF) 2) PAN Card (image/PDF) 3) Aadhaar Card (image/PDF). All documents are verified using OCR and government databases.",
        gamification: "Earn points by: Completing profile (+50), Applying to internships (+10), Connecting with mentors (+20), Getting shortlisted (+100). Check your badges and leaderboard rank!"
      },
      recruiter: {
        greeting: "Welcome! I can help you post opportunities, review candidates, manage applications, and ensure compliance with diversity requirements.",
        post: "To post opportunities: 1) Go to 'Post Opportunity' 2) Fill in job details, skills required, location 3) Set slots and requirements. Our AI will automatically match qualified candidates!",
        candidates: "View matched candidates in your dashboard. Use filters for skills, location, experience. Each candidate has an AI-generated match score and explanation!",
        compliance: "Ensure diversity compliance: 15% SC, 7.5% ST, 27% OBC, 4% PwD, 33% women, 35% rural. The system automatically tracks and suggests balanced selections.",
        blockchain: "All allocations are recorded on Ethereum blockchain for transparency. View transaction hashes and verify allocations in the Blockchain tab."
      },
      mentor: {
        greeting: "Hello mentor! I can help you guide students, share career tips, schedule sessions, and track mentee progress.",
        mentees: "Your matched mentees appear in 'My Mentees' section. You can: 1) Schedule video calls 2) Share career tips 3) Track their progress 4) Provide feedback on applications.",
        tips: "Share tips in the community forum or directly with mentees. Popular topics: resume writing, interview skills, technical preparation, and career planning.",
        sessions: "Schedule video sessions through the platform. Set availability, send calendar invites, and conduct virtual mentoring sessions.",
        community: "Participate in mentor forums, share industry insights, answer student questions, and collaborate with other mentors."
      },
      admin: {
        greeting: "Admin dashboard ready! I can help with user management, running matching algorithms, generating reports, and system monitoring.",
        matching: "Run the matching engine from Admin Dashboard. Monitor progress, view fairness metrics, and generate compliance reports. The AI considers skills, location, quotas, and preferences.",
        reports: "Generate reports from Analytics: 1) Matching success rates 2) Diversity metrics 3) Geographic distribution 4) User engagement stats. Export as PDF or CSV.",
        users: "Manage users: Search, filter, edit profiles, verify documents, handle disputes. Monitor user activity and engagement metrics.",
        compliance: "Monitor compliance with government quotas, generate audit reports, track diversity metrics, and ensure fair allocation across all categories."
      }
    };
  }

  async initialize() {
    try {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        this.sessionClient = new dialogflow.SessionsClient();
        console.log('✅ Dialogflow client initialized');
      } else {
        console.log('🔧 Using mock chatbot service');
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Chatbot initialization failed:', error);
      this.isInitialized = true; // Continue with mock service
    }
  }

  async processMessage(message, userId, userRole, sessionId) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (this.sessionClient) {
        // Use actual Dialogflow
        const sessionPath = this.sessionClient.projectAgentSessionPath(
          this.projectId,
          sessionId || userId
        );

        const request = {
          session: sessionPath,
          queryInput: {
            text: {
              text: message,
              languageCode: 'en-US',
            },
          },
          queryParams: {
            contexts: [
              {
                name: `${sessionPath}/contexts/user-role`,
                lifespanCount: 10,
                parameters: {
                  role: userRole,
                  userId: userId
                }
              }
            ]
          }
        };

        const [response] = await this.sessionClient.detectIntent(request);
        return {
          text: response.queryResult.fulfillmentText,
          intent: response.queryResult.intent?.displayName,
          confidence: response.queryResult.intentDetectionConfidence
        };
      } else {
        // Use mock NLP processing
        return this.processMockMessage(message, userRole);
      }
    } catch (error) {
      console.error('Chatbot processing failed:', error);
      return this.processMockMessage(message, userRole);
    }
  }

  processMockMessage(message, userRole) {
    const lowerMessage = message.toLowerCase();
    const responses = this.roleResponses[userRole] || this.roleResponses.applicant;

    // Intent detection based on keywords
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
      return {
        text: responses.greeting,
        intent: 'greeting',
        confidence: 0.9
      };
    }

    // Role-specific responses
    if (userRole === 'applicant') {
      if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
        return { text: responses.apply, intent: 'apply_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('profile') || lowerMessage.includes('complete')) {
        return { text: responses.profile, intent: 'profile_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('mentor') || lowerMessage.includes('guidance')) {
        return { text: responses.mentor, intent: 'mentor_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('document') || lowerMessage.includes('upload')) {
        return { text: responses.documents, intent: 'document_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('points') || lowerMessage.includes('badge') || lowerMessage.includes('gamification')) {
        return { text: responses.gamification, intent: 'gamification_help', confidence: 0.85 };
      }
    }

    if (userRole === 'recruiter') {
      if (lowerMessage.includes('post') || lowerMessage.includes('opportunity')) {
        return { text: responses.post, intent: 'post_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('candidates') || lowerMessage.includes('applicants')) {
        return { text: responses.candidates, intent: 'candidate_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('compliance') || lowerMessage.includes('diversity')) {
        return { text: responses.compliance, intent: 'compliance_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('blockchain') || lowerMessage.includes('verify')) {
        return { text: responses.blockchain, intent: 'blockchain_help', confidence: 0.85 };
      }
    }

    if (userRole === 'mentor') {
      if (lowerMessage.includes('mentee') || lowerMessage.includes('student')) {
        return { text: responses.mentees, intent: 'mentee_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('tips') || lowerMessage.includes('advice')) {
        return { text: responses.tips, intent: 'tips_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('session') || lowerMessage.includes('call')) {
        return { text: responses.sessions, intent: 'session_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('community') || lowerMessage.includes('forum')) {
        return { text: responses.community, intent: 'community_help', confidence: 0.85 };
      }
    }

    if (userRole === 'admin') {
      if (lowerMessage.includes('matching') || lowerMessage.includes('algorithm')) {
        return { text: responses.matching, intent: 'matching_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
        return { text: responses.reports, intent: 'report_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('user') || lowerMessage.includes('manage')) {
        return { text: responses.users, intent: 'user_help', confidence: 0.85 };
      }
      if (lowerMessage.includes('compliance') || lowerMessage.includes('quota')) {
        return { text: responses.compliance, intent: 'compliance_help', confidence: 0.85 };
      }
    }

    // General responses
    if (lowerMessage.includes('thank')) {
      return {
        text: "You're welcome! Feel free to ask if you need any more help with the PM Internship Scheme.",
        intent: 'thanks',
        confidence: 0.9
      };
    }

    // Default response
    return {
      text: `I can help you with various aspects of the PM Internship Scheme. Try asking about ${userRole === 'applicant' ? 'applications, profile completion, or mentors' : userRole === 'recruiter' ? 'posting opportunities or reviewing candidates' : userRole === 'mentor' ? 'mentees or sharing tips' : 'user management or running matching algorithms'}.`,
      intent: 'default',
      confidence: 0.5
    };
  }

  async getQuickReplies(userRole) {
    const quickReplies = {
      applicant: [
        "How to apply for internships?",
        "Complete my profile",
        "Find mentors",
        "Upload documents",
        "Check my points"
      ],
      recruiter: [
        "Post new opportunity",
        "Review candidates",
        "Check compliance",
        "View blockchain records",
        "Generate reports"
      ],
      mentor: [
        "View my mentees",
        "Share career tips",
        "Schedule sessions",
        "Join community forum",
        "Track progress"
      ],
      admin: [
        "Run matching algorithm",
        "Generate reports",
        "Manage users",
        "Check compliance",
        "View analytics"
      ]
    };

    return quickReplies[userRole] || quickReplies.applicant;
  }

  async getChatHistory(userId, limit = 50) {
    // In a real implementation, this would fetch from a database
    // For now, return empty array as chat history is managed client-side
    return [];
  }

  async saveChatMessage(userId, message, response) {
    // In a real implementation, save to database for analytics
    console.log(`Chat: ${userId} - ${message} -> ${response.text}`);
  }
}

const chatbotService = new ChatbotService();
module.exports = { chatbotService };