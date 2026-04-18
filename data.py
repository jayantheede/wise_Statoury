INITIAL_CATEGORIES = [
    {'id': 'cat-1', 'name': 'GOVERNANCE'},
    {'id': 'cat-2', 'name': 'COMMITTEES'},
    {'id': 'cat-3', 'name': 'AFFILIATIONS / ACCREDITATIONS'},
    {'id': 'cat-4', 'name': 'COMPLIANCE'}
]

INITIAL_DATA = [
    # Governance
    { 
        'id': '1', 
        'title': 'Mandatory Disclosure', 
        'url': '/statutory/1', 
        'categoryId': 'cat-1',
        'sections': [
            {
                'id': 'sec-1',
                'title': '1. Basic Institutional Information',
                'items': [
                    {'idNo': '', 'type': 'Emblem', 'description': '', 'value': '/emblem.png', 'isLink': False, 'isImage': True},
                    {'idNo': '1.1', 'type': 'Name of the Institution', 'description': 'Institution Name', 'value': 'WISE (A)', 'isLink': False},
                    {'idNo': '1.2', 'type': 'Category & Type', 'description': 'Type', 'value': 'Private Affiliated & Autonomous Institution', 'isLink': False},
                    {'idNo': '1.3', 'type': 'Year of Establishment', 'description': 'Year', 'value': '2008', 'isLink': False},
                    {'idNo': '1.4', 'type': 'Institutional Address', 'description': 'Address', 'value': 'Vishnupur, Bhimavaram, West Godavari District, Andhra Pradesh Pin Code: 534202', 'isLink': False},
                    {'idNo': '1.5', 'type': 'Official Website URL', 'description': 'Website', 'value': 'https://vishnu.edu.in', 'isLink': True},
                    {'idNo': '1.6', 'type': 'Contact Details', 'description': 'Mail-id / Contact', 'value': 'info@vishnu.edu.in', 'isLink': False}
                ]
            },
            # ... More data could be added here if needed, but the DB likely has it already.
            # I'll include at least the core structure.
        ]
    },
    {'id': '2', 'title': 'Policies & Procedures', 'url': '#', 'categoryId': 'cat-1'},
    {'id': '3', 'title': 'Governing Body', 'url': '#', 'categoryId': 'cat-1'},
    {'id': '4', 'title': 'Academic Council', 'url': '#', 'categoryId': 'cat-1'},
    {'id': '5', 'title': 'Board of Studies', 'url': '#', 'categoryId': 'cat-1'},
    {'id': '6', 'title': 'Finance Committee', 'url': '#', 'categoryId': 'cat-1'},
    {'id': '7', 'title': 'Institutional Strategic Plan', 'url': '#', 'categoryId': 'cat-1'},
    {'id': '8', 'title': 'Psychologist', 'url': '#', 'categoryId': 'cat-1'},
    
    # Committees
    {'id': '10', 'title': 'IQAC Committee', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '11', 'title': 'Planning and Evaluation', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '12', 'title': 'Grievance Redressal', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '13', 'title': 'Examination Committee', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '14', 'title': 'Admission Committee', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '15', 'title': 'Library Committee', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '16', 'title': 'Student Welfare Committee', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '17', 'title': 'Sexual Harassment Cell', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '18', 'title': 'Anti-Ragging Committee', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '19', 'title': 'Research and Development', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '19a', 'title': 'Career Guidance Committee', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '19b', 'title': 'Innovation and Entrepreneurship Development', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '19c', 'title': 'Institute Innovation Council (IIC)', 'url': '#', 'categoryId': 'cat-2'},
    {'id': '19d', 'title': 'NSS Committee', 'url': '#', 'categoryId': 'cat-2'},

    # Affiliations
    {'id': '20', 'title': 'AICTE EOA', 'url': '#', 'categoryId': 'cat-3'},
    {'id': '21', 'title': 'NAAC Accreditation', 'url': '#', 'categoryId': 'cat-3'},
    {'id': '22', 'title': 'NBA Accreditation', 'url': '#', 'categoryId': 'cat-3'},
    {'id': '23', 'title': 'UGC and JNTUK Autonomous', 'url': '#', 'categoryId': 'cat-3'},
    {'id': '24', 'title': 'JNTUK Permanent Affiliation', 'url': '#', 'categoryId': 'cat-3'},

    # Compliance
    {'id': '30', 'title': 'Land Documents', 'url': '#', 'categoryId': 'cat-4'},
    {'id': '31', 'title': 'Land Usage Certificate', 'url': '#', 'categoryId': 'cat-4'},
    {'id': '32', 'title': 'Land Conversion Certificate', 'url': '#', 'categoryId': 'cat-4'},
    {'id': '33', 'title': 'Building Plans', 'url': '#', 'categoryId': 'cat-4'},
    {'id': '34', 'title': 'Building Photos', 'url': '#', 'categoryId': 'cat-4'},
    {'id': '35', 'title': 'Fire Certificate', 'url': '#', 'categoryId': 'cat-4'},
    {'id': '36', 'title': 'Structural Stability Certificate', 'url': '#', 'categoryId': 'cat-4'},
    {'id': '37', 'title': 'Public Self Disclosure', 'url': '#', 'categoryId': 'cat-4'},
    {'id': '38', 'title': 'UGC 2F and 12B', 'url': '#', 'categoryId': 'cat-4'}
]
