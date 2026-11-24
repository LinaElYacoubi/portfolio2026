<<<<<<< HEAD
// All the words on the site live here.
// Anything starting with "TODO" is a placeholder for Lina to fill in. The site hides it until then.

export const isFilled = (s?: string) => !!s && !s.startsWith("TODO");

export const profile = {
  name: "Lina El Yacoubi",
  school: "University of Ottawa",
  degree: "BASc in Software Engineering (Co-op)",
  graduation: "December 2027",
  email: "lelya062@uottawa.ca",
  linkedin: "https://www.linkedin.com/in/lina-el-yacoubi-961166295/",
  github: "https://github.com/LinaElYacoubi",
  resumeFile: "/resume.pdf",
  resumeName: "Lina-El-Yacoubi-Resume.pdf",
};

export type Link = { label: string; href: string };


/* ---------------------------------------------------------------- Experience */

export type Job = {
  id: string;
  look: "holo" | "code" | "data" | "compact";
  role: string;
  org: string;
  period: string;
  intro?: string;
  points: string[];
  tech: string[];
  stats?: { value: number; prefix?: string; suffix: string; label: string }[];
};

export const experience: Job[] = [
  {
    id: "innova",
    look: "holo",
    role: "Digital Navigator",
    org: "University of Ottawa Library · INNOVA",
    period: "Sep. 2026 – now",
    intro: "INNOVA is uOttawa's emerging tech space, with a holographic display, a 360° cylinder display and VR.",
    points: [
      "Developed 2 Unity/C# experiences for the 360° cylinder display: a tsunami/earthquake simulation and a memory game. Adapted them to the display, made the graphics more realistic and demoed them to 50+ visitors, including deans and vice-deans.",
      "Co-developing the INNOVA Movement Atlas (TypeScript, Three.js, MediaPipe), which tracks a visitor's body by webcam and highlights the working muscles in real time. Built the first elbow-movement module with a kinesiology expert.",
      "Write bilingual guides for INNOVA's rooms and technologies, and walk visitors through the equipment in English and French.",
    ],
    tech: ["Unity", "C#", "TypeScript", "JavaScript", "Three.js", "MediaPipe"],
  },
  {
    id: "cdel",
    look: "code",
    role: "Software Developer Co-op",
    org: "University of Ottawa · Co-op Office",
    period: "May – Aug. 2026",
    intro: "Four months building the university's internal apps, from the screens students use to the database behind them.",
    points: [
      "Built features for a C# ASP.NET Core Blazor app (Razor, MudBlazor) used by uOttawa students, including team feedback, task assignment, peer evaluations and an embedded course with quizzes. Shipped to production through GitLab.",
      "Developed full-stack features in the co-op office's VB.NET Web Forms job-offer system, including automated offer-deadline emails and a report that automates staff follow-ups with students.",
      "Maintained Azure Data Factory pipelines and updated Power BI dashboards, tracing data issues in SQL Server with T-SQL.",
    ],
    tech: ["C#", "ASP.NET Core", "Blazor", "Razor", "MudBlazor", "VB.NET", "Web Forms", "SQL Server", "T-SQL", "Azure Data Factory", "Power BI", "GitLab"],
  },
  {
    id: "nordion",
    look: "data",
    role: "Data Analysis & Project Management Co-op",
    org: "Nordion Inc.",
    period: "Jan. – Apr. 2025 · Sep. – Dec. 2025",
    intro: "Over two terms, I moved engineering data from 100+ separate files into one database and automated the reports.",
    points: [
      "Consolidated 100+ Bill of Materials files into SQL Server, cutting data retrieval time from hours to under 10 minutes.",
      "Automated Power BI reporting with DAX, Power Query, Python and SSIS, saving 5+ hours of manual updates per month.",
      "Built KPI dashboards with SQL and REST APIs, and automated SharePoint workflows with Power Automate and Power Apps.",
    ],
    tech: ["SQL Server", "SSMS", "Python", "Power BI", "DAX", "Power Query", "SSIS", "REST APIs", "SharePoint", "Power Automate", "Power Apps"],
    stats: [
      { value: 100, suffix: "+", label: "BOM files in one database" },
      { value: 10, prefix: "<", suffix: " min", label: "to find data (used to take hours)" },
      { value: 5, suffix: "+ h", label: "of manual updates saved monthly" },
    ],
  },
  {
    id: "it",
    look: "compact",
    role: "Assistant IT Technician",
    org: "University of Ottawa · Faculty of Engineering",
    period: "Sep. – Dec. 2024 · Jan. – Apr. 2026",
    points: [
      "Resolved 30+ TopDesk tickets on software, account access, network and device issues for students and staff.",
      "Reimaged and configured Windows, macOS and Ubuntu machines, including BIOS setup, OS installation and hardware checks.",
      "Supported Active Directory and Microsoft 365 accounts, ran PowerShell system checks and maintained Confluence documentation.",
    ],
    tech: ["TopDesk", "Active Directory", "Microsoft 365", "PowerShell", "Confluence"],
  },
  {
    id: "web",
    look: "compact",
    role: "Web Developer Co-op",
    org: "University of Ottawa · Teaching and Learning Support Service",
    period: "May – Aug. 2024",
    points: [
      "Built 10+ accessible (WCAG) Brightspace pages from UI/UX specs using HTML, CSS, JavaScript and a component toolkit.",
      "Maintained content across WordPress and Brightspace, including course materials, multimedia assets and documentation.",
    ],
    tech: ["HTML/CSS", "JavaScript", "Brightspace", "WordPress", "WCAG"],
  },
];

