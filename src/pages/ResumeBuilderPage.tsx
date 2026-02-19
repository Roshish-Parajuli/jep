import React, { useState, useRef } from 'react';
import {
    Plus,
    Trash2,
    ArrowLeft,
    User,
    Briefcase,
    GraduationCap,
    Wrench,
    Mail,
    Phone,
    Globe,
    MapPin,
    Eye,
    Settings,
    FileDown,
    Layout,
    Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 200 Well-known Skills for Suggesion
const SUGGESTED_SKILLS = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++", "C#", "Go", "Rust",
    "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "AWS", "Azure", "Google Cloud",
    "Docker", "Kubernetes", "Git", "GitHub", "GitLab", "CI/CD", "Jenkins", "Scrum", "Agile", "Kanban",
    "Project Management", "Product Management", "UI Design", "UX Design", "Figma", "Adobe XD", "Photoshop", "Illustrator", "Sketch", "Prototyping",
    "Data Analysis", "Machine Learning", "Deep Learning", "Artificial Intelligence", "Natural Language Processing", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
    "Tableau", "Power BI", "Excel", "Google Sheets", "R", "Statistics", "Calculus", "Linear Algebra", "Matlab", "Latex",
    "Marketing", "Digital Marketing", "SEO", "SEM", "Content Strategy", "Social Media Management", "Email Marketing", "Copywriting", "Branding", "Public Relations",
    "Sales", "Business Development", "Customer Relationship Management (CRM)", "Salesforce", "Lead Generation", "Negotiation", "Account Management", "Market Research", "Financial Analysis", "Accounting",
    "Human Resources", "Recruitment", "Talent Management", "Employee Relations", "Payroll", "Onboarding", "Conflict Resolution", "Strategic Planning", "Leadership", "Teamwork",
    "Communication", "Public Speaking", "Writing", "Editing", "Proofreading", "Translation", "Customer Service", "Technical Support", "Troubleshooting", "Quality Assurance",
    "Unit Testing", "Integration Testing", "End-to-End Testing", "Cypress", "Jest", "Mocha", "Selenium", "Appium", "Mobile App Development", "Swift",
    "Kotlin", "Objective-C", "React Native", "Flutter", "Ionic", "Responsive Web Design", "HTML5", "CSS3", "SASS", "Tailwind CSS",
    "Bootstrap", "Material UI", "Ant Design", "Web Accessibility (A11y)", "Progressive Web Apps (PWA)", "GraphQL", "REST API", "Microservices", "Serverless", "Security",
    "Cybersecurity", "Penetration Testing", "Ethical Hacking", "Cryptography", "Network Security", "Information Security", "Linux", "Unix", "Bash Scripting", "PowerShell",
    "System Administration", "DevOps", "Site Reliability Engineering (SRE)", "Terraform", "Ansible", "Puppet", "Chef", "Cloudformation", "Monitoring", "Logging",
    "Prometheus", "Grafana", "ELK Stack", "Digital Transformation", "Cloud Computing", "Big Data", "Spark", "Hadoop", "Kafka", "Data Engineering",
    "ETL", "Data Warehousing", "Snowflake", "BigQuery", "Redshift", "Blockchain", "Solidity", "Smart Contracts", "Ethereum", "Web3",
    "Solana", "NFTs", "DeFi", "Economics", "Game Development", "Unity", "Unreal Engine", "C", "Embedded Systems", "Robotics",
    "IoT", "Computer Vision", "AR/VR", "3D Modeling", "Blender", "AutoCAD", "SolidWorks", "MATLAB", "Simulation", "Systems Engineering",
    "English", "Spanish", "French", "German", "Chinese", "Japanese", "Arabic", "Russian", "Portuguese", "Hindi",
    "Time Management", "Critical Thinking", "Problem Solving", "Creativity", "Adaptability", "Emotional Intelligence", "Multi-tasking", "Decision Making", "Innovation", "Ethics"
];

interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface Education {
    id: string;
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
}

type ThemeType = 'modern' | 'europass';

const ResumeBuilderPage: React.FC = () => {
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        website: '',
        location: '',
        summary: '',
        profileImage: ''
    });

    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [educations, setEducations] = useState<Education[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [theme, setTheme] = useState<ThemeType>('modern');
    const [accentColor, setAccentColor] = useState('#4f46e5'); // Indigo-600

    const resumeRef = useRef<HTMLDivElement>(null);

    const addExperience = () => {
        setExperiences([...experiences, {
            id: Math.random().toString(36).substr(2, 9),
            company: '',
            role: '',
            startDate: '',
            endDate: '',
            current: false,
            description: ''
        }]);
    };

    const removeExperience = (id: string) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    const updateExperience = (id: string, field: keyof Experience, value: any) => {
        setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };

    const addEducation = () => {
        setEducations([...educations, {
            id: Math.random().toString(36).substr(2, 9),
            school: '',
            degree: '',
            startDate: '',
            endDate: ''
        }]);
    };

    const removeEducation = (id: string) => {
        setEducations(educations.filter(edu => edu.id !== id));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    };

    const addSkill = (skillToAdd: string) => {
        const cleanSkill = skillToAdd.trim();
        if (cleanSkill && !skills.includes(cleanSkill)) {
            setSkills([...skills, cleanSkill]);
            setNewSkill('');
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const downloadPDF = async () => {
        if (!resumeRef.current) return;
        const canvas = await html2canvas(resumeRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${personalInfo.fullName || 'Resume'}.pdf`);
    };

    const downloadWord = () => {
        if (!resumeRef.current) return;
        const html = resumeRef.current.innerHTML;
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
            "xmlns:w='urn:schemas-microsoft-com:office:word' " +
            "xmlns='http://www.w3.org/TR/REC-html40'>" +
            "<head><meta charset='utf-8'><title>Resume</title></head><body>";
        const footer = "</body></html>";
        const sourceHTML = header + html + footer;

        const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
        const fileDownload = document.createElement("a");
        document.body.appendChild(fileDownload);
        fileDownload.href = source;
        fileDownload.download = `${personalInfo.fullName || 'Resume'}.doc`;
        fileDownload.click();
        document.body.removeChild(fileDownload);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <ArrowLeft size={20} className="text-slate-600" />
                        <span className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Back to Hub</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold">
                            RB
                        </div>
                        <span className="text-lg font-bold">Premium Resume Builder</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={downloadPDF}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-700 bg-white text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <FileDown size={16} className="text-rose-500" /> PDF
                        </button>
                        <button
                            onClick={downloadWord}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-700 bg-white text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <FileDown size={16} className="text-blue-500" /> Word
                        </button>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-4">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                    {/* Editor Sidebar */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        <div className="space-y-6">
                            {/* Theme Choice */}
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b pb-4">
                                    <Layout size={20} className="text-indigo-600" /> Choose Theme
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setTheme('modern')}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${theme === 'modern' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                                    >
                                        <div className="font-bold text-slate-900">Modern Professional</div>
                                        <div className="text-xs text-slate-500 mt-1">Clean, colorful, and high-impact design.</div>
                                    </button>
                                    <button
                                        onClick={() => setTheme('europass')}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${theme === 'europass' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-200'}`}
                                    >
                                        <div className="font-bold text-slate-900">Europass CV</div>
                                        <div className="text-xs text-slate-500 mt-1">Standard European format, structured and official.</div>
                                    </button>
                                </div>
                            </section>

                            {/* Personal Info */}
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b pb-4">
                                    <User size={20} className="text-indigo-600" /> Personal Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                        <input
                                            type="text"
                                            value={personalInfo.fullName}
                                            onChange={e => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                        <input
                                            type="email"
                                            value={personalInfo.email}
                                            onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                                        <input
                                            type="text"
                                            value={personalInfo.phone}
                                            onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Website/LinkedIn</label>
                                        <input
                                            type="text"
                                            value={personalInfo.website}
                                            onChange={e => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="linkedin.com/in/johndoe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                                        <input
                                            type="text"
                                            value={personalInfo.location}
                                            onChange={e => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Professional Summary</label>
                                        <textarea
                                            value={personalInfo.summary}
                                            onChange={e => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                                            className="w-full h-32 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm"
                                            placeholder="Tell us about your professional background..."
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Experience */}
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex justify-between items-center mb-6 border-b pb-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Briefcase size={20} className="text-indigo-600" /> Work Experience
                                    </h3>
                                    <button
                                        onClick={addExperience}
                                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {experiences.map((exp) => (
                                        <div key={exp.id} className="relative p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                            <button
                                                onClick={() => removeExperience(exp.id)}
                                                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
                                                    <input
                                                        type="text"
                                                        value={exp.company}
                                                        onChange={e => updateExperience(exp.id, 'company', e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
                                                    <input
                                                        type="text"
                                                        value={exp.role}
                                                        onChange={e => updateExperience(exp.id, 'role', e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                                                    <input
                                                        type="month"
                                                        value={exp.startDate}
                                                        onChange={e => updateExperience(exp.id, 'startDate', e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase flex justify-between items-center">
                                                        <span>End Date</span>
                                                        <label className="ml-4 lowercase font-normal flex items-center gap-1 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={exp.current}
                                                                onChange={e => updateExperience(exp.id, 'current', e.target.checked)}
                                                            />
                                                            Present
                                                        </label>
                                                    </label>
                                                    {!exp.current && (
                                                        <input
                                                            type="month"
                                                            value={exp.endDate}
                                                            onChange={e => updateExperience(exp.id, 'endDate', e.target.value)}
                                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                                                        />
                                                    )}
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                                    <textarea
                                                        value={exp.description}
                                                        onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                                                        className="w-full h-24 px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none resize-none text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {experiences.length === 0 && (
                                        <div className="text-center py-6 text-slate-400 italic">
                                            No experience added yet.
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Skills with Auto-Suggest */}
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b pb-4">
                                    <Wrench size={20} className="text-indigo-600" /> Skills
                                </h3>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={newSkill}
                                            onChange={e => setNewSkill(e.target.value)}
                                            list="suggested-skills"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                                            placeholder="Type a skill (e.g. React, Project Management...)"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addSkill(newSkill);
                                                }
                                            }}
                                        />
                                        <datalist id="suggested-skills">
                                            {SUGGESTED_SKILLS.map(s => <option key={s} value={s} />)}
                                        </datalist>
                                        <button
                                            onClick={() => addSkill(newSkill)}
                                            className="absolute right-2 top-2 px-4 py-1.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors text-sm"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {skills.map(skill => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold flex items-center gap-2 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                                            >
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} className="hover:text-rose-600 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Education */}
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex justify-between items-center mb-6 border-b pb-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <GraduationCap size={20} className="text-indigo-600" /> Education
                                    </h3>
                                    <button
                                        onClick={addEducation}
                                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {educations.map((edu) => (
                                        <div key={edu.id} className="relative p-4 border border-slate-100 rounded-xl bg-slate-50/50">
                                            <button
                                                onClick={() => removeEducation(edu.id)}
                                                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">School/University</label>
                                                    <input
                                                        type="text"
                                                        value={edu.school}
                                                        onChange={e => updateEducation(edu.id, 'school', e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Degree</label>
                                                    <input
                                                        type="text"
                                                        value={edu.degree}
                                                        onChange={e => updateEducation(edu.id, 'degree', e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                                                    <input
                                                        type="month"
                                                        value={edu.startDate}
                                                        onChange={e => updateEducation(edu.id, 'startDate', e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">End Date</label>
                                                    <input
                                                        type="month"
                                                        value={edu.endDate}
                                                        onChange={e => updateEducation(edu.id, 'endDate', e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {educations.length === 0 && (
                                        <div className="text-center py-6 text-slate-400 italic">
                                            No education added yet.
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Design Settings */}
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b pb-4">
                                    <Settings size={20} className="text-indigo-600" /> Design Settings
                                </h3>
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-bold text-slate-600">Accent Color:</label>
                                    <div className="flex gap-2 text-sm">
                                        {['#4f46e5', '#0891b2', '#059669', '#dc2626', '#d97706', '#9333ea'].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setAccentColor(color)}
                                                className={`w-8 h-8 rounded-full border-2 transition-all ${accentColor === color ? 'border-slate-900 scale-110' : 'border-transparent'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            value={accentColor}
                                            onChange={e => setAccentColor(e.target.value)}
                                            className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-none overflow-hidden hover:scale-110 transition-transform"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Preview Panel (Desktop-only live preview) */}
                    <div className="w-full lg:w-1/2">
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Check size={14} className="text-emerald-500" /> Live Professional Preview
                                </span>
                            </div>
                            <div className="bg-slate-200 p-8 rounded-3xl overflow-auto max-h-[calc(100vh-160px)] shadow-inner">
                                <PreviewComponent
                                    personalInfo={personalInfo}
                                    experiences={experiences}
                                    educations={educations}
                                    skills={skills}
                                    accentColor={accentColor}
                                    theme={theme}
                                    resumeRef={resumeRef}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

const PreviewComponent: React.FC<{
    personalInfo: any;
    experiences: Experience[];
    educations: Education[];
    skills: string[];
    accentColor: string;
    theme: ThemeType;
    resumeRef: React.RefObject<HTMLDivElement>;
}> = ({ personalInfo, experiences, educations, skills, accentColor, theme, resumeRef }) => {

    if (theme === 'europass') {
        return (
            <div ref={resumeRef} className="bg-white w-full shadow-2xl overflow-hidden text-slate-900 font-sans flex text-[12px] leading-tight" style={{ minHeight: '842px', width: '595px', margin: '0 auto' }}>
                {/* Main Layout Area */}
                <div className="flex w-full">
                    {/* Left Sidebar */}
                    <div className="w-[180px] bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-6">
                        <div className="w-20 h-20 bg-slate-200 rounded-lg mx-auto flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                            <User size={40} className="text-slate-400" />
                        </div>

                        <section>
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">Contact</h2>
                            <div className="space-y-3">
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-slate-500 text-[9px] uppercase">Email</span>
                                    <span className="break-all">{personalInfo.email || '-'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-slate-500 text-[9px] uppercase">Phone</span>
                                    <span>{personalInfo.phone || '-'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-bold text-slate-500 text-[9px] uppercase">Address</span>
                                    <span>{personalInfo.location || '-'}</span>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-1">Skills</h2>
                            <div className="flex flex-wrap gap-1">
                                {skills.map(skill => (
                                    <span key={skill} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px]">{skill}</span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Side */}
                    <div className="flex-1 p-8">
                        <header className="mb-8 border-b-2 pb-4" style={{ borderColor: accentColor }}>
                            <h1 className="text-2xl font-black text-slate-900 uppercase">{personalInfo.fullName || 'FULL NAME'}</h1>
                            <p className="text-sm font-bold mt-1" style={{ color: accentColor }}>Professional Curriculum Vitae</p>
                        </header>

                        <section className="mb-8">
                            <h2 className="text-[11px] font-black uppercase text-indigo-900 mb-4 bg-indigo-50/50 p-1 px-2 border-l-4" style={{ borderLeftColor: accentColor }}>About Me</h2>
                            <p className="text-slate-600 italic">
                                {personalInfo.summary || 'I am a highly motivated professional...'}
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-[11px] font-black uppercase text-indigo-900 mb-4 bg-indigo-50/50 p-1 px-2 border-l-4" style={{ borderLeftColor: accentColor }}>Work Experience</h2>
                            <div className="space-y-6">
                                {experiences.map(exp => (
                                    <div key={exp.id} className="grid grid-cols-[100px_1fr] gap-4">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                                            {exp.startDate || '-'} / {exp.current ? 'Present' : (exp.endDate || '-')}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 uppercase text-[11px]">{exp.role || 'Role'}</h3>
                                            <div className="text-indigo-600 font-bold mb-2">{exp.company || 'Company'}</div>
                                            <p className="text-slate-600 text-[11px] whitespace-pre-wrap">{exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-black uppercase text-indigo-900 mb-4 bg-indigo-50/50 p-1 px-2 border-l-4" style={{ borderLeftColor: accentColor }}>Education</h2>
                            <div className="space-y-6">
                                {educations.map(edu => (
                                    <div key={edu.id} className="grid grid-cols-[100px_1fr] gap-4">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                                            {edu.startDate || '-'} / {edu.endDate || '-'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 uppercase text-[11px]">{edu.degree || 'Degree'}</h3>
                                            <div className="text-indigo-600 font-bold mb-1">{edu.school || 'School'}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }

    // Default Modern Theme
    return (
        <div
            ref={resumeRef}
            className="bg-white w-full aspect-[1/1.414] shadow-2xl overflow-hidden text-slate-800 flex flex-col"
            style={{ minHeight: '840px' }}
        >
            {/* Header */}
            <div className="p-10 text-white" style={{ backgroundColor: accentColor }}>
                <h1 className="text-4xl font-black mb-4 uppercase tracking-wider">{personalInfo.fullName || 'YOUR NAME'}</h1>
                <div className="grid grid-cols-2 gap-y-2 text-sm opacity-90">
                    <div className="flex items-center gap-2"><Mail size={14} /> {personalInfo.email || 'email@example.com'}</div>
                    <div className="flex items-center gap-2"><Phone size={14} /> {personalInfo.phone || '+0 000 000 000'}</div>
                    <div className="flex items-center gap-2"><Globe size={14} /> {personalInfo.website || 'website.com'}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} /> {personalInfo.location || 'Location'}</div>
                </div>
            </div>

            <div className="flex-grow p-10 flex flex-col gap-8 text-sm">
                {/* Summary */}
                {personalInfo.summary && (
                    <section>
                        <h2 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: accentColor }}>Summary</h2>
                        <div className="w-12 h-1 mb-3" style={{ backgroundColor: accentColor }}></div>
                        <p className="leading-relaxed text-slate-600 italic">
                            {personalInfo.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                <section>
                    <h2 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>Experience</h2>
                    <div className="space-y-6">
                        {experiences.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-900">{exp.role || 'Position Name'}</h3>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                                        {exp.startDate || '-'} — {exp.current ? 'Present' : (exp.endDate || '-')}
                                    </span>
                                </div>
                                <div className="text-xs font-bold opacity-75 mb-2">{exp.company || 'Company Name'}</div>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-[12px]">
                                    {exp.description || 'Describe your responsibilities and achievements...'}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h2 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>Education</h2>
                    <div className="space-y-4">
                        {educations.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-900">{edu.school || 'University Name'}</h3>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                                        {edu.startDate || '-'} — {edu.endDate || '-'}
                                    </span>
                                </div>
                                <div className="text-xs opacity-75">{edu.degree || 'Degree Program'}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Skills */}
                <section>
                    <h2 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>Core Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-bold uppercase tracking-tight">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 text-center">
                <p className="text-[9px] text-slate-300 font-medium uppercase tracking-widest">Digital Hub Premium Resume Export — micro-saas.online</p>
            </div>
        </div>
    );
};

export default ResumeBuilderPage;
