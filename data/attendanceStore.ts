export type LeaveRecord = { 
    id: number;
    from: string; // in DD/MM/YYYY format
    to: string;   // in DD/MM/YYYY format
    reason: string;
  };
  
  let leaves: LeaveRecord[] = [];
  
  /* ---------- ADD leave ---------- */
  export const addLeave = (leave: Omit<LeaveRecord, 'id'>) => {
    leaves.push({
      id: Date.now(),
      ...leave,
    });
  };
  
  /* ---------- GET all leaves ---------- */
  export const getLeaves = () => {
    return leaves;
  };
  
  /* ---------- Count leave days ---------- */
  export const getLeaveDaysCount = () => {
    let count = 0;
  
    leaves.forEach(l => {
      // Parse DD/MM/YYYY manually
      const [d1, m1, y1] = l.from.split('/').map(Number);
      const [d2, m2, y2] = l.to.split('/').map(Number);
  
      const fromDate = new Date(y1, m1 - 1, d1); // month is 0-indexed
      const toDate = new Date(y2, m2 - 1, d2);
  
      // Calculate difference in days, inclusive
      const diff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      count += diff;
    });
  
    return count;
  };
  