/* ---------------------------------------------------------------- Projects */

export type Project = {
  id: string;
  name: string;
  kicker: string;
  tagline: string;
  when: string;
  status?: string;
  role: string;
  summary: string;
  tech: string[];
  links: Link[];
  media: { src: string; alt: string; caption: string }[];
};

export const projects: Project[] = [
  {
    id: "airchestra",
    name: "Airchestra",
    kicker: "Hand tracking · Music",
    tagline: "Play music by moving your hands in the air.",
    when: "",
    role: "",
    summary:
      "A webcam instrument. Your right hand picks the note and your left hand sets the volume. It also works with a mouse, and it's set up for demos on INNOVA's holographic display.",
    tech: ["JavaScript", "MediaPipe", "Web Audio API", "HTML Canvas", "Vite"],
    links: [
      { label: "Live demo", href: "https://airchestra.netlify.app/" },
      { label: "GitHub", href: "https://github.com/LinaElYacoubi/Invisible-orchestra" },
    ],
    media: [
      { src: "/media/airchestra-welcome.webp", alt: "Airchestra welcome screen: 'Make music with your hands' next to a demo of two labelled hands over coloured note bands.", caption: "Welcome screen" },
      { src: "/media/airchestra-play.webp", alt: "Airchestra free play: eleven note bands with the A band highlighted and a large 'Now playing A' readout.", caption: "Free play" },
    ],
  },
  {
    id: "squishy",
    name: "Squishy's Playground",
    kicker: "3D game · Hand tracking",
    tagline: "A jelly pet you grab, throw and feed without touching anything.",
    when: "",
    role: "",
    summary:
      "A touch-free 3D game for INNOVA's 4K holographic display. Visitors pinch in the air to grab, throw and feed a jelly creature. Two people can play at once, and there are 3 mini-games.",
    tech: ["TypeScript", "Three.js", "MediaPipe", "Vite", "Vitest"],
    links: [
      { label: "Live demo", href: "https://squishybites.netlify.app/" },
      { label: "GitHub", href: "https://github.com/LinaElYacoubi/Squishy-playground" },
    ],
    media: [
      { src: "/media/squishy-free-play.webp", alt: "Squishy, a glossy pink jelly creature with a happy face, next to a tray with a strawberry, a butter cube and a blueberry.", caption: "Free play" },
      { src: "/media/squishy-mini-me.webp", alt: "Three small Squishies in pink, lilac and rose after splitting.", caption: "Mini me mode" },
    ],
  },
];

