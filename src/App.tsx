/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { api, setToken, getToken } from './api';
import { 
  Globe, 
  Moon, 
  Sun, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Eye, 
  BarChart3, 
  LayoutDashboard, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  X,
  Menu,
  Send,
  Search,
  Bell,
  Settings,
  LogOut,
  Home,
  Network,
  Briefcase,
  Zap,
  ChevronDown,
  ChevronRight,
  Calendar as CalendarIcon,
  MessageSquare,
  Clock,
  AlertTriangle,
  LayoutGrid,
  AlertCircle,
  Plus,
  Trash2,
  Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface KPI {
  id: string;
  name: string;
  objective: string;
  target: number;
  baseline: number;
  actual: number;
  unit: string;
}

// --- Translations ---
const translations = {
  en: {
    nav: {
      features: "Features",
      about: "About Us",
      vision: "Vision & Mission",
      contact: "Contact",
      signIn: "Sign In",
      getStarted: "Get Started"
    },
    hero: {
      badge: "From Excel to Strategic Excellence",
      title: "Unified Performance Management for Visionary Leaders",
      subtitle: "Stop Managing Sheets, Start Leading Strategy",
      description: "Transition from fragmented manual reports to a unified digital ecosystem. FocusIn connects your strategic goals to departmental KPIs with automated tracking and real-time governance.",
      cta: "Start Your Digital Transition",
      trust: ["No credit card required", "Enterprise-grade security", "24/7 Expert Support"],
      stats: {
        revenue: "Strategic Alignment",
        satisfaction: "KPI Automation",
        efficiency: "Reporting Speed",
        happiness: "Data Accuracy"
      }
    },
    features: {
      title: "Engineered for High-Performance Organizations",
      subtitle: "Replace manual tracking with a centralized platform designed for governance and transparency",
      items: [
        {
          title: "Strategic Map Builder",
          desc: "Define your Vision, Mission, and Pillars. Link every objective to a measurable outcome in one visual map.",
          icon: Target,
          color: "bg-blue-100 text-blue-600"
        },
        {
          title: "KPI Automation",
          desc: "Automate data collection and tracking. Get real-time alerts when performance deviates from targets.",
          icon: BarChart3,
          color: "bg-green-100 text-green-600"
        },
        {
          title: "Organizational Cascade",
          desc: "Align every department from the CEO down. Ensure everyone is working towards the same strategic goals.",
          icon: Users,
          color: "bg-purple-100 text-purple-600"
        },
        {
          title: "Automated Reporting",
          desc: "Generate executive-ready reports in seconds. Eliminate the manual labor of gathering data from silos.",
          icon: LayoutDashboard,
          color: "bg-orange-100 text-orange-600"
        }
      ]
    },
    about: {
      title: "About Us",
      subtitle: "We help you focus on what drives performance.",
      description: "We are dedicated to helping organizations achieve their strategic goals through innovative performance management solutions. Our platform combines the proven Balanced Scorecard methodology with modern technology to deliver real-time insights and drive organizational success."
    },
    visionMission: {
      mission: {
        title: "Mission",
        desc: "To empower organizations with intuitive, data-driven tools that turn strategic vision into reality"
      },
      vision: {
        title: "Vision",
        desc: "To help organizations transform their strategic vision into measurable success"
      }
    },
    contact: {
      title: "Get in Touch",
      subtitle: "Have questions? We'd love to hear from you.",
      form: {
        title: "Send us a message",
        name: "Full Name",
        email: "Email Address",
        org: "Organization",
        subject: "Subject",
        message: "Message",
        send: "Send Message",
        placeholders: {
          name: "John Doe",
          email: "john@company.com",
          org: "Acme Corporation",
          subject: "How can we help?",
          message: "Tell us more about your needs..."
        }
      },
      info: {
        email: "Email",
        whatsapp: "WhatsApp",
        location: "Location",
        address: "Saudi Arabia, Riyadh"
      }
    },
    auth: {
      signIn: {
        title: "Welcome Back",
        subtitle: "Sign in to your account",
        email: "Email Address",
        password: "Password",
        btn: "Sign In",
        noAccount: "Don't have an account? Sign up here"
      },
      signUp: {
        title: "Start Your Free Trial",
        subtitle: "Create your account - No credit card required",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        password: "Password",
        company: "Company Name",
        btn: "Start Free Trial",
        hasAccount: "Already have an account? Sign in here",
        passwordHint: "8+ chars with uppercase, lowercase, number, and special character"
      }
    },
    footer: {
      desc: "Strategic Performance Management Platform",
      nav: "Navigation",
      legal: "Legal",
      follow: "Follow Us",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      rights: "All rights reserved."
    },
    dashboard: {
      welcome: "Welcome back,",
      activeStrategies: "Active Strategies",
      sidebar: {
        home: "Home",
        dashboard: "Dashboard",
        orgStructure: "Organization Structure",
        strategyMgmt: "Strategy Management",
        initiativesMgmt: "Initiatives Management",
        performanceMeasure: "Performance Measurement",
        strategyHouse: "Strategy House",
        strategyMap: "Strategy Map",
        balancedScorecard: "Balanced Scorecard",
        chat: "Chat",
        settings: "Settings",
        logout: "Logout"
      },
      cards: {
        totalProjects: "Total Projects",
        activeProjects: "Active Projects",
        atRisk: "At Risk",
        delayed: "Delayed",
        allProjects: "All projects you have access to",
        currentlyActive: "Projects currently marked as active",
        atRiskSoon: "At-risk insights coming soon",
        delayedSoon: "Delayed metrics coming soon"
      },
      tabs: {
        tasks: "Today's Tasks",
        notifications: "Notifications",
        news: "Latest News"
      },
      profile: {
        admin: "Strategy Admin",
        projects: "Projects",
        active: "Active",
        joined: "Joined",
        lastActivity: "Last Activity"
      },
      charts: {
        status: "Status Overview",
        risk: "Risk Analysis",
        distribution: "Current distribution",
        byCategory: "Risk distribution by category"
      },
      kpi: {
        title: "KPI Management",
        subtitle: "Track and manage your key performance indicators",
        addKpi: "Add New KPI",
        editKpi: "Edit KPI",
        name: "KPI Name",
        objective: "Strategic Objective",
        target: "Target Value",
        baseline: "Baseline Value",
        actual: "Actual Value",
        unit: "Unit",
        progress: "Progress",
        status: "Status",
        actions: "Actions",
        save: "Save KPI",
        cancel: "Cancel",
        delete: "Delete",
        deleteConfirmTitle: "Delete KPI?",
        deleteConfirmMessage: "Are you sure you want to delete this KPI? This action cannot be undone.",
        placeholder: {
          name: "e.g., Customer Satisfaction Index",
          objective: "Select an objective",
          target: "e.g., 90",
          baseline: "e.g., 70",
          actual: "e.g., 85",
          unit: "e.g., %, SAR, Count"
        }
      },
      bsc: {
        title: "Balanced Scorecard",
        subtitle: "Strategic performance management tool",
        addObjective: "Add Objective",
        editObjective: "Edit Objective",
        deleteObjective: "Delete Objective",
        deleteConfirmTitle: "Are you sure?",
        deleteConfirmMessage: "This will permanently delete this objective. This action cannot be undone.",
        deleteBtn: "Delete",
        cancelBtn: "Cancel",
        perspectives: {
          financial: "Financial",
          customer: "Customer",
          internal: "Internal Processes",
          learning: "Learning & Growth"
        },
        metrics: {
          objective: "Objective",
          kpi: "KPI",
          target: "Target",
          actual: "Actual",
          status: "Status"
        }
      },
      strategyMap: {
        title: "Strategy Map",
        subtitle: "Visualize your strategic direction",
        vision: "Vision",
        mission: "Mission",
        pillars: "Strategic Pillars",
        objectives: "Linked Objectives",
        expand: "Expand to see objectives",
        collapse: "Collapse objectives"
      },
      strategyHouse: {
        title: "Strategy House",
        subtitle: "Document organizational structure and reporting lines",
        hierarchy: "Organizational Hierarchy",
        departments: "Key Departments",
        reportingLines: "Reporting Lines",
        addDepartment: "Add Department",
        departmentName: "Department Name",
        headOfDepartment: "Head of Department",
        parentDepartment: "Parent Department",
        noParent: "No Parent (Top Level)",
        members: "Team Members",
        searchPlaceholder: "Search by department or head...",
        save: "Save Department",
        cancel: "Cancel"
      },
      initiatives: {
        title: "Initiatives Management",
        subtitle: "Manage and track strategic initiatives",
        addInitiative: "Add Initiative",
        name: "Initiative Name",
        owner: "Owner",
        progress: "Progress",
        budget: "Budget",
        status: "Status"
      },
      strategy: {
        title: "Strategy Management",
        subtitle: "Define and manage organizational strategies",
        createStrategy: "Create Strategy",
        name: "Strategy Name",
        period: "Period",
        pillars: "Pillars",
        objectives: "Objectives",
        status: "Status"
      },
      orgStructure: {
        title: "Organization Structure",
        subtitle: "Visualize and manage organizational hierarchy",
        expandNode: "Click on a node to expand departments and teams"
      }
    }
  },
  ar: {
    nav: {
      features: "المميزات",
      about: "من نحن",
      vision: "الرؤية والرسالة",
      contact: "اتصل بنا",
      signIn: "تسجيل الدخول",
      getStarted: "ابدأ الآن"
    },
    hero: {
      badge: "من إكسل إلى التميز الاستراتيجي",
      title: "إدارة أداء موحدة للقادة الطموحين",
      subtitle: "توقف عن إدارة الجداول، وابدأ بقيادة الاستراتيجية",
      description: "انتقل من التقارير اليدوية المشتتة إلى منظومة رقمية موحدة. يربط FocusIn أهدافك الاستراتيجية بمؤشرات الأداء للأقسام مع تتبع آلي وحوكمة فورية.",
      cta: "ابدأ التحول الرقمي",
      trust: ["لا يلزم وجود بطاقة ائتمان", "أمن بمستوى المؤسسات الكبرى", "دعم فني خبير 24/7"],
      stats: {
        revenue: "المواءمة الاستراتيجية",
        satisfaction: "أتمتة المؤشرات",
        efficiency: "سرعة التقارير",
        happiness: "دقة البيانات"
      }
    },
    features: {
      title: "مصمم للمنظمات عالية الأداء",
      subtitle: "استبدل التتبع اليدوي بمنصة مركزية مصممة للحوكمة والشفافية",
      items: [
        {
          title: "بناء الخارطة الاستراتيجية",
          desc: "حدد الرؤية والرسالة والركائز. اربط كل هدف بنتيجة قابلة للقياس في خارطة بصرية واحدة.",
          icon: Target,
          color: "bg-blue-100 text-blue-600"
        },
        {
          title: "أتمتة مؤشرات الأداء",
          desc: "أتمتة جمع البيانات وتتبعها. احصل على تنبيهات فورية عندما ينحرف الأداء عن المستهدفات.",
          icon: BarChart3,
          color: "bg-green-100 text-green-600"
        },
        {
          title: "التسلسل التنظيمي",
          desc: "قم بمواءمة كل قسم من الرئيس التنفيذي إلى الأسفل. تأكد من أن الجميع يعملون لتحقيق نفس الأهداف.",
          icon: Users,
          color: "bg-purple-100 text-purple-600"
        },
        {
          title: "التقارير المؤتمتة",
          desc: "أنشئ تقارير جاهزة للإدارة في ثوانٍ. تخلص من الجهد اليدوي لجمع البيانات من المصادر المتفرقة.",
          icon: LayoutDashboard,
          color: "bg-orange-100 text-orange-600"
        }
      ]
    },
    about: {
      title: "من نحن",
      subtitle: "نساعدك على التركيز على ما يدفع الأداء.",
      description: "نحن ملتزمون بمساعدة المؤسسات على تحقيق أهدافها الاستراتيجية من خلال حلول مبتكرة لإدارة الأداء. تجمع منصتنا بين منهجية بطاقة الأداء المتوازن المثبتة والتكنولوجيا الحديثة لتقديم رؤى في الوقت الحقيقي وقيادة النجاح التنظيمي."
    },
    visionMission: {
      mission: {
        title: "الرسالة",
        desc: "تمكين المؤسسات بأدوات بديهية قائمة على البيانات تحول الرؤية الاستراتيجية إلى واقع"
      },
      vision: {
        title: "الرؤية",
        desc: "مساعدة المؤسسات على تحويل رؤيتها الاستراتيجية إلى نجاح ملموس"
      }
    },
    contact: {
      title: "تواصل معنا",
      subtitle: "لديك أسئلة؟ نود أن نسمع منك.",
      form: {
        title: "أرسل لنا رسالة",
        name: "الاسم الكامل",
        email: "البريد الإلكتروني",
        org: "المنظمة",
        subject: "الموضوع",
        message: "الرسالة",
        send: "إرسال الرسالة",
        placeholders: {
          name: "جون دو",
          email: "john@company.com",
          org: "شركة أكمي",
          subject: "كيف يمكننا المساعدة؟",
          message: "أخبرنا المزيد عن احتياجاتك..."
        }
      },
      info: {
        email: "البريد الإلكتروني",
        whatsapp: "واتساب",
        location: "الموقع",
        address: "المملكة العربية السعودية، الرياض"
      }
    },
    auth: {
      signIn: {
        title: "مرحباً بعودتك",
        subtitle: "قم بتسجيل الدخول إلى حسابك",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        btn: "تسجيل الدخول",
        noAccount: "ليس لديك حساب؟ سجل هنا"
      },
      signUp: {
        title: "ابدأ تجربتك المجانية",
        subtitle: "أنشئ حسابك - لا يلزم وجود بطاقة ائتمان",
        firstName: "الاسم الأول",
        lastName: "الاسم الأخير",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        company: "اسم الشركة",
        btn: "ابدأ التجربة المجانية",
        hasAccount: "لديك حساب بالفعل؟ سجل دخولك هنا",
        passwordHint: "8+ أحرف مع أحرف كبيرة وصغيرة ورقم ورمز خاص"
      }
    },
    footer: {
      desc: "منصة إدارة الأداء الاستراتيجي",
      nav: "التنقل",
      legal: "قانوني",
      follow: "تابعنا",
      privacy: "سياسة الخصوصية",
      terms: "شروط الاستخدام",
      rights: "جميع الحقوق محفوظة."
    },
    dashboard: {
      welcome: "مرحباً بعودتك،",
      activeStrategies: "الاستراتيجيات النشطة",
      sidebar: {
        home: "الرئيسية",
        dashboard: "لوحة التحكم",
        orgStructure: "الهيكل التنظيمي",
        strategyMgmt: "إدارة الاستراتيجية",
        initiativesMgmt: "إدارة المبادرات",
        performanceMeasure: "قياس الأداء",
        strategyHouse: "بيت الاستراتيجية",
        strategyMap: "خارطة الاستراتيجية",
        balancedScorecard: "بطاقة الأداء المتوازن",
        chat: "المحادثة",
        settings: "الإعدادات",
        logout: "تسجيل الخروج"
      },
      cards: {
        totalProjects: "إجمالي المشاريع",
        activeProjects: "المشاريع النشطة",
        atRisk: "في خطر",
        delayed: "متأخر",
        allProjects: "جميع المشاريع التي لديك صلاحية الوصول إليها",
        currentlyActive: "المشاريع المصنفة حالياً كنشطة",
        atRiskSoon: "رؤى المخاطر قريباً",
        delayedSoon: "مقاييس التأخير قريباً"
      },
      tabs: {
        tasks: "مهام اليوم",
        notifications: "التنبيهات",
        news: "آخر الأخبار"
      },
      profile: {
        admin: "مدير الاستراتيجية",
        projects: "المشاريع",
        active: "نشط",
        joined: "انضم في",
        lastActivity: "آخر نشاط"
      },
      charts: {
        status: "نظرة عامة على الحالة",
        risk: "تحليل المخاطر",
        distribution: "التوزيع الحالي",
        byCategory: "توزيع المخاطر حسب الفئة"
      },
      kpi: {
        title: "إدارة مؤشرات الأداء",
        subtitle: "تتبع وإدارة مؤشرات الأداء الرئيسية الخاصة بك",
        addKpi: "إضافة مؤشر جديد",
        editKpi: "تعديل المؤشر",
        name: "اسم المؤشر",
        objective: "الهدف الاستراتيجي",
        target: "القيمة المستهدفة",
        baseline: "قيمة الأساس",
        actual: "القيمة الفعلية",
        unit: "الوحدة",
        progress: "التقدم",
        status: "الحالة",
        actions: "الإجراءات",
        save: "حفظ المؤشر",
        cancel: "إلغاء",
        delete: "حذف",
        deleteConfirmTitle: "حذف المؤشر؟",
        deleteConfirmMessage: "هل أنت متأكد أنك تريد حذف هذا المؤشر؟ لا يمكن التراجع عن هذا الإجراء.",
        placeholder: {
          name: "مثال: مؤشر رضا العملاء",
          objective: "اختر هدفاً",
          target: "مثال: 90",
          baseline: "مثال: 70",
          actual: "مثال: 85",
          unit: "مثال: %، ريال، عدد"
        }
      },
      bsc: {
        title: "بطاقة الأداء المتوازن",
        subtitle: "أداة إدارة الأداء الاستراتيجي",
        addObjective: "إضافة هدف",
        editObjective: "تعديل الهدف",
        deleteObjective: "حذف الهدف",
        deleteConfirmTitle: "هل أنت متأكد؟",
        deleteConfirmMessage: "سيتم حذف هذا الهدف بشكل دائم. لا يمكن التراجع عن هذا الإجراء.",
        deleteBtn: "حذف",
        cancelBtn: "إلغاء",
        perspectives: {
          financial: "المنظور المالي",
          customer: "منظور العملاء",
          internal: "العمليات الداخلية",
          learning: "التعلم والنمو"
        },
        metrics: {
          objective: "الهدف",
          kpi: "المؤشر",
          target: "المستهدف",
          actual: "الفعلي",
          status: "الحالة"
        }
      },
      strategyMap: {
        title: "خارطة الاستراتيجية",
        subtitle: "تصور التوجه الاستراتيجي الخاص بك",
        vision: "الرؤية",
        mission: "الرسالة",
        pillars: "الركائز الاستراتيجية",
        objectives: "الأهداف المرتبطة",
        expand: "توسيع لرؤية الأهداف",
        collapse: "طي الأهداف"
      },
      strategyHouse: {
        title: "بيت الاستراتيجية",
        subtitle: "توثيق الهيكل التنظيمي وخطوط الإبلاغ",
        hierarchy: "التسلسل الهرمي التنظيمي",
        departments: "الأقسام الرئيسية",
        reportingLines: "خطوط الإبلاغ",
        addDepartment: "إضافة قسم",
        departmentName: "اسم القسم",
        headOfDepartment: "رئيس القسم",
        parentDepartment: "القسم الأعلى",
        noParent: "لا يوجد (المستوى الأعلى)",
        members: "أعضاء الفريق",
        searchPlaceholder: "البحث حسب القسم أو الرئيس...",
        save: "حفظ القسم",
        cancel: "إلغاء"
      },
      initiatives: {
        title: "إدارة المبادرات",
        subtitle: "إدارة وتتبع المبادرات الاستراتيجية",
        addInitiative: "إضافة مبادرة",
        name: "اسم المبادرة",
        owner: "المالك",
        progress: "التقدم",
        budget: "الميزانية",
        status: "الحالة"
      },
      strategy: {
        title: "إدارة الاستراتيجية",
        subtitle: "تحديد وإدارة الاستراتيجيات التنظيمية",
        createStrategy: "إنشاء استراتيجية",
        name: "اسم الاستراتيجية",
        period: "الفترة",
        pillars: "الركائز",
        objectives: "الأهداف",
        status: "الحالة"
      },
      orgStructure: {
        title: "الهيكل التنظيمي",
        subtitle: "تصور وإدارة الهيكل التنظيمي",
        expandNode: "انقر على عقدة لتوسيع الأقسام والفرق"
      }
    }
  }
};

// --- Components ---

const DashboardPreview = ({ lang, t }: any) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
      <div className="border-b border-zinc-100 dark:border-zinc-800 p-4 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">FocusIn Strategy Dashboard</div>
        <div className="w-12" />
      </div>
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: t.hero.stats.revenue, val: "92%", color: "text-blue-600" },
            { label: t.hero.stats.satisfaction, val: "88%", color: "text-emerald-600" },
            { label: t.hero.stats.efficiency, val: "95%", color: "text-purple-600" },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold">Strategic Pillar: Digital Transformation</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-bold">On Track</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[85%]" />
            </div>
          </div>
          <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold">Strategic Pillar: Operational Excellence</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 font-bold">Attention Needed</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 w-[62%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children, title, subtitle, icon: Icon }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5 text-zinc-500" />
        </button>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            {Icon && (
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{title}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{subtitle}</p>
            </div>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const KPIManagement = ({ lang, t }: { lang: string; t: any }) => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KPI | null>(null);
  const [deletingKpiId, setDeletingKpiId] = useState<string | null>(null);

  useEffect(() => {
    api.kpis.list().then(setKpis).catch(console.error);
  }, []);

  const handleSaveKpi = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = {
      name: formData.get('name') as string,
      objective: formData.get('objective') as string,
      target: Number(formData.get('target')),
      baseline: Number(formData.get('baseline')),
      actual: Number(formData.get('actual')),
      unit: formData.get('unit') as string,
    };
    if (editingKpi) {
      await api.kpis.update(editingKpi.id, payload);
      setKpis(kpis.map(k => k.id === editingKpi.id ? { ...k, ...payload } : k));
    } else {
      const created = await api.kpis.create(payload);
      setKpis([...kpis, created]);
    }
    setIsModalOpen(false);
    setEditingKpi(null);
  };

  const handleDeleteKpi = async () => {
    if (deletingKpiId) {
      await api.kpis.remove(deletingKpiId);
      setKpis(kpis.filter(k => k.id !== deletingKpiId));
      setShowDeleteModal(false);
      setDeletingKpiId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="text-start">
          <h2 className="text-2xl font-bold">{t.dashboard.kpi.title}</h2>
          <p className="text-sm text-zinc-500">{t.dashboard.kpi.subtitle}</p>
        </div>
        <button 
          onClick={() => { setEditingKpi(null); setIsModalOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Zap className="w-5 h-5" />
          {t.dashboard.kpi.addKpi}
        </button>
      </div>

      <div className="grid gap-6">
        {kpis.map((kpi) => {
          const progress = Math.min(100, (kpi.actual / kpi.target) * 100);
          return (
            <div key={kpi.id} className="bento-card !p-8 group hover:-translate-y-1 transition-all">
              <div className="flex items-start justify-between mb-8">
                <div className="flex gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
                    <BarChart3 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl mb-1">{kpi.name}</h3>
                    <p className="text-sm text-zinc-400 font-medium">{kpi.objective}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setEditingKpi(kpi); setIsModalOpen(true); }}
                    className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-400 hover:text-emerald-600 transition-colors"
                    title={t.dashboard.kpi.editKpi}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setDeletingKpiId(kpi.id); setShowDeleteModal(true); }}
                    className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500 transition-colors"
                    title={t.dashboard.kpi.delete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-8 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">{t.dashboard.kpi.baseline}</p>
                  <p className="text-xl font-bold">{kpi.baseline}{kpi.unit}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">{t.dashboard.kpi.target}</p>
                  <p className="text-xl font-bold">{kpi.target}{kpi.unit}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">{t.dashboard.kpi.actual}</p>
                  <p className="text-xl font-bold">{kpi.actual}{kpi.unit}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">{t.dashboard.kpi.progress}</p>
                  <p className="text-xl font-bold">{progress.toFixed(1)}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                  <span className="text-zinc-400">{t.dashboard.kpi.status}</span>
                  <span className={progress >= 100 ? 'text-emerald-600' : progress >= 75 ? 'text-blue-600' : 'text-yellow-600'}>
                    {progress >= 100 ? 'Achieved' : progress >= 75 ? 'On Track' : 'Below Target'}
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full ${progress >= 100 ? 'bg-emerald-500' : progress >= 75 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingKpi ? t.dashboard.kpi.editKpi : t.dashboard.kpi.addKpi}
        subtitle={t.dashboard.kpi.subtitle}
        icon={Zap}
      >
        <form key={editingKpi?.id || 'new'} onSubmit={handleSaveKpi} className="space-y-4 text-start">
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t.dashboard.kpi.name}</label>
            <input required name="name" defaultValue={editingKpi?.name} placeholder={t.dashboard.kpi.placeholder.name} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">{t.dashboard.kpi.objective}</label>
            <input required name="objective" defaultValue={editingKpi?.objective} placeholder={t.dashboard.kpi.placeholder.objective} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.dashboard.kpi.baseline}</label>
              <input required name="baseline" type="number" defaultValue={editingKpi?.baseline} placeholder={t.dashboard.kpi.placeholder.baseline} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.dashboard.kpi.target}</label>
              <input required name="target" type="number" defaultValue={editingKpi?.target} placeholder={t.dashboard.kpi.placeholder.target} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.dashboard.kpi.actual}</label>
              <input required name="actual" type="number" defaultValue={editingKpi?.actual} placeholder={t.dashboard.kpi.placeholder.actual} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t.dashboard.kpi.unit}</label>
              <input required name="unit" defaultValue={editingKpi?.unit} placeholder={t.dashboard.kpi.placeholder.unit} className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
              {t.dashboard.kpi.cancel}
            </button>
            <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
              {t.dashboard.kpi.save}
            </button>
          </div>
        </form>
      </Modal>

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-zinc-100 dark:border-zinc-800"
            >
              <div className="flex items-center gap-4 mb-6 text-red-600">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-start">{t.dashboard.kpi.deleteConfirmTitle}</h3>
                  <p className="text-sm text-zinc-500 text-start">{t.dashboard.kpi.deleteConfirmMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => { setShowDeleteModal(false); setDeletingKpiId(null); }}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                >
                  {t.dashboard.kpi.cancel}
                </button>
                <button 
                  onClick={handleDeleteKpi}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-900/20 transition-all"
                >
                  {t.dashboard.kpi.delete}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StrategyMap = ({ lang, t }: { lang: string; t: any }) => {
  const [expandedPillars, setExpandedPillars] = useState<string[]>(['pillar-1']);
  const isRtl = lang === 'ar';
  const [editingVision, setEditingVision] = useState(false);
  const [editingMission, setEditingMission] = useState(false);
  const [editingPillar, setEditingPillar] = useState<any>(null);
  const [strategyData, setStrategyData] = useState({
    vision: "To be the global leader in strategic execution and performance excellence.",
    mission: "Empowering organizations to transform their strategic vision into measurable success through innovative technology.",
    pillars: [
      { id: 'pillar-1', title: "Operational Excellence", color: "blue", objectives: ["Optimize Internal Processes", "Reduce Operational Costs by 15%", "Implement Lean Methodologies"] },
      { id: 'pillar-2', title: "Customer Centricity", color: "emerald", objectives: ["Enhance Customer Experience", "Increase Retention Rate to 95%", "Expand Market Presence"] },
      { id: 'pillar-3', title: "Innovation & Growth", color: "purple", objectives: ["Foster a Culture of Innovation", "Launch 3 New Product Lines", "Invest in R&D"] }
    ]
  });
  const [tempText, setTempText] = useState('');
  const [tempPillar, setTempPillar] = useState<any>(null);

  const togglePillar = (id: string) => {
    setExpandedPillars(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const savePillar = () => {
    setStrategyData(sd => ({
      ...sd,
      pillars: sd.pillars.map(p => p.id === tempPillar.id ? { ...p, title: tempPillar.title, objectives: tempPillar.objectives } : p)
    }));
    setEditingPillar(null);
    setTempPillar(null);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      {/* Pillar Edit Modal */}
      <AnimatePresence>
        {editingPillar && tempPillar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-8 w-full max-w-lg shadow-2xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Edit Pillar</h3>
                <button onClick={() => { setEditingPillar(null); setTempPillar(null); }} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Pillar Title</label>
                  <input value={tempPillar.title} onChange={e => setTempPillar({ ...tempPillar, title: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Objectives (one per line)</label>
                  <textarea rows={6} value={tempPillar.objectives.join('\n')} onChange={e => setTempPillar({ ...tempPillar, objectives: e.target.value.split('\n').filter((o: string) => o.trim()) })} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setEditingPillar(null); setTempPillar(null); }} className="flex-1 px-4 py-3 rounded-xl font-bold text-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Cancel</button>
                  <button onClick={savePillar} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-bold text-sm transition-all">Save</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t.dashboard.strategyMap.title}</h2>
        <p className="text-zinc-500">{t.dashboard.strategyMap.subtitle}</p>
      </div>

      {/* Vision & Mission */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bento-card !p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">{t.dashboard.strategyMap.vision}</h3>
              </div>
              <button onClick={() => { setEditingVision(true); setTempText(strategyData.vision); }} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            {editingVision ? (
              <div className="space-y-3">
                <textarea value={tempText} onChange={e => setTempText(e.target.value)} rows={3} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                <div className="flex gap-2">
                  <button onClick={() => setEditingVision(false)} className="flex-1 px-3 py-2 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">Cancel</button>
                  <button onClick={() => { setStrategyData(sd => ({ ...sd, vision: tempText })); setEditingVision(false); }} className="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white">Save</button>
                </div>
              </div>
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed italic text-lg">"{strategyData.vision}"</p>
            )}
          </div>
        </div>

        <div className="bento-card !p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold">{t.dashboard.strategyMap.mission}</h3>
              </div>
              <button onClick={() => { setEditingMission(true); setTempText(strategyData.mission); }} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-all">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            {editingMission ? (
              <div className="space-y-3">
                <textarea value={tempText} onChange={e => setTempText(e.target.value)} rows={3} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                <div className="flex gap-2">
                  <button onClick={() => setEditingMission(false)} className="flex-1 px-3 py-2 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800">Cancel</button>
                  <button onClick={() => { setStrategyData(sd => ({ ...sd, mission: tempText })); setEditingMission(false); }} className="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white">Save</button>
                </div>
              </div>
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed italic text-lg">"{strategyData.mission}"</p>
            )}
          </div>
        </div>
      </div>

      {/* Strategic Pillars */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-zinc-400" />
            {t.dashboard.strategyMap.pillars}
          </h3>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{strategyData.pillars.length} Pillars</span>
        </div>

        <div className="grid gap-4">
          {strategyData.pillars.map((pillar) => {
            const isExpanded = expandedPillars.includes(pillar.id);
            return (
              <div 
                key={pillar.id} 
                className={`bento-card !p-0 transition-all duration-300 ${
                  isExpanded 
                    ? `border-${pillar.color}-200 dark:border-${pillar.color}-800 shadow-lg shadow-${pillar.color}-500/5` 
                    : 'hover:border-zinc-200 dark:hover:border-zinc-700'
                }`}
              >
                <div className="w-full p-6 flex items-center justify-between text-start">
                  <button onClick={() => togglePillar(pillar.id)} className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-2xl bg-${pillar.color}-50 dark:bg-${pillar.color}-900/20 flex items-center justify-center`}>
                      <div className={`w-3 h-3 rounded-full bg-${pillar.color}-500 shadow-lg shadow-${pillar.color}-500/50`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{pillar.title}</h4>
                      <p className="text-xs text-zinc-400">{isExpanded ? t.dashboard.strategyMap.collapse : t.dashboard.strategyMap.expand}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingPillar(pillar.id); setTempPillar({ ...pillar, objectives: [...pillar.objectives] }); }} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-emerald-600 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <div className={`w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} onClick={() => togglePillar(pillar.id)}>
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 pt-2 border-t border-zinc-50 dark:border-zinc-800/50">
                        <div className="flex items-center gap-2 mb-6">
                          <div className={`w-1 h-4 rounded-full bg-${pillar.color}-500`} />
                          <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{t.dashboard.strategyMap.objectives}</h5>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {pillar.objectives.map((obj, idx) => (
                            <div 
                              key={idx} 
                              className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 flex items-start gap-3 group/obj hover:bg-white dark:hover:bg-zinc-800 transition-all cursor-default"
                            >
                              <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${pillar.color}-400 group-hover/obj:scale-150 transition-transform`} />
                              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-snug">{obj}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StrategyHouse = ({ lang, t }: { lang: string; t: any }) => {
  const isRtl = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [newDept, setNewDept] = useState({ name: '', head: '', parentId: '', members: 0 });
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    api.departments.list()
      .then((items: any[]) => setDepartments(items.map(d => ({ ...d, parentId: d.parent_id }))))
      .catch(console.error);
  }, []);

  const handleAddDepartment = async (e: FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      await api.departments.update(editingDept.id, { name: newDept.name, head: newDept.head, parent_id: newDept.parentId || null, members: newDept.members });
      setDepartments(departments.map(d => d.id === editingDept.id ? { ...d, ...newDept, parentId: newDept.parentId || null } : d));
      setEditingDept(null);
    } else {
      const created = await api.departments.create({ name: newDept.name, head: newDept.head, parent_id: newDept.parentId || null, members: newDept.members });
      setDepartments([...departments, { ...created, parentId: created.parent_id }]);
    }
    setShowAddModal(false);
    setNewDept({ name: '', head: '', parentId: '', members: 0 });
  };

  const handleDeleteDept = async (id: string) => {
    await api.departments.remove(id);
    setDepartments(departments.filter(d => d.id !== id));
  };

  const openEdit = (dept: any) => {
    setEditingDept(dept);
    setNewDept({ name: dept.name, head: dept.head, parentId: dept.parentId || '', members: dept.members });
    setShowAddModal(true);
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTree = (parentId: string | null = null, level = 0) => {
    // When searching, we might want to show a different view or highlight.
    // For simplicity, we'll keep the tree but only show branches that have matches.
    // Or just show the full tree if no search, and a flat list if searching.
    
    const children = departments.filter(d => d.parentId === parentId);
    if (children.length === 0) return null;

    return (
      <div className={`space-y-4 ${level > 0 ? (isRtl ? 'mr-8 border-r' : 'ml-8 border-l') + ' border-zinc-100 dark:border-zinc-800 pt-2' : ''}`}>
        {children.map(dept => {
          const isMatch = searchQuery === '' || 
            dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dept.head.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Check if any descendant is a match
          const hasMatchingDescendant = (id: string): boolean => {
            const directChildren = departments.filter(d => d.parentId === id);
            return directChildren.some(c => 
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.head.toLowerCase().includes(searchQuery.toLowerCase()) ||
              hasMatchingDescendant(c.id)
            );
          };

          if (searchQuery !== '' && !isMatch && !hasMatchingDescendant(dept.id)) return null;

          return (
            <div key={dept.id} className="relative">
              {level > 0 && (
                <div className={`absolute top-6 ${isRtl ? '-right-8' : '-left-8'} w-8 h-px bg-zinc-100 dark:bg-zinc-800`} />
              )}
              <div className={`p-5 rounded-[1.5rem] border transition-all duration-300 group ${
                isMatch && searchQuery !== '' 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 shadow-lg ring-2 ring-emerald-500/20' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-bento hover:-translate-y-1'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isMatch && searchQuery !== '' ? 'bg-emerald-100 dark:bg-emerald-800' : 'bg-emerald-50 dark:bg-emerald-900/20'
                    }`}>
                      <Users className={`w-5 h-5 ${isMatch && searchQuery !== '' ? 'text-emerald-700 dark:text-emerald-300' : 'text-emerald-600'}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{dept.name}</h4>
                      <p className="text-xs text-zinc-400">{dept.head}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-end">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t.dashboard.strategyHouse.members}</p>
                      <p className="text-xs font-bold">{dept.members}</p>
                    </div>
                    <button onClick={() => openEdit(dept)} className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-zinc-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-all">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteDept(dept.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              {renderTree(dept.id, level + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">{t.dashboard.strategyHouse.title}</h2>
          <p className="text-zinc-500">{t.dashboard.strategyHouse.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={t.dashboard.strategyHouse.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm w-64 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {t.dashboard.strategyHouse.addDepartment}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-zinc-100 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{editingDept ? t.dashboard.strategyHouse.save : t.dashboard.strategyHouse.addDepartment}</h3>
                <button onClick={() => { setShowAddModal(false); setEditingDept(null); setNewDept({ name: '', head: '', parentId: '', members: 0 }); }} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDepartment} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t.dashboard.strategyHouse.departmentName}</label>
                  <input 
                    required
                    type="text" 
                    value={newDept.name}
                    onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g., Engineering"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t.dashboard.strategyHouse.headOfDepartment}</label>
                  <input 
                    required
                    type="text" 
                    value={newDept.head}
                    onChange={(e) => setNewDept({...newDept, head: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g., John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t.dashboard.strategyHouse.parentDepartment}</label>
                    <select 
                      value={newDept.parentId}
                      onChange={(e) => setNewDept({...newDept, parentId: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">{t.dashboard.strategyHouse.noParent}</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t.dashboard.strategyHouse.members}</label>
                    <input 
                      type="number" 
                      value={newDept.members}
                      onChange={(e) => setNewDept({...newDept, members: parseInt(e.target.value) || 0})}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-8">
                  <button 
                    type="button"
                    onClick={() => { setShowAddModal(false); setEditingDept(null); setNewDept({ name: '', head: '', parentId: '', members: 0 }); }}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    {t.dashboard.strategyHouse.cancel}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all"
                  >
                    {t.dashboard.strategyHouse.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-zinc-400" />
              <h3 className="text-lg font-bold">{t.dashboard.strategyHouse.hierarchy}</h3>
            </div>
            {searchQuery && (
              <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                {filteredDepartments.length} results found
              </span>
            )}
          </div>
          <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-100 dark:border-zinc-800">
            {renderTree()}
            {searchQuery !== '' && filteredDepartments.length === 0 && (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-zinc-400" />
                </div>
                <p className="text-zinc-500 text-sm">No departments found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-zinc-400" />
            <h3 className="text-lg font-bold">{t.dashboard.strategyHouse.departments}</h3>
          </div>
          <div className="space-y-3">
            {filteredDepartments.map(dept => (
              <div key={dept.id} className={`p-4 rounded-2xl border flex items-center justify-between group transition-all ${
                searchQuery !== '' && (dept.name.toLowerCase().includes(searchQuery.toLowerCase()) || dept.head.toLowerCase().includes(searchQuery.toLowerCase()))
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                    <span className="text-xs font-bold text-zinc-400">{dept.name.charAt(0)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <span className="text-[10px] text-zinc-400">{dept.head}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-zinc-300 group-hover:text-emerald-500 transition-colors ${isRtl ? 'rotate-180' : ''}`} />
              </div>
            ))}
            {filteredDepartments.length === 0 && (
              <p className="text-center py-4 text-xs text-zinc-400 italic">No matches</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const BalancedScorecard = ({ lang, t }: { lang: string; t: any }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ perspective: 'financial', obj: '', kpi: '', target: '', actual: '', status: 'On Track' });
  const [bscItems, setBscItems] = useState<any[]>([]);

  const PERSPECTIVES = [
    { id: 'financial', title: t.dashboard.bsc.perspectives.financial, color: 'blue' },
    { id: 'customer', title: t.dashboard.bsc.perspectives.customer, color: 'emerald' },
    { id: 'internal', title: t.dashboard.bsc.perspectives.internal, color: 'purple' },
    { id: 'learning', title: t.dashboard.bsc.perspectives.learning, color: 'orange' },
  ];

  const perspectivesData = PERSPECTIVES.map(p => ({
    ...p,
    items: bscItems.filter(item => item.perspective === p.id),
  }));

  useEffect(() => {
    api.bsc.list()
      .then((items: any[]) => setBscItems(items.map(i => ({ ...i, obj: i.objective }))))
      .catch(console.error);
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { perspective: newItem.perspective, objective: newItem.obj, kpi: newItem.kpi, target: newItem.target, actual: newItem.actual, status: newItem.status };
    if (editingItem) {
      await api.bsc.update(editingItem.id, payload);
      setBscItems(bscItems.map(b => b.id === editingItem.id ? { ...b, ...payload, obj: payload.objective } : b));
    } else {
      const created = await api.bsc.create(payload);
      setBscItems([...bscItems, { ...created, obj: created.objective }]);
    }
    setShowAddModal(false);
    setEditingItem(null);
    setNewItem({ perspective: 'financial', obj: '', kpi: '', target: '', actual: '', status: 'On Track' });
  };

  const handleDelete = async () => {
    if (!deletingItemId) return;
    await api.bsc.remove(deletingItemId);
    setBscItems(bscItems.filter(b => b.id !== deletingItemId));
    setShowDeleteModal(false);
    setDeletingItemId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="text-start">
          <h2 className="text-2xl font-bold">{t.dashboard.bsc.title}</h2>
          <p className="text-sm text-zinc-500">{t.dashboard.bsc.subtitle}</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t.dashboard.bsc.addObjective}
        </button>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-lg shadow-2xl border border-zinc-100 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{editingItem !== null ? t.dashboard.bsc.editObjective : t.dashboard.bsc.addObjective}</h3>
                <button onClick={() => { setShowAddModal(false); setEditingItem(null); }} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Perspective</label>
                  <select 
                    value={newItem.perspective}
                    onChange={(e) => setNewItem({...newItem, perspective: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="financial">{t.dashboard.bsc.perspectives.financial}</option>
                    <option value="customer">{t.dashboard.bsc.perspectives.customer}</option>
                    <option value="internal">{t.dashboard.bsc.perspectives.internal}</option>
                    <option value="learning">{t.dashboard.bsc.perspectives.learning}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Objective</label>
                  <input 
                    required
                    type="text" 
                    value={newItem.obj}
                    onChange={(e) => setNewItem({...newItem, obj: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">KPI</label>
                  <input 
                    required
                    type="text" 
                    value={newItem.kpi}
                    onChange={(e) => setNewItem({...newItem, kpi: e.target.value})}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Target</label>
                    <input 
                      required
                      type="text" 
                      value={newItem.target}
                      onChange={(e) => setNewItem({...newItem, target: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Actual</label>
                    <input 
                      required
                      type="text" 
                      value={newItem.actual}
                      onChange={(e) => setNewItem({...newItem, actual: e.target.value})}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-8">
                  <button 
                    type="button"
                    onClick={() => { setShowAddModal(false); setEditingItem(null); }}
                    className="flex-1 px-6 py-3 rounded-xl font-bold text-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                  >
                    {t.dashboard.bsc.cancelBtn}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all"
                  >
                    {t.dashboard.bsc.metrics.save || 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-zinc-100 dark:border-zinc-800"
            >
              <div className="flex items-center gap-4 mb-6 text-red-600">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t.dashboard.bsc.deleteConfirmTitle}</h3>
                  <p className="text-sm text-zinc-500">{t.dashboard.bsc.deleteConfirmMessage}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => { setShowDeleteModal(false); setDeletingItemId(null); }}
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                >
                  {t.dashboard.bsc.cancelBtn}
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-900/20 transition-all"
                >
                  {t.dashboard.bsc.deleteBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-2 gap-8">
        {perspectivesData.map((p) => (
          <div key={p.id} className="bento-card !p-0 overflow-hidden">
            <div className={`p-5 bg-${p.color}-50 dark:bg-${p.color}-900/20 border-b border-${p.color}-100 dark:border-${p.color}-800/50 flex items-center justify-between`}>
              <h3 className={`font-bold text-${p.color}-700 dark:text-${p.color}-400 flex items-center gap-2`}>
                <div className={`w-2.5 h-2.5 rounded-full bg-${p.color}-500 shadow-lg shadow-${p.color}-500/40`} />
                {p.title}
              </h3>
              <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Perspective</span>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-start text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-zinc-50 dark:border-zinc-800">
                    <th className="px-4 py-3 font-semibold text-zinc-500 text-start">{t.dashboard.bsc.metrics.objective}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-500 text-start">{t.dashboard.bsc.metrics.kpi}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-500 text-start">{t.dashboard.bsc.metrics.target}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-500 text-start">{t.dashboard.bsc.metrics.actual}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-500 text-start">{t.dashboard.bsc.metrics.status}</th>
                    <th className="px-4 py-3 font-semibold text-zinc-500 text-start">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {p.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-zinc-50 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-4 py-4 font-medium">{item.obj}</td>
                      <td className="px-4 py-4 text-zinc-500">{item.kpi}</td>
                      <td className="px-4 py-4 font-bold">{item.target}</td>
                      <td className="px-4 py-4 font-bold">{item.actual}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          item.status === 'Achieved' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 transition-all">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setNewItem({ perspective: item.perspective, obj: item.obj, kpi: item.kpi, target: item.target, actual: item.actual, status: item.status });
                              setShowAddModal(true);
                            }}
                            className="p-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg text-zinc-400 hover:text-emerald-600 transition-colors"
                            title={t.dashboard.bsc.editObjective}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setDeletingItemId(item.id);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-zinc-400 hover:text-red-600 transition-colors"
                            title={t.dashboard.bsc.deleteObjective}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InitiativesManagement = ({ lang, t }: { lang: string; t: any }) => {
  const [initiatives, setInitiatives] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', owner: '', progress: 0, budget: '', status: 'Active' });

  useEffect(() => {
    api.initiatives.list().then(setInitiatives).catch(console.error);
  }, []);

  const [editingInit, setEditingInit] = useState<any>(null);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    if (editingInit) {
      await api.initiatives.update(editingInit.id, form);
      setInitiatives(initiatives.map(i => i.id === editingInit.id ? { ...i, ...form } : i));
      setEditingInit(null);
    } else {
      const created = await api.initiatives.create(form);
      setInitiatives([...initiatives, created]);
    }
    setShowModal(false);
    setForm({ name: '', owner: '', progress: 0, budget: '', status: 'Active' });
  };

  const handleDelete = async (id: string) => {
    await api.initiatives.remove(id);
    setInitiatives(initiatives.filter(i => i.id !== id));
  };

  const openEdit = (init: any) => {
    setEditingInit(init);
    setForm({ name: init.name, owner: init.owner, progress: init.progress, budget: init.budget, status: init.status });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingInit ? 'Edit Initiative' : t.dashboard.initiatives.addInitiative}</h3>
              <button onClick={() => { setShowModal(false); setEditingInit(null); setForm({ name: '', owner: '', progress: 0, budget: '', status: 'Active' }); }} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required placeholder={t.dashboard.initiatives.name} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <input required placeholder={t.dashboard.initiatives.owner} value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <input placeholder={t.dashboard.initiatives.budget} value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{t.dashboard.initiatives.progress}: {form.progress}%</label>
                <input type="range" min={0} max={100} value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} className="w-full accent-emerald-600" />
              </div>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="Active">Active</option>
                <option value="Planning">Planning</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Cancel</button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all">Save</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="text-start">
          <h2 className="text-2xl font-bold">{t.dashboard.initiatives.title}</h2>
          <p className="text-sm text-zinc-500">{t.dashboard.initiatives.subtitle}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" />
          {t.dashboard.initiatives.addInitiative}
        </button>
      </div>

      <div className="grid gap-6">
        {initiatives.map(init => (
          <div key={init.id} className="bento-card !p-6 flex items-center justify-between group hover:-translate-y-1 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
                <Zap className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-xl mb-1">{init.name}</h4>
                <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {init.owner}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {init.budget}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="w-48 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <span>{t.dashboard.initiatives.progress}</span>
                  <span>{init.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${init.progress}%` }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                init.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {init.status}
              </span>
              <button
                onClick={() => openEdit(init)}
                className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl text-zinc-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(init.id)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StrategyManagement = ({ lang, t }: { lang: string; t: any }) => {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStrat, setEditingStrat] = useState<any>(null);
  const [form, setForm] = useState({ name: '', period: '', status: 'Active', pillars: 0, objectives: 0 });

  useEffect(() => {
    api.strategies.list().then(setStrategies).catch(console.error);
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (editingStrat) {
      // No dedicated PUT on strategies yet — update locally
      setStrategies(strategies.map(s => s.id === editingStrat.id ? { ...s, ...form } : s));
      setEditingStrat(null);
    } else {
      const created = await api.strategies.create(form);
      setStrategies([...strategies, created]);
    }
    setShowModal(false);
    setForm({ name: '', period: '', status: 'Active', pillars: 0, objectives: 0 });
  };

  const handleDelete = async (id: string) => {
    await api.strategies.remove(id);
    setStrategies(strategies.filter(s => s.id !== id));
  };

  const openEdit = (s: any) => {
    setEditingStrat(s);
    setForm({ name: s.name, period: s.period, status: s.status, pillars: s.pillars, objectives: s.objectives });
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-zinc-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingStrat ? 'Edit Strategy' : t.dashboard.strategy.createStrategy}</h3>
              <button onClick={() => { setShowModal(false); setEditingStrat(null); setForm({ name: '', period: '', status: 'Active', pillars: 0, objectives: 0 }); }} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <input required placeholder={t.dashboard.strategy.name} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <input required placeholder={t.dashboard.strategy.period + ' (e.g. 2024-2030)'} value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" min={0} placeholder={t.dashboard.strategy.pillars} value={form.pillars} onChange={e => setForm({ ...form, pillars: Number(e.target.value) })} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                <input type="number" min={0} placeholder={t.dashboard.strategy.objectives} value={form.objectives} onChange={e => setForm({ ...form, objectives: Number(e.target.value) })} className="w-full bg-zinc-50 dark:bg-zinc-800 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingStrat(null); setForm({ name: '', period: '', status: 'Active', pillars: 0, objectives: 0 }); }} className="flex-1 px-4 py-3 rounded-xl font-bold text-sm border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">Cancel</button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all">Save</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="text-start">
          <h2 className="text-2xl font-bold">{t.dashboard.strategy.title}</h2>
          <p className="text-sm text-zinc-500">{t.dashboard.strategy.subtitle}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all">
          <Plus className="w-4 h-4" />
          {t.dashboard.strategy.createStrategy}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {strategies.map(strat => (
          <div key={strat.id} className="bento-card !p-8 group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold shadow-sm">{strat.status}</span>
                <button onClick={() => openEdit(strat)} className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl text-zinc-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-all"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(strat.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h4 className="text-2xl font-bold mb-3">{strat.name}</h4>
            <p className="text-sm text-zinc-400 mb-8 flex items-center gap-2 font-medium">
              <CalendarIcon className="w-4 h-4" /> {strat.period}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-zinc-50 dark:border-zinc-800">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t.dashboard.strategy.pillars}</p>
                <p className="text-lg font-bold">{strat.pillars}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t.dashboard.strategy.objectives}</p>
                <p className="text-lg font-bold">{strat.objectives}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrganizationStructure = ({ lang, t }: { lang: string; t: any }) => {
  return (
    <div className="space-y-8">
      <div className="text-start">
        <h2 className="text-2xl font-bold">{t.dashboard.orgStructure.title}</h2>
        <p className="text-sm text-zinc-500">{t.dashboard.orgStructure.subtitle}</p>
      </div>
      
      <div className="bento-card !p-16 flex flex-col items-center">
        <div className="w-56 p-5 bg-emerald-600 text-white rounded-2xl text-center shadow-2xl shadow-emerald-900/40 relative group cursor-default transition-transform hover:scale-105">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1.5">CEO</p>
          <p className="text-lg font-bold">Sarah Johnson</p>
        </div>
        
        <div className="h-16 w-px bg-zinc-200 dark:bg-zinc-800" />
        <div className="w-full max-w-3xl h-px bg-zinc-200 dark:bg-zinc-800" />
        
        <div className="grid grid-cols-3 gap-12 w-full max-w-5xl mt-0">
          {[
            { role: 'COO', name: 'David Miller', color: 'bg-blue-500' },
            { role: 'CFO', name: 'Emma Wilson', color: 'bg-purple-500' },
            { role: 'CHRO', name: 'Lisa Brown', color: 'bg-orange-500' },
          ].map((exec, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-16 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div className={`w-full p-5 ${exec.color} text-white rounded-2xl text-center shadow-xl transition-transform hover:scale-105 cursor-default`}>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1.5">{exec.role}</p>
                <p className="font-bold">{exec.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-700 text-center w-full max-w-md">
          <p className="text-sm text-zinc-500">{t.dashboard.orgStructure.expandNode}</p>
        </div>
      </div>
    </div>
  );
};

// ─── ChatView ─────────────────────────────────────────────────────────────────

const ChatView = ({ lang, t }: any) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: lang === 'ar'
      ? 'مرحباً! أنا مستشارك الذكي في إدارة الأداء الاستراتيجي. كيف يمكنني مساعدتك اليوم؟'
      : "Hello! I'm your strategic performance management AI advisor. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isRtl = lang === 'ar';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user' as const, content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    try {
      const payload = updated.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', content: m.content }));
      const data = await api.chat(payload);
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: err.message || (lang === 'ar' ? 'عذراً، حدث خطأ. حاول مجدداً.' : 'Sorry, an error occurred. Please try again.') }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = lang === 'ar'
    ? ['كيف أحسّن مؤشرات الأداء؟', 'ما هي بطاقة الأداء المتوازن؟', 'كيف أضع أهدافاً استراتيجية؟']
    : ['How can I improve my KPIs?', 'Explain the Balanced Scorecard framework', 'How to set strategic objectives?'];

  return (
    <div className={`flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bento-card mb-4 flex items-center gap-4 !p-6 flex-shrink-0">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold">{lang === 'ar' ? 'المستشار الذكي' : 'Strategic AI Advisor'}</h2>
          <p className="text-sm text-zinc-500 font-medium truncate">{lang === 'ar' ? 'اسأل عن المؤشرات، الاستراتيجية، وإدارة الأداء' : 'Ask about KPIs, strategy, and performance management'}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-600">{lang === 'ar' ? 'متصل' : 'Online'}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${(msg.role === 'user') !== isRtl ? 'justify-start' : 'justify-end'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-3 mt-1 flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${
              msg.role === 'user'
                ? 'bg-emerald-600 text-white rounded-br-md'
                : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-bl-md shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-3 mt-1 flex-shrink-0">
                <Users className="w-4 h-4 text-zinc-500" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-3 mt-1 flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        {messages.length === 1 && !loading && (
          <div className={`flex flex-wrap gap-2 ${isRtl ? 'flex-row-reverse' : ''} mt-4 mx-14`}>
            {quickPrompts.map((p, i) => (
              <button key={i} onClick={() => { setInput(p); }} className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-400 hover:text-emerald-600 rounded-xl px-4 py-2 transition-all font-medium">{p}</button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bento-card !p-4 flex-shrink-0">
        <div className={`flex items-end gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={lang === 'ar' ? 'اسأل عن الاستراتيجية أو المؤشرات...' : 'Ask about strategy, KPIs, performance...'}
            rows={2}
            dir={isRtl ? 'rtl' : 'ltr'}
            className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send className={`w-5 h-5 text-white ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <p className="text-[10px] text-zinc-400 font-medium mt-2">{lang === 'ar' ? 'Enter للإرسال • Shift+Enter لسطر جديد' : 'Press Enter to send • Shift+Enter for new line'}</p>
      </div>
    </div>
  );
};

// ─── SettingsView ──────────────────────────────────────────────────────────────

const SettingsView = ({ lang, t, user, onUpdateUser, theme, toggleTheme, toggleLang, onLogout }: any) => {
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', company: user?.company || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const isRtl = lang === 'ar';

  const saveProfile = async () => {
    setProfileLoading(true);
    setProfileMsg('');
    try {
      const updated = await api.profile.update({ name: profileForm.name, company: profileForm.company });
      onUpdateUser(updated);
      setProfileMsg(lang === 'ar' ? 'تم حفظ الملف الشخصي بنجاح' : 'Profile saved successfully');
    } catch (err: any) {
      setProfileMsg(err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  const changePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg(lang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg(lang === 'ar' ? 'كلمة المرور قصيرة جداً' : 'Password must be at least 6 characters');
      return;
    }
    setPwLoading(true);
    setPwMsg('');
    try {
      await api.profile.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg(lang === 'ar' ? 'تم تغيير كلمة المرور' : 'Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPwMsg(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto space-y-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      <h2 className="text-2xl font-bold">{lang === 'ar' ? 'الإعدادات' : 'Settings'}</h2>

      {/* Profile */}
      <div className="bento-card !p-8 space-y-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold">{lang === 'ar' ? 'الملف الشخصي' : 'Profile'}</h3>
            <p className="text-xs text-zinc-500">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{lang === 'ar' ? 'الاسم' : 'Full Name'}</label>
            <input
              value={profileForm.name}
              onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
              dir={isRtl ? 'rtl' : 'ltr'}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">{lang === 'ar' ? 'الشركة' : 'Company / Organization'}</label>
            <input
              value={profileForm.company}
              onChange={e => setProfileForm(f => ({ ...f, company: e.target.value }))}
              dir={isRtl ? 'rtl' : 'ltr'}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>
        {profileMsg && <p className={`text-sm font-medium ${profileMsg.includes('success') || profileMsg.includes('نجاح') ? 'text-emerald-600' : 'text-red-500'}`}>{profileMsg}</p>}
        <button
          onClick={saveProfile}
          disabled={profileLoading || !profileForm.name.trim()}
          className="btn-primary w-full disabled:opacity-50"
        >
          {profileLoading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ الملف الشخصي' : 'Save Profile')}
        </button>
      </div>

      {/* Appearance */}
      <div className="bento-card !p-8 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <Moon className="w-5 h-5 text-zinc-500" />
          </div>
          <h3 className="font-bold">{lang === 'ar' ? 'المظهر واللغة' : 'Appearance & Language'}</h3>
        </div>
        <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div>
            <p className="font-semibold text-sm">{lang === 'ar' ? 'الوضع الليلي' : 'Dark Mode'}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{lang === 'ar' ? 'تغيير مظهر التطبيق' : 'Toggle light / dark theme'}</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${theme === 'dark' ? (isRtl ? 'right-1' : 'left-7') : (isRtl ? 'right-7' : 'left-1')}`} />
          </button>
        </div>
        <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div>
            <p className="font-semibold text-sm">{lang === 'ar' ? 'اللغة' : 'Language'}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{lang === 'ar' ? 'اللغة الحالية: العربية' : 'Current: English'}</p>
          </div>
          <button
            onClick={toggleLang}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl text-sm font-bold transition-colors"
          >
            <Globe className="w-4 h-4" />
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="bento-card !p-8 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-zinc-500" />
          </div>
          <h3 className="font-bold">{lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</h3>
        </div>
        {(['currentPassword', 'newPassword', 'confirmPassword'] as const).map((field) => (
          <div key={field}>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
              {field === 'currentPassword' ? (lang === 'ar' ? 'كلمة المرور الحالية' : 'Current Password') :
               field === 'newPassword' ? (lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password') :
               (lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm New Password')}
            </label>
            <input
              type="password"
              value={pwForm[field]}
              onChange={e => setPwForm(f => ({ ...f, [field]: e.target.value }))}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        ))}
        {pwMsg && <p className={`text-sm font-medium ${pwMsg.includes('success') || pwMsg.includes('تم') ? 'text-emerald-600' : 'text-red-500'}`}>{pwMsg}</p>}
        <button
          onClick={changePassword}
          disabled={pwLoading || !pwForm.currentPassword || !pwForm.newPassword}
          className="btn-primary w-full disabled:opacity-50"
        >
          {pwLoading ? (lang === 'ar' ? 'جاري التغيير...' : 'Changing...') : (lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password')}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bento-card !p-8 border-red-100 dark:border-red-900/30">
        <h3 className="font-bold text-red-600 mb-4">{lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}</h3>
        <p className="text-sm text-zinc-500 mb-4">{lang === 'ar' ? 'سيتم إنهاء الجلسة الحالية' : 'You will be signed out of your current session.'}</p>
        <button
          onClick={onLogout}
          className="w-full px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 font-bold rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-900/30"
        >
          {lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
};

const Dashboard = ({ lang, t, onLogout, theme, toggleTheme, toggleLang, user, onUpdateUser }: any) => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [currentView, setCurrentView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const isRtl = lang === 'ar';

  const notifications = [
    { id: 1, icon: Target, color: 'text-blue-600 bg-blue-50', title: 'KPI Target Reached', desc: 'Employee Training Hours exceeded target by 12.5%', time: '2m ago' },
    { id: 2, icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50', title: 'Strategy at Risk', desc: 'Customer Experience Initiative is at 45% — below threshold', time: '1h ago' },
    { id: 3, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50', title: 'Report Generated', desc: 'Q1 Balanced Scorecard report is ready for review', time: '3h ago' },
    { id: 4, icon: Users, color: 'text-purple-600 bg-purple-50', title: 'New Department Added', desc: 'Technology department was added to the org structure', time: '1d ago' },
  ];

  const pieData = [
    { name: 'Completed', value: 400 },
    { name: 'In Progress', value: 300 },
    { name: 'Not Started', value: 300 },
  ];
  const COLORS = ['#10b981', '#3b82f6', '#94a3b8'];

  const barData = [
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 200 },
    { name: 'Category D', value: 278 },
  ];

  return (
    <div className={`flex h-screen bg-zinc-50 dark:bg-zinc-950 ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 z-50 w-72 bg-[#064e3b] text-white flex flex-col transition-transform duration-300 lg:static lg:translate-x-0
        ${isRtl ? (isSidebarOpen ? 'translate-x-0' : 'translate-x-full') : (isSidebarOpen ? 'translate-x-0' : '-translate-x-full')}
      `}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-900/20">
            <BarChart3 className="text-emerald-900 w-7 h-7" />
          </div>
          <span className="text-2xl font-bold tracking-tight">FocusIn</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {[
            { id: 'home', icon: Home, label: t.dashboard.sidebar.home },
            { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard.sidebar.dashboard },
            { id: 'org', icon: Network, label: t.dashboard.sidebar.orgStructure },
            { id: 'strategy', icon: Target, label: t.dashboard.sidebar.strategyMgmt, hasSub: true },
            { id: 'initiatives', icon: Zap, label: t.dashboard.sidebar.initiativesMgmt, hasSub: true },
            { id: 'kpi', icon: BarChart3, label: t.dashboard.sidebar.performanceMeasure, hasSub: true },
            { id: 'bsc', icon: LayoutGrid, label: t.dashboard.sidebar.balancedScorecard },
            { id: 'house', icon: Home, label: t.dashboard.sidebar.strategyHouse },
            { id: 'map', icon: Target, label: t.dashboard.sidebar.strategyMap },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => { setCurrentView(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 font-semibold' 
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-200 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-sm flex-1 text-start">{item.label}</span>
              {item.hasSub && <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${currentView === item.id ? 'rotate-180' : ''}`} />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10 space-y-1">
          <button
            onClick={() => { setCurrentView('chat'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === 'chat' ? 'bg-white/15 text-white' : 'text-emerald-100/70 hover:text-white hover:bg-white/5'}`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium text-start">{t.dashboard.sidebar.chat}</span>
          </button>
          <button
            onClick={() => { setCurrentView('settings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${currentView === 'settings' ? 'bg-white/15 text-white' : 'text-emerald-100/70 hover:text-white hover:bg-white/5'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium flex-1 text-start">{t.dashboard.sidebar.settings}</span>
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-red-100 transition-all mt-4"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium text-start">{t.dashboard.sidebar.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        {/* Top Header */}
        <header className="h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl lg:hidden"
            >
              <Menu className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
              <Home className="w-3.5 h-3.5" />
              <ChevronRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
              <span className="font-medium">
                {currentView === 'home' ? t.dashboard.sidebar.home :
                 currentView === 'dashboard' ? t.dashboard.sidebar.dashboard :
                 currentView === 'org' ? t.dashboard.sidebar.orgStructure :
                 currentView === 'strategy' ? t.dashboard.sidebar.strategyMgmt :
                 currentView === 'initiatives' ? t.dashboard.sidebar.initiativesMgmt :
                 currentView === 'kpi' ? t.dashboard.sidebar.performanceMeasure :
                 currentView === 'bsc' ? t.dashboard.sidebar.balancedScorecard :
                 currentView === 'house' ? t.dashboard.sidebar.strategyHouse :
                 currentView === 'map' ? t.dashboard.sidebar.strategyMap :
                 currentView === 'chat' ? t.dashboard.sidebar.chat :
                 currentView === 'settings' ? t.dashboard.sidebar.settings : ''}
              </span>
              {currentView !== 'home' && (
                <>
                  <ChevronRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
                  <span className="text-zinc-900 dark:text-white font-bold">
                    {currentView === 'dashboard' ? 'Analytics' :
                     currentView === 'org' ? 'Hierarchy' :
                     currentView === 'strategy' ? 'Overview' :
                     currentView === 'initiatives' ? 'Projects' :
                     currentView === 'kpi' ? t.dashboard.kpi.title :
                     currentView === 'bsc' ? t.dashboard.bsc.title :
                     currentView === 'map' ? t.dashboard.strategyMap.title :
                     currentView === 'house' ? t.dashboard.strategyHouse.title :
                     currentView === 'chat' ? (lang === 'ar' ? 'المستشار الذكي' : 'AI Advisor') :
                     currentView === 'settings' ? (lang === 'ar' ? 'إعداداتي' : 'My Settings') : ''}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm w-48 lg:w-64 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-1 lg:gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5 text-zinc-500" /> : <Sun className="w-5 h-5 text-zinc-400" />}
              </button>
              {/* Language Toggle */}
              <button
                onClick={toggleLang}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-xs font-bold text-zinc-500"
                title="Toggle language"
              >
                <Globe className="w-5 h-5" />
              </button>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-zinc-500" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotifications(false)} className="fixed inset-0 z-40" />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={`absolute top-12 ${isRtl ? 'left-0' : 'right-0'} z-50 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden`}
                      >
                        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                          <h4 className="font-bold text-sm">{t.dashboard.tabs.notifications}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">{notifications.length} New</span>
                        </div>
                        <div className="divide-y divide-zinc-50 dark:divide-zinc-800 max-h-80 overflow-y-auto">
                          {notifications.map(n => (
                            <div key={n.id} className="p-4 flex items-start gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                                <n.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-zinc-900 dark:text-white">{n.title}</p>
                                <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{n.desc}</p>
                                <p className="text-[10px] text-zinc-400 mt-1 font-medium">{n.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800">
                          <button onClick={() => setShowNotifications(false)} className="w-full text-center text-xs font-bold text-emerald-600 hover:text-emerald-700 py-1">Mark all as read</button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              {/* Settings */}
              <button
                onClick={() => { setCurrentView('settings'); setShowNotifications(false); }}
                className={`p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors ${currentView === 'settings' ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
              >
                <Settings className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
            <div className="flex items-center gap-3 pl-1">
              <div className="text-end hidden sm:block">
                <p className="text-xs font-bold text-zinc-900 dark:text-white leading-none mb-1">{user?.name || 'Strategy Admin'}</p>
                <p className="text-[10px] text-zinc-500 font-medium leading-none">{user?.company || 'Administrator'}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'kpi' ? (
                <KPIManagement lang={lang} t={t} />
              ) : currentView === 'bsc' ? (
                <BalancedScorecard lang={lang} t={t} />
              ) : currentView === 'map' ? (
                <StrategyMap lang={lang} t={t} />
              ) : currentView === 'house' ? (
                <StrategyHouse lang={lang} t={t} />
              ) : currentView === 'org' ? (
                <OrganizationStructure lang={lang} t={t} />
              ) : currentView === 'strategy' ? (
                <StrategyManagement lang={lang} t={t} />
              ) : currentView === 'initiatives' ? (
                <InitiativesManagement lang={lang} t={t} />
              ) : currentView === 'chat' ? (
                <ChatView lang={lang} t={t} />
              ) : currentView === 'settings' ? (
                <SettingsView lang={lang} t={t} user={user} onUpdateUser={onUpdateUser} theme={theme} toggleTheme={toggleTheme} toggleLang={toggleLang} onLogout={onLogout} />
              ) : currentView === 'dashboard' ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                    <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                      <CalendarIcon className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-500">Last 30 Days</span>
                    </div>
                  </div>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bento-card">
                      <h3 className="text-lg font-bold mb-6">{t.dashboard.charts.status}</h3>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bento-card">
                      <h3 className="text-lg font-bold mb-6">{t.dashboard.charts.risk}</h3>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-4 gap-8">
                  {/* Left Column (Main Stats) */}
                  <div className="lg:col-span-3 space-y-8">
                  {/* Welcome Banner */}
                  <div className="bg-[#064e3b] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-emerald-900/20">
                    <div className="relative z-10 max-w-lg">
                      <h2 className="text-4xl font-bold mb-3">{t.dashboard.welcome} Strategy!</h2>
                      <p className="text-emerald-100/80 mb-8 leading-relaxed">
                        Your strategic performance is looking strong this month. You have 8 active strategies under management.
                      </p>
                      <div className="flex items-center gap-4">
                        <button className="bg-white text-emerald-900 px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/10">
                          View Strategy Map
                        </button>
                        <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 backdrop-blur-md">
                          <Target className="w-4 h-4" />
                          {t.dashboard.activeStrategies}: 8
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl" />
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                    {[
                      { label: t.dashboard.cards.totalProjects, val: "12", desc: t.dashboard.cards.allProjects, icon: BarChart3, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
                      { label: t.dashboard.cards.activeProjects, val: "8", desc: t.dashboard.cards.currentlyActive, icon: CheckCircle2, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
                      { label: t.dashboard.cards.atRisk, val: "2", desc: t.dashboard.cards.atRiskSoon, icon: AlertTriangle, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
                      { label: t.dashboard.cards.delayed, val: "1", desc: t.dashboard.cards.delayedSoon, icon: Clock, color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400" },
                    ].map((card, i) => (
                      <div key={i} className="bento-card !p-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${card.color}`}>
                          <card.icon className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{card.label}</p>
                        <p className="text-3xl font-bold mb-2">{card.val}</p>
                        <p className="text-[10px] text-zinc-500 leading-tight font-medium">{card.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Activities Section */}
                  <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-bento overflow-hidden">
                    <div className="p-8 border-b border-zinc-100 dark:border-zinc-800">
                      <h3 className="text-xl font-bold mb-8">Recent Activities & Tasks</h3>
                      <div className="flex gap-10 border-b border-zinc-100 dark:border-zinc-800">
                        {[
                          { id: 'tasks', label: t.dashboard.tabs.tasks },
                          { id: 'notifications', label: t.dashboard.tabs.notifications },
                          { id: 'news', label: t.dashboard.tabs.news },
                        ].map((tab) => (
                          <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-600'}`}
                          >
                            {tab.label}
                            {activeTab === tab.id && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-16 text-center text-zinc-400">
                      <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 opacity-20" />
                      </div>
                      <p className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No Tasks for Today</p>
                      <p className="text-zinc-500">You're all caught up! No pending tasks at the moment.</p>
                    </div>
                  </div>

                  {/* Risk Analysis Chart */}
                  <div className="bento-card !p-8">
                    <div className="flex items-center justify-between mb-10">
                      <div>
                        <h3 className="text-xl font-bold">{t.dashboard.charts.risk}</h3>
                        <p className="text-sm text-zinc-400 font-medium">{t.dashboard.charts.byCategory}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-zinc-400" />
                      </div>
                    </div>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Right Column (Profile & Calendar) */}
                <div className="space-y-8">
                  {/* Profile Card */}
                  <div className="bento-card !p-8 text-center">
                    <div className="relative inline-block mb-6">
                      <div className="w-24 h-24 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto border-2 border-emerald-100 dark:border-emerald-800/50">
                        <Users className="w-12 h-12 text-emerald-600" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-zinc-900" />
                    </div>
                    <h3 className="font-bold text-xl mb-1">{t.dashboard.profile.admin}</h3>
                    <p className="text-sm text-zinc-400 font-medium mb-8">Strategic Performance Director</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-start border border-zinc-100 dark:border-zinc-800/50">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t.dashboard.profile.projects}</p>
                        <p className="text-sm font-bold">12 {t.dashboard.profile.active}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 text-start border border-zinc-100 dark:border-zinc-800/50">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t.dashboard.profile.joined}</p>
                        <p className="text-sm font-bold">Feb 2026</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-start">
                      <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Email</p>
                        <p className="text-xs font-bold truncate">strategyadmin@empower.com</p>
                      </div>
                      <div className="p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{t.dashboard.profile.lastActivity}</p>
                        <p className="text-xs font-bold">Active Now</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Overview Chart */}
                  <div className="bento-card !p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">{t.dashboard.charts.status}</h3>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{t.dashboard.charts.distribution}</p>
                      </div>
                    </div>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 space-y-2">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                            <span className="text-zinc-500 font-medium">{item.name}</span>
                          </div>
                          <span className="font-bold">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calendar Mock */}
                  <div className="bento-card !p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-sm font-bold">Calendar</h3>
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><ChevronRight className={`w-4 h-4 ${isRtl ? '' : 'rotate-180'} text-zinc-400`} /></button>
                        <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"><ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''} text-zinc-400`} /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-[10px] font-bold text-zinc-400 mb-3">{d}</div>
                      ))}
                      {Array.from({ length: 31 }).map((_, i) => (
                        <div key={i} className={`text-[10px] p-2.5 rounded-xl transition-all cursor-pointer ${i + 1 === 1 ? 'bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-900/20' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [theme, lang]);

  const toggleLang = () => setLang(lang === 'en' ? 'ar' : 'en');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Restore session on load
  useEffect(() => {
    if (getToken()) {
      api.auth.me()
        .then(setUser)
        .catch(() => { setToken(null); });
    }
  }, []);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    try {
      const { token, user } = await api.auth.signin({
        email: (form.elements.namedItem('email') as HTMLInputElement).value,
        password: (form.elements.namedItem('password') as HTMLInputElement).value,
      });
      setToken(token);
      setUser(user);
      setIsSignInOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    try {
      const { token, user } = await api.auth.signup({
        firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
        lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
        email: (form.elements.namedItem('email') as HTMLInputElement).value,
        password: (form.elements.namedItem('password') as HTMLInputElement).value,
        company: (form.elements.namedItem('company') as HTMLInputElement).value,
      });
      setToken(token);
      setUser(user);
      setIsSignUpOpen(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await api.auth.signout().catch(() => {});
    setToken(null);
    setUser(null);
  };

  if (user) {
    return <Dashboard lang={lang} t={t} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} toggleLang={toggleLang} user={user} onUpdateUser={setUser} />;
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-100 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      
      {/* --- Navbar --- */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">FocusIn</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium hover:text-emerald-600 transition-colors">{t.nav.features}</a>
            <a href="#about" className="text-sm font-medium hover:text-emerald-600 transition-colors">{t.nav.about}</a>
            <a href="#vision" className="text-sm font-medium hover:text-emerald-600 transition-colors">{t.nav.vision}</a>
            <a href="#contact" className="text-sm font-medium hover:text-emerald-600 transition-colors">{t.nav.contact}</a>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={toggleLang} className="flex items-center gap-1.5 text-sm font-medium hover:text-emerald-600">
              <Globe className="w-4 h-4" />
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            <button 
              onClick={() => setIsSignInOpen(true)}
              className="hidden sm:block text-sm font-semibold hover:text-emerald-600 transition-colors"
            >
              {t.nav.signIn}
            </button>
            <button 
              onClick={() => setIsSignUpOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              {t.nav.getStarted}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: lang === 'en' ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 mb-6">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">{t.hero.badge}</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 text-zinc-900 dark:text-white">
                {t.hero.title}
              </h1>
              <p className="text-xl font-medium text-emerald-600 dark:text-emerald-400 mb-4">
                {t.hero.subtitle}
              </p>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 max-w-lg leading-relaxed">
                {t.hero.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button 
                  onClick={() => setIsSignUpOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:-translate-y-1"
                >
                  {t.hero.cta}
                  <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className="flex flex-wrap gap-6">
                {t.hero.trust.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <DashboardPreview lang={lang} t={t} />
              
              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Strategy Aligned</p>
                    <p className="text-[10px] text-zinc-500">100% Dept. Coverage</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Comparison Section --- */}
      <section className="py-24 border-y border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                {lang === 'en' ? 'Why Organizations are Leaving Excel' : 'لماذا تغادر المنظمات إكسل؟'}
              </h2>
              <div className="space-y-6">
                {[
                  { 
                    old: lang === 'en' ? 'Manual Data Entry' : 'إدخال البيانات يدوياً', 
                    new: lang === 'en' ? 'Automated KPI Sync' : 'مزامنة آليّة للمؤشرات',
                    icon: BarChart3 
                  },
                  { 
                    old: lang === 'en' ? 'Fragmented Reports' : 'تقارير مشتتة', 
                    new: lang === 'en' ? 'Unified Strategy Map' : 'خارطة استراتيجية موحدة',
                    icon: Target 
                  },
                  { 
                    old: lang === 'en' ? 'Delayed Insights' : 'رؤى متأخرة', 
                    new: lang === 'en' ? 'Real-time Governance' : 'حوكمة فورية',
                    icon: Eye 
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                    <div className="flex-1 text-right">
                      <p className="text-sm text-zinc-400 line-through">{item.old}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-emerald-600">{item.new}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-600 rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
              <h3 className="text-2xl font-bold mb-4 relative z-10">
                {lang === 'en' ? 'Ready to Elevate Your Governance?' : 'هل أنت مستعد لرفع مستوى الحوكمة لديك؟'}
              </h3>
              <p className="text-emerald-100 mb-8 relative z-10 leading-relaxed">
                {lang === 'en' 
                  ? 'Join leading government entities and enterprises that have already transitioned to a data-driven strategic culture.' 
                  : 'انضم إلى الجهات الحكومية والشركات الرائدة التي انتقلت بالفعل إلى ثقافة استراتيجية قائمة على البيانات.'}
              </p>
              <button 
                onClick={() => setIsSignUpOpen(true)}
                className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all hover:scale-105 active:scale-95 relative z-10"
              >
                {t.hero.cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t.features.title}</h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">{t.features.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {t.features.items.map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bento-card !p-8 group"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${item.color} border border-white/10`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- About Section --- */}
      <section id="about" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t.about.title}</h2>
          <p className="text-xl font-medium text-emerald-600 dark:text-emerald-400 mb-6">{t.about.subtitle}</p>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            {t.about.description}
          </p>
        </div>
      </section>

      {/* --- Vision & Mission Section --- */}
      <section id="vision" className="py-24 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bento-card !p-10 flex gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-800/50">
                <Target className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">{t.visionMission.mission.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{t.visionMission.mission.desc}</p>
              </div>
            </div>
            <div className="bento-card !p-10 flex gap-6 group">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0 border border-purple-100 dark:border-purple-800/50">
                <Eye className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">{t.visionMission.vision.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{t.visionMission.vision.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Contact Section --- */}
      <section id="contact" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{t.contact.title}</h2>
            <p className="text-zinc-600 dark:text-zinc-400">{t.contact.subtitle}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 bento-card !p-8 lg:!p-12">
              <h3 className="text-2xl font-bold mb-8">{t.contact.form.title}</h3>
              <form className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">{t.contact.form.name}</label>
                  <input type="text" placeholder={t.contact.form.placeholders.name} className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">{t.contact.form.email}</label>
                  <input type="email" placeholder={t.contact.form.placeholders.email} className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">{t.contact.form.org}</label>
                  <input type="text" placeholder={t.contact.form.placeholders.org} className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">{t.contact.form.subject}</label>
                  <input type="text" placeholder={t.contact.form.placeholders.subject} className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-2">{t.contact.form.message}</label>
                  <textarea rows={4} placeholder={t.contact.form.placeholders.message} className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
                </div>
                <div className="sm:col-span-2">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                    <Send className="w-5 h-5" />
                    {t.contact.form.send}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              {[
                { label: t.contact.info.email, val: "info@adawat.com.sa", icon: Mail, color: "bg-blue-50 text-blue-600" },
                { label: t.contact.info.whatsapp, val: "+966-53-736-9946", icon: Phone, color: "bg-emerald-50 text-emerald-600" },
                { label: t.contact.info.location, val: t.contact.info.address, icon: MapPin, color: "bg-purple-50 text-purple-600" },
              ].map((item, i) => (
                <div key={i} className="bento-card !p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color} border border-white/10`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{item.label}</p>
                    <p className="font-semibold">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-zinc-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">FocusIn</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {t.footer.desc}
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-emerald-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6">{t.footer.nav}</h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li><a href="#features" className="hover:text-white transition-colors">{t.nav.features}</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">{t.nav.about}</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">{t.nav.contact}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">{t.footer.legal}</h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">{t.footer.follow}</h4>
              <p className="text-sm text-zinc-400 mb-4">Stay updated with our latest features and news.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email" className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500 w-full" />
                <button className="bg-emerald-600 p-2 rounded-lg hover:bg-emerald-700 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col md:row justify-between items-center gap-4 text-sm text-zinc-500">
            <p>© 2025 FocusIn. {t.footer.rights}</p>
          </div>
        </div>
      </footer>

      {/* --- Modals --- */}
      <AnimatePresence>
        {isSignInOpen && (
          <Modal 
            isOpen={isSignInOpen} 
            onClose={() => setIsSignInOpen(false)}
            title={t.auth.signIn.title}
            subtitle={t.auth.signIn.subtitle}
            icon={Mail}
          >
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t.auth.signIn.email}</label>
                <input name="email" required type="email" placeholder="john@example.com" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t.auth.signIn.password}</label>
                <input name="password" required type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                {t.auth.signIn.btn}
              </button>
              <p className="text-center text-sm text-zinc-500">
                <button type="button" onClick={() => { setIsSignInOpen(false); setIsSignUpOpen(true); }} className="text-emerald-600 font-semibold hover:underline">
                  {t.auth.signIn.noAccount}
                </button>
              </p>
            </form>
          </Modal>
        )}

        {isSignUpOpen && (
          <Modal 
            isOpen={isSignUpOpen} 
            onClose={() => setIsSignUpOpen(false)}
            title={t.auth.signUp.title}
            subtitle={t.auth.signUp.subtitle}
            icon={Target}
          >
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t.auth.signUp.firstName}</label>
                  <input name="firstName" required type="text" placeholder="John" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">{t.auth.signUp.lastName}</label>
                  <input name="lastName" type="text" placeholder="Doe" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t.auth.signUp.email}</label>
                <input name="email" required type="email" placeholder="john@example.com" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t.auth.signUp.password}</label>
                <input name="password" required type="password" placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                <p className="text-[10px] text-zinc-500 mt-1">{t.auth.signUp.passwordHint}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">{t.auth.signUp.company}</label>
                <input name="company" required type="text" placeholder="Acme Inc" className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                {t.auth.signUp.btn}
              </button>
              <p className="text-center text-sm text-zinc-500">
                <button type="button" onClick={() => { setIsSignUpOpen(false); setIsSignInOpen(true); }} className="text-emerald-600 font-semibold hover:underline">
                  {t.auth.signUp.hasAccount}
                </button>
              </p>
            </form>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
