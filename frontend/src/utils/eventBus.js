const eventBus = {
  on(event, handler) {
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  },

  emit(event, detail) {
    window.dispatchEvent(new CustomEvent(event, { detail }));
  },

  onBatch(events, handler, delay = 50) {
    let timer = null;
    const listeners = events.map((event) => {
      const fn = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(handler, delay);
      };
      window.addEventListener(event, fn);
      return { event, fn };
    });
    return () => {
      if (timer) clearTimeout(timer);
      listeners.forEach(({ event, fn }) => window.removeEventListener(event, fn));
    };
  },
};

export default eventBus;