export const otherProjects = [
  { name: "Weather Dashboard", kind: "React · Recharts", note: "Solo project. Interactive weather charts built with sample data, not live data.", href: "https://interactiveweatherdashboard.netlify.app/", image: "/media/weather-dashboard.webp", repo: "https://github.com/LinaElYacoubi/Dashboard" },
  { name: "Tutor+", kind: "React · team", note: "I built the session booking interface and the booking and profile confirmation pages.", href: "https://alaekabir.github.io/Site-de-Services/", image: "/media/tutor-plus.webp", repo: "https://github.com/alaekabir/Site-de-Services" },
  { name: "Memory Card Game", kind: "React · team", note: "I built the screen for picking the difficulty and theme, and connected it to the game.", href: "https://alaekabir.github.io/Jeu-de-Memoire/", image: "/media/memory-card-game.webp", repo: "https://github.com/alaekabir/Jeu-de-Memoire" },
  { name: "Custom Vibes", kind: "React · team", note: "A demo shop for personalizing mugs, tote bags and t-shirts.", href: "https://loquacious-cassata-e9187e.netlify.app/", image: "/media/custom-vibes.webp", repo: "https://github.com/LinaElYacoubi/SiteDeCommerce" },
];

/* ---------------------------------------------------------------- Skills */

export const skills = [
  { title: "Languages", items: ["C#", "VB.NET", "Python", "JavaScript", "TypeScript", "SQL", "C", "PHP", "PowerShell", "Java"] },
  { title: "Web & frameworks", items: ["ASP.NET Core", "Blazor", "Razor", "MudBlazor", "Web Forms", "React", "HTML/CSS", "Tailwind CSS", "WordPress"] },
  { title: "Data", items: ["SQL Server/SSMS", "T-SQL", "SQLite", "Azure Data Factory", "SSIS", "Power BI", "DAX", "Power Query"] },
  { title: "Interactive & 3D", items: ["Unity", "Three.js", "WebGL", "MediaPipe", "Web Audio API", "HTML Canvas", "GSAP", "Figma"] },
  { title: "Tools & platforms", items: ["Git", "GitHub", "GitLab", "Docker", "Vite", "Node.js/npm", "Visual Studio", "VS Code", "Android Studio", "Jira", "Confluence", "SharePoint", "Power Automate", "Power Apps", "Active Directory", "Netlify"] },
  { title: "Practices & spoken", items: ["Agile/Scrum", "Accessibility (WCAG)", "English", "French"] },
];


