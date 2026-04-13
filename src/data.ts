export interface StatutoryCategory {
  id: string;
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  author?: string;
}

export interface PsychologistInfo {
  name: string;
  designation: string;
  qualifications: string;
  description: string;
  mou1Link: string;
  mou2Link: string;
}

export interface StatutoryLink {
  id: string;
  title: string;
  url: string;
  categoryId: string;
  sections?: {
    id: string;
    title: string;
    items: {
      idNo: string;
      type: string;
      description: string;
      value: string;
      isLink: boolean;
      isImage?: boolean; // Added support for inline image in table
    }[];
  }[];
  images?: string[]; // Array of base64 image strings
  customHeaders?: [string, string, string, string]; // Configurable table headers
}
export const initialCategories: StatutoryCategory[] = [
  { id: 'cat-1', name: 'GOVERNANCE' },
  { id: 'cat-2', name: 'COMMITTEES' },
  { id: 'cat-3', name: 'AFFILIATIONS / ACCREDITATIONS' },
  { id: 'cat-4', name: 'COMPLIANCE' }
];

export const initialData: StatutoryLink[] = [
  // Governance
  { 
    id: '1', 
    title: 'Mandatory Disclosure', 
    url: '/statutory/1', 
    categoryId: 'cat-1',
    sections: [
      {
        id: 'sec-1',
        title: '1. Basic Institutional Information',
        items: [
          { idNo: '', type: 'Emblem', description: '', value: '/logo.png', isLink: false, isImage: true },
          { idNo: '1.1', type: 'Name of the Institution', description: 'Institution Name', value: 'VISHNU INSTITUTE OF TECHNOLOGY (A)', isLink: false },
          { idNo: '1.2', type: 'Category & Type', description: 'Type', value: 'Private Affiliated & Autonomous Institution', isLink: false },
          { idNo: '1.3', type: 'Year of Establishment', description: 'Year', value: '2008', isLink: false },
          { idNo: '1.4', type: 'Institutional Address', description: 'Address', value: 'Vishnupur, Bhimavaram, West Godavari District, Andhra Pradesh Pin Code: 534202', isLink: false },
          { idNo: '1.5', type: 'Official Website URL', description: 'Website', value: 'https://vishnu.edu.in', isLink: true },
          { idNo: '1.6', type: 'Contact Details', description: 'Mail-id / Contact', value: 'info@vishnu.edu.in', isLink: false }
        ]
      },
      {
        id: 'sec-2',
        title: '2. Governance, Leadership, and Administration',
        items: [
          { idNo: '2.1', type: 'Governance Structure', description: 'Governance Structure', value: 'View', isLink: true },
          { idNo: '2.2', type: 'Governing Body', description: 'GB Composition', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Meeting Minutes', value: 'View', isLink: true },
          { idNo: '2.3', type: 'Statutory Committees', description: 'Academic Council', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Finance Committee', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Board of Studies-CE', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Board of Studies-ME', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Board of Studies-EEE', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Board of Studies-ECE', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Board of Studies-CSE', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Board of Studies-IT', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Board of Studies-BS', value: 'View', isLink: true },
          { idNo: '2.4', type: 'Key Functionaries', description: 'Chairman', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Vice-Chairman', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Secretary', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Principal', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Vice Principal', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'CE HOD', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'ME HOD', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'ECE HOD', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'CSE HOD', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'AI HOD', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'IT HOD', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'R&D Dean', value: 'View', isLink: true },
          { idNo: '2.5', type: 'Institutional Policies', description: 'Institutional Policies', value: 'View', isLink: true },
          { idNo: '2.6', type: 'Strategic / Institutional Development Plan', description: 'Strategic / Institutional Development Plan', value: 'View', isLink: true },
          { idNo: '2.7', type: 'Code of Conduct', description: 'Code of Conduct', value: 'View', isLink: true }
        ]
      },
      {
        id: 'sec-3',
        title: '3. Academic Programmes and Curriculum',
        items: [
          { idNo: '3.1', type: 'Programmes Offered', description: 'Programmes Offered', value: 'View', isLink: true },
          { idNo: '3.2', type: 'Curriculum Framework', description: 'Curriculum Framework', value: 'View', isLink: true },
          { idNo: '3.3', type: 'Academic Calendar', description: 'Academic Calendar', value: 'View', isLink: true },
          { idNo: '3.4', type: 'Innovative and Interdisciplinary Offerings', description: 'College Curriculum', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Institute Distinctiveness', value: 'View', isLink: true },
          { idNo: '3.5', type: 'Industry-Integrated Courses', description: 'NI Lab', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Drone Lab', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Alternative Energy Solutions (AES)', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'ATL Lab', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Special Labs', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'ARC Lab', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Innovations', value: 'View', isLink: true },
          { idNo: '3.6', type: 'Academic Partnerships', description: 'Academic Partnerships', value: 'View', isLink: true },
          { idNo: '3.7', type: 'Pedagogy and Learning Methodologies', description: 'Innovations-in-Teaching Learning', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'VEDIC', value: 'View', isLink: true },
          { idNo: '3.8', type: 'Student-Teacher Ratio', description: 'Student-Teacher Ratio', value: 'View', isLink: true }
        ]
      },
      {
        id: 'sec-4',
        title: '4. Faculty and Human Resources',
        items: [
          { idNo: '4.1', type: 'Faculty Profile', description: 'Faculty List', value: 'View', isLink: true },
          { idNo: '4.2', type: 'Visiting/ Adjunct/ Emeritus Professors', description: 'Faculty List', value: 'View', isLink: true },
          { idNo: '4.3', type: 'Recruitment Policy and Process', description: 'Careers', value: 'View', isLink: true },
          { idNo: '4.4', type: 'Professional Development', description: 'FDP', value: 'View', isLink: true },
          { idNo: '4.5', type: 'Faculty Achievements', description: 'Faculty Achievement', value: 'View', isLink: true },
          { idNo: '4.6', type: 'Faculty Exchange and Sabbaticals', description: 'GSAC', value: 'View', isLink: true },
          { idNo: '4.7', type: 'Consultancy Assignments', description: 'Consultancy', value: 'View', isLink: true }
        ]
      },
      {
        id: 'sec-5',
        title: '5. Research, Innovation, and Extension',
        items: [
          { idNo: '5.1', type: 'Research Policy and Ethics', description: 'Research Policy', value: 'View', isLink: true },
          { idNo: '5.2', type: 'Research Supervisors and Scholars', description: 'Research Supervisors', value: 'View', isLink: true },
          { idNo: '5.3', type: 'Research Publications', description: 'Research Publications', value: 'View', isLink: true },
          { idNo: '5.4', type: 'Funded Projects', description: 'Funded Projects', value: 'View', isLink: true },
          { idNo: '5.5', type: 'Patents, Innovations, and Start-ups', description: 'Patents', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Innovations', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'IEDC', value: 'View', isLink: true },
          { idNo: '5.6', type: 'Centres of Excellence/ Research Chairs', description: 'ATL', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Research Centers', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Special Labs', value: 'View', isLink: true },
          { idNo: '5.7', type: 'Consultancy Services', description: 'Consultancy', value: 'View', isLink: true },
          { idNo: '5.8', type: 'Community Outreach and Extension', description: 'NSS', value: 'View', isLink: true },
          { idNo: '5.9', type: 'Research Infrastructure', description: 'Research Facilities', value: 'View', isLink: true },
          { idNo: '5.10', type: 'Intellectual Property & Innovation Cell', description: 'IIC', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Innovations', value: 'View', isLink: true }
        ]
      },
      {
        id: 'sec-6',
        title: '6. Student Admission, Support, and Progression',
        items: [
          { idNo: '6.1', type: 'Admission Policy and Process', description: 'Admission Procedure', value: 'View', isLink: true },
          { idNo: '6.2', type: 'Year-wise Admission Statistics', description: 'Admission Details', value: 'View', isLink: true },
          { idNo: '6.3', type: 'Fee Structure', description: 'Fee Structure', value: 'View', isLink: true },
          { idNo: '6.4', type: 'Scholarships and Financial Aid', description: 'Scholarships', value: 'View', isLink: true },
          { idNo: '6.5', type: 'Student Demographics', description: 'Student Demographics', value: 'View', isLink: true },
          { idNo: '6.6', type: 'Mentoring and Counseling', description: 'Mentoring and Counseling', value: 'View', isLink: true },
          { idNo: '6.7', type: 'Student Grievance Redressal', description: 'Student Grievance Redressal', value: 'View', isLink: true },
          { idNo: '6.8', type: 'Anti-Ragging Measures', description: 'Anti-Ragging Measures', value: 'View', isLink: true },
          { idNo: '6.9', type: 'Alumni Network', description: 'Alumni Network', value: 'View', isLink: true },
          { idNo: '6.10', type: 'Student Achievements', description: 'ME Dept.', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'CE Dept.', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'EEE Dept.', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'ECE Dept.', value: 'View', isLink: true }
        ]
      },
      {
        id: 'sec-7',
        title: '7. Industry Linkages, Employability, and Career Development',
        items: [
          { idNo: '7.1', type: 'Training and Placement Cell', description: 'Placement Cell', value: 'View', isLink: true },
          { idNo: '7.2', type: 'Industry Partnerships', description: 'Industry Partnerships', value: 'View', isLink: true },
          { idNo: '7.3', type: 'Internship/ Apprenticeship Opportunities', description: 'Internship/ Apprenticeship Opportunities', value: 'View', isLink: true },
          { idNo: '7.4', type: 'Campus Recruitment Statistics', description: 'Campus Recruitment Statistics', value: 'View', isLink: true },
          { idNo: '7.5', type: 'Entrepreneurship & Start-Up Support', description: 'Entrepreneurship & Start-Up Support', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Patents', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Innovations', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'IEDC', value: 'View', isLink: true },
          { idNo: '7.6', type: 'Skill Development Initiatives', description: 'FDPs', value: 'View', isLink: true },
          { idNo: '7.7', type: 'Corporate Social Responsibility (CSR) Engagements', description: 'NSS', value: 'View', isLink: true },
          { idNo: '7.8', type: 'Professional Certification Programmes', description: 'Professional Certification Programmes', value: 'View', isLink: true }
        ]
      },
      {
        id: 'sec-8',
        title: '8. Internationalisation and Global Engagement',
        items: [
          { idNo: '8.1', type: 'Internationalisation Policy', description: 'Policies', value: 'View', isLink: true },
          { idNo: '8.2', type: 'MoUs / Agreements', description: 'MoUs', value: 'View', isLink: true },
          { idNo: '8.3', type: 'International Students', description: 'International Students', value: 'View', isLink: true },
          { idNo: '8.4', type: 'International Faculty/ Fellows', description: 'International Faculty/ Fellows', value: 'View', isLink: true },
          { idNo: '8.5', type: 'Joint / Dual / Cotutelle Programmes', description: 'Joint / Dual / Cotutelle Programmes', value: 'View', isLink: true },
          { idNo: '8.6', type: 'Global Research Collaborations', description: 'Publications', value: 'View', isLink: true },
          { idNo: '8.7', type: 'International Internships and Fellowships', description: 'International Internships and Fellowships', value: 'View', isLink: true },
          { idNo: '8.8', type: 'International Advisory Board', description: 'International Advisory Board', value: 'View', isLink: true },
          { idNo: '8.9', type: 'International Accreditations / Memberships', description: 'International Accreditations / Memberships', value: 'View', isLink: true },
          { idNo: '8.10', type: 'Global Alumni and Outreach', description: 'Global Alumni and Outreach', value: 'View', isLink: true }
        ]
      },
      {
        id: 'sec-9',
        title: '9. Infrastructure, Learning Resources, and Facilities',
        items: [
          { idNo: '9.1', type: 'Campus Land and Buildings', description: 'Campus Land and Buildings', value: 'View', isLink: true },
          { idNo: '9.2', type: 'Classrooms and Laboratories', description: 'Classrooms and Laboratories', value: 'View', isLink: true },
          { idNo: '9.3', type: 'Library and Learning Resources', description: 'Library and Learning Resources', value: 'View', isLink: true },
          { idNo: '9.4', type: 'ICT and Digital Infrastructure', description: 'ICT and Digital Infrastructure', value: 'View', isLink: true },
          { idNo: '9.5', type: 'Hostels, Canteens, Transport', description: 'Hostels, Canteens', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'Transport', value: 'View', isLink: true },
          { idNo: '9.6', type: 'Health and Wellness', description: 'Health and Wellness', value: 'View', isLink: true },
          { idNo: '9.7', type: 'Sports, Cultural and Recreation', description: 'Sports, Cultural and Recreation', value: 'View', isLink: true },
          { idNo: '9.8', type: 'Safety, Security, and Disaster Management', description: 'Safety, Security, and Disaster Management', value: 'View', isLink: true },
          { idNo: '9.9', type: 'Environmental Sustainability', description: 'Environmental Sustainability', value: 'View', isLink: true },
          { idNo: '9.10', type: 'Barrier-Free and Inclusive Access', description: 'Barrier-Free and Inclusive Access', value: 'View', isLink: true }
        ]
      },
      {
        id: 'sec-10',
        title: '10. Finance and Audit',
        items: [
          { idNo: '10.1', type: 'Annual Budget', description: 'Annual Budget', value: 'View', isLink: true },
          { idNo: '10.2', type: 'Audited Financial Statements', description: 'Audited Financial Statements', value: 'View', isLink: true },
          { idNo: '10.3', type: 'Sources of Income', description: 'Sources of Income', value: 'View', isLink: true },
          { idNo: '10.4', type: 'Endowments and Corpus Funds', description: 'Endowments and Corpus Funds', value: 'View', isLink: true },
          { idNo: '10.5', type: 'Procurement and Purchase Policy', description: 'Procurement and Purchase', value: 'View', isLink: true },
          { idNo: '10.6', type: 'Utilisation Certificates', description: 'Utilisation Certificates', value: 'View', isLink: true }
        ]
      },
      {
        id: 'sec-11',
        title: '11. Quality Assurance and Accreditation',
        items: [
          { idNo: '11.1', type: 'Internal Quality Assurance Cell (IQAC)', description: 'IQAC', value: 'View', isLink: true },
          { idNo: '11.2', type: 'NAAC /NBA Accreditation Status', description: 'NAAC', value: 'View', isLink: true },
          { idNo: '', type: '', description: 'NBA', value: 'View', isLink: true },
          { idNo: '11.3', type: 'NIRF / State Rankings', description: 'NIRF', value: 'View', isLink: true },
          { idNo: '11.4', type: 'Academic and Administrative Audit', description: 'AAC', value: 'View', isLink: true },
          { idNo: '11.5', type: 'Annual Quality Assurance Reports (AQAR)', description: 'AQAR Reports', value: 'View', isLink: true },
          { idNo: '11.6', type: 'Institutional Best Practices', description: 'Best Practices', value: 'View', isLink: true },
          { idNo: '11.7', type: 'Feedback Mechanisms', description: 'Feedback Mechanisms', value: 'View', isLink: true }
        ]
      },
      {
        id: 'sec-12',
        title: '12. Statutory and Public Disclosure Compliance',
        items: [
          { idNo: '12.1', type: 'Grievance Redressal Committee', description: 'GR Committee', value: 'View', isLink: true },
          { idNo: '12.2', type: 'Internal Complaints Committee (ICC)', description: 'ICC Committee', value: 'View', isLink: true },
          { idNo: '12.3', type: 'Anti-Ragging Committee', description: 'AR Committee', value: 'View', isLink: true },
          { idNo: '12.4', type: 'RTI Information', description: 'RTI', value: 'View', isLink: true },
          { idNo: '12.5', type: 'Ombudsperson / Student Grievance Portal', description: 'GRC', value: 'View', isLink: true },
          { idNo: '12.6', type: 'Annual Reports', description: 'Annual reports', value: 'View', isLink: true },
          { idNo: '12.7', type: 'Disclosure Update Protocol', description: 'Disclosure Update Protocol', value: 'View', isLink: true }
        ]
      },
      {
        id: 'sec-13',
        title: '13. Continuous Improvement and Future Directions',
        items: [
          { idNo: '13.1', type: 'Institutional Performance Indicators', description: 'Institutional Performance Indicators', value: 'View', isLink: true },
          { idNo: '13.2', type: 'Strategic Priorities (Next 5 Years)', description: 'Strategic Priorities (Next 5 Years)', value: 'View', isLink: true },
          { idNo: '13.3', type: 'Stakeholder Engagement Framework', description: 'Stakeholder Engagement Framework', value: 'View', isLink: true },
          { idNo: '13.4', type: 'Vision for 2047', description: 'Vision for 2047', value: 'View', isLink: true }
        ]
      }
    ]
  },
  { id: '2', title: 'Policies & Procedures', url: '#', categoryId: 'cat-1' },
  { id: '3', title: 'Governing Body', url: '#', categoryId: 'cat-1' },
  { id: '4', title: 'Academic Council', url: '#', categoryId: 'cat-1' },
  { id: '5', title: 'Board of Studies', url: '#', categoryId: 'cat-1' },
  { id: '6', title: 'Finance Committee', url: '#', categoryId: 'cat-1' },
  { id: '7', title: 'Institutional Strategic Plan', url: '#', categoryId: 'cat-1' },
  { id: '8', title: 'Psychologist', url: '#', categoryId: 'cat-1' },
  
  // Committees
  { id: '10', title: 'IQAC Committee', url: '#', categoryId: 'cat-2' },
  { id: '11', title: 'Planning and Evaluation', url: '#', categoryId: 'cat-2' },
  { id: '12', title: 'Grievance Redressal', url: '#', categoryId: 'cat-2' },
  { id: '13', title: 'Examination Committee', url: '#', categoryId: 'cat-2' },
  { id: '14', title: 'Admission Committee', url: '#', categoryId: 'cat-2' },
  { id: '15', title: 'Library Committee', url: '#', categoryId: 'cat-2' },
  { id: '16', title: 'Student Welfare Committee', url: '#', categoryId: 'cat-2' },
  { id: '17', title: 'Sexual Harassment Cell', url: '#', categoryId: 'cat-2' },
  { id: '18', title: 'Anti-Ragging Committee', url: '#', categoryId: 'cat-2' },
  { id: '19', title: 'Research and Development', url: '#', categoryId: 'cat-2' },
  { id: '19a', title: 'Career Guidance Committee', url: '#', categoryId: 'cat-2' },
  { id: '19b', title: 'Innovation and Entrepreneurship Development', url: '#', categoryId: 'cat-2' },
  { id: '19c', title: 'Institute Innovation Council (IIC)', url: '#', categoryId: 'cat-2' },
  { id: '19d', title: 'NSS Committee', url: '#', categoryId: 'cat-2' },

  // Affiliations
  { id: '20', title: 'AICTE EOA', url: '#', categoryId: 'cat-3' },
  { id: '21', title: 'NAAC Accreditation', url: '#', categoryId: 'cat-3' },
  { id: '22', title: 'NBA Accreditation', url: '#', categoryId: 'cat-3' },
  { id: '23', title: 'UGC and JNTUK Autonomous', url: '#', categoryId: 'cat-3' },
  { id: '24', title: 'JNTUK Permanent Affiliation', url: '#', categoryId: 'cat-3' },

  // Compliance
  { id: '30', title: 'Land Documents', url: '#', categoryId: 'cat-4' },
  { id: '31', title: 'Land Usage Certificate', url: '#', categoryId: 'cat-4' },
  { id: '32', title: 'Land Conversion Certificate', url: '#', categoryId: 'cat-4' },
  { id: '33', title: 'Building Plans', url: '#', categoryId: 'cat-4' },
  { id: '34', title: 'Building Photos', url: '#', categoryId: 'cat-4' },
  { id: '35', title: 'Fire Certificate', url: '#', categoryId: 'cat-4' },
  { id: '36', title: 'Structural Stability Certificate', url: '#', categoryId: 'cat-4' },
  { id: '37', title: 'Public Self Disclosure', url: '#', categoryId: 'cat-4' },
  { id: '38', title: 'UGC 2F and 12B', url: '#', categoryId: 'cat-4' }
];
