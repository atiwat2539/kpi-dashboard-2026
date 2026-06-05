import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar as CalendarIcon, 
  Edit3, 
  PieChart,
  Clock,
  Plus,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Tag,
  Loader2,
  AlertCircle,
  Briefcase
} from 'lucide-react';

// === นำ URL ของ Google Apps Script มาใส่ตรงนี้ ===
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFqELswduE-2VCWMPnYp5Z2YpOObxhyQrGnn-OWlryabmWhf4EzTCeYZBelhLllK5YkQ/exec'; 

const initialTasks = [
  { id: 'at-1', owner: 'อธิวัฒน์', collection: 'คอลเล็กชัน CMU e-Newspaper', subTask: 'แปลงข้อมูล (Digitization) ด้วยโปรแกรม Photoscape X', kpi: 3000, unit: 'ไฟล์', months: { m6: 50, m7: 60, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 } },
  { id: 'at-2', owner: 'อธิวัฒน์', collection: 'คอลเล็กชันวิทยานิพนธ์', subTask: 'สืบค้นและตรวจสอบระเบียนวิทยานิพนธ์', kpi: 1000, unit: 'ระเบียน', months: { m6: 200, m7: 150, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 } },
  { id: 'py-1', owner: 'ภิญญาพัชญ์', collection: 'การพัฒนาทรัพยากรสารสนเทศ', subTask: 'จัดซื้อฐานข้อมูลอิเล็กทรอนิกส์', kpi: 13, unit: 'ฐาน', months: { m6: 2, m7: 3, m8: 1, m9: 0, m10: 0, m11: 0, m12: 0, m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 } }
];

const initialEvents = [
  { id: 'evt-1', date: new Date().toISOString().split('T')[0], time: '09:30', title: 'ประชุมประจำเดือน', categoryId: 'meeting' }
];

const initialCategories = [
  { id: 'general', name: 'ทั่วไป', color: '#3b82f6' }, 
  { id: 'meeting', name: 'ประชุม/อบรม', color: '#8b5cf6' }, 
  { id: 'urgent', name: 'งานด่วน', color: '#ef4444' }
];

const monthNames = [
  { id: 'm6', name: 'มิถุนายน' }, { id: 'm7', name: 'กรกฎาคม' }, { id: 'm8', name: 'สิงหาคม' }, 
  { id: 'm9', name: 'กันยายน' }, { id: 'm10', name: 'ตุลาคม' }, { id: 'm11', name: 'พฤศจิกายน' }, 
  { id: 'm12', name: 'ธันวาคม' }, { id: 'm1', name: 'มกราคม' }, { id: 'm2', name: 'กุมภาพันธ์' }, 
  { id: 'm3', name: 'มีนาคม' }, { id: 'm4', name: 'เมษายน' }, { id: 'm5', name: 'พฤษภาคม' }
];

const userColorPalette = [
  { id: 'indigo', stroke: 'url(#grad-indigo)', solidStroke: '#6366f1', bg: 'bg-gradient-to-r from-indigo-500 to-purple-600', text: 'text-indigo-600', lightBg: 'bg-indigo-50/70', hover: 'hover:stroke-indigo-400', badge: 'bg-indigo-100 text-indigo-700' },
  { id: 'rose', stroke: 'url(#grad-rose)', solidStroke: '#f43f5e', bg: 'bg-gradient-to-r from-rose-500 to-pink-600', text: 'text-rose-600', lightBg: 'bg-rose-50/70', hover: 'hover:stroke-rose-400', badge: 'bg-rose-100 text-rose-700' },
  { id: 'teal', stroke: 'url(#grad-teal)', solidStroke: '#14b8a6', bg: 'bg-gradient-to-r from-teal-400 to-emerald-600', text: 'text-teal-600', lightBg: 'bg-teal-50/70', hover: 'hover:stroke-teal-400', badge: 'bg-teal-100 text-teal-700' },
  { id: 'amber', stroke: 'url(#grad-amber)', solidStroke: '#f59e0b', bg: 'bg-gradient-to-r from-amber-500 to-orange-600', text: 'text-amber-600', lightBg: 'bg-amber-50/70', hover: 'hover:stroke-amber-400', badge: 'bg-amber-100 text-amber-700' },
  { id: 'cyan', stroke: 'url(#grad-cyan)', solidStroke: '#06b6d4', bg: 'bg-gradient-to-r from-cyan-400 to-sky-600', text: 'text-cyan-600', lightBg: 'bg-cyan-50/70', hover: 'hover:stroke-cyan-400', badge: 'bg-cyan-100 text-cyan-700' },
  { id: 'fuchsia', stroke: 'url(#grad-fuchsia)', solidStroke: '#d946ef', bg: 'bg-gradient-to-r from-fuchsia-500 to-pink-600', text: 'text-fuchsia-600', lightBg: 'bg-fuchsia-50/70', hover: 'hover:stroke-fuchsia-400', badge: 'bg-fuchsia-100 text-fuchsia-700' }
];

