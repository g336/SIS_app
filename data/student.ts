export type Student = {
  enrollment: string;
  password: string;
  name: string;
  email: string;
  rollNo: string;
  department: string;
  year: string;
  documents: {
    id: number;
    title: string;
    link: string;
  }[];
};

export const students: Record<string, Student> = {
  divya01: {
    enrollment: 'divya01',
    password: 'mypassword',
    name: 'Divya Mehta',
    email: 'Divya012@gmail.com',
    rollNo: '202302100410007',
    department: 'Computer Engineering',
    year: '3rd Year',
    documents: [
      { id: 1, title: 'Sem 1 Marksheet', link: 'https://drive.google.com/file/d/1bQqwWX7a_qYWL7Xkc-IDF05ZyTke6Ep9/view' },
      { id: 2, title: 'Sem 2 Marksheet', link: 'https://drive.google.com/file/d/1ZtgCfATBPZrojuYbOOCP4J_gboP2ZCEQ/view' },
      { id: 3, title: 'Sem 3 Marksheet', link: 'https://drive.google.com/file/d/1kHLZhYQo4yYKogpTWwMRO025CIpfkW_o/view' },
    ],
  },

  mithil02: {
    enrollment: 'mithil02',
    password: 'mithil123',
    name: 'Mithil Pujary',
    email: 'mithil123@gmail.com',
    rollNo: '202302100410010',
    department: 'Computer Engineering',
    year: '3rd Year',
    documents: [
      { id: 1, title: 'Sem 1 Marksheet', link: 'https://drive.google.com/file/d/1ZtgCfATBPZrojuYbOOCP4J_gboP2ZCEQ/view' },
      { id: 2, title: 'Sem 2 Marksheet', link: 'https://drive.google.com/file/d/1kHLZhYQo4yYKogpTWwMRO025CIpfkW_o/view' },
      { id: 3, title: 'Sem 3 Marksheet', link: 'https://drive.google.com/file/d/1ZtgCfATBPZrojuYbOOCP4J_gboP2ZCEQ/view' },      
    ],
  },

  rahul03: {
    enrollment: 'jay03', // key matches enrollment now
    password: 'jay@321',
    name: 'Jay Khernar',
    email: 'jay321@gmail.com',
    rollNo: '202302100410129',
    department: 'Computer Engineering',
    year: '2nd Year',
    documents: [
      { id: 1, title: 'Sem 1 Marksheet', link: 'https://drive.google.com/file/d/1ZtgCfATBPZrojuYbOOCP4J_gboP2ZCEQ/view' },
      { id: 2, title: 'Sem 2 Marksheet', link: 'https://drive.google.com/file/d/1kHLZhYQo4yYKogpTWwMRO025CIpfkW_o/view' },
      { id: 3, title: 'Sem 3 Marksheet', link: 'https://drive.google.com/file/d/1ZtgCfATBPZrojuYbOOCP4J_gboP2ZCEQ/view' },
    ],
  },
};
