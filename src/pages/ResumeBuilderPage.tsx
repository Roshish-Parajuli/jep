import React, { useState, useRef } from 'react';
import {
    Plus,
    Trash2,
    Download,
    ArrowLeft,
    User,
    Briefcase,
    GraduationCap,
    Wrench,
    Mail,
    Phone,
    Globe,
    MapPin,
    FileText,
    Eye,
    Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';

interface Experience {
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
}

interface Education {
    id: string;
    school: string;
    degree: string;
    duration: string;
}

const ResumeBuilderPage: React.FC = () => {
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        website: '',
        location: '',
        summary: ''
    });

    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [educations, setEducations] = useState<Education[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [accentColor, setAccentColor] = useState('#4f46e5'); // Indigo-600

    const resumeRef = useRef<HTMLDivElement>(null);

    const addExperience = () => {
        setExperiences([...experiences, {
            id: Math.random().toString(36).substr(2, 9),
            company: '',
            role: '',
            duration: '',
            description: ''
        }]);
    };

    const removeExperience = (id: string) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    const updateExperience = (id: string, field: keyof Experience, value: string) => {
        setExperiences(experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
    };

    const addEducation = () => {
        setEducations([...educations, {
            id: Math.random().toString(36).substr(2, 9),
            school: '',
            degree: '',
            duration: ''
        }]);
    };

    const removeEducation = (id: string) => {
        setEducations(educations.filter(edu => edu.id !== id));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setEducations(educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
    };

    const addSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill));
    };

    const downloadResume = async () => {
        if (!resumeRef.current) return;

        // Scale for better quality
        const canvas = await html2canvas(resumeRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        const link = document.createElement('a');
        link.download = `${personalInfo.fullName || 'Resume'}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
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
                    <button
                        onClick={downloadResume}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <Download size={16} /> Download
                    </button>
                </div>
            </nav>

            <main className="pt-24 pb-20 px-4">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                    {/* Editor Sidebar */}
                    <div className="w-full lg:w-1/2 space-y-6">
                        {/* Tabs */}
                        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                            <button
                                onClick={() => setActiveTab('edit')}
                                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'edit' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                <FileText size={18} /> Edit Content
                            </button>
                            <button
                                onClick={() => setActiveTab('preview')}
                                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'preview' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                <Eye size={18} /> Live Preview
                            </button>
                        </div>

                        <div className={activeTab === 'preview' ? 'hidden' : 'space-y-6'}>
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
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Professional Summary</label>
                                        <textarea
                                            value={personalInfo.summary}
                                            onChange={e => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                                            className="w-full h-32 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                            placeholder="Tell us about yourself..."
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
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                                                    <input
                                                        type="text"
                                                        value={exp.duration}
                                                        onChange={e => updateExperience(exp.id, 'duration', e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                                                        placeholder="Jan 2020 - Present"
                                                    />
                                                </div>
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                                    <textarea
                                                        value={exp.description}
                                                        onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                                                        className="w-full h-24 px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none resize-none"
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

                            {/* Skills */}
                            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b pb-4">
                                    <Wrench size={20} className="text-indigo-600" /> Skills
                                </h3>
                                <form onSubmit={addSkill} className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={e => setNewSkill(e.target.value)}
                                        className="flex-grow px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                                        placeholder="E.g. React, Python, Project Management"
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                                    >
                                        Add
                                    </button>
                                </form>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map(skill => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold flex items-center gap-2"
                                        >
                                            {skill}
                                            <button onClick={() => removeSkill(skill)} className="hover:text-rose-600">
                                                <Trash2 size={14} />
                                            </button>
                                        </span>
                                    ))}
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
                                                    <label className="text-xs font-bold text-slate-500 uppercase">Duration</label>
                                                    <input
                                                        type="text"
                                                        value={edu.duration}
                                                        onChange={e => updateEducation(edu.id, 'duration', e.target.value)}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none"
                                                        placeholder="2016 - 2020"
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
                                    <div className="flex gap-2">
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
                                            className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-none overflow-hidden"
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className={activeTab === 'edit' ? 'hidden' : 'lg:hidden'}>
                            {/* Mobile Preview is shown here */}
                            <PreviewComponent
                                personalInfo={personalInfo}
                                experiences={experiences}
                                educations={educations}
                                skills={skills}
                                accentColor={accentColor}
                                resumeRef={resumeRef}
                            />
                        </div>
                    </div>

                    {/* Preview Panel (Desktop) */}
                    <div className="hidden lg:block w-full lg:w-1/2">
                        <div className="sticky top-24">
                            <div className="bg-slate-200 p-8 rounded-3xl overflow-auto max-h-[calc(100vh-160px)] shadow-inner">
                                <PreviewComponent
                                    personalInfo={personalInfo}
                                    experiences={experiences}
                                    educations={educations}
                                    skills={skills}
                                    accentColor={accentColor}
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
    resumeRef: React.RefObject<HTMLDivElement>;
}> = ({ personalInfo, experiences, educations, skills, accentColor, resumeRef }) => {
    return (
        <div
            ref={resumeRef}
            className="bg-white w-full aspect-[1/1.414] shadow-2xl overflow-hidden text-slate-800 flex flex-col"
            style={{ minHeight: '800px' }}
        >
            {/* Header */}
            <div className="p-12 text-white" style={{ backgroundColor: accentColor }}>
                <h1 className="text-4xl font-black mb-4 uppercase tracking-wider">{personalInfo.fullName || 'YOUR NAME'}</h1>
                <div className="grid grid-cols-2 gap-y-2 text-sm opacity-90">
                    <div className="flex items-center gap-2"><Mail size={14} /> {personalInfo.email || 'email@example.com'}</div>
                    <div className="flex items-center gap-2"><Phone size={14} /> {personalInfo.phone || '+0 000 000 000'}</div>
                    <div className="flex items-center gap-2"><Globe size={14} /> {personalInfo.website || 'website.com'}</div>
                    <div className="flex items-center gap-2"><MapPin size={14} /> {personalInfo.location || 'Location'}</div>
                </div>
            </div>

            <div className="flex-grow p-12 flex flex-col gap-8">
                {/* Summary */}
                {personalInfo.summary && (
                    <section>
                        <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: accentColor }}>Summary</h2>
                        <p className="text-sm leading-relaxed text-slate-600 italic">
                            {personalInfo.summary}
                        </p>
                    </section>
                )}

                {/* Experience */}
                <section>
                    <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>Experience</h2>
                    <div className="space-y-6">
                        {experiences.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-900">{exp.role || 'Position Name'}</h3>
                                    <span className="text-xs font-bold text-slate-400">{exp.duration || '2020 - Present'}</span>
                                </div>
                                <div className="text-sm font-bold opacity-75 mb-2">{exp.company || 'Company Name'}</div>
                                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                    {exp.description || 'Job responsibility description goes here...'}
                                </p>
                            </div>
                        ))}
                        {experiences.length === 0 && (
                            <p className="text-sm text-slate-400 italic">No experience added yet.</p>
                        )}
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>Education</h2>
                    <div className="space-y-4">
                        {educations.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-900">{edu.school || 'University Name'}</h3>
                                    <span className="text-xs font-bold text-slate-400">{edu.duration || '2016 - 2020'}</span>
                                </div>
                                <div className="text-sm opacity-75">{edu.degree || 'Degree Program'}</div>
                            </div>
                        ))}
                        {educations.length === 0 && (
                            <p className="text-sm text-slate-400 italic">No education added yet.</p>
                        )}
                    </div>
                </section>

                {/* Skills */}
                <section>
                    <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: accentColor }}>Core Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold uppercase tracking-tight">
                                {skill}
                            </span>
                        ))}
                        {skills.length === 0 && (
                            <p className="text-sm text-slate-400 italic">No skills listed.</p>
                        )}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-300 font-medium uppercase tracking-widest">Generated by Micro-SaaS.online Premium Resume Builder</p>
            </div>
        </div>
    );
};

export default ResumeBuilderPage;
