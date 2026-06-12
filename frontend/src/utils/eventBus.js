const eventBus = {
  on(event, handler) {
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  },
  emit(event, detail) {
    window.dispatchEvent(new CustomEvent(event, { detail }));
  },
};

export default eventBus;
