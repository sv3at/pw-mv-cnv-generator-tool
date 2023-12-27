import { format, formatDistanceToNow } from 'date-fns';
declare global {var reportDateTime: string}
globalThis.reportDateTime = getDate("yyyy-MM-dd HH-mm");


export function getDate(formatt){
    // var date = Date.now()
    // let dateString = (moment(date)).format('yyyy-MM-DD HH-mm-ss')
    const formattedDate = format(new Date(), formatt);
    // console.log(`The date is ${formattedDate}.`);
    return formattedDate;  
  }
  