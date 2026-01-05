import React, { useContext } from "react";
import { Settings as SettingsIcon, Sun, Moon } from "lucide-react";
import { ThemeContext } from "../context/ThemeContext";

export default function Settings() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <div className="container py-12 animate-fade-in">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 bg-slate-100 shadow-xl rounded-3xl flex items-center justify-center text-slate-900 border border-white/50">
                        <SettingsIcon size={32} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Settings</h2>
                        <p className="text-slate-500 mt-1 italic">Personalize your experience</p>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="glass-panel p-8 mb-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Appearance</h3>
                    <div className="flex items-center justify-between p-4 rounded-2xl border transition-colors shadow-sm" style={{ backgroundColor: 'var(--bg-gradient)', borderColor: 'var(--border)' }}>
                        <div className="flex items-center gap-4">
                            <div className="text-slate-900">{theme === "light" ? <Sun size={24} /> : <Moon size={24} />}</div>
                            <div>
                                <div className="font-bold text-slate-900">Dark Mode</div>
                                <div className="text-xs text-slate-400">Reduce eye strain in low light</div>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${theme === "dark" ? "bg-indigo-600" : "bg-slate-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Contact/Developer Section */}
                <div className="glass-panel p-8">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Connect with Developer</h3>
                    <div className="space-y-4">
                        <a
                            href="https://t.me/chydevit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100 hover:bg-blue-50 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.15-.31.29-.46.43-1.62 1.48-3.23 2.96-4.85 4.44-.24.22-.48.24-.73.02-.34-.31-.69-.62-1.04-.93-.16-.14-.23-.33-.09-.54.14-.21.34-.14.52.02.24.22.48.44.72.66.02.02.04.05.07.03 1.25-1.14 2.5-2.28 3.75-3.41.05-.04.11-.08.16-.13.19-.17.38-.17.57 0 .19.17.18.36-.02.55z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Telegram</div>
                                    <div className="text-xs text-slate-400">@chydevit</div>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>

                        <a
                            href="https://github.com/chydevit"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800 hover:bg-black transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-bold text-white transition-colors">GitHub</div>
                                    <div className="text-xs text-slate-400">@chydevit</div>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
