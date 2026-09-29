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
