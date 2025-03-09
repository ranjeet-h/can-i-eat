const RECENTLY_VIEWED_KEY = 'recentlyViewed';
const MAX_RECENT_ITEMS = 4;
export const RECENTLY_VIEWED_UPDATED_EVENT = 'recentlyViewedUpdated';

// Get recently viewed product IDs from localStorage
export const getRecentlyViewedIds = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]');
  } catch (error) {
    console.error('Error parsing recently viewed products:', error);
    return [];
  }
};

// Add a product to recently viewed
export const addToRecentlyViewed = (productId: string): void => {
  try {
    // Get current list
    const currentList = getRecentlyViewedIds();
    
    // Remove the item if it already exists (to move it to the front)
    const filteredList = currentList.filter(id => id !== productId);
    
    // Add the new item to the beginning
    const newList = [productId, ...filteredList].slice(0, MAX_RECENT_ITEMS);
    
    // Save back to localStorage
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newList));
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent(RECENTLY_VIEWED_UPDATED_EVENT, { 
      detail: { ids: newList } 
    }));
  } catch (error) {
    console.error('Error adding product to recently viewed:', error);
  }
}; 