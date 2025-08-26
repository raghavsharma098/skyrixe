export function getPathName() {
  const path = window.location.href;
  const pathArray = path.split("/");
  const pathname = pathArray[pathArray.length - 1];
  return pathname;
}

export function convertTimeFormat(startDate, endDate) {
  // console.log(startDate,endDate)
  function formatTime(time) {
    let [hours, minutes] = time?.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
  }

  const startTimeFormatted = formatTime(startDate);
  const endTimeFormatted = formatTime(endDate);

  return `${startTimeFormatted} - ${endTimeFormatted}`;
}


export function formatDate(inputDate) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const [year, month, day] = inputDate.split("-");
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

// Utility function to add a product to the recently viewed list

export const addToRecentlyViewed = (product) => {
  try {
    // Get existing recently viewed products from localStorage
    const existingRecentlyViewed = JSON.parse(
      localStorage.getItem('LennyRecentlyViewed') || '[]'
    );

    // Remove the product if it already exists (to avoid duplicates)
    const filteredProducts = existingRecentlyViewed.filter(
      item => item._id !== product._id
    );

    // Add the new product to the beginning of the array
    const updatedRecentlyViewed = [product, ...filteredProducts];

    // Keep only the last 10 products
    const limitedRecentlyViewed = updatedRecentlyViewed.slice(0, 10);

    // Save back to localStorage
    localStorage.setItem('LennyRecentlyViewed', JSON.stringify(limitedRecentlyViewed));

    return limitedRecentlyViewed;
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
    return [];
  }
};

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem('LennyRecentlyViewed') || '[]');
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem('LennyRecentlyViewed');
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
  }
};