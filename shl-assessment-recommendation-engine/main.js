// SHL Assessment Recommendation Engine - Main JavaScript

// Sample Job Descriptions
const sampleJDs = {
    java: `Join our innovative software development team as a Java Developer! 

We are seeking a seasoned Java developer with 3+ years of experience building enterprise applications. 

Key Responsibilities:
- Design and develop scalable Java applications using Spring Boot
- Implement RESTful APIs and microservices architecture
- Collaborate with cross-functional teams including business analysts and QA engineers
- Write clean, maintainable code following best practices
- Participate in code reviews and technical discussions

Required Skills:
- Strong proficiency in Java 8+, Spring Framework, Hibernate
- Experience with databases (MySQL, PostgreSQL)
- Understanding of software development lifecycle
- Excellent problem-solving abilities
- Strong communication and teamwork skills

Preferred:
- Experience with cloud platforms (AWS, Azure)
- Knowledge of CI/CD pipelines
- Agile/Scrum methodology experience`,

    qa: `Quality Assurance Engineer - Shape the Future of Talent Assessment!

Are you a seasoned QA Engineer with a flair for innovation? Join SHL's community that's shaping the future of work!

Role Overview:
We're looking for a Quality Assurance Engineer to ensure the quality and reliability of our talent assessment platform. You'll work closely with developers, product managers, and business teams to deliver exceptional user experiences.

Key Responsibilities:
- Develop and execute comprehensive test plans and test cases
- Perform manual and automated testing of web applications
- Identify, document, and track bugs and issues
- Collaborate with development teams to ensure quality standards
- Participate in design and requirement reviews
- Implement and maintain automated testing frameworks

Required Skills:
- 3+ years of QA engineering experience
- Strong understanding of software testing methodologies
- Experience with test automation tools (Selenium, Cypress)
- Knowledge of API testing and tools (Postman, REST Assured)
- Understanding of Agile development processes
- Excellent analytical and problem-solving skills
- Strong communication and collaboration abilities

Technical Requirements:
- Experience with programming languages (Java, Python, JavaScript)
- Knowledge of CI/CD tools (Jenkins, GitLab CI)
- Understanding of databases and SQL
- Experience with bug tracking systems (JIRA)

What We Offer:
- Competitive salary and benefits package
- Hybrid working model
- Career development opportunities
- Collaborative and inclusive culture
- Chance to work on cutting-edge talent assessment technology`,

    consultant: `Consultant Position - Drive Client Success Through Talent Solutions

Join our professional services organization as a Consultant and lead the delivery of impactful client solutions in talent assessment and development.

Role Purpose:
Support the broader professional services organization by leading the delivery of impactful client solutions and advising on client programs. Provide I/O technical guidance to internal and external stakeholders while driving continuous improvement in project delivery.

Primary Responsibilities:
- Plan, execute, and document projects related to clients' talent assessment and development needs
- Conduct job analysis, validation studies, and leadership assessments
- Support succession planning and talent management initiatives
- Provide technical guidance on I/O psychology principles
- Develop and maintain client relationships
- Drive continuous improvement in project delivery methodologies

Required Qualifications:
- Master's degree in Industrial-Organizational Psychology, Human Resources, or related field
- 2+ years of experience in talent assessment or related field
- Strong understanding of psychometric principles and assessment methodologies
- Excellent project management and organizational skills
- Superior communication and presentation abilities
- Ability to work independently and collaboratively

Key Competencies:
- Analytical thinking and problem-solving
- Client relationship management
- Technical expertise in talent assessment
- Business acumen and strategic thinking
- Adaptability and learning agility

Project Types:
- Job analysis and competency modeling
- Assessment validation studies
- Leadership assessment and development
- Succession planning initiatives
- Talent management program design

This role requires up to 25% travel and offers competitive compensation with comprehensive benefits.`
};

// Assessment database
let assessmentDatabase = [];
let currentRecommendations = [];
let confidenceChart = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeTypedText();
    loadAssessmentDatabase();
    setupCharacterCounter();
    initializeAnimations();
});

