
// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Mock database
let users = [
    {
        id: 1,
        email: 'demo@university.edu',
        password: 'password',
        name: 'Demo User',
        university: 'Stanford University',
        branch: 'Computer Science',
        year: 2024,
        skills: ['React', 'Node.js', 'Python', 'MongoDB'],
        interests: ['AI', 'Web Development', 'Startups'],
        bio: 'Passionate full-stack developer looking to build amazing projects!',
        verification: { status: 'verified', universityDomain: 'stanford.edu' },
        stats: { xp: 1250, level: 12, completedProjects: 5, rating: 4.7, connections: 23 },
        badges: ['Early Adopter', 'Project Champion', 'Team Player'],
        availability: 'available',
        github: 'demouser'
    }
];

let projects = [
    {
        id: 1,
        title: 'AI-Powered Study Planner',
        description: 'Building an intelligent study scheduler that uses machine learning to optimize study sessions and improve learning outcomes.',
        ownerId: 1,
        requiredRoles: [
            { role: 'Frontend Developer', count: 2, skills: ['React', 'TypeScript', 'Tailwind'] },
            { role: 'Backend Developer', count: 1, skills: ['Node.js', 'MongoDB', 'Python'] },
            { role: 'ML Engineer', count: 1, skills: ['Python', 'TensorFlow', 'scikit-learn'] }
        ],
        techStack: ['React', 'Node.js', 'MongoDB', 'TensorFlow', 'Python'],
        status: 'recruiting',
        teamMembers: [1],
        applications: [],
        collaborationType: 'hybrid',
        timeline: {
            start: new Date('2024-01-15'),
            end: new Date('2024-06-30')
        },
        vibe: 'serious',
        university: 'Stanford University',
        githubRepo: 'https://github.com/demouser/study-planner',
        createdAt: new Date('2024-01-15')
    }
];

let messages = {};
let onlineUsers = new Set();

// Authentication routes
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            user: userWithoutPassword,
            token: 'mock-jwt-token'
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password, university, branch, year } = req.body;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return res.status(409).json({
            success: false,
            message: 'User already exists with this email'
        });
    }
    
    // Validate university email
    if (!email.includes('.edu')) {
        return res.status(400).json({
            success: false,
            message: 'Please use a valid university email address'
        });
    }
    
    const newUser = {
        id: users.length + 1,
        email,
        password,
        name,
        university,
        branch,
        year: parseInt(year),
        skills: [],
        interests: [],
        bio: '',
        verification: {
            status: 'pending',
            universityDomain: email.split('@')[1]
        },
        stats: {
            xp: 0,
            level: 1,
            completedProjects: 0,
            rating: 0,
            connections: 0
        },
        badges: [],
        availability: 'available',
        createdAt: new Date()
    };
    
    users.push(newUser);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.json({
        success: true,
        user: userWithoutPassword,
        token: 'mock-jwt-token'
    });
});

// Projects routes
app.get('/api/projects', (req, res) => {
    const { search, status, university } = req.query;
    
    let filteredProjects = projects;
    
    if (search) {
        filteredProjects = filteredProjects.filter(project =>
            project.title.toLowerCase().includes(search.toLowerCase()) ||
            project.description.toLowerCase().includes(search.toLowerCase()) ||
            project.techStack.some(tech => tech.toLowerCase().includes(search.toLowerCase()))
        );
    }
    
    if (status && status !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.status === status);
    }
    
    if (university && university !== 'all') {
        filteredProjects = filteredProjects.filter(project => project.university === university);
    }
    
    // Enrich projects with owner details
    const enrichedProjects = filteredProjects.map(project => {
        const owner = users.find(user => user.id === project.ownerId);
        return {
            ...project,
            owner: {
                id: owner.id,
                name: owner.name,
                university: owner.university
            }
        };
    });
    
    res.json({
        success: true,
        projects: enrichedProjects
    });
});

app.post('/api/projects', (req, res) => {
    const { title, description, techStack, requiredRoles, timeline, vibe } = req.body;
    const userId = req.headers['user-id'] || 1; // In real app, get from JWT
    
    const newProject = {
        id: projects.length + 1,
        title,
        description,
        ownerId: parseInt(userId),
        requiredRoles,
        techStack,
        status: 'recruiting',
        teamMembers: [parseInt(userId)],
        applications: [],
        collaborationType: 'remote',
        timeline: {
            start: new Date(),
            end: new Date(Date.now() + timeline * 7 * 24 * 60 * 60 * 1000) // weeks to milliseconds
        },
        vibe,
        university: users.find(u => u.id === parseInt(userId))?.university || 'Unknown University',
        createdAt: new Date()
    };
    
    projects.push(newProject);
    
    // Update user stats
    const user = users.find(u => u.id === parseInt(userId));
    if (user) {
        user.stats.completedProjects += 1;
        user.stats.xp += 100;
    }
    
    res.json({
        success: true,
        project: newProject
    });
});

