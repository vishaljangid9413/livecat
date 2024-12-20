export function formatDate(dateString:string) {
    // Create a new Date object from the provided date string
    const date = new Date(dateString);

    // Define an array for month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    // Extract the day, month, and year
    const day = date.getDate();
    const month = monthNames[date.getMonth()]; // getMonth() returns a zero-based index (0 = January)
    const year = date.getFullYear();

    // Construct the formatted string
    const formattedDate = `${day} ${month}, ${year}`;
    
    return formattedDate;
}

export function formatTime(timeString: string) {
    // Split the input time string (e.g., "12:12:00") into hours, minutes, and seconds
    const [hourString, minuteString] = timeString.split(':');
    
    // Convert the hour and minute strings to numbers
    let hours = parseInt(hourString, 10);
    const minutes = minuteString.padStart(2, '0'); // Ensure minutes are always 2 digits
    
    // Determine AM/PM and adjust hours for 12-hour format
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Adjust '0' to '12' for 12-hour format
    
    // Construct the formatted time string
    const formattedTime = `${hours}:${minutes} ${ampm}`;
    
    return formattedTime;
}

