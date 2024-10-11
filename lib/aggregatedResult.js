

export const aggregateResults = (rows)=>{
  const result = rows.reduce(
  (acc, row) => {
    const course = row.courses;
    const attachments = row.attachments;
    const chapters = row.chapters;
    if (!acc[course.id]) {
      acc[course.id] = { course, attachments: [],chapters:[] };
    }
    if (attachments) {
      acc[course.id].attachments.push(attachments);
    }
    if(chapters){
      acc[course.id].chapters.push(chapters);
    }
    return acc;
  },
  {}
);
return result
}


export const aggregateResultsForStream = (rows)=>{
  const result = rows.reduce(
  (acc, row) => {
    const course = row.courses;
    const attachments = row.attachments;
    const chapters = row.chapters;
    const categories = row.categories;
    const purchases = row.purchases
    if (!acc[course.id]) {
      acc[course.id] = { course, attachments: [],chapters:[],categories,purchases};
    }
    if (attachments) {
      acc[course.id].attachments.push(attachments);
    }
    if(chapters){
      acc[course.id].chapters.push(chapters);
    }
    return acc;
  },
  {}
);
return result
}