export const education = {
  school: "University of Ottawa",
  degree: "BASc in Software Engineering (Co-op)",
  period: "Sep. 2023 – Dec. 2027",
  note: "Dean's Honour List",
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
=======
// Canonical portfolio content. Evidence and open questions: CONTENT_REVIEW.md.
export const profile = {
 name: "Lina El Yacoubi", title: "Software engineering student", location: "Ottawa, Canada",
 email: "lelya062@uottawa.ca", linkedin: "https://www.linkedin.com/in/lina-el-yacoubi-961166295/",
 github: "https://github.com/LinaElYacoubi", resumeFile: "/Lina-El-Yacoubi-Resume.pdf",
};
// Skills verified in the resume skills list, work entries and projects.
export const skills = [
 {id:"languages", title:"Languages", items:["C#", "VB.NET", "Java", "Python", "C", "JavaScript", "TypeScript", "SQL", "XML"]},
 {id:"web", title:"Web development", items:["ASP.NET Core", "Blazor", "Razor", "MudBlazor", "React", "HTML", "CSS", "PHP", "WordPress"]},
 {id:"data", title:"Data & databases", items:["SQL Server", "T-SQL", "PostgreSQL", "SQLite", "Azure Data Factory", "Azure Pipelines", "Power BI", "Power Query", "DAX", "SSIS", "SQL Server Management Studio"]},
 {id:"testing", title:"Testing", items:["JUnit", "PyTest", "XUnit", "Regression testing", "API testing", "Database testing", "Unit testing", "Data validation"]},
 {id:"tools", title:"Tools & platforms", items:["Git", "GitLab", "GitHub", "Visual Studio", "VS Code", "Azure DevOps", "Jira", "Confluence", "Power Automate", "Power Apps", "SharePoint", "Figma", "PowerShell", "Microsoft 365", "Netlify", "TopDesk", "Active Directory", "Google Sites", "Android Studio", "Arduino"]},
 {id:"practices", title:"Methods & systems", items:["Agile", "Scrum", "Version control", "REST APIs", "ETL", "Web accessibility", "Windows", "macOS", "Ubuntu"]},
];
export const experience = [
 {id:"uottawa-software", role:"Software Developer Co-op", organization:"University of Ottawa", period:"May – Aug. 2026",
 description:"I worked on internal web applications using C# and Blazor, adding forms and evaluation workflows and fixing bugs in existing code. I also investigated issues in the data used by the applications and reports.",
 detail:"That included changing ETL logic in Azure Data Factory, checking data with T-SQL and running regression tests. I used Git and GitLab to manage changes in the shared codebase.",
 tech:["C#", "ASP.NET Core", "Blazor", "MudBlazor", "SQL Server", "Azure Data Factory"]},
 {id:"nordion", role:"Data Analysis & Project Management Co-op", organization:"Nordion Inc.", period:"Jan. – Apr. 2025 · Sep. – Dec. 2025",
 description:"Engineering data was spread across separate Bill of Materials files. I built a SQL Server database to bring it together, then automated dashboard updates and created reports for budgets, resources and project timelines.",
 detail:"The reports combined database queries with data from internal REST APIs. I also used Power Automate and Power Apps to automate SharePoint workflows and reporting.",
 tech:["SQL Server", "DAX", "Power Query", "Python", "SSIS", "REST APIs"],
 stats:[{value:"100+", label:"files consolidated"},{value:"< 10 min",label:"retrieval, down from hours"},{value:"5+ hours",label:"manual updates saved monthly"}]},
 {id:"uottawa-it",role:"Assistant IT Technician",organization:"University of Ottawa",period:"Sep. – Dec. 2024 · Jan. – Apr. 2026",
 description:"I helped university users with software, login, network and device problems through TopDesk. I also reimaged and set up computers running Windows, macOS and Ubuntu, and supported Active Directory and Microsoft 365.",
 tech:["TopDesk", "Active Directory", "PowerShell"]},
 {id:"uottawa-web",role:"Web Developer Co-op",organization:"University of Ottawa",period:"May – Aug. 2024",
 description:"I built accessible web pages with HTML, CSS, JavaScript and PHP, and cleaned up page code to improve loading performance. I also kept university website and course content up to date.",
 tech:["HTML", "CSS", "JavaScript", "PHP", "WordPress"]},
];
export const projects = [
 {id:"weather-dashboard",name:"Weather Dashboard",category:"Data visualization",team:"Solo project",
 description:"An interactive weather dashboard that brings charts and weather statistics together.",
 contribution:"I built the dashboard independently.",tech:["React","JavaScript","Recharts","Bootstrap"],
 demo:"https://interactiveweatherdashboard.netlify.app/",image:"/images/weather-dashboard-cover.png",
 alt:"Editorial paper collage of a golden sun, clouds, rain and flowing wind over a landscape."},
 {id:"custom-vibes",name:"Custom Vibes",category:"Product customization",team:"",
 description:"A storefront demo for personalizing mugs, tote bags and t-shirts.",
 contribution:null,tech:["React","JavaScript","HTML","CSS"],
 demo:"https://loquacious-cassata-e9187e.netlify.app/",image:"/images/custom-vibes-cover.png",
 alt:"Editorial paper collage of a mug, tote bag and folded fabric with decorative botanical shapes."},
 {id:"tutor-plus",name:"Tutor+",category:"Learning & connection",team:"Team project",
 description:"A tutoring website with tutor discovery and a session-booking interface.",
 contribution:"I built the session-booking interface and the booking and profile confirmation pages.",tech:["React","JavaScript","React Bootstrap"],
 demo:"https://alaekabir.github.io/Site-de-Services/",image:"/images/tutor-plus-cover.png",
 alt:"Editorial paper collage of open books and two chairs around a shared study table."},
 {id:"memory-game",name:"Memory Card Game",category:"Interactive play",team:"Team project",
 description:"A matching game where you flip cards and find pairs.",
 contribution:"I built the difficulty and theme selection screen and connected it to the game.",tech:["React","JavaScript","Bootstrap"],
 demo:"https://alaekabir.github.io/Jeu-de-Memoire/",image:"/images/memory-card-game-cover.png",
 alt:"Editorial paper collage of scattered playing cards with matching sun and flower motifs."},
];
export const nav = [{label:"About",href:"#about"},{label:"Experience",href:"#experience"},{label:"Projects",href:"#projects"},{label:"Contact",href:"#contact"}];
>>>>>>> 087cf6fe8bbda4100b2b3fbbd35750ce2f0635b6