// Initialize typed text animation
function initializeTypedText() {
    new Typed('#typed-text', {
        strings: [
            'Intelligent Assessment Matching',
            'AI-Powered Talent Solutions',
            'Smarter Hiring Decisions'
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

// Load assessment database
async function loadAssessmentDatabase() {
    try {
        const response = await fetch('resources/shl-assessments.json');
        assessmentDatabase = await response.json();
        console.log('Loaded', assessmentDatabase.length, 'assessments');
    } catch (error) {
        console.error('Error loading assessment database:', error);
        // Fallback to embedded data if file load fails
        assessmentDatabase = getFallbackAssessments();
    }
}

// Setup character counter
function setupCharacterCounter() {
    const textarea = document.getElementById('jobDescription');
    const charCount = document.getElementById('charCount');
    
    textarea.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = `${count}/2000`;
        charCount.className = count > 1800 ? 'text-red-500' : 'text-gray-500';
    });
}

// Initialize animations
function initializeAnimations() {
    anime({
        targets: '.hero-pattern',
        opacity: [0, 1],
        duration: 1000,
        easing: 'easeOutQuad'
    });
}

// Load sample job description
function loadSampleJD(type) {
    const textarea = document.getElementById('jobDescription');
    textarea.value = sampleJDs[type];
    textarea.dispatchEvent(new Event('input'));
    
    // Animate the textarea
    anime({
        targets: textarea,
        scale: [0.98, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
}

// Main analysis function
async function analyzeJobDescription() {
    const jobDescription = document.getElementById('jobDescription').value.trim();
    
    if (!jobDescription) {
        alert('Please enter a job description first.');
        return;
    }
    
    const analyzeBtn = document.getElementById('analyzeBtn');
    const originalText = analyzeBtn.textContent;
    
    // Show loading state
    analyzeBtn.innerHTML = '<div class="loading-spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block mr-2"></div>Analyzing...';
    analyzeBtn.disabled = true;
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate recommendations
        const recommendations = generateRecommendations(jobDescription);
        currentRecommendations = recommendations;
        
        // Display results
        displayRecommendations(recommendations);
        displayConfidenceChart(recommendations);
        
        // Show results section
        document.getElementById('resultsSection').classList.remove('hidden');
        document.getElementById('exportBtn').disabled = false;
        
        // Smooth scroll to results
        document.getElementById('resultsSection').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
    } catch (error) {
        console.error('Error analyzing job description:', error);
        alert('An error occurred during analysis. Please try again.');
    } finally {
        // Reset button state
        analyzeBtn.textContent = originalText;
        analyzeBtn.disabled = false;
    }
}

// Generate recommendations using semantic analysis
function generateRecommendations(jobDescription) {
    const skills = extractSkillsFromJD(jobDescription);
    const recommendations = [];
    
    assessmentDatabase.forEach(assessment => {
        const score = calculateRelevanceScore(jobDescription, skills, assessment);
        if (score > 0.3) { // Minimum relevance threshold
            recommendations.push({
                ...assessment,
                confidence: Math.min(score * 100, 100),
                matchedSkills: findMatchedSkills(skills, assessment.skill_keywords)
            });
        }
    });
    
    // Sort by confidence score and take top 10
    return recommendations
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 10);
}

// Extract skills from job description
function extractSkillsFromJD(jobDescription) {
    const text = jobDescription.toLowerCase();
    const skills = [];
    
    // Technical skills patterns
    const technicalPatterns = [
        /java\b/g, /python\b/g, /javascript\b/g, /sql\b/g, /aws\b/g, /azure\b/g,
        /spring\b/g, /hibernate\b/g, /react\b/g, /angular\b/g, /node\b/g,
        /testing\b/g, /automation\b/g, /selenium\b/g, /cypress\b/g,
        /leadership\b/g, /management\b/g, /communication\b/g, /collaboration\b/g,
        /analysis\b/g, /problem\s+solving\b/g, /project\s+management\b/g
    ];
    
    technicalPatterns.forEach(pattern => {
        const matches = text.match(pattern);
        if (matches) {
            skills.push(matches[0]);
        }
    });
    
    return [...new Set(skills)]; // Remove duplicates
}

// Calculate relevance score
function calculateRelevanceScore(jobDescription, extractedSkills, assessment) {
    const jdText = jobDescription.toLowerCase();
    let score = 0;
    let matches = 0;
    
    // Check skill keywords
    assessment.skill_keywords.forEach(skill => {
        const skillPattern = new RegExp(skill.toLowerCase(), 'g');
        if (jdText.match(skillPattern)) {
            score += 1;
            matches++;
        }
    });
    
    // Check extracted skills
    extractedSkills.forEach(skill => {
        if (assessment.skill_keywords.some(keyword => 
            keyword.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(keyword.toLowerCase())
        )) {
            score += 0.5;
        }
    });
    
    // Normalize score
    const maxPossibleScore = assessment.skill_keywords.length + extractedSkills.length * 0.5;
    return maxPossibleScore > 0 ? score / maxPossibleScore : 0;
}

// Find matched skills
function findMatchedSkills(extractedSkills, assessmentSkills) {
    const matches = [];
    
    extractedSkills.forEach(skill => {
        assessmentSkills.forEach(assessmentSkill => {
            if (skill.toLowerCase().includes(assessmentSkill.toLowerCase()) ||
                assessmentSkill.toLowerCase().includes(skill.toLowerCase())) {
                matches.push(skill);
            }
        });
    });
    
    return [...new Set(matches)];
}

// Display recommendations
function displayRecommendations(recommendations) {
    const container = document.getElementById('assessmentCards');
    container.innerHTML = '';
    
    recommendations.forEach((assessment, index) => {
        const card = createAssessmentCard(assessment, index);
        container.appendChild(card);
    });
    
    // Animate cards
    anime({
        targets: '.assessment-card',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutQuad'
    });
}

// Create assessment card
function createAssessmentCard(assessment, index) {
    const card = document.createElement('div');
    card.className = 'assessment-card bg-white rounded-xl shadow-lg p-6 card-hover';
    
    const confidenceColor = assessment.confidence >= 80 ? 'text-green-600' : 
                           assessment.confidence >= 60 ? 'text-yellow-600' : 'text-red-600';
    
    const testTypeBadge = assessment.test_type === 'K' ? 
        '<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Knowledge/Skill</span>' :
        '<span class="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Personality/Behavior</span>';
    
    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex items-center space-x-2">
                <span class="text-2xl font-bold text-gray-400">#${index + 1}</span>
                ${testTypeBadge}
            </div>
            <div class="text-right">
                <div class="text-2xl font-bold ${confidenceColor}">${Math.round(assessment.confidence)}%</div>
                <div class="text-xs text-gray-500">Confidence</div>
            </div>
        </div>
        
        <h3 class="text-lg font-semibold text-gray-900 mb-2">${assessment.assessment_name}</h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-3">${assessment.description}</p>
        
        <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
                <span class="text-gray-500">Duration:</span>
                <span class="font-medium">${assessment.duration}</span>
            </div>
            <div class="flex justify-between text-sm">
                <span class="text-gray-500">Difficulty:</span>
                <span class="font-medium">${assessment.difficulty}</span>
            </div>
        </div>
        
        ${assessment.matchedSkills.length > 0 ? `
            <div class="mb-4">
                <div class="text-sm font-medium text-gray-700 mb-2">Matched Skills:</div>
                <div class="flex flex-wrap gap-1">
                    ${assessment.matchedSkills.slice(0, 3).map(skill => 
                        `<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">${skill}</span>`
                    ).join('')}
                    ${assessment.matchedSkills.length > 3 ? `<span class="text-xs text-gray-500">+${assessment.matchedSkills.length - 3} more</span>` : ''}
                </div>
            </div>
        ` : ''}
        
        <div class="flex space-x-2">
            <a href="${assessment.url}" target="_blank" class="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center">
                View Assessment
            </a>
            <button onclick="showAssessmentDetails('${assessment.assessment_name}')" class="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                Details
            </button>
        </div>
    `;
    
    return card;
}

// Display confidence chart
function displayConfidenceChart(recommendations) {
    const chartContainer = document.getElementById('confidenceChart');
    
    if (confidenceChart) {
        confidenceChart.dispose();
    }
    
    confidenceChart = echarts.init(chartContainer);
    
    const option = {
        title: {
            text: 'Assessment Match Confidence Scores',
            left: 'center',
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const data = params[0];
                return `${data.name}<br/>Confidence: ${data.value}%<br/>Type: ${data.data.type}`;
            }
        },
        xAxis: {
            type: 'category',
            data: recommendations.map(r => r.assessment_name.split(' ').slice(0, 2).join(' ')),
            axisLabel: {
                rotate: 45,
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            max: 100,
            axisLabel: {
                formatter: '{value}%'
            }
        },
        series: [{
            name: 'Confidence',
            type: 'bar',
            data: recommendations.map(r => ({
                value: Math.round(r.confidence),
                type: r.test_type === 'K' ? 'Knowledge/Skill' : 'Personality/Behavior',
                itemStyle: {
                    color: r.confidence >= 80 ? '#10b981' : 
                           r.confidence >= 60 ? '#f59e0b' : '#ef4444'
                }
            })),
            barWidth: '60%'
        }],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        }
    };
    
    confidenceChart.setOption(option);
    
    // Make chart responsive
    window.addEventListener('resize', function() {
        if (confidenceChart) {
            confidenceChart.resize();
        }
    });
}

// Filter assessments
function filterAssessments(type) {
    // Update button states
    document.querySelectorAll('[id^="filter"]').forEach(btn => {
        btn.className = 'px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 font-medium';
    });
    document.getElementById(`filter${type === 'all' ? 'All' : type}`).className = 'px-4 py-2 rounded-md bg-blue-600 text-white font-medium';
    
    // Filter cards
    const cards = document.querySelectorAll('.assessment-card');
    cards.forEach(card => {
        const shouldShow = type === 'all' || card.dataset.type === type;
        if (shouldShow) {
            card.style.display = 'block';
            anime({
                targets: card,
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        } else {
            anime({
                targets: card,
                opacity: [1, 0],
                scale: [1, 0.9],
                duration: 200,
                easing: 'easeInQuad',
                complete: function() {
                    card.style.display = 'none';
                }
            });
        }
    });
}

// Show assessment details
function showAssessmentDetails(assessmentName) {
    const assessment = assessmentDatabase.find(a => a.assessment_name === assessmentName);
    if (assessment) {
        alert(`Assessment Details:\n\nName: ${assessment.assessment_name}\nType: ${assessment.test_type === 'K' ? 'Knowledge/Skill' : 'Personality/Behavior'}\nDuration: ${assessment.duration}\nDifficulty: ${assessment.difficulty}\n\nDescription: ${assessment.description}\n\nSkills: ${assessment.skill_keywords.join(', ')}`);
    }
}

// Export results to CSV
function exportResults() {
    if (currentRecommendations.length === 0) {
        alert('No results to export. Please analyze a job description first.');
        return;
    }
    
    const csvContent = generateCSV(currentRecommendations);
    downloadCSV(csvContent, 'shl_assessment_recommendations.csv');
}

// Generate CSV content
function generateCSV(recommendations) {
    const headers = ['Rank', 'Assessment Name', 'Type', 'Confidence (%)', 'Duration', 'Difficulty', 'URL', 'Matched Skills'];
    const rows = recommendations.map((rec, index) => [
        index + 1,
        rec.assessment_name,
        rec.test_type === 'K' ? 'Knowledge/Skill' : 'Personality/Behavior',
        Math.round(rec.confidence),
        rec.duration,
        rec.difficulty,
        rec.url,
        rec.matchedSkills ? rec.matchedSkills.join('; ') : ''
    ]);
    
    const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
    
    return csvContent;
}

// Download CSV file
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Fallback assessment data in case JSON file fails to load
function getFallbackAssessments() {
    return [
        {
            "assessment_name": "Java Programming Knowledge Test",
            "description": "Comprehensive assessment of Java programming skills including object-oriented concepts, data structures, and algorithm implementation",
            "test_type": "K",
            "skill_keywords": ["Java", "OOP", "Data Structures", "Algorithms", "Programming"],
            "url": "https://www.shl.com/product/java-programming-test",
            "duration": "60 minutes",
            "difficulty": "Intermediate"
        },
        {
            "assessment_name": "Problem Solving Test",
            "description": "Evaluates analytical thinking and problem-solving abilities through logical reasoning scenarios",
            "test_type": "K",
            "skill_keywords": ["Problem Solving", "Analytical Thinking", "Logic", "Reasoning"],
            "url": "https://www.shl.com/product/problem-solving-test",
            "duration": "45 minutes",
            "difficulty": "Intermediate"
        }
    ];
}