// Notification Types
type TypesObject = { success: object, alert: object, info: object, error: object };
const TYPES: TypesObject = {
  success: {
    type: 'success'
  },
  alert: {
    type: 'alert'
  },
  info: {
    type: 'info',
  },
  error: {
    type: 'error'
  }
};

export { TYPES };
