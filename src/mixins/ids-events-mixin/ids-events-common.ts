/**
 * Returns an event's "base" event without it's namespace
 * @param {string} fullEventName the full event name
 * @returns {string} the base event name
 */
export function getEventBaseName(fullEventName: string): string {
  return fullEventName.split('.')[0];
}
