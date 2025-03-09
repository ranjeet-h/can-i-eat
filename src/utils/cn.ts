import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility for conditionally joining Tailwind CSS classes
 * that properly handles Tailwind's JIT and merges classes
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', !isActive && 'bg-gray-500')
 * // => 'px-4 py-2 bg-blue-500' or 'px-4 py-2 bg-gray-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A more convenient way to use the 'cn' utility when you're passing classnames in JSX
 * 
 * @example
 * <div className={cx({
 *   'flex items-center': true,
 *   'bg-blue-500': isPrimary,
 *   'bg-gray-500': !isPrimary,
 *   'p-4': size === 'large',
 *   'p-2': size === 'small',
 * })}>
 *   Content
 * </div>
 */
export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default cn; 