app.post('/api/projects/:id/apply', (req, res) => {
    const projectId = parseInt(req.params.id);
    const { userId, message } = req.body;
    
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        return res.status(404).json({
            success: false,
            message: 'Project not found'
        });
    }
    
    // Check if user already applied
    const existingApplication = project.applications.find(app => app.userId === userId);
    if (existingApplication) {
        return res.status(409).json({
            success: false,
            message: 'You have already applied to this project'
        });
    }
    
    project.applications.push({
        userId,
        message,
        status: 'pending',
        appliedAt: new Date()
    });
    
    res.json({
        success: true,
        message: 'Application submitted successfully'
    });
});

// Users routes
app.get('/api/users', (req, res) => {
    const { search, skills, availability } = req.query;
    
    let filteredUsers = users.filter(user => user.id !== 1); // Exclude demo user
    
    if (search) {
        filteredUsers = filteredUsers.filter(user =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.university.toLowerCase().includes(search.toLowerCase()) ||
            user.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()))
        );
    }
    
    if (skills && skills !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.skills.includes(skills));
    }
    
    if (availability && availability !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.availability === availability);
    }
    
    // Remove passwords from response
    const usersWithoutPasswords = filteredUsers.map(({ password, ...user }) => user);
    
    res.json({
        success: true,
        users: usersWithoutPasswords
    });
});

app.post('/api/users/:id/connect', (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const { userId } = req.body;
    
    const targetUser = users.find(u => u.id === targetUserId);
    const requestingUser = users.find(u => u.id === userId);
    
    if (!targetUser || !requestingUser) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // In a real app, you'd have a connections system
    // For now, just update stats
    requestingUser.stats.connections += 1;
    targetUser.stats.connections += 1;
    
    res.json({
        success: true,
        message: `Connection request sent to ${targetUser.name}`
    });
});

// Chat routes
app.get('/api/projects/:id/messages', (req, res) => {
    const projectId = req.params.id;
    const projectMessages = messages[projectId] || [];
    
    // Enrich messages with user details
    const enrichedMessages = projectMessages.map(msg => {
        const user = users.find(u => u.id === msg.userId);
        return {
            ...msg,
            user: {
                id: user.id,
                name: user.name
            }
        };
    });
    
    res.json({
        success: true,
        messages: enrichedMessages
    });
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-project', (projectId) => {
        socket.join(`project-${projectId}`);
        console.log(`User ${socket.id} joined project ${projectId}`);
    });
    
    socket.on('leave-project', (projectId) => {
        socket.leave(`project-${projectId}`);
        console.log(`User ${socket.id} left project ${projectId}`);
    });
    
    socket.on('send-message', (data) => {
        const { projectId, userId, message } = data;
        
        // Store message
        if (!messages[projectId]) {
            messages[projectId] = [];
        }
        
        const newMessage = {
            id: messages[projectId].length + 1,
            userId,
            message,
            timestamp: new Date()
        };
        
        messages[projectId].push(newMessage);
        
        // Get user details for the message
        const user = users.find(u => u.id === userId);
        const messageWithUser = {
            ...newMessage,
            user: {
                id: user.id,
                name: user.name
            }
        };
        
        // Broadcast to everyone in the project room
        io.to(`project-${projectId}`).emit('new-message', messageWithUser);
    });
    
    socket.on('user-online', (userId) => {
        onlineUsers.add(userId);
        io.emit('online-users', Array.from(onlineUsers));
    });
    
    socket.on('user-offline', (userId) => {
        onlineUsers.delete(userId);
        io.emit('online-users', Array.from(onlineUsers));
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Dashboard routes
app.get('/api/dashboard/stats/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    const userProjects = projects.filter(p => p.teamMembers.includes(userId));
    const applications = projects.flatMap(p => 
        p.applications.filter(app => app.userId === userId)
    );
    
    res.json({
        success: true,
        stats: {
            projects: userProjects.length,
            connections: user.stats.connections,
            xp: user.stats.xp,
            applications: applications.length,
            level: user.stats.level
        }
    });
});

app.get('/api/dashboard/recommendations/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // Simple recommendation logic based on user skills
    const projectRecommendations = projects
        .filter(project => {
            // Projects that match user skills
            return project.techStack.some(tech => 
                user.skills.map(s => s.toLowerCase()).includes(tech.toLowerCase())
            );
        })
        .slice(0, 3)
        .map(project => {
            const owner = users.find(u => u.id === project.ownerId);
            return {
                ...project,
                owner: {
                    id: owner.id,
                    name: owner.name
                },
                matchScore: Math.floor(Math.random() * 20) + 80 // 80-99% match
            };
        });
    
    const buddyRecommendations = users
        .filter(u => u.id !== userId)
        .filter(buddy => {
            // Users with complementary skills
            return buddy.skills.some(skill => 
                !user.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
            );
        })
        .slice(0, 3)
        .map(buddy => {
            const { password, ...buddyWithoutPassword } = buddy;
            return {
                ...buddyWithoutPassword,
                matchScore: Math.floor(Math.random() * 15) + 85 // 85-99% match
            };
        });
    
    res.json({
        success: true,
        projectRecommendations,
        buddyRecommendations
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'CollabSync API is running',
        timestamp: new Date(),
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 CollabSync server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
    console.log(`💻 Frontend: http://localhost:${PORT}`);
});

module.exports = app;