const ProgressBar = ({ current, max }) => {
  const percentage = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  let colorGradient = "from-red-400 to-rose-500";
  if (percentage >= 100) colorGradient = "from-emerald-400 to-teal-500";
  else if (percentage >= 75) colorGradient = "from-blue-400 to-indigo-500";
  else if (percentage >= 40) colorGradient = "from-amber-400 to-orange-500";

  return (
    <div className="w-full mt-auto pt-4">
      <div className="flex justify-between text-xs mb-2">
        <span className="font-semibold text-slate-500">ความคืบหน้า</span>
        <span className="font-black text-slate-800">{percentage}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3.5 p-[2px] border border-slate-200/50">
        <div className={`h-full rounded-full bg-gradient-to-r ${colorGradient} transition-all duration-500 ease-out shadow-sm`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedUserDashboard, setSelectedUserDashboard] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const [entryForm, setEntryForm] = useState({ user: '', taskId: '', month: 'm6', value: '' });
  const [newEvent, setNewEvent] = useState({ date: '', time: '', title: '', categoryId: 'general' });
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6' });
  const [isManageCategoryOpen, setIsManageCategoryOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({ collection: '', newCollection: '', isNewCollection: false, subTask: '', kpi: '', unit: 'ครั้ง' });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', startingCollection: '', startingSubTask: '', startingKPI: '', startingUnit: 'ครั้ง' });

  // โหลดข้อมูลเมื่อเปิดเว็บ
  useEffect(() => {
    const fetchDB = async () => {
      // โหมด Mock Data (กรณีไม่มี SCRIPT_URL หรือมีคำว่า YOUR_GOOGLE)
      if (!SCRIPT_URL || SCRIPT_URL.trim() === '' || SCRIPT_URL.includes('YOUR_GOOGLE')) {
        const savedTasks = localStorage.getItem('mockTasks');
        const savedEvents = localStorage.getItem('mockEvents');
        const savedCategories = localStorage.getItem('mockCategories');

        const loadedTasks = savedTasks ? JSON.parse(savedTasks) : initialTasks;
        const loadedEvents = savedEvents ? JSON.parse(savedEvents) : initialEvents; 
        const loadedCategories = savedCategories ? JSON.parse(savedCategories) : initialCategories;

        setTasks(loadedTasks);
        setEvents(Array.isArray(loadedEvents) ? loadedEvents : []);
        setCategories(loadedCategories);
        
        if (loadedTasks.length > 0) {
          setSelectedUserDashboard(loadedTasks[0].owner);
          setEntryForm(prev => ({...prev, user: loadedTasks[0].owner}));
        }
        setIsLoading(false);
        return;
      }
      
      // โหมด ใช้งานจริงเชื่อม Google Sheets
      try {
        const res = await fetch(SCRIPT_URL);
        if (!res.ok) throw new Error("การเชื่อมต่อฐานข้อมูลล้มเหลว");
        const data = await res.json();
        
        setTasks(data.tasks || []);
        
        // แก้ไขปัญหาข้อมูลวันที่ของปฏิทินที่อาจแปลง Format ผิดพลาดจาก Google Sheets (Timezone Shift)
        if (data.events && Array.isArray(data.events)) {
           const parsedEvents = data.events.map(ev => {
               let d = ev.date;
               if (typeof d === 'string' && d.includes('T')) {
                   const dateObj = new Date(d);
                   if (!isNaN(dateObj)) d = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
               }
               let t = ev.time;
               if (typeof t === 'string' && t.includes('T')) {
                   const timeObj = new Date(t);
                   if (!isNaN(timeObj)) t = `${String(timeObj.getHours()).padStart(2, '0')}:${String(timeObj.getMinutes()).padStart(2, '0')}`;
               }
               return { ...ev, date: d, time: t };
           });
           setEvents(parsedEvents);
        } else {
           setEvents([]);
        }
        
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          setCategories([{ id: 'general', name: 'ทั่วไป', color: '#3b82f6' }]);
        }

        if (data.tasks && data.tasks.length > 0) {
          const firstOwner = data.tasks[0].owner;
          setSelectedUserDashboard(firstOwner);
          setEntryForm(prev => ({...prev, user: firstOwner}));
        }
      } catch (err) {
        console.error("Fetch DB Error", err);
        setApiError("ไม่สามารถดึงข้อมูลจาก Google Sheets ได้ โปรดตรวจสอบ SCRIPT_URL");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDB();
  }, []);

  // ระบบจัดเก็บข้อมูลสำรอง (Local Storage) อัตโนมัติเมื่อมีการอัปเดต ป้องกันข้อมูลหายตอน Refresh
  useEffect(() => {
    if (!isLoading && (!SCRIPT_URL || SCRIPT_URL.trim() === '' || SCRIPT_URL.includes('YOUR_GOOGLE'))) {
      localStorage.setItem('mockTasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  useEffect(() => {
    if (!isLoading && (!SCRIPT_URL || SCRIPT_URL.trim() === '' || SCRIPT_URL.includes('YOUR_GOOGLE'))) {
      localStorage.setItem('mockEvents', JSON.stringify(events));
    }
  }, [events, isLoading]);

  useEffect(() => {
    if (!isLoading && (!SCRIPT_URL || SCRIPT_URL.trim() === '' || SCRIPT_URL.includes('YOUR_GOOGLE'))) {
      localStorage.setItem('mockCategories', JSON.stringify(categories));
    }
  }, [categories, isLoading]);

  // ฟังก์ชัน Sync ข้อมูลกลับไปที่ Sheet 
  const syncApi = async (action, payload) => {
    if (!SCRIPT_URL || SCRIPT_URL.trim() === '' || SCRIPT_URL.includes('YOUR_GOOGLE')) return;

    setIsSyncing(true);
    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action, payload })
      });
    } catch(err) {
      console.error('Sync Error', err);
      alert('บันทึกลงฐานข้อมูลไม่สำเร็จ กรุณาลองใหม่');
    } finally {
      setIsSyncing(false);
    }
  };

  const calculateTotal = (monthsObj) => Object.values(monthsObj || {}).reduce((a, b) => a + (Number(b) || 0), 0);

  const handleAddTask = (e) => {
    e.preventDefault();
    const collectionName = newTaskForm.isNewCollection ? newTaskForm.newCollection.trim() : newTaskForm.collection.trim();
    if (!collectionName || !newTaskForm.subTask.trim() || !newTaskForm.kpi) return;

    const newId = `task-${Date.now()}`;
    const newTask = {
      id: newId, owner: selectedUserDashboard, collection: collectionName,
      subTask: newTaskForm.subTask.trim(), kpi: Number(newTaskForm.kpi), unit: newTaskForm.unit.trim() || 'ครั้ง',
      months: { m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 }
    };

    setTasks(prev => {
        const updated = [...prev, newTask];
        syncApi('ADD_TASK', newTask);
        return updated;
    }); 
    
    setIsAddTaskOpen(false);
    setNewTaskForm({ collection: '', newCollection: '', isNewCollection: false, subTask: '', kpi: '', unit: 'ครั้ง' });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.startingCollection.trim() || !newUserForm.startingSubTask.trim()) return;

    const newId = `task-${Date.now()}`;
    const firstTask = {
      id: newId, owner: newUserForm.name.trim(), collection: newUserForm.startingCollection.trim(),
      subTask: newUserForm.startingSubTask.trim(), kpi: Number(newUserForm.startingKPI), unit: newUserForm.startingUnit.trim() || 'ครั้ง',
      months: { m6: 0, m7: 0, m8: 0, m9: 0, m10: 0, m11: 0, m12: 0, m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 }
    };

    setTasks(prev => {
        const updated = [...prev, firstTask];
        syncApi('ADD_TASK', firstTask);
        return updated;
    });

    setSelectedUserDashboard(newUserForm.name.trim());
    setIsAddUserOpen(false);
    setNewUserForm({ name: '', startingCollection: '', startingSubTask: '', startingKPI: '', startingUnit: 'ครั้ง' });
  };

  const executeDeletion = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'task') {
      setTasks(prev => prev.filter(t => t.id !== deleteConfirm.targetId));
      syncApi('DELETE_TASK', { id: deleteConfirm.targetId });
    } else if (deleteConfirm.type === 'user') {
      setTasks(prev => {
          const remainingTasks = prev.filter(t => t.owner !== deleteConfirm.targetId);
          const uniqueUsers = [...new Set(remainingTasks.map(t => t.owner))];
          setSelectedUserDashboard(uniqueUsers[0] || '');
          return remainingTasks;
      });
      syncApi('DELETE_USER', { owner: deleteConfirm.targetId });
    }
    setDeleteConfirm(null);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const catName = newCategory.name.trim();
    if (!catName || categories.some(c => c.name === catName)) return;

    const newCat = { id: `cat-${Date.now()}`, name: catName, color: newCategory.color };
    setCategories(prev => {
        const updated = [...prev, newCat];
        syncApi('ADD_CATEGORY', newCat, events); // ส่ง events ปัจจุบันไปใช้ด้วยเพื่อไม่ให้ state หาย
        return updated;
    });
    setNewCategory({ name: '', color: '#3b82f6' });
  };

  const handleDeleteCategory = (catId) => {
    if (categories.length <= 1) return alert('ต้องมีหมวดหมู่อย่างน้อย 1 รายการ');
    const confirmDelete = window.confirm('การลบหมวดหมู่นี้จะทำให้กิจกรรมทั้งหมดในหมวดหมู่นี้ถูกย้ายไปอยู่หมวดหมู่อื่น ยืนยันที่จะลบหรือไม่?');
    if (!confirmDelete) return;

    const fallbackCategory = categories.find(c => c.id !== catId);
    
    setCategories(prev => prev.filter(c => c.id !== catId));
    
    // อัปเดต Category ID ของ Event เก่าให้ไปตกที่ Fallback
    setEvents(prev => {
        const updatedEvents = prev.map(evt => evt.categoryId === catId ? { ...evt, categoryId: fallbackCategory.id } : evt);
        syncApi('DELETE_CATEGORY', { id: catId, fallbackId: fallbackCategory.id }, updatedEvents);
        return updatedEvents;
    });
    
    if (selectedCategoryFilter === catId) setSelectedCategoryFilter('all');
  };

  const renderOverview = () => {
    const users = [...new Set(tasks.map(t => t.owner))];
    
    if (users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <LayoutDashboard size={40} className="text-indigo-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">ระบบยังว่างเปล่า</h2>
          <p className="text-slate-500 font-medium text-center max-w-md">ยังไม่มีข้อมูลในฐานข้อมูลของคุณ กดปุ่มเพิ่มผู้ปฏิบัติงานเพื่อเริ่มต้นการทำงานได้เลยครับ</p>
          <button onClick={() => setActiveTab('individual')} className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all">ไปเพิ่มผู้ปฏิบัติงาน</button>
        </div>
      );
    }

    const totalKPIAll = tasks.reduce((acc, curr) => acc + curr.kpi, 0);
    const totalAchievedAll = tasks.reduce((acc, curr) => acc + calculateTotal(curr.months), 0);
    const overallAvgProgress = totalKPIAll > 0 ? ((totalAchievedAll / totalKPIAll) * 100).toFixed(1) : 0;
    
    const userStats = users.map((user, idx) => {
      const userTasks = tasks.filter(t => t.owner === user);
      const kpi = userTasks.reduce((acc, curr) => acc + curr.kpi, 0);
      const achieved = userTasks.reduce((acc, curr) => acc + calculateTotal(curr.months), 0);
      return { user, kpi, achieved, progress: kpi > 0 ? Number(((achieved/kpi)*100).toFixed(1)) : 0, colorClass: userColorPalette[idx % userColorPalette.length] };
    });

    const totalAchievedSum = userStats.reduce((sum, u) => sum + u.achieved, 0);
    const radius = 35;
    const circumference = 2 * Math.PI * radius; 
    let accumulatedPercentage = 0;

    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="border-b border-slate-200/60 pb-4 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">ภาพรวมการปฏิบัติงานหลัก</h2>
            <p className="text-base text-slate-500 mt-1">วิเคราะห์ผลงานและสถิติการสำเร็จสะสมแยกตามส่วนบุคคล</p>
          </div>
          {isSyncing && <div className="text-xs font-bold text-indigo-500 flex items-center bg-indigo-50 px-3 py-1.5 rounded-full shadow-sm"><Loader2 size={14} className="animate-spin mr-1.5"/> ซิงค์ข้อมูล...</div>}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">บุคลากร</p><p className="text-3xl font-black text-slate-800 mt-1">{users.length} คน</p></div>
              <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl"><Users size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ภาระงาน</p><p className="text-3xl font-black text-slate-800 mt-1">{tasks.length} ชิ้น</p></div>
              <div className="p-3 bg-pink-50 text-pink-500 rounded-xl"><LayoutDashboard size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">สำเร็จสะสม</p><p className="text-3xl font-black text-blue-600 mt-1">{totalAchievedAll.toLocaleString()}</p></div>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><PieChart size={24} /></div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div><p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ความสำเร็จรวม</p><p className="text-3xl font-black text-emerald-500 mt-1">{overallAvgProgress}%</p></div>
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><Clock size={24} /></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between items-center text-center">
            <div className="w-full text-left mb-4">
              <h3 className="font-extrabold text-slate-800 text-xl flex items-center"><span className="w-3 h-6 bg-blue-500 rounded-full mr-2.5"></span>สัดส่วนผลงานสำเร็จ</h3>
            </div>
            <div className="relative w-60 h-60 my-4 flex items-center justify-center">
              {totalAchievedSum > 0 ? (
                <>
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="grad-indigo" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#818cf8" /><stop offset="100%" stopColor="#c084fc" /></linearGradient>
                      <linearGradient id="grad-rose" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fb7185" /><stop offset="100%" stopColor="#f472b6" /></linearGradient>
                      <linearGradient id="grad-teal" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#2dd4bf" /><stop offset="100%" stopColor="#34d399" /></linearGradient>
                      <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#f97316" /></linearGradient>
                      <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="#38bdf8" /></linearGradient>
                      <linearGradient id="grad-fuchsia" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f0abfc" /><stop offset="100%" stopColor="#f472b6" /></linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#f8fafc" strokeWidth="10" />
                    {userStats.map((stat) => {
                      const proportion = (stat.achieved / totalAchievedSum) * 100;
                      const strokeLength = (proportion / 100) * circumference;
                      const strokeDashoffset = -((accumulatedPercentage / 100) * circumference);
                      accumulatedPercentage += proportion;
                      return <circle key={stat.user} cx="50" cy="50" r={radius} fill="transparent" stroke={stat.colorClass.solidStroke} strokeWidth="10" strokeDasharray={`${strokeLength} ${circumference}`} strokeDashoffset={strokeDashoffset} className="transition-all duration-500 ease-out" />;
                    })}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-full m-12 shadow-sm border border-slate-50">
                    <span className="text-xs uppercase font-bold text-slate-400">สำเร็จสะสม</span>
                    <span className="text-2xl font-black text-slate-800">{totalAchievedSum.toLocaleString()}</span>
                  </div>
                </>
              ) : <div className="text-slate-400 text-sm font-bold">ไม่มีข้อมูลสถิติ</div>}
            </div>
            <div className="w-full grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 mt-2">
              {userStats.map((stat) => (
                <div key={stat.user} className={`flex items-center space-x-2.5 text-left p-2 rounded-xl ${stat.colorClass.lightBg}`}>
                  <div className={`w-4 h-4 rounded-full ${stat.colorClass.bg}`}></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-slate-800 truncate">{stat.user}</p>
                    <p className="text-xs font-semibold text-slate-500">{totalAchievedSum>0?((stat.achieved/totalAchievedSum)*100).toFixed(1):0}% ({stat.achieved.toLocaleString()})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-extrabold text-slate-800 text-xl mb-4 flex items-center"><span className="w-3 h-6 bg-emerald-500 rounded-full mr-2.5"></span>ความสำเร็จเทียบ KPI รายบุคคล</h3>
              <div className="space-y-4">
                {userStats.map((stat) => (
                  <div key={stat.user} className="p-4 rounded-xl border border-slate-100/70 bg-slate-50/40">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center space-x-2.5"><span className={`w-3.5 h-3.5 rounded-full ${stat.colorClass.bg}`}></span><span className="font-bold text-slate-800 text-base">{stat.user}</span></div>
                      <div className="text-right"><span className="text-xs text-slate-400 font-medium">เทียบเป้าหมาย: </span><span className={`text-base font-black ${stat.colorClass.text}`}>{stat.progress}%</span></div>
                    </div>
                    <ProgressBar current={stat.achieved} max={stat.kpi} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIndividualDashboard = () => {
    const users = [...new Set(tasks.map(t => t.owner))];
    const userTasks = tasks.filter(t => t.owner === selectedUserDashboard);
    const groupedByCollection = userTasks.reduce((acc, task) => {
      if (!acc[task.collection]) acc[task.collection] = [];
      acc[task.collection].push(task);
      return acc;
    }, {});
    const existingCollections = [...new Set(userTasks.map(t => t.collection))];
    const userIndex = users.indexOf(selectedUserDashboard);
    const activeColor = userColorPalette[userIndex !== -1 ? userIndex % userColorPalette.length : 0];

    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-black text-slate-800">แดชบอร์ดรายบุคคล</h2>
            {selectedUserDashboard && <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeColor?.badge || 'bg-slate-100'} shadow-sm`}>{selectedUserDashboard}</span>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {users.length > 0 ? (
              <select className="p-2.5 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-700" value={selectedUserDashboard} onChange={(e) => setSelectedUserDashboard(e.target.value)}>
                {users.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            ) : <span className="text-sm text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg font-bold">ไม่พบผู้ใช้งาน</span>}
            
            <button onClick={() => setIsAddUserOpen(true)} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-xl hover:shadow-lg text-xs font-bold flex items-center"><UserPlus size={14} className="mr-1.5" /> เพิ่มบุคลากร</button>
            <button onClick={() => { setIsAddTaskOpen(true); setNewTaskForm({...newTaskForm, collection: existingCollections[0]||'', isNewCollection: existingCollections.length === 0}); }} disabled={!selectedUserDashboard} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl disabled:from-slate-300 disabled:to-slate-300 text-xs font-bold flex items-center"><Plus size={14} className="mr-1.5" /> เพิ่มภาระงาน</button>
            <button onClick={() => setDeleteConfirm({ type: 'user', targetId: selectedUserDashboard, displayName: `ผู้ปฏิบัติงาน "${selectedUserDashboard}"` })} disabled={!selectedUserDashboard} className="bg-gradient-to-r from-rose-500 to-red-600 text-white px-4 py-2.5 rounded-xl disabled:from-slate-300 disabled:to-slate-300 text-xs font-bold flex items-center"><Trash2 size={14} className="mr-1.5" /> ลบคนนี้</button>
          </div>
        </div>

        {selectedUserDashboard && Object.keys(groupedByCollection).length > 0 ? (
          Object.keys(groupedByCollection).map((collectionName, idx) => (
            <div key={idx} className="mb-8">
              <h3 className={`text-base font-black ${activeColor?.text || 'text-slate-800'} ${activeColor?.lightBg || 'bg-slate-100'} p-3.5 rounded-2xl border-l-4 border-l-current mb-4 shadow-sm flex items-center`}><span className="w-1.5 h-4 bg-current rounded-full mr-2.5"></span>{collectionName}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-1 items-stretch">
                {groupedByCollection[collectionName].map(task => {
                  const total = calculateTotal(task.months);
                  return (
                    <div key={task.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm group flex flex-col h-auto hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{task.id}</span>
                        <button onClick={() => setDeleteConfirm({ type: 'task', targetId: task.id, displayName: `ภาระงาน "${task.subTask}"` })} className="text-slate-300 hover:text-rose-600 p-1.5 opacity-0 group-hover:opacity-100 rounded-lg hover:bg-rose-50"><Trash2 size={16} /></button>
                      </div>
                      
                      <div className="flex-grow mb-6">
                        <h4 className="font-semibold text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{task.subTask}</h4>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between items-center bg-slate-50/80 p-3.5 rounded-xl mb-4 border border-slate-100">
                          <div className="text-center"><div className="text-[10px] font-bold text-slate-400 uppercase">ผลรวมสะสม</div><div className={`font-black text-lg ${activeColor?.text || 'text-slate-800'}`}>{total.toLocaleString()}</div></div>
                          <div className="text-center border-l border-slate-200/60 pl-3"><div className="text-[10px] font-bold text-slate-400 uppercase">เป้าหมาย (KPI)</div><div className="font-black text-lg text-slate-600">{task.kpi.toLocaleString()} <span className="text-[10px] text-slate-400">{task.unit}</span></div></div>
                        </div>
                        <ProgressBar current={total} max={task.kpi} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-500 shadow-sm animate-in fade-in">
             <Briefcase size={40} className="text-slate-300 mb-4" />
             <p className="font-bold text-lg text-slate-700 mb-1">ยังไม่มีภาระงาน</p>
             <p className="text-sm">กดเพิ่มหัวข้อและภาระงานใหม่ที่ด้านบนขวาเพื่อเริ่มต้น</p>
          </div>
        )}

        {/* Modal สำหรับเพิ่มผู้ปฏิบัติงานใหม่ */}
        {isAddUserOpen && (
          <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between bg-emerald-50/80">
                <h3 className="font-black text-base text-emerald-800 flex items-center"><UserPlus size={18} className="mr-2 text-emerald-500"/>เพิ่มผู้ปฏิบัติงานใหม่</h3>
                <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:bg-slate-200 p-1 rounded-lg transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">ชื่อ-นามสกุล</label>
                    <input type="text" required placeholder="เช่น ศิริพรรณ แสนสุข" className="w-full p-3 border rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none" value={newUserForm.name} onChange={e=>setNewUserForm({...newUserForm, name: e.target.value})} />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase border-b border-slate-200 pb-2 block mb-2">ลงทะเบียนงานเริ่มต้น</span>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">หัวข้อหลัก</label>
                      <input type="text" required placeholder="คอลเล็กชันงาน..." className="w-full p-2.5 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none" value={newUserForm.startingCollection} onChange={e=>setNewUserForm({...newUserForm, startingCollection: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">ภาระงานย่อย</label>
                      <textarea required rows="2" placeholder="รายละเอียด..." className="w-full p-2.5 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none" value={newUserForm.startingSubTask} onChange={e=>setNewUserForm({...newUserForm, startingSubTask: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">KPI</label>
                        <input type="number" required min="1" className="w-full p-2.5 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none" value={newUserForm.startingKPI} onChange={e=>setNewUserForm({...newUserForm, startingKPI: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">หน่วย</label>
                        <input type="text" required placeholder="ครั้ง" className="w-full p-2.5 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none" value={newUserForm.startingUnit} onChange={e=>setNewUserForm({...newUserForm, startingUnit: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setIsAddUserOpen(false)} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">ยกเลิก</button>
                    <button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl text-xs font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md shadow-emerald-200">บันทึกบุคลากรใหม่</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal สำหรับเพิ่มภาระงานและหัวข้อหลัก */}
        {isAddTaskOpen && (
          <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between bg-indigo-50/80">
                <h3 className="font-black text-base text-indigo-800 flex items-center"><Plus size={18} className="mr-2 text-indigo-500"/>เพิ่มภาระงาน ({selectedUserDashboard})</h3>
                <button onClick={() => setIsAddTaskOpen(false)} className="text-slate-400 hover:bg-slate-200 p-1 rounded-lg transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">ประเภทหัวข้อหลัก</label>
                    <div className="flex gap-4 mb-3">
                      <label className="flex items-center text-xs font-bold cursor-pointer text-slate-700">
                        <input type="radio" className="mr-2 w-3.5 h-3.5 accent-indigo-600" checked={!newTaskForm.isNewCollection} onChange={() => setNewTaskForm({...newTaskForm, isNewCollection: false, collection: existingCollections[0] || ''})} disabled={existingCollections.length === 0} /> ใช้ของเดิม
                      </label>
                      <label className="flex items-center text-xs font-bold cursor-pointer text-slate-700">
                        <input type="radio" className="mr-2 w-3.5 h-3.5 accent-indigo-600" checked={newTaskForm.isNewCollection} onChange={() => setNewTaskForm({...newTaskForm, isNewCollection: true})} /> สร้างใหม่
                      </label>
                    </div>
                    {!newTaskForm.isNewCollection ? (
                      <select className="w-full p-3 border rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 hover:bg-white transition-colors" value={newTaskForm.collection} onChange={e => setNewTaskForm({...newTaskForm, collection: e.target.value})} required>
                        {existingCollections.map(col => <option key={col} value={col}>{col}</option>)}
                      </select>
                    ) : (
                      <input type="text" required placeholder="ชื่อหัวข้อหลักใหม่..." className="w-full p-3 border rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" value={newTaskForm.newCollection} onChange={e => setNewTaskForm({...newTaskForm, newCollection: e.target.value})} />
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">รายละเอียดภาระงาน</label>
                    <textarea required rows="3" placeholder="รายละเอียด..." className="w-full p-3 border rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" value={newTaskForm.subTask} onChange={e => setNewTaskForm({...newTaskForm, subTask: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">KPI</label>
                      <input type="number" required min="1" placeholder="100" className="w-full p-3 border rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" value={newTaskForm.kpi} onChange={e => setNewTaskForm({...newTaskForm, kpi: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">หน่วย</label>
                      <input type="text" required placeholder="ครั้ง" className="w-full p-3 border rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" value={newTaskForm.unit} onChange={e => setNewTaskForm({...newTaskForm, unit: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setIsAddTaskOpen(false)} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">ยกเลิก</button>
                    <button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl text-xs font-bold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md shadow-indigo-200">บันทึกภาระงาน</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDataEntry = () => {
    const users = [...new Set(tasks.map(t => t.owner))];
    
    // ตั้งค่าผู้ใช้งานปัจจุบัน (ถ้าในฟอร์มไม่มีค่า ให้ดึงชื่อแรกจากรายชื่อมาใช้แทน)
    const currentUser = entryForm.user || (users.length > 0 ? users[0] : '');
    const userTasks = tasks.filter(t => t.owner === currentUser);
    
    const groupedUserTasks = userTasks.reduce((acc, task) => {
      const col = task.collection || 'ไม่มีหมวดหมู่';
      if (!acc[col]) acc[col] = [];
      acc[col].push(task);
      return acc;
    }, {});

    const handleSaveProgress = async (e) => {
      e.preventDefault();
      if (!entryForm.taskId || entryForm.value === '') {
        return alert('กรุณาระบุภาระงานและจำนวนผลงานที่ต้องการบันทึก');
      }

      setTasks(prev => {
        const updatedTasks = prev.map(task => {
          if (task.id === entryForm.taskId) {
            const currentMonths = task.months || {};
            const currentVal = Number(currentMonths[entryForm.month]) || 0;
            return { 
              ...task, 
              months: { 
                ...currentMonths, 
                [entryForm.month]: currentVal + Number(entryForm.value) 
              } 
            };
          }
          return task;
        });
        
        // Sync หลังจากการจัดการ state
        syncApi('UPDATE_PROGRESS', { taskId: entryForm.taskId, month: entryForm.month, value: Number(entryForm.value) });
        return updatedTasks;
      });
      
      alert('บันทึกข้อมูลเรียบร้อยแล้ว (ระบบกำลังอัปเดตลงฐานข้อมูล)');
      setEntryForm(prev => ({ ...prev, value: '' })); 
    };

    if (users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-in fade-in">
          <Edit3 size={40} className="text-slate-300 mb-6" />
          <h2 className="text-2xl font-black text-slate-800 mb-3">ไม่พบภาระงานในระบบ</h2>
          <p className="text-slate-500 font-medium text-center">ต้องมีการสร้างภาระงานในหน้าแดชบอร์ดก่อน จึงจะสามารถบันทึกยอดสะสมได้</p>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <h2 className="text-3xl font-black text-slate-800">บันทึกผลการปฏิบัติงาน</h2>
          {isSyncing && <Loader2 className="animate-spin text-indigo-500" />}
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-900 p-5 rounded-2xl text-sm font-semibold border border-indigo-100 flex items-start shadow-sm">
          <span className="text-xl mr-2.5">💡</span>
          <span>ระบบจะนำผลงานใหม่ไป<strong>บวกสะสมเพิ่มเติม</strong>กับเดือนเดิมในฐานข้อมูล (Google Sheets) อัตโนมัติ</span>
        </div>
        
        <form onSubmit={handleSaveProgress} className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ผู้ปฏิบัติงาน</label>
            <select 
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold cursor-pointer bg-slate-50 hover:bg-white transition-colors" 
              value={currentUser} 
              onChange={(e) => setEntryForm(prev => ({ ...prev, user: e.target.value, taskId: '' }))}
            >
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ภาระงาน</label>
            <select 
              className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold text-slate-700 cursor-pointer bg-slate-50 hover:bg-white transition-colors" 
              value={entryForm.taskId} 
              onChange={(e) => setEntryForm(prev => ({ ...prev, taskId: e.target.value }))} 
              required
            >
              <option value="">-- เลือกภาระงานเพื่อบันทึก --</option>
              {Object.entries(groupedUserTasks).map(([col, ts]) => (
                <optgroup key={col} label={col} className="font-extrabold text-indigo-700">
                  {ts.map(t => (
                    <option key={t.id} value={t.id} className="text-slate-700 font-medium">
                      [{t.id}] {String(t.subTask || '').substring(0,60)}...
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ระบุเดือน</label>
              <select 
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold cursor-pointer bg-slate-50 hover:bg-white transition-colors" 
                value={entryForm.month} 
                onChange={(e) => setEntryForm(prev => ({ ...prev, month: e.target.value }))}
              >
                {monthNames.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">จำนวน (บวกเพิ่ม)</label>
              <input 
                type="number" 
                placeholder="เช่น 10" 
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold bg-slate-50 hover:bg-white transition-colors" 
                value={entryForm.value} 
                onChange={(e) => setEntryForm(prev => ({ ...prev, value: e.target.value }))} 
                required 
              />
            </div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black py-3.5 rounded-xl shadow-lg shadow-indigo-200 hover:scale-[1.02] transition-transform mt-2">
            บันทึกยอดสะสม
          </button>
        </form>
        
        {entryForm.taskId && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-xs font-black text-slate-700 uppercase mb-4 flex items-center">
              <span className="w-1.5 h-4 bg-indigo-500 rounded-full mr-2"></span>ตรวจสอบยอดปัจจุบัน
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-center">
              {monthNames.map(m => {
                const currentTask = tasks.find(t => t.id === entryForm.taskId);
                const val = currentTask?.months?.[m.id] || 0;
                return (
                  <div key={m.id} className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="text-slate-400 font-bold text-[10px] uppercase mb-1">{m.name}</div>
                    <div className="font-black text-indigo-600 text-base">{val.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const thaiMonthsFull = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    const handleAddEvent = (e) => {
      e.preventDefault();
      if(newEvent.date && newEvent.title) {
        const finalCatId = newEvent.categoryId || (categories[0]?.id || 'general');
        const ev = { ...newEvent, categoryId: finalCatId, id: `evt-${Date.now()}` };
        
        setEvents(prev => {
            const updated = [...prev, ev];
            syncApi('ADD_EVENT', ev, updated); // <--- แก้ไขส่ง updated events
            return updated;
        });
        
        setNewEvent({ date: '', time: '', title: '', categoryId: categories[0]?.id || 'general' });
      }
    };

    return (
      <div className="space-y-6 relative animate-in fade-in duration-300">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <h2 className="text-3xl font-black text-slate-800">ปฏิทินกิจกรรม</h2>
          <div className="flex items-center space-x-2 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
            <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="p-2 text-indigo-500 rounded-lg hover:bg-indigo-50 transition-colors"><ChevronLeft size={18} /></button>
            <select className="p-1.5 bg-transparent font-black text-sm outline-none text-slate-700 cursor-pointer" value={month} onChange={(e) => setCalendarDate(new Date(year, Number(e.target.value), 1))}>{thaiMonthsFull.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
            <select className="p-1.5 bg-transparent font-black text-sm outline-none text-slate-700 cursor-pointer border-l pl-2 border-slate-200" value={year} onChange={(e) => setCalendarDate(new Date(Number(e.target.value), month, 1))}>{Array.from({length: 15}, (_, i) => 2021 + i).map(y => <option key={y} value={y}>{y + 543}</option>)}</select>
            <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="p-2 text-indigo-500 rounded-lg hover:bg-indigo-50 transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-black text-slate-400 mr-2 uppercase">ตัวกรองป้ายกำกับ:</span>
            <button onClick={() => setSelectedCategoryFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedCategoryFilter === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>ทั้งหมด</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategoryFilter(cat.id)} className="px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 transition-all shadow-sm" style={selectedCategoryFilter === cat.id ? {backgroundColor: cat.color, color: '#fff', borderColor: cat.color} : {color: cat.color, borderColor: `${cat.color}40`, backgroundColor: `${cat.color}05`}}>
                <span className="w-2 h-2 rounded-full" style={{backgroundColor: selectedCategoryFilter === cat.id ? '#fff' : cat.color}}></span>{cat.name}
              </button>
            ))}
          </div>
          <button onClick={() => setIsManageCategoryOpen(true)} className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"><Tag size={14} /> จัดการป้ายกำกับ</button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="grid grid-cols-7 gap-2.5 text-center font-black mb-4 text-slate-400 text-xs uppercase tracking-widest"><div className="text-rose-400">อา</div><div>จ</div><div>อ</div><div>พ</div><div>พฤ</div><div>ศ</div><div className="text-blue-400">ส</div></div>
            <div className="grid grid-cols-7 gap-2.5">
              {blanks.map(b => <div key={`blank-${b}`} className="p-2 bg-slate-50/50 rounded-xl opacity-30 h-28"></div>)}
              {days.map(day => {
                const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const dayEvents = events.filter(e => e.date === dateStr && (selectedCategoryFilter === 'all' || e.categoryId === selectedCategoryFilter));
                return (
                  <div key={day} onClick={() => setSelectedDateFilter(dateStr)} className={`p-2.5 border rounded-xl h-28 flex flex-col items-start cursor-pointer transition-all ${selectedDateFilter === dateStr ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-100 shadow-md' : 'border-slate-100 hover:border-indigo-300 hover:bg-slate-50/50'}`}>
                    <span className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-lg mb-2 ${dayEvents.length > 0 ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm' : 'text-slate-600'}`}>{day}</span>
                    <div className="w-full flex-1 overflow-y-auto space-y-1.5 scrollbar-none">
                      {dayEvents.map(evt => {
                        const cat = categories.find(c => c.id === evt.categoryId) || { name: 'ไม่มี', color: '#64748b' };
                        return <div key={evt.id} className="text-[10px] px-2 py-1 rounded-md truncate font-bold border shadow-sm" style={{backgroundColor: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}30`}} title={evt.title}>{evt.title}</div>
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-black text-slate-800 mb-5 flex items-center"><span className="w-2 h-5 bg-indigo-500 rounded-full mr-2"></span>ลงบันทึกนัดหมาย</h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">วันที่</label><input type="date" required className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-semibold" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} /></div>
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">เวลา</label><input type="time" className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-semibold" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} /></div>
                </div>
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">ป้ายกำกับ (หมวดหมู่)</label><select className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-semibold" value={newEvent.categoryId} onChange={e => setNewEvent({...newEvent, categoryId: e.target.value})}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div><label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">หัวข้อ / รายละเอียด</label><input type="text" required placeholder="เช่น ประชุมสาขา..." className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} /></div>
                <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs font-black py-3 rounded-xl transition-all shadow-md mt-2">เพิ่มลงปฏิทิน</button>
              </form>
            </div>
          </div>
        </div>

        {/* Modal ดูประวัติรายวัน */}
        {selectedDateFilter && (
          <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between bg-slate-50/80">
                <h3 className="font-black text-base text-slate-800 flex items-center"><CalendarIcon size={18} className="mr-2 text-indigo-500"/>กิจกรรมวันที่ {selectedDateFilter.split('-').reverse().join('/')}</h3>
                <button onClick={() => setSelectedDateFilter(null)} className="text-slate-400 hover:bg-slate-200 p-1 rounded-lg transition-colors"><X size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
                {events.filter(e => e.date === selectedDateFilter && (selectedCategoryFilter === 'all' || e.categoryId === selectedCategoryFilter)).length > 0 ? (
                  events.filter(e => e.date === selectedDateFilter && (selectedCategoryFilter === 'all' || e.categoryId === selectedCategoryFilter)).map(evt => {
                    const cat = categories.find(c => c.id === evt.categoryId) || { color: '#64748b', name: 'ไม่มี'};
                    return (
                      <div key={evt.id} className="flex items-start justify-between p-4 border border-slate-100 rounded-2xl mb-4 bg-white shadow-sm hover:border-indigo-100 transition-colors">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {evt.time && <div className="text-[11px] font-black" style={{color: cat.color}}>{evt.time} น.</div>}
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold border" style={{backgroundColor: `${cat.color}15`, color: cat.color, borderColor: `${cat.color}30`}}>{cat.name}</span>
                          </div>
                          <div className="text-sm font-bold text-slate-700">{evt.title}</div>
                        </div>
                        <button onClick={() => { 
                            setEvents(prev => {
                                const updated = prev.filter(e => e.id !== evt.id);
                                syncApi('DELETE_EVENT', { id: evt.id }, updated); 
                                return updated;
                            });
                        }} className="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    )
                  })
                ) : <div className="text-center py-12 text-sm font-bold text-slate-400">ไม่มีกำหนดการในวันนี้</div>}
              </div>
            </div>
          </div>
        )}

        {/* Modal จัดการหมวดหมู่ */}
        {isManageCategoryOpen && (
          <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between bg-slate-50/80"><h3 className="font-black text-base text-slate-800 flex items-center"><Tag size={18} className="mr-2 text-indigo-500"/>จัดการป้ายกำกับหมวดหมู่</h3><button onClick={() => setIsManageCategoryOpen(false)} className="text-slate-400 hover:bg-slate-200 p-1 rounded-lg"><X size={20}/></button></div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleAddCategory} className="flex gap-3 items-end bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex-1"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">ชื่อป้ายกำกับ</label><input type="text" required placeholder="เช่น อบรมภายนอก..." className="w-full p-2.5 border rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none" value={newCategory.name} onChange={e=>setNewCategory({...newCategory, name: e.target.value})} /></div>
                  <div className="w-16"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">สีไฮไลต์</label><input type="color" className="w-full h-10 rounded-xl cursor-pointer p-0 border-0 bg-transparent" value={newCategory.color} onChange={e=>setNewCategory({...newCategory, color: e.target.value})} /></div>
                  <button type="submit" className="bg-indigo-600 text-white px-5 h-10 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-md">เพิ่ม</button>
                </form>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">รายการทั้งหมด</h4>
                  <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                    {categories.map(cat => (
                      <div key={cat.id} className="flex justify-between items-center p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3"><span className="w-4 h-4 rounded-full shadow-sm" style={{backgroundColor: cat.color}}></span><span className="text-sm font-bold text-slate-700">{cat.name}</span></div>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="text-slate-300 hover:text-rose-500 p-1.5 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16}/></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { font-family: 'Mitr', sans-serif !important; font-weight: 300 !important; }
        h1, h2, h3, h4, .font-black, .font-bold, .font-extrabold, button, select, optgroup, option, th, .font-semibold { font-weight: 500 !important; }
        html { font-size: 17.5px !important; }
        p, span, h1, h2, h3, h4, button, select, input, option, textarea { line-height: 1.65 !important; }
      `}} />

      {isLoading && !apiError && (
        <div className="absolute inset-0 z-[200] bg-white flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
          <p className="font-bold text-slate-600">กำลังโหลดข้อมูลระบบ...</p>
        </div>
      )}

      {apiError && (
        <div className="absolute inset-0 z-[200] bg-slate-50 flex flex-col items-center justify-center p-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md text-center border-t-4 border-rose-500 animate-in zoom-in">
             <AlertCircle size={40} className="text-rose-500 mx-auto mb-4" />
             <h2 className="text-xl font-black text-slate-800 mb-2">ข้อผิดพลาดการเชื่อมต่อ</h2>
             <p className="text-slate-500 text-sm mb-6">{apiError}</p>
             <button onClick={() => window.location.reload()} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold">ลองโหลดใหม่อีกครั้ง</button>
          </div>
        </div>
      )}

      <aside className="w-full md:w-64 bg-gradient-to-b from-slate-950 to-indigo-950 text-white flex flex-col shadow-2xl z-10 flex-shrink-0">
        <div className="p-6 border-b border-slate-800/60">
          <h1 className="text-2.5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center"><PieChart className="mr-2 text-indigo-400" size={26} /> KPI Dash</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {['overview', 'individual', 'entry', 'calendar'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`w-full flex items-center px-4 py-3 rounded-xl text-xs font-black transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              {tab === 'overview' && <LayoutDashboard size={18} className="mr-3" />}
              {tab === 'individual' && <Users size={18} className="mr-3" />}
              {tab === 'entry' && <Edit3 size={18} className="mr-3" />}
              {tab === 'calendar' && <CalendarIcon size={18} className="mr-3" />}
              {tab === 'overview' ? 'ภาพรวม' : tab === 'individual' ? 'แดชบอร์ดรายบุคคล' : tab === 'entry' ? 'กรอกผลงาน' : 'ปฏิทิน'}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto pb-12">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'individual' && renderIndividualDashboard()}
          {activeTab === 'entry' && renderDataEntry()}
          {activeTab === 'calendar' && renderCalendar()}
        </div>
      </main>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 size={28} className="text-rose-600" />
            </div>
            <h3 className="font-black text-xl text-slate-800 mb-2">ยืนยันการลบ?</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">ข้อมูล <strong>{deleteConfirm.displayName}</strong> จะถูกลบออกจากสถิติรวม ไม่สามารถเรียกคืนได้</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 py-3 rounded-xl text-sm font-bold text-slate-700 transition-colors">ยกเลิก</button>
              <button onClick={executeDeletion} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl text-sm font-bold transition-colors shadow-md shadow-rose-200">ยืนยันการลบ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}