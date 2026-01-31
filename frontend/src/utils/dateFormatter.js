export const formatDate = (targetDate)=>{
   const year = targetDate.getFullYear()
   const month = targetDate.getMonth()+1
   const day = targetDate.getDate()
   const formattedDate = `${year}-${(month).toString().padStart(2, "0")}-${(day).toString().padStart(2,"0")}`
   return formattedDate
}
