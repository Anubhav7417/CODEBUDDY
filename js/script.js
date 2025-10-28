// CollabSync - Frontend JavaScript
class CollabSync {
    constructor() {
        this.currentUser = null;
        this.projects = [];
        this.users = [];
        this.currentProject = null;
        this.chatMessages = [];
        this.tasks = [];
        this.files = [];
        
        this.init();
    }

    init() {
        this.initParticles();
        this.initEventListeners();
        this.initRouting();
        this.loadMockData();
        this.checkAuth();
    }

    // Initialize Particles.js background
    initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 80, density: { enable: true, value_area: 800 } },
                    color: { value: '#4361ee' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#4361ee',
                        opacity: 0.4,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: true,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    }
                },
                retina_detect: true
            });
        }
    }

    // Initialize event listeners
    initEventListeners() {
        // Navigation
        document.getElementById('navToggle').addEventListener('click', this.toggleMobileMenu.bind(this));
        document.getElementById('logoutBtn').addEventListener('click', this.logout.bind(this));
        
        // Auth forms
        document.getElementById('loginForm').addEventListener('submit', this.handleLogin.bind(this));
        document.getElementById('registerForm').addEventListener('submit', this.handleRegister.bind(this));
        
        // Projects
        document.getElementById('newProjectBtn').addEventListener('click', this.showNewProjectModal.bind(this));
        document.getElementById('closeProjectModal').addEventListener('click', this.hideNewProjectModal.bind(this));
        document.getElementById('cancelProjectBtn').addEventListener('click', this.hideNewProjectModal.bind(this));
        document.getElementById('newProjectForm').addEventListener('submit', this.handleNewProject.bind(this));
        document.getElementById('addRoleBtn').addEventListener('click', this.addRoleField.bind(this));
        
        // Tech stack tags
        document.getElementById('projectTechStack').addEventListener('keydown', this.handleTechStackInput.bind(this));
        
        // Filters
        document.getElementById('projectSearch').addEventListener('input', this.filterProjects.bind(this));
        document.getElementById('projectStatus').addEventListener('change', this.filterProjects.bind(this));
        document.getElementById('userSearch').addEventListener('input', this.filterUsers.bind(this));
        document.getElementById('userSkills').addEventListener('change', this.filterUsers.bind(this));
        
        // Workspace
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', this.switchWorkspaceTab.bind(this));
        });
        
        document.getElementById('sendMessageBtn').addEventListener('click', this.sendMessage.bind(this));
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.id === 'newProjectModal') {
                this.hideNewProjectModal();
            }
        });
    }

    // Initialize routing
    initRouting() {
        // Handle hash changes
        window.addEventListener('hashchange', this.handleRouteChange.bind(this));
        
        // Initial route
        this.handleRouteChange();
    }

    // Handle route changes
    handleRouteChange() {
        const hash = window.location.hash.substring(1) || 'home';
        const sections = document.querySelectorAll('.section');
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show active section
        const activeSection = document.getElementById(hash);
        if (activeSection) {
            activeSection.classList.add('active');
            
            // Update navigation
            this.updateNavigation(hash);
            
            // Load section-specific data
            this.loadSectionData(hash);
        }
    }

    // Update navigation active state
    updateNavigation(hash) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${hash}`) {
                link.classList.add('active');
            }
        });
    }

    // Load data for specific sections
    loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'projects':
                this.loadProjects();
                break;
            case 'discover':
                this.loadDiscover();
                break;
            case 'workspace':
                this.loadWorkspace();
                break;
        }
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const navLinks = document.getElementById('navLinks');
        navLinks.classList.toggle('active');
    }

    // Check authentication status
    checkAuth() {
        const user = this.getCurrentUser();
        if (user) {
            this.currentUser = user;
            this.showAuthenticatedUI();
        } else {
            this.showUnauthenticatedUI();
        }
    }

    // Get current user from localStorage
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    // Save current user to localStorage
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    // Show UI for authenticated users
    showAuthenticatedUI() {
        document.getElementById('navUser').style.display = 'flex';
        document.getElementById('navAuth').style.display = 'none';
        
        // Update user name
        document.getElementById('userName').textContent = this.currentUser.name;
        document.getElementById('dashboardUserName').textContent = this.currentUser.name;
        
        // Show protected sections in navigation
        document.getElementById('dashboardLink').style.display = 'block';
        document.getElementById('projectsLink').style.display = 'block';
        document.getElementById('discoverLink').style.display = 'block';
        document.getElementById('workspaceLink').style.display = 'block';
    }

    // Show UI for unauthenticated users
    showUnauthenticatedUI() {
        document.getElementById('navUser').style.display = 'none';
        document.getElementById('navAuth').style.display = 'flex';
        
        // Hide protected sections in navigation
        document.getElementById('dashboardLink').style.display = 'none';
        document.getElementById('projectsLink').style.display = 'none';
        document.getElementById('discoverLink').style.display = 'none';
        document.getElementById('workspaceLink').style.display = 'none';
        
        // Redirect to home if on protected page
        const protectedSections = ['dashboard', 'projects', 'discover', 'workspace'];
        const currentSection = window.location.hash.substring(1);
        if (protectedSections.includes(currentSection)) {
            window.location.hash = 'home';
        }
    }

    // Handle login
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Show loading state
        this.setButtonLoading('loginBtnText', 'loginLoader', true);
        
        try {
            // Simulate API call
            await this.simulateAPICall(1000);
            
            if (email === 'demo@university.edu' && password === 'password') {
                const user = {
                    id: 1,
                    name: 'Demo User',
                    email: 'demo@university.edu',
                    university: 'Stanford University',
                    branch: 'Computer Science',
                    year: 2024,
                    skills: ['React', 'Node.js', 'Python', 'MongoDB'],
                    stats: {
                        projects: 3,
                        connections: 12,
                        xp: 1250
                    }
                };
                
                this.setCurrentUser(user);
                this.showAuthenticatedUI();
                this.showToast('Successfully logged in!', 'success');
                
                // Redirect to dashboard
                window.location.hash = 'dashboard';
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            this.setButtonLoading('loginBtnText', 'loginLoader', false);
        }
    }

    // Handle registration
    async handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            university: document.getElementById('registerUniversity').value,
            branch: document.getElementById('registerBranch').value,
            year: document.getElementById('registerYear').value,
            password: document.getElementById('registerPassword').value
        };
        
        // Show loading state
        this.setButtonLoading('registerBtnText', 'registerLoader', true);
        
        try {
            // Simulate API call
            await this.simulateAPICall(1500);
            
            const user = {
                id: Date.now(),
                ...formData,
                skills: [],
                stats: {
                    projects: 0,
                    connections: 0,
                    xp: 0
                }
            };
            
            this.setCurrentUser(user);
            this.showAuthenticatedUI();
            this.showToast('Account created successfully!', 'success');
            
            // Redirect to dashboard
            window.location.hash = 'dashboard';
        } catch (error) {
            this.showToast('Registration failed. Please try again.', 'error');
        } finally {
            this.setButtonLoading('registerBtnText', 'registerLoader', false);
        }
    }

    // Handle logout
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.showUnauthenticatedUI();
        this.showToast('Successfully logged out', 'info');
        window.location.hash = 'home';
    }

    // Set button loading state
    setButtonLoading(textId, loaderId, loading) {
        const btnText = document.getElementById(textId);
        const loader = document.getElementById(loaderId);
        
        if (loading) {
            btnText.style.display = 'none';
            loader.style.display = 'block';
        } else {
            btnText.style.display = 'block';
            loader.style.display = 'none';
        }
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'check',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icons[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);
        
        // Close on click
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }

    // Simulate API call delay
    simulateAPICall(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // Load mock data
    loadMockData() {
        this.projects = [
            {
                id: 1,
                title: 'AI-Powered Study Planner',
                description: 'Building an intelligent study scheduler that uses machine learning to optimize study sessions and improve learning outcomes.',
                owner: { id: 2, name: 'Sarah Chen' },
                requiredRoles: [
                    { role: 'Frontend Developer', count: 2, skills: ['React', 'TypeScript'] },
                    { role: 'Backend Developer', count: 1, skills: ['Node.js', 'MongoDB'] },
                    { role: 'ML Engineer', count: 1, skills: ['Python', 'TensorFlow'] }
                ],
                techStack: ['React', 'Node.js', 'MongoDB', 'TensorFlow', 'Python'],
                status: 'recruiting',
                teamMembers: [2],
                university: 'MIT',
                timeline: '8 weeks',
                vibe: 'serious',
                createdAt: new Date('2024-01-15')
            },
            {
                id: 2,
                title: 'Campus Food Delivery App',
                description: 'Creating a food delivery platform specifically for college campuses with features for student discounts.',
                owner: { id: 3, name: 'Alex Rodriguez' },
                requiredRoles: [
                    { role: 'Mobile Developer', count: 2, skills: ['React Native', 'Firebase'] },
                    { role: 'UI/UX Designer', count: 1, skills: ['Figma', 'UI Design'] }
                ],
                techStack: ['React Native', 'Firebase', 'Node.js', 'Express'],
                status: 'recruiting',
                teamMembers: [3],
                university: 'Stanford University',
                timeline: '12 weeks',
                vibe: 'casual',
                createdAt: new Date('2024-02-01')
            },
            {
                id: 3,
                title: 'Sustainable Campus Initiative',
                description: 'Developing a platform to promote sustainability on campus with features for tracking carbon footprint.',
                owner: { id: 4, name: 'Maria Garcia' },
                requiredRoles: [
                    { role: 'Full Stack Developer', count: 2, skills: ['Vue.js', 'Django', 'PostgreSQL'] },
                    { role: 'Data Analyst', count: 1, skills: ['Python', 'SQL', 'Data Visualization'] }
                ],
                techStack: ['Vue.js', 'Django', 'PostgreSQL', 'Python', 'Chart.js'],
                status: 'active',
                teamMembers: [4, 5],
                university: 'UC Berkeley',
                timeline: '16 weeks',
                vibe: 'learning',
                createdAt: new Date('2024-01-20')
            }
        ];

        this.users = [
            {
                id: 2,
                name: 'Sarah Chen',
                email: 'sarah@mit.edu',
                university: 'MIT',
                branch: 'Computer Science',
                year: 2023,
                skills: ['React Native', 'Firebase', 'UI/UX Design', 'JavaScript'],
                bio: 'Passionate about mobile development and creating user-friendly applications.',
                stats: {
                    rating: 4.5,
                    connections: 15,
                    level: 8
                },
                availability: 'available'
            },
            {
                id: 3,
                name: 'Alex Rodriguez',
                email: 'alex@stanford.edu',
                university: 'Stanford University',
                branch: 'Electrical Engineering',
                year: 2024,
                skills: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow'],
                bio: 'ML enthusiast with experience in computer vision and natural language processing.',
                stats: {
                    rating: 4.8,
                    connections: 18,
                    level: 10
                },
                availability: 'busy'
            },
            {
                id: 4,
                name: 'Maria Garcia',
                email: 'maria@berkeley.edu',
                university: 'UC Berkeley',
                branch: 'Environmental Science',
                year: 2023,
                skills: ['Python', 'Data Analysis', 'Sustainability', 'Project Management'],
                bio: 'Combining tech skills with passion for environmental sustainability.',
                stats: {
                    rating: 4.6,
                    connections: 12,
                    level: 7
                },
                availability: 'available'
            }
        ];

        this.chatMessages = [
            {
                id: 1,
                sender: { id: 2, name: 'Sarah Chen' },
                message: 'Hey team! Excited to work on this project together.',
                timestamp: new Date(Date.now() - 3600000)
            },
            {
                id: 2,
                sender: { id: 1, name: 'Demo User' },
                message: 'Welcome Sarah! Looking forward to collaborating.',
                timestamp: new Date(Date.now() - 1800000)
            },
            {
                id: 3,
                sender: { id: 2, name: 'Sarah Chen' },
                message: 'I was thinking we could use React for the frontend and Node.js for the backend. What do you think?',
                timestamp: new Date(Date.now() - 1200000)
            }
        ];

        this.tasks = [
            {
                id: 1,
                title: 'Setup project repository',
                description: 'Initialize GitHub repo with basic structure and README',
                assignee: { id: 1, name: 'Demo User' },
                status: 'done',
                dueDate: new Date('2024-02-20')
            },
            {
                id: 2,
                title: 'Design database schema',
                description: 'Create ER diagram and define data models',
                assignee: { id: 2, name: 'Sarah Chen' },
                status: 'in-progress',
                dueDate: new Date('2024-02-25')
            },
            {
                id: 3,
                title: 'Implement user authentication',
                description: 'Setup JWT-based auth system',
                assignee: { id: 1, name: 'Demo User' },
                status: 'todo',
                dueDate: new Date('2024-03-01')
            }
        ];

        this.files = [
            {
                id: 1,
                name: 'Project Proposal.pdf',
                type: 'pdf',
                size: '2.4 MB',
                uploadedBy: { id: 2, name: 'Sarah Chen' },
                uploadedAt: new Date('2024-01-15')
            },
            {
                id: 2,
                name: 'Wireframes.fig',
                type: 'figma',
                size: '1.2 MB',
                uploadedBy: { id: 1, name: 'Demo User' },
                uploadedAt: new Date('2024-01-18')
            },
            {
                id: 3,
                name: 'Tech Stack Research.docx',
                type: 'document',
                size: '0.8 MB',
                uploadedBy: { id: 2, name: 'Sarah Chen' },
                uploadedAt: new Date('2024-01-20')
            }
        ];
    }

    // Load dashboard data
    loadDashboard() {
        if (!this.currentUser) return;
        
        // Update stats
        document.getElementById('projectsCount').textContent = this.currentUser.stats.projects;
        document.getElementById('connectionsCount').textContent = this.currentUser.stats.connections;
        document.getElementById('xpCount').textContent = this.currentUser.stats.xp;
        
        // Load recommendations
        this.loadProjectRecommendations();
        this.loadBuddyRecommendations();
        this.loadRecentActivity();
    }

    // Load project recommendations
    loadProjectRecommendations() {
        const container = document.getElementById('projectRecommendations');
        const recommendedProjects = this.projects.slice(0, 2);
        
        if (recommendedProjects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>No recommendations yet</h3>
                    <p>Complete your profile to get personalized project recommendations</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recommendedProjects.map(project => `
            <div class="recommendation-item">
                <div class="recommendation-header">
                    <h4>${project.title}</h4>
                    <span class="recommendation-score">87% match</span>
                </div>
                <p class="recommendation-description">${project.description}</p>
                <div class="tech-tags">
                    ${project.techStack.slice(0, 3).map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
                <div class="recommendation-reason">
                    <i class="fas fa-lightbulb"></i>
                    Matches your skills in React, Node.js, and interest in AI projects
                </div>
            </div>
        `).join('');
    }

    // Load buddy recommendations
    loadBuddyRecommendations() {
        const container = document.getElementById('buddyRecommendations');
        const recommendedUsers = this.users.slice(0, 2);
        
        if (recommendedUsers.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-friends"></i>
                    <h3>No buddy recommendations</h3>
                    <p>Complete your profile to find compatible coding buddies</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recommendedUsers.map(user => `
            <div class="recommendation-item">
                <div class="recommendation-header">
                    <h4>${user.name}</h4>
                    <span class="recommendation-score">85% match</span>
                </div>
                <p class="recommendation-description">${user.bio}</p>
                <div class="tech-tags">
                    ${user.skills.slice(0, 3).map(skill => `
                        <span class="tech-tag">${skill}</span>
                    `).join('')}
                </div>
                <div class="recommendation-reason">
                    <i class="fas fa-lightbulb"></i>
                    Complementary skills in ${user.skills.slice(0, 2).join(' and ')}
                </div>
            </div>
        `).join('');
    }

    // Load recent activity
    loadRecentActivity() {
        const container = document.getElementById('recentActivity');
        const activities = [
            { type: 'connection', message: 'Sarah Chen sent you a connection request', time: '2 hours ago' },
            { type: 'project', message: 'Your project "AI Study Planner" got 3 new applications', time: '1 day ago' },
            { type: 'message', message: 'New message from Alex Rodriguez in "Campus Food App"', time: '2 days ago' }
        ];
        
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <p class="activity-message">${activity.message}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    // Get activity icon
    getActivityIcon(type) {
        const icons = {
            connection: 'user-plus',
            project: 'folder',
            message: 'comment'
        };
        return icons[type] || 'bell';
    }

    // Load projects
    loadProjects() {
        const container = document.getElementById('projectsGrid');
        
        if (this.projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>No projects found</h3>
                    <p>Be the first to create a project and start collaborating!</p>
                    <button class="btn btn-primary" id="emptyStateNewProject">Create Project</button>
                </div>
            `;
            
            document.getElementById('emptyStateNewProject').addEventListener('click', () => {
                this.showNewProjectModal();
            });
            return;
        }
        
        container.innerHTML = this.projects.map(project => `
            <div class="project-card card fade-in">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <span class="project-status status-${project.status}">${project.status}</span>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span><i class="fas fa-university"></i> ${project.university}</span>
                    <span><i class="fas fa-users"></i> ${project.teamMembers.length} members</span>
                    <span><i class="fas fa-clock"></i> ${project.timeline}</span>
                </div>
                <div class="required-roles">
                    ${project.requiredRoles.map(role => `
                        <div class="role-item">
                            <div class="role-info">
                                <span class="role-name">${role.role}</span>
                                <span class="role-skills">${role.skills.join(', ')}</span>
                            </div>
                            <span class="role-count">${role.count} needed</span>
                        </div>
                    `).join('')}
                </div>
                <div class="tech-tags">
                    ${project.techStack.map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
                <div class="project-actions">
                    <button class="btn btn-primary btn-sm" onclick="app.applyToProject(${project.id})">
                        Apply to Join
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="app.viewProject(${project.id})">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Load discover (users)
    loadDiscover() {
        const container = document.getElementById('usersGrid');
        
        if (this.users.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-user-friends"></i>
                    <h3>No users found</h3>
                    <p>There are no users to display at the moment</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.users.map(user => `
            <div class="user-card card fade-in">
                <div class="user-avatar large">
                    <i class="fas fa-user"></i>
                </div>
                <h3>${user.name}</h3>
                <div class="user-title">${user.university} • ${user.branch}</div>
                <p class="user-bio">${user.bio}</p>
                <div class="user-skills">
                    ${user.skills.map(skill => `
                        <span class="skill-tag">${skill}</span>
                    `).join('')}
                </div>
                <div class="user-stats">
                    <span><i class="fas fa-star"></i> ${user.stats.rating}/5</span>
                    <span><i class="fas fa-users"></i> ${user.stats.connections} connections</span>
                    <span><i class="fas fa-trophy"></i> Level ${user.stats.level}</span>
                </div>
                <button class="btn btn-primary btn-block" onclick="app.connectWithUser(${user.id})">
                    Connect
                </button>
            </div>
        `).join('');
    }

    // Load workspace
    loadWorkspace() {
        if (!this.currentProject) {
            this.currentProject = this.projects[0];
        }
        
        this.loadTeamMembers();
        this.loadChatMessages();
        this.loadTasks();
        this.loadFiles();
    }

    // Load team members
    loadTeamMembers() {
        const container = document.getElementById('teamMembers');
        const members = [
            { id: 1, name: 'Demo User', role: 'Project Lead', status: 'online' },
            { id: 2, name: 'Sarah Chen', role: 'Frontend Developer', status: 'online' },
            { id: 3, name: 'Alex Rodriguez', role: 'ML Engineer', status: 'busy' }
        ];
        
        container.innerHTML = members.map(member => `
            <div class="team-member">
                <div class="user-avatar small">
                    <i class="fas fa-user"></i>
                </div>
                <div class="member-info">
                    <div class="member-name">${member.name}</div>
                    <div class="member-role">${member.role}</div>
                </div>
                <div class="member-status status-${member.status}"></div>
            </div>
        `).join('');
    }

    // Load chat messages
    loadChatMessages() {
        const container = document.getElementById('chatMessages');
        
        container.innerHTML = this.chatMessages.map(msg => `
            <div class="chat-message ${msg.sender.id === this.currentUser.id ? 'own' : ''}">
                <div class="user-avatar small">
                    <i class="fas fa-user"></i>
                </div>
                <div class="message-content">
                    <div class="message-sender">${msg.sender.name}</div>
                    <div class="message-text">${msg.message}</div>
                    <div class="message-time">${this.formatTime(msg.timestamp)}</div>
                </div>
            </div>
        `).join('');
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    // Load tasks
    loadTasks() {
        const todoContainer = document.getElementById('todoTasks');
        const inProgressContainer = document.getElementById('inProgressTasks');
        const doneContainer = document.getElementById('doneTasks');
        
        const todoTasks = this.tasks.filter(task => task.status === 'todo');
        const inProgressTasks = this.tasks.filter(task => task.status === 'in-progress');
        const doneTasks = this.tasks.filter(task => task.status === 'done');
        
        todoContainer.innerHTML = this.renderTaskList(todoTasks);
        inProgressContainer.innerHTML = this.renderTaskList(inProgressTasks);
        doneContainer.innerHTML = this.renderTaskList(doneTasks);
    }

    // Render task list
    renderTaskList(tasks) {
        if (tasks.length === 0) {
            return '<div class="empty-state">No tasks</div>';
        }
        
        return tasks.map(task => `
            <div class="task-item ${task.status}">
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
                <div class="task-meta">
                    <span class="task-assignee">
                        <i class="fas fa-user"></i>
                        ${task.assignee.name}
                    </span>
                    <span>${this.formatDate(task.dueDate)}</span>
                </div>
            </div>
        `).join('');
    }

    // Load files
    loadFiles() {
        const container = document.getElementById('filesList');
        
        container.innerHTML = this.files.map(file => `
            <div class="file-item">
                <div class="file-icon">
                    <i class="fas fa-file-${file.type === 'pdf' ? 'pdf' : file.type === 'figma' ? 'image' : 'word'}"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-meta">
                        ${file.size} • Uploaded by ${file.uploadedBy.name} • ${this.formatDate(file.uploadedAt)}
                    </div>
                </div>
                <div class="file-actions">
                    <button class="btn btn-outline btn-sm">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Format time for display
    formatTime(date) {
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Format date for display
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    }

    // Show new project modal
    showNewProjectModal() {
        if (!this.currentUser) {
            this.showToast('Please log in to create a project', 'warning');
            window.location.hash = 'login';
            return;
        }
        
        document.getElementById('newProjectModal').classList.add('active');
    }

    // Hide new project modal
    hideNewProjectModal() {
        document.getElementById('newProjectModal').classList.remove('active');
        document.getElementById('newProjectForm').reset();
        
        // Clear tech tags
        document.getElementById('techTagsContainer').innerHTML = '';
        
        // Reset roles
        const rolesContainer = document.getElementById('requiredRoles');
        rolesContainer.innerHTML = `
            <div class="role-input">
                <input type="text" placeholder="Role (e.g., Frontend Developer)" class="role-name" required>
                <input type="number" placeholder="Count" class="role-count" min="1" value="1" required>
                <button type="button" class="btn btn-danger btn-sm remove-role">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Reattach event listeners
        this.attachRoleEventListeners();
    }

    // Handle new project form submission
    async handleNewProject(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('projectTitle').value,
            description: document.getElementById('projectDescription').value,
            techStack: Array.from(document.querySelectorAll('.tag')).map(tag => tag.textContent.trim()),
            timeline: document.getElementById('projectTimeline').value,
            vibe: document.getElementById('projectVibe').value
        };
        
        // Get required roles
        const roles = [];
        document.querySelectorAll('.role-input').forEach(input => {
            const roleName = input.querySelector('.role-name').value;
            const roleCount = input.querySelector('.role-count').value;
            if (roleName) {
                roles.push({
                    role: roleName,
                    count: parseInt(roleCount),
                    skills: []
                });
            }
        });
        
        if (roles.length === 0) {
            this.showToast('Please add at least one required role', 'warning');
            return;
        }
        
        formData.requiredRoles = roles;
        
        try {
            // Simulate API call
            await this.simulateAPICall(1000);
            
            const newProject = {
                id: Date.now(),
                ...formData,
                owner: { id: this.currentUser.id, name: this.currentUser.name },
                status: 'recruiting',
                teamMembers: [this.currentUser.id],
                university: this.currentUser.university,
                createdAt: new Date()
            };
            
            this.projects.unshift(newProject);
            this.showToast('Project created successfully!', 'success');
            this.hideNewProjectModal();
            
            // Update user stats
            this.currentUser.stats.projects++;
            this.setCurrentUser(this.currentUser);
            
            // Reload projects if on projects page
            if (window.location.hash === '#projects') {
                this.loadProjects();
            }
        } catch (error) {
            this.showToast('Failed to create project. Please try again.', 'error');
        }
    }

    // Add role field
    addRoleField() {
        const rolesContainer = document.getElementById('requiredRoles');
        const newRole = document.createElement('div');
        newRole.className = 'role-input';
        newRole.innerHTML = `
            <input type="text" placeholder="Role (e.g., Frontend Developer)" class="role-name">
            <input type="number" placeholder="Count" class="role-count" min="1" value="1">
            <button type="button" class="btn btn-danger btn-sm remove-role">
                <i class="fas fa-times"></i>
            </button>
        `;
        rolesContainer.appendChild(newRole);
        
        // Attach event listener to remove button
        newRole.querySelector('.remove-role').addEventListener('click', function() {
            if (document.querySelectorAll('.role-input').length > 1) {
                this.parentElement.remove();
            }
        });
    }

    // Attach event listeners to role remove buttons
    attachRoleEventListeners() {
        document.querySelectorAll('.remove-role').forEach(button => {
            button.addEventListener('click', function() {
                if (document.querySelectorAll('.role-input').length > 1) {
                    this.parentElement.remove();
                }
            });
        });
    }

    // Handle tech stack input
    handleTechStackInput(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const input = e.target;
            const value = input.value.trim();
            
            if (value) {
                this.addTechTag(value);
                input.value = '';
            }
        }
    }

    // Add tech tag
    addTechTag(tech) {
        const container = document.getElementById('techTagsContainer');
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${tech}
            <button type="button" class="tag-remove">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        tag.querySelector('.tag-remove').addEventListener('click', function() {
            this.parentElement.remove();
        });
        
        container.appendChild(tag);
    }

    // Filter projects
    filterProjects() {
        const searchTerm = document.getElementById('projectSearch').value.toLowerCase();
        const statusFilter = document.getElementById('projectStatus').value;
        
        const filteredProjects = this.projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                                project.description.toLowerCase().includes(searchTerm) ||
                                project.techStack.some(tech => tech.toLowerCase().includes(searchTerm));
            
            const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
        
        this.renderFilteredProjects(filteredProjects);
    }

    // Render filtered projects
    renderFilteredProjects(projects) {
        const container = document.getElementById('projectsGrid');
        
        if (projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No projects found</h3>
                    <p>Try adjusting your search criteria or filters</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = projects.map(project => `
            <div class="project-card card fade-in">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <span class="project-status status-${project.status}">${project.status}</span>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span><i class="fas fa-university"></i> ${project.university}</span>
                    <span><i class="fas fa-users"></i> ${project.teamMembers.length} members</span>
                    <span><i class="fas fa-clock"></i> ${project.timeline}</span>
                </div>
                <div class="required-roles">
                    ${project.requiredRoles.map(role => `
                        <div class="role-item">
                            <div class="role-info">
                                <span class="role-name">${role.role}</span>
                                <span class="role-skills">${role.skills.join(', ')}</span>
                            </div>
                            <span class="role-count">${role.count} needed</span>
                        </div>
                    `).join('')}
                </div>
                <div class="tech-tags">
                    ${project.techStack.map(tech => `
                        <span class="tech-tag">${tech}</span>
                    `).join('')}
                </div>
                <div class="project-actions">
                    <button class="btn btn-primary btn-sm" onclick="app.applyToProject(${project.id})">
                        Apply to Join
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="app.viewProject(${project.id})">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Filter users
    filterUsers() {
        const searchTerm = document.getElementById('userSearch').value.toLowerCase();
        const skillsFilter = document.getElementById('userSkills').value;
        
        const filteredUsers = this.users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                                user.university.toLowerCase().includes(searchTerm) ||
                                user.skills.some(skill => skill.toLowerCase().includes(searchTerm));
            
            const matchesSkills = skillsFilter === 'all' || user.skills.includes(skillsFilter);
            
            return matchesSearch && matchesSkills;
        });
        
        this.renderFilteredUsers(filteredUsers);
    }

    // Render filtered users
    renderFilteredUsers(users) {
        const container = document.getElementById('usersGrid');
        
        if (users.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No users found</h3>
                    <p>Try adjusting your search criteria or filters</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = users.map(user => `
            <div class="user-card card fade-in">
                <div class="user-avatar large">
                    <i class="fas fa-user"></i>
                </div>
                <h3>${user.name}</h3>
                <div class="user-title">${user.university} • ${user.branch}</div>
                <p class="user-bio">${user.bio}</p>
                <div class="user-skills">
                    ${user.skills.map(skill => `
                        <span class="skill-tag">${skill}</span>
                    `).join('')}
                </div>
                <div class="user-stats">
                    <span><i class="fas fa-star"></i> ${user.stats.rating}/5</span>
                    <span><i class="fas fa-users"></i> ${user.stats.connections} connections</span>
                    <span><i class="fas fa-trophy"></i> Level ${user.stats.level}</span>
                </div>
                <button class="btn btn-primary btn-block" onclick="app.connectWithUser(${user.id})">
                    Connect
                </button>
            </div>
        `).join('');
    }

    // Switch workspace tab
    switchWorkspaceTab(e) {
        const tabName = e.target.getAttribute('data-tab');
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    // Send chat message
    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        const newMessage = {
            id: Date.now(),
            sender: { id: this.currentUser.id, name: this.currentUser.name },
            message: message,
            timestamp: new Date()
        };
        
        this.chatMessages.push(newMessage);
        this.loadChatMessages();
        
        // Clear input
        input.value = '';
        
        // Simulate reply after 1-3 seconds
        setTimeout(() => {
            const replies = [
                "That's a great idea!",
                "I'll work on that part",
                "Can we schedule a meeting to discuss this?",
                "I found a useful resource for this"
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const replyMessage = {
                id: Date.now() + 1,
                sender: { id: 2, name: 'Sarah Chen' },
                message: randomReply,
                timestamp: new Date()
            };
            
            this.chatMessages.push(replyMessage);
            this.loadChatMessages();
        }, 1000 + Math.random() * 2000);
    }

    // Apply to project
    applyToProject(projectId) {
        if (!this.currentUser) {
            this.showToast('Please log in to apply to projects', 'warning');
            window.location.hash = 'login';
            return;
        }
        
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            this.showToast(`Application sent to ${project.title}`, 'success');
        }
    }

    // View project details
    viewProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            this.currentProject = project;
            window.location.hash = 'workspace';
        }
    }

    // Connect with user
    connectWithUser(userId) {
        if (!this.currentUser) {
            this.showToast('Please log in to connect with users', 'warning');
            window.location.hash = 'login';
            return;
        }
        
        const user = this.users.find(u => u.id === userId);
        if (user) {
            this.showToast(`Connection request sent to ${user.name}`, 'success');
            
            // Update user stats
            this.currentUser.stats.connections++;
            this.setCurrentUser(this.currentUser);
            
            // Update dashboard if visible
            if (window.location.hash === '#dashboard') {
                document.getElementById('connectionsCount').textContent = this.currentUser.stats.connections;
            }
        }
    }
}

// Initialize the application
const app = new CollabSync();

// Make app globally available for onclick handlers
window.app = app;
