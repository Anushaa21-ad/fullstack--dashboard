import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, LogOut, Plus, Edit2, Trash2, Search, X, User, Mail, Lock, Sparkles } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [taskData, setTaskData] = useState({ title: '', description: '', status: 'pending', priority: 'medium' });
  const [profileData, setProfileData] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile();
      fetchTasks();
    }
  }, []);

  const fetchUserProfile = () => {
    setTimeout(() => {
      setUser({ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' });
      setProfileData({ name: 'John Doe', email: 'john@example.com', role: 'Developer' });
    }, 500);
  };

  const fetchTasks = () => {
    setLoading(true);
    setTimeout(() => {
      setTasks([
        { id: 1, title: 'Complete project documentation', description: 'Write comprehensive docs', status: 'pending', priority: 'high', createdAt: '2024-11-20' },
        { id: 2, title: 'Review pull requests', description: 'Review and merge PRs', status: 'completed', priority: 'medium', createdAt: '2024-11-19' },
        { id: 3, title: 'Update dependencies', description: 'Update npm packages', status: 'in-progress', priority: 'low', createdAt: '2024-11-18' }
      ]);
      setLoading(false);
    }, 800);
  };

  const handleRegister = () => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError('Please enter a valid email');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setSuccess('Registration successful! Please login.');
      setCurrentView('login');
      setLoading(false);
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
    }, 1000);
  };

  const handleLogin = () => {
    setLoading(true);
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const mockToken = 'mock-jwt-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser({ id: 1, name: 'John Doe', email: loginData.email, role: 'Developer' });
      setCurrentView('dashboard');
      setSuccess('Login successful!');
      setLoading(false);
      fetchTasks();
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setTasks([]);
    setCurrentView('login');
    setSuccess('Logged out successfully');
  };

  const handleCreateTask = () => {
    if (!taskData.title || !taskData.description) {
      setError('Title and description are required');
      return;
    }

    const task = { ...taskData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    setTasks([task, ...tasks]);
    setSuccess('Task created successfully');
    setTaskData({ title: '', description: '', status: 'pending', priority: 'medium' });
    closeModal('createModal');
  };

  // App.tsx
import React, { useEffect, useState } from "react";
import {
  Sparkles,
  AlertCircle,
  CheckCircle,
  Mail,
  Lock,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  User,
  LogOut,
} from "lucide-react"; // install lucide-react or replace with your icon lib

// Types
type TaskStatus = "pending" | "in-progress" | "completed";
type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

const nowString = () => new Date().toLocaleString();

const App: React.FC = () => {
  // Auth & view
  const [currentView, setCurrentView] = useState<"login" | "register" | "dashboard">("login");
  const [token, setToken] = useState<string | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Data
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    // seed sample
    {
      id: "1",
      title: "Sample Task",
      description: "This is a sample task",
      status: "pending",
      priority: "medium",
      createdAt: nowString(),
    },
  ]);

  // Forms
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [taskData, setTaskData] = useState({ title: "", description: "", status: "pending" as TaskStatus, priority: "low" as Priority });
  const [profileData, setProfileData] = useState({ name: "", email: "", role: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | TaskStatus | "in-progress">("all");

  // Helper: create id
  const uid = () => Math.random().toString(36).slice(2, 9);

  // CRUD handlers
  const handleCreateTask = () => {
    if (!taskData.title.trim()) {
      setError("Title is required");
      return;
    }
    const newTask: Task = {
      id: uid(),
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      createdAt: nowString(),
    };
    setTasks((s) => [newTask, ...s]);
    setTaskData({ title: "", description: "", status: "pending", priority: "low" });
    setSuccess("Task created successfully");
    setTimeout(() => setSuccess(""), 3000);
    closeModal("createModal");
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks((s) => s.map((task) => (task.id === id ? { ...task, ...updates } : task)));
    setSuccess("Task updated successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteTask = (id: string) => {
    if (!window.confirm("Are you sure?")) return;
    setTasks((s) => s.filter((task) => task.id !== id));
    setSuccess("Task deleted successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleUpdateProfile = () => {
    if (!user) return;
    const updated: User = { ...user, ...profileData };
    setUser(updated);
    setSuccess("Profile updated successfully");
    closeModal("profileModal");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Auth (mock)
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (!loginData.email || !loginData.password) {
        setError("Enter email and password");
        setLoading(false);
        return;
      }
      setToken("fake-jwt-token");
      const mockUser: User = { id: uid(), name: "John Doe", email: loginData.email };
      setUser(mockUser);
      setProfileData({ name: mockUser.name, email: mockUser.email, role: mockUser.role ?? "user" });
      setCurrentView("dashboard");
      setLoading(false);
      setSuccess("Logged in successfully");
      setTimeout(() => setSuccess(""), 3000);
    }, 700);
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    setTimeout(() => {
      setToken("fake-jwt-token");
      const newUser: User = { id: uid(), name: registerData.name || "User", email: registerData.email };
      setUser(newUser);
      setProfileData({ name: newUser.name, email: newUser.email, role: "user" });
      setCurrentView("dashboard");
      setLoading(false);
      setSuccess("Account created");
      setTimeout(() => setSuccess(""), 3000);
    }, 800);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setCurrentView("login");
    setSuccess("Logged out");
    setTimeout(() => setSuccess(""), 2000);
  };

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = task.title.toLowerCase().includes(term) || task.description.toLowerCase().includes(term);
    const matchesFilter = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Modals
  const openModal = (id: string) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("hidden");
  };

  const closeModal = (id: string) => {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("hidden");
    setError("");
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // UI: login/register pages
  if (currentView === "login" && !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 animate-bounce">
              <Sparkles className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Welcome Back</h1>
            <p className="text-gray-600 text-lg">Sign in to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle size={24} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3 text-green-700">
              <CheckCircle size={24} />
              <span className="font-medium">{success}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="john@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" placeholder="••••••••" />
              </div>
            </div>

            <button onClick={handleLogin} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105">
              {loading ? <span className="flex items-center justify-center gap-3"><div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>Signing in...</span> : "Sign In"}
            </button>
          </div>

          <p className="mt-8 text-center text-gray-600 text-lg">Don't have an account? <button onClick={() => setCurrentView("register")} className="text-blue-600 hover:text-blue-700 font-bold underline">Sign up</button></p>
        </div>
      </div>
    );
  }

  if (currentView === "register" && !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="bg-white bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-8 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 animate-bounce">
              <Plus className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-red-600 bg-clip-text text-transparent mb-2">Join Us</h1>
            <p className="text-gray-600 text-lg">Create your account</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle size={24} />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" placeholder="John Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" placeholder="john@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" placeholder="••••••••" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Min 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="password" value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleRegister()} className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" placeholder="••••••••" />
              </div>
            </div>

            <button onClick={handleRegister} disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105">
              {loading ? <span className="flex items-center justify-center gap-3"><div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>Creating...</span> : "Create Account"}
            </button>
          </div>

          <p className="mt-8 text-center text-gray-600 text-lg">Have an account? <button onClick={() => setCurrentView("login")} className="text-purple-600 hover:text-purple-700 font-bold underline">Sign in</button></p>
        </div>
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white bg-opacity-90 backdrop-blur-xl shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome, <span className="font-semibold text-indigo-600">{user?.name}</span></p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => openModal("profileModal")} className="px-5 py-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-semibold border-2 border-blue-200 transform hover:scale-105">Profile</button>
              <button onClick={handleLogout} className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2 font-semibold shadow-lg transform hover:scale-105"><LogOut size={18} />Logout</button>
            </div>
          </div>
        </div>
      </header>

      {error && (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"><div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-center gap-3 text-red-700"><AlertCircle size={24} /><span className="font-medium">{error}</span></div></div>)}
      {success && (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4"><div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-xl flex items-center gap-3 text-green-700"><CheckCircle size={24} /><span className="font-medium">{success}</span></div></div>)}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all border-l-4 border-blue-500">
            <h3 className="text-blue-600 text-sm font-bold mb-2">Total Tasks</h3>
            <p className="text-4xl font-bold text-blue-900">{tasks.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all border-l-4 border-green-500">
            <h3 className="text-green-600 text-sm font-bold mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-900">{tasks.filter(t => t.status === "completed").length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all border-l-4 border-orange-500">
            <h3 className="text-orange-600 text-sm font-bold mb-2">Pending</h3>
            <p className="text-4xl font-bold text-orange-900">{tasks.filter(t => t.status === "pending").length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
              <button onClick={() => openModal("createModal")} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 font-bold shadow-lg transform hover:scale-105"><Plus size={20} />New Task</button>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)} className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="divide-y">
            {tasks.length === 0 ? (<div className="p-12 text-center text-gray-500">No tasks found</div>) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${task.status === "completed" ? "bg-green-100 text-green-700" : task.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{task.status}</span>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${task.priority === "high" ? "bg-red-100 text-red-700" : task.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>{task.priority}</span>
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{task.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleUpdateTask(task.id, { status: task.status === "completed" ? "pending" : task.status === "pending" ? "in-progress" : "completed" })} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all transform hover:scale-110"><Edit2 size={20} /></button>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all transform hover:scale-110"><Trash2 size={20} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Create modal */}
      <div id="createModal" className="hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
            <h3 className="text-2xl font-bold">Create Task</h3>
            <button onClick={() => closeModal("createModal")} className="text-gray-400 hover:text-gray-600"><X size={28} /></button>
          </div>
          <div className="p-6 space-y-5">
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Title</label><input type="text" value={taskData.title} onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Task title" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Description</label><textarea value={taskData.description} onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Description" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Status</label><select value={taskData.status} onChange={(e) => setTaskData({ ...taskData, status: e.target.value as TaskStatus })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"><option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="completed">Completed</option></select></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Priority</label><select value={taskData.priority} onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as Priority })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            <button onClick={handleCreateTask} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold shadow-lg transform hover:scale-105">Create</button>
          </div>
        </div>
      </div>

      {/* Profile modal */}
      <div id="profileModal" className="hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
            <h3 className="text-2xl font-bold">Edit Profile</h3>
            <button onClick={() => closeModal("profileModal")} className="text-gray-400 hover:text-gray-600"><X size={28} /></button>
          </div>
          <div className="p-6 space-y-5">
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Name</label><input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Email</label><input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-2">Role</label><input type="text" value={profileData.role} onChange={(e) => setProfileData({ ...profileData, role: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500" /></div>
            <button onClick={handleUpdateProfile} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 font-bold shadow-lg transform hover:scale-105">Update Profile</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
