export interface RoleOption {
  title: string;
  category: string;
}

export const ROLES: RoleOption[] = [
  // Tech / Engineering
  { title: "Software Engineer", category: "Tech" },
  { title: "Senior Software Engineer", category: "Tech" },
  { title: "Staff Software Engineer", category: "Tech" },
  { title: "Frontend Engineer", category: "Tech" },
  { title: "Backend Engineer", category: "Tech" },
  { title: "Full Stack Engineer", category: "Tech" },
  { title: "Mobile Engineer (iOS)", category: "Tech" },
  { title: "Mobile Engineer (Android)", category: "Tech" },
  { title: "DevOps Engineer", category: "Tech" },
  { title: "Site Reliability Engineer", category: "Tech" },
  { title: "Platform Engineer", category: "Tech" },
  { title: "Cloud Engineer", category: "Tech" },
  { title: "Security Engineer", category: "Tech" },
  { title: "QA Engineer", category: "Tech" },
  { title: "Automation Engineer", category: "Tech" },
  { title: "Embedded Engineer", category: "Tech" },
  { title: "Engineering Manager", category: "Tech" },
  { title: "Director of Engineering", category: "Tech" },
  { title: "VP of Engineering", category: "Tech" },
  { title: "CTO", category: "Tech" },
  { title: "Solutions Architect", category: "Tech" },
  { title: "Systems Architect", category: "Tech" },
  { title: "IT Support Specialist", category: "Tech" },
  { title: "Network Engineer", category: "Tech" },
  { title: "Database Administrator", category: "Tech" },

  // Data
  { title: "Data Analyst", category: "Data" },
  { title: "Senior Data Analyst", category: "Data" },
  { title: "Data Scientist", category: "Data" },
  { title: "Senior Data Scientist", category: "Data" },
  { title: "Data Engineer", category: "Data" },
  { title: "Analytics Engineer", category: "Data" },
  { title: "Machine Learning Engineer", category: "Data" },
  { title: "AI Researcher", category: "Data" },
  { title: "Business Intelligence Analyst", category: "Data" },
  { title: "Data Architect", category: "Data" },

  // Product
  { title: "Product Manager", category: "Product" },
  { title: "Senior Product Manager", category: "Product" },
  { title: "Group Product Manager", category: "Product" },
  { title: "Director of Product", category: "Product" },
  { title: "VP of Product", category: "Product" },
  { title: "Chief Product Officer", category: "Product" },
  { title: "Product Owner", category: "Product" },
  { title: "Technical Product Manager", category: "Product" },
  { title: "Product Operations Manager", category: "Product" },
  { title: "Product Analyst", category: "Product" },

  // Design
  { title: "Product Designer", category: "Design" },
  { title: "UX Designer", category: "Design" },
  { title: "UI Designer", category: "Design" },
  { title: "UX Researcher", category: "Design" },
  { title: "Graphic Designer", category: "Design" },
  { title: "Brand Designer", category: "Design" },
  { title: "Design Lead", category: "Design" },
  { title: "Head of Design", category: "Design" },
  { title: "Design Systems Designer", category: "Design" },

  // Marketing
  { title: "Marketing Manager", category: "Marketing" },
  { title: "Senior Marketing Manager", category: "Marketing" },
  { title: "Product Marketing Manager", category: "Marketing" },
  { title: "Growth Marketing Manager", category: "Marketing" },
  { title: "Performance Marketing Manager", category: "Marketing" },
  { title: "Content Marketing Manager", category: "Marketing" },
  { title: "SEO Specialist", category: "Marketing" },
  { title: "Social Media Manager", category: "Marketing" },
  { title: "Brand Manager", category: "Marketing" },
  { title: "Marketing Director", category: "Marketing" },
  { title: "VP of Marketing", category: "Marketing" },
  { title: "CMO", category: "Marketing" },
  { title: "Copywriter", category: "Marketing" },

  // Sales
  { title: "Sales Representative", category: "Sales" },
  { title: "Account Executive", category: "Sales" },
  { title: "Senior Account Executive", category: "Sales" },
  { title: "Sales Development Representative", category: "Sales" },
  { title: "Business Development Manager", category: "Sales" },
  { title: "Sales Manager", category: "Sales" },
  { title: "Regional Sales Director", category: "Sales" },
  { title: "VP of Sales", category: "Sales" },
  { title: "Solutions Engineer", category: "Sales" },
  { title: "Sales Engineer", category: "Sales" },

  // Customer Success / Support
  { title: "Customer Success Manager", category: "Customer Success" },
  { title: "Senior Customer Success Manager", category: "Customer Success" },
  { title: "Customer Support Specialist", category: "Customer Success" },
  { title: "Support Engineer", category: "Customer Success" },
  { title: "Implementation Manager", category: "Customer Success" },
  { title: "Head of Customer Success", category: "Customer Success" },

  // Operations
  { title: "Operations Manager", category: "Operations" },
  { title: "Business Operations Manager", category: "Operations" },
  { title: "Program Manager", category: "Operations" },
  { title: "Project Manager", category: "Operations" },
  { title: "Supply Chain Manager", category: "Operations" },
  { title: "Logistics Manager", category: "Operations" },
  { title: "Office Manager", category: "Operations" },
  { title: "Chief Operating Officer", category: "Operations" },

  // Finance
  { title: "Financial Analyst", category: "Finance" },
  { title: "Senior Financial Analyst", category: "Finance" },
  { title: "Accountant", category: "Finance" },
  { title: "Senior Accountant", category: "Finance" },
  { title: "Bookkeeper", category: "Finance" },
  { title: "Controller", category: "Finance" },
  { title: "Finance Manager", category: "Finance" },
  { title: "FP&A Manager", category: "Finance" },
  { title: "CFO", category: "Finance" },
  { title: "Investment Analyst", category: "Finance" },
  { title: "Auditor", category: "Finance" },

  // HR / People
  { title: "HR Generalist", category: "HR" },
  { title: "HR Business Partner", category: "HR" },
  { title: "Recruiter", category: "HR" },
  { title: "Technical Recruiter", category: "HR" },
  { title: "Talent Acquisition Manager", category: "HR" },
  { title: "People Operations Manager", category: "HR" },
  { title: "HR Director", category: "HR" },
  { title: "VP of People", category: "HR" },
  { title: "Compensation & Benefits Manager", category: "HR" },

  // Legal
  { title: "Legal Counsel", category: "Legal" },
  { title: "Paralegal", category: "Legal" },
  { title: "Compliance Officer", category: "Legal" },
  { title: "Contract Manager", category: "Legal" },
  { title: "General Counsel", category: "Legal" },

  // Other / General
  { title: "Executive Assistant", category: "Operations" },
  { title: "Administrative Assistant", category: "Operations" },
  { title: "Consultant", category: "Other" },
  { title: "Management Consultant", category: "Other" },
  { title: "Researcher", category: "Other" },
  { title: "Teacher / Instructor", category: "Other" },
  { title: "General Manager", category: "Other" },
  { title: "CEO / Founder", category: "Other" },
];

export function searchRoles(query: string, limit = 8): RoleOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ROLES.filter((r) => r.title.toLowerCase().includes(q)).slice(0, limit);
